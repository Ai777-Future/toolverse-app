import "./globals.css";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import Icon from "@/components/Icon";
import SearchBar from "@/components/SearchBar";
import { tools, categories, I } from "@/lib/tools";

const font = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: { default: "ToolVerse - Free online PDF tools", template: "%s | ToolVerse" },
  description: "Merge, split, rotate and edit PDF files online. Free, fast and private.",
};

const groups = categories
  .map((c) => ({ c, list: tools.filter((t) => t.cat === c && t.ready) }))
  .filter((g) => g.list.length);

const Logo = () => (
  <Link href="/" className="logo"><span className="mark"><Icon d={I.doc} size={16} /></span>ToolVerse</Link>
);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className} suppressHydrationWarning>
        <header className="bar">
          <div className="bar-in">
            <Logo />
            <SearchBar />
            <nav>
              <Link href="/merge-pdf">Merge PDF</Link>
              <Link href="/split-pdf">Split PDF</Link>
              <div className="has-mega">
                <button>All PDF tools</button>
                <div className="mega">
                  {groups.map((g) => (
                    <div key={g.c}>
                      <h4>{g.c}</h4>
                      {g.list.map((t) => <Link key={t.slug} href={`/${t.slug}`}>{t.name}</Link>)}
                    </div>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer>
          <div className="foot-in">
            <div className="brand">
              <Logo />
              <p>Free online PDF tools that run in your browser. No sign-up, no uploads.</p>
            </div>
            {categories.map((c) => (
              <div key={c}>
                <h4>{c}</h4>
                {tools.filter((t) => t.cat === c).map((t) =>
                  t.ready ? <Link key={t.slug} href={`/${t.slug}`}>{t.name}</Link>
                          : <span key={t.slug} className="dim">{t.name}</span>
                )}
              </div>
            ))}
          </div>
          <div className="copy">ToolVerse. All files stay on your device.</div>
        </footer>
      </body>
    </html>
  );
}
