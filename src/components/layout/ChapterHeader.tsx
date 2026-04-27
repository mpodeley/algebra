import { Section } from './Section'

export function ChapterHeader({
  act,
  number,
  title,
  dek,
}: {
  act: string
  number: string
  title: string
  dek?: string
}) {
  return (
    <header className="border-b border-line">
      <Section width="prose" className="py-16 sm:py-24">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-mute">
          {act} · Chapter {number}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {dek && (
          <p className="mt-6 max-w-[34rem] text-lg leading-snug text-mute">
            {dek}
          </p>
        )}
      </Section>
    </header>
  )
}
