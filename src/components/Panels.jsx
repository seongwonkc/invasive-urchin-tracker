import { motion } from "motion/react";

export function Card({ title, kicker, action, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-ink-700/70 bg-ink-900/80 p-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] backdrop-blur sm:p-5 ${className}`}
    >
      {(title || kicker || action) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            {kicker && (
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
                {kicker}
              </p>
            )}
            {title && (
              <h2 className="font-display text-lg font-semibold text-foam">{title}</h2>
            )}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function PhotoStrip({ photos, loading, error, species }) {
  return (
    <Card
      kicker="Know it when you see it"
      title={`What ${species.shortName} looks like`}
      action={
        <span className="hidden text-[11px] text-mist sm:block">
          Photos by GBIF contributors, used under their licenses
        </span>
      }
    >
      {error ? (
        <p className="text-sm text-uni-300">Could not load photos: {error.message}</p>
      ) : loading ? (
        <div className="flex gap-3 overflow-hidden">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-56 w-44 shrink-0 animate-pulse rounded-xl bg-ink-800" />
          ))}
        </div>
      ) : photos?.length ? (
        <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
          {photos.map((photo, index) => (
            <motion.a
              key={photo.key}
              href={photo.href}
              target="_blank"
              rel="noreferrer"
              className="group w-44 shrink-0 snap-start overflow-hidden rounded-xl border border-ink-700 bg-ink-950"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index, 8) * 0.05 }}
            >
              <div className="h-40 overflow-hidden bg-ink-800">
                <img
                  src={photo.src}
                  alt={`${species.commonName} observation${photo.place ? ` in ${photo.place}` : ""}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-0.5 p-2.5 text-[11px] leading-snug">
                <div className="truncate text-foam/90">{photo.place || "Location not given"}</div>
                <div className="font-mono text-mist">{photo.date}</div>
                <div className="truncate text-mist">
                  © {photo.creator} · {photo.license}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-mist">No openly licensed photos found for this view.</p>
      )}
    </Card>
  );
}

export function ActionLog({ entries }) {
  return (
    <Card kicker="Project history" title="Student action log">
      <ol className="relative ml-2 border-l border-ink-600">
        {entries.map((entry, index) => (
          <motion.li
            key={`${entry.date}-${entry.title}`}
            className="relative pb-5 pl-5 last:pb-0"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: index * 0.08 }}
          >
            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-kelp-400 ring-4 ring-ink-900" />
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-kelp-300">
              {entry.date}
            </p>
            <p className="mt-0.5 font-semibold text-foam">{entry.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-mist">{entry.text}</p>
          </motion.li>
        ))}
      </ol>
    </Card>
  );
}
