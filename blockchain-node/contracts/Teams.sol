// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Organization {
    struct OrgData {
        uint256 id;
        string socialName;
        string name;
        string email;
        string city;
        uint256 foundDate;
    }

    mapping(uint256 => OrgData) public organizations;
    uint256 public orgCount;

    event OrgAdded(uint256 indexed id, string socialName, string name, string email, string city, uint256 foundDate);

    constructor(OrgData[] memory _orgs) {
        for (uint256 i = 0; i < _orgs.length; i++) {
            orgCount++;
            organizations[orgCount] = _orgs[i];
            emit OrgAdded(orgCount, _orgs[i].socialName, _orgs[i].name, _orgs[i].email, _orgs[i].city, _orgs[i].foundDate);
        }
    }

    function getOrganization(uint256 _id) public view returns (OrgData memory) {
        require(_id <= orgCount && _id > 0, "Invalid organization ID.");
        return organizations[_id];
    }

    function getOrgCount() public view returns (uint256) {
        return orgCount;
    }
}
