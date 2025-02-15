export const getMovePosition = (
  x,
  y,
  dragX,
  dragY,
  width,
  height,
  pageWidth,
  pageHeight
) => {
  const newPositionTop = y + dragY;
  const newPositionLeft = x + dragX;
  const newPositionRight = newPositionLeft + width;
  const newPositionBottom = newPositionTop + height;

  const top =
    newPositionTop < 0
      ? 0
      : newPositionBottom > pageHeight
      ? pageHeight - height
      : newPositionTop;
  const left =
    newPositionLeft < 0
      ? 0
      : newPositionRight > pageWidth
      ? pageWidth - width
      : newPositionLeft;

  return {
    top,
    left,
  };
};

export const normalize = (value) => parseFloat((value / 255).toFixed(1));

export const calculateElement = (
  element_width,
  element_height,
  content_w,
  content_h
) => {
  const ratio_width = content_w / element_width;
  const ratio_height = content_h / element_height;

  const ratio = ratio_width > ratio_height ? ratio_height : ratio_width;

  const content_width = element_width * ratio;
  const content_height = element_height * ratio;

  return {
    width: content_width,
    height: content_height,
  };
};
