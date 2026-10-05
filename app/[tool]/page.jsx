import { notFound } from "next/navigation";
import { tools } from "@/lib/tools";
import ToolRunner from "@/components/ToolRunner";

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.filter((t) => t.ready).map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }) {
  const { tool } = await params;
  const t = tools.find((x) => x.slug === tool);
  return t ? { title: t.name, description: t.short } : {};
}

export default async function ToolPage({ params }) {
  const { tool } = await params;
  const t = tools.find((x) => x.slug === tool && x.ready);
  if (!t) notFound();
  return (
    <section className="tool">
      <h1>{t.name}</h1>
      <p className="lead">{t.short}</p>
      <ToolRunner tool={t} />
    </section>
  );
}
