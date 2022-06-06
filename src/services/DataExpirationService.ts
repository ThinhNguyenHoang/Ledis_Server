import SnapshotRepository from "../repository/SnapshotRepository";

const dataRepos = SnapshotRepository.getInstance();
const getAllKeys = () => {
    const stringKeys = Object.keys(dataRepos.getStringMap());
    const listKeys = Object.keys(dataRepos.getListHashMap());
    const mapKeys = Object.keys(dataRepos.getSetHashMap());
    return [...stringKeys, ...listKeys, ...mapKeys]
}

const deleteKey = (key: string) => {
    delete dataRepos.getStringMap()[key];
    delete dataRepos.getListHashMap()[key];
    delete dataRepos.getSetHashMap()[key];
    delete dataRepos.getKeyExpirationHashMap()[key];
}

export const EXPIRED_NOT_SET = "No expiration set for this key";
const expireKeY = (key: string, secondToExpires: number) => {
    const dataExpirationMap = dataRepos.getKeyExpirationHashMap();

    const expirationTimestamp = new Date().getTime() + (secondToExpires * 1000);
    dataExpirationMap[key] = expirationTimestamp;
    return expirationTimestamp;
}

const queryTimeToLive = (key: string) => {
    const dataExpiration = dataRepos.getDataExpirationByKey(key);
    if (!dataExpiration) {
        // TO DO: Throw new error
        return "Timeout not set";
    }
    return (dataExpiration - new Date().getTime()) / 1000;
}

export default {getAllKeys, deleteKey, queryTimeToLive, expireKeY};


