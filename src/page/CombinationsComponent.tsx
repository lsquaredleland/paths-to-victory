import { useMemo } from 'react';

import { calcDelegateCombinations } from 'utils/delegateCombinations';
import { DelegateData } from 'contexts/DelegateData/types';
import { Inline } from 'components/BasicStyles';
import { Table } from '@chakra-ui/react';


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
      <Table style={{textAlign: "right"}}>
        <tr>
          <th>One</th>
          <th>Two</th>
          <th>Three</th>
          <th>Four</th>
          <th>Five</th>
        </tr>
        <tr>
          <td>{depthCount[0] || 0}</td>
          <td>{depthCount[1] || 0}</td>
          <td>{depthCount[2] || 0}</td>
          <td>{depthCount[3] || 0}</td>
          <td>{depthCount[4] || 0}</td>
        </tr>
      </Table>
    </Inline>
  )
}

export default CombinationsComponent;