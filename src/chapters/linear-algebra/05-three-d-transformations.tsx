import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { ThreeDPreview } from '../../components/viz/ThreeDPreview'
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

        <KeyInsight>
          <p>
            The story does not depend on the dimension. Two columns or two
            thousand: a linear transformation is the table of where the
            basis vectors land, and every other vector follows by linear
            combination.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          We will not draw a deformable 3D grid here. The reason is
          partly perceptual — three-dimensional grids are crowded — and
          partly practical: nothing the next several chapters need is
          easier to see in 3D than in 2D. The 2D widgets will keep
          driving the story. By the time we reach the random-matrix
          chapters in act two, dimensions will run into the hundreds and
          we will have given up on direct visualization anyway, leaning
          on statistics of the spectrum instead.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          A small handle to take with you: in 3D, the determinant we
          have been threatening to define properly will measure not the
          signed area of a unit square, but the signed{' '}
          <em>volume</em> of a unit cube. The next chapter, finally,
          gives the determinant the chapter it has earned.
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
