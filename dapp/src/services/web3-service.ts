import Web3 from "web3";
import ABI from '../abi.json';

export async function mint() {
    if(!window.ethereum) {
        throw new Error('No MetaMask found!');
    } else {
        const web3 = new Web3(window.ethereum); // connect to metamask

        const accounts = await web3.eth.requestAccounts(); // request for accounts in metamask, receives and array

        if(!accounts || accounts.length === 0) {
            throw new Error('No permission given!');
        }

        const contract = new web3.eth.Contract(ABI, '0x75e4187AA954a7d65E72531FA20d46fd7fd7893F', { from: accounts[0] });

        const transaction = await contract.methods.mint().send();

        return transaction.transactionHash;
    }
}