import { getCursorPagePosition } from "./textarea-utils.js";

/** @type {HTMLDivElement} */
const typeBoxContainer = document.getElementById('ai-type-box-container');

/** @type {HTMLTemplateElement} */
const underlineTemplate = document.getElementById('ai-type-underline-template');

/** @type {HTMLTemplateElement} */
const translationTemplate = document.getElementById('ai-type-translation-template');

export class TranslationSuggestion {
    /**
     * 
     * @param {HTMLTextAreaElement} textAreaElement 
     * @param {number} charStartIndex 
     * @param {number} originalLength 
     * @param {string} english 
     */
    constructor(textAreaElement, charStartIndex, originalLength, english) {
        this.textAreaElement = textAreaElement;
        this.charStartIndex = charStartIndex;
        this.originalLength = originalLength;
        this.english = english;

        this.updateUiCallback = this.updateUi.bind(this);
        this.isActivated = false;
        this.translationContainer = null;
    }

    activate() {
        this.isActivated = true;
        this.textAreaElement.addEventListener('keyup', this.updateUiCallback);
        this.textAreaElement.addEventListener('click', this.updateUiCallback);
        this.ownedNodes = [];

        const { left: leftStart, top: topStart } = getCursorPagePosition(this.textAreaElement, typeBoxContainer, this.charStartIndex);
        const { left: leftEnd, top: topEnd } = getCursorPagePosition(this.textAreaElement, typeBoxContainer, this.charStartIndex + this.originalLength);

        const width = topStart != topEnd ? 30 : leftEnd - leftStart;
        const topOffset = 16;

        const underlineNode = underlineTemplate.content.cloneNode(true);
        const underline = underlineNode.querySelector('.ai-type-underline');
        underline.style.setProperty('left', `${leftStart}px`);
        underline.style.setProperty('top', `${topStart + topOffset}px`);
        underline.style.setProperty('width', `${width}px`);
        document.body.appendChild(underlineNode);

        this.ownedNodes.push(underline);
    }

    updateUi() {
        const currentCharIndex = this.textAreaElement.selectionStart;

        if (currentCharIndex >= this.charStartIndex && currentCharIndex <= this.charStartIndex + this.originalLength) {
            console.log('SHOWING TRANSLATION: ' + this.english);
            this.showTranslation();
        } else {
            this.hideTranslation();
        }
    }

    showTranslation() {
        if (this.translationContainer) {
            return;
        }

        const translationNode = translationTemplate.content.cloneNode(true);

        /** @type {HTMLDivElement} */
        this.translationContainer = translationNode.querySelector('.ai-type-translation-container');

        const { left, top } = getCursorPagePosition(this.textAreaElement, typeBoxContainer, this.charStartIndex);
        const topOffset = -32;

        this.translationContainer.style.setProperty('left', `${left}px`);
        this.translationContainer.style.setProperty('top', `${top + topOffset}px`);
        this.translationContainer.textContent = this.english;
        document.body.appendChild(translationNode);

        this.translationContainer.addEventListener('click', () => {
            const text = this.textAreaElement.value;
            const newText = text.slice(0, this.charStartIndex) + this.english + text.slice(this.charStartIndex + this.originalLength);
            this.textAreaElement.value = newText;
            this.dispose();
        });

        this.ownedNodes.push(this.translationContainer);
    }

    hideTranslation() {
        if (this.translationContainer === null) {
            return;
        }

        document.body.removeChild(this.translationContainer);
        const translationContainerIndex = this.ownedNodes.indexOf(this.translationContainer);

        if (translationContainerIndex !== -1) {
            this.ownedNodes.splice(translationContainerIndex, 1);
        }

        this.translationContainer = null;
    }

    dispose() {
        if (!this.isActivated) {
            return;
        }

        this.textAreaElement.removeEventListener('keyup', this.updateUiCallback);
        this.textAreaElement.removeEventListener('click', this.updateUiCallback);
        this.isActivated = false;

        for (const node of this.ownedNodes) {
            document.body.removeChild(node);
        }
    }
}
