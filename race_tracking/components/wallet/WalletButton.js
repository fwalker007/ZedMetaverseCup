import MetaMaskFoxSvg from "./MetaMaskFox"


export default function WalletButton({connect})
{
    return( 
        <button onClick={connect} className="bg-gradient-to-r from-teal-500 to-teal-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center">
            <MetaMaskFoxSvg></MetaMaskFoxSvg>
            <span>Connect to MetaMask</span>
        </button>     
    )

}