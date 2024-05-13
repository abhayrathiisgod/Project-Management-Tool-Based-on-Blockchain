// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserContract {
    struct User {
        uint256 userId;
        string email;
        uint256 company;
    }

    mapping(uint256 => User) public users;
    uint256 public userCount;

    event UserAdded(uint256 indexed userId, string email, uint256 company);

    constructor(User[] memory _users) {
        for (uint256 i = 0; i < _users.length; i++) {
            users[i] = _users[i];
            emit UserAdded(users[i].userId, users[i].email, users[i].company);
        }
        userCount = _users.length;
    }

    function getUser(uint256 _userId) public view returns (uint256 userId, string memory email, uint256 company) {
        User storage user = users[_userId];
        return (user.userId, user.email, user.company);
    }

    function getUserCount() public view returns (uint256) {
        return userCount;
    }
}