import { getCursorPagePosition } from "./textarea-utils.js";

/** @typedef {(HTMLTextAreaElement) => Promise<string>} SuggestCallback */

/** @type {HTMLTemplateElement} */
const overlayTemplate = document.getElementById('ai-type-overlay-template');

/** @type {HTMLDivElement} */
const typeBoxContainer = document.getElementById('ai-type-box-container');

class Suggestion {
    /**
     * 
     * @param {SuggestCallback} suggestCallback 
     */
    constructor(position, suggestCallback) {
        /** @type {HTMLElement} */
        const overlayNode = overlayTemplate.content.cloneNode(true);
        const container = overlayNode.querySelector('.ai-type-overlay-container');
        container.style.setProperty('left', `${position.left}px`);
        container.style.setProperty('top', `${position.top}px`);
        document.body.appendChild(overlayNode);

        this.containerElement = container;
        this.indicatorElement = container.querySelector('.ai-type-tab-indicator');
        this.suggestionElement = container.querySelector('.ai-type-suggestion');
        this.suggestPromise = suggestCallback(this.textAreaElement);
        this.isReady = false;

        this.updateSuggestionWhenReady(this.suggestPromise);
    }

    async updateSuggestionWhenReady(suggestPromise) {
        this.result = await suggestPromise;
        this.isReady = true;

        this.indicatorElement.textContent = '(Tab)';
        this.suggestionElement.textContent = this.result;
    }

    dispose() {
        document.body.removeChild(this.containerElement);
    }
}

export class SuggestionOverlay {
    /**
     * 
     * @param {HTMLTextAreaElement} textAreaElement 
     */
    constructor(textAreaElement) {
        /** @type {Suggestion | null} */
        this.currentSuggestion = null;

        this.textAreaElement = textAreaElement;
    }

    isActive() {
        return this.currentSuggestion !== null;
    }

    isReady() {
        return this.currentSuggestion?.isReady;
    }

    /**
     * 
     * @param {SuggestCallback} suggestCallback 
     */
    async activate(suggestCallback) {
        const lineOffset = 16;

        this.cancel();

        const position = getCursorPagePosition(this.textAreaElement, typeBoxContainer);
        position.top += lineOffset;
        const suggestion = new Suggestion(position, suggestCallback);

        this.currentSuggestion?.dispose();
        this.currentSuggestion = suggestion;
    }

    accept() {
        if (!this.currentSuggestion?.isReady) {
            return;
        }

        this.textAreaElement.value += this.currentSuggestion.result;
        this.cancel();
    }

    cancel() {
        this.currentSuggestion?.dispose();
        this.currentSuggestion = null;
    }
}
