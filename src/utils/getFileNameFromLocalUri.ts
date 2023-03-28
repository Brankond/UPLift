export const getFileNameFromLocalUri = (uri: string) => {
  const fileName = uri.split('/').pop();
  if (!fileName) {
    throw new Error('Invalid local uri');
  }
  return fileName;
};
