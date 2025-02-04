const importAll = (r) => {
  let images = [];
  let imgObj = {};
  r.keys().forEach((item, index) => {
    images.push({ path: r(item), id: item.replace('./', '') });
    imgObj[item.replace('./', '')] = r(item);
  });
  console.log(imgObj);
  return { images, imgObj };
};
export const allImgPaths = importAll(
  require.context('../assets/images/boardTableImg', false, /\.(png|jpe?g|svg)$/)
);
