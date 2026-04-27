import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { DotProductProjection } from '../../components/viz/DotProductProjection'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function Chapter08() {
  const next = getNextChapter('08-dot-product')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.la}
        number="08"
        title="Dot product, projections."
        dek="One number that records how aligned two vectors are. The same number, surprisingly, can be computed two completely different-looking ways — and the equality of those two computations is doing more work than it looks."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Take two vectors. The most basic geometric question you can ask
          is how aligned they are. Are they pointing the same way, in
          which case &ldquo;aligned&rdquo; should be a big positive number?
          Perpendicular, in which case the answer should be zero?
          Pointing opposite, in which case the answer is big negative?
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The number that does this job is the <em>dot product</em>, and
          it has two definitions that look like they have nothing to do
          with each other. Algebraically:
        </p>

        <EqBlock tex="\mathbf{v} \cdot \mathbf{w} = v_x \, w_x + v_y \, w_y." />

        <p className="text-[17px] leading-[1.7] text-ink">
          Geometrically:
        </p>

        <EqBlock tex="\mathbf{v} \cdot \mathbf{w} = |\mathbf{v}| \, |\mathbf{w}| \, \cos\theta," />

        <p className="text-[17px] leading-[1.7] text-ink">
          where <em>θ</em> is the angle between the two vectors. The two
          formulas always give the same number — try it. The widget below
          updates both as you move <em>v</em> and <em>w</em>; the values
          agree to within rounding.
        </p>
      </Section>

      <Section width="wide">
        <DotProductProjection />
        <Caption>
          Drag <em>v</em> and <em>w</em>. The teal arrow lying along
          <em> w</em>&apos;s line is the projection of <em>v</em> onto{' '}
          <em>w</em>; the dashed perpendicular shows you where the foot
          of the projection sits. When the two vectors are perpendicular
          the projection vanishes and the dot product is zero.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The geometric formula is the one that captures the meaning. If{' '}
          <em>v</em> and <em>w</em> are unit vectors (length 1 each),
          their dot product is just <Eq tex="\cos\theta" /> — a number
          between −1 and 1 that says &ldquo;completely opposite&rdquo;,
          &ldquo;perpendicular&rdquo;, &ldquo;completely aligned&rdquo;,
          or anywhere in between. Scaling the vectors scales the answer;
          that is the <Eq tex="|\mathbf{v}|\,|\mathbf{w}|" /> factor in
          front.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The algebraic formula is the one that lets a computer evaluate
          it. Notice it does not need a protractor; it does not need to
          know <em>θ</em>; it does not need the lengths of the vectors. It
          just needs the four numbers that describe the two vectors&apos;
          coordinates. And yet the answer it computes equals an
          inherently geometric quantity. That is not a coincidence; the
          equality of the two formulas is, in fact, the cosine
          subtraction identity in disguise. (Project this chapter
          backwards through trigonometry, and you will recover that
          identity for free.)
        </p>

        <KeyInsight>
          <p>
            The dot product is one number with two faces: an algebraic
            sum of products of coordinates, and a geometric{' '}
            <Eq tex="|\mathbf{v}||\mathbf{w}|\cos\theta" />. Either side
            tells you how aligned <em>v</em> and <em>w</em> are. The sign
            distinguishes &ldquo;same side&rdquo; from &ldquo;opposite
            side&rdquo;; zero means orthogonal.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          The closely related operation visible in the canvas is{' '}
          <em>projection</em>. If you want to know how much of <em>v</em>{' '}
          lies along the direction of <em>w</em> — equivalently, the
          shadow that <em>v</em> casts on <em>w</em>&apos;s line under a
          light shining perpendicular to it — that scalar is{' '}
          <Eq tex="(\mathbf{v} \cdot \mathbf{w}) / |\mathbf{w}|" />. The{' '}
          <em>vector</em> projection — the actual arrow living on{' '}
          <em>w</em>&apos;s line, with that scalar as its length — is
        </p>

        <EqBlock tex="\mathrm{proj}_{\mathbf{w}}(\mathbf{v}) = \frac{\mathbf{v} \cdot \mathbf{w}}{\mathbf{w} \cdot \mathbf{w}} \, \mathbf{w}." />

        <p className="text-[17px] leading-[1.7] text-ink">
          A small but persistent fact: if <em>w</em> is a unit vector,
          this collapses to <Eq tex="(\mathbf{v} \cdot \mathbf{w})\,\mathbf{w}" />,
          which is much friendlier and shows up everywhere from least
          squares to quantum mechanics, where the &ldquo;component of a
          state in a direction&rdquo; is exactly this projection.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The dot product is not just a single tool; it is the engine
          behind a lot of what comes next. Two of the things it powers,
          and where we will use it without further ceremony: it lets us
          define a notion of &ldquo;perpendicular&rdquo; in any number of
          dimensions (orthogonality is just zero dot product), and it
          gives us a way to decompose a vector into independent
          components along any orthogonal basis we choose. The next
          chapter is about that choice.
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
