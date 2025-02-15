import * as pdfjsLib from 'pdfjs-dist';
// import * as pdfjsLib from 'pdfjs-dist/webpack';
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;


const readAsPDF = async (file) => {
  // Safari possibly get webkitblobresource error 1 when using origin file blob
  const blob = new Blob([file], { type: 'application/pdf' });
  const fileURL = URL.createObjectURL(blob);
  return pdfjsLib.getDocument(fileURL).promise;
};

const readAsArrayBuffer = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const readAsImage = async (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    if (src instanceof Blob) {
      const url = window.URL.createObjectURL(src);
      img.src = url;
    } else {
      img.src = src;
    }
  });
};

const readAsDataURL = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export {
  readAsPDF,
  readAsArrayBuffer,
  readAsImage,
  readAsDataURL
}
