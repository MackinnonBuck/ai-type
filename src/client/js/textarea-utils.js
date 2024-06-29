/**
 * 
 * @param {HTMLTextAreaElement} textarea 
 * @param {HTMLDivElement} container 
 */
export function getCursorPagePosition(textarea, container) {
    const mirroredEle = document.createElement('div');
    mirroredEle.classList.add('ai-type-box-mirror');
    mirroredEle.textContent = textarea.value;
    container.prepend(mirroredEle);

    const textareaStyles = window.getComputedStyle(textarea);
    [
        'border',
        'boxSizing',
        'fontFamily',
        'fontSize',
        'fontWeight',
        'letterSpacing',
        'lineHeight',
        'padding',
        'textDecoration',
        'textIndent',
        'textTransform',
        'whiteSpace',
        'wordSpacing',
        'wordWrap',
    ].forEach((property) => {
        mirroredEle.style[property] = textareaStyles[property];
    });

    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = textarea.value.substring(0, cursorPos);
    const textAfterCursor = textarea.value.substring(cursorPos);
    const pre = document.createTextNode(textBeforeCursor);
    const post = document.createTextNode(textAfterCursor);
    const caretEle = document.createElement('span');
    caretEle.innerHTML = '&nbsp;';

    mirroredEle.innerHTML = '';
    mirroredEle.append(pre, caretEle, post);

    const rect = caretEle.getBoundingClientRect();

    container.removeChild(mirroredEle);
    return { left: rect.left + window.scrollX, top: rect.top + window.scrollY };
}
