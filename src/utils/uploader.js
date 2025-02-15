import { readAsPDF, readAsDataURL, readAsImage } from "./async-reader";
import { calculateElement } from "./helpers";

import { v4 as uuidv4 } from "uuid";

const handlers = {
  pdf: async (file) => {
    try {
      const pdf = await readAsPDF(file);
      return pdf;
      // return {
      //   file,
      //   name: file.name,
      //   pages: Array(pdf.numPages)
      //     .fill(0)
      //     .map((_, index) => pdf.getPage(index + 1)),
      // };
    } catch (error) {
      console.log("Failed to load pdf", error);
      throw new Error("Failed to load PDF");
    }
  },
  image: async (file, resize = null) => {
    try {
      const url = await readAsDataURL(file);
      const img = await readAsImage(url);
      const id = uuidv4();
      const { width, height } = img;

      const resized = !!resize
        ? calculateElement(width, height, resize.w, resize.h)
        : { width: width, height: height };

      const imageAttachemnt = {
        id,
        type: "IMAGE",
        width: resized.width,
        height: resized.height,
        x: 0,
        y: 0,
        img,
        file,
      };
      return imageAttachemnt;
    } catch (error) {
      console.log("Failed to load image", error);
      throw new Error("Failed to load image");
    }
  },
};

export default {
  handlers,
};
