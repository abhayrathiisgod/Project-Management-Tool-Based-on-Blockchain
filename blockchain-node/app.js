const express = require('express');
const { Web3 } = require('web3'); // Change to uppercase 'Web3'
const MyContract = require("./build/contracts/MyContract.json");
const contractABI = MyContract.abi;
const contractAddress = '0x85ddbad661f2E7Afe25C02beB0540c41DaeE4fD6'; // Enter your contract address here 
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

app.get('/numbers', async (req, res) => {
    try {
        const numbers = [];
        let fromBlock = 0; // Starting block number
        let toBlock = await web3.eth.getBlockNumber(); // Latest block number
        toBlock = Number(toBlock); // Convert BigInt to number

        while (fromBlock <= toBlock) {
            const events = await contract.getPastEvents('NumberSet', {
                fromBlock,
                toBlock: Math.min(fromBlock + 1000, toBlock), // Fetch events in batches of 1000 blocks
            });

            events.forEach(event => {
                numbers.push(event.returnValues.number.toString());
            });

            fromBlock += 1001; // Increment the starting block for the next batch
        }

        res.json({ numbers });
    } catch (error) {
        console.error('Error fetching numbers:', error);
        res.status(500).json({ error: 'An error occurred while fetching numbers' });
    }
});

app.post('/number', async (req, res) => {
    try {
        const { number } = req.body;
        if (!number) {
            return res.status(400).json({ error: 'Number is required' });
        }
        const accounts = await web3.eth.getAccounts();
        const result = await contract.methods.setNumber(number).send({ from: accounts[0] });
        res.json({ message: 'Number set successfully' });
    } catch (error) {
        console.error('Error setting number:', error);
        res.status(500).json({ error: 'An error occurred while setting the number' });
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
