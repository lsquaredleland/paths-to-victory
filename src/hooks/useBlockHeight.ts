import { useEffect, useState } from "react";


interface EtherscanResponseType {
  status: string;
  result: string;
  message: string;
}

export default function useBlockHeight(): number {
  const [blockHeight, setBlockHeight] = useState<number>(0);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_ETHERSCAN_API;
    const timestamp = Math.floor(Date.now() / 1000);
    const url = `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${apiKey}`
    
    fetch(url)
      .then(response => {
        return response.json()
      })
      .then((data: EtherscanResponseType) => {
        console.log(url, data)
        if (data.status === "1") {
          setBlockHeight(parseInt(data.result))
        }
      })
  }, []) // Only called once, could poll every n seconds

  return blockHeight
}