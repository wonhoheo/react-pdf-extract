"use client";

import React, { useState, type ChangeEvent } from "react";
import { PSM, createWorker } from "tesseract.js";
import { loadPdf, readFile, convertToImage } from "../utils/common";

const PDFExtract = () => {
  const [text, setText] = useState<string>("");

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setText("");

    if (!e.target.files) return;

    if (!e.target.files[0]) return;

    try {
      const pdfArrayBuffer = await readFile(e.target.files[0]);
      if (!pdfArrayBuffer) return;

      const pdf = await loadPdf(pdfArrayBuffer);

      const images = await convertToImage(pdf);

      const worker = await createWorker(["kor", "eng"]);

      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_COLUMN,
        user_defined_dpi: "600",
      });

      images.forEach(async (image) => {
        const res = await worker.recognize(image);

        setText((prev) => {
          if (!prev) return res.data.text;

          return `${prev}\n\n\n\n\n\n\n\n${res.data.text}`;
        });
      });
    } catch (e) {}
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <pre>{text}</pre>
    </div>
  );
};

export default PDFExtract;
