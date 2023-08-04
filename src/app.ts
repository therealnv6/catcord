import { open, OpenOptions, PageApi, Window } from "@gluon-framework/gluon";
import { updateTitleHandler } from "./title.ts";
import { setupThemeConfig } from "./theme.ts";
import { log, LogLevel } from "./util.ts";
import { hookSettingsToIPC } from "./settings/shared.ts";
import { injectSettings } from "./settings/inject.ts";

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

  // Update the title
  updateTitleHandler(window, page);
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

  const window = await open(
    url,
    {
      allowHTTP: "mixed",
      allowNavigation: true,
      localCSP: `
        font-src 'self' *; 
        img-src 'self' *;
      `,
    } as OpenOptions,
  );

  // Initialize the app after the window is opened
  initializeApp(window, window.page);
}

// Start the app
openWindow("https://discord.com/app");
