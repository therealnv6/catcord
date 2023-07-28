export enum LogLevel {
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
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
