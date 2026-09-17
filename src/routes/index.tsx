import { createFileRoute } from "@tanstack/react-router";

import { InkDivider, InkVine } from "@/components/ink/InkStroke";
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
    <main className="paper-grain relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-8 sm:px-8">
      <div className="border-gold-deep/35 relative flex min-h-[min(760px,calc(100dvh-4rem))] w-full max-w-[900px] items-center justify-center border px-7 py-20 shadow-[var(--shadow-paper)] sm:px-16">
        <div className="border-gold/35 pointer-events-none absolute inset-2 border sm:inset-3" aria-hidden="true" />
        <InkVine className="pointer-events-none absolute left-1 top-3 h-32 w-20 opacity-60 sm:left-5 sm:top-6 sm:h-44 sm:w-28" />
        <InkVine className="pointer-events-none absolute bottom-3 right-1 h-32 w-20 opacity-60 sm:bottom-6 sm:right-5 sm:h-44 sm:w-28" flip />
        <div className="relative z-10 w-full max-w-[540px] text-center">
          <p className="eyebrow">ZAR · Digital Invitations</p>
          <div className="bg-gold-deep/70 mx-auto mt-8 h-1 w-1 rounded-full" aria-hidden="true" />
          <h1 className="sr-only">Written in Ink</h1>
          <InkWrite text="Written in Ink" fontSize={94} className="mx-auto mt-5 block w-full max-w-[510px]" duration={2.6} />
          <p className="text-ink-soft mt-1 font-serif text-xl italic sm:text-2xl">A story, beautifully told.</p>
          <InkDivider className="my-8" />
          <p className="text-ink-soft mx-auto max-w-[340px] text-base leading-relaxed sm:text-lg">
            Your invitation opens through the personal link shared with you by the family.
          </p>
          <p className="eyebrow mt-8">Please follow your invitation link</p>
        </div>
      </div>
    </main>
  );
}
