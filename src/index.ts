import { open, OpenOptions, PageApi } from '@gluon-framework/gluon';
import { updateTitleHandler } from './title.ts';

/**
 * Initializes the app by setting up the title update logic.
 * @param {PageApi} page - The PageApi object for the opened window.
 */
function initializeApp(page: PageApi): void {
  console.log(
    '[catcord] 🐱 welcome to catcord :3'
  );

  // hopefully I can find a better solution to this, as this takes some resources.
  // probably will make this a opt-out (not opt-in) feature in case you're running low-end hardware.
  setInterval(() => updateTitleHandler(page), 50);
}

/**
 * Opens a window with the provided URL and initializes the app.
 * @param {string} url - The URL of the window to open.
 */
async function openWindow(url: string): Promise<void> {
  const window = await open(url, {} as OpenOptions);

  initializeApp(window.page);
}

openWindow('https://discord.com/app');
