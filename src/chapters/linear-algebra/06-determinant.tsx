import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { DeterminantArea } from '../../components/viz/DeterminantArea'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function Chapter06() {
  const next = getNextChapter('06-determinant')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.la}
        number="06"
        title="The determinant."
        dek="A single number that tells you, for any linear transformation, by how much it stretches or shrinks every region — and whether, on the way, it has flipped the plane through a mirror."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          A linear transformation moves every point in the plane somewhere
          new. It is reasonable to ask, of any region of the plane: how much
          larger or smaller is it after the transformation? In general the
          answer would depend on which region. The remarkable thing about
          linear transformations is that the answer{' '}
          <em>does not depend on the region</em>: every patch is scaled by
          the same factor.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          So the factor itself is a property of the transformation, not the
          region. We give it a name: the <em>determinant</em>. The cleanest
          way to compute it is to ask what the transformation does to one
          specific region — the unit square anchored at the origin. After
          the transformation, the unit square is a parallelogram. Its area
          is the determinant.
        </p>
      </Section>

      <Section width="wide">
        <DeterminantArea />
        <Caption>
          The teal parallelogram is the unit square after dragging{' '}
          <Eq tex="\hat{\imath}" /> and <Eq tex="\hat{\jmath}" /> to new
          positions. Its area, computed below the canvas, is the
          determinant of the transformation. Drag <em>v</em> and <em>w</em>{' '}
          to be parallel to make the area collapse to zero.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Notice the sign. The number under the canvas can go negative, and
          when it does, the parallelogram changes color. The geometric
          meaning of a negative determinant is <em>orientation</em>: the
          plane has been flipped, the way a mirror flips left and right.
          The grid as a whole still tiles the plane, but the way you walk
          around any closed region — clockwise or counterclockwise — has
          reversed. Where{' '}
          <Eq tex="\hat{\imath}" /> used to sit to the left of{' '}
          <Eq tex="\hat{\jmath}" /> at a 90° angle, now it sits on the
          right. That is what a negative determinant <em>means</em>.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The case <Eq tex="\det = 0" /> is geometrically the most
          interesting. The unit square has been crushed flat. Equivalently,
          <Eq tex="\hat{\imath}" /> and <Eq tex="\hat{\jmath}" /> are no
          longer linearly independent — they have ended up parallel — and
          the entire plane has been collapsed to a line, or in extreme
          cases to the origin. Whatever lived in the second dimension before
          the transformation is gone. We will pay for this in the next
          chapter, when we ask whether transformations can be undone.
        </p>

        <KeyInsight>
          <p>
            For any 2×2 transformation, every region of the plane is scaled
            by the same factor — the <strong>determinant</strong>. Its
            sign records whether the orientation has been flipped; its
            magnitude records the area scaling; the value zero means the
            plane has been crushed to a lower dimension.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          The arithmetic for computing the determinant from the matrix
          falls out of the geometry. The unit square has corners at{' '}
          <Eq tex="(0, 0), \, (1, 0), \, (1, 1), \, (0, 1)" />, and after
          the transformation those corners become{' '}
          <Eq tex="(0, 0), \, (a, c), \, (a + b, c + d), \, (b, d)" />. The
          parallelogram these define has signed area
        </p>

        <EqBlock tex="\det \begin{bmatrix} a & b \\ c & d \end{bmatrix} = a \, d - b \, c." />

        <p className="text-[17px] leading-[1.7] text-ink">
          You can read this off the canvas: pick any matrix entry by hand
          and the formula will agree with the area you see. The expression
          generalises: in 3D, the determinant is a 3×3 affair that
          measures signed <em>volume</em>; in <em>n</em> dimensions, an{' '}
          <em>n</em>-dimensional version that measures <em>n</em>-volume.
          The arithmetic gets bushier; the geometric meaning is the same.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          One useful fact, free with the geometric definition: the
          determinant of a composition is the product of the
          determinants. If <em>M₁</em> scales areas by 3 and <em>M₂</em>{' '}
          scales them by 2, then <em>M₂ M₁</em> scales them by 6.
          Algebraically you would prove this by chasing two pages of{' '}
          row-times-column tedium. Geometrically, &ldquo;a region scaled by
          3 then scaled by 2 ends up scaled by 6&rdquo; — and there is
          nothing else to prove.
        </p>

        <EqBlock tex="\det(M_2 \, M_1) = \det(M_2) \cdot \det(M_1)." />

        <p className="text-[17px] leading-[1.7] text-ink">
          Another useful fact, of slightly different flavor: if{' '}
          <Eq tex="\det(M) = 0" />, the transformation has destroyed
          information that nothing can bring back. Areas have been crushed
          to zero, and any two distinct points might now share a single
          destination. So the question becomes: when can the transformation
          be undone, and how? That is what chapter seven is about — and
          its answer is one of the cleanest in linear algebra.
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
