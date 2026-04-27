import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { RankNullspace } from '../../components/viz/RankNullspace'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function Chapter07() {
  const next = getNextChapter('07-inverse-rank-null-space')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.la}
        number="07"
        title="Inverse, rank, null space."
        dek="What does it mean to undo a transformation? When can you, when can't you, and what is the geometric shape of the information that gets lost when you can't?"
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Linear transformations are functions, and the most natural
          question you can ask of a function is: can you reverse it? Given
          where a vector landed, can you recover where it came from? In
          symbols, given <Eq tex="\mathbf{M} \, \mathbf{x} = \mathbf{b}" />,
          can you solve for <em>x</em>?
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The previous chapter handed us the entire answer in advance. The
          determinant is the area scaling factor. If <Eq tex="\det(M) = 0" />,
          areas have been scaled to zero — the unit square has been crushed
          flat — and many distinct points now share a single destination.
          You can&apos;t reverse the transformation because there is no
          reversal that respects the rules: which of the many possible
          starting points should you map back to?
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          But if <Eq tex="\det(M) \neq 0" />, no information is lost; the
          transformation is one-to-one. There exists a unique
          transformation, called the <em>inverse</em> and written{' '}
          <Eq tex="M^{-1}" />, that undoes <em>M</em>. For 2×2 matrices the
          formula is short, and almost suspiciously elegant:
        </p>

        <EqBlock tex="\mathbf{M}^{-1} = \frac{1}{\det(\mathbf{M})} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix} \quad \text{when} \quad \det(\mathbf{M}) \neq 0." />

        <p className="text-[17px] leading-[1.7] text-ink">
          The division by <Eq tex="\det(M)" /> in front is the diagnostic.
          When the determinant is zero, the formula explodes — there is
          nothing to divide by, and the inverse genuinely does not exist.
          The non-existence is geometric: information has been destroyed,
          and no algebra can manufacture it back.
        </p>
      </Section>

      <Section width="wide">
        <RankNullspace />
        <Caption>
          The amber line is the <em>null space</em>: the set of vectors
          that the matrix sends to the origin. Drag <Eq tex="\hat{\imath}" />{' '}
          and <Eq tex="\hat{\jmath}" /> to be parallel and the line
          appears, marking the direction whose vectors get crushed to
          zero. As long as the basis vectors are independent the null
          space is just the origin, and the matrix can be inverted.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Two new pieces of vocabulary live in the readout under the
          canvas. The first is <em>rank</em>. Geometrically, the rank of a
          matrix is the number of dimensions its output spans. A 2×2
          matrix can have rank 2 (output is the whole plane), rank 1
          (output collapses to a line), or rank 0 (output collapses to
          the origin). The rank is exactly the dimension of the{' '}
          <em>image</em> — the set of vectors that some input maps to.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The second is the <em>null space</em>: the set of inputs that
          the matrix sends to zero. For an invertible matrix, only the
          origin gets sent to the origin, so the null space is the
          single point <Eq tex="\{0\}" />. For a rank-1 matrix, an entire
          line through the origin gets sent to zero — the amber line in
          the canvas. For a rank-0 matrix, every vector gets sent to
          zero, and the null space is the whole plane.
        </p>

        <KeyInsight>
          <p>
            For a 2×2 matrix:{' '}
            <Eq tex="\mathrm{rank} + \mathrm{nullity} = 2" />. Whatever
            the rank loses to crushing, the null space gains in width.
            More generally, this is the rank–nullity theorem; in{' '}
            <em>n</em> dimensions the right-hand side becomes <em>n</em>.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          The trade-off is exact and not coincidental. The matrix sends a
          two-dimensional input space somewhere; some of those dimensions
          end up flattened to zero (that is the null space); whatever
          remains becomes the image. The two add up to the dimension of
          the input. There is nowhere else for a dimension to go.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The condition for a solution to <Eq tex="\mathbf{M x = b}" />{' '}
          to exist, then, is that <em>b</em> lies in the image of
          <em> M</em>. If <em>M</em> has rank 2, the image is the whole
          plane and a solution exists for any <em>b</em>. If <em>M</em>{' '}
          has rank 1, the image is a single line; a solution exists only
          when <em>b</em> is on that line, and when it does exist there
          is a whole line of solutions (the original solution shifted by
          any vector in the null space). If <em>M</em> has rank 0, the
          image is the single point zero, and a solution exists only
          when <em>b</em> is zero — but again with infinite solutions.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The next chapter is a slight detour from this pile-up of
          vocabulary, but a useful one. We have been talking about the
          algebra of matrices acting on vectors; we have not yet talked
          about how to ask a single, simple geometric question of two
          vectors: how aligned are they? That is the subject of the dot
          product.
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
