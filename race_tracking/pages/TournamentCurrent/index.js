import calculateStats, {calculeMaxWinPlaceStats} from '../../libs/raceStatsManager'
import {client, GET_RACES_QL} from "../../libs/graphQLManager"
import GetPlayerHorses from '../../libs/playerManager';

export default function Home({ racesData }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horse
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">                
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Length
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Win %
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Place %
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead> 
            <tbody className="bg-white divide-y divide-gray-200">

            {racesData.map((racesStats) => (
                <tr key={racesStats.Length}>
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
                      <div className="text-sm font-medium text-gray-900">{racesStats.horseName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="items-Left">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{racesStats.Length}</div>
                        <div className="text-sm font-medium text-gray-900">{racesStats.Races}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{racesStats.Wins.toFixed(2)}%</div>
                  </td>
                  <td className="px-6 py-4 whitFirst woespace-nowrap">
                    <div className="text-sm text-gray-500">{racesStats.Placed.toFixed(2)}%</div>
                  </td>
                  <td className="px-6 py-4 flex whitFirst woespace-nowrap">
                  </td>
                </tr>
              ))}
              {
                  //  console.log(racesData)
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  )
              }


  export async function getStaticProps()
  {
    const public_address =  "0x6008Fd486b7B85Ff82150C85F6CE80a2632B6762"

    let playersHorses = await GetPlayerHorses(public_address) 
    console.log(playersHorses)
    let horsesIDs = playersHorses.map( (horse) => { 
      return(horse.horse_id)
    })

    if(horsesIDs.length <= 0 )
    {
      return{
          props: {
            racesData: []
        }
      }
    }
      

    const { data } = await client.query({
      query: GET_RACES_QL,
      variables: {
        horseIds: {horsesIDs}
      }
    })


    let winPlaceStatsForAllHorses = []

    playersHorses.map( (horse) => {   
      winPlaceStatsForAllHorses.push(calculeMaxWinPlaceStats(data.get_race_results.edges, horse.horse_id))
    })

    winPlaceStatsForAllHorses.sort(function(a, b) {
      return b.Wins - a.Wins;
    });

    console.log(winPlaceStatsForAllHorses)


    return {
      props: {
        racesData: winPlaceStatsForAllHorses
      }
    }
  }


  


