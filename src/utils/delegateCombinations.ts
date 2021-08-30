import { DelegateData } from "contexts/DelegateData/types";

// Are there optimizations that can be done b/c `delegates` is ordered?
export function calcDelegateCombinations(
  minValue: number,
  de: DelegateData[], // Ordered list
  maxDepth: number = 5,
) : number[] {
  /*
    * Look at 1st index, then compare to index 2, 3... until value is less than success break
    * look at 2nd index, then compare to index 3, 4.. until value is less than success break

    * For 3 items
    * Look at 1st + 2nd index then compare to 3, 4... " "
    * Look at 1st + 3rd index then compare to 4, 5... " "
    * 
    * For 4 items
    * Look at 1st, 2nd, 3rd then compare to 4, 5....
    * Look at 1st, 2nd, 4th then compare to 5, 6....
    * Look at 1st, 2nd, nth then compare to n+1...
    * Look at 1st, 3rd, 4th then compare to 5, 6...
    * Look at 1st, 3rd, 5th etc etc
  */
  
  // let count = 0;
  let depthCount: number[] = [];
  const calc = (prevStep: number, voterSum: number, depth: number) => {
    if (depth === maxDepth || minValue === 0) {
      return
    };

    for (let i = prevStep + 1; i < de.length; i++) {
      if (depthCount[depth] === undefined) {
        depthCount.push(0)
      }

      if (voterSum + de[i].delegatedVotes > minValue) {
        // count++
        depthCount[depth] += 1
        continue
      }
      
      calc(i, voterSum + de[i].delegatedVotes, depth + 1)
    }
  }

  console.log("start computationally intensive task")
  calc(-1,0,0);
  console.log("finish")

  return depthCount
}

export function calcMinDelegatesToValue(
  value: number,
  delegates: DelegateData[],
  voteMinimum: number = 0
) {
  let accumulator: number = 0;
  let minDelegatesToValue: number = 0;

  for (let i: number = 0; i < delegates.length; i++) {
    accumulator += delegates[i].voted >= voteMinimum ? delegates[i].delegatedVotes : 0;
    if (accumulator >= value) {
      minDelegatesToValue = i+1;
      break;
    }
  }

  return minDelegatesToValue;
}