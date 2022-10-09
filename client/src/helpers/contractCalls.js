import getWeb3 from "./getWeb3";
import { getJSONfromIPFS, pinJSONToIPFS } from "./pinata";

// The address of the contract
// make sure to update this whenever you redeploy a contract

import contractABI from "../contracts/ABIs/Trustless.json";

import contractAddress from "../contracts/addresses/Trustless.js";

export const mintProjectNFT = async (inputs, contextValue) => {
  const pinataResponse = await pinJSONToIPFS(inputs);

  if (!pinataResponse.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your tokenURI.",
    };
  }
  const tokenURI = pinataResponse.URI;
  let Contract_instance;
  try {
    const web3 = await getWeb3();
    Contract_instance = new web3.eth.Contract(contractABI.abi, contractAddress);
  } catch (error) {
    console.log(error);
  }
  console.log(tokenURI);
  await Contract_instance.methods
    .create(inputs.funding, tokenURI, inputs.intervals, inputs.milestones)
    .send({ from: contextValue.web3.accounts[0] });

  const success = true;
  const status = "Transaction posted!";
  return { success, status };
};

export const fundNFTCall = async (inputs, contextValue) => {
  const web3 = await getWeb3();
  const Contract_instance = new web3.eth.Contract(
    contractABI.abi,
    contractAddress
  );

  await Contract_instance.methods
    .contribute(inputs.id)
    .send({ from: contextValue.web3.accounts[0], value: inputs.amount });

  const success = true;
  const status = "Transaction posted!";
  return { success, status };
};

export const getAllProjects = async () => {
  const web3 = await getWeb3();
  const Contract_instance = new web3.eth.Contract(
    contractABI.abi,
    contractAddress
  );

  const projectCount = await Contract_instance.methods.projectCount().call();
  const projects = [];
  let URI;
  let data;
  for (let i = 1; i <= projectCount; ++i) {
    URI = await Contract_instance.methods.uri(i).call();
    data = await getJSONfromIPFS(URI);
    const projectBalance = await Contract_instance.methods
      .projectBalance(i)
      .call();
    const projectGoal = await Contract_instance.methods.projectGoal(i).call();
    data = {
      ...data,
      projectBalance,
      projectGoal,
    };
    projects.push(data);
  }
  return projects;
};

export const getInvestorProjects = async (contextValue) => {
  const web3 = await getWeb3();
  const Contract_instance = new web3.eth.Contract(
    contractABI.abi,
    contractAddress
  );

  const projectCount = await Contract_instance.methods.projectCount().call();
  const projects = [];
  let balance;
  for (let i = 1; i <= projectCount; ++i) {
    balance = await Contract_instance.methods
      .balanceOf(contextValue.web3.accounts[0], i)
      .call();
    if (balance > 0) {
      projects.push(i);
    }
  }
  return projects;
};

export const getFounderProjects = async (contextValue) => {
  const web3 = await getWeb3();
  const Contract_instance = new web3.eth.Contract(
    contractABI.abi,
    contractAddress
  );

  const projectCount = await Contract_instance.methods.projectCount().call();
  const projects = [];
  let fundraiser;
  for (let i = 1; i <= projectCount; ++i) {
    fundraiser = await Contract_instance.methods.fundraiser(i).call();
    if (fundraiser === contextValue.web3.accounts[0]) {
      projects.push(i);
    }
  }
  return projects;
};

export const getFundsAvailability = async (tokenID) => {
  const web3 = await getWeb3();
  const Contract_instance = new web3.eth.Contract(
    contractABI.abi,
    contractAddress
  );

  const fundsAvailable = await Contract_instance.methods
    .availableToWithdraw(tokenID)
    .call();

  return fundsAvailable;
};

export const withdrawFundingCall = async (contextValue, tokenID) => {
  const web3 = await getWeb3();
  const Contract_instance = new web3.eth.Contract(
    contractABI.abi,
    contractAddress
  );

  await Contract_instance.methods
    .withdrawFunds(tokenID)
    .send({ from: contextValue.web3.accounts[0] });
};
