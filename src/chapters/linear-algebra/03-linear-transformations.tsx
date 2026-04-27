import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { MatrixTransform } from '../../components/viz/MatrixTransform'
import { VectorTracker } from '../../components/viz/VectorTracker'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function Chapter03() {
  const next = getNextChapter('03-linear-transformations')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.la}
        number="03"
        title="Linear transformations."
        dek="A function from the plane to the plane that respects the grid: origin stays put, parallel lines stay parallel. The whole apparatus is determined by where it sends two vectors — and that is what a matrix is."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          A <em>transformation</em> is just a fancy word for a function. It
          takes a vector in and gives a vector out. The interesting ones —
          the ones we are going to spend the next several chapters with —
          are <em>linear</em>. A transformation is linear when it obeys two
          rules:
        </p>

        <ul className="my-6 ml-6 list-decimal space-y-2 text-[17px] leading-[1.6] text-ink marker:font-mono marker:text-[13px] marker:text-mute">
          <li>The origin stays put.</li>
          <li>
            Any line, after the transformation, is still a line — and any
            two lines that started parallel are still parallel.
          </li>
        </ul>

        <p className="text-[17px] leading-[1.7] text-ink">
          Equivalently, in algebraic dress, a transformation <em>T</em> is
          linear if it commutes with addition and scaling:
        </p>

        <EqBlock tex="T(v + w) = T(v) + T(w), \qquad T(c \, v) = c \, T(v)." />

        <p className="text-[17px] leading-[1.7] text-ink">
          The geometric and algebraic versions agree. Each says, in its own
          accent, the same surprising thing: a linear transformation is
          completely determined by where it sends the two basis vectors.
          Once you know where <Eq tex="\hat{\imath}" /> and{' '}
          <Eq tex="\hat{\jmath}" /> end up, every other vector follows by{' '}
          <em>linear combination</em> — by exactly the same machinery as
          the previous chapter.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          So we package the transformation in the only data that matters:
          the two destination vectors, written side by side as columns of a{' '}
          <em>matrix</em>.
        </p>

        <EqBlock tex="\mathbf{M} = \begin{bmatrix} \uparrow & \uparrow \\ T(\hat{\imath}) & T(\hat{\jmath}) \\ \downarrow & \downarrow \end{bmatrix} = \begin{bmatrix} a & b \\ c & d \end{bmatrix}." />

        <p className="text-[17px] leading-[1.7] text-ink">
          Two columns, four numbers. That is the entire transformation.
          Slide them around below.
        </p>
      </Section>

      <Section width="wide">
        <MatrixTransform />
        <Caption>
          The four sliders are the four entries of the matrix. The dashed
          quadrilateral is what was once the unit square; its colored
          neighbors travel along. The number under the sliders, <em>det</em>,
          is the signed factor by which areas are scaled — we will name it
          properly in chapter six. For now, watch what happens to it when
          you make <Eq tex="\hat{\imath}" /> and <Eq tex="\hat{\jmath}" />{' '}
          point in the same direction.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The arithmetic that turns a matrix and an input vector into the
          output is called <em>matrix-vector multiplication</em>, and there
          is exactly one way to write it consistent with the rules. If the
          input is <Eq tex="v = (x, y)" />, then by linearity
        </p>

        <EqBlock tex="T(v) = T(x \, \hat{\imath} + y \, \hat{\jmath}) = x \, T(\hat{\imath}) + y \, T(\hat{\jmath})" />

        <p className="text-[17px] leading-[1.7] text-ink">
          which is to say,
        </p>

        <EqBlock tex="\begin{bmatrix} a & b \\ c & d \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = x \begin{bmatrix} a \\ c \end{bmatrix} + y \begin{bmatrix} b \\ d \end{bmatrix} = \begin{bmatrix} a x + b y \\ c x + d y \end{bmatrix}." />

        <p className="text-[17px] leading-[1.7] text-ink">
          The formula on the right is the one most students learn first.
          The middle expression is the one you should believe in: the
          output is <em>x</em> copies of the new <Eq tex="\hat{\imath}" />{' '}
          plus <em>y</em> copies of the new <Eq tex="\hat{\jmath}" />,
          stacked tip-to-tail in the same way you have been stacking them
          since chapter two.
        </p>
      </Section>

      <Section width="wide">
        <VectorTracker />
        <Caption>
          Pick an input <Eq tex="v = (x, y)" /> with the sliders. Drag{' '}
          <Eq tex="\hat{\imath}" /> and <Eq tex="\hat{\jmath}" />. The
          destination <Eq tex="T(v)" /> is built right in front of you:
          first <em>x</em> steps along the new <Eq tex="\hat{\imath}" />,
          then <em>y</em> steps along the new <Eq tex="\hat{\jmath}" /> —
          tip to tail, exactly the linear-combination construction.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <KeyInsight>
          <p>
            A linear transformation <em>is</em> its matrix. The matrix is{' '}
            <em>just</em> the two columns recording where{' '}
            <Eq tex="\hat{\imath}" /> and <Eq tex="\hat{\jmath}" /> land.
            Once those two vectors have a destination, every other vector
            follows by linear combination, with no further information
            needed.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          That sentence — the matrix is the transformation — is the most
          useful idea in linear algebra, and the one most likely to feel
          weird at first because matrices were probably introduced to you
          as a static rectangular array of numbers. They are not static.
          They are verbs.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          Some matrices have famous names. The matrix{' '}
          <Eq tex="\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}" /> sends{' '}
          <Eq tex="\hat{\imath}" /> to <Eq tex="(0, 1)" /> and{' '}
          <Eq tex="\hat{\jmath}" /> to <Eq tex="(-1, 0)" />, which is a
          90-degree rotation. The matrix{' '}
          <Eq tex="\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}" /> leaves{' '}
          <Eq tex="\hat{\imath}" /> alone but slides{' '}
          <Eq tex="\hat{\jmath}" /> to <Eq tex="(1, 1)" />, which is a
          horizontal shear. Try entering both into the sliders above and
          watch the colored grid follow.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          And then, an obvious next move: what happens if you do one
          transformation and then another? That is what chapter four is
          about. The answer is the operation people call{' '}
          <em>matrix multiplication</em>, and it is mostly weird because
          most people meet it before they meet the transformations it is
          composing.
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
