import { useMemo } from 'react';

import { calcDelegateCombinations } from 'utils/delegateCombinations';
import { DelegateData } from 'contexts/DelegateData/types';
import { Table, Tr, Th, Td } from '@chakra-ui/react';
import { Inline, H3 } from 'components/BasicStyles';


interface CombinationsComponentProps {
  votesRequiredToWin: number;
  remainingDelegates: DelegateData[];
  maxDepth: number;
  loading: boolean;
}

const CombinationsComponent = ({
  votesRequiredToWin,
  remainingDelegates,
  maxDepth,
  loading
}: CombinationsComponentProps) => {
  const depthCount: number[] = useMemo(() => {
    return calcDelegateCombinations(votesRequiredToWin, remainingDelegates, maxDepth)
  }, [votesRequiredToWin, remainingDelegates, maxDepth])

  return (
    <div>
      <Inline>
        <div>
          <H3>Vote Combinations</H3>
          <p style={{margin: "0px"}}>How many unique combinations of voters are there to pass the proposal. Requiring only 1, 2, 3, etc delegates to act</p>
        </div>
      </Inline>
      <Table style={{textAlign: "right"}}>
        <Tr>
          <Th>One</Th>
          <Th>Two</Th>
          <Th>Three</Th>
          <Th>Four</Th>
          <Th>Five</Th>
        </Tr>
        <Tr>
          <Td>{loading ? 'loading' : depthCount[0] || 0}</Td>
          <Td>{loading ? 'loading' : depthCount[1] || 0}</Td>
          <Td>{loading ? 'loading' : depthCount[2] || 0}</Td>
          <Td>{loading ? 'loading' : depthCount[3] || 0}</Td>
          <Td>{loading ? 'loading' : depthCount[4] || 0}</Td>
        </Tr>
      </Table>
    </div>
  )
}

export default CombinationsComponent;