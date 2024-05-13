// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    uint256 private myNumber;

    event NumberSet(uint256 number);

    function getNumber() public view returns (uint256) {
        return myNumber;
    }

    function setNumber(uint256 _number) public {
        myNumber = _number;
        emit NumberSet(_number);
    }
}