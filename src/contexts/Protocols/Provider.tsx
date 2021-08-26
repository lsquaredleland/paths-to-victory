import React, { useState } from "react";
import Context from "./Context";
import { COMPOUND_GOVERNANCE, CURRENT_SUPPORTED_PROTOCOLS } from "./data";
import { GovernanceInfo } from "./types";


const Provider: React.FC = ({ children }) => {
  // Question: should below be an object or array is sufficient?
  const [activeProtocol, setActiveProtocol] = useState<GovernanceInfo>(COMPOUND_GOVERNANCE);
  const allProtocols = CURRENT_SUPPORTED_PROTOCOLS

  return (
    <Context.Provider
      value={{
        activeProtocol,
        setActiveProtocol,
        allProtocols
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;