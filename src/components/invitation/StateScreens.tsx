import { InkDivider, InkStroke } from "@/components/ink/InkStroke";
import { InkWrite } from "@/components/ink/InkWrite";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="paper-grain flex min-h-screen items-center justify-center px-6 py-20">
      <div className="w-full max-w-[420px] text-center">{children}</div>
    </main>
  );
}

export function LoadingScreen() {
  return (
    <Shell>
      <InkStroke
        className="mx-auto h-24 w-24"
        viewBox="0 0 100 100"
        d="M50 12 C 72 24, 84 44, 76 64 C 68 84, 34 88, 24 68 C 14 48, 28 24, 50 12"
        duration={2.2}
        once={false}
        strokeWidth={1}
      />
      <p className="eyebrow mt-6">The ink is settling</p>
    </Shell>
  );
}

export function NotFoundScreen() {
  return (
    <Shell>
      <InkWrite text="Not Found" fontSize={80} className="mx-auto max-w-[300px]" duration={1.8} />
      <InkDivider className="my-4" />
      <p className="text-ink-soft text-sm leading-relaxed">
        This page holds no invitation. Please check the link you were given by the family.
      </p>
    </Shell>
  );
}

export function ErrorScreen({ onRetry, detail }: { onRetry: () => void; detail?: string }) {
  return (
    <Shell>
      <InkWrite text="A pause" fontSize={80} className="mx-auto max-w-[260px]" duration={1.6} />
      <InkDivider className="my-4" />
      <p className="text-ink-soft text-sm leading-relaxed">
        The invitation could not be loaded just now. Please try again in a moment.
      </p>
      {detail ? <p className="eyebrow mt-3">{detail}</p> : null}
      <button
        onClick={onRetry}
        className="border-gold-deep/50 text-ink hover:bg-gold/15 mt-7 inline-flex items-center justify-center rounded-full border px-6 py-2 text-xs tracking-[0.24em] uppercase transition-colors"
      >
        Try again
      </button>
    </Shell>
  );
}

export function FallbackScreen({
  shop,
}: {
  shop?: { name?: string | undefined; phone?: string | undefined; whatsapp?: string | undefined; address?: string | undefined; city?: string | undefined; business_contact?: string | undefined } | undefined;
}) {
  return (
    <Shell>
      <InkWrite text="Invitation Unavailable" fontSize={70} className="mx-auto max-w-[360px]" duration={2} />
      <InkDivider className="my-4" />
      <p className="text-ink-soft text-sm leading-relaxed">This invitation is no longer available. Please contact the shop for assistance.</p>
      {shop?.name ? <p className="font-script text-ink mt-7 text-2xl">{shop.name}</p> : null}
      {shop?.address ? <p className="text-ink-soft mt-2 text-sm">{shop.address}</p> : null}
      {shop?.city ? <p className="text-ink-soft text-sm">{shop.city}</p> : null}
      {shop?.business_contact ? <p className="text-ink-soft mt-2 text-sm">{shop.business_contact}</p> : null}
      {shop?.phone ? <a className="text-ink mt-3 inline-block underline" href={`tel:${shop.phone}`}>{shop.phone}</a> : null}
      {shop?.whatsapp ? <a className="text-ink mt-3 block underline" href={shop.whatsapp} target="_blank" rel="noreferrer noopener">WhatsApp</a> : null}
    </Shell>
  );
}
