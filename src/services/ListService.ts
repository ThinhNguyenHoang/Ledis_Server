import SnapshotRepository from "../repository/SnapshotRepository";
import {ListNotFoundError, OutOfRangeError, PopAnEmptyListError} from "../errors/LedisLogicError/ListError"
import errorCodes from "../errors/ErrorCodes";

const dataRepos = SnapshotRepository.getInstance();

const listLengthByKey = (key: string) => {
    const listHashMap = dataRepos.getListHashMap();
    const list = listHashMap[key];
    if (!list) {
        throw new ListNotFoundError(key);
    }

    return dataRepos.getListByKey(key).length;
}
/**
 *
 * @param key
 * @param values - Array of values to be pushed to the list
 * . This should always be an array
 */
const listRightPush = (key: string, ...values: string[]) => {
    const listHashMap = dataRepos.getListHashMap();
    const list = listHashMap[key];
    if (!list) {
        listHashMap[key] = [...values];
        return listHashMap[key];
    }
    list.push(...values);
    return list;
}

const listLeftPop = (key: string) => {
    const listHashMap = dataRepos.getListHashMap();
    const list = listHashMap[key];
    if (!list) {
        throw new ListNotFoundError(key);
    }
    if (list.length === 0) {
        throw new PopAnEmptyListError(key);
    }
    return list.splice(0, 1)[0];
}

const listRightPop = (key: string) => {
    const listHashMap = dataRepos.getListHashMap();
    const list = listHashMap[key];
    if (!list) {
        throw new ListNotFoundError(key);
    }
    if (list.length === 0) {
        throw new PopAnEmptyListError(key);
    }
    return list.splice(-1)[0];
}

const listRange = (key: string, start: number, stop: number) => {
    const listHashMap = dataRepos.getListHashMap();
    const list = listHashMap[key];
    if (!list) {
        throw new ListNotFoundError(key);
    }

    if (stop >= list.length || start < 0 || start > stop) {
        throw new OutOfRangeError(start, stop);
    }
    try {
        return dataRepos.getListByKey(key).slice(start, stop + 1);
    } catch (e) {
        console.log(e);
        throw new OutOfRangeError(start, stop);
    }
}

export default {listLengthByKey, listRange, listLeftPop, listRightPop, listRightPush};



