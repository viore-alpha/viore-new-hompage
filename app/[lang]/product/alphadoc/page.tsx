import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../../product.css";
import "../../../alphadoc-v2.css";
import "../../../alphadoc-v2-chat.css";
import "../../../alphadoc-v2-papers.css";
import "../../../alphadoc-v2-features.css";
import "../../../alphadoc-v2-security.css";
import { ProductPage } from "@/app/components/ProductPage";
import { buildPageMetadata, PAGE_SEO } from "@/app/seo";
import { isLanguage } from "@/app/site-content";

type ProductRouteParams = Promise<{ lang: string }>;

export const revalidate = 86_400;

export async function generateMetadata({ params }: { params: ProductRouteParams }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) return {};
  const copy = PAGE_SEO.product[lang];

  return buildPageMetadata({
    lang,
    title: copy.title,
    description: copy.description,
    path: "/product/alphadoc",
  });
}

export default async function AlphadocProductRoute({ params }: { params: ProductRouteParams }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  return <ProductPage language={lang} />;
}
