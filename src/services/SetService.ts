import SnapshotRepository from "../repository/SnapshotRepository";
import {SetNotFoundError} from "../errors/LedisLogicError/SetError";

const dataRepos = SnapshotRepository.getInstance();
const setAdd = (key: string, ...values: string[]) => {
    const setHashMap = dataRepos.getSetHashMap();
    const set = dataRepos.getSetByKey(key);
    if (!set) {
        const newSet = new Set(values);
        setHashMap[key] = newSet;
        return newSet;
    }
    for (let val of values) {
        set.add(val);
    }
    return set;
}

const _setIntersection = (setA: Set<string>, setB: Set<string>) => {
    let intersection = new Set();
    for (let ele of setB) {
        if (setA.has(ele)) {
            intersection.add(ele);
        }
    }
    return intersection as Set<string>;
}
const setRemove = (key: string, ...values: string[]) => {
    const setHashMap = dataRepos.getSetHashMap();
    const set = setHashMap[key];
    if (!setHashMap || !set) {
        throw new SetNotFoundError(key);
    }
    for (let val of values) {
        set.delete(val);
    }
}

const setMembers = (key: string) => {
    const set = dataRepos.getSetByKey(key);
    if (!set) {
        throw new SetNotFoundError(key);
    }
    return Array.from(set.values());
}

const setIntersection = (...keys: string[]) => {
    let resultSet = dataRepos.getSetByKey(keys[0]);
    // TODO: Throw error
    if (!keys || keys.length === 0) {
        return undefined;
    }
    if (keys.length === 1) {
        return resultSet;
    }
    for (let setKey of keys.slice(1)) {
        const newSet = dataRepos.getSetByKey(setKey);
        if (!newSet) {
            throw new SetNotFoundError(setKey);
        }
        resultSet = _setIntersection(resultSet, newSet)
    }
    return Array.from(resultSet);
}


export default {setAdd, setRemove, setIntersection, setMembers};


