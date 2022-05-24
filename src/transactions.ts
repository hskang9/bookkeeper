
/// executes txs without race conditions in production environment
/// example
/// const tx = await factory.connect(deployer).setFeeTo(deployer.address);
/// await executeTx(tx, "Execute setFeeTo at")
/// logs 
/// Executes setFeeTo at: 0xf81ded9ca5936a06f9a4ee53db8a568eb84ffd39095ff6dfe0ff5aa60bb98058

import { ethers }  from "ethers";
import { Test } from "mocha";
import { ChainId, recordAddress, recordAbi } from ".";
import { recordProperty } from "./property_book";

/// Mining...
export async function executeTx(tx: any, event: string) {
    console.log(`${event}: ${tx.hash}`);
    console.log("Mining...");
    return await tx.wait();
}
  
/// deploys a contract without race conditions in production environment
/// example
/// console.log(`Deploying Standard AMM router with the account: ${deployer.address}`);  
/// const Router = await ethers.getContractFactory("UniswapV2Router02");
/// const router = await Router.deploy(factory.address, weth);
/// await deployContract(router, "UniswapV2Router02")
/// logs 
/// UniswapV2Router02 address: 0x4633C1F0F633Cc42FD0Ba394762283606C88ae52
/// Mining...
export async function deployContract(contract: string, deploy: ethers.Contract, contract_name: string, properties: Object | null = null) {
    const chainId = (await deploy.provider.getNetwork()).chainId;
    console.log(process.cwd() + `types/factories/${contract}__factory`)
    const types = require(process.cwd() + `/types/factories/${contract}__factory`)
    const abi  = types[`${contract}__factory`].abi
    // Get network from chain ID
    let chain = ChainId[chainId]
    console.log(`${contract_name} address at Chain Id of ${chain}:`, deploy.address);
    console.log(`Mining at ${deploy.hash}...`);
    await deploy.deployed();
    await recordAddress(contract_name, chain, deploy.address)
    await recordAbi(contract_name, chain, abi)
    if(properties) {
      for (var key in properties) {
        let property = new Map()
        property[key] = properties[key]
        recordProperty(contract_name, chain, property)
      }
    }
    return deploy;
}

export async function executeFrom(ethers: any, deployer: any, func: any) {
    // Get before state
    console.log(
      `Deployer balance: ${ethers.utils.formatEther(
        await deployer.getBalance()
      )} ETH`
    );
    await func()
    // Get results
    console.log(
      `Deployer balance: ${ethers.utils.formatEther(
        await deployer.getBalance()
      )} ETH`
    );
  }