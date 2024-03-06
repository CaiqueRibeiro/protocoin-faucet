import Web3 from "web3";

export async function mint() {
    if(!window.ethereum) {
        throw new Error('No MetaMask found!');
    } else {
        const web3 = new Web3(window.ethereum); // connect to metamask

        const accounts = await web3.eth.requestAccounts(); // request for accounts in metamask, receives and array

        if(!accounts || accounts.length === 0) {
            throw new Error('No permission given!');
        }

        alert(accounts[0]);
    }
}