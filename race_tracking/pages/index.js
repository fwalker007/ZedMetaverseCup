import { useState, useRef, useEffect } from 'react';
import { ApolloClient, createHttpLink, InMemoryCache, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import calculateStats, {calculeMaxWinPlaceStats} from '../libs/raceStatsManager'

export default function Home({ racesData }) {

//console.log(raceStats)

  return (
    <div className="flex flex-col">
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
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
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-30 w-20">
                        <img className="h-20 w-20 rounded-full" src={racesStats.img} alt="" />
                        <div className="text-sm font-medium text-gray-900">{racesStats.horseName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-Left">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{racesStats.Length}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{racesStats.Wins.toFixed(2)}%</div>
                  </td>
                  <td className="px-6 py-4 whitFirst woespace-nowrap">
                    <div className="text-sm text-gray-500">{racesStats.Placed.toFixed(2)}%</div>
                  </td>
                </tr>
              ))}
              {
                    console.log(racesData)
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
      query: gql`
      query GetRaceResults {
        get_race_results(
         first:1000
         input:
         {only_my_racehorses: true,
         is_tournament: false,
         distance: {
           from: 1000,
           to: 2600
         },
         horses: [145639,187382,209869]
         }
       ) {
         edges {
           node {
             name
             length
             startTime: start_time
             raceId: race_id
             horses {
               horseId: horse_id
               time: finish_time
               position: final_position
               name
               gate
               owner: owner_address
               bloodline
               gender
               breedType: breed_type
               genotype: gen
               races
               coat
               winRate: win_rate
               career
               skin {
                 name
                 image
                 texture
               }
               hexCode: hex_color
               imgUrl: img_url
               class
               stable: stable_name
             }
           }
         }
       }
     }    
      `
    })

       
    let winPlaceStatsForAllHorses = []

    winPlaceStatsForAllHorses.push(calculeMaxWinPlaceStats(data.get_race_results.edges, 145639))
    winPlaceStatsForAllHorses.push(calculeMaxWinPlaceStats(data.get_race_results.edges, 187382))
    winPlaceStatsForAllHorses.push(calculeMaxWinPlaceStats(data.get_race_results.edges, 209869))

    console.log(winPlaceStatsForAllHorses)

    return {
      props: {
        racesData: winPlaceStatsForAllHorses
      }
    }
  }


  


