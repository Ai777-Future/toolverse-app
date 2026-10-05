"use client";
import { useRef, useState } from "react";
import { mergePdfs, splitPdf, removePages, extractPages, rotatePdf, addPageNumbers, addWatermark, imagesToPdf } from "@/lib/pdf";

const DEFAULTS = { ranges: "", rotate: "90", position: "center", text: "CONFIDENTIAL" };

export default function ToolRunner({ tool }) {
  const [files, setFiles] = useState([]);
  const [opt, setOpt] = useState(DEFAULTS[tool.opt] ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const input = useRef(null);
  const min = tool.slug === "merge-pdf" ? 2 : 1;
  const isPdf = tool.accept.includes("pdf");
  const ok = files.length >= min && (!tool.req || opt.trim());

  const actions = {
    "merge-pdf": () => mergePdfs(files),
    "split-pdf": () => splitPdf(files[0], opt),
    "remove-pages": () => removePages(files[0], opt),
    "extract-pages": () => extractPages(files[0], opt),
    "rotate-pdf": () => rotatePdf(files[0], Number(opt)),
    "add-page-numbers": () => addPageNumbers(files[0], opt),
    "add-watermark": () => addWatermark(files[0], opt.trim()),
    "jpg-to-pdf": () => imagesToPdf(files),
  };

  const add = (list) => {
    const next = Array.from(list);
    setResult(null);
    setError("");
    setFiles(tool.multiple ? [...files, ...next] : next.slice(0, 1));
  };
  const remove = (i) => setFiles(files.filter((_, k) => k !== i));
  const move = (i, d) => {
    const c = [...files];
    const j = i + d;
    if (j < 0 || j >= c.length) return;
    [c[i], c[j]] = [c[j], c[i]];
    setFiles(c);
  };
  const reset = () => { setFiles([]); setResult(null); setError(""); };

  const run = async () => {
    setBusy(true);
    setError("");
    try {
      const out = await actions[tool.slug]();
      setResult({ url: URL.createObjectURL(out.blob), name: out.name });
    } catch (e) {
      setError(e.message || "This file could not be processed. Check that it is valid and not password protected.");
    }
    setBusy(false);
  };

  if (result) {
    return (
      <div className="center done">
        <h2>Your file is ready</h2>
        <a className="big" href={result.url} download={result.name}>Download {result.name}</a>
        <button className="link" onClick={reset}>Process another file</button>
      </div>
    );
  }

  return (
    <div className="center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); add(e.dataTransfer.files); }}>
      {files.length === 0 ? (
        <>
          <button className="big" onClick={() => input.current.click()}>
            Select {isPdf ? "PDF" : "image"} {tool.multiple ? "files" : "file"}
          </button>
          <p className="hint">or drop {tool.multiple ? "files" : "a file"} here</p>
        </>
      ) : (
        <div className="panel">
          <ul className="files">
            {files.map((f, i) => (
              <li key={f.name + i}>
                <span className="fname">{f.name}</span>
                <span className="acts">
                  {tool.multiple && files.length > 1 && (
                    <>
                      <button onClick={() => move(i, -1)}>Up</button>
                      <button onClick={() => move(i, 1)}>Down</button>
                    </>
                  )}
                  <button onClick={() => remove(i)}>Remove</button>
                </span>
              </li>
            ))}
          </ul>
          {tool.multiple && <button className="link" onClick={() => input.current.click()}>Add more files</button>}

          {tool.opt === "ranges" && (
            <label className="opt">Pages{tool.req ? "" : " (optional)"}
              <input value={opt} onChange={(e) => setOpt(e.target.value)}
                placeholder={tool.req ? "Example: 1-3, 5, 8-10" : "Example: 1-3, 5. Leave empty for one file per page."} />
            </label>
          )}
          {tool.opt === "rotate" && (
            <label className="opt">Rotate by
              <select value={opt} onChange={(e) => setOpt(e.target.value)}>
                <option value="90">90 degrees clockwise</option>
                <option value="180">180 degrees</option>
                <option value="270">90 degrees counterclockwise</option>
              </select>
            </label>
          )}
          {tool.opt === "position" && (
            <label className="opt">Position
              <select value={opt} onChange={(e) => setOpt(e.target.value)}>
                <option value="left">Bottom left</option>
                <option value="center">Bottom center</option>
                <option value="right">Bottom right</option>
              </select>
            </label>
          )}
          {tool.opt === "text" && (
            <label className="opt">Watermark text
              <input value={opt} onChange={(e) => setOpt(e.target.value)} placeholder="Use plain letters and numbers" />
            </label>
          )}

          {error && <p className="err">{error}</p>}
          {files.length < min && <p className="hint">Add at least {min} files to continue.</p>}
          <button className="big" disabled={busy || !ok} onClick={run}>{busy ? "Working..." : tool.name}</button>
        </div>
      )}
      <input ref={input} type="file" hidden accept={tool.accept} multiple={tool.multiple}
        onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
      <p className="private">Your files are processed in your browser and never uploaded.</p>
    </div>
  );
}
