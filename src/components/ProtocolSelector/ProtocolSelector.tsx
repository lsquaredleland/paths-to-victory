import { useDelegateData } from 'contexts/DelegateData';
import { useProtocols } from 'contexts/Protocols';
import { GovernanceInfo } from 'contexts/Protocols/types';


const ProtocolSelector = () => {
  const { setActiveProtocol, allProtocols, globalData } = useProtocols();
  const { setProposalId } = useDelegateData();

  // Is there a more efficient way then calling it like this?
  const onClick = (protocol: GovernanceInfo) => {
    setActiveProtocol(protocol);
    setProposalId(globalData[protocol.id]?.proposals || 0);
  }

  return (
    <div>
      {allProtocols.map((protocol: GovernanceInfo, i: number) => {
        return (
          <button
            key={i}
            onClick={() => onClick(protocol)}
          >
            {protocol.name} ({globalData[protocol.id]?.proposals})
          </button>
        )
      })}
    </div>
  )
}

export default ProtocolSelector