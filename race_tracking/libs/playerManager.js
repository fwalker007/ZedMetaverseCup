import { TextsmsTwoTone } from "@material-ui/icons"

const MAX_HORSES_PER_RQUEST = 10
export let api_token 

export default async function GetPlayerHorses(stableAddress){
    let playerHorsesDO = []
    let mergedHorses = []
    let offset = 0

    do{
        var response = await fetch("https://api.zed.run/api/v1/horses/get_user_horses?public_address=" + stableAddress + "&offset=" + offset + "&horse_name=&sort_by=horse_name_asc") 
        playerHorsesDO = await response.json()  
        mergedHorses = [...mergedHorses,...playerHorsesDO];   
        offset += MAX_HORSES_PER_RQUEST
    }while( playerHorsesDO.length > 0)

    return(mergedHorses)
}

export function IsAPITokenValid(){

    api_token = localStorage.getItem('api_token');
    //Has token expired?
    if( api_token != undefined){        
        return(true)
    }
    return(false)
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

 //   console.log(api_token)
}