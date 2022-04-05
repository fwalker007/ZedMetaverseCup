import PlaceInRaceItem from "./PlaceInRaceItem"

const MAX_RACES_PER_TOURNAMENT = 5


export default function HorseTournamentInfoItem (props)
{    
    let itemColor = "text-gray-999"
    let classname = "text-sm text-center font-medium "

    if( props.positions.length >= MAX_RACES_PER_TOURNAMENT)
        itemColor = "text-gray-400" 

    classname += itemColor

    return(
        <div className={classname} >
            <PlaceInRaceItem place={props.positions[0]} baseColor="#222222" join="" />
            <PlaceInRaceItem place={props.positions[1]} baseColor="#222222" join="/" />
            <PlaceInRaceItem place={props.positions[2]} baseColor="#222222" join="/" />
            <PlaceInRaceItem place={props.positions[3]} baseColor="#222222" join="/" />
            <PlaceInRaceItem place={props.positions[4]} baseColor="#222222" join="/"/>
        </div>
    )
}