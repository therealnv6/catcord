import { readJsonFile } from "../util.ts";

export type SettingsForm = {
  themes: string[];
};

export let SETTINGS_STORAGE = readJsonFile<SettingsForm>("settings.json");

export function reloadFromFile() {
  SETTINGS_STORAGE = readJsonFile<SettingsForm>("settings.json");
}
