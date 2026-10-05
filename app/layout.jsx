import "./globals.css";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";

const font = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: { default: "ToolVerse - Free online PDF tools", template: "%s | ToolVerse" },
  description: "Merge, split, rotate and convert PDF files online. Free, fast and private.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className} suppressHydrationWarning>
        <header className="bar">
          <Link href="/" className="logo"><span className="mark" />ToolVerse</Link>
          <nav>
            <Link href="/merge-pdf">Merge</Link>
            <Link href="/split-pdf">Split</Link>
            <Link href="/rotate-pdf">Rotate</Link>
            <Link href="/jpg-to-pdf">JPG to PDF</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer>ToolVerse. Your files stay on your device.</footer>
      </body>
    </html>
  );
}
