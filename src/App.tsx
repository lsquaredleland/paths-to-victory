import './App.css';
import Web3ReactManager from 'components/Web3ReactManager'
import useDelegateData from 'contexts/DelegateData/useDelegateData';
import { DelegateData } from 'contexts/DelegateData/types';
import styled from 'styled-components';
import { useMemo, useState } from 'react';
import useBlockHeight from 'hooks/useBlockHeight';
import { fmt } from 'utils/common';
import { calcDelegateCombinations, calcMinDelegatesToValue } from 'utils/delegateCombinations';
import { useProtocols } from 'contexts/Protocols';
import { GovernanceInfo } from 'contexts/Protocols/types';


const H3 = styled.h3`
  margin: 0px;
`;

const Inline = styled.div`
  display: flex;
  width: 100%
`;

interface ProtocolSelectorProps {
  allProtocols: GovernanceInfo[];
  setActiveProtocol: (newProtocol: GovernanceInfo) => void
}

const ProtocolSelector = ({ allProtocols, setActiveProtocol }: ProtocolSelectorProps) => {
  return (
    <div>
      {allProtocols.map((protocol: GovernanceInfo, i: number) => {
        return (
          <button
            key={i}
            onClick={() => setActiveProtocol(protocol)}
          >
            {protocol.name}
          </button>
        )
      })}
    </div>
  )
}

interface TextFieldProps {
  value: string | number;
  onChange: (val: any) => void;
  type?: string; // How to fix this to either `text` or `number`
  disabled?: boolean;
  placeholder?: string;
}

const TextField = ({ value, onChange, type='string', disabled=false, placeholder }: TextFieldProps) => {
  return (
    <input
      value={value}
      type={type}
      disabled={disabled}
      placeholder="Enter your name"
      onChange={({ target: { value } }) => onChange(value)}
    />
  )
}

interface CombinationsComponentProps {
  votesRequiredToWin: number;
  remainingDelegates: DelegateData[]
  maxDepth: number
}

const CombinationsComponent = ({ votesRequiredToWin, remainingDelegates, maxDepth }: CombinationsComponentProps) => {
  const depthCount: number[] = useMemo(() => {
    return calcDelegateCombinations(votesRequiredToWin, remainingDelegates, maxDepth)
  }, [calcDelegateCombinations, votesRequiredToWin, remainingDelegates, maxDepth])

  return (
    <Inline>
      <H3>
        <li>one: {depthCount[0] || 0}</li>
        <li>two: {depthCount[1] || 0}</li>
        <li>three: {depthCount[2] || 0}</li>
        <li>four: {depthCount[3] || 0}</li>
        <li>five: {depthCount[4] || 0}</li>
      </H3>
    </Inline>
  )
}

function App() {

  const { delegates, setProposalId, proposalId, blockHeight, setBlockHeight } = useDelegateData();
  const { activeProtocol, setActiveProtocol, allProtocols } = useProtocols();
  const [quorum, setQuorum] = useState<number>(400000)

  useMemo(() => {
    setQuorum(activeProtocol.quorum)
  }, [quorum, setQuorum, activeProtocol])

  const latestBlockHeight = useBlockHeight()

  const forDelegates = delegates.filter(({ votes }: DelegateData) => {
    return votes[0]?.support === true
  })

  const noDelegates = delegates.filter(({ votes }: DelegateData) => {
    return votes[0]?.support === false
  })

  const forVotes = forDelegates.reduce((acc, curr) => acc + curr.votes[0].votes, 0);
  const noVotes = noDelegates.reduce((acc, curr) => acc + curr.votes[0].votes, 0);

  const votesRequiredToWin = quorum - forVotes > 0 ? quorum - forVotes : 0;

  const remainingDelegates = delegates.filter(({ voted, votes }: DelegateData) => {
    return voted > 0 && votes.length === 0
  })

  const [maxDepth, setMaxDepth] = useState<number>(5);

  const BlockHeightComponent = () => (
    <Inline>
      <H3>Block Height:</H3>
      <TextField
        value={blockHeight}
        onChange={setBlockHeight}
      />
      <button
        onClick={() => setBlockHeight(latestBlockHeight)}
      >
        Use current BlockHeight
      </button>
    </Inline>
  )


  return (
    <div className="App">
      <Web3ReactManager>
        <div style={{ textAlign: 'left', padding: '50px' }}>
          <header>
            <ProtocolSelector
              allProtocols={allProtocols}
              setActiveProtocol={setActiveProtocol}
            />
            <h1>Protocol: {activeProtocol.name}</h1>
          </header>
          <div>
            <Inline>
              <H3>Quorum:</H3>
              <TextField
                value={quorum}
                onChange={setQuorum}
              />
            </Inline>
            <BlockHeightComponent />
            <Inline>
              <H3>Proposal Id:</H3>
              <TextField
                value={proposalId}
                onChange={setProposalId}
              />
            </Inline>
            <Inline>
              <H3>Minimum Voting Actions: {1}</H3>
            </Inline>
            <Inline>
              <H3>Minimum Delegates to Quorum: {calcMinDelegatesToValue(quorum, delegates, 0)}</H3>
            </Inline>
            <Inline>
              <H3>Min Delegates to Quorum w/ ≥ 1 vote: {calcMinDelegatesToValue(quorum, delegates, 1)}</H3>
            </Inline>
            <Inline>
              <H3>Current "For" Votes: {fmt(forVotes)}</H3>
            </Inline>
            <Inline>
              <H3>Current "No" Votes: {fmt(noVotes)}</H3>
            </Inline>
            <Inline>
              <H3>Quorum met: {forVotes > quorum ? 'YES' : 'NO'}</H3>
            </Inline>
            <Inline>
              <H3>Proposal currently {forVotes > quorum && forVotes > noVotes ? '' : 'not'} passing</H3>
            </Inline>
            <Inline>
              <H3>Additional Votes Required: {fmt(votesRequiredToWin)}</H3>
            </Inline>
            <Inline>
              <H3>numbers of vote combinations</H3>
            </Inline>
            <CombinationsComponent
              votesRequiredToWin={votesRequiredToWin}
              remainingDelegates={remainingDelegates}
              maxDepth={maxDepth}
            />
          </div>
        </div>
      </Web3ReactManager>
    </div>
  );
}

export default App;
