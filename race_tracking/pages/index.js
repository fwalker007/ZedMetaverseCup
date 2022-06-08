import { useState, useEffect  } from "react"
import {ApolloProvider} from '@apollo/client';
import { CircularProgress } from "@material-ui/core"
import {GetCurrentTournament } from "../components/raceStatsManager"
import {client, GET_RACES_QL} from "../components/graphQLManager"
import GetPlayerHorses from '../components/playerManager';
import TournamentTableHeader from "../components/TournamentTableHeader"
import ConnectionManager, {GetWalletAddress, IsAPITokenValid} from "../components/wallet/ConnectionManager"
import Horse from "../components/Horse";

export default function TournamentCurrentStats()
{  

  const [racesData,setRacesData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [connection, setConnection] = useState({})
  const [currentTournament, setCurrentTournament] = useState({})
  const [playersHorses,setPlayersHorses] = useState([])

  useEffect(() => {
    const address = GetWalletAddress()
    if( address != undefined ){ //There is and wallet that has connected
      //We need the api_key then
      if( IsAPITokenValid() ){
        setConnection({isConnected: true, address: address})
      }
    }  

  }, [])

  useEffect(() => {
    if( connection.isConnected ){ 
      loadRacesData(connection?.address);
    }
  }, [connection?.isConnected, connection?.address])

  async function ConnectWallet(){
    setConnection( await ConnectionManager() )  
  }

  async function loadRacesData(anAddress){
    setIsLoading(true)
    try{
       const res = await LoadData(anAddress) 
       setPlayersHorses(res.playersHorses)
     //  setRacesData(res.currentTourneyStats)
       setCurrentTournament(res.currentTournament)
       setRacesData(res.raceStatsTotal)
    }catch(err) {}
    setIsLoading(false)
 } 
    
 const sortHorsesList = (horseID, tourneyPoints) => {

 // console.log("HORSE ID " + horseID + " POINTS: " +  tourneyPoints);

  const myHorse = playersHorses.find((horse) => horse.horse_id === horseID )
  if( myHorse.tourneyPoints != tourneyPoints){
    myHorse.tourneyPoints = tourneyPoints;
    sortHorsesByPoints();
  }
 } 
 
 const sortHorsesByPoints = () =>
 { 
  //  console.log("Sort Horses =============================================================")
    playersHorses = playersHorses.sort(function (a, b)
    {
      //Sort by tournament points
      if (a.tourneyPoints > b.tourneyPoints) return -1;
      if (a.tourneyPoints < b.tourneyPoints) return 1;
    
      //return 0;
      // If tournament points equal sort by win rate
      if (a.win_rate < b.win_rate) return 1;
      if (a.win_rate > b.win_rate) return -1;

      return 0;
    });
    
   console.log(playersHorses)

    setPlayersHorses([...playersHorses]);  
}

 const Horses = () =>(
    playersHorses.map( (horseInfo) => {   
      //console.log(horseInfo.hash_info.name);
      return(       
        <Horse currentTournament={currentTournament} horse={horseInfo} racesHistorycalData={racesData} onNewPointsUpdated={sortHorsesList} onChangesSortHorses={sortHorsesByPoints}/>
      )
    }) 
 )

 const Circle = () =>(
  <tr>
    <td colSpan="4" className="text-center" >
      <div >
        <CircularProgress
          size={200}
          thickness={5}
          style={{ padding: "15px", color: "#27b089" }} />
      </div>
    </td>
   </tr>
 )

  return (
      <ApolloProvider client={client}>
        
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
       
       <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
         <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
           <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
             <table className="min-w-full divide-y divide-gray-200">
              
               <TournamentTableHeader tournamentName={currentTournament.name}  isConnected={connection?.isConnected} address={connection?.address} connect={ConnectWallet}  /> 

               <thead className="bg-gray-50">
                 <tr>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Horse
                   </th>           
                   <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Placement
                   </th>
                   <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">                
                     Avg Points
                   </th>  
                   <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Prefered length
                   </th>
                 </tr>
               </thead> 

               <tbody className="bg-white divide-y divide-gray-200">
                 { (connection?.isConnected & isLoading) ?
                    (<Circle/> ) :
                    (<Horses/> )
                 }              
               </tbody>

             </table>
           </div>
         </div>
       </div>       
     </div>

      </ApolloProvider>
      )
  }
   

export async function LoadData(public_address)
{ 
    console.log( "Wallet Address " + public_address)

  //Get the players horses
    let playersHorses = await GetPlayerHorses(public_address) 
    console.log("\n  ============================ PLAYER HAS " + playersHorses.length + " HORSES  ============================================== " )
 
  //Get information on the tournamnet currently running
    let currentTournament =  await GetCurrentTournament()
   console.log(currentTournament)

   let horsesIDs = playersHorses.map( (horse) => { 
    horse.tourneyPoints = 0
    return(horse.horse_id)
   })

  //Get the player race information up to the trounament 
    const raceStatsTotal = await client.query({
      query: GET_RACES_QL,
      variables: {
        horseIds: {horsesIDs}
      }
    })

//  console.log(raceStatsTotal)

  // playersHorses = playersHorses.slice(1,2)
   console.log(playersHorses)
    
   return (
    { currentTournament, playersHorses, raceStatsTotal }
   )
}
