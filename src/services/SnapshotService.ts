import SnapshotRepository from "../repository/SnapshotRepository";

const dataRepos = SnapshotRepository.getInstance();

const saveSnapshot = async () => {
    await dataRepos.saveCurrentStateToSnapshot();
}

// ? May implement multiple snapshot
const restoreFromLastSnapshot = async () => {
    await dataRepos.loadLastSnapshot();
}

export default {saveSnapshot, restoreFromLastSnapshot};