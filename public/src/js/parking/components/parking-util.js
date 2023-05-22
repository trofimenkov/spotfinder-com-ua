export const addElement = (tagName, text, className, parentElement) => {
    const element = document.createElement(tagName);
    element.innerText = text;
    element.classList.add(className);
    parentElement.appendChild(element);
};