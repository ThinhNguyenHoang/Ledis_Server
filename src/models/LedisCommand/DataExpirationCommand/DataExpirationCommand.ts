import {DataExpirationCommand} from "../LedisCommand";
import dataExpirationService from '../../../services/DataExpirationService';
import {domainToASCII} from "url";

class DataExpireKeysCommand extends DataExpirationCommand {
    constructor() {
        super();
    }

    execute(): string[] {
        return dataExpirationService.getAllKeys();
    }
}

class DataExpirationDeleteCommand extends DataExpirationCommand {
    key: string

    constructor(key: string) {
        super();
        this.key = key;
    }

    execute(): void {
        dataExpirationService.deleteKey(this.key);
    }
}

class DataExpireSetKeyTimeoutCommand extends DataExpirationCommand {
    key: string
    secondsToExpire: number

    constructor(key: string, secondsToExpire: number) {
        super();
        this.key = key;
        this.secondsToExpire = secondsToExpire;
    }

    execute(): void {
        dataExpirationService.expireKeY(this.key, this.secondsToExpire);
    }
}

class DataExpireTimeToLiveCommand extends DataExpirationCommand {
    key: string

    constructor(key: string) {
        super();
        this.key = key;
    }

    execute(): string {
        return dataExpirationService.queryTimeToLive(this.key).toString();
    }
}


export {DataExpireKeysCommand, DataExpireSetKeyTimeoutCommand, DataExpireTimeToLiveCommand, DataExpirationDeleteCommand}