import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import JSZip from "jszip";

const pdfBlob = (bytes) => new Blob([bytes], { type: "application/pdf" });
const load = async (file) => PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
const done = async (doc, name) => ({ blob: pdfBlob(await doc.save()), name });

export async function mergePdfs(files) {
  const out = await PDFDocument.create();
  for (const file of files) {
    const src = await load(file);
    (await out.copyPages(src, src.getPageIndices())).forEach((p) => out.addPage(p));
  }
  return done(out, "merged.pdf");
}

function parseRanges(text, total) {
  const t = text.trim();
  if (!t) return Array.from({ length: total }, (_, i) => [i]);
  return t.split(",").map((part) => {
    const [a, b = a] = part.split("-").map((n) => parseInt(n.trim(), 10));
    if (!(a >= 1) || !(b >= a) || b > total) {
      throw new Error(`"${part.trim()}" is not a valid range. This file has ${total} pages.`);
    }
    return Array.from({ length: b - a + 1 }, (_, i) => a - 1 + i);
  });
}

export async function splitPdf(file, rangeText) {
  const src = await load(file);
  const groups = parseRanges(rangeText, src.getPageCount());
  const parts = [];
  for (const g of groups) {
    const doc = await PDFDocument.create();
    (await doc.copyPages(src, g)).forEach((p) => doc.addPage(p));
    parts.push(await doc.save());
  }
  if (parts.length === 1) return { blob: pdfBlob(parts[0]), name: "split.pdf" };
  const zip = new JSZip();
  parts.forEach((bytes, i) => zip.file(`part-${i + 1}.pdf`, bytes));
  return { blob: await zip.generateAsync({ type: "blob" }), name: "split-pdfs.zip" };
}

export async function removePages(file, text) {
  const doc = await load(file);
  const drop = [...new Set(parseRanges(text, doc.getPageCount()).flat())].sort((a, b) => b - a);
  if (drop.length >= doc.getPageCount()) throw new Error("You cannot remove every page of the PDF.");
  drop.forEach((i) => doc.removePage(i));
  return done(doc, "pages-removed.pdf");
}

export async function extractPages(file, text) {
  const src = await load(file);
  const keep = [...new Set(parseRanges(text, src.getPageCount()).flat())].sort((a, b) => a - b);
  const out = await PDFDocument.create();
  (await out.copyPages(src, keep)).forEach((p) => out.addPage(p));
  return done(out, "extracted.pdf");
}

export async function rotatePdf(file, angle) {
  const doc = await load(file);
  doc.getPages().forEach((p) => p.setRotation(degrees((p.getRotation().angle + angle) % 360)));
  return done(doc, "rotated.pdf");
}

export async function addPageNumbers(file, pos) {
  const doc = await load(file);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  doc.getPages().forEach((p, i) => {
    const { width } = p.getSize();
    const s = String(i + 1);
    const w = font.widthOfTextAtSize(s, 11);
    const x = pos === "left" ? 36 : pos === "right" ? width - 36 - w : (width - w) / 2;
    p.drawText(s, { x, y: 24, size: 11, font, color: rgb(0.2, 0.2, 0.25) });
  });
  return done(doc, "numbered.pdf");
}

export async function addWatermark(file, text) {
  const doc = await load(file);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  doc.getPages().forEach((p) => {
    const { width, height } = p.getSize();
    const size = Math.min(width, height) / 8;
    const w = font.widthOfTextAtSize(text, size);
    const k = Math.SQRT1_2;
    p.drawText(text, {
      x: width / 2 - (w / 2) * k + (size / 3) * k,
      y: height / 2 - (w / 2) * k - (size / 3) * k,
      size, font, color: rgb(0.43, 0.16, 0.85), opacity: 0.22, rotate: degrees(45),
    });
  });
  return done(doc, "watermarked.pdf");
}

export async function imagesToPdf(files) {
  const doc = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const img = file.type === "image/png" ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    const page = doc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  return done(doc, "images.pdf");
}

export async function pdfToJpg(file) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const zip = new JSZip();
  let single = null;
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    single = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.92));
    zip.file(`page-${i}.jpg`, single);
  }
  if (pdf.numPages === 1) return { blob: single, name: "page-1.jpg" };
  return { blob: await zip.generateAsync({ type: "blob" }), name: "pdf-pages.zip" };
}

export async function cropPdf(file, mm) {
  if (!(mm > 0)) throw new Error("Enter a crop margin greater than 0.");
  const m = mm * 2.835;
  const doc = await load(file);
  doc.getPages().forEach((p) => {
    const { x, y, width, height } = p.getMediaBox();
    if (width <= 2 * m || height <= 2 * m) throw new Error("The crop margin is larger than the page.");
    p.setCropBox(x + m, y + m, width - 2 * m, height - 2 * m);
  });
  return done(doc, "cropped.pdf");
}

export async function signPdf(file, dataUrl, pos) {
  const doc = await load(file);
  const img = await doc.embedPng(dataUrl);
  const page = doc.getPages().at(-1);
  const { width } = page.getSize();
  const w = 170, h = (img.height / img.width) * w;
  const x = pos === "left" ? 40 : pos === "right" ? width - 40 - w : (width - w) / 2;
  page.drawImage(img, { x, y: 50, width: w, height: h });
  return done(doc, "signed.pdf");
}
