import ToolGrid from "@/components/ToolGrid";

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Every tool you need to work with PDFs in one place</h1>
        <p>Merge, split, rotate, number and watermark PDFs in a few clicks. Free to use, with no sign-up.</p>
      </section>
      <section className="tools"><ToolGrid /></section>
      <section className="why">
        <div><h3>Private by design</h3><p>Files are processed inside your browser. They are never uploaded to our servers.</p></div>
        <div><h3>No account needed</h3><p>Open a tool, add your file and download the result. That is all.</p></div>
        <div><h3>Works on any device</h3><p>Use ToolVerse on your phone, tablet or computer, with nothing to install.</p></div>
      </section>
    </>
  );
}
