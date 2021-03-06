import gql from 'graphql-tag'

const FETCHING_INTERVAL = 500;

// `first` cannot be 0 -> defaulting it to 1
export const TOP_DELEGATES_SEARCH = (
  minBalance: number,
  proposalId: number,
  blockHeight: number,
  votingParticipationMin: number
) => {
  return gql`
    query delegates {
      delegates(
        first: ${FETCHING_INTERVAL},
        orderBy: delegatedVotes,
        orderDirection: desc,
        where: { delegatedVotes_gt: ${minBalance} }
        block:{ number: ${blockHeight} }
      ) {
        id
        delegatedVotes
        tokenHoldersRepresentedAmount
        votes (
          where: { proposal_contains: "${proposalId}" }
        ) {
          votes
          support
        }
        voted: votes(first: ${votingParticipationMin === 0 ? 1 : votingParticipationMin}) {
          id
        }
      }
    }
  `
}

export const GLOBAL_DATA = gql`
  query governance {
    governances(first: 1) {
      delegatedVotes
      delegatedVotesRaw
      totalTokenHolders
      totalDelegates
      proposals
      currentTokenHolders
    }
  }
`

export const TOP_DELEGATES = gql`
  query delegates {
    delegates(
      first: ${FETCHING_INTERVAL},
      orderBy: delegatedVotes,
      orderDirection: desc,
      where: { delegatedVotes_gt: $minBalance }
    ) {
      id
      delegatedVotes
      tokenHoldersRepresentedAmount
      votes (
        where: { proposal_contains: $proposalId }
      ) {
        votes
        support
      }
      voted: votes(first: 1) {
        id
      }
    }
  }
`

// fetch top delegates by votes delegated at current time
export const TOP_DELEGATES_OFFSET = gql`
  query delegates($skip: Int!) {
    delegates(
      first: ${FETCHING_INTERVAL},
      skip: $skip,
      orderBy: delegatedVotes,
      orderDirection: desc,
      where:{ delegatedVotes_gt: 1}
    ) {
      id
      delegatedVotes
      tokenHoldersRepresentedAmount
      votes (first: 1, orderBy: id, orderDirection: desc) {
        votes
        support
        proposal {
          id
        }
      }
    }
  }
`