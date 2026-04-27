import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { LinearCombo } from '../../components/viz/LinearCombo'
import { SpanExplorer } from '../../components/viz/SpanExplorer'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function Chapter02() {
  const next = getNextChapter('02-linear-combinations')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.la}
        number="02"
        title="Linear combinations, span, basis."
        dek="Two operations from the last chapter, two vectors, and a question — which points can you reach? The answer turns out to be either a line or the entire plane, with nothing in between."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The closing widget of the previous chapter promised something: pick
          two vectors, slide them anywhere, and every other point in the
          plane has to follow. The reason was the same equation we have been
          carrying since the start —
        </p>

        <EqBlock tex="P \;=\; a \, \hat{\imath} \;+\; b \, \hat{\jmath}" />

        <p className="text-[17px] leading-[1.7] text-ink">
          — which says that any point <em>P</em> in the plane can be reached
          by <em>scaling</em> the two basis vectors and <em>adding</em> the
          results. An expression of that form, two scalars times two
          vectors and then summed, is called a <em>linear combination</em>.
          The pair of numbers <Eq tex="(a, b)" /> tells you how much of each
          basis vector to use.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          With the standard basis it is almost too easy: <Eq tex="a" /> is
          horizontal distance and <Eq tex="b" /> is vertical distance, and
          the linear combination is just the coordinates. But the
          construction itself — scale, then add tip-to-tail — is what
          generalizes. Watch.
        </p>
      </Section>

      <Section width="wide">
        <LinearCombo />
        <Caption>
          The blue arrow is <Eq tex="a \, \hat{\imath}" />: scale the unit
          basis vector <Eq tex="\hat{\imath}" /> by <em>a</em>. The coral
          arrow is <Eq tex="b \, \hat{\jmath}" />, drawn tip-to-tail off the
          blue one. Their endpoint is the linear combination{' '}
          <Eq tex="P = a \, \hat{\imath} + b \, \hat{\jmath}" />.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Now the substantive question. Forget the standard basis; pick two
          arbitrary vectors <em>v</em> and <em>w</em>. As <em>a</em> and{' '}
          <em>b</em> sweep over every real number, the linear combination{' '}
          <Eq tex="a v + b w" /> traces out some set of points in the
          plane. That set has a name: the <em>span</em> of <em>v</em> and{' '}
          <em>w</em>.
        </p>

        <EqBlock tex="\mathrm{span}(v, w) \;=\; \{\, a v + b w \;:\; a, b \in \mathbb{R} \,\}" />

        <p className="text-[17px] leading-[1.7] text-ink">
          Most of the time, you can reach anywhere; the span is all of
          the plane. But there is one way for it to fail. Drag <em>v</em>{' '}
          and <em>w</em> in the panel below and find it.
        </p>
      </Section>

      <Section width="wide">
        <SpanExplorer />
        <Caption>
          When <em>v</em> and <em>w</em> point in different directions, the
          shaded region is the entire plane: every point can be written as
          some <Eq tex="a v + b w" />. Drag them to be parallel — same
          direction or opposite — and the shaded region collapses to a
          single line through the origin. That line is now the only place
          you can reach.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The collapse is sudden, and it has a clean geometric reason.
          When <em>v</em> and <em>w</em> point in the same direction (or
          opposite), every <em>w</em> is already a scaled copy of{' '}
          <em>v</em>: <Eq tex="w = k \, v" /> for some real <em>k</em>. So
          the linear combination simplifies,
        </p>

        <EqBlock tex="a v + b w \;=\; a v + b (k v) \;=\; (a + b k) \, v," />

        <p className="text-[17px] leading-[1.7] text-ink">
          and you are no longer combining two vectors at all — you are just
          scaling <em>v</em>. One degree of freedom instead of two. The
          span is whatever you can build with one degree of freedom: a
          line through the origin.
        </p>

        <KeyInsight label="Span">
          <p>
            The <strong>span</strong> of a set of vectors is the collection
            of every linear combination of them. In two dimensions the span
            is either the whole plane, a line through the origin, or just
            the origin itself.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          The pair of vectors that span the whole plane have a name too. We
          call them <em>linearly independent</em>: neither one is a scaled
          copy of the other. And when two linearly independent vectors do
          span the plane, that pair is called a <em>basis</em>. The two
          basis vectors give every other vector a unique address — the
          unique pair <Eq tex="(a, b)" /> with{' '}
          <Eq tex="P = a v + b w" />.
        </p>

        <KeyInsight label="Basis">
          <p>
            A <strong>basis</strong> for the plane is any pair of linearly
            independent vectors. There are infinitely many bases — the
            standard one is just the most convenient. Choosing a different
            basis is choosing a different coordinate system in which to
            describe the same plane.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          That last thought is heavier than it sounds. If different choices
          of basis describe the same plane, then there must be some
          machinery that translates between them — a way to take the
          address of a point in basis A and rewrite it as the address in
          basis B. That machinery is what the next chapter is about, and
          it is the most useful idea in this whole act: matrices, viewed as
          transformations of the plane.
        </p>
      </Section>

      <ChapterFooter
        next={
          next
            ? {
                id: next.id,
                number: next.number,
                title: next.title,
                available: next.status === 'live',
              }
            : undefined
        }
      />
    </article>
  )
}
