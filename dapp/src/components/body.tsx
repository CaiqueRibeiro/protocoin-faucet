import { mint } from "../services/web3-service";

function Body() {
    async function handleButtonClick() {
       try {
        await mint();
       } catch (error) {
        alert((error as Error).message);
       }
    }

    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center p-11 gap-6 text-white">
                <h3 className="text-4xl">Get your ProtoCoins</h3>
                <p>Once a day, earn 1.000 coins for free just connecting your MetaMask below</p>
                <button onClick={handleButtonClick} className="px-5 py-3 rounded-md bg-white text-gray-800 font-bold text-2xl hover:bg-emerald-500 hover:text-white">Connect MetaMask</button>
            </div>
        </div>
    )
}

export { Body };