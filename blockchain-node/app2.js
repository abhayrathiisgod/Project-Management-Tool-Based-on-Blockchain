const express = require('express');
const { Web3 } = require('web3'); // Change to uppercase 'Web3'
const MyContract = require("./build/contracts/UserContract.json");
const contractABI = MyContract.abi;
const contractAddress = '0x3FeC37F41863eD57d16e7F44DA13Ba811daB4D58'; // Enter your contract address here 
const rpcEndpoint = 'http://127.0.0.1:8545'; // Enter your RPC server endpoint URL here 

const app = express();
const web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint));

const contract = new web3.eth.Contract(contractABI, contractAddress);

app.use(express.json());

function serializeBlock(block) {
    return {
        number: block.number.toString(),
        hash: block.hash.toString(),
        parentHash: block.parentHash.toString(),
        nonce: block.nonce.toString(),
        sha3Uncles: block.sha3Uncles.toString(),
        logsBloom: block.logsBloom.toString(),
        transactionsRoot: block.transactionsRoot.toString(),
        stateRoot: block.stateRoot.toString(),
        receiptsRoot: block.receiptsRoot.toString(),
        miner: block.miner.toString(),
        difficulty: block.difficulty.toString(),
        totalDifficulty: block.totalDifficulty.toString(),
        size: block.size.toString(),
        extraData: block.extraData.toString(),
        gasLimit: block.gasLimit.toString(),
        gasUsed: block.gasUsed.toString(),
        timestamp: block.timestamp.toString(),
        transactions: block.transactions,
        uncles: block.uncles.toString(),
    };
}

// Get information about all blocks
app.get('/users', async (req, res) => {
    try {
        const userData = [];
        const userCount = (await contract.methods.getUserCount().call()).toString();

        for (let i = 0; i < userCount; i++) {
            const user = await contract.methods.users(i).call();
            userData.push({
                userId: user.userId.toString(), // Convert to string
                email: user.email,
                team: user.company.toString(), // Convert to string

            });
        }

        res.json({ userData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'An error occurred while fetching user data' });
    }
});
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

// app.get('/number', async (req, res) => {
//     const number = await contract.methods.getNumber().call();
//     res.json({ number: number.toString() }); // Convert BigInt to string
// });

// Deploy the contract with user data
async function deployContract(userData) {
    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            console.error('No Ethereum accounts found.');
            return;
        }

        const contract = new web3.eth.Contract(MyContract.abi);
        const deployedContract = await contract.deploy({
            data: MyContract.bytecode,
            arguments: [userData.map(user => [user.userId, user.email, user.company, user.projects])]
        }).send({
            from: accounts[2], // Use the first account from the list
            gas: 4700000
        });

        console.log('Contract deployed at address:', deployedContract.options.address);
    } catch (error) {
        console.error('Error deploying contract:', error);
    }
}

const axios = require('axios');
const url = 'http://127.0.0.1:8000/api/v1/UserProfile/';
axios.get(url)
    .then(response => {
        const userData = response.data.map(item => ({
            userId: item.user.id,
            email: item.user.email,
            company: item.company,
            projects: item.project
        }));

        // Deploy the contract with the user data
        deployContract(userData);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
