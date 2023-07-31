import { Window } from "@gluon-framework/gluon";
import { log, LogLevel, settings } from "./util.ts";

/**
 * Fetches the theme configuration from an external URL.
 * @returns {Promise<string>} The CSS style content.
 */
async function fetchTheme(): Promise<string> {
  const response = await fetch(settings.themes);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch theme: ${response.status} - ${response.statusText}`,
    );
  }

  return await response.text();
}

/**
 * Applies the fetched theme to the DOM.
 * @param {Window} window - The Window object representing the browser window.
 * @param {string} style - The CSS style content.
 */
function applyTheme(window: Window, style: string) {
  window.ipc.store.config = {
    ...window.ipc.store.config,
    style: style,
  };

  window.resources.css(window.ipc.store.config.style);
}

/**
 * Sets up the theme configuration.
 * @param {Window} window - The Window object representing the browser window.
 */
export async function setupThemeConfig(window: Window) {
  log("Setting up theme");

  try {
    const style = await fetchTheme();
    log("Retrieved theme");
    applyTheme(
      window,
      style,
    );
  } catch (error: any) {
    log(`Error fetching theme: ${error.message}`, LogLevel.ERROR);
  }

  log("Wrote theme to IPC");
}
