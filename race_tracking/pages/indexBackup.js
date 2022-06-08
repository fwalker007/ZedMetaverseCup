import { useState, useEffect  } from "react"
import {AgregatePositions,GetCurrentTournament,calculeMaxWinPlaceStats, CalculateTournamentPoints} from '../libs/raceStatsManager'
import {client, GET_RACES_QL, GET_TOURNAMENT_RACES_QL} from "../libs/graphQLManager"
import GetPlayerHorses, {IsAPITokenValid} from '../libs/playerManager';
import { CircularProgress } from "@material-ui/core"
import RaceStatsItem from "../components/raceStatsItem"
import TournamentTableHeader from "../components/TournamentTableHeader"
import ConnectionManager, {GetWalletAddress} from "../components/wallet/ConnectionManager"


export default function TournamentCurrentStats()
{  

  const [racesData,setRacesData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [connection, setConnection] = useState({})
  const [currentTournament, setCurrentTournament] = useState({})

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
       setRacesData(res.currentTourneyStats)
       setCurrentTournament(res.currentTournament)
    }catch(err) {}
    setIsLoading(false)
 }

 
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
                  { (connection?.isConnected & isLoading) ? (<Circle/> ) : ( 
                      racesData.map((racesStats) => 
                        <RaceStatsItem key={racesStats.horse_id} raceStatsData={racesStats}/>
                    ))   
                  }              
                </tbody>

              </table>
            </div>
          </div>
        </div>       
      </div>

      )
  }


export async function LoadData(public_address)
{ 
    console.log( "Wallet Address " + public_address)

    let playersHorses = await GetPlayerHorses(public_address) 
    console.log("\n  ============================ PLAYER HAS " + playersHorses.length + " HORSES  ============================================== " )
    let horsesIDs = playersHorses.map( (horse) => { 
        return(horse.horse_id)
    })

    if(horsesIDs.length <= 0 ){
        return(
             []
        )
    }

    //Get information on the tournamnet currently running
    let currentTournament =  await GetCurrentTournament()
    console.log(currentTournament)
   
    const raceStatsTotal = await client.query({
      query: GET_RACES_QL,
      variables: {
        horseIds: {horsesIDs}
      }
    })

  //  console.log(raceStatsTotal)

    let tournamentRacesFiltered  = raceStatsTotal.data.get_race_results.edges.filter( function( element ) {
          return element.node.startTime > currentTournament.qualificationStartDate;
    });
   // console.log(tournamentRacesFiltered)

 
    let currentTourneyStats = []
    playersHorses.map( (horseInfo) => {
      let horsesRacesInfo = AgregatePositions(tournamentRacesFiltered,horseInfo.horse_id)
      let winStats = calculeMaxWinPlaceStats(raceStatsTotal.data.get_race_results.edges, horseInfo.horse_id)
      horsesRacesInfo.horse_id = horseInfo.horse_id
      horsesRacesInfo.class = horseInfo.class
      horsesRacesInfo.name = horseInfo.hash_info.name
      horsesRacesInfo.img = horseInfo.img_url
      if( winStats != undefined ){ //Win stats will be undefined if there are not races defined for a horse
        horsesRacesInfo.preferLength = winStats.Length
        horsesRacesInfo.winPecent = winStats.Wins
        horsesRacesInfo.placePercent = winStats.Placed
      }   
      horsesRacesInfo.tourneyPoints = CalculateTournamentPoints(horsesRacesInfo, currentTournament.pointsStructure)
      currentTourneyStats.push(horsesRacesInfo);
    })
    currentTourneyStats = currentTourneyStats.filter(x => x !== undefined);
    //console.log(currentTourneyStats)


    return (
        { currentTourneyStats, currentTournament }
    )
}
