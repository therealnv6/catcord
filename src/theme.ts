import { Window } from "@gluon-framework/gluon";
import { log, LogLevel, settings } from "./util.ts";
import postcss, { ProcessOptions } from "postcss/lib/postcss";

/**
 * Fetches the theme configuration from an external URL.
 * @returns {Promise<string>} The CSS style content.
 */
async function fetchTheme(): Promise<string> {
  return processCSS(settings.themes);
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
    applyTheme(window, style);
  } catch (error: any) {
    log(`Error fetching theme: ${error.message}`, LogLevel.ERROR);
  }

  log("Wrote theme to IPC");
}
