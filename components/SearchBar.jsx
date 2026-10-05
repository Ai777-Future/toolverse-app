"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { tools } from "@/lib/tools";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const s = q.trim().toLowerCase();
  const hits = s ? tools.filter((t) => (t.name + " " + t.short).toLowerCase().includes(s)).slice(0, 7) : [];
  const go = (t) => { setQ(""); setOpen(false); router.push("/" + t.slug); };

  return (
    <div className="search">
      <input value={q} placeholder="Search tools" aria-label="Search tools"
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { const t = hits.find((h) => h.ready); if (t) go(t); }
          if (e.key === "Escape") setOpen(false);
        }} />
      {open && s && (
        <ul className="results">
          {hits.length ? hits.map((t) => (
            <li key={t.slug}>
              {t.ready ? (
                <button onMouseDown={() => go(t)}><b>{t.name}</b><span>{t.short}</span></button>
              ) : (
                <div className="dim"><b>{t.name}</b><span>Coming soon</span></div>
              )}
            </li>
          )) : <li className="none">No tool found for &quot;{q}&quot;</li>}
        </ul>
      )}
    </div>
  );
}