import { useMemo } from 'react';

import { calcDelegateCombinations } from 'utils/delegateCombinations';
import { DelegateData } from 'contexts/DelegateData/types';
import { Inline } from 'components/BasicStyles';


interface CombinationsComponentProps {
  votesRequiredToWin: number;
  remainingDelegates: DelegateData[]
  maxDepth: number
}

const CombinationsComponent = ({ votesRequiredToWin, remainingDelegates, maxDepth }: CombinationsComponentProps) => {
  const depthCount: number[] = useMemo(() => {
    return calcDelegateCombinations(votesRequiredToWin, remainingDelegates, maxDepth)
  }, [votesRequiredToWin, remainingDelegates, maxDepth])

  return (
    <Inline>
      <table style={{textAlign: "right", border: "2px solid white"}}>
        <tr style={{border: "2px solid white"}}>
          <th style={{border: "2px solid white"}}>One</th>
          <th style={{border: "2px solid white"}}>Two</th>
          <th style={{border: "2px solid white"}}>Three</th>
          <th style={{border: "2px solid white"}}>Four</th>
          <th style={{border: "2px solid white"}}>Five</th>
        </tr>
        <tr style={{border: "2px solid white"}}>
          <td style={{border: "2px solid white"}}>{depthCount[0] || 0}</td>
          <td style={{border: "2px solid white"}}>{depthCount[1] || 0}</td>
          <td style={{border: "2px solid white"}}>{depthCount[2] || 0}</td>
          <td style={{border: "2px solid white"}}>{depthCount[3] || 0}</td>
          <td style={{border: "2px solid white"}}>{depthCount[4] || 0}</td>
        </tr>
      </table>
    </Inline>
  )
}

export default CombinationsComponent;