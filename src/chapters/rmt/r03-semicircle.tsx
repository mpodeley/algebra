import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { SemicircleHistogram } from '../../components/viz/SemicircleHistogram'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function ChapterR03() {
  const next = getNextChapter('r03-semicircle')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.rmt}
        number="14"
        title="The semicircle law."
        dek="Pile up the eigenvalues from many random matrices and the histogram converges to a curve. The curve is a perfect half-circle, and it does not depend on the distribution you used. Look at it. Look at it for a while."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Pull a fresh GOE matrix out of the previous chapter; compute its{' '}
          <em>N</em> eigenvalues; rescale them by{' '}
          <Eq tex="1/\sqrt{N}" /> so they live on{' '}
          <Eq tex="[-2, 2]" />; drop them onto a histogram. Pull another
          one. Drop those too. Pull a hundred more. The histogram has a
          shape, and the shape will not change.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          Press <em>autoplay</em> below.
        </p>
      </Section>

      <Section width="wide">
        <SemicircleHistogram />
        <Caption>
          The teal histogram is the empirical density of eigenvalues
          across all the GOE samples accumulated so far, normalized so
          its area integrates to one. The coral curve is the theoretical
          semicircle{' '}
          <Eq tex="\rho(\lambda) = \frac{1}{2\pi} \sqrt{4 - \lambda^2}" />
          on <Eq tex="[-2, 2]" />. The convergence is so good that, by
          maybe 40 samples at <em>N = 32</em>, the histogram is already
          impossible to tell apart from the curve. Bump <em>N</em> up and
          it gets even better.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          This is the <em>Wigner semicircle law</em>. As <em>N</em>{' '}
          grows and the number of samples grows, the empirical density of
          rescaled eigenvalues converges to the perfect half-circle —
        </p>

        <EqBlock tex="\rho(\lambda) = \frac{1}{2\pi} \sqrt{4 - \lambda^2}, \qquad \lambda \in [-2, 2]." />

        <p className="text-[17px] leading-[1.7] text-ink">
          That curve&apos;s area integrates to one (a probability
          density), it has support exactly on <Eq tex="[-2, 2]" />, it
          peaks at <Eq tex="\lambda = 0" /> with value{' '}
          <Eq tex="1/\pi" />, and it descends to zero at the edges with
          a square-root singularity. The proof is a one-page calculation
          (which we will not write out here) about the moments of the
          empirical eigenvalue distribution; what is harder than the
          proof is internalizing how strange the result is.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The strangeness lives in two places. First, the matrix entries
          come out of a Gaussian distribution with infinite tails, but
          the eigenvalues are confined to a finite interval almost
          surely. Second, and stranger: the curve{' '}
          <em>does not depend on the entry distribution</em>. We will
          spend an entire chapter on that, but the punchline is already
          worth previewing: change the Gaussian to a uniform, or a
          Bernoulli, or any reasonable distribution with finite variance,
          and the histogram still converges to <em>this</em> curve. The
          semicircle is not a fact about Gaussians. It is a fact about
          random matrices.
        </p>

        <KeyInsight label="The semicircle law">
          <p>
            For a real symmetric matrix with independent finite-variance
            entries, rescaled by <Eq tex="1/\sqrt{N}" />, the limiting
            density of eigenvalues is the semicircle{' '}
            <Eq tex="\rho(\lambda) = \frac{1}{2\pi}\sqrt{4 - \lambda^2}" />{' '}
            on <Eq tex="[-2, 2]" />. The shape does not depend on the
            choice of distribution.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          The semicircle is the macroscopic story — the bulk shape of
          the spectrum. There is a separate, finer-grained story about
          the <em>local</em> behavior: how individual eigenvalues
          arrange themselves on small scales, how much they repel each
          other, what statistics govern the spacing between
          consecutive eigenvalues. The local story is a different
          surprise from the global one, and arguably a deeper one,
          because it is what survives the macroscopic averaging that
          produced the semicircle. The next chapter is about that.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          A historical note before moving on. Wigner conjectured the
          semicircle law in 1955. He proved it for a particular class
          of distributions in 1958. The full universality across
          distributions took the rest of the 20th century to prove
          rigorously, and the modern proofs (Erdős–Schlein–Yau, Tao–Vu)
          are 2010-or-later. We are watching, in the canvas above, a
          phenomenon whose understanding has been one of the central
          stories of mathematical physics for sixty years.
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
