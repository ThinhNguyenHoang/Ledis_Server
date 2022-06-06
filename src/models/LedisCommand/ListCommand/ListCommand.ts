// * List Commands
import {ListCommand} from "../LedisCommand";
import listService from "../../../services/ListService";

class ListLengthCommand extends ListCommand {
    key: string

    constructor(key: string) {
        super();
        this.key = key
    }

    execute(): string {
        return listService.listLengthByKey(this.key).toString();
    }
}

class ListRightPushCommand extends ListCommand {
    key: string
    values: string[]

    constructor(key: string, ...values: string[]) {
        super();
        this.key = key;
        this.values = values;
    }

    execute(): string[] {
        return listService.listRightPush(this.key, ...this.values);
    }
}

class ListLeftPopCommand extends ListCommand {
    key: string

    constructor(key: string) {
        super();
        this.key = key;
    }

    execute(): string {
        return listService.listLeftPop(this.key);
    }
}

class ListRightPopCommand extends ListCommand {
    key: string

    constructor(key: string) {
        super();
        this.key = key;
    }

    execute(): string {
        return listService.listRightPop(this.key);
    }
}

class ListRangeCommand extends ListCommand {
    key: string;
    start: number;
    stop: number;

    constructor(key: string, start: number, stop: number) {
        super();
        this.key = key;
        this.start = start;
        this.stop = stop;
    }

    execute(): string[] {
        return listService.listRange(this.key, this.start, this.stop)
    }
}


export {ListLeftPopCommand, ListLengthCommand, ListRightPopCommand, ListRightPushCommand, ListRangeCommand};
