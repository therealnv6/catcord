import { PageApi } from "@gluon-framework/gluon";

/**
 * Interface representing the CSS rules for elements.
 */
type ElementRules = {
  [selector: string]: {
    [property: string]: string;
  };
};

/**
 * Update the DOM elements with the defined CSS rules.
 * @param page - The PageApi object used for DOM manipulation.
 */
export function updateDOM(page: PageApi) {
  page.eval(applyRules);
}

/**
 * Apply the CSS rules to the DOM elements.
 */
function applyRules() {
  // Define the CSS rules for elements
  let rules: ElementRules = {
    "span": {
      "font-size": "16px",
      "color": "blue",
    },
  };

  // Apply rules to each tag
  for (const tag of Object.keys(rules)) {
    // Find elements with the given tag
    const elements = Array.from(document.getElementsByTagName(tag));

    // Apply rules to each element
    for (const element of elements) {
      if (!(element instanceof HTMLElement)) {
        continue;
      }

      // Apply individual CSS properties to the element
      for (
        const [
          property,
          value,
        ] of Object.entries(rules[tag])
      ) {
        element.style.setProperty(property, value);
      }
    }
  }
}
