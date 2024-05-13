

module.exports = {
  // ...
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, // Change the port here
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.8.17", // Replace with your Solidity version
      settings: {
        optimizer: {
          enabled: true,
          runs: 200 // Adjust the number of runs as needed
        },
        viaIR: true // Enable the via-ir option
      }
    }
  }
};