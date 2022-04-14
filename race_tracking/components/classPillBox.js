
const PillBoxTypes = {
    1: {
      classes: "bg-[#563d6d] ",
      text: "I",
    },
    2:{
        classes: "bg-[#5e3846] ",
        text: "II",
    },
    3:{
        classes: "bg-[#66513e] ",
        text: "III",
    },
    4:{
        classes: "bg-[#375b55] ",
        text: "IV",
    },
    5:{
        classes: "bg-[#326373] ",
        text: "V",
    },
    6:{
        classes: "bg-[#57606] ",
        text: "VI",
    },
    d:{
        classes: "bg-[#57606] ",
        text: "d",
    },
  };

  
export default function ClassPillBox({ aClassNum }) {
 
    const pillBoxDef = PillBoxTypes[aClassNum]
    return(
        <div >
          <button className={pillBoxDef.classes + " text-xs text-white font-medium py-0 px-3 rounded-sm inline-flex items-center"} >        
              {pillBoxDef.text}
          </button>
        </div>
    )

}