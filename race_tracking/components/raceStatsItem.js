import React from "react"
import HorseTournamentInfoItem from "./horseTournamenInfoItem"


export default function RaceStatsItem({ raceStatsData }) {

    return (
        <tr>
            <td className="px-4 py-2">
                <div className='flex items-center justify-left lg:justify-start gap-2'>
                    <img className="h-12 w-12 rounded-full" src={raceStatsData.img} alt="" />
                    <div className="flex flex-col justify-center gap-.5 overflow-hidden mt-2">
                        <div className="text-sm font-medium text-gray-900">{raceStatsData.name}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="items-center">
                    <div className="ml-4">
                        <HorseTournamentInfoItem positions={raceStatsData.position} />
                        <HorseTournamentInfoItem positions={raceStatsData.raceLength} />
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="items-center">
                    <div className="ml-4 text-center">{raceStatsData.tourneyPoints.toFixed(2)}</div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="items-Left">
                    <div className="ml-4" />
                    <div className="text-sm text-center font-medium text-gray-900">{raceStatsData.preferLength}</div>
                    <div className="text-sm text-center font-medium text-gray-900">{raceStatsData.winPecent.toFixed(2)}% / {raceStatsData.placePercent.toFixed(2)}%</div>
                </div>
            </td>
        </tr>

    )
}