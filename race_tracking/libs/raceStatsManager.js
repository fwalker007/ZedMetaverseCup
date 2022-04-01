

const calculateStats = (myRaceStats, raceLength) => {
    
    let numOf1000Races = 0
    let wins = 0
    let placeds = 0
    let horseName = ""
    let horseImg
    
    const oneThousandRaces = myRaceStats.filter( (lengthRace) =>{
        if( lengthRace != undefined && lengthRace.raceLength == raceLength ){
          horseName = lengthRace.name
          horseImg = lengthRace.img
           numOf1000Races++;
          if( lengthRace.position == 1){
            wins++
            placeds++
          }
          if( lengthRace.position == 2 || lengthRace.position == 3){
            placeds++
          }
        }
        return(lengthRace != undefined && lengthRace.raceLength == raceLength )
    })

   // console.log( "Length: " + raceLength )
   // console.log( "Races: " + numOf1000Races )
   // console.log( "Wins " + wins/numOf1000Races * 100 )
   // console.log( "Placed " + placeds/numOf1000Races * 100  )
   // console.log("============================================")

    return({ horseName: horseName, Length: raceLength, Races: numOf1000Races, Wins: wins/numOf1000Races * 100, Placed: placeds/numOf1000Races * 100, img: horseImg })

  }


export const calculeMaxWinPlaceStats = (racesStats, aHorseId) => {

  let horsesRacesInfo = racesStats.map( (race) => { 
    const myhorse = race.node.horses.find( (horse) => horse.horseId === aHorseId )
    if( myhorse != undefined )
      return( { name: myhorse.name,  raceLength: race.node.length, position: myhorse.position, img: myhorse.imgUrl })
  })

  let maxWins = 0;
  let maxRace 

  for( let i=0; i<9; i++){
    let raceLength = (i * 200 ) + 1000
    const raceStats = calculateStats(horsesRacesInfo, raceLength)
    if( raceStats.Wins > maxWins ){
      maxWins = raceStats.Wins
      maxRace = raceStats
    }
  }

  return(maxRace)

}

export default calculateStats 

