
import { useState, useEffect  } from "react";
import { useWeb3React } from "@web3-react/core"
import calculateStats, {AgregatePositions,GetCurrentTournament,calculeMaxWinPlaceStats} from '../libs/raceStatsManager'
import GetRacesQueryString, {client, GET_RACES_QL, GET_RACES_QL_2} from "../libs/graphQLManager"
import GetPlayerHorses from '../libs/playerManager';
import HorseTournamentInfoItem from "./horseTournamenInfoItem"
import { injected } from "../components/wallet/connector"
import MetaMaskFoxSvg from '../components/MetaMaskFox'

export default function TournamentCurrentStats()
{
  const [racesData,setRacesData] = useState([]);

  const { active, account, library, connector, activate, deactivate, sign } = useWeb3React()

  useEffect( () => {
    
    const message = [
      "Zed.run"].join("\n")

    loadRacesData()
  }, [active])

  async function connect() {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function loadRacesData()
  {
    if( active == false )
      return

    const signature = await library?.getSigner().signMessage('Message')




   // const signature = await library?.getSigner().signMessage('Message')
    console.log(signature)

    setRacesData( await LoadData(account) )
    console.log(racesData)
 }


  return (
      
     <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
               
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tournament 
                    </th>
                    <th>
                    </th>
                    <th>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" >
                      {active ? <span> <b>{account}</b></span> : <span>Not connected</span>}
                    </th>
                    <th>
                    <button  onClick={connect} className="bg-gradient-to-r from-teal-500 to-teal-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center">
                    <MetaMaskFoxSvg></MetaMaskFoxSvg>
                      <span>Connect to MetaMask</span>
                    </button>                
                    </th>
                   </tr>
                </thead> 

                <thead className="bg-gray-50">
                  <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horse
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">                
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Placement
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prefered length
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead> 

                <tbody className="bg-white divide-y divide-gray-200">
                  {racesData.map((racesStats) => (
                    <tr key={racesStats.name}>
                        <td className="px-4 py-2">
                        <div className='w-12'>
                          <div className="h-10 w-12">
                            <img className="h-12 w-12 rounded-full" src={racesStats.img} alt="" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="items-Left">
                          <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{racesStats.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="items-center">
                          <div className="ml-4">
                            <HorseTournamentInfoItem positions={racesStats.position} />
                            <HorseTournamentInfoItem positions={racesStats.raceLength} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="items-Left">
                          <div className="ml-4"/>      
                          <div className="text-sm text-center font-medium text-gray-900">{racesStats.preferLength}</div>      
                          <div className="text-sm text-center font-medium text-gray-900">{racesStats.winPecent.toFixed(2)}% / {racesStats.placePercent.toFixed(2)}%</div>      
                        </div>
                      </td>
                      <td className="px-6 py-4 flex whitFirst woespace-nowrap">
                      </td>
                    </tr>

                  ))}  
                
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      )
                  }
    
    
//export async function getStaticProps()
//{
  //const public_address =  "0x6008Fd486b7B85Ff82150C85F6CE80a2632B6762"
//}

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
    //console.log(currentTournament)
   
    const raceStatsTotal = await client.query({
      query: GET_RACES_QL,
      variables: {
        horseIds: {horsesIDs}
      }
    })

    console.log(raceStatsTotal)

    const { data } = await client.query({
        query: GET_RACES_QL_2,
        variables: {
        horseIds: {horsesIDs},
        dates: 	{
			      "from": currentTournament.qualificationStartDate,
			      "to": currentTournament.qualificationEndDate
		      }
        }
    })
    let currentTourneyStats = []
    playersHorses.map( (horseInfo) => {
      let horsesRacesInfo = AgregatePositions(data.get_race_results.edges,horseInfo.horse_id)
      let winStats = calculeMaxWinPlaceStats(raceStatsTotal.data.get_race_results.edges, horseInfo.horse_id)
      horsesRacesInfo.name = horseInfo.hash_info.name
      horsesRacesInfo.img = horseInfo.img_url
      if( winStats != undefined ){ //Win stats will be undefined if there are not races defined for a horse
        horsesRacesInfo.preferLength = winStats.Length
        horsesRacesInfo.winPecent = winStats.Wins
        horsesRacesInfo.placePercent = winStats.Placed
      }      
      currentTourneyStats.push(horsesRacesInfo);
    })
    currentTourneyStats = currentTourneyStats.filter(x => x !== undefined);
    console.log(currentTourneyStats)


    return (
         currentTourneyStats
    )
}
