import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker";

pdfjsLib.GlobalWorkerOptions.workerSrc = import.meta.url + pdfjsWorker;
export async function convertToImage(pdf: PDFDocumentProxy) {
  const images = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement("canvas");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const ctx2d = canvas.getContext("2d");

    if (!ctx2d) {
      throw new Error("canvas");
    }

    await page.render({
      canvasContext: ctx2d,
      viewport: viewport,
    }).promise;
    images.push(canvas.toDataURL("image/png"));
  }

  return images;
}

export function readFile(file: File) {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export async function loadPdf(file: string | ArrayBuffer) {
  return pdfjsLib.getDocument({
    cMapPacked: true,
    disableFontFace: true,
    data: file,
  }).promise;
}
