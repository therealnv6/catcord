import { PageApi, Window } from "@gluon-framework/gluon";
import { log, LogLevel, settings } from "./util.ts";

/**
 * Interface representing the CSS rules for elements.
 */
type ElementRules = {
  [selector: string]: {
    [property: string]: string;
  };
};

/**
 * Fetches the theme configuration from an external URL and applies it to the DOM.
 * @param window - The Window object representing the browser window.
 */
export async function setupThemeConfig(window: Window) {
  log("Setting up theme");

  try {
    // Fetch the style from the specified URL.
    const response = await fetch(settings.themes);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch theme: ${response.status} - ${response.statusText}`,
      );
    }

    // Convert the response to text, which is the CSS style content.
    const style = await response.text();

    log("Retrieved theme");

    // Update the Gluon store with the fetched style.
    window.ipc.store.config = {
      ...window.ipc.store.config,
      style: style,
    };
  } catch (error: any) {
    // Handle errors that occurred during the fetch process.
    log(`Error fetching theme: ${error.message}`, LogLevel.ERROR);
  }

  // Initialize an empty object to hold the CSS rules for elements.
  // These rules will be applied later to the DOM elements.
  let rules: ElementRules = {
    "span": {
      // CSS rules for <span> elements can be defined here. (e.g. "color": "blue")
      // For now, we leave it empty until further notice.
    },
    // can possibly add more here...
  };

  // Set the fetched style and rules in the Gluon store.
  window.ipc.store.config = {
    ...window.ipc.store.config,
    rules: rules,
  };

  log("Wrote theme to IPC");
}

/**
 * Update the DOM elements with the defined CSS rules.
 * @param page - The PageApi object used for DOM manipulation.
 */
export function updateDOM(page: PageApi) {
  // Evaluate and execute the functions 'appendToDOM' and 'applyIndividualRules'
  // in the context of the provided PageApi object (page).
  // 'appendToDOM' adds the fetched style to the document's head,
  // and 'applyIndividualRules' applies the CSS rules to DOM elements.
  page.eval(appendToDOM);
  page.eval(applyIndividualRules);
}

/**
 * Apply the CSS rules to the DOM elements based on the configuration.
 */
function applyIndividualRules() {
  // Retrieve the configuration containing style and rules from the Gluon store.
  const { config } = (window as any).Gluon.ipc.store;
  let rules: ElementRules = config.rules;

  // Loop through each tag (selector) defined in the CSS rules.
  for (const tag of Object.keys(rules)) {
    // Find elements in the DOM with the given tag (selector).
    const elements = Array.from(document.getElementsByTagName(tag));

    // Apply rules to each element found.
    for (const element of elements) {
      // Ensure that the element is an instance of HTMLElement.
      // Some DOM elements may not be HTMLElements, so we skip those.
      if (!(element instanceof HTMLElement)) {
        continue;
      }

      // Apply individual CSS properties to the element.
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

/**
 * Asynchronously appends the fetched style to the DOM's head element.
 */
async function appendToDOM() {
  // 'Gluon' doesn't exist on window in normal types, so we have to cast window to 'any'.
  // Retrieve the configuration containing style from the Gluon store.
  const { config } = (window as any).Gluon.ipc.store;

  // Read the fetched style from the configuration.
  const style = config.style;

  // Create a new <style> element.
  const element = document.createElement("style");

  // Set the content of the <style> element to the fetched style.
  element.textContent = style;

  // Append the <style> element to the document's head.
  document.head.appendChild(element);
}
