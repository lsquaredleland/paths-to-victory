import { createContext } from "react";
import { GlobalDatas, GovernanceInfo } from "./types";
import { COMPOUND_GOVERNANCE } from "./data";


interface ProtocolsContext {
  activeProtocol: GovernanceInfo;
  setActiveProtocol: (update: GovernanceInfo) => void;
  allProtocols: Array<GovernanceInfo>; // Make this a const instead and move out,
  globalData: GlobalDatas
}

const Context = createContext<ProtocolsContext>({
  activeProtocol: COMPOUND_GOVERNANCE,
  setActiveProtocol: (update: GovernanceInfo) => {},
  allProtocols: [],
  globalData: {}
});

export default Context;