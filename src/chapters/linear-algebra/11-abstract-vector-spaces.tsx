import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq } from '../../components/ui/Equation'
import { PolynomialBasis } from '../../components/viz/PolynomialBasis'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function Chapter11() {
  const next = getNextChapter('11-abstract-vector-spaces')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.la}
        number="11"
        title="Abstract vector spaces."
        dek="The whole essay so far has used arrows. Almost none of it actually depended on arrows. The two operations are addition and scaling — and any collection of objects that obeys those operations carries the entire apparatus along with it for free."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Pull every theorem of the previous ten chapters off the page,
          gently, and ask which of them genuinely needs the vectors to be
          arrows in the plane. The answer turns out to be:{' '}
          <em>almost none of them</em>.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          We needed to be able to add two vectors and get a vector. We
          needed to be able to scale a vector by a real number. We
          needed those operations to behave the way they behave for
          arrows — addition is associative and commutative, scaling
          distributes over addition, there is a zero vector, and so on.
          Eight rules in total, packaged together as the definition of a{' '}
          <em>vector space</em>. None of the rules ever pointed at a
          plane.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          So whenever you have a collection of objects that obey the
          eight rules, the entire vocabulary of linear algebra applies:
          basis, span, transformation, eigenvector, spectrum. The
          vector space need not be a plane. It need not be a space.
          Polynomials work. So do continuous functions, so do sound
          signals, so do quantum-mechanical wavefunctions, so do random
          variables, so do <em>matrices themselves</em>.
        </p>
      </Section>

      <Section width="wide">
        <PolynomialBasis />
        <Caption>
          The bold teal curve is a polynomial of degree at most three,
          living in a four-dimensional vector space whose basis is{' '}
          <Eq tex="\{1, \, x, \, x^2, \, x^3\}" />. The dashed curves are
          the four basis components scaled by their coefficients; the
          result is their sum, exactly the linear combination we have
          been drawing as arrows the whole essay. The polynomial{' '}
          <em>is</em> the vector. Its coefficients are its coordinates
          in this basis.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The polynomial space gives a clean example because it is small.
          Four basis elements, four coefficients, finite dimensions, no
          calculus required. But it makes the same point as harder
          examples: in this space, &ldquo;adding two vectors&rdquo; means
          adding the polynomials term by term; &ldquo;scaling&rdquo;
          means multiplying every coefficient by the scalar; the
          coordinates of the polynomial in this basis are simply its
          coefficients.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          A linear transformation on this space takes a polynomial and
          gives back another polynomial, while respecting addition and
          scaling. <em>Differentiation</em> is one such transformation:{' '}
          <Eq tex="\frac{d}{dx}" /> takes <Eq tex="x^3" /> to{' '}
          <Eq tex="3 x^2" />, takes <Eq tex="x^2" /> to{' '}
          <Eq tex="2 x" />, takes <Eq tex="x" /> to <Eq tex="1" />, and
          takes <Eq tex="1" /> to <Eq tex="0" />. Reading off where it
          sends each basis element gives a 4×4 matrix
        </p>

        <pre className="my-6 overflow-x-auto rounded-(--radius-card) border border-line bg-surface p-4 font-mono text-[13px] leading-relaxed text-ink">
{`         1  x  x²  x³
   1  [  0  1   0   0 ]
   x  [  0  0   2   0 ]
   x² [  0  0   0   3 ]
   x³ [  0  0   0   0 ]`}
        </pre>

        <p className="text-[17px] leading-[1.7] text-ink">
          which is everything you need to differentiate any cubic
          polynomial — no calculus, just matrix-vector multiplication.
          The eigenvalues of this matrix are all zero (read off the
          diagonal); the only eigenvector is the constant polynomial,
          which differentiation sends to zero. The spectrum of
          differentiation, on this space, is just{' '}
          <Eq tex="\{0\}" /> with multiplicity four. Every machinery we
          built for arrows ports straight over.
        </p>

        <KeyInsight>
          <p>
            A vector space is any collection of objects that can be added
            and scaled, with rules behaving as they do for arrows. The
            objects need not be arrows. The rules are everything; the
            picture is convenient but optional.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          One example of an abstract vector space deserves its own bridge
          paragraph because the second act of this essay lives inside it:
          the space of <em>2×2 matrices</em>. Add two matrices entry by
          entry; scale by multiplying each entry. The result is still a
          2×2 matrix. So 2×2 matrices, with these operations, form a
          four-dimensional vector space (one dimension for each entry).
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          Now imagine a probability distribution over that four-dimensional
          space — say, every entry is an independent Gaussian. Each draw
          is a single 2×2 matrix, but a random one. The distribution lives
          in a vector space, and the matrix you draw <em>describes</em> a
          transformation on the original 2D plane. So now you have a
          random transformation, with random eigenvalues, and a random
          spectrum. What does that distribution of spectra look like?
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          That question, asked of much larger matrices than 2×2, is the
          subject of Random Matrix Theory. Eugene Wigner asked it in
          1955 about a 100×100 matrix because he could not solve the
          actual physics he wanted to solve, and the structure of the
          answer became one of the most surprising things in
          twentieth-century mathematics. The next eight chapters earn
          you the right to be surprised by the same thing.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          End of act one.
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
