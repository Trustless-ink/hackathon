// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function main() {
  const Trustless = await ethers.getContractFactory("Trustless");

  // Start deployment, returning a promise that resolves to a contract object
  console.log("Deploying Contract...");
  const trustless = await Trustless.deploy();

  await trustless.deployed();
  console.log("Contract deployed to address:", trustless.address);
  console.log("Waiting 30 seconds before verification...");

  // Add a delay because if you try to verify too quickly,
  // Etherscan won't find the contract
  await delay(30000);

  // Verify the contract on Etherscan
  await hre.run("verify:verify", {
    address: trustless.address,
    constructorArguments: [],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
