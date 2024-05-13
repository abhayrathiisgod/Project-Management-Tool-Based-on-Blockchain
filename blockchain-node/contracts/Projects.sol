// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskManager {
    struct Task {
        uint256 id;
        string taskSets;
        string name;
        string slug;
        uint256 efforts;
        uint8 status;
        string deadLine;
        uint8 completePer;
        string description;
        string addDate;
        string updDate;
        uint256 company;
        string assignees;
    }

    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;

    event TaskAdded(
        uint256 indexed id,
        string taskSets,
        string name,
        string slug,
        uint256 efforts,
        uint8 status,
        string deadLine,
        uint8 completePer,
        string description,
        string addDate,
        string updDate,
        uint256 company,
        string assignees
    );

    constructor(Task[] memory _tasks) {
        for (uint256 i = 0; i < _tasks.length; i++) {
            taskCount++;
            tasks[taskCount] = _tasks[i];
            emit TaskAdded(
                taskCount,
                _tasks[i].taskSets,
                _tasks[i].name,
                _tasks[i].slug,
                _tasks[i].efforts,
                _tasks[i].status,
                _tasks[i].deadLine,
                _tasks[i].completePer,
                _tasks[i].description,
                _tasks[i].addDate,
                _tasks[i].updDate,
                _tasks[i].company,
                _tasks[i].assignees
            );
        }
    }

    function getTask(uint256 _id) public view returns (Task memory) {
        require(_id <= taskCount && _id > 0, "Invalid task ID.");
        return tasks[_id];
    }

    function getTotalTasks() public view returns (uint256) {
        return taskCount;
    }
}