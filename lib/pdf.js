import { PDFDocument, degrees } from "pdf-lib";
import JSZip from "jszip";

const pdfBlob = (bytes) => new Blob([bytes], { type: "application/pdf" });
const load = async (file) => PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });

export async function mergePdfs(files) {
  const out = await PDFDocument.create();
  for (const file of files) {
    const src = await load(file);
    (await out.copyPages(src, src.getPageIndices())).forEach((p) => out.addPage(p));
  }
  return { blob: pdfBlob(await out.save()), name: "merged.pdf" };
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

export async function rotatePdf(file, angle) {
  const doc = await load(file);
  doc.getPages().forEach((p) => p.setRotation(degrees((p.getRotation().angle + angle) % 360)));
  return { blob: pdfBlob(await doc.save()), name: "rotated.pdf" };
}

export async function imagesToPdf(files) {
  const doc = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const img = file.type === "image/png" ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    const page = doc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  return { blob: pdfBlob(await doc.save()), name: "images.pdf" };
}
