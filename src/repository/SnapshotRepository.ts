import * as fs from "fs";
import * as fsPromise from "fs/promises";
import * as path from "path";
import {SnapshotSavingError} from "../errors/LedisLogicError/SnapshotError";

let instance: SnapshotRepository | null = null;

export type HashMap<T> = {
    [key: string]: T
}

export type TimeStamp = number;
export type LedisData = {
    stringHashMap: HashMap<string>,
    listHashMap: HashMap<string[]>,
    setHashMap: HashMap<Set<string>>,
    // * Timestamp Hashmap
    keyExpirationMap: HashMap<TimeStamp>
}

const snapshotPath = path.join(__dirname, "snapshots", "snapshot.json");

// @ts-ignore
async function readSnapshotFile(path?: string) {
    try {
        const snapShotBuffer = await fsPromise.readFile(path ?? snapshotPath);
        return snapShotBuffer.toString();
    } catch (err) {
        console.log("Got an error reading snapshot file")
    }
}

async function writeSnapshotToFile(data: any) {
    try {
        console.log("Saving snapshot to file");
        await fsPromise.writeFile(snapshotPath, data, {flag: "w"});
    } catch (e) {
        // TODO: Add error for handling
        console.log(e);
        throw new SnapshotSavingError()
    }
}

// Ultilize the json.stringify methods for ease of implementation
export type LedisStateSnapshot = {
    stringMapSerialized: string,
    listMapSerialized: string,
    setMapSerialized: string,
    keyExpirationMapSerialized: string
}

const defaultLedisData = {
    keyExpirationMap: {},
    listHashMap: {},
    stringHashMap: {},
    setHashMap: {}
}

// Single source of truth for data and serialization
class SnapshotRepository {
    _database: LedisData

    constructor() {
        this._database = defaultLedisData;
    }

    getDatabase(): LedisData {
        return this._database;
    }

    getStringMap(): HashMap<string> {
        console.log("String hash map is: ", this._database);
        return this._database.stringHashMap;
    }

    getListHashMap(): HashMap<string[]> {
        return this._database.listHashMap;
    }

    getSetHashMap(): HashMap<Set<string>> {
        return this._database.setHashMap;
    }

    getKeyExpirationHashMap(): HashMap<TimeStamp> {
        return this._database.keyExpirationMap;
    }

    getListByKey(key: string) {
        return this.getListHashMap()[key];
    }

    addNewList(key: string, list: string[]) {
        return this._database.listHashMap[key] = list;
    }

    getSetByKey(key: string) {
        return this.getSetHashMap()[key];
    }

    addNewSet(key: string, set: Set<string>) {
        return this._database.setHashMap[key] = set;
    }

    getDataExpirationByKey(key: string) {
        return this.getKeyExpirationHashMap()[key];
    }

    // * Serialization
    async saveCurrentStateToSnapshot() {
        const dataModel = this._database;
        const setMapSerialized: HashMap<any> = {}
        const setHashMap = dataModel.setHashMap;
        for (const setKey in setHashMap) {
            setMapSerialized[setKey] = JSON.stringify(Array.from(setHashMap[setKey]));
        }
        const stateSnapshot: LedisStateSnapshot = {
            stringMapSerialized: JSON.stringify(dataModel.stringHashMap),
            listMapSerialized: JSON.stringify(dataModel.listHashMap),
            setMapSerialized: JSON.stringify(setMapSerialized),
            keyExpirationMapSerialized: JSON.stringify(dataModel.keyExpirationMap)
        }
        await writeSnapshotToFile(JSON.stringify(stateSnapshot));
    }

    // * Deserialization
    // @ts-ignore
    async loadLastSnapshot(): LedisData {
        const snapShotData = await readSnapshotFile();
        if (!snapShotData) {
            console.log("No snapshot found. Start as new");
            return defaultLedisData;
        }
        const snapShot: LedisStateSnapshot = JSON.parse(snapShotData);
        console.log("last snapshot is: ", snapShot);
        this._database = this.fromSnapshotToState(snapShot);
    }

    // * State unmarshalling Logic (Mainly dealing with sets not being able to stringify directly)
    fromSnapshotToState(dataSnapshot: LedisStateSnapshot): LedisData {
        const {stringMapSerialized, listMapSerialized, setMapSerialized, keyExpirationMapSerialized} = dataSnapshot;
        // * These data can be unmarshalled directly with JSON.parse
        const keyExpirationMap: HashMap<TimeStamp> = JSON.parse(keyExpirationMapSerialized);
        const stringHashMap: HashMap<string> = JSON.parse(stringMapSerialized);
        const listHashMap: HashMap<string[]> = JSON.parse(listMapSerialized);
        // * Dealing with Set: 1) Unmarshalling => List  2) --Transform--> Map
        // * 2) From: {key1: [v1,v2,...] , key2: [v4,1212,...}} => {key1: set(), key2: set()}
        const temporarySetMap = JSON.parse(setMapSerialized);
        const setHashMap: HashMap<Set<string>> = {}
        for (const setKey in temporarySetMap) {
            setHashMap[setKey] = new Set(temporarySetMap[setKey]);
        }
        return {
            keyExpirationMap,
            stringHashMap,
            listHashMap,
            setHashMap
        }
    }

    static getInstance(): SnapshotRepository {
        if (!instance) {
            instance = new SnapshotRepository();
        }
        return instance;
    }
}

export default SnapshotRepository;