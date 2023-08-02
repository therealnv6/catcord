import { CSSResource, Window } from "@gluon-framework/gluon";
import { log, LogLevel, settings } from "./util.ts";
import postcss, { ProcessOptions } from "postcss/lib/postcss";

/**
 * Fetches an array of theme configurations from external URLs.
 * @returns {Promise<string>} An URL leading to the CSS target.
 */
async function fetchThemes(url: string): Promise<string> {
  return await processCSS(url);
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
    from: undefined, // required to ignore warning
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
          .replace(
            // thanks chatgpt for this amazing regex
            /url\(['"]?(.*?)['"]?\)|['"]/g,
            "$1",
          );

        parsedCss += await processCSS(importTarget);
      }
    }),
  );

  return parsedCss += result.css;
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
  urls?: string[],
) {
  if (!urls && settings.themes != undefined) {
    urls = Array.isArray(
      settings.themes,
    )
      ? settings.themes
      : [settings.themes];
  }

  if (!urls || urls.length === 0) {
    return;
  }

  log("Setting up themes");

  let styles: string[] = [];
  window.ipc.store.config = {
    ...window.ipc.store.config,
    themesLoaded: [],
  };

  for (const url of urls) {
    try {
      window.page.reload();

      styles.push(
        await fetchThemes(url),
      );

      log("Retrieved themes");
    } catch (error: any) {
      log(
        `Error fetching themes: ${error.message}`,
        LogLevel.ERROR,
      );

      window.ipc.store.config.themesLoaded[url] = error.message;
      return;
    }

    window
      .ipc
      .store
      .config.themesLoaded[url] = "true";
  }

  await applyTheme(
    window,
    styles.join("\n"),
  );

  log("Wrote themes to IPC");
}
