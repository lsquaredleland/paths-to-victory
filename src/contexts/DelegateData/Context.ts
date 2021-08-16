import { createContext } from "react";
import { DelegateData } from "./types";


interface DelegateDataContext {
  setProtocol: (update: string) => void;
  setProposalId: (update: number) => void;
  delegates: DelegateData[];
  blockHeight: number;
  setBlockHeight: (update: number) => void;
}

const Context = createContext<DelegateDataContext>({
  setProtocol: (update: string) => {},
  setProposalId: (update: number) => {},
  delegates: [],
  setBlockHeight: (update: number) => {},
  blockHeight: 0,
});

export default Context;