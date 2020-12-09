/**
 * @param {String} el
 * @param {String} classNames
 * @param {HTMLElement} child
 * @param {HTMLElement} parent
 * @param  {...array} dataAttr
 */
// dataAttr = [['id', 'name'], ['data-key', 'key']]
export default function create(el, {
  className, child, parent, dataAttr,
}) {
  let element = null;
  try {
    element = document.createElement(el);
  } catch (error) {
    throw new Error('unable to create  HTMLElement! Give a proper tag name');
  }

  if (className) element.classList.add(...className.split(' '));

  if (child && Array.isArray(child)) {
    child.forEach((childElement) => {
      if (childElement && typeof childElement === 'string') {
        element.innerHTML = childElement;
      } else if (childElement) {
        element.appendChild(childElement);
      }
    });
  } else if (child && typeof child === 'object' && child !== null) {
    element.appendChild(child);
  } else if (child && typeof child === 'string') {
    element.innerHTML = child;
  }

  if (parent && parent !== null) {
    parent.appendChild(element);
  }

  if (dataAttr && dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
      if (attrValue === '') {
        element.setAttribute(attrValue, '');
      } else if (attrName.match(/value|id|placeholder|cols|rows|autocorrect|spellcheck|for|type|style|src|href|target/)) {
        element.setAttribute(attrName, attrValue);
      } else {
        element.dataset[attrName] = attrValue;
      }
    });
  }

  return element;
}
