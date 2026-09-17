interface BrandTickerProps {
  /** Public display brand name supplied by the central RPC payload. */
  brandName?: string | undefined;
}

/**
 * Thin floating semi-transparent brand ribbon at the viewport bottom.
 */
export function BrandTicker({ brandName }: BrandTickerProps) {
  if (!brandName) return null;

  const item = (
    <span className="mx-6 inline-flex items-center gap-3 whitespace-nowrap">
      <span aria-hidden className="text-gold-deep/70">
        ∞
      </span>
      <span>Crafted with love by {brandName}</span>
      <span aria-hidden className="text-gold-deep/70">
        ∞
      </span>
    </span>
  );

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-40 flex items-center overflow-hidden"
      style={{
        bottom: 0,
        height: "clamp(13px, 1.7vh, 20px)",
        background:
          "linear-gradient(90deg, transparent, oklch(0.96 0.02 88 / 32%) 12%, oklch(0.96 0.02 88 / 40%) 50%, oklch(0.96 0.02 88 / 32%) 88%, transparent)",
        borderTop: "0.5px solid oklch(0.68 0.075 78 / 45%)",
        borderBottom: "0.5px solid oklch(0.68 0.075 78 / 45%)",
        backdropFilter: "blur(1px)",
        boxShadow: "0 0 12px -6px oklch(0.68 0.075 78 / 60%)",
      }}
      aria-hidden
    >
      <div className="zar-marquee flex w-max">
        <span className="flex text-ink-soft/80" style={{ fontSize: "clamp(8px, 1.05vh, 11px)", letterSpacing: "0.16em" }}>
          {item}
          {item}
          {item}
          {item}
        </span>
        <span className="flex text-ink-soft/80" style={{ fontSize: "clamp(8px, 1.05vh, 11px)", letterSpacing: "0.16em" }}>
          {item}
          {item}
          {item}
          {item}
        </span>
      </div>
    </div>
  );
}
