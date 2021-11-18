require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

//import dotenv from 'dotenv';
//dotenv.config()



// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async(taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.10",
    networks: {
        rinkeby: {
            url: process.env.REACT_APP_API_ALCHEMY,
            accounts: [process.env.REACT_APP_API_RINKEBY],
        },
        mainnet: {
            chainId: 1,
            url: process.env.REACT_APP_API_ALCHEMY_MAIN,
            accounts: [process.env.REACT_APP_API_RINKEBY],
        },

    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: process.env.REACT_APP_API_ETHERSCAN,
    }

};