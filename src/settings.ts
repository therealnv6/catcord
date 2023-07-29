import { PageApi, Window } from "@gluon-framework/gluon";
import { log } from "./util.ts";

// Define the type for a single settings node element
type SettingsNodeElement = {
  text: string;
  id: string;
};

// The initial settings data with a single element
let settings: SettingsNodeElement[] = [
  { text: "CatCord Setting", id: "cat-settings" },
];

/**
 * Hooks the settings into the IPC (Inter-Process Communication).
 * @param window - The browser window object.
 */
export function hookSettingsToIPC(window: Window) {
  // Log that we are hooking the settings into the IPC
  log("Hooking settings into the IPC");

  // Add the settings and version information to the IPC store config
  window.ipc.store.config = {
    ...window.ipc.store.config,
    settings: settings,
    version: "1.0.0",
  };

  // Log that the hooking process is done
  log("Done!");
}

/**
 * Updates the settings menu periodically.
 * @param page - The PageApi reference representing the web page.
 */
export function injectSettings(page: PageApi) {
  // Interval function that executes every 200 milliseconds
  setInterval(() => {
    // Function to be executed inside the page's context (assuming "page" is a valid reference)
    page.eval(() => {
      // Select the host element where CatCord information will be displayed
      const hostElement = document.querySelector<HTMLDivElement>(
        "nav > [class|=side] [class|=info]",
      );

      // If the host element is not found or if it already contains the version info, exit the function
      if (!hostElement || hostElement.querySelector("#cat-version")) {
        return;
      }

      // Get the CatCord settings and version from the IPC store config
      const { config } = (window as any).Gluon.ipc.store;
      const settingNodes: SettingsNodeElement[] = config.settings;
      const version: string = config.version;

      // Create a new span element to display the CatCord version
      const versionNode = hostElement.firstElementChild!.cloneNode(
        true,
      ) as HTMLSpanElement;

      versionNode.id = "cat-version";
      versionNode.textContent = `CatCord version: ${version}`;
      hostElement.append(versionNode);

      // Find the "advanced" settings element (assumed to be related to social links)
      let parent = document
        .querySelector('[class*="socialLinks-"]')!
        .parentElement!.querySelector('[class*="item"]'.repeat(10));

      // If the "advanced" settings element is not found, exit the function
      if (!parent) {
        return;
      }

      // Check if the next sibling of "advanced" is another settings element
      if (
        parent.nextSibling instanceof Element &&
        parent.nextSibling.className.includes("item")
      ) {
        // If yes, use the next sibling as the "advanced" element
        parent = parent.nextSibling;
      }

      // Create and insert CatCord settings elements
      settingNodes.forEach((node) => {
        const { text, id } = node;

        if (parent == null) {
          return;
        }

        // Create a new element to display CatCord settings
        const newNode = parent.cloneNode(
          true,
        ) as HTMLElement;

        newNode.textContent = text;
        newNode.id = id;
        newNode.onclick = () => {
          const className = "contentColumn-1C7as6";

          // find the class of the "inner" settings element
          const element = document.querySelector<HTMLDivElement>(
            `.${className}`,
          );

          // we will return early if the element was not found; this would be strange,
          // because how would you be able to see the button? anyways.
          if (element == null) {
            return;
          }

          // clear the inner HTML data of every child.
          // maybe it's possible to remove every child except for one
          // context: discord crashes if you clear all of the children (e.g. element.replaceChildren())
          for (const child of element.children) {
            child.innerHTML = "";
          }

          // TODO: write new content for the settings div
        };

        parent.insertAdjacentElement(
          "afterend",
          newNode,
        );
      });
    });
  }, 200);
}
