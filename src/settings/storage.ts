import { readJsonFile } from "../util.ts";

type SettingsForm = {
  themes: string[];
};

export const SETTINGS_STORAGE = readJsonFile<SettingsForm>("settings.json");
