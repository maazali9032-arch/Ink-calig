import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MapPin, Music2, Pause, Phone, MessageCircle, Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { BrandTicker } from "@/components/BrandTicker";
import { InkDivider, InkStroke, InkVine } from "@/components/ink/InkStroke";
import { InkWrite } from "@/components/ink/InkWrite";
import { Reveal, Section, SectionTitle } from "@/components/invitation/Reveal";
import type { InvitationView as Data } from "@/lib/invitation";

/* ---------------------------------------------------------------- opening */

function InkOrigin() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const fade = useTransform(scrollY, [0, 320], [1, 0]);

  return (
    <section className="paper-grain relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6">
      <motion.div style={{ opacity: reduced ? 1 : fade }} className="flex flex-col items-center text-center">
        <p className="eyebrow">To a beautiful beginning</p>
        <div className="relative mt-8 h-40 w-full max-w-[320px]">
          {/* the first drop of ink */}
          <motion.span
            className="bg-ink absolute left-1/2 top-2 block rounded-full"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ width: 9, height: 9, opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.9, ease: "easeOut" }}
            style={{ marginLeft: -4 }}
          />
          {/* the first gesture travelling out of that drop */}
          <InkStroke
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 320 160"
            d="M160 8 C 160 40, 120 52, 96 74 C 62 104, 86 140, 130 132 C 176 124, 206 92, 236 74 C 262 58, 292 62, 306 84"
            color="var(--ink)"
            strokeWidth={1.6}
            duration={reduced ? 0 : 2.8}
            delay={0.6}
            once={false}
          />
        </div>
        <div className="text-ink-soft mt-6 space-y-1 text-[0.7rem] tracking-[0.34em] uppercase">
          <p>A story of</p>
          <p>two hearts</p>
          <p>is being written</p>
        </div>
        <motion.p
          className="eyebrow mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0 : 3.4, duration: 1 }}
        >
          Scroll to explore
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------- hero */

