import jwt_decode from "jwt-decode";
import {ethers} from "ethers"

export let api_token 

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

export function IsAPITokenValid(){
     api_token = localStorage.getItem('api_token');   
    
    console.log("TOKEN VALID?")
    console.log(api_token)

    //Has token expired?
    if( api_token === undefined){  
        console.log("NOT VALID")      
        return(false)
    }

    let decoded = jwt_decode(api_token);
    console.log(decoded);
 
    if (Date.now() >= decoded.exp * 1000) {
        console.log("EXPIRED")
        console.log(decoded.exp)  
        return false;
      }

    console.log("YES VALID")
    return(true)
}

export async function SignInPlayer(signature){    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({"params_for_token":
        {"signed_message":signature}})
    }; 

    var response = await fetch('https://api.zed.run/api/v1/auth/ws_token', requestOptions)
    const api_token_jason = await response.json()
    console.log( api_token_jason )
    
    api_token = api_token_jason.token
    
    localStorage.setItem('api_token', api_token);

    console.log(api_token)
}