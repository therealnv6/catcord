import { open, OpenOptions, PageApi, Window } from "@gluon-framework/gluon";
import { updateTitleHandler } from "./title.ts";
import { setupThemeConfig, updateDOM } from "./theme.ts";
import { log, LogLevel } from "./util.ts";
import { hookSettingsToIPC, injectSettings } from "./settings.ts";

/**
 * Initializes the app by setting up the title update logic.
 * @param {Window} window - The Window object for the opened window.
 * @param {PageApi} page - The PageApi object for the opened window.
 */
function initializeApp(window: Window, page: PageApi): void {
  log("Welcome to catcord. Meow! 😺");

  setupThemeConfig(window);

  // setup the hook to IPC for settings
  hookSettingsToIPC(window);

  // inject the setting changes, this is a periodic event.
  injectSettings(page);

  // Update the title periodically
  setInterval(() => updateTitleHandler(page), 200);

  // Update the theme after 500 milliseconds - is this fine? I doubt it has to be updated periodically,
  // unless Discord will be in the pain in the ass and override the theme.
  setTimeout(() => updateDOM(page), 500);
}

/**
 * Opens a window with the provided URL and initializes the app.
 * @param {string} url - The URL of the window to open.
 */
async function openWindow(url: string): Promise<void> {
  log(
    "Starting the Catcord App...",
    LogLevel.INFO,
    "[catcord] 🚀",
  );

  const window = await open(url, {} as OpenOptions);

  // Initialize the app after the window is opened
  initializeApp(window, window.page);
}

// Start the app
openWindow("https://discord.com/app");
