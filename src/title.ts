import { PageApi } from "@gluon-framework/gluon";

let titleUpdater: {
  title: string;
  updateTitle: (original: string) => void;
  getTitle: () => string;
} | undefined;

/**
 * Handles updating the title based on the provided PageApi.
 * @param {PageApi} page - The PageApi object to interact with the page.
 * @returns {Promise<void>} - A promise that resolves when the title is updated.
 */
export async function updateTitleHandler(page: PageApi): Promise<void> {
  if (titleUpdater == undefined) {
    titleUpdater = {
      title: "",
      /**
       * Updates the title based on the original title obtained from the page.
       * @param {string} original - The original title obtained from the page.
       */
      updateTitle(original: string): void {
        const updated = mapTitleFromOrigin(original);

        this.title = updated;
        updatePage(page, updated);
      },
      /**
       * Retrieves the current title.
       * @returns {string} - The current title.
       */
      getTitle(): string {
        return this.title;
      },
    };
  }

  const original = await page.eval(`document.title`);
  titleUpdater.updateTitle(original);
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
