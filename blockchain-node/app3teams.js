const express = require('express');
const { Web3 } = require('web3'); // Change to uppercase 'Web3'
const MyContract = require("./build/contracts/Organization.json");
const contractABI = MyContract.abi;
const contractAddress = '0x51f0e16F0482F1f8F6B7BDDA85f040a3B63f6319'; // Enter your contract address here 
const rpcEndpoint = 'http://127.0.0.1:8545'; // Enter your RPC server endpoint URL here 

const app = express();
const web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint));

const contract = new web3.eth.Contract(contractABI, contractAddress);

app.use(express.json());

// Function to serialize block data
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

// Get information about all teams
app.get('/teams', async (req, res) => {
    try {
        const TeamsData = [];
        const orgCount = (await contract.methods.getOrgCount().call()).toString();

        for (let i = 1; i <= orgCount; i++) {
            const org = await contract.methods.getOrganization(i).call();
            TeamsData.push({
                id: org.id.toString(),
                socialName: org.socialName.toString(),
                name: org.name.toString(),
                email: org.email.toString(),
                city: org.city.toString(),
                foundDate: org.foundDate.toString(),
            });
        }

        res.json({ TeamsData });
    } catch (error) {
        console.error('Error fetching organization data:', error);
        res.status(500).json({ error: 'An error occurred while fetching organization data' });
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

const axios = require('axios');
const url = 'http://127.0.0.1:8000/api/v1/Teamsapi/';
axios.get(url)
    .then(response => {
        const orgsData = response.data.map(item => ({
            socialName: item.social_name,
            name: item.name,
            email: item.email,
            city: item.city,
            foundDate: item.found_date
        }));

        // Deploy the contract with the organization data
        deployContract(orgsData);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

async function deployContract(orgsData) {
    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            console.error('No Ethereum accounts found.');
            return;
        }

        const contract = new web3.eth.Contract(MyContract.abi);

        // Map the orgsData to match the expected OrgData struct format
        const orgDataArray = orgsData.map(org => [
            0, // Placeholder for the id field
            org.socialName,
            org.name,
            org.email,
            org.city,
            parseInt(org.foundDate) // Convert foundDate to a number
        ]);

        const deployedContract = await contract.deploy({
            data: MyContract.bytecode,
            arguments: [orgDataArray]
        }).send({
            from: accounts[3], // Use the first account from the list
            gas: 4700000
        });

        console.log('Contract deployed at address:', deployedContract.options.address);
    } catch (error) {
        console.error('Error deploying contract:', error);
    }
}



app.listen(3000, () => {
    console.log('Server listening on port 3000');
});