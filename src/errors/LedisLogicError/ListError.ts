import BaseError from "../BaseError";
import errorCodes from "../ErrorCodes";

class ListNotFoundError extends BaseError {
    constructor(
        key: string,
    ) {
        super("Unknown Command Error", errorCodes.COMMAND_NOT_FOUND, `Cannot find the list with key: ${key}`, true)
    }
}

class OutOfRangeError extends BaseError {
    constructor(
        start: number,
        stop: number
    ) {
        super("InvalidCommandUsage", errorCodes.INVALID_COMMAND_PARAMETER, `Invalid Range: ${start} - ${stop}`, true)
    }
}

class PopAnEmptyListError extends BaseError {
    constructor(
        key: string,
    ) {
        super("InvalidCommandUsage", errorCodes.INVALID_COMMAND_PARAMETER, `Failed to Pop empty list of key: ${key}`, true)
    }
}

export {ListNotFoundError, OutOfRangeError, PopAnEmptyListError}