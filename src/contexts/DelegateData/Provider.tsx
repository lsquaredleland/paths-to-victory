import React, { useState, useEffect } from "react";
import Context from "./Context";
import { fetchTopDelegates } from "./fetchDelegates"
import { useActiveWeb3React } from "hooks/connectivity"
import { DelegateData, DelegateDataResponse } from "./types";
import { useProtocols } from "contexts/Protocols";
import useBlockHeight from "hooks/useBlockHeight";


const Provider: React.FC = ({ children }) => {

  const { library } = useActiveWeb3React();
  const { activeProtocol } = useProtocols();

  const [error, setError] = useState<string>('');
  const [delegates, setDelegates] = useState<DelegateData[]>([])
  const [proposalId, setProposalId] = useState<number>(53);
  const [blockHeight, setBlockHeight] = useState<number>(12926675); // temporary placeholder
  const [votingParticipationMin, setVotingParticipationMin] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  
  const minBalance = 1;

  const latestBlockHeight = useBlockHeight()

  useEffect(() => {
    if (latestBlockHeight !== 0) {
      console.log("set block height", latestBlockHeight)
      setBlockHeight(latestBlockHeight)
    }
  }, [latestBlockHeight])

  useEffect(() => {
    setLoading(true) // Is this being set here at all?
    setError('')
    console.log("Fetch Attempt -", minBalance, proposalId, blockHeight, votingParticipationMin)
    try {
      library &&
      activeProtocol.client &&
      fetchTopDelegates(activeProtocol.client, library, setError, minBalance, proposalId, blockHeight, votingParticipationMin).then(async response => {
        if (response) {
          // Probably should define a data type for the response
          const parsed = response.map((d: DelegateDataResponse) => ({
            ...d,
            delegatedVotes: Number(d.delegatedVotes),
            voted: d.voted.length,
            votes: d.votes.map((v) => ({
              ...v,
              id: proposalId,
              votes: Number(v.votes)
            }))
          }))
          console.log("setting data")
          setLoading(false)
          setDelegates(parsed)
        }
      })
    } catch (e) {  
      console.log('ERROR:' + e)
      setError('ERROR:' + e)
    }
  }, [setLoading, library, activeProtocol.client, minBalance, proposalId, blockHeight, votingParticipationMin])
  
  return (
    <Context.Provider
      value={{
        setProposalId, proposalId,
        setBlockHeight, blockHeight,
        setVotingParticipationMin, votingParticipationMin,
        delegates,
        error,
        loading
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;