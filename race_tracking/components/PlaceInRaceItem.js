export default function PlaceInRaceItem(props){

    if( props.place == undefined )
        return(<></> )

    if( props.place == 1 || props.place == 2 || (props.place == 3) ){
        return(
            <>{props.join}
            <u><b>{props.place}</b></u>
            </>
        )
    }

    return(
        <>{props.join}{props.place}</>
    )
}   

   