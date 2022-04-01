import {gql} from '@apollo/client';

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
