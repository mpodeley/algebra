import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { BasisCoordinates } from '../../components/viz/BasisCoordinates'
import { HyperShape } from '../../components/viz/HyperShape'
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
          One small generalization is worth making before the chapter
          ends. Everything we have written assumes the basis matrix{' '}
          <em>B</em> is square — same number of basis vectors as
          dimensions. But there is no rule that says it must be. Take a
          basis matrix <em>B</em> with four columns and only three
          rows: four 3D vectors, used to weight a four-component
          coordinate. The map{' '}
          <Eq tex="(a, b, c, d) \mapsto a \mathbf{v}_1 + b \mathbf{v}_2 + c \mathbf{v}_3 + d \mathbf{v}_4" />{' '}
          is still a change of basis, but now it goes from a 4D source
          space into 3D — losing one dimension on the way. Information
          is destroyed, the kernel is non-trivial, and the inverse does
          not exist. But the projection has a perfectly defined image
          for every input, and looking at <em>that</em> image is one of
          the more striking things you can do with a change of basis.
        </p>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Let the four 3D vectors point to the corners of a regular
          tetrahedron, divided by{' '}
          <Eq tex="\sqrt{3}" />:
        </p>

        <EqBlock tex="\mathbf{v}_1 = \frac{1}{\sqrt{3}}\!\begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix},\;\mathbf{v}_2 = \frac{1}{\sqrt{3}}\!\begin{pmatrix} 1 \\ -1 \\ -1 \end{pmatrix},\;\mathbf{v}_3 = \frac{1}{\sqrt{3}}\!\begin{pmatrix} -1 \\ 1 \\ -1 \end{pmatrix},\;\mathbf{v}_4 = \frac{1}{\sqrt{3}}\!\begin{pmatrix} -1 \\ -1 \\ 1 \end{pmatrix}." />

        <p className="text-[17px] leading-[1.7] text-ink">
          These four vectors sum to zero (the tetrahedral arrangement
          is symmetric about the origin), so the projection has a
          one-dimensional kernel along the direction{' '}
          <Eq tex="(1, 1, 1, 1)" />: any 4D vector all of whose
          coordinates are equal collapses to the origin. The other
          three dimensions of 4D survive intact.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          With this projection in hand we can take a 4D shape — say
          the <em>tesseract</em>, a 4D cube whose vertices are
          <Eq tex="(\pm 1, \pm 1, \pm 1, \pm 1)" /> — and watch its
          shadow on 3D as it rotates. A rotation in a plane involving
          the fourth coordinate (xw, yw, or zw) cycles different
          coordinates through the kernel direction; what falls into
          the kernel is invisible, what stays out of it is the shape
          you see. The result is a 3D body whose form changes as the
          4D body rotates, even though the 4D body itself is rigid.
        </p>
      </Section>

      <Section width="wide">
        <HyperShape />
        <Caption>
          Three 4D shapes, projected to 3D via the tetrahedral basis
          and then rendered. Sliders on the bottom rotate the shape{' '}
          <em>before</em> projecting (xw, yw, zw planes); the camera
          sliders rotate the 3D shadow afterwards. Edges are colored by
          the rotated <em>w</em> coordinate of their midpoint:{' '}
          <em>w &lt; 0</em> in blue, <em>w = 0</em> teal,{' '}
          <em>w &gt; 0</em> coral. As you rotate, edges sweep through
          the entire color range — that is what it looks like to{' '}
          <em>pass through</em> the fourth dimension.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The most interesting moments are when the four vertices on
          the &ldquo;far side&rdquo; of 4D temporarily align with the
          kernel direction; for those configurations the projection
          collapses entire faces of the tesseract to single points
          inside the 3D shadow, and the visible shape briefly looks
          like a smaller cube. The animation is the famous{' '}
          &ldquo;cube within a cube&rdquo; rendering of a tesseract.
          But that view is just one moment in a continuous family;
          rotate to a different angle and the shadow is something
          else entirely.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The 5-cell preset (the 4D analog of a tetrahedron, with five
          vertices and ten edges) and the 16-cell preset (the 4D
          cross-polytope, the dual of the tesseract) project to less
          familiar 3D shadows but the principle is the same: a rigid
          higher-dimensional body, projected to one dimension lower
          via four basis vectors, rotated before projection so that
          different &ldquo;sections&rdquo; of the higher body show up
          in the shadow.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The fourth preset, the <em>duocylinder</em>, is the strangest
          of the four. It is the 4D body{' '}
          <Eq tex="D^2 \times D^2 = \{(x, y, z, w) : x^2 + y^2 \leq 1 \;\text{and}\; z^2 + w^2 \leq 1\}" />{' '}
          — the Cartesian product of two disks, one in the{' '}
          <em>xy</em>-plane and one in the <em>zw</em>-plane. The
          surface of this body is genuinely 4D-native: nothing built
          out of unions of polyhedra in our 3D space has the same
          shape. The mesh you see is the <em>Clifford torus</em>,{' '}
          <Eq tex="(\cos\theta, \sin\theta, \cos\varphi, \sin\varphi)" />,
          which is the &ldquo;ridge&rdquo; where both circles sit at
          radius 1 simultaneously. Topologically it is a torus, but it
          is <em>flat</em> — every point has zero intrinsic curvature
          — which no torus embedded in 3D can manage. Watch it rotate
          and notice how the two interlocked rings of the projection
          weave through each other: that is the geometric signature of
          a flat torus seen edge-on through 4D.
        </p>

        <KeyInsight>
          <p>
            A change of basis need not be square. Four vectors in 3D
            do not form a basis (they cannot be independent), but they
            can still be the columns of a non-square change-of-basis
            matrix. The matrix is no longer invertible — information
            is lost — but it is a perfectly good linear map, with
            applications from data compression to high-dimensional
            visualization.
          </p>
        </KeyInsight>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          We have spent a chapter setting up the change-of-basis
          machinery because it turns out to be the central engine of
          the next chapter — the one that has been quietly the
          destination of this whole act. Some transformations have a
          basis in which they look almost embarrassingly simple: a
          diagonal matrix, with nothing at all off the diagonal. The
          basis vectors of that special basis have a name, the
          directions are called <em>eigenvectors</em>, and their
          entries on the diagonal are <em>eigenvalues</em>. They are
          the protagonists of chapter ten, and via them the whole
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
