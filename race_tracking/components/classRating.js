
const classRatings = {
    1: {
        from:1620,
        to:3000
       },
    2: {
        from:1560,
        to:1619
       },
    3: {  
        from:1500,
        to:1559
       },
    4: {
        from:1440,
        to:1499 
       },  
    5: {
        from:1380,
        to:1439 
       }, 
    6: {
        from:0,
        to:1379
       }
    }

     
export default function ClassRating({ aClassNum, aRating }) {
 
    const classRate = classRatings[aClassNum]

    return(
        <div >
              {parseInt(aRating - classRate.from)}
        </div>
    )

}