import { NormalizedCacheObject } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";


export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
}

export interface GovernanceInfo {
  id: string
  name: string
  logo: string
  primaryColor: string
  secondaryColor: string
  token: SerializedToken
  governanceAddress: string
  governanceAddressBravo?: string
  migrationProposalId?: number
  social: string
  emoji?: string
  quorum: number
  client: ApolloClient<NormalizedCacheObject>
}

export interface GlobalDatas {
  [id: string]: GlobalData | null
}

export interface GlobalData {
  totalTokenHolders: number
  totalDelegates: number
  delegatedVotes: number
  delegatedVotesRaw: number
  proposals: number
  currentTokenHolders: number
}