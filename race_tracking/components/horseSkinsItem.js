import PlaceInRaceItem from "./PlaceInRaceItem"

const MAX_RACES_PER_TOURNAMENT = 5


export default function HorseSkinsItem (props)
{    
    let itemColor = "text-gray-999"
    let classname = "text-sm text-center font-medium "

    if( props.positions.length >= MAX_RACES_PER_TOURNAMENT)
        itemColor = "text-gray-400" 

    classname += itemColor

    return(
        <div className={classname} >
            {
                props.positions.map((element) => 
                    <PlaceInRaceItem key={element.id} place={element.name} baseColor="#222222" join="/" />
                )
            }
  
        </div>
    )
}