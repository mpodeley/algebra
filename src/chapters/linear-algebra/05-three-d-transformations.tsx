import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { ThreeDPreview } from '../../components/viz/ThreeDPreview'
import { GridTransform3D } from '../../components/viz/GridTransform3D'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function Chapter05() {
  const next = getNextChapter('05-three-d-transformations')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.la}
        number="05"
        title="Three dimensions."
        dek="A short bridge chapter. Everything we have built generalizes to three dimensions, four, a thousand. The picture changes; the rules don't."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The plane has been a comfortable home for four chapters because
          its geometry is something the eye can hold. Pull the dimension
          counter up by one — into our actual physical 3D — and almost
          nothing in the story changes. There are now three basis vectors
          instead of two: <Eq tex="\hat{\imath}" /> pointing along the{' '}
          <em>x</em> axis, <Eq tex="\hat{\jmath}" /> along <em>y</em>, and{' '}
          a new arrival, <Eq tex="\hat{k}" />, along <em>z</em>.
        </p>
      </Section>

      <Section width="wide">
        <ThreeDPreview />
        <Caption>
          A unit cube and the three basis vectors. Yaw rotates the whole
          scene around <em>y</em>; pitch rotates it around <em>x</em>.
          The cube is just <Eq tex="[0, 1]^3" />, and its eight corners
          are linear combinations of the three basis vectors.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          A vector in 3D is a triple of numbers, <Eq tex="(x, y, z)" />,
          telling you how many copies of <Eq tex="\hat{\imath}" />,{' '}
          <Eq tex="\hat{\jmath}" />, and <Eq tex="\hat{k}" /> to combine.
          A linear transformation is now determined by where the three
          basis vectors land — three columns instead of two, written
          side by side as a 3×3 matrix:
        </p>

        <EqBlock tex="\mathbf{M} = \begin{bmatrix} a & b & c \\ d & e & f \\ g & h & i \end{bmatrix}." />

        <p className="text-[17px] leading-[1.7] text-ink">
          The first column is wherever <Eq tex="\hat{\imath}" /> ends up;
          the second column is wherever <Eq tex="\hat{\jmath}" /> ends up;
          the third is the new destination of <Eq tex="\hat{k}" />.
          Everything else — addition tip-to-tail, scaling component-wise,
          matrix-vector multiplication as a linear combination of
          columns — is exactly as before, with one extra coordinate
          along for the ride.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The widget below makes that visceral. Pick a transformation
          from the menu, hit <em>morph from identity</em>, and watch the
          unit cube and the surrounding integer grid deform together
          into the new shape. The camera sliders rotate the whole
          post-transformation scene so you can look at the warp from
          different angles.
        </p>
      </Section>

      <Section width="wide">
        <GridTransform3D />
        <Caption>
          Each preset is a 3×3 matrix; its three columns are written as{' '}
          <em>î</em>, <em>ĵ</em>, <em>k̂</em>&apos;s images, and every
          other point follows by linear combination. The faint grid is
          the integer lattice <Eq tex="\mathbb{Z}^3" /> dragged through
          the transformation. The two surprising presets at the bottom of
          the menu are the <em>flip</em> (negative determinant: the
          orientation of the cube has been mirrored) and the{' '}
          <em>collapse</em> (zero determinant: the entire 3D space has
          been crushed onto a 2D plane, exactly as the rank-1 line
          collapse in chapter 07 but one dimension up).
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <KeyInsight>
          <p>
            The story does not depend on the dimension. Two columns or two
            thousand: a linear transformation is the table of where the
            basis vectors land, and every other vector follows by linear
            combination.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          A small handle to take with you, before chapter 06 properly
          introduces the determinant: in 3D, the determinant measures
          the signed <em>volume</em> of the unit cube — and the cube
          above is exactly that probe. Watch the cube while you scrub
          the morph slider. When the determinant is two, the cube has
          twice the volume; when it is negative, the cube has been
          mirrored through a plane; when it is zero, the cube has been
          flattened.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          By the time we reach the random-matrix chapters in act two,
          dimensions will run into the hundreds and we will have given
          up on direct visualization, leaning on statistics of the
          spectrum instead. The intuition we are building here — that
          a transformation is what it does to a basis, that volumes
          scale by the determinant — is meant to survive the loss of
          the picture.
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
