import React, { useState, useEffect } from "react";
import Context from "./Context";
import { fetchTopDelegates } from "./fetchDelegates"
import { useActiveWeb3React } from "hooks/connectivity"
import { DelegateData, DelegateDataResponse } from "./types";
import { useProtocols } from "contexts/Protocols";


const Provider: React.FC = ({ children }) => {

  const { library } = useActiveWeb3React();
  const { activeProtocol } = useProtocols();

  const [error, setError] = useState<string>('');
  const [delegates, setDelegates] = useState<DelegateData[]>([])
  const [proposalId, setProposalId] = useState<number>(53);
  const [blockHeight, setBlockHeight] = useState<number>(12926675); // temporary placeholder
  
  const minBalance = 1;


  useEffect(() => {
    console.log("Fetch Attempt -", activeProtocol.id)
    try {
      library &&
      activeProtocol.client &&
      fetchTopDelegates(activeProtocol.client, library, setError, minBalance, proposalId, blockHeight).then(async response => {
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
          setDelegates(parsed)
        }
      })
    } catch (e) {  
      console.log('ERROR:' + e)
      setError('ERROR:' + e)
    }
  }, [fetchTopDelegates, activeProtocol.client, minBalance, proposalId, blockHeight])
  
  return (
    <Context.Provider
      value={{
        setProposalId,
        proposalId,
        delegates,
        blockHeight,
        setBlockHeight
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;