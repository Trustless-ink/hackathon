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
    projects.push(data);
  }
  return projects;
};
