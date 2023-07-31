import { PageApi } from "@gluon-framework/gluon";
import { Window } from "@gluon-framework/gluon";

// Define the type for the titleUpdater object
interface TitleUpdater {
  title: string;
  updateTitle: (original: string) => void;
  getTitle: () => string;
}

/**
 * Handles updating the title based on the provided PageApi.
 * @param {Window} window - The browser window object.
 * @param {PageApi} page - The PageApi object to interact with the page.
 * @returns {Promise<void>} - A promise that resolves when the title is updated.
 */
export async function updateTitleHandler(
  window: Window,
  page: PageApi,
): Promise<void> {
  // Create the titleUpdater object
  let titleUpdater: TitleUpdater = {
    title: "",

    // Updates the title based on the original title obtained from the page.
    updateTitle(original: string): void {
      const updated = mapTitleFromOrigin(original);
      this.title = updated;
      updatePage(page, updated);
    },

    // Retrieves the current title.
    getTitle(): string {
      return this.title;
    },
  };

  // Define the window.ipc.updateTitle function to update the title
  window.ipc.updateTitle = async (title: string) => {
    titleUpdater!.updateTitle(title); // Using non-null assertion since titleUpdater is initialized here.
  };

  // Add an onclick event listener to update the title when the document is clicked
  page.eval(() => {
    const gluon = (window as any).Gluon;
    var target = document.querySelector("title");
    var config = {
      subtree: true,
      characterData: true,
      childList: true,
    };

    // create an observer instance
    var observer = new MutationObserver(() => {
      if (document.title.includes("catcord")) {
        return;
      }

      gluon.ipc.updateTitle(document.title);
    });

    if (target != undefined) {
      observer.observe(target, config);
    }
  });
}

/**
 * Updates the page title using the provided PageApi.
 * @param {PageApi} page - The PageApi object to interact with the page.
 * @param {string} newTitle - The new title to set.
 */
export function updatePage(page: PageApi, newTitle: string): void {
  page.title(newTitle);
}

/**
 * Maps the title obtained from the origin to a modified title.
 * @param {string} original - The original title obtained from the origin.
 * @returns {string} - The modified title.
 */
export function mapTitleFromOrigin(original: string): string {
  return original.replace("Discord", "catcord");
}
