import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { EigenvectorFinder } from '../../components/viz/EigenvectorFinder'
import { FibonacciGolden } from '../../components/viz/FibonacciGolden'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function Chapter10() {
  const next = getNextChapter('10-eigenvectors-eigenvalues')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.la}
        number="10"
        title="Eigenvectors and eigenvalues."
        dek="Most directions, under a transformation, get rotated. A few don't. The handful of directions a matrix leaves alone — only stretches, never tilts — are its eigenvectors, and they are the most useful single thing the matrix knows."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Apply a transformation to a generic vector and two things tend to
          happen: it gets longer or shorter, and it gets rotated. Most
          vectors come out of the transformation pointing in a different
          direction than they went in. But for any given matrix, there are
          almost always one or two special directions where this is not
          true. Vectors along these directions emerge from the
          transformation pointing exactly the way they came in — only
          stretched or shrunk. They never rotate.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          These special vectors are the <em>eigenvectors</em>. The
          stretch factor for each one — possibly negative, possibly zero,
          possibly almost anything — is its <em>eigenvalue</em>. The two
          words mean &ldquo;own vector&rdquo; and &ldquo;own value&rdquo; in
          the German that linear algebra spent the early twentieth century
          being written in. A more useful translation might be{' '}
          <em>characteristic</em>: these are the directions and stretches
          that <em>characterize</em> the transformation.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The widget below highlights them. Drag <Eq tex="\hat{\imath}" />{' '}
          and <Eq tex="\hat{\jmath}" />. The faint teal grid shows the
          deformed plane. The bold amber and purple lines, when present,
          are the eigenvector directions: the directions whose vectors
          come out of the transformation living on the same line they
          started on.
        </p>
      </Section>

      <Section width="wide">
        <EigenvectorFinder />
        <Caption>
          Most matrices have two real eigenvectors (amber and purple).
          Some have just one — when the discriminant of the characteristic
          polynomial collapses to zero. And some have none at all in real
          numbers: for matrices that <em>rotate</em> the plane, no real
          direction stays put. The status note below the canvas tells you
          which case you are in.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The defining equation is short. A vector <em>v</em> is an
          eigenvector of <em>M</em> with eigenvalue <em>λ</em> if{' '}
          applying <em>M</em> to <em>v</em> just multiplies <em>v</em> by{' '}
          <em>λ</em>:
        </p>

        <EqBlock tex="\mathbf{M} \mathbf{v} \;=\; \lambda \, \mathbf{v}." />

        <p className="text-[17px] leading-[1.7] text-ink">
          The same equation in two forms. Equivalently, applying{' '}
          <Eq tex="\mathbf{M} - \lambda \mathbf{I}" /> to <em>v</em> gives
          zero. So <em>v</em> sits in the null space of{' '}
          <Eq tex="\mathbf{M} - \lambda \mathbf{I}" />. For there to be a
          non-zero <em>v</em> in the null space, that matrix must have
          determinant zero. So the eigenvalues are exactly the values{' '}
          <em>λ</em> that make
        </p>

        <EqBlock tex="\det(\mathbf{M} - \lambda \mathbf{I}) \;=\; 0." />

        <p className="text-[17px] leading-[1.7] text-ink">
          For a 2×2 matrix this is a quadratic in <em>λ</em>, called the{' '}
          <em>characteristic polynomial</em>. Up to two roots — which is
          why you see at most two eigenvalues. Two real distinct roots
          give two real eigenvectors; a repeated real root gives one; two
          complex roots mean no real eigenvectors at all, just like a
          rotation has no fixed direction in the plane.
        </p>

        <KeyInsight>
          <p>
            The eigenvalues of <em>M</em> are the roots of{' '}
            <Eq tex="\det(\mathbf{M} - \lambda \mathbf{I})" />. Each real
            eigenvalue comes with a real direction in which <em>M</em>{' '}
            only stretches; the eigenvalue is the stretch factor.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          Given two eigenvectors with two different eigenvalues, the two
          eigenvectors are necessarily linearly independent (this is
          short to prove, and worth proving once on paper). So a 2×2
          matrix with two distinct eigenvalues has a basis of
          eigenvectors, and in that basis the matrix is diagonal. This is
          the long-promised payoff of chapter nine&apos;s change of
          basis: in the eigenvector basis, the action of <em>M</em>{' '}
          becomes &ldquo;multiply each coordinate by its eigenvalue&rdquo;
          and nothing else.
        </p>

        <EqBlock tex="\mathbf{M} = \mathbf{B} \begin{bmatrix} \lambda_1 & 0 \\ 0 & \lambda_2 \end{bmatrix} \mathbf{B}^{-1}" />

        <p className="text-[17px] leading-[1.7] text-ink">
          where <Eq tex="\mathbf{B}" /> is the matrix whose columns are
          the two eigenvectors. This is called the{' '}
          <em>eigendecomposition</em>. It is the cleanest possible
          factoring of a transformation: the bulk of the matrix &mdash;
          its action on the plane &mdash; is captured entirely by the two
          numbers <Eq tex="\lambda_1, \lambda_2" />, with{' '}
          <Eq tex="\mathbf{B}" /> playing the supporting role of giving
          you the basis where those two numbers act in isolation.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          One small example justifies the rest of the apparatus. Consider
          the matrix
        </p>

        <EqBlock tex="\mathbf{F} = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix}." />

        <p className="text-[17px] leading-[1.7] text-ink">
          Apply <Eq tex="\mathbf{F}" /> to <Eq tex="(F_{n}, F_{n-1})" />{' '}
          and you get <Eq tex="(F_{n} + F_{n-1}, F_{n}) = (F_{n+1}, F_{n})" />.{' '}
          So <Eq tex="\mathbf{F}^n (1, 0)^\top = (F_{n+1}, F_n)" />: the
          <em> n-th iterate of F applied to the seed gives the n-th and
          (n+1)-th Fibonacci numbers</em>. The Fibonacci recurrence is
          a matrix.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          Compute the eigenvalues. The characteristic polynomial is{' '}
          <Eq tex="\lambda^2 - \lambda - 1 = 0" />, whose roots are the
          two famous numbers
        </p>

        <EqBlock tex="\varphi = \tfrac{1+\sqrt{5}}{2} \approx 1.618, \qquad -\tfrac{1}{\varphi} = \tfrac{1-\sqrt{5}}{2} \approx -0.618." />

        <p className="text-[17px] leading-[1.7] text-ink">
          The first is the <em>golden ratio</em>. It is an eigenvalue of
          the matrix that builds the Fibonacci sequence — and that one
          fact pins down everything famous about Fibonacci numbers, all
          at once. The dominant eigenvalue is <Eq tex="\varphi" /> (with
          larger absolute value than <Eq tex="-1/\varphi" />), so over
          many iterations any vector aligns with the
          <Eq tex="\varphi" />-eigenvector and grows by a factor of{' '}
          <Eq tex="\varphi" /> at each step. That is why the ratio{' '}
          <Eq tex="F_{n+1}/F_n \to \varphi" />.
        </p>
      </Section>

      <Section width="wide">
        <FibonacciGolden />
        <Caption>
          The amber line is the <Eq tex="\varphi" />-eigenvector
          direction; the dashed purple line is the <Eq tex="-1/\varphi" />
          {' '}eigenvector. Drag <em>v₀</em> anywhere; the teal trail is
          the rescaled iterate <Eq tex="\mathbf{F}^k v_0 / \varphi^k" />,
          which collapses to a fixed point on the amber line at rate{' '}
          <Eq tex="(1/\varphi^2)^k \approx 0.38^k" />. With <em>v₀</em>{' '}
          set to <Eq tex="(1, 0)" /> via the button, the unscaled
          iterates are exactly the Fibonacci pairs{' '}
          <Eq tex="(F_{n+1}, F_n)" /> — and the ratio readout below the
          canvas shows <Eq tex="F_{n+1}/F_n" /> converging to{' '}
          <Eq tex="\varphi" /> in real time.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Two observations worth pinning down. First, if you start{' '}
          <em>v₀</em> on either eigenvector line, the iterates stay on
          that line forever — eigenvectors are <em>invariant</em>{' '}
          directions in exactly the sense the chapter started with.
          Second, every other starting vector eventually aligns with the
          dominant eigenvector, regardless of where it began. This is
          the <em>power-method</em> intuition: iterating any matrix
          repeatedly aligns vectors to the eigenvector with the largest
          eigenvalue, and is, mutatis mutandis, the engine of Google's
          PageRank, of finite-element solvers, and of much of the
          numerical-linear-algebra toolbox.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The set <Eq tex="\{\lambda_1, \lambda_2, \dots\}" /> of all
          eigenvalues of a matrix has its own name: the matrix&apos;s{' '}
          <em>spectrum</em>. The metaphor is borrowed from physics, where
          a &ldquo;spectrum&rdquo; means the discrete frequencies a
          system can vibrate at. The connection is not metaphor but
          identity. The frequencies of a vibrating string, the energy
          levels of an electron, the natural modes of a bridge — these
          are all eigenvalues of some operator that describes the
          system&apos;s physics. The matrix is the system; its spectrum
          is the song.
        </p>

        <KeyInsight label="Spectrum">
          <p>
            The <strong>spectrum</strong> of a matrix is the set of its
            eigenvalues. For a transformation that describes a physical
            system, the spectrum is the set of frequencies (or energies,
            or modes, or modes of failure) that system can sustain. It is
            the deepest single property the matrix has.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          We have, just barely, finished the geometry of one matrix. The
          remaining chapter of act one is a brief recasting of everything
          we&apos;ve done in slightly more abstract terms — vector spaces
          where the &ldquo;vectors&rdquo; need not be arrows. After that,
          act two takes a sharp turn into territory that almost no part of
          the standard linear-algebra course covers: <em>random matrix
          theory</em>, where the matrix entries themselves are pulled out
          of a random distribution, and the spectrum becomes a statistical
          object. The strange and beautiful fact, which we will spend
          seven chapters earning the right to be surprised by, is that the
          spectrum of a random matrix is not random at all.
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
