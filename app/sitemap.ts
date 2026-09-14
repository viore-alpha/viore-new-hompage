import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/app/seo";

const localizedPages = [
  { path: "", lastModified: "2026-07-27", changeFrequency: "weekly", priority: { ko: 1, en: 0.9 } },
  { path: "/technology", lastModified: "2026-07-30", changeFrequency: "weekly", priority: { ko: 0.9, en: 0.8 } },
  { path: "/product/alphadoc", lastModified: "2026-07-27", changeFrequency: "weekly", priority: { ko: 0.9, en: 0.8 } },
  { path: "/knowledge", lastModified: "2026-07-27", changeFrequency: "weekly", priority: { ko: 0.8, en: 0.7 } },
  { path: "/legal", lastModified: "2026-07-20", changeFrequency: "yearly", priority: { ko: 0.3, en: 0.3 } },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return localizedPages.flatMap((page) => {
    const koUrl = `${SITE_ORIGIN}/ko${page.path}`;
    const enUrl = `${SITE_ORIGIN}/en${page.path}`;
    const languages = {
      "ko-KR": koUrl,
      "en-US": enUrl,
      "x-default": koUrl,
    };

    return [
      {
        url: koUrl,
        lastModified: page.lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority.ko,
        alternates: { languages },
      },
      {
        url: enUrl,
        lastModified: page.lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority.en,
        alternates: { languages },
      },
    ];
  });
}
