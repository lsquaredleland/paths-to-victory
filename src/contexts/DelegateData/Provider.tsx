import React, { useState, useEffect } from "react";
import Context from "./Context";
import { fetchTopDelegates } from "./fetchDelegates"
import {
  // radicleClient,
  // poolClient,
  // uniswapClient,
  // aaveClient,
  compoundClient,
  // feiClient,
  // gitcoinClient
} from 'apollo/client'
import { useActiveWeb3React } from "hooks/connectivity"
import ApolloClient from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { DelegateData, DelegateDataResponse } from "./types";


const Provider: React.FC = ({ children }) => {

  const { library } = useActiveWeb3React();
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>(compoundClient);
  const [error, setError] = useState<string>('');
  const [protocol, setProtocol] = useState<string>('COMPOUND')
  const [delegates, setDelegates] = useState<DelegateData[]>([])
  const [proposalId, setProposalId] = useState<number>(1);
  const [blockHeight, setBlockHeight] = useState<number>(0); // temporary placeholder
  
  const minBalance = 1;
  
  useEffect(() => {
    try {
      library &&
      client &&
      fetchTopDelegates(client, library, setError, minBalance, proposalId, blockHeight).then(async response => {
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
          setDelegates(parsed)
        }
      })
    } catch (e) {  
      console.log('ERROR:' + e)
      setError('ERROR:' + e)
    }
  }, [fetchTopDelegates, client, protocol, minBalance, proposalId])
  
  return (
    <Context.Provider
      value={{
        setProtocol,
        setProposalId,
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