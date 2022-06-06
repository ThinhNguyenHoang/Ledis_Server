import BaseError from "../BaseError";
import errorCodes from "../ErrorCodes";

class KeyNotFoundError extends BaseError {
    constructor(
        key: string,
    ) {
        super("Unknown Command Error", errorCodes.INVALID_COMMAND_PARAMETER, `Cannot find the  key: ${key}`, true)
    }
}

class SetEmptyError extends BaseError {
    constructor(
        key: string,
    ) {
        super("InvalidCommandUsage", errorCodes.INVALID_COMMAND_PARAMETER, `Failed to remove from an empty set of key: ${key}`, true)
    }
}

export {KeyNotFoundError, SetEmptyError}
