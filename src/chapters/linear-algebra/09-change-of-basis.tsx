import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { BasisCoordinates } from '../../components/viz/BasisCoordinates'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function Chapter09() {
  const next = getNextChapter('09-change-of-basis')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.la}
        number="09"
        title="Change of basis."
        dek="A vector is a thing in the world. Its coordinates are an opinion about that thing — they depend on which two arrows you have decided to call î and ĵ. Different opinions describe the same thing; the translation between them is a matrix."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          A vector is geometric: it has a length, a direction, a tip, and a
          tail. None of those things knows or cares what coordinate system
          you are using. The numbers <Eq tex="(v_x, v_y)" />, on the other
          hand, are an opinion. They are an answer to the question
          &ldquo;how many copies of <Eq tex="\hat{\imath}" /> and{' '}
          <Eq tex="\hat{\jmath}" /> would I have to add to get this
          vector?&rdquo;. Pick different basis vectors, and the same arrow
          gets different coordinates.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The widget below makes the duality concrete. The teal arrow is{' '}
          <em>v</em> — a single vector that you can drag anywhere. The
          two readouts beneath are its coordinates in two different bases:
          the standard one, and the slanted one defined by{' '}
          <Eq tex="b_1" /> and <Eq tex="b_2" />. Same vector, two answers.
        </p>
      </Section>

      <Section width="wide">
        <BasisCoordinates />
        <Caption>
          The lighter teal lattice is the basis-(b₁, b₂) grid; the
          axis-aligned gray grid is the standard one. Drag <em>v</em> to
          a point that has nice coordinates in one basis (say, the tip of{' '}
          <Eq tex="b_1" />) and notice how its coordinates in the
          <em> other</em> basis are usually not nice at all.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The translation between the two opinions is a matrix. Specifically,
          if <Eq tex="b_1" /> and <Eq tex="b_2" /> are written as columns,
          the matrix
        </p>

        <EqBlock tex="\mathbf{B} = \begin{bmatrix} \uparrow & \uparrow \\ b_1 & b_2 \\ \downarrow & \downarrow \end{bmatrix}" />

        <p className="text-[17px] leading-[1.7] text-ink">
          maps a coordinate vector <em>in basis B</em> to that same point&apos;s
          coordinate vector <em>in the standard basis</em>. That is, if
          inside the basis-B world you have <Eq tex="(a, b)" />, then in
          the standard world the same vector has coordinates
        </p>

        <EqBlock tex="\mathbf{v} = a \, b_1 + b \, b_2 = \mathbf{B} \begin{bmatrix} a \\ b \end{bmatrix}." />

        <p className="text-[17px] leading-[1.7] text-ink">
          To go the other way — standard coordinates back to basis-B
          coordinates — you apply the inverse, <Eq tex="\mathbf{B}^{-1}" />,
          which exists exactly when <Eq tex="b_1" /> and <Eq tex="b_2" />{' '}
          are linearly independent. The widget computes this for you and
          shows it in the right-hand readout.
        </p>

        <KeyInsight>
          <p>
            The matrix whose columns are the basis vectors is the
            translator: from basis-B coordinates to standard coordinates.
            Its inverse goes the other way. A vector is one geometric
            thing; its coordinates are a contract with a specific basis.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          Change of basis is one of those operations that turns out to
          <em>matter</em> only when you start asking what a transformation
          looks like in a different basis. A 90° rotation written in the
          standard basis is the matrix{' '}
          <Eq tex="\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}" />.
          Written in the basis you would naturally pick by setting{' '}
          <Eq tex="b_1, b_2" /> along the directions you actually rotate
          around — well, often that turns it into{' '}
          <Eq tex="\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}" /> or
          something equally placid. Same transformation, different
          basis, much simpler matrix. Going between them is a sandwich:
        </p>

        <EqBlock tex="\mathbf{M}_{\text{standard}} = \mathbf{B} \, \mathbf{M}_{\text{B}} \, \mathbf{B}^{-1}." />

        <p className="text-[17px] leading-[1.7] text-ink">
          Read right to left, the way matrix products always read: take a
          vector with standard coordinates, translate to basis-B
          coordinates with <Eq tex="\mathbf{B}^{-1}" />, apply the
          transformation in <em>that</em> basis with{' '}
          <Eq tex="\mathbf{M}_{\text{B}}" />, then translate back to
          standard coordinates with <Eq tex="\mathbf{B}" />. The thing on
          the right is the same transformation, expressed in the
          coordinate system that finds it most natural.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          We have spent a chapter setting up this sandwich because it
          turns out to be the central engine of the next chapter — the
          one that has been quietly the destination of this whole act.
          Some transformations have a basis in which they look almost
          embarrassingly simple: a diagonal matrix, with nothing at all
          off the diagonal. The basis vectors of that special basis have
          a name, the directions are called <em>eigenvectors</em>, and
          their entries on the diagonal are <em>eigenvalues</em>. They
          are the protagonists of chapter ten, and via them the whole
          thread of this essay reaches its bridge into act two.
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
