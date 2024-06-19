"use client";

import React, { useState, type ChangeEvent } from "react";
import { PSM, createWorker } from "tesseract.js";
import { loadPdf, readFile, convertToImage, getText } from "../../utils/common";

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

      const texts = await getText(pdf);

      setText(texts.join("\n\n\n"));
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
