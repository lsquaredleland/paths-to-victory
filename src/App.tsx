import './App.css';
import Web3ReactManager from 'components/Web3ReactManager'
import useDelegateData from 'contexts/DelegateData/useDelegateData';
import { DelegateData } from 'contexts/DelegateData/types';
import styled from 'styled-components';
import { useEffect } from 'react';
import useBlockHeight from 'hooks/useBlockHeight';
import { fmt } from 'utils/common';


const calcMinDelegatesToValue = (
  value: number,
  delegates: DelegateData[],
  voteMinimum: number = 0
) => {
  let accumulator: number = 0;
  let minDelegatesToValue: number = 0;

  for (let i: number = 0; i < delegates.length; i++) {
    accumulator += delegates[i].voted >= voteMinimum ? delegates[i].delegatedVotes : 0;
    if (accumulator >= value) {
      minDelegatesToValue = i+1;
      break;
    }
  }

  return minDelegatesToValue;
}

const H3 = styled.h3`
  margin: 0px;
`;

function App() {

  const { setProtocol, delegates, setProposalId, blockHeight, setBlockHeight } = useDelegateData();

  const latestBlockHeight = useBlockHeight()
  
  useEffect(() => {
    console.log(latestBlockHeight)
  }, [latestBlockHeight])
  
  const protocol = "COMPOUND"
  const quorum = 400000; // Have this be an input field
  const proposalId = 53;
  // Note blockHeight + proposalId has to be aligned

  useEffect(() => {
    setProposalId(proposalId)
  }, [setProposalId, proposalId])

  useEffect(() => {
    setBlockHeight(12926675) // Default set to latestBlockHeight
  }, [setBlockHeight])

  const forDelegates = delegates.filter(({ votes }: DelegateData) => {
    return votes[0]?.support === true
  })

  const noDelegates = delegates.filter(({ votes }: DelegateData) => {
    return votes[0]?.support === false
  })

  const forVotes = forDelegates.reduce((acc, curr) => acc + curr.votes[0].votes, 0);
  const noVotes = noDelegates.reduce((acc, curr) => acc + curr.votes[0].votes, 0);

  const votesRequiredToWin = quorum - forVotes;

  const remainingDelegates = delegates.filter(({ voted, votes }: DelegateData) => {
    return voted > 0 && votes.length === 0
  })

  console.log(remainingDelegates)

  return (
    <div className="App">
      <Web3ReactManager>
        <header className="App-header">
          <button
            onClick={() => setProtocol(Math.random().toString())}
          >
            Trigger
          </button>
          <h1>Protocol: {protocol}</h1>
          <H3>Quorum: {fmt(quorum)}</H3>
          <H3>Block Height: {blockHeight}</H3>
          <H3>Proposal: {proposalId}</H3>
          <H3>Minimum Delegates to Quorum: {calcMinDelegatesToValue(quorum, delegates, 0)}</H3>
          <H3>Min Delegates to Quorum w/ ≥ 1 vote: {calcMinDelegatesToValue(quorum, delegates, 1)}</H3>
          <H3>Current "For" Votes: {fmt(forVotes)}</H3>
          <H3>Current "No" Votes: {fmt(noVotes)}</H3>
          <H3>Quorum met: {forVotes > quorum ? 'YES' : 'NO'}</H3>
          <H3>Proposal currently {forVotes > quorum && forVotes > noVotes ? '' : 'not'} passing</H3>
          <H3>Additional Votes Required: {fmt(votesRequiredToWin)}</H3>
          <H3>Min delegates to pursuade: {calcMinDelegatesToValue(votesRequiredToWin, remainingDelegates, 1)}</H3>
        </header>
      </Web3ReactManager>
    </div>
  );
}

export default App;
