import { createContext } from "react";
import { DelegateData } from "./types";


interface DelegateDataContext {
  setProposalId: (update: number) => void;
  proposalId: number;
  delegates: DelegateData[];
  blockHeight: number;
  setBlockHeight: (update: number) => void;
}

const Context = createContext<DelegateDataContext>({
  setProposalId: (update: number) => {},
  proposalId: 0,
  delegates: [],
  setBlockHeight: (update: number) => {},
  blockHeight: 0,
});

export default Context;