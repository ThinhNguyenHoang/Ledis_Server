import SnapshotRepository from "../repository/SnapshotRepository";

const dataRepos = SnapshotRepository.getInstance();

const executeSetCommand = (key: string, value: string) => {
    const stringMap = dataRepos.getStringMap();
    dataRepos.getStringMap()[key] = value;
}
const executeGetCommand = (key: string) => {
    return dataRepos.getStringMap()[key];
}

export default {executeGetCommand, executeSetCommand};


