const PDF = ".pdf,application/pdf";
export const categories = ["Organize", "Optimize", "Convert", "Edit", "Security"];

export const I = {
  doc: "M7 3h7l5 5v13H7zM14 3v5h5",
  merge: "M4 5l6 7-6 7M20 5l-6 7 6 7",
  split: "M10 5L4 12l6 7M14 5l6 7-6 7",
  trash: "M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",
  extract: "M12 4v10M8 10l4 4 4-4M5 20h14",
  compress: "M12 3v6M9 6l3 3 3-3M12 21v-6M9 18l3-3 3 3M4 12h16",
  image: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9h.01",
  rotate: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
  hash: "M5 9h14M5 15h14M10 4L8 20M16 4l-2 16",
  drop: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
  pen: "M4 20l4-1 11-11-3-3L5 16zM14 6l3 3",
  crop: "M6 2v14h14M2 6h14v14",
  scan: "M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M4 12h16",
};

const R = (slug, name, cat, icon, short, extra = {}) =>
  ({ slug, name, cat, icon, short, ready: true, accept: PDF, multiple: false, ...extra });
const S = (slug, name, cat, icon, short) => ({ slug, name, cat, icon, short, ready: false });

export const tools = [
  R("merge-pdf", "Merge PDF", "Organize", I.merge, "Combine PDFs in the order you want into one document.", { multiple: true }),
  R("split-pdf", "Split PDF", "Organize", I.split, "Separate one page or a whole set into independent PDF files.", { opt: "ranges" }),
  R("remove-pages", "Remove pages", "Organize", I.trash, "Delete the pages you do not need from a PDF.", { opt: "ranges", req: true }),
  R("extract-pages", "Extract pages", "Organize", I.extract, "Pull selected pages out into a new PDF.", { opt: "ranges", req: true }),
  S("compress-pdf", "Compress PDF", "Optimize", I.compress, "Reduce file size while keeping quality high."),
  S("repair-pdf", "Repair PDF", "Optimize", I.doc, "Recover data from a damaged PDF."),
  S("ocr-pdf", "OCR PDF", "Optimize", I.scan, "Make scanned PDFs searchable and selectable."),
  R("jpg-to-pdf", "JPG to PDF", "Convert", I.image, "Convert JPG and PNG images to PDF in seconds.",
    { accept: ".jpg,.jpeg,.png,image/jpeg,image/png", multiple: true }),
  S("word-to-pdf", "Word to PDF", "Convert", I.doc, "Make DOC and DOCX files easy to read as PDF."),
  S("pdf-to-word", "PDF to Word", "Convert", I.doc, "Convert a PDF into an editable Word document."),
  R("pdf-to-jpg", "PDF to JPG", "Convert", I.image, "Turn every PDF page into a JPG image."),
  R("rotate-pdf", "Rotate PDF", "Edit", I.rotate, "Rotate every page of a PDF the way you need.", { opt: "rotate" }),
  R("add-page-numbers", "Page numbers", "Edit", I.hash, "Add page numbers to a PDF and choose their position.", { opt: "position" }),
  R("add-watermark", "Add watermark", "Edit", I.drop, "Stamp text across every page of your PDF.", { opt: "text", req: true }),
  R("crop-pdf", "Crop PDF", "Edit", I.crop, "Trim the margins of every page in a PDF.", { opt: "crop", req: true }),
  S("edit-pdf", "Edit PDF", "Edit", I.pen, "Add text, images and shapes to a PDF."),
  S("protect-pdf", "Protect PDF", "Security", I.lock, "Encrypt a PDF with a password."),
  S("unlock-pdf", "Unlock PDF", "Security", I.lock, "Remove password protection from a PDF."),
  R("sign-pdf", "Sign PDF", "Security", I.pen, "Draw your signature and place it on the last page of a PDF.", { opt: "sign" }),
];
