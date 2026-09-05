/**
 * mador-map.js - Make Any DOm Reactive, map helper
 * @param {*} container DOM element, the parent on which the returned map fn will do its magic
 * @returns - Map function
 * @example -
 */
export default function (container) {
  const map = (element) => {
    const currentItems = new Map();
    return (items) => {
      if (!Array.isArray(items)) return;
      const newKeys = new Set(items.map((itm) => itm.key));
      for (const [key, node] of currentItems) {
        if (!newKeys.has(key)) {
          node?.remove();
          currentItems.delete(key);
        }
      }
      let nextNode = element.firstChild;
      items.forEach((itm) => {
        const key = itm.key;
        let node = currentItems.get(key);
        if (!node) {
          const itmHTML = itm.html;

          element.insertAdjacentHTML("beforeend", itmHTML);
          node = element.lastElementChild;
          if (!node) {
            throw new Error("Could not make array-item child node!");
          }

          currentItems.set(key, node);
        }
        if (!node.isConnected || node !== nextNode) {
          element.insertBefore(node, nextNode);
        } else {
          // existing node
          if (node.outerHTML?.trim() !== itm.html?.trim()) {
            const template = document.createElement("template");
            template.innerHTML = itm.html;
            const newNode = template.content.firstElementChild;
            node.replaceWith(newNode);
            currentItems.set(key, newNode);
            node = newNode;
          }
        }
        nextNode = node.nextSibling;
      });
    };
  };
  return map(container);
}
