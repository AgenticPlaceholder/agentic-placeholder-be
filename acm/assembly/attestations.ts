
// Auto Generated File.
// Created using Reputation CLI from True Network.
// To update the classes, use the "reputation-cli acm-prepare" at the root directory that contains "true-network".

@inline
function readMemory<T>(index: usize): T {
  return load<T>(index);
}


class ADATTESTATIONSCHEMA {

  rating: u64;
  comment: string;
  userAddress: string;


  constructor() {

    this.rating = readMemory<u64>(0);
    this.comment = readMemory<string>(8);
    this.userAddress = readMemory<string>(16);

  }
}


export class Attestations {
  static adAttestationSchema: ADATTESTATIONSCHEMA = new ADATTESTATIONSCHEMA();
}
