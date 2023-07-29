import { Window } from "@gluon-framework/gluon";
import { log } from "../util.ts";
import { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import GlobalSettingsTab from "./GlobalSettingsTab.tsx";

// Define the type for a single settings node element
export type SettingsNodeElement = {
  text: string;
  html: string;
  id: string;
};

// The initial settings data with a single element
let settings: SettingsNodeElement[] = [
  GlobalSettingsTab,
];

/**
 * Hooks the settings into the IPC (Inter-Process Communication).
 * @param window - The browser window object.
 */
export function hookSettingsToIPC(window: Window) {
  // Log that we are hooking the settings into the IPC
  log("Hooking settings into the IPC");

  // Add the settings and version information to the IPC store config
  window.ipc.store.config = {
    ...window.ipc.store.config,
    settings: settings,
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
  element: () => ReactElement,
  id: string,
  display: string,
): SettingsNodeElement {
  return {
    text: display,
    id: id,
    html: renderToString(element()),
  };
}
