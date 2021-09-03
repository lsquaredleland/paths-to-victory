import { useDelegateData } from 'contexts/DelegateData';
import { useProtocols } from 'contexts/Protocols';
import { GovernanceInfo } from 'contexts/Protocols/types';
import { Button } from '@chakra-ui/react'


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
          <Button
            key={i}
            onClick={() => onClick(protocol)}
            variant="primary"
            size="sm"
            style={{marginRight: 'var(--chakra-space-2)', marginBottom: 'var(--chakra-space-2)'}}
          >
            {protocol.name} ({globalData[protocol.id]?.proposals})
          </Button>
        )
      })}
    </div>
  )
}

export default ProtocolSelector