import { SuggestionOverlay } from "./suggestion-overlay.js";
import { TranslationSuggestion } from "./translation-suggestion.js";

const translations = [];
let translationSuggestions = [];

function activate() {
    /** @type {HTMLTextAreaElement} */
    const element = document.getElementById('ai-type-target');
    if (!element) {
        console.error(`Could not find the element with ID ${aiTypeTargetId}`);
    }

    let suggestionOverlay = new SuggestionOverlay(element);
    let timeout = undefined;

    element.addEventListener('click', (ev) => {
        suggestionOverlay.cancel();
    });

    element.addEventListener('keydown', (ev) => {
        if (ev.ctrlKey && ev.key === ' ') {
            ev.preventDefault();
            if (!suggestionOverlay.isActive()) {
                suggestionOverlay.activate(() => autocomplete(element));
            }
        } else if (suggestionOverlay.isActive() && ev.key === 'Tab') {
            ev.preventDefault();

            if (suggestionOverlay.isReady()) {
                suggestionOverlay.accept();
            }
        } else {
            suggestionOverlay.cancel();

            clearTimeout(timeout);
            timeout = setTimeout(() => {
                fetchTranslation(element);
            }, 1000);
        }

        element.addEventListener('input', () => {
            suggestTranslations(element);
        });
    });
}

async function fetchTranslation(textAreaElement) {
    if (textAreaElement.value === '') {
        return;
    }

    const origin = document.location.origin;
    const response = await fetch(`${origin}/api/translate`, {
        body: JSON.stringify({
            text: textAreaElement.value,
        }),
        headers: {
            ['Content-Type']: 'application/json',
        },
        method: 'POST',
    });

    let translation;

    let text = await response.text();
    if (!text.endsWith('}') && !text.endsWith(']')) {
        text += '}';
    }

    try {
        translation = JSON.parse(text);
    } catch {
        console.log(`Invalid JSON string: ${text}`);
        return;
    }

    console.log(translation);

    if (translation.original && translation.english) {
        if (translation.original === translation.english) {
            return;
        }

        if (Array.isArray(translation)) {
            translations.push([...translation]);
        } else {
            translations.push(translation);
        }
        suggestTranslations(textAreaElement);
    }
}

function suggestTranslations(textAreaElement) {
    for (const suggestion of translationSuggestions) {
        suggestion.dispose();
    }

    translationSuggestions = [];
    const value = textAreaElement.value;

    for (let i = translations.length - 1; i >= 0; i--) {
        const { original, english } = translations[i];
        const charIndex = value.indexOf(original);
        if (charIndex < 0) {
            translations.splice(translations, i);
        } else {
            const suggestion = new TranslationSuggestion(textAreaElement, charIndex, original.length, english);
            translationSuggestions.push(suggestion);
        }
    }

    translationSuggestions.sort((a, b) => a.charStartIndex - b.charStartIndex);
    let currentEndIndex = -1;
    for (let i = 0; i < translationSuggestions.length; i++) {
        const suggestion = translationSuggestions[i];
        if (suggestion.charStartIndex > currentEndIndex) {
            currentEndIndex = suggestion.charStartIndex + suggestion.length;
            suggestion.activate();
        }
    }
}

async function autocomplete(textAreaElement) {
    const origin = document.location.origin;
    const response = await fetch(`${origin}/api/autocomplete`, {
        body: JSON.stringify({
            text: textAreaElement.value,
        }),
        headers: {
            ['Content-Type']: 'application/json',
        },
        method: 'POST',
    });

    const responseText = await response.text();
    console.log(responseText);
    return responseText;
}

activate();
