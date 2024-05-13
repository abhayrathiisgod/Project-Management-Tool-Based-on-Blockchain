const express = require('express');
const { Web3 } = require('web3'); // Change to uppercase 'Web3'
const TasksContract = require("./build/contracts/TaskManager.json"); // Adjust path as needed
const contractABI = TasksContract.abi;
const contractAddress = '0xe8d0705C5C26Cd5492BC58beBac85865aBC4100e'; // Enter your contract address here 
const rpcEndpoint = 'http://127.0.0.1:8545'; // Enter your RPC server endpoint URL here 

const app = express();
const web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint));

const contract = new web3.eth.Contract(contractABI, contractAddress);

app.use(express.json());

// Function to serialize block data
function serializeBlock(block) {
    return {
        number: block.number ? block.number.toString() : "",
        hash: block.hash ? block.hash.toString() : "",
        parentHash: block.parentHash ? block.parentHash.toString() : "",
        nonce: block.nonce ? block.nonce.toString() : "",
        sha3Uncles: block.sha3Uncles ? block.sha3Uncles.toString() : "",
        logsBloom: block.logsBloom ? block.logsBloom.toString() : "",
        transactionsRoot: block.transactionsRoot ? block.transactionsRoot.toString() : "",
        stateRoot: block.stateRoot ? block.stateRoot.toString() : "",
        receiptsRoot: block.receiptsRoot ? block.receiptsRoot.toString() : "",
        miner: block.miner ? block.miner.toString() : "",
        difficulty: block.difficulty ? block.difficulty.toString() : "",
        totalDifficulty: block.totalDifficulty ? block.totalDifficulty.toString() : "",
        size: block.size ? block.size.toString() : "",
        extraData: block.extraData ? block.extraData.toString() : "",
        gasLimit: block.gasLimit ? block.gasLimit.toString() : "",
        gasUsed: block.gasUsed ? block.gasUsed.toString() : "",
        timestamp: block.timestamp ? block.timestamp.toString() : "",
        transactions: block.transactions ? block.transactions : [],
        uncles: block.uncles ? block.uncles.toString() : "",
    };
}

// Get information about all tasks
app.get('/tasks', async (req, res) => {
    try {
        const TasksData = [];
        const taskCount = (await contract.methods.getTotalTasks().call()).toString();

        for (let i = 1; i <= taskCount; i++) {
            const task = await contract.methods.getTask(i).call();
            TasksData.push({
                id: task.id.toString(),
                taskSet: task.taskSets.toString(),
                name: task.name.toString(),
                slug: task.slug.toString(),
                efforts: task.efforts.toString(),
                status: task.status.toString(),
                deadline: task.deadLine.toString(),
                completePercentage: parseFloat(task.completedPer),
                description: task.description.toString(),
                addDate: task.addDate.toString(),
                updateDate: task.updDate.toString(),
                company: task.company.toString(),
                assign: task.assignees
            });
        }

        res.json({ TasksData });
    } catch (error) {
        console.error('Error fetching task data:', error);
        res.status(500).json({ error: 'An error occurred while fetching task data' });
    }
});

// Get information about all blocks
app.get('/blocks', async (req, res) => {
    try {
        const blockNumber = await web3.eth.getBlockNumber();
        const blocksInfo = [];
        for (let i = 0; i <= blockNumber; i++) {
            const block = await web3.eth.getBlock(i);
            blocksInfo.push(serializeBlock(block));
        }
        res.json({ blocks: blocksInfo });
    } catch (error) {
        console.error('Error fetching blocks:', error);
        res.status(500).json({ error: 'An error occurred while fetching blocks' });
    }
});

async function deployContract(orgsData) {
    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            console.error('No Ethereum accounts found.');
            return;
        }

        const contract = new web3.eth.Contract(TasksContract.abi);

        // Map the orgsData to the Task struct format
        const taskDataArray = orgsData.map(task => ({
            id: 0, // Placeholder for the id field
            taskSets: task.taskSet || 'default_task_set',
            name: task.name,
            slug: task.slug,
            efforts: parseInt(task.efforts) || 0,
            status: parseInt(task.status) || 0,
            deadLine: task.deadLine || '',
            completePer: parseInt(task.completedPer) || 0,
            description: task.description || '',
            addDate: task.addDate || '',
            updDate: task.upDate || '',
            company: parseInt(task.company) || 0,
            assignees: task.assignees.join(',') || ''
        }));

        // Deploy the contract with the taskDataArray as an argument
        const deployedContract = await contract.deploy({
            data: TasksContract.bytecode,
            arguments: [taskDataArray]
        }).send({
            from: accounts[6],
            gas: 4700000
        });

        console.log('Contract deployed at address:', deployedContract.options.address);

        // No need to call addTask since the tasks are already added during deployment
    } catch (error) {
        console.error('Error deploying contract:', error);
    }
}
const axios = require('axios');
const url = 'http://127.0.0.1:8000/api/v1/projects/';
axios.get(url)
    .then(response => {
        const taskData = response.data.map(item => ({

            taskSets: item.task_set.map(task => task.task_name).join(', '),
            name: item.name,
            slug: item.slug,
            efforts: item.efforts,
            status: item.status,
            deadLine: item.deadline,
            completedPer: item.complete_per,
            description: item.description,
            addDate: item.add_date,
            updDate: item.upDate,
            company: item.company,
            assignees: item.assign,
        }));

        //console.log.out(taskData);
        // Deploy the contract with the organization data
        deployContract(taskData);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });




app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
