import { useContext } from "react";

import { DelegateDataContext } from "contexts/DelegateData";

const useDelegateData = () => {
  return {
    ...useContext(DelegateDataContext),
  };
};

export default useDelegateData;
