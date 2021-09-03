import './App.css';
import Web3ReactManager from 'components/Web3ReactManager'
import useDelegateData from 'contexts/DelegateData/useDelegateData';
import { DelegateData } from 'contexts/DelegateData/types';
import { useEffect, useState } from 'react';
import useBlockHeight from 'hooks/useBlockHeight';
import { fmt, nFormatter } from 'utils/common';
import { calcMinDelegatesToValue } from 'utils/delegateCombinations';
import { useProtocols } from 'contexts/Protocols';
import { H2, H3, Inline, Wrapper } from 'components/BasicStyles';
import CombinationsComponent from 'page/CombinationsComponent';
import ProtocolSelector from 'components/ProtocolSelector';
import { Table, Tr, Th, Td, Input, Button } from '@chakra-ui/react'
import styled from 'styled-components';
import Footer from 'page/Footer';


const Spacer = styled.div`
  padding-bottom: var(--chakra-space-10);
`;

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
    <Input
      value={value}
      type={type}
      disabled={disabled}
      placeholder="Enter proposal id"
      onChange={change}
      style={{width: "150px"}}
      size="md"
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

const HeaderSection = styled.section`
  -webkit-box-pack: justify;
  justify-content: space-between;
  box-shadow: var(--chakra-shadows-none);
  margin-bottom: var(--chakra-space-8);
  margin-top: var(--chakra-space-8); /* var(--chakra-space-12); */
  padding-top: 0px;
  padding-inline: 0px;
`;

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
      <Button
        onClick={() => setBlockHeight(latestBlockHeight)}
        size="md"
      >
        Use Current Block Height
      </Button>
    </Inline>
  )

  return (
    <div className="App">
      <Web3ReactManager>
        <div style={{ textAlign: 'left', padding: '50px 50px 0px 50px' }}>
          <ProtocolSelector />
          <HeaderSection>
            <H2>Protocol: {activeProtocol.name.replace('Governance','')}</H2>
          </HeaderSection>
          <div>
            <H3>Quorum:{" "}{nFormatter(quorum,0,"")} {activeProtocol.token.symbol}</H3>
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
            <Wrapper>
              <Table style={{textAlign: "right"}}>
                <Tr>
                  <Th>For</Th>
                  <Th>Against</Th>
                  <Th>Quorum Met</Th>
                  <Th>Proposal Passing</Th>
                </Tr>
                <Tr>
                  <Td>{fmt(forVotes)}</Td>
                  <Td>{fmt(noVotes)}</Td>
                  <Td>{forVotes > quorum ? 'YES' : 'NO'}</Td>
                  <Td>{forVotes > quorum && forVotes > noVotes ? 'YES' : 'NO'}</Td>
                </Tr>
              </Table>
            </Wrapper>
            <Inline>
              <H3>Additional Votes Required: {fmt(votesRequiredToWin)}</H3>
            </Inline>
            <Wrapper>
              <CombinationsComponent
                votesRequiredToWin={votesRequiredToWin}
                remainingDelegates={remainingDelegates}
                maxDepth={maxDepth}
              />
            </Wrapper>
          </div>
          <Spacer />
          <Footer />
        </div>
      </Web3ReactManager>
    </div>
  );
}

export default App;
