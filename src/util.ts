import * as fs from "fs";
import * as os from "os";

export enum LogLevel {
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

type JSONData = Record<string, any>;

type SettingsForm = {
  themes: string;
};

export const settings = readJsonFile<SettingsForm>("settings.json");

/**
 * Reads and retrieves JSON data from a file.
 *
 * @template T - The type of the JSON data to be retrieved.
 * @param {string} filePath - The path to the JSON file to be read.
 * @returns {T} The JSON data read from the file.
 * @throws {Error} if there's an error while reading or parsing the JSON file.
 */
export function readJsonFile<T extends JSONData>(filePath: string): T {
  try {
    const readPath = `${os.homedir()}/.config/catcord/${filePath}`;

    if (fs.existsSync(readPath)) {
      try {
        return JSON.parse(fs.readFileSync(readPath, "utf-8")) as T;
      } catch {
        log(
          `${filePath} is formatted incorrectly.`,
          LogLevel.WARNING,
        );
        throw new Error("Error parsing JSON file.");
      }
    } else {
      throw new Error("File not found.");
    }
  } catch (error) {
    log(`Error reading JSON file: ${error}`);
    throw error;
  }
}

/**
 * Edits a JSON file by updating specified fields with new values.
 *
 * @template T - The type of the JSON data to be edited.
 * @param {string} filePath - The path to the JSON file to be edited.
 * @param {Partial<T>} updates - An object containing the fields to be updated and their new values.
 * @returns {void}
 * @throws {Error} if there's an error while reading, parsing, or writing the JSON file.
 */
export function editJsonField<T extends JSONData>(
  filePath: string,
  updates: Partial<T>,
): void {
  try {
    const jsonData: T = readJsonFile(filePath);

    const updatedData: T = {
      ...jsonData,
      ...updates,
    };

    const writePath = `${os.homedir()}/.config/catcord/${filePath}`;
    fs.writeFileSync(writePath, JSON.stringify(updatedData, null, 2));
  } catch (error) {
    console.error(`Error updating JSON file: ${error}`);
    throw error;
  }
}

/**
 * Custom log function to add a prefix and log level to log messages.
 * @param {string} message - The log message.
 * @param {LogLevel} level - The log level (e.g., LogLevel.ERROR, LogLevel.WARNING, LogLevel.INFO).
 * @param {string} prefix - The prefix for the log message.
 */
export function log(
  message: string,
  level: LogLevel = LogLevel.INFO,
  prefix: string = "[catcord] 🐱",
): void {
  const levelColors = {
    [LogLevel.ERROR]: "\x1b[31m", // Red color for errors
    [LogLevel.WARNING]: "\x1b[33m", // Yellow color for warnings
    [LogLevel.INFO]: "\x1b[32m", // Green color for info messages
  };

  const logColor = levelColors[level] || "\x1b[0m"; // Default color (reset)

  console.log(`${logColor}${prefix} \x1b[0m${message}`);
}
