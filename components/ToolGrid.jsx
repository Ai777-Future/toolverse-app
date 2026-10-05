"use client";
import { useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import { tools, categories } from "@/lib/tools";

export default function ToolGrid() {
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? tools : tools.filter((t) => t.cat === cat);
  return (
    <>
      <div className="tabs">
        {["All", ...categories].map((c) => (
          <button key={c} className={c === cat ? "on" : ""} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <div className="grid">
        {list.map((t) => {
          const body = (
            <>
              <span className="ico"><Icon d={t.icon} /></span>
              <h2>{t.name}</h2>
              <p>{t.short}</p>
              {!t.ready && <span className="badge">Coming soon</span>}
            </>
          );
          return t.ready ? (
            <Link key={t.slug} href={`/${t.slug}`} className="card" data-cat={t.cat}>{body}</Link>
          ) : (
            <div key={t.slug} className="card soon" data-cat={t.cat}>{body}</div>
          );
        })}
      </div>
    </>
  );
}
