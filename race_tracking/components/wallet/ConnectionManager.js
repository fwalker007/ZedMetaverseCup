import React from 'react';
import { SignInPlayer } from "../../libs/playerManager";
import {ethers} from "ethers"


export function GetWalletAddress(){   
    try {
        const address = localStorage.getItem('address');
        return(address)
    } catch (ex) {
        console.log(ex)
    }
}

export default async function ConnectionManager(){

    let isConnected = false
 
    try {
        
        if( !window.ethereum )
            throw new Error("You need to have a crypto wallet to connect")

        await window.ethereum.send("eth_requestAccounts")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const signature = await signer.signMessage("ZED.RUN")
        const address = await signer.getAddress()

        console.log(signature)
        SignInPlayer(signature)
        
        isConnected = true

        localStorage.setItem('address', address);
        
        return({isConnected, address})

    } catch (ex) {
        console.log(ex)
    }
    
}

