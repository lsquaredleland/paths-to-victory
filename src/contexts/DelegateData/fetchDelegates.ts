import { TOP_DELEGATES_SEARCH, TOP_DELEGATES_OFFSET } from "apollo/queries"
import { Web3Provider } from '@ethersproject/providers'
import { DelegateData, DelegateDataResponse } from './types'
import isAddress from 'utils/isAddress'
import { DocumentNode } from 'graphql'
import { AUTONOMOUS_PROPOSAL_BYTECODE } from 'constants/proposals'
import { Dispatch, SetStateAction } from "react"


interface DelegateQuery {
  query: DocumentNode
  variables?: { list?: false | string[] | undefined; skip?: number | undefined }
  fetchPolicy: string
}

interface DelegateResponse {
  data: {
    delegates: DelegateData[]
  }
}

async function fetchDelegatesFromClient(
  client: any,
  library: Web3Provider,
  setError: Dispatch<SetStateAction<string>>,
  query: DelegateQuery,
): Promise<DelegateDataResponse[] | null> {
  try {
    return client
      .query(query)
      .then(async (res: DelegateResponse) => {
        // check if account is EOA or not
        const typed = await Promise.all(
          res.data.delegates.map(d => {
            return library?.getCode(d.id)
          })
        )

        return res.data.delegates.map((d, i) => {
          const checksummed = isAddress(d.id)
          if (checksummed) {
            d.id = checksummed
          }

          return {
            ...d,
            EOA: typed[i] === '0x',
            autonomous: typed[i] === AUTONOMOUS_PROPOSAL_BYTECODE,
          }
        })
      })
      .catch((e: any) => {
        const errorMsg = `Error fetching delegates from subgraph: ${e.message}`
        setError(errorMsg)
        return Promise.reject(errorMsg)
      })
  } catch (e) {
    const errorMsg = 'Unable to fetch delegates'
    setError(errorMsg)
    return Promise.reject(errorMsg)
  }
}

export async function fetchTopDelegates(
  client: any,
  library: Web3Provider,
  setError: Dispatch<SetStateAction<string>>,
  minBalance: number,
  proposalId: number,
  blockHeight: number,
): Promise<DelegateDataResponse[] | null> {
  return fetchDelegatesFromClient(client, library, setError, {
    query: TOP_DELEGATES_SEARCH(minBalance, proposalId, blockHeight),
    fetchPolicy: 'cache-first'
  })
}

export async function fetchTopDelegatesOffset(
  client: any,
  library: Web3Provider,
  setError: Dispatch<SetStateAction<string>>,
  maxFetched: number,
): Promise<DelegateDataResponse[] | null> {
  return fetchDelegatesFromClient(client, library, setError, {
    query: TOP_DELEGATES_OFFSET,
    variables: {
      skip: maxFetched
    },
    fetchPolicy: 'cache-first'
  })
}