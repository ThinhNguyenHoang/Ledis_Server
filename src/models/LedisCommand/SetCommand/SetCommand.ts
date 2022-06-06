// * Set commands
import {SetCommand} from "../LedisCommand";
import setService from "../../../services/SetService";
import {setToString} from "../../../utils/setUtils";

class SetAddCommand extends SetCommand {
    key: string
    values: string[]

    constructor(key: string, ...values: string[]) {
        super();
        this.key = key;
        this.values = values;
    }

    execute(): string {
        return setToString(setService.setAdd(this.key, ...this.values));
    }
}

class SetRemoveCommand extends SetCommand {
    key: string
    values: string[]

    constructor(key: string, ...values: string[]) {
        super();
        this.key = key;
        this.values = values;
    }

    execute(): void {
        setService.setRemove(this.key, ...this.values);
    }
}

class SetMembersCommand extends SetCommand {
    key: string

    constructor(key: string) {
        super();
        this.key = key;
    }

    execute(): string[] {
        return setService.setMembers(this.key);
    }
}

class SetIntersectionCommand extends SetCommand {
    keys: string[]

    constructor(...keys: string[]) {
        super();
        this.keys = keys;
    }

    execute(): string {
        const result = setService.setIntersection(...this.keys);
        if (!result) {
            return "{}"
        } else if (result instanceof Set<string>) {
            return setToString(result);
        }
        return `{${result.toString()}}`
    }
}


export {SetAddCommand, SetRemoveCommand, SetMembersCommand, SetIntersectionCommand};