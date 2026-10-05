"use client";
import { useRef, useState } from "react";
import { mergePdfs, splitPdf, rotatePdf, imagesToPdf } from "@/lib/pdf";

export default function ToolRunner({ tool }) {
  const [files, setFiles] = useState([]);
  const [opt, setOpt] = useState(tool.slug === "rotate-pdf" ? "90" : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const input = useRef(null);
  const min = tool.slug === "merge-pdf" ? 2 : 1;

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
    setResult(null);
    try {
      let out;
      if (tool.slug === "merge-pdf") out = await mergePdfs(files);
      else if (tool.slug === "split-pdf") out = await splitPdf(files[0], opt);
      else if (tool.slug === "rotate-pdf") out = await rotatePdf(files[0], Number(opt));
      else out = await imagesToPdf(files);
      setResult({ url: URL.createObjectURL(out.blob), name: out.name });
    } catch (e) {
      setError(e.message || "This file could not be processed. Check that it is valid and not password protected.");
    }
    setBusy(false);
  };

  if (result) {
    return (
      <div className="panel done">
        <h2>Your file is ready</h2>
        <a className="btn" href={result.url} download={result.name}>Download {result.name}</a>
        <button className="btn ghost" onClick={reset}>Start over</button>
      </div>
    );
  }

  return (
    <div>
      <div
        className="drop"
        onClick={() => input.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); add(e.dataTransfer.files); }}
      >
        <strong>{files.length && tool.multiple ? "Add more files" : "Select files"}</strong>
        <span>or drop them here</span>
        <input ref={input} type="file" hidden accept={tool.accept} multiple={tool.multiple}
          onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
      </div>

      {files.length > 0 && (
        <ul className="files">
          {files.map((f, i) => (
            <li key={f.name + i}>
              <span className="fname">{f.name}</span>
              <span className="acts">
                {tool.multiple && files.length > 1 && (
                  <>
                    <button onClick={() => move(i, -1)} aria-label="Move up">Up</button>
                    <button onClick={() => move(i, 1)} aria-label="Move down">Down</button>
                  </>
                )}
                <button onClick={() => remove(i)}>Remove</button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {files.length > 0 && tool.slug === "split-pdf" && (
        <label className="opt">Page ranges (optional)
          <input value={opt} onChange={(e) => setOpt(e.target.value)} placeholder="Example: 1-3, 5, 8-10. Leave empty for one file per page." />
        </label>
      )}
      {files.length > 0 && tool.slug === "rotate-pdf" && (
        <label className="opt">Rotate by
          <select value={opt} onChange={(e) => setOpt(e.target.value)}>
            <option value="90">90 degrees clockwise</option>
            <option value="180">180 degrees</option>
            <option value="270">90 degrees counterclockwise</option>
          </select>
        </label>
      )}

      {error && <p className="err">{error}</p>}
      {files.length > 0 && files.length < min && <p className="hint">Add at least {min} files to continue.</p>}

      <button className="btn" disabled={busy || files.length < min} onClick={run}>
        {busy ? "Working..." : tool.name}
      </button>
      <p className="hint">Files are processed in your browser and are never uploaded to a server.</p>
    </div>
  );
}
