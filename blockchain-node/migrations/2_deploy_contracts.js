const MyContract = artifacts.require("MyContract");
const TaskManager = artifacts.require("TaskManager");
const Users = artifacts.require("UserManager");
const Organization = artifacts.require("Organization");

module.exports = function (deployer) {
    // Deploy contracts
    deployer.deploy(MyContract);

    // Define initial task data
    const initialTasks = [
        {
            id: 0, // Placeholder for the id field
            taskSets: "d",
            name: "Make payment to abc",
            slug: "d",
            efforts: 12,
            status: 2,
            deadLine: "d",
            completePer: 20,
            description: "d",
            addDate: "d",
            updDate: "d",
            company: 1,
            assignees: "12",
        },
        {
            id: 0, // Placeholder for the id field
            taskSets: "d",
            name: "Make payment to abc",
            slug: "d",
            efforts: 12,
            status: 2,
            deadLine: "d",
            completePer: 20,
            description: "d",
            addDate: "d",
            updDate: "d",
            company: 1,
            assignees: "12",
        },
    ];

    // Deploy TaskManager contract and initialize with initialTasks data
    deployer.deploy(TaskManager, initialTasks);

    deployer.deploy(Users);

    const initialOrgs = [
        {
            id: 1,
            socialName: "org1",
            name: "Organization 1",
            email: "org1@example.com",
            city: "City A",
            foundDate: 1990,
        },
        {
            id: 2,
            socialName: "org2",
            name: "Organization 2",
            email: "org2@example.com",
            city: "City B",
            foundDate: 1995,
        },
    ];

    // Deploy Organization contract and initialize with initialOrgs data
    deployer.deploy(Organization, initialOrgs);
};