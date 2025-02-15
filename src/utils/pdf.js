import { readAsArrayBuffer } from "./async-reader";
import * as PDFLib from 'pdf-lib';
// import { normalize } from './helpers';
import download from "downloadjs";

async function
  fnSave(
    pdfFile,
    objects = [],
    name = null,
    isDownload = true
  ) {
  let pdfDoc = {};
  //   let pdfDoc: {
  //     getPages: () => any[];
  //     embedFont: (arg0: unknown) => any;
  //     embedJpg: (arg0: unknown) => any;
  //     embedPng: (arg0: unknown) => any;
  //     embedPdf: (arg0: any) => [any] | PromiseLike<[any]>;
  //     save: () => any;
  //   };

  // const _PDFLib = PDFLib;//require("pdf-lib");
  // const _download = download;// require("downloadjs");

  try {
    pdfDoc = await PDFLib.PDFDocument.load(await readAsArrayBuffer(pdfFile));
  } catch (e) {
    console.log("Failed to load PDF.");
    throw e;
  }

  const pagesProcesses = pdfDoc.getPages().map(async (page, pageIndex) => {
    const currentPage = objects.filter((f) => f.pageCurrentIndex == pageIndex) || [];
    const pageObjects = currentPage[0]?.attachments || []; //find images

    // 'y' starts from bottom in PDFLib, use this to calculate y
    const pageHeight = page.getHeight();
    const embedProcesses = pageObjects.map(async (object) => {
      if (object.type.toLowerCase() === "image") {
        const { file, x, y, width, height } = object;
        let img;
        try {
          if (file.type === "image/jpeg") {
            img = await pdfDoc.embedJpg(await readAsArrayBuffer(file));
          } else {
            img = await pdfDoc.embedPng(await readAsArrayBuffer(file));
          }
          return () =>
            page.drawImage(img, {
              x,
              y: pageHeight - y - height,
              width,
              height,
            });

        } catch (e) {
          console.log("Failed to embed image.", e);
          throw e;
        }
      } 
      // else if (object.type.toLowerCase() === "text") {
      //   const { x, y, text, lineHeight, size = 0, fontFamily, width } = object;
      //   const pdfFont = await pdfDoc.embedFont(fontFamily);
      //   return () =>
      //     page.drawText(text, {
      //       maxWidth: width,
      //       font: pdfFont,
      //       size,
      //       lineHeight,
      //       x,
      //       y: pageHeight - size - y,
      //     });
      // }
      //   else if (object.type.toLowerCase() === 'drawing') {
      //     const {
      //       x,
      //       y,
      //       path,
      //       scale,
      //       stroke = 0,
      //       strokeWidth,
      //     } = object;
      //     const {
      //       pushGraphicsState,
      //       setLineCap,
      //       popGraphicsState,
      //       setLineJoin,
      //       LineCapStyle,
      //       LineJoinStyle,
      //       rgb,
      //     } = PDFLib;
      //     return () => {
      //       page.pushOperators(
      //         pushGraphicsState(),
      //         setLineCap(LineCapStyle.Round),
      //         setLineJoin(LineJoinStyle.Round)
      //       );

      //       const color = window.w3color(stroke).toRgb();

      //       page.drawSvgPath(path, {
      //         borderColor: rgb(
      //           normalize(color.r),
      //           normalize(color.g),
      //           normalize(color.b)
      //         ),
      //         borderWidth: strokeWidth,
      //         scale,
      //         x,
      //         y: pageHeight - y,
      //       });
      //       page.pushOperators(popGraphicsState());
      //     };
      //   }
    });

    //Draw text
    //const timesRomanFont = await pdfDoc.embedFont(PDFLib.StandardFonts.timesRoman)
    page.drawText('By Salakjit P (Demo version 1.0.0)', {
      x: 10,
      y: 10,
      size: 10,
      //font : timesRomanFont,
      // color: PDFLib.rgb(0, 0, 0),
      // opacity: 0.75
    })

    // embed objects in order
    const drawProcesses = (await Promise.all(embedProcesses)) || [];
    drawProcesses.forEach((p) => p());
  });
  await Promise.all(pagesProcesses);
  try {
    const pdfBytes = await pdfDoc.save();
    if (isDownload) {
      download(pdfBytes, name, "application/pdf");
    } else {
      return arrayBufferToFile(pdfBytes, name);
    }
    return pdfBytes;
  } catch (e) {
    console.log("Failed to save PDF.");
    throw e;
  }
}

export async function arrayBufferToFile(buffer, filename) {
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  return new File([blob], filename, { type: "application/octet-stream" });
}

export async function arrayBufferToImage(
  buffer,
  filename,
  type = "image/jpeg"
) {
  const blob = new Blob([buffer], { type: type });
  return new File([blob], filename, { type: type });
}

export async function downloadPDF(blob, filename) {
  const download = require("downloadjs");
  download(blob, filename, "application/pdf");
}

export default {
  save: fnSave,
};