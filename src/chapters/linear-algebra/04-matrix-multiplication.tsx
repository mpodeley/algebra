import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { CompositeTransform } from '../../components/viz/CompositeTransform'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function Chapter04() {
  const next = getNextChapter('04-matrix-multiplication')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.la}
        number="04"
        title="Matrix multiplication."
        dek="A second transformation, applied after the first. The result is itself a linear transformation, so it must have a matrix — and the rule for assembling that matrix is the operation people learn before they understand what it is for."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The previous chapter established that a linear transformation is
          a matrix, and a matrix is two columns recording where{' '}
          <Eq tex="\hat{\imath}" /> and <Eq tex="\hat{\jmath}" /> land.
          Here is the obvious next move: apply one transformation, then a
          second one. Whatever you end up with had better be a linear
          transformation too — the origin still hasn&apos;t moved, lines
          still go to lines — and so it had better have a matrix of its
          own.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          That matrix has a name: the <em>product</em> of the two. Pick a
          first transformation <Eq tex="M_1" /> and a second one{' '}
          <Eq tex="M_2" /> from the menus below. Scrub the time slider
          from <em>t = 0</em> to <em>t = 2</em>: the grid sits at identity,
          warps once into <Eq tex="M_1" />, and warps again into the
          combined effect.
        </p>
      </Section>

      <Section width="wide">
        <CompositeTransform />
        <Caption>
          Two transformations, in order. The composed effect on the grid
          (at <em>t = 2</em>) is the matrix you would get by applying{' '}
          <Eq tex="M_1" /> to the basis vectors and then{' '}
          <Eq tex="M_2" /> to the result. We write the composition{' '}
          <Eq tex="M_2 \, M_1" /> &mdash; right to left, because the right
          one happens first.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The arithmetic for putting the composed matrix together follows
          from the rule we already know. The new <Eq tex="\hat{\imath}" />,
          after the whole sequence, is wherever <Eq tex="M_2" /> sends the
          column <Eq tex="(a_1, c_1)" /> — the first column of{' '}
          <Eq tex="M_1" />. The new <Eq tex="\hat{\jmath}" /> is wherever{' '}
          <Eq tex="M_2" /> sends <Eq tex="(b_1, d_1)" />. Stacking those
          two columns gives the composed matrix:
        </p>

        <EqBlock tex="\begin{bmatrix} a_2 & b_2 \\ c_2 & d_2 \end{bmatrix} \begin{bmatrix} a_1 & b_1 \\ c_1 & d_1 \end{bmatrix} = \begin{bmatrix} a_2 a_1 + b_2 c_1 & a_2 b_1 + b_2 d_1 \\ c_2 a_1 + d_2 c_1 & c_2 b_1 + d_2 d_1 \end{bmatrix}." />

        <p className="text-[17px] leading-[1.7] text-ink">
          That is matrix multiplication. The formula has an arithmetic
          rhythm to it — &ldquo;rows on the left times columns on the
          right&rdquo; — that is fine to memorize, but it is not the
          <em>reason</em> for the operation. The reason is composition:
          two transformations, one after the other.
        </p>

        <KeyInsight>
          <p>
            Matrix multiplication is the bookkeeping for{' '}
            <em>doing one transformation, then another</em>. The order is
            read right to left, because that is the order in which the
            transformations are applied to a vector.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          One consequence shows up immediately: matrix multiplication is{' '}
          <em>not commutative</em>. Rotating then shearing is not the
          same as shearing then rotating; you can test this with the
          widget by swapping the two dropdowns. Geometrically the reason
          is plain — the order in which you do two physical motions
          affects the final result. The algebraic rule has to follow the
          geometry, and so it does.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          Almost every sentence in linear algebra from now on will use
          matrix multiplication. Hardly any of them will care about the
          rows-times-columns formula directly; almost all of them will
          care that <em>the product is the composition</em>. With that
          single sentence, several confusing-looking identities turn
          obvious. The associative law, for instance —
        </p>

        <EqBlock tex="A (B C) = (A B) C" />

        <p className="text-[17px] leading-[1.7] text-ink">
          — looks like a non-trivial algebraic claim, but geometrically
          it is just &ldquo;applying <em>C</em>, then <em>B</em>, then{' '}
          <em>A</em> is the same regardless of how you bracket the
          steps&rdquo;. Of course it is.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          Two more chapters before we leave 2D. The next one promotes the
          whole apparatus into three dimensions, just to convince
          ourselves nothing in the story actually depended on the plane.
          Then we will return to a question we have been putting off: when
          a transformation collapses a region — say, a unit square — by
          how much, exactly, does its area change?
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
