
export const convertDate = (timestamp) => {
    const milliseconds = timestamp / 1_000_000;
    return new Date(milliseconds);
  };


  export const convertBigInt = (timestamp) => {
    // Ensure timestamp is converted to a number if it's a BigInt
    const milliseconds = Number(timestamp) / 1_000_000;
    return new Date(milliseconds);
  };
    