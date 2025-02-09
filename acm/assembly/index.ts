
// The Algorithm.
// This is the space to design your reputation algorithm taking in account 
// multiple schemas across true network to calculate a reputation score for
// your users & the community. 

// This is the starting point, calc function.
// Algorithm Compute Module (ACM) uses this as starting point to execute
// your reputation algorithm and expects an i64 as result.
import { Attestations } from "./attestations";

export function calc(): i64 {
  const adAttestation = Attestations.adAttestationSchema;
  
  // Convert integers to f64 for mathematical operations
  const rating: f64 = <f64>adAttestation.rating;
 
  // Calculate the final reputation score
  const reputationScore: f64 = rating ;

  // Convert final score back to i64 for return
  return <i64>reputationScore;
}