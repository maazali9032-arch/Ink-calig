import { createFileRoute } from "@tanstack/react-router";

import { InkDivider } from "@/components/ink/InkStroke";
import { InkWrite } from "@/components/ink/InkWrite";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digital Wedding Invitations — Ink & Calligraphy" },
      {
        name: "description",
        content:
          "Every invitation opens at its own private link. Please use the link shared with you by the family.",
      },
      { property: "og:title", content: "Digital Wedding Invitations — Ink & Calligraphy" },
      {
        property: "og:description",
        content: "Every invitation opens at its own private link shared by the family.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="paper-grain flex min-h-screen items-center justify-center px-6 py-20">
      <div className="w-full max-w-[420px] text-center">
        <p className="eyebrow">Digital Invitations</p>
        <InkWrite text="Written in Ink" fontSize={86} className="mx-auto mt-4 max-w-[360px]" duration={2.6} />
        <InkDivider className="my-4" />
        <p className="text-ink-soft text-sm leading-relaxed">
          Each invitation lives at its own private link. Please open the link that was shared with you by
          the family.
        </p>
      </div>
    </main>
  );
}
