import { Window } from "@gluon-framework/gluon";
import { editJsonField, log, readJsonFile } from "../util.ts";
import { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { GlobalSettingsTab } from "./GlobalSettingsTab.tsx";
import { setupThemeConfig } from "../theme.ts";

type SettingsForm = {
  themes: string;
};

export const settings = readJsonFile<SettingsForm>("settings.json");

// Define the type for a single settings node element
export type SettingsNodeElement = {
  text: string;
  html: string;
  id: string;
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

  // Expose form submission for specific IDs
  {
    exposeFormSubmit<any>(window, "setThemeContents", (data) => {
      setupThemeConfig(window, data.themes);
    });
  }

  // write the settings here already,
  // considering several of the setting nodes need this.
  window.ipc.store.config = {
    ...window.ipc.store.config,
    settings: settings,
  };

  // set the setting nodes
  settingNodes = [
    wrapToSettingNode(
      GlobalSettingsTab(window),
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
  element: ReactElement,
  id: string,
  display: string,
): SettingsNodeElement {
  return {
    text: display,
    id: id,
    html: renderToString(
      element,
    ),
  };
}

/**
 * Exposes form submission for a given ID through IPC.
 * @param window The browser window object.
 * @param id The ID of the form submission to expose.
 */
export function exposeFormSubmit<T>(
  window: Window,
  id: string,
  callback?: (data: T) => void | undefined,
) {
  window.ipc.expose(id, (data: string) => {
    console.log(data);
    editJsonField("settings.json", JSON.parse(data));

    if (callback != undefined) {
      callback(JSON.parse(data) as T);
    }
  });
}
