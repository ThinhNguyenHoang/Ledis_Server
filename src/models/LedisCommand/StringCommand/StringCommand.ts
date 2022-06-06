// * String Commands
import stringService from "../../../services/StringService";
import {StringCommand} from "../LedisCommand";

class StringSetCommand extends StringCommand {
    key: string;
    value: string;

    constructor(key: string, value: string) {
        super();
        this.key = key;
        this.value = value;
    }

    execute(): void {
        stringService.executeSetCommand(this.key, this.value);
    }
}

class StringGetCommand extends StringCommand {
    key: string

    constructor(key: string) {
        super();
        this.key = key
    }

    execute(): string {
        return stringService.executeGetCommand(this.key);
    }
}

export {StringSetCommand, StringGetCommand};