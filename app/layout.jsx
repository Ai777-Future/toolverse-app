import "./globals.css";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import Icon from "@/components/Icon";
import { tools, categories, I } from "@/lib/tools";

const font = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: { default: "ToolVerse - Free online PDF tools", template: "%s | ToolVerse" },
  description: "Merge, split, rotate and edit PDF files online. Free, fast and private.",
};

const groups = categories
  .map((c) => ({ c, list: tools.filter((t) => t.cat === c && t.ready) }))
  .filter((g) => g.list.length);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className} suppressHydrationWarning>
        <header className="bar">
          <div className="bar-in">
            <Link href="/" className="logo"><span className="mark"><Icon d={I.doc} size={16} /></span>ToolVerse</Link>
            <nav>
              <Link href="/merge-pdf">Merge PDF</Link>
              <Link href="/split-pdf">Split PDF</Link>
              <Link href="/jpg-to-pdf">JPG to PDF</Link>
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
              <Link href="/" className="logo"><span className="mark"><Icon d={I.doc} size={16} /></span>ToolVerse</Link>
              <p>Free online PDF tools that run in your browser.</p>
            </div>
            {groups.map((g) => (
              <div key={g.c}>
                <h4>{g.c}</h4>
                {g.list.map((t) => <Link key={t.slug} href={`/${t.slug}`}>{t.name}</Link>)}
              </div>
            ))}
          </div>
          <p className="copy">ToolVerse. All files stay on your device.</p>
        </footer>
      </body>
    </html>
  );
}
