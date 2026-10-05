import Link from "next/link";
import { tools } from "@/lib/tools";

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>PDF tools that run in your browser</h1>
        <p>Pick a tool, drop in your files and download the result. Nothing is uploaded, nothing is stored.</p>
      </section>
      <section className="grid">
        {tools.map((t) =>
          t.ready ? (
            <Link key={t.slug} href={`/${t.slug}`} className="card">
              <h2>{t.name}</h2>
              <p>{t.short}</p>
            </Link>
          ) : (
            <div key={t.slug} className="card soon">
              <h2>{t.name}</h2>
              <p>{t.short}</p>
              <small>Coming soon</small>
            </div>
          )
        )}
      </section>
    </>
  );
}
