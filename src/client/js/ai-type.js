import { SuggestionOverlay } from "./suggestion-overlay.js";

function activate() {
    /** @type {HTMLTextAreaElement} */
    const element = document.getElementById('ai-type-target');
    if (!element) {
        console.error(`Could not find the element with ID ${aiTypeTargetId}`);
    }

    let suggestionOverlay = new SuggestionOverlay(element);

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
        }
    });
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
