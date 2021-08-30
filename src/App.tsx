import './App.css';
import Web3ReactManager from 'components/Web3ReactManager'
import useDelegateData from 'contexts/DelegateData/useDelegateData';
import { DelegateData } from 'contexts/DelegateData/types';
import { useEffect, useState } from 'react';
import useBlockHeight from 'hooks/useBlockHeight';
import { fmt, nFormatter } from 'utils/common';
import { calcMinDelegatesToValue } from 'utils/delegateCombinations';
import { useProtocols } from 'contexts/Protocols';
import { H3, Inline } from 'components/BasicStyles';
import CombinationsComponent from 'page/CombinationsComponent';
import ProtocolSelector from 'components/ProtocolSelector';


interface TextFieldProps {
  value: string | number;
  onChange: (val: any) => void;
  type?: string; // How to fix this to either `text` or `number`
  disabled?: boolean;
  placeholder?: string;
}

const TextField = ({ value, onChange, type='string', disabled=false, placeholder }: TextFieldProps) => {
  const change = ({ target: { value } }: any) => {
    if (value !== "") {
      onChange(value)
    }
  };

  return (
    <input
      value={value}
      type={type}
      disabled={disabled}
      placeholder="Enter proposal id"
      onChange={change}
    />
  )
}

const votesToWin = (forVotes: number, noVotes: number, quorum: number) => {
  // Note some protocols require a min difference between forVotes + noVotes 
  // ^Aave has this requirement

  if (forVotes > quorum) { // Quorum met
    if (noVotes > forVotes) {
      return noVotes - forVotes
    } else {
      return 0
    }
  } else {
    return quorum - forVotes
  }
}

function App() {

  const { 
    delegates,
    setProposalId, proposalId,
    setBlockHeight, blockHeight,
    setVotingParticipationMin, votingParticipationMin
  } = useDelegateData();
  const { activeProtocol, globalData } = useProtocols();
  const [quorum, setQuorum] = useState<number>(400000)

  useEffect(() => {
    setQuorum(activeProtocol.quorum)
  }, [quorum, setQuorum, activeProtocol])

  useEffect(() => {
    setProposalId(globalData[activeProtocol.id]?.proposals || 0)
  }, [setProposalId, activeProtocol, globalData])

  const latestBlockHeight = useBlockHeight()

  const forDelegates = delegates.filter(({ votes }: DelegateData) => {
    return votes[0]?.support === true
  })

  const noDelegates = delegates.filter(({ votes }: DelegateData) => {
    return votes[0]?.support === false
  })

  const forVotes = forDelegates.reduce((acc, curr) => acc + curr.votes[0].votes, 0);
  const noVotes = noDelegates.reduce((acc, curr) => acc + curr.votes[0].votes, 0);

  const votesRequiredToWin = votesToWin(forVotes, noVotes, quorum);

  const remainingDelegates = delegates.filter(({ voted, votes }: DelegateData) => {
    return voted >= votingParticipationMin && votes.length === 0
  })

  // const [maxDepth, setMaxDepth] = useState<number>(5);
  const maxDepth = 5;

  const BlockHeightComponent = () => (
    <Inline>
      <H3>Block Height:</H3>
      <TextField
        type="number"
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
            <ProtocolSelector />
            <h1>Protocol: {activeProtocol.name.replace('Governance','')}</h1>
          </header>
          <div>
            <Inline>
              <H3>Quorum:</H3>
              {/* <TextField
                value={quorum}
                onChange={setQuorum}
              /> */}
              <H3> {nFormatter(quorum,0,"")} {activeProtocol.token.symbol}</H3>
            </Inline>
            <BlockHeightComponent />
            <Inline>
              <H3>Proposal Id:</H3>
              <TextField
                type="number"
                value={proposalId}
                onChange={setProposalId}
              />
            </Inline>
            <Inline>
              <H3>Minimum Voting Actions:</H3>
              <TextField
                type="number"
                value={votingParticipationMin}
                onChange={(val) => setVotingParticipationMin(parseInt(val))}
              />
            </Inline>
            <Inline>
              <H3>Minimum Delegates to Quorum: {calcMinDelegatesToValue(quorum, delegates, 0)}</H3>
            </Inline>
            <Inline>
              <H3>Min Delegates to Quorum w/ ≥ {votingParticipationMin} vote: {calcMinDelegatesToValue(quorum, delegates, votingParticipationMin)}</H3>
            </Inline>
            <hr />
            <table style={{textAlign: "right", border: "2px solid white"}}>
              <tr style={{border: "2px solid white"}}>
                <th style={{border: "2px solid white"}}>"For"</th>
                <th style={{border: "2px solid white"}}>"Against"</th>
                <th style={{border: "2px solid white"}}>Quorum Met</th>
                <th style={{border: "2px solid white"}}>Proposal Passing</th>
              </tr>
              <tr style={{border: "2px solid white"}}>
                <td style={{border: "2px solid white"}}>{fmt(forVotes)}</td>
                <td style={{border: "2px solid white"}}>{fmt(noVotes)}</td>
                <td style={{border: "2px solid white"}}>{forVotes > quorum ? 'YES' : 'NO'}</td>
                <td style={{border: "2px solid white"}}>{forVotes > quorum && forVotes > noVotes ? 'YES' : 'NO'}</td>
              </tr>
            </table>
            <Inline>
              <H3>Additional Votes Required: {fmt(votesRequiredToWin)}</H3>
            </Inline>
            <Inline>
              <div>
                <H3>Vote Combinations</H3>
                <p style={{margin: "0px"}}>(How many unique combinations of voters are there to pass the proposal. Requiring only 1, 2, 3, etc delegates to act)</p>
              </div>
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
