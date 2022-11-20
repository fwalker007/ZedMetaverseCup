import { setContext } from '@apollo/client/link/context';
import {ApolloClient, InMemoryCache, createHttpLink, gql} from '@apollo/client';
import {api_token} from "./wallet/ConnectionManager";
 
export const httpLink = createHttpLink({
  uri: 'https://zed-ql.zed.run/graphql',
});

export const authLink = setContext((_, { headers }) => {
   // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: api_token ? `Bearer ${api_token}` : "",
    }
  }
}); 

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});


export const GET_QUALIFYING_RACES =  gql`
query($horseId:[Int], $dates: Dates){
  get_race_results(
   first:100
   input:
   {only_my_racehorses: true,
   is_tournament: false,
   distance: {
     from: 1000,
     to: 2600
   },
   dates: $dates
   horses:$horseId
   }
 ) { 
   edges {
     node {
       name
       fee
       length
       startTime: start_time
       raceId: race_id
       horses {
         horseId: horse_id
         time: finish_time
         position: final_position
         name
         owner: owner_address
         breedType: breed_type
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

export const GET_RACES_QL_HISTORY =  gql`
query($horseId:[Int], $dates: Dates){
  get_race_results(
   first:100
   input:
   {only_my_racehorses: true,
   is_tournament: false,
   distance: {
     from: 1000,
     to: 2600
   },
   dates: $dates
   horses:$horseId
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

export const GET_RACES_QL =  gql`
query (	$horsesIds: [Int] ){
  get_race_results(
   first:1
   input:
   {only_my_racehorses: true,
   is_tournament: false,
   distance: {
     from: 1000,
     to: 2600
   },
   horses:  $horsesIds 
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

export const GET_TOURNAMENT_RACES_QL =  gql`
query (	$horsesIds: [Int], $dates: Dates ){
  get_race_results(
   first:100
   input: 
   {only_my_racehorses: true,
   is_tournament: false,
   distance: {
     from: 1000,
     to: 2600
   },
   dates: $dates
   horses: $horsesIds
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