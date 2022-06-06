import BaseError from "./BaseError";
import errorCodes from "./ErrorCodes";

class UnknownCommandError extends BaseError {
    constructor(
        description = 'Not found Command',
    ) {
        super("Unknown Command Error", errorCodes.COMMAND_NOT_FOUND, description, true)
    }
}

class InvalidCommandUsage extends BaseError {
    constructor(
        description = 'Invalid Command Param Passed',
    ) {
        super("InvalidCommandUsage", errorCodes.INVALID_COMMAND_PARAMETER, description, true)
    }

}

export {UnknownCommandError, InvalidCommandUsage}