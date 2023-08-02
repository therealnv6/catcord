import { Window } from "@gluon-framework/gluon";
import { editJsonField, log } from "../util.ts";
import { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { setupThemeConfig, unloadTheme } from "../theme.ts";
import { GlobalSettingsTab } from "./components/generalSettingsTab.tsx";
import { reloadFromFile, SETTINGS_STORAGE } from "./storage.ts";

// Define the type for a single settings node element
export type SettingsNodeElement = {
  text: string;
  html: string;
  id: string;
  element: ReactElement;
};

// The initial settings data with a single element
let settingNodes: SettingsNodeElement[];

/**
 * Hooks the settings into the IPC (Inter-Process Communication).
 * @param window - The browser window object.
 */
export function hookSettingsToIPC(window: Window) {
  // Log that we are hooking the settings into the IPC
  log("Hooking settings into the IPC");

  const componentTypeMap = {
    "cat-settings": GlobalSettingsTab,
  };

  // Expose form submission for specific IDs
  {
    exposeTypedSubmit<any, void>(window, "setThemeContents", async (data) => {
      data.themes = data
        .themes
        .split("\n");

      console.log(data);

      editJsonField("settings.json", data);
      reloadFromFile();

      // re-setup the theme
      await setupThemeConfig(
        window,
        data.themes,
      );
    });

    exposeSubmit<void>(window, "unloadTheme", async () => {
      editJsonField("settings.json", {
        themes: [""], /*actually have to set the theme to be empty*/
      });

      window
        .ipc
        .store
        .config.themesLoaded = [];

      reloadFromFile();
      unloadTheme();
    });
  }

  window
    .ipc
    .expose(
      "renderToString",
      (element: string) => {
        return renderToString(
          componentTypeMap[element](window),
        );
      },
    );

  // write the settings here already,
  // considering several of the setting nodes need this.
  window.ipc.store.config = {
    ...window.ipc.store.config,
    settings: SETTINGS_STORAGE,
  };

  // set the setting nodes
  settingNodes = [
    wrapToSettingNode(
      GlobalSettingsTab,
      window,
      "cat-settings",
      "Catcord Settings",
    ),
  ];

  // Add the settings and version information to the IPC store config
  window.ipc.store.config = {
    ...window.ipc.store.config,
    settingNodes: settingNodes,
    version: process.env.npm_package_version,
  };

  // Log that the hooking process is done
  log("Done!");
}

/**
 * Wraps a React element into a setting node object.
 * @param element The React element to wrap.
 * @param id The ID of the setting node.
 * @param display The display text of the setting node.
 * @returns The setting node object.
 */
export function wrapToSettingNode(
  element: (window: Window) => ReactElement,
  window: Window,
  id: string,
  display: string,
): SettingsNodeElement {
  return {
    text: display,
    id: id,
    html: renderToString(
      element(window),
    ),
    element: element(window),
  };
}

/**
 * Exposes a typed function for a given ID through IPC.
 * @param window The browser window object.
 * @param id The ID of the form submission to expose.
 */
export function exposeTypedSubmit<T, R>(
  window: Window,
  id: string,
  callback?: (data: T) => Promise<R>,
) {
  window.ipc.expose(id, (data: string) => {
    const parsed = JSON.parse(data);

    if (callback) {
      return callback(parsed as T);
    }
  });
}

/**
 * Exposes for a given ID through IPC.
 * @param window The browser window object.
 * @param id The ID of the form submission to expose.
 */
export function exposeSubmit<R>(
  window: Window,
  id: string,
  callback?: () => Promise<R>,
) {
  window.ipc.expose(id, () => {
    if (callback) {
      return callback();
    }
  });
}
