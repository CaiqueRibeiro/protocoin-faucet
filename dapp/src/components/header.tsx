function Header() {
    return (
        <header className="border-b border-gray-700 w-screen h-24 flex text-white items-center justify-around">
            <span className="font-black text-2xl">ProtoCoin Faucet</span>

            <div className="flex items-center gap-5">
                <a href="" className="border-b-4 border-transparent py-3 hover:border-white transition duration-300 ease-in-out">Home</a>
                <a href="" className="border-b-4 border-transparent py-3 hover:border-white transition duration-300 ease-in-out">About</a>
            </div>
        </header>
    )
}

export { Header };