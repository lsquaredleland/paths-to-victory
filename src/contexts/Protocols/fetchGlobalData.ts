import { GLOBAL_DATA } from 'apollo/queries'
import { GlobalData } from './types';

interface GlobalResponse {
  data: {
    governances: GlobalData[]
  }
}

const convertNumberObj = (obj: any) => {
  const res: any = {}
  for (const key in obj) {
    const parsed = Number(obj[key])
    res[key] = isNaN(parsed) ? obj[key] : parsed;
  }
  return res;
}

export async function fetchGlobalData(client: any): Promise<GlobalData | null> {
  if (!client) {
    return null
  }
  return client
    .query({
      query: GLOBAL_DATA,
      fetchPolicy: 'cache-first'
    })
    .then(async (res: GlobalResponse) => {
      if (res) {
        return convertNumberObj(res.data.governances[0])
      } else {
        return Promise.reject('Error fetching global data')
      }
    })
    .catch(() => {
      return Promise.reject('Error fetching from subgraph')
    })
}