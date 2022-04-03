
import { ApolloClient, createHttpLink, InMemoryCache, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import calculateStats, {AgregatePositions,GetCurrentTournament} from '../../libs/raceStatsManager'
import GetRacesQueryString, {GET_RACES_QL_2} from "../../libs/graphQLManager"
import GetPlayerHorses from '../../libs/playerManager';

export default function TournamentCurrentStats({ racesData })
{
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
                      Placement
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                            <div className="text-sm text-center font-medium text-gray-900">{racesStats.position}</div>
                            <div className="text-sm text-center font-medium text-gray-900">{racesStats.raceLength}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="items-Left">
                          <div className="ml-4"/>                       
                        </div>
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
    console.log("\n  ============================ PLAYER HAS " + playersHorses.length + " HORSES  ============================================== " )
    let horsesIDs = playersHorses.map( (horse) => { 
        return(horse.horse_id)
    })

    if(horsesIDs.length <= 0 ){
        return{
            props: {
            racesData: []
        }
        }
    }

    //Get information on the tournamnet currently running
    let currentTournament =  await GetCurrentTournament()
    console.log(currentTournament)

    const httpLink = createHttpLink({
        uri: 'https://zed-ql.zed.run/graphql',
    });
        
    const authLink = setContext((_, { headers }) => {
        // get the authentication token from local storage if it exists
        const token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjcnlwdG9maWVsZF9hcGkiLCJleHAiOjE2NTAyMTMwNzQsImlhdCI6MTY0Nzc5Mzg3NCwiaXNzIjoiY3J5cHRvZmllbGRfYXBpIiwianRpIjoiNjQ3N2IyYTYtMmRjZi00OTdjLTlkMzQtYWVlZjJiZmI1OGU4IiwibmJmIjoxNjQ3NzkzODczLCJzdWIiOnsiZXh0ZXJuYWxfaWQiOiJjMTJlNWZhNy02ZDMzLTQwODYtOTAxNi03Y2YwM2ExNTVkMzkiLCJpZCI6MzQ2OTc4LCJwdWJsaWNfYWRkcmVzcyI6IjB4NjAwOEZkNDg2YjdCODVGZjgyMTUwQzg1RjZDRTgwYTI2MzJCNjc2MiIsInN0YWJsZV9uYW1lIjoiVGhlIERpc2NhcmRlZCDwn5SlIn0sInR5cCI6ImFjY2VzcyJ9.YNeuucheiOKMojqwv_NODu9lrNsiphXcJr6U5QDPkT7QllOSN7ERx-gdkCsPbTgNKWrCB0uEEUnyl3RwWb2_XQ';
        // return the headers to the context so httpLink can read them
        return {
            headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
            }
        }
    });
        
    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    });

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


    let winPlaceStatsForAllHorses = []
    
    playersHorses.map( (horseInfo) => {

      let horsesRacesInfo = AgregatePositions(data.get_race_results.edges,horseInfo.horse_id)
      winPlaceStatsForAllHorses.push(horsesRacesInfo);

    })


    winPlaceStatsForAllHorses = winPlaceStatsForAllHorses.filter(x => x !== undefined);
    console.log(winPlaceStatsForAllHorses)

    return {
        props: {
        racesData: winPlaceStatsForAllHorses
        }
    }
    }
