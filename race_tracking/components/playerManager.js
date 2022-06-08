const MAX_HORSES_PER_RQUEST = 10

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
