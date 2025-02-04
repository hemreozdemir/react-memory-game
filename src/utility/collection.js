export const isArrNullOrEmpty = (arr) => {
  return arr === null || arr === undefined || arr.length === 0;
};

export const isObjEmpty = (obj) => Object.keys(obj).length === 0;
