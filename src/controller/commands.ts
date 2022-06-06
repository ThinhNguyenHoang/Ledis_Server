/** source/controllers/posts.ts */
import {Request, Response, NextFunction} from 'express';
import axios, {AxiosResponse} from 'axios';
import {CommandName, commandValidatorsMap, parseToLedisCommand} from "../models/LedisCommand/CommandUtils";
import {StringSetCommand, StringGetCommand} from "../models/LedisCommand/StringCommand/StringCommand";
import {
    SetIntersectionCommand,
    SetMembersCommand,
    SetRemoveCommand,
    SetAddCommand
} from "../models/LedisCommand/SetCommand/SetCommand";
import {
    ListRightPushCommand,
    ListRangeCommand,
    ListLengthCommand,
    ListRightPopCommand,
    ListLeftPopCommand
} from "../models/LedisCommand/ListCommand/ListCommand";
import {
    DataExpireKeysCommand,
    DataExpireTimeToLiveCommand, DataExpireSetKeyTimeoutCommand, DataExpirationDeleteCommand
} from "../models/LedisCommand/DataExpirationCommand/DataExpirationCommand";
import {SnapshotSaveCommand, LastSnapshotRestoreCommand} from "../models/LedisCommand/SnapshotCommand/SnapshotCommand";
import {InvalidCommandUsage, UnknownCommandError} from "../errors/LedisCommandError";
import {DataExpirationCommand} from "../models/LedisCommand/LedisCommand";
import SnapshotRepository from "../repository/SnapshotRepository";

const executeCommand = async (req: Request, res: Response, next: NextFunction) => {
    let commandText: string = req.body.command;
    // * Parse the command for command name and argument
    let {command, commandParams} = parseToLedisCommand(commandText);
    console.log(`Handling  Command : ${command} with params: [${commandParams}]`);

    // @ts-ignore
    const commandValidator = commandValidatorsMap[command];
    if (!commandValidator) {
        throw new UnknownCommandError(`Unknown command: ${command}`);
    }
    if (!commandValidator(commandText)) {
        throw new InvalidCommandUsage(`Command Cannot Execute with passed params: ${command}, params: ${commandParams}`);
    }
    let commandResult: string | string[] | null = null;
    try {

        switch (command as CommandName) {
            // * String commands
            case "SET":
                new StringSetCommand(commandParams[0], commandParams[1]).execute()
                break;
            case "GET":
                commandResult = new StringGetCommand(commandParams[0]).execute()
                break;
            // * List Commands
            case "RPOP":
                commandResult = new ListRightPopCommand(commandParams[0]).execute();
                break;
            case "LLEN":
                commandResult = new ListLengthCommand(commandParams[0]).execute();
                break;
            case "RPUSH":
                commandResult = new ListRightPushCommand(commandParams[0], ...commandParams.slice(1)).execute();
                break;
            case "LPOP":
                commandResult = new ListLeftPopCommand(commandParams[0]).execute();
                break;
            case "LRANGE":
                commandResult = new ListRangeCommand(commandParams[0], Number(commandParams[1]), Number(commandParams[2])).execute();
                break;
            // * Set command
            case "SADD":
                commandResult = new SetAddCommand(commandParams[0], ...commandParams.slice(1)).execute();
                break;
            case "SREM":
                new SetRemoveCommand(commandParams[0], ...commandParams.slice(1)).execute();
                break;
            case "SINTER":
                commandResult = new SetIntersectionCommand(commandParams[0], ...commandParams.slice(1)).execute()
                break;
            case "SMEMBERS":
                commandResult = new SetMembersCommand(commandParams[0]).execute();
                break;
            //   * Expire commands
            case "EXPIRE":
                new DataExpireSetKeyTimeoutCommand(commandParams[0], Number(commandParams[1])).execute();
                break;
            case "TTL":
                commandResult = new DataExpireTimeToLiveCommand(commandParams[0]).execute();
                break;
            case "DEL":
                new DataExpirationDeleteCommand(commandParams[0]).execute();
                break;
            case "KEYS":
                commandResult = new DataExpireKeysCommand().execute()
                break;
            // * Snapshot commands
            case "SAVE":
                try {
                    await new SnapshotSaveCommand().execute();
                } catch (e) {
                    console.log(e);
                    return;
                }
                break;
            case "RESTORE":
                try {
                    await new LastSnapshotRestoreCommand().execute()
                } catch (e) {
                    console.log(e);
                    return;
                }
                break;
        }
        const database = SnapshotRepository.getInstance().getDatabase();
        console.log("DATABASE NOW IS: ", database);
        console.log(commandResult);
        if (!commandResult) {
            res.json("Success");
            return;
        }
        res.json(JSON.stringify(commandResult));
    } catch (e) {
        console.log(e);
        next(e);
    }

}
const helloWorld = async (req: Request, res: Response, next: NextFunction) => {
    res.json('Hello World');
}

const addPost = async (req: Request, res: Response, next: NextFunction) => {
    // get the data from req.body
    let title: string = req.body.title;
    let body: string = req.body.body;
    // add the post
    let response: AxiosResponse = await axios.post(`https://jsonplaceholder.typicode.com/posts`, {
        title,
        body
    });
    // return response
    return res.status(200).json({
        message: response.data
    });
};


export default {executeCommand, helloWorld};