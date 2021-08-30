import React, { useEffect, useState } from "react";
import Context from "./Context";
import { COMPOUND_GOVERNANCE, CURRENT_SUPPORTED_PROTOCOLS } from "./data";
import { fetchGlobalData } from "./fetchGlobalData";
import { GovernanceInfo, GlobalDatas } from "./types";


const Provider: React.FC = ({ children }) => {
  // Question: should below be an object or array is sufficient?
  const [activeProtocol, setActiveProtocol] = useState<GovernanceInfo>(COMPOUND_GOVERNANCE);
  const [globalData, setGlobalData] = useState<GlobalDatas>({});
  const allProtocols = CURRENT_SUPPORTED_PROTOCOLS

  useEffect(() => {
    const globalData: GlobalDatas = {};
    const promises = allProtocols.map((protocol) => fetchGlobalData(protocol.client));
    Promise.all(promises).then((response) => {
      response.forEach((resp, i) => {
        globalData[allProtocols[i].id] = resp
      })

      setGlobalData(globalData);
      console.log("globalData", globalData)
    })
  }, [setGlobalData, allProtocols])

  return (
    <Context.Provider
      value={{
        activeProtocol,
        setActiveProtocol,
        allProtocols,
        globalData
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;