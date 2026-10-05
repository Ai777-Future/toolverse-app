const PDF = ".pdf,application/pdf";

export const tools = [
  { slug: "merge-pdf", name: "Merge PDF", short: "Combine several PDF files into one, in the order you choose.", accept: PDF, multiple: true, ready: true },
  { slug: "split-pdf", name: "Split PDF", short: "Separate every page, or cut out the page ranges you need.", accept: PDF, multiple: false, ready: true },
  { slug: "rotate-pdf", name: "Rotate PDF", short: "Turn every page of a PDF by 90, 180 or 270 degrees.", accept: PDF, multiple: false, ready: true },
  { slug: "jpg-to-pdf", name: "JPG to PDF", short: "Turn JPG and PNG images into a single PDF, one image per page.", accept: ".jpg,.jpeg,.png,image/jpeg,image/png", multiple: true, ready: true },
  { slug: "compress-pdf", name: "Compress PDF", short: "Reduce the file size of a PDF.", ready: false },
  { slug: "pdf-to-jpg", name: "PDF to JPG", short: "Save each PDF page as an image.", ready: false },
  { slug: "word-to-pdf", name: "Word to PDF", short: "Convert DOC and DOCX files to PDF.", ready: false },
  { slug: "pdf-to-word", name: "PDF to Word", short: "Convert a PDF into an editable Word file.", ready: false },
];
