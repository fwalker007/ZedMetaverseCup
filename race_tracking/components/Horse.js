import React from "react"
import {useQuery} from "@apollo/client";
import {GET_RACES_QL_TOURNEY} from "./graphQLManager"
import {AgregatePositions,calculeMaxWinPlaceStats, CalculateTournamentPoints} from './raceStatsManager'
import RaceStatsItem from "./raceStatsItem";
  
export default function Horse (props)
{   
    const horseID = props.horse.horse_id;
    const horse = props.horse;
    const horseInfo = props.horse.hash_info; 
    const currentTournament = props.currentTournament;
    const racesData = props.racesHistorycalData;

    const { loading, error, data } = useQuery(GET_RACES_QL_TOURNEY,{
        variables: {
            horseId : [horseID],
            is_tournament: false,
            dates: 	{ 
                      "from": currentTournament.qualificationStartDate,
                      "to": currentTournament.qualificationEndDate
                  }
                },
                fetchPolicy: 'network-only',
                pollInterval: 10000, 
                notifyOnNetworkStatusChange:true
               // onCompleted: () => console.log("Call")

            });
   
            
    if (loading && data === undefined){ 
        //return( <div>Loading...</div>) 
        return(<></>)
      
    }
    if (error){ return (<div>Error :(</div>) }

    let tournamentData = data;   
    //     console.log(tournamentData.get_race_results.edges.node)
    let horsesRacesInfo = AgregatePositions(tournamentData.get_race_results.edges, horseID)
    let winStats = calculeMaxWinPlaceStats(racesData.data.get_race_results.edges, horseID, horse.class)
    horsesRacesInfo.horse_id = horseID
    horsesRacesInfo.class = horse.class
    horsesRacesInfo.name = horseInfo.name
    horsesRacesInfo.img = horse.img_url
    if( winStats != undefined ){ //Win stats will be undefined if there are not races defined for a horse
      horsesRacesInfo.preferLength = winStats.Length
      horsesRacesInfo.winPecent = winStats.Wins
      horsesRacesInfo.placePercent = winStats.Placed
    }   
    horsesRacesInfo.win_rate = horse.win_rate
    horsesRacesInfo.rating = horse.rating
    horsesRacesInfo.tourneyPoints = CalculateTournamentPoints(horsesRacesInfo, currentTournament.pointsStructure)

    props.onNewPointsUpdated(horsesRacesInfo.horse_id, horsesRacesInfo.tourneyPoints);  

    return(
        <RaceStatsItem key={horsesRacesInfo.horse_id} raceStatsData={horsesRacesInfo}/>
    )
}