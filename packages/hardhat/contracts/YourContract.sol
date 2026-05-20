// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract YourContract {

    struct Task {
        string title;
        bool completed;
    }

    Task[] public tasks;

    event TaskAdded(uint256 index, string title);
    event TaskToggled(uint256 index, bool completed);

    function addTask(string memory _title) public {
        require(bytes(_title).length > 0, "Title cannot be empty");
        tasks.push(Task(_title, false));
        emit TaskAdded(tasks.length - 1, _title);
    }

    function toggleTask(uint256 _index) public {
        require(_index < tasks.length, "Task does not exist");
        Task storage t = tasks[_index];
        t.completed = !t.completed;
        emit TaskToggled(_index, t.completed);
    }

    function getTaskCount() public view returns (uint256) {
        return tasks.length;
    }

    function getTask(uint256 _index) public view returns (string memory, bool) {
        require(_index < tasks.length, "Task does not exist");
        return (tasks[_index].title, tasks[_index].completed);
    }
}