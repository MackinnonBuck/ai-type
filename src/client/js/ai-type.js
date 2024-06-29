const aiTypeTargetId = 'ai-type-target';
const origin = document.location.origin;

function activate() {
    const element = document.getElementById(aiTypeTargetId);
    if (!element) {
        console.error(`Could not find the element with ID ${aiTypeTargetId}`);
    }

    element.addEventListener('keydown', (ev) => {
        if (ev.ctrlKey && ev.key === ' ') {
            ev.preventDefault();
            attachSuggestionOverlay(element);
        }
    });
}

/**
 * 
 * @param {HTMLTextAreaElement} textAreaElement 
 */
async function attachSuggestionOverlay(textAreaElement) {
    // const overlay = document.createElement('div');
    // textAreaElement.addEventListener('')
    // const obj = {
    //     name: 'bob',
    //     age: 54,
    // };

    // JSON.stringify(obj);
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
}

activate();
