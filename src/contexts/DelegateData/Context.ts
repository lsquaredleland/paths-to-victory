import { createContext } from "react";
import { DelegateData } from "./types";


interface DelegateDataContext {
  setProposalId: (update: number) => void;
  proposalId: number;
  delegates: DelegateData[];
  blockHeight: number;
  setBlockHeight: (update: number) => void;
  setVotingParticipationMin: (update: number) => void;
  votingParticipationMin: number;
  error: string;
}

const Context = createContext<DelegateDataContext>({
  setProposalId: (update: number) => {},
  proposalId: 0,
  delegates: [],
  blockHeight: 0,
  setBlockHeight: (update: number) => {},
  setVotingParticipationMin: (update: number) => {},
  votingParticipationMin: 1,
  error: '',
});

export default Context;