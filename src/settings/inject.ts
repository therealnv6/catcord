import { PageApi } from "@gluon-framework/gluon";
import { SettingsNodeElement } from "./shared.ts";

/**
 * Updates the settings menu periodically by injecting CatCord settings.
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
      const gluon = (window as any).Gluon;
      const { config } = gluon.ipc.store;

      const settingNodes: SettingsNodeElement[] = config.settingNodes;
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

      /**
       * Function to handle click event for a CatCord settings element.
       * @param node - The SettingsNodeElement representing the CatCord setting.
       * @param parent - The parent element to insert the new settings element after.
       */

      const handleClick = async (
        node: SettingsNodeElement,
        parent: Element,
      ) => {
        const { text, id } = node;

        if (parent == null) {
          return;
        }

        // Create a new element to display CatCord settings
        const newNode = parent.cloneNode(true) as HTMLElement;
        newNode.textContent = text;
        newNode.id = id;

        newNode.onclick = async () => {
          const className = "contentColumn-1C7as6";
          const allNodes = document.querySelectorAll(".selected-1sf9UK");

          // Deselect all nodes
          for (const node of allNodes) {
            node.setAttribute("aria-selected", "false");
            node.classList.remove("selected-1sf9UK");
          }

          // Select the clicked node
          newNode.setAttribute("aria-selected", "true");
          newNode.classList.add("selected-1sf9UK");

          const container = document.querySelector(`.${className}`);

          if (container == null) {
            return;
          }

          container.setAttribute("id", id);

          const child = container.children[0];
          container.replaceChildren();
          container.appendChild(child);

          async function updateInnerHTML() {
            child.innerHTML = await gluon.ipc.renderToString(id);
          }

          await updateInnerHTML();

          const buttons = child.querySelectorAll("button");

          for (const button of buttons) {
            const form = button.closest("form");

            button.addEventListener("click", async (event) => {
              event.preventDefault();

              if (form && !button.hasAttribute("id")) {
                const formData = new FormData(form);
                const serializedData = JSON.stringify(
                  Object.fromEntries(formData.entries()),
                );

                await gluon.ipc[form.getAttribute("id")!](
                  serializedData,
                );
              } else {
                await gluon.ipc[button.getAttribute("id")!]();
              }

              await updateInnerHTML();
            });
          }
        };

        parent.insertAdjacentElement("afterend", newNode);
      };

      // Inject CatCord settings elements into the page
      if (parent == null) {
        return;
      }

      settingNodes.forEach((node) => {
        handleClick(
          node,
          parent!, /*we already early return but typescript likes to cry*/
        );
      });
    });
  }, 200);
}
