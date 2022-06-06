import {DataExpirationCommand} from "../LedisCommand";
import snapshotService from "../../../services/SnapshotService";

class SnapshotSaveCommand extends DataExpirationCommand {
    constructor() {
        super();
    }

    async execute(): Promise<void> {
        await snapshotService.saveSnapshot();
    }
}

class LastSnapshotRestoreCommand extends DataExpirationCommand {
    constructor() {
        super();
    }

    async execute(): Promise<void> {
        await snapshotService.restoreFromLastSnapshot();
    }
}

export {SnapshotSaveCommand, LastSnapshotRestoreCommand};