import BaseError from "../BaseError";
import errorCodes from "../ErrorCodes";

class SnapshotSavingError extends BaseError {
    constructor() {
        super("SnapshotSaveError", errorCodes.COMMAND_NOT_FOUND, `Unable to take snapshot`, true)
    }
}

export {SnapshotSavingError};