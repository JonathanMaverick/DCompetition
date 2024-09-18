export const convertDate = (timestamp) => {
  const milliseconds = timestamp / 1_000_000;
  return new Date(milliseconds);
};
