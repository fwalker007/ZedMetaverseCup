import { useState, useRef, useEffect } from 'react';
import { ApolloClient, createHttpLink, InMemoryCache, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


export default function Home({ racesData }) {

  const MAX_RACES = 9
  const [raceStats, setRaceStats] = useState()


  function getInitialStats() {

    let myRaceStats = []

    for( let i=0; i<MAX_RACES; i++){ 
      let raceStatItem = {
        length: (i * 200) + 1000,
        wins: 0,
        placeds: 0,
        numOfRaces: 0,
        winPercent: 0,
        placePercent: 0
      }
      myRaceStats.push(raceStatItem)
    }
    setRaceStats(myRaceStats)
  }  

 const setUpdate = (length, isWin, isPlaced, totalRaces) => {
    setRaceStats(prevState =>
      prevState.map(raceStat => {
        if (raceStat.length === length) {
          return {
            ...raceStat,
            wins: raceStat.wins + isWin,
            place: raceStat.placeds + isPlaced,
            totalRaces: raceStat.numOfRaces + totalRaces
          }
        }
        return raceStat
      })
    )
  }
  
  racesData.forEach((race) => {
    race.node.horses.forEach((horse) => {
      if( horse.horseId === 145639)
      {
        let isWin = 0;
        let isPlaced = 0;

        if( horse.position == 1 )
        {

          isWin = 1;
        }
        else if( horse.position == 2 || horse.position == 3)
        {
          isPlaced = 1;
        }

        let index = 200 / (race.node.length - 1000) 
        console.log(index)
        console.log( myRaceStats[index] )
        //setUpdate(race.node.length, isWin, isPlaced, 1)
      }            
    });
  })
       
 //console.log(raceStats)

  return (
    <div className="flex flex-col">
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Surface Preference
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead> 
            <tbody className="bg-white divide-y divide-gray-200">

  


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
         horses: [145639]
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

       
    const myRaceStats = data.get_race_results.edges.map( (race) => { 
        const myhorse = race.node.horses.find( (horse) => horse.horseId === 145639 )
        return( { name: myhorse.name, position: myhorse.position })
    })

    console.log( myRaceStats )

    return {
      props: {
        racesData: data.get_race_results.edges
      }
    }
  }


  


