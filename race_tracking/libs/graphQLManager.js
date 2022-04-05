import { setContext } from '@apollo/client/link/context';
import {ApolloClient, InMemoryCache, createHttpLink, gql} from '@apollo/client';

export const httpLink = createHttpLink({
  uri: 'https://zed-ql.zed.run/graphql',
});

export const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists 
  let jwt = localStorage.getItem('jwt');
	let  token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjcnlwdG9maWVsZF9hcGkiLCJleHAiOjE2NTAyMTMwNzQsImlhdCI6MTY0Nzc5Mzg3NCwiaXNzIjoiY3J5cHRvZmllbGRfYXBpIiwianRpIjoiNjQ3N2IyYTYtMmRjZi00OTdjLTlkMzQtYWVlZjJiZmI1OGU4IiwibmJmIjoxNjQ3NzkzODczLCJzdWIiOnsiZXh0ZXJuYWxfaWQiOiJjMTJlNWZhNy02ZDMzLTQwODYtOTAxNi03Y2YwM2ExNTVkMzkiLCJpZCI6MzQ2OTc4LCJwdWJsaWNfYWRkcmVzcyI6IjB4NjAwOEZkNDg2YjdCODVGZjgyMTUwQzg1RjZDRTgwYTI2MzJCNjc2MiIsInN0YWJsZV9uYW1lIjoiVGhlIERpc2NhcmRlZCDwn5SlIn0sInR5cCI6ImFjY2VzcyJ9.YNeuucheiOKMojqwv_NODu9lrNsiphXcJr6U5QDPkT7QllOSN7ERx-gdkCsPbTgNKWrCB0uEEUnyl3RwWb2_XQ';

  if( jwt != null)
  {
    console.log(jwt)
    token = jwt.split(",")[0].split(":")[1].split("}")[0]
  }


  token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjcnlwdG9maWVsZF9hcGkiLCJleHAiOjE2NTAyMTMwNzQsImlhdCI6MTY0Nzc5Mzg3NCwiaXNzIjoiY3J5cHRvZmllbGRfYXBpIiwianRpIjoiNjQ3N2IyYTYtMmRjZi00OTdjLTlkMzQtYWVlZjJiZmI1OGU4IiwibmJmIjoxNjQ3NzkzODczLCJzdWIiOnsiZXh0ZXJuYWxfaWQiOiJjMTJlNWZhNy02ZDMzLTQwODYtOTAxNi03Y2YwM2ExNTVkMzkiLCJpZCI6MzQ2OTc4LCJwdWJsaWNfYWRkcmVzcyI6IjB4NjAwOEZkNDg2YjdCODVGZjgyMTUwQzg1RjZDRTgwYTI2MzJCNjc2MiIsInN0YWJsZV9uYW1lIjoiVGhlIERpc2NhcmRlZCDwn5SlIn0sInR5cCI6ImFjY2VzcyJ9.YNeuucheiOKMojqwv_NODu9lrNsiphXcJr6U5QDPkT7QllOSN7ERx-gdkCsPbTgNKWrCB0uEEUnyl3RwWb2_XQ';
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
}); 

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});


export const GET_RACES_QL =  gql`
query (	$horsesIds: [Int] ){
  get_race_results(
   first:10000000
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

export const GET_RACES_QL_2 =  gql`
query (	$horsesIds: [Int], $dates: Dates ){
  get_race_results(
   first:1000
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