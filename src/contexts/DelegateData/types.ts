import { Percent } from '@uniswap/sdk'

export interface DelegateData {
  id: string
  delegatedVotes: number
  votePercent: Percent
  voted: number
  votes: {
    proposalId: number
    support: boolean
    votes: number
  }[]
  EOA: boolean | undefined //
  autonomous: boolean | undefined
  tokenHoldersRepresentedAmount: number
  displayName: string
}

export interface DelegateDataResponse extends Omit<DelegateData, "voted"> {
  voted:  {
    support: boolean
    votes: number
  }[]
}