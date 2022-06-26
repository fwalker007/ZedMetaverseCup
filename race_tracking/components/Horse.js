import React from "react"
import {useQuery} from "@apollo/client";
import {GET_RACES_QL_TOURNEY} from "./graphQLManager"
import {AgregatePositions,calculeMaxWinPlaceStats, CalculateTournamentPoints} from './raceStatsManager'
import RaceStatsItem from "./raceStatsItem";
  
async function LoadTournamentRaces(horseID, currentTournament)
{
    let currentTourneyRaces = await GetHorseRacesInTournament(horseID, currentTournament);
    console.log("\n  ==== CURRENT TOURNEY RACES " + currentTourneyRaces.length + " === " );
}

export default function Horse (props)
{   
    const horseID = props.horse.horse_id;
    const horse = props.horse;
    const horseInfo = props.horse.hash_info; 
    const currentTournament = props.currentTournament;
    const racesData = props.racesHistorycalData;

   // LoadTournamentRaces(horseID, currentTournament)
   
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
    console.log(tournamentData.get_race_results)
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

async function GetHorseRaces(horseID){
    let horseRaces = []
    let allRaces = []
    let offset = 0
  
    do{
      var response = await fetch("https://zed.run/racing/results?distance[]=1000,2600&horseId=" + horseID + "&location=&onlyTournaments=false")
      horseRaces = await response.json()  
      allRaces = [...mergedHorses,...horseRaces];   
      offset += MAX_HORSES_PER_RQUEST
    }while( horseRaces.length > 0)
  
    return(allRaces)
  }

async function GetHorseRacesInTournament(horseID, currentTournament){
    let tournamentRaces = []
    let allRaces = []
    let offset = 0
  
    do{
       var response = await fetch("https://zed.run/racing/results?dates[]=" + currentTournament.qualificationStartDate +"," + currentTournament.qualificationStartDate  + "&distance[]=1000,2600&horseId=" + horseID + "&location=&onlyTournaments=false")
      tournamentRaces = await response.json()  
      allRaces = [...mergedHorses,...tournamentRaces];   
      offset += MAX_HORSES_PER_RQUEST
    }while( tournamentRaces.length > 0)
  
    return(allRaces)
  }