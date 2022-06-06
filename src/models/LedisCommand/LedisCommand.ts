import {Command} from "../Command/Command";

type CommandType = "STRING" | "LIST" | "SET" | "DATE_EXPIRATION_COMMAND" | "SNAPSHOT";

abstract class TypedCommand implements Command {
    readonly type: CommandType

    protected constructor(type: CommandType) {
        this.type = type
    }

    abstract execute(): any;

}

abstract class StringCommand extends TypedCommand {
    protected constructor() {
        super("STRING");
    }

    abstract execute(): any;
}

abstract class ListCommand extends TypedCommand {
    protected constructor() {
        super("LIST");
    }

    abstract execute(): any;
}

abstract class SetCommand extends TypedCommand {
    protected constructor() {
        super("SET");
    }

    abstract execute(): any;
}

abstract class DataExpirationCommand extends TypedCommand {
    protected constructor() {
        super("DATE_EXPIRATION_COMMAND");
    }

    abstract execute(): any;
}

abstract class SnapshotCommand extends TypedCommand {
    protected constructor() {
        super("SNAPSHOT");
    }

    abstract execute(): any;
}


export {StringCommand, ListCommand, SnapshotCommand, SetCommand, DataExpirationCommand}