function Hero({ data }: { data: Data }) {
  const both = Boolean(data.groomName && data.brideName);
  return (
    <section className="paper-grain relative flex min-h-[96vh] flex-col items-center justify-center overflow-hidden px-6 py-16">
      <InkVine className="pointer-events-none absolute -left-2 top-10 h-40 w-24 opacity-70" />
      <InkVine className="pointer-events-none absolute -right-2 bottom-16 h-40 w-24 opacity-70" flip delay={0.4} />

      {data.invocation ? (
        <Reveal className="mb-6 max-w-[460px] text-center">
          <p className="text-ink text-[1.15rem] leading-relaxed" lang="und">
            {data.invocation}
          </p>
        </Reveal>
      ) : null}

      <Reveal className="mb-8 text-center" delay={0.1}>
        <p className="eyebrow">We invite you to the wedding of</p>
      </Reveal>

      <div className="w-full max-w-[440px] text-center">
        {data.groomName ? (
          <InkWrite text={data.groomName} fontSize={110} className="mx-auto block w-full" duration={2.6} delay={0.3} />
        ) : null}
        {both ? (
          <InkWrite
            text="&"
            fontSize={110}
            className="mx-auto block w-24"
            duration={1}
            delay={2.6}
            color="var(--gold-deep)"
            nib={false}
          />
        ) : null}
        {data.brideName ? (
          <InkWrite text={data.brideName} fontSize={110} className="mx-auto block w-full" duration={2.6} delay={3.2} />
        ) : null}
      </div>

      <Reveal delay={0.2} className="mt-10 text-center">
        <p className="eyebrow">Two souls, one beautiful journey</p>
        {data.weddingDate ? (
          <>
            <InkDivider className="my-4" />
            <p className="text-ink font-serif text-xl tracking-[0.18em] uppercase">{data.weddingDate}</p>
          </>
        ) : null}
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------- portraits */

function Portrait({
  photo,
  name,
  qualification,
  occupation,
  parents,
  parentLabel,
}: {
  photo?: string | undefined;
  name?: string | undefined;
  qualification?: string | undefined;
  occupation?: string | undefined;
  parents?: string | undefined;
  parentLabel: string;
}) {
  if (!name && !photo) return null;
  return (
    <div className="flex-1 text-center">
      {photo ? (
        <div className="border-gold/60 mx-auto mb-4 overflow-hidden border shadow-[var(--shadow-paper)]"
          style={{ borderRadius: "999px 999px 12px 12px", width: "min(45vw, 150px)", aspectRatio: "3 / 4" }}
        >
          <img src={photo} alt={name ?? ""} loading="lazy" className="h-full w-full object-cover" />
        </div>
      ) : null}
      {name ? <p className="font-script text-ink text-[1.7rem] leading-tight">{name}</p> : null}
      {qualification ? <p className="text-ink-soft text-xs">{qualification}</p> : null}
      {occupation ? <p className="text-ink-soft text-xs">{occupation}</p> : null}
      {parents ? (
        <p className="text-ink-soft mt-2 text-xs leading-relaxed">
          <span className="eyebrow block">{parentLabel}</span>
          {parents}
        </p>
      ) : null}
    </div>
  );
}

function Families({ data }: { data: Data }) {
  const hasCouple = Boolean(
    data.groomPhoto ||
      data.bridePhoto ||
      data.groomParents ||
      data.brideParents ||
      data.groomQualification ||
      data.brideQualification ||
      data.groomOccupation ||
      data.brideOccupation,
  );
  const hasRelatives = Boolean(data.relatives?.length);
  if (!hasCouple && !hasRelatives && !data.invitationMessage) return null;

  return (
    <Section>
      <SectionTitle text="You Are Cordially Invited" />
      {data.invitationMessage ? (
        <Reveal className="mb-9 text-center">
          <p className="text-ink-soft mx-auto max-w-[340px] text-sm leading-relaxed">{data.invitationMessage}</p>
        </Reveal>
      ) : null}

      {hasCouple ? (
        <Reveal delay={0.1}>
          <div className="flex items-start justify-center gap-5">
            <Portrait
              photo={data.groomPhoto}
              name={data.groomName}
              qualification={data.groomQualification}
              occupation={data.groomOccupation}
              parents={data.groomParents}
              parentLabel="Son of"
            />
            <div className="bg-gold/40 mt-10 w-px self-stretch" />
            <Portrait
              photo={data.bridePhoto}
              name={data.brideName}
              qualification={data.brideQualification}
              occupation={data.brideOccupation}
              parents={data.brideParents}
              parentLabel="Daughter of"
            />
          </div>
        </Reveal>
      ) : null}

      {hasRelatives ? (
        <Reveal delay={0.15} className="mt-10 text-center">
          <p className="font-script text-ink text-2xl">Our Beloved Families</p>
          <ul className="text-ink-soft mt-3 space-y-1 text-sm">
            {data.relatives!.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Reveal>
      ) : null}
    </Section>
  );
}

/* ----------------------------------------------------------------- events */

function Events({ data }: { data: Data }) {
  const reduced = useReducedMotion();
  if (!data.events.length) return null;
  return (
    <Section>
      <SectionTitle text="Wedding Events" />
      <div className="relative pl-8">
        <motion.div
          className="bg-gold/60 absolute left-2 top-1 w-px origin-top"
          style={{ bottom: 4 }}
          initial={{ scaleY: reduced ? 1 : 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduced ? 0 : 1.4, ease: "easeInOut" }}
        />
        <div className="space-y-9">
          {data.events.map((e, i) => (
            <Reveal key={`${e.name ?? "event"}-${i}`} delay={0.25 + i * 0.2}>
              <span className="bg-gold absolute left-[3px] mt-2 block h-2 w-2 rounded-full" style={{ marginLeft: 0 }} />
              {e.name ? <p className="font-script text-ink text-[1.6rem] leading-none">{e.name}</p> : null}
              <div className="text-ink-soft mt-1 space-y-0.5 text-sm">
                {e.date ? <p>{e.date}</p> : null}
                {e.time ? <p>{e.time}</p> : null}
                {e.venue ? <p>{e.venue}</p> : null}
                {e.note ? <p className="text-ink-faint">{e.note}</p> : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal className="mt-10 text-center" delay={0.2}>
        <p className="eyebrow">Different moments, same forever</p>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ venue */

function Venue({ data }: { data: Data }) {
  if (!data.venueName && !data.venueAddress && !data.venueCity && !data.venueImage && !data.venueMapsUrl) return null;
  return (
    <Section>
      <SectionTitle text="Venue" />
      {data.venueImage ? (
        <Reveal className="mb-6">
          <div className="border-gold/50 overflow-hidden rounded-sm border shadow-[var(--shadow-paper)]">
            <img src={data.venueImage} alt={data.venueName ?? "Venue"} loading="lazy" className="w-full object-cover" />
          </div>
        </Reveal>
      ) : null}
      <Reveal delay={0.1} className="text-center">
        {data.venueName ? <p className="text-ink font-serif text-2xl">{data.venueName}</p> : null}
        {data.venueAddress ? <p className="text-ink-soft mt-2 text-sm leading-relaxed">{data.venueAddress}</p> : null}
        {data.venueCity ? <p className="text-ink-soft text-sm">{data.venueCity}</p> : null}
        {data.venueMapsUrl ? (
          <a
            href={data.venueMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-gold-deep/50 text-ink hover:bg-gold/15 mt-6 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-[0.7rem] tracking-[0.24em] uppercase transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" /> Get Directions
          </a>
        ) : null}
      </Reveal>
    </Section>
  );
}

/* ---------------------------------------------------------------- gallery */

function Gallery({ data }: { data: Data }) {
  if (!data.gallery.length) return null;
  return (
    <Section>
      <SectionTitle text="Our Journey" />
      <Reveal className="mb-5 text-center">
        <p className="eyebrow">Some moments, a lifetime of memories</p>
      </Reveal>
      <div className="grid grid-cols-2 gap-3">
        {data.gallery.map((src, i) => (
          <Reveal key={src} delay={i * 0.08} className={i % 3 === 0 ? "col-span-2" : ""}>
            <div className="border-gold/40 overflow-hidden rounded-sm border bg-paper-deep shadow-[var(--shadow-paper)]">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8 text-center">
        <p className="eyebrow">A few frames from our forever</p>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------- rsvp */
/* Animation only. Nothing is stored, counted or transmitted. */

function Rsvp() {
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const reduced = useReducedMotion();

  return (
    <Section>
      <SectionTitle text="Will You Be There?" />
      <Reveal className="text-center">
        <p className="eyebrow">Your presence will make our day even more special</p>
      </Reveal>

      <div className="relative mx-auto mt-8 max-w-[300px]">
        <InkStroke
          className="mx-auto h-40 w-full"
          viewBox="0 0 280 160"
          d="M20 30 L 140 110 L 260 30 M20 30 L 20 140 L 260 140 L 260 30 L 20 30"
          color="var(--ink-soft)"
          strokeWidth={1.1}
          duration={2.2}
        />
        <AnimatePresence>
          {choice ? (
            <motion.span
              key="seal"
              className="absolute left-1/2 top-[58%] block h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full"
              initial={{ scale: reduced ? 1 : 0.2, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              style={{
                background: choice === "yes" ? "var(--sage)" : "var(--rose-clay)",
                boxShadow: "inset 0 2px 6px oklch(1 0 0 / 25%), 0 6px 14px -8px oklch(0.3 0.03 60 / 70%)",
              }}
            />
          ) : null}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={() => setChoice("yes")}
          aria-pressed={choice === "yes"}
          className={`flex-1 rounded-sm border px-4 py-3 text-[0.7rem] tracking-[0.2em] uppercase transition-all ${
            choice === "yes"
              ? "border-sage bg-sage/20 text-ink"
              : "border-gold-deep/40 text-ink-soft hover:border-sage/70"
          }`}
        >
          <Check className="mx-auto mb-1 h-4 w-4" /> Will Be There
        </button>
        <button
          onClick={() => setChoice("no")}
          aria-pressed={choice === "no"}
          className={`flex-1 rounded-sm border px-4 py-3 text-[0.7rem] tracking-[0.2em] uppercase transition-all ${
            choice === "no"
              ? "border-rose-clay bg-rose-clay/15 text-ink"
              : "border-gold-deep/40 text-ink-soft hover:border-rose-clay/70"
          }`}
        >
          <X className="mx-auto mb-1 h-4 w-4" /> Regretfully Decline
        </button>
      </div>

      <AnimatePresence>
        {choice ? (
          <motion.div
            key={choice}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-7 text-center"
          >
            <p className="font-script text-ink text-2xl">
              {choice === "yes" ? "Thank you for being a part of our story" : "You will be missed, with love"}
            </p>
            <InkDivider className="mt-3" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Section>
  );
}

/* --------------------------------------------------------------- contacts */

function digits(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

function Contacts({ data }: { data: Data }) {
  if (!data.contacts.length) return null;

  return (
    <Section>
      <SectionTitle text="Get In Touch" />
      {data.contacts.length ? (
        <>
          <Reveal className="mb-5 text-center">
            <p className="eyebrow">For any queries, feel free to contact our family</p>
          </Reveal>
          <div className="space-y-3">
            {data.contacts.map((c, i) => (
              <Reveal key={`${c.phone}-${i}`} delay={i * 0.1}>
                <div className="border-gold/50 bg-paper/70 flex items-center justify-between gap-3 rounded-sm border px-4 py-3">
                  <div className="min-w-0">
                    {c.name ? <p className="text-ink truncate font-serif text-base">{c.name}</p> : null}
                    {c.relation ? <p className="eyebrow">{c.relation}</p> : null}
                    <p className="text-ink-soft text-sm">{c.phone}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <a
                      href={`tel:${c.phone}`}
                      aria-label={`Call ${c.name ?? c.phone}`}
                      className="border-gold-deep/40 text-ink-soft hover:bg-gold/15 flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                    <a
                      href={c.whatsapp_url ?? `https://wa.me/${digits(c.phone!)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${c.name ?? c.phone}`}
                      className="border-gold-deep/40 text-ink-soft hover:bg-gold/15 flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </>
      ) : null}

    </Section>
  );
}

/* ---------------------------------------------------------------- closing */

function Closing() {
  return (
    <Section className="pb-28 text-center">
      <InkStroke
        className="mx-auto h-24 w-64"
        viewBox="0 0 260 90"
        d="M8 60 C 50 20, 96 82, 132 46 C 158 20, 184 34, 196 52 C 206 66, 222 68, 252 40"
        color="var(--ink-soft)"
        strokeWidth={1.2}
        duration={2.4}
      />
      <Reveal>
        <p className="font-script text-ink text-3xl">Thank You</p>
        <p className="eyebrow mt-2">for being a part of our story</p>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ music */

function MusicToggle({ url }: { url: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    return () => {
      el?.pause();
    };
  }, []);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    }
  };

  return (
    <>
      <audio ref={ref} src={url} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        className="border-gold/60 bg-paper/80 text-ink-soft fixed bottom-5 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}
      </button>
    </>
  );
}

/* ------------------------------------------------------------------- root */

export function InvitationExperience({ data }: { data: Data }) {
  return (
    <main className="relative">
      <BrandTicker brandName={data.brandName} />
      <InkOrigin />
      <Hero data={data} />
      <Families data={data} />
      <Events data={data} />
      <Venue data={data} />
      <Gallery data={data} />
      <Rsvp />
      <Contacts data={data} />
      <Closing />
      {data.musicEnabled && data.musicUrl ? <MusicToggle url={data.musicUrl} /> : null}
    </main>
  );
}
