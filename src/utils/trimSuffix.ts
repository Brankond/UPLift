export const trimSuffix = (name: string): string => {
  const nameArr = name.split('.').slice(0, -1);
  return nameArr.join('.');
};
