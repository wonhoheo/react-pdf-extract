import dynamic from "next/dynamic";

const PDFTextExtractor = dynamic(() => import("./pdf-text-extract"), {
  ssr: false,
});

export default function Page() {
  return <PDFTextExtractor />;
}
