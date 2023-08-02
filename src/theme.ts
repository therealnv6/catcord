import { CSSResource, Window } from "@gluon-framework/gluon";
import { log, LogLevel, settings } from "./util.ts";
import postcss, { ProcessOptions } from "postcss/lib/postcss";

/**
 * Fetches the theme configuration from an external URL.
 * @returns {Promise<string>} The CSS style content.
 */
async function fetchTheme(url: string): Promise<string> {
  return processCSS(url);
}

/**
 * Process the CSS content using PostCSS with necessary plugins.
 * @param {string} url - The URL of the CSS file.
 * @returns {Promise<string>} The processed CSS content.
 */
async function processCSS(url: string): Promise<string> {
  // Fetch the CSS content from the specified URL
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch theme: ${url}: ${response.status} - ${response.statusText}`,
    );
  }

  const text = await response.text();
  const plugins: postcss.AcceptedPlugin[] = []; // Add any necessary plugins for postcss

  let parsedCss = "";

  // Process the CSS content with PostCSS
  const options: ProcessOptions = {
    from: undefined,
  };

  const result = await postcss(plugins).process(text, options);

  // Handle CSS imports (at-rules)
  await Promise.all(
    result.root.nodes.map(async (node) => {
      if (
        // check if it's an atrule (@)
        node.type === "atrule" &&
        // check if it's an `import` atrule (@import)
        // are there more rules i should handle? not sure
        node.name === "import"
      ) {
        const importTarget = node.params
          // remove used to remove single or double quotes from a string
          .replace(/['"]/g, "")
          // we have to remove the `url(<url>)` around the actual url
          .replace(
            /url\((.*?)\)/g,
            "$1",
          );

        parsedCss += await processCSS(importTarget);
      }
    }),
  );

  parsedCss += result.css;

  return parsedCss;
}

let css: CSSResource | undefined;

/**
 * Applies the fetched theme to the DOM.
 * @param {Window} window - The Window object representing the browser window.
 * @param {string} style - The CSS style content.
 */
async function applyTheme(
  window: Window,
  style: string,
) {
  try {
    const updated = await window.resources.css(style);

    if (css !== undefined) {
      await css.remove();
    }

    css = updated;
  } finally {
    log("Applied theme!");
  }
}

/**
 * Sets up the theme configuration.
 * @param {Window} window - The Window object representing the browser window.
 */
export async function setupThemeConfig(
  window: Window,
  url?: string,
) {
  if (!url && settings.themes != undefined) {
    url = settings.themes;
  }

  if (!url) {
    return;
  }

  log("Setting up theme");

  try {
    window.page.reload();

    const style = await fetchTheme(url);
    log("Retrieved theme");
    await applyTheme(window, style);
  } catch (error: any) {
    log(
      `Error fetching theme: ${error.message}`,
      LogLevel.ERROR,
    );

    window.ipc.store.config["themes-loaded"] = false;
    return;
  }

  window
    .ipc
    .store
    .config["themes-loaded"] = true;

  log("Wrote theme to IPC");
}
