import WalletButton from "./wallet/WalletButton"

export default function TournamentTableHeader({isConnected, address, connect, tournamentName})
{
    return(
        <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
             <span>Tournament <p className="text-s"> Metavers Cup Group Stage </p> </span>
          </th>
          <th/>
          <th/>
          <th/>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" >
            {isConnected ? <span> <b> 0x...{address.substring(address.length - 4)}</b></span> : <span>Not connected</span>}
          </th>
          <th>
          {!isConnected ? <WalletButton connect={connect}/> : <span>Connected </span>}
          </th>
        </tr>
      </thead> 
    )
}