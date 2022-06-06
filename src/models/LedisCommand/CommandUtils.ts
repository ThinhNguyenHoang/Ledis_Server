export const commandDescriptions = {
    // String Commands
    SET: "String command: set a string value, always overwriting what is saved under key",
    GET: "Sctring command: get a string value at key",

    // List Commands
    LLEN: "LIST COMMAND:  return length of a list",
    RPUSH: " key value1 [value2...]: append 1 or more values to the list, create list if not exists, return length of list after operation",
    LPOP: "key: remove and return the first item of the list",
    RPOP: "key:  remove and return the first item of the list",
    LRANGE: "key start stop: return a range of element from the list (zero-based, inclusive of start and stop), start and stop are non-negative integers",

    // Set Command
    SADD: "key value1 [value2...]: add values to set stored at key",
    SREM: "key value1 [value2...]: remove values from setA",
    SMEMBERS: "key: return array of all members of set",
    SINTER: "SINTER [key1] [key2] [key3] ...: (bonus) set intersection among all set stored in specified keys. Return array of members of the result set",

    // Data Expiration
    KEYS: "List all available keys",
    DEL: "key: delete a key",
    EXPIRE: " key seconds: set a timeout on a key, seconds is a positive integer (by default a key has no expiration). Return the number of seconds if the timeout is set",
    TTL: "key: query timeout of a key",

    // Snapshot
    SAVE: "save current state in a snapshot",
    RESTORE: "restore from the last snapshot",

    // Utils
    CLEAR: "clear the terminal"
}

/**
 * Take in the command string and check if it is valid
 */
export type CommandValidator = (commandText: string) => boolean;

export type CommandValidatorMap = {
    [key in keyof typeof commandDescriptions]: CommandValidator
}

/**
 *
 * @param command Command Text (trimmed on both end)
 * @param requiredNumberOfArg Number of required arg for this command
 * Check if a command does have correct number of arg
 */
const properArgNum = (command: string, requiredNumberOfArg: number, addtionalPredicate?: "MoreThan" | "LessThan" | "MoreOrEqual" | "LessOrEqual") => {
    const splitCommand = command.split(" ");
    // * Minus the command name
    const argvLen = splitCommand.length - 1;
    if (!addtionalPredicate)
        return argvLen === requiredNumberOfArg;
    switch (addtionalPredicate) {
        case "MoreThan":
            return argvLen > requiredNumberOfArg
        case "LessThan":
            return argvLen < requiredNumberOfArg
        case "MoreOrEqual":
            return argvLen >= requiredNumberOfArg
        case "LessOrEqual":
            return argvLen <= requiredNumberOfArg
        default:
            return true;
    }
}

export const commandValidatorsMap: CommandValidatorMap = {
    SET: (command) => {
        if (!properArgNum(command, 2))
            return false;
        return true;
    },
    GET: (command) => {
        if (!properArgNum(command, 1))
            return false;
        return true;
    },
    LLEN: (command) => {
        if (!properArgNum(command, 1))
            return false;
        return true;
    },
    RPUSH: (command) => {
        if (!properArgNum(command, 1, "MoreThan"))
            return false;
        return true;
    },
    LPOP: (command) => {
        if (!properArgNum(command, 1))
            return false;
        return true;
    },
    RPOP: (command) => {
        if (!properArgNum(command, 1))
            return false;
        return true;
    },
    LRANGE: (command) => {
        if (!properArgNum(command, 3))
            return false;
        return true;
    },
    SADD: (command) => {
        if (!properArgNum(command, 2, "MoreOrEqual"))
            return false;
        return true;
    },
    SREM: (command) => {
        if (!properArgNum(command, 2, "MoreOrEqual"))
            return false;
        return true;
    },
    SMEMBERS: (command) => {
        if (!properArgNum(command, 1))
            return false;
        return true;
    },
    SINTER: (command) => {
        if (!properArgNum(command, 0, "MoreOrEqual"))
            return false;
        return true;
    },
    KEYS: (command) => {
        if (!properArgNum(command, 0))
            return false;
        return true;
    },
    DEL: (command) => {
        if (!properArgNum(command, 1))
            return false;
        return true;
    },
    EXPIRE: (command) => {
        if (!properArgNum(command, 2))
            return false;
        return true;
    },
    TTL: (command) => {
        if (!properArgNum(command, 1))
            return false;
        return true;
    },
    SAVE: (command) => {
        if (!properArgNum(command, 0))
            return false;
        return true;
    },
    RESTORE: (command) => {
        if (!properArgNum(command, 0))
            return false;
        return true;
    },
    CLEAR: (command) => {
        return command === "CLEAR";
    }
}

export type CommandName = keyof typeof commandDescriptions;

export type LedisCommand = {
    command: string,
    commandParams: string[]
}
// Logic to parse the command
// Check for error:
//      - Unknown Command
//      - Invalid Params
export const parseToLedisCommand: (commandText: string) => LedisCommand = (commandText) => {
    const splitCommand = commandText.trim().split(" ");

    const commandName = splitCommand[0];
    // * Note: This would always return an array --> Command forming logic need to check for cases of zero and one argument
    const commandParams = splitCommand.slice(1);

    if (!commandName) {
        // TODO: Throw the error
    }

    // ! The ts-ignore below may seem unsafe. But this is actually more performant than
    // ! the other alternative of creating list of command and using loop to check for command name validity : O(N) > O(1)
    // @ts-ignore
    const commandValidator = commandValidatorsMap[commandName];
    if (!commandValidator) {

    }
    return {
        command: commandName,
        commandParams: commandParams
    }
}