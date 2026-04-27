import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { VectorPlayground } from '../../components/viz/VectorPlayground'
import { ScalarStretch } from '../../components/viz/ScalarStretch'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function Chapter01() {
  const next = getNextChapter('01-vectors')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.la}
        number="01"
        title="Vectors."
        dek="An arrow, a list of numbers, an element of an abstract space — three answers, all correct, and the way you reconcile them is most of what linear algebra is."
      />

      <Section width="prose" className="py-12">
        <p className="mt-0 text-[17px] leading-[1.7] text-ink">
          Ask three people what a vector is and you will hear three different
          answers. The physicist will say it is an arrow with a length and a
          direction, free to slide around so long as it keeps both. The
          programmer will say it is a list of numbers, two of them in the
          plane, three in space, possibly thousands when you start describing
          a sentence or a face. The mathematician will say it is anything that
          obeys two rules — you can add two of them, and you can scale one of
          them — and let the rest follow.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          Linear algebra is the bridge between those three answers. The arrow
          gives us geometric intuition. The list of numbers makes the
          intuition computable. The abstract definition tells us, surprisingly
          often, that the same machinery applies to things that are not
          arrows at all — sound waves, polynomials, the wavefunction of an
          electron — because they obey the same two rules.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          For the next few chapters, lean on the arrow picture. Two vectors
          live in the plane below. Drag either one to a new position and
          watch what their sum does.
        </p>
      </Section>

      <Section width="wide">
        <VectorPlayground />
        <Caption>
          Two vectors, <em>v</em> and <em>w</em>, anchored at the origin.
          Their sum <em>v + w</em> is the diagonal of the parallelogram you
          get by sliding one vector to the tip of the other.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Geometrically, addition is &ldquo;tip to tail&rdquo;: you place{' '}
          <em>w</em> so its tail starts where <em>v</em>&apos;s tip ended,
          and the new arrow from the origin to <em>w</em>&apos;s new tip is{' '}
          <em>v + w</em>. Algebraically, the same operation is much less
          dramatic — you just add the coordinates.
        </p>

        <EqBlock tex="v + w \;=\; \begin{bmatrix} v_x \\ v_y \end{bmatrix} + \begin{bmatrix} w_x \\ w_y \end{bmatrix} \;=\; \begin{bmatrix} v_x + w_x \\ v_y + w_y \end{bmatrix}" />

        <p className="text-[17px] leading-[1.7] text-ink">
          The bridge between the two pictures is what makes vectors useful.
          The geometry tells you what is going on; the coordinates tell a
          computer how to compute it. Notice that nothing in the algebra
          knows about parallelograms — they are a feature of the geometry
          you bring to the symbols, not something the rules require.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The second basic operation is just as quiet on paper.
          Multiplication by a number, called <em>scaling</em>, stretches a
          vector if the number is bigger than one, shrinks it if the number
          is between zero and one, and flips it through the origin if the
          number is negative. Try it.
        </p>
      </Section>

      <Section width="wide">
        <ScalarStretch />
        <Caption>
          A single vector <em>v</em> and its scaled twin <Eq tex="cv" />.
          When <Eq tex="c < 0" /> the arrow points the other way; when{' '}
          <Eq tex="c = 0" /> it collapses to the origin. Every <em>cv</em>{' '}
          for any real <em>c</em> lives on the dashed line — the{' '}
          <em>span</em> of <em>v</em>.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Algebraically, scaling is just as direct: multiply each coordinate
          by the same number.
        </p>

        <EqBlock tex="c \, v \;=\; c \begin{bmatrix} v_x \\ v_y \end{bmatrix} \;=\; \begin{bmatrix} c \, v_x \\ c \, v_y \end{bmatrix}" />

        <p className="text-[17px] leading-[1.7] text-ink">
          Two operations: addition, and scaling. That is it. Every other
          construction in linear algebra — basis, span, transformation,
          eigenvector, determinant — is built out of these two moves and
          nothing else. The promise of the next ten chapters is that almost
          all of the geometry of high-dimensional space follows from
          imagining what these two moves can do when you compose them in
          enough different ways.
        </p>

        <KeyInsight>
          <p>
            A <strong>vector space</strong> is any collection of objects you
            can add and scale, where the rules behave the way they do for
            arrows. The objects need not be arrows. The rules are what
            matter.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          The arrow picture is a good first home for these rules, but it is
          not the only one — and that is the punchline of the chapter eleven
          chapters from now. For now, stay in the plane and the arrows.
          Next, we ask the obvious follow-up: given two vectors and the two
          operations, which points can you reach?
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
