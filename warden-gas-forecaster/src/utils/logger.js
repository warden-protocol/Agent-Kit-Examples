import winston from "winston";

const logFormat = winston.format.combine(
    winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
    winston.format.printf(({timestamp, level, message}) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
);

const logger = winston.createLogger({
    level: "info",
    format: logFormat,
    transports: [
        new winston.transports.Console({format: logFormat}),
        new winston.transports.File({filename: "logs/error.log", level: "error"})
    ],
});

export const logInfo = (message) => logger.info(message);
export const logWarn = (message) => logger.warn(message);
export const logError = (message, error = null) => {
    if (error) {
        logger.error(`${message} - ${error.message}\n${error.stack}`);
    } else {
        logger.error(message);
    }
};
