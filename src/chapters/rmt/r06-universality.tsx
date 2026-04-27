import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq } from '../../components/ui/Equation'
import { UniversalityHistogram } from '../../components/viz/UniversalityHistogram'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function ChapterR06() {
  const next = getNextChapter('r06-universality')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.rmt}
        number="17"
        title="Universality."
        dek="The Wigner semicircle is a fact about random matrices, not about Gaussians. Change the entry distribution to whatever you like — uniform, Bernoulli, exponential, sums of dice rolls — and you get the same curve. The phenomenon is among the deeper mysteries of probability, and it is also why this whole subject works."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          We have so far studied matrices with Gaussian entries because
          Gaussians are convenient — symmetric, unimodal, every moment
          finite, an exact analytical density. But the central conceit
          of the previous chapters is that <em>the result does not
          depend on the choice of distribution</em>, and it is time to
          back that up with experiment.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The widget below lets you replace the Gaussian entry
          distribution with two strikingly non-Gaussian alternatives.
          The <em>Uniform</em> case draws each entry from{' '}
          <Eq tex="U(-\sqrt{3}, \sqrt{3})" />, normalized so it has unit
          variance — entries are bounded, distribution is flat, no tails.
          The <em>Bernoulli</em> case draws each entry from{' '}
          <Eq tex="\{-1, +1\}" /> with equal probability, the most
          discrete distribution imaginable. Sample many matrices, look
          at the empirical eigenvalue density, compare to the same
          coral semicircle.
        </p>
      </Section>

      <Section width="wide">
        <UniversalityHistogram />
        <Caption>
          Three entry distributions, one curve. The histogram converges
          to the same Wigner semicircle{' '}
          <Eq tex="\rho(\lambda) = \frac{1}{2\pi}\sqrt{4 - \lambda^2}" />{' '}
          regardless of whether the matrix entries are Gaussian, uniform,
          or Bernoulli. Variance is the only entry-distribution detail
          the spectrum can see; everything else (skewness, kurtosis,
          discrete vs. continuous, bounded vs. unbounded) washes out.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          This phenomenon is called <em>universality</em>. The
          observation is that, in a precise sense, only a few features
          of the underlying distribution survive into the spectrum: the
          mean (which appears as a uniform shift) and the variance
          (which appears as a uniform scaling). Everything else — the
          skew, the discreteness, the bounded support, the heavy tails
          (so long as variance remains finite) — is invisible. The bulk
          spectrum and the local fluctuations both depend only on the
          symmetry class (the <em>β</em> of the previous chapter) and
          on the matrix size.
        </p>

        <KeyInsight>
          <p>
            <strong>Universality.</strong> For Wigner matrices with
            independent entries of finite variance, the empirical
            eigenvalue density and the local spacing statistics depend
            only on the symmetry class (β) and the size <em>N</em>, not
            on the entry distribution. The same statistics describe
            real-world systems whose details are unknowable, which is
            why random matrix theory predicts anything at all.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          The reason is a kind of central limit theorem on steroids.
          Each eigenvalue is, in a sense, a complicated function of the
          matrix entries — but the function smooths the entries enough
          that, at large <em>N</em>, the eigenvalue&apos;s distribution
          forgets the details of the entry distribution and depends
          only on its first two moments. Just as the sum of <em>N</em>{' '}
          independent random variables converges to a Gaussian
          regardless of where the summands came from, the spectrum of
          an <em>N × N</em> random matrix converges to <em>the</em>{' '}
          semicircle regardless of where the entries came from. The
          random matrix theorem is harder to prove than the central
          limit theorem, but the structure of the result is the same:
          one universal answer, indifferent to its inputs.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          Universality is what allows us to model things we do not
          understand. The Hamiltonian of a uranium nucleus is a specific
          matrix that nobody can write down. The Hamiltonian of a
          chaotic billiard is a specific operator with infinitely many
          entries that depend on the geometry of the billiard. The Riemann
          zeta function&apos;s zeros are a specific arithmetic object
          that has nothing to do with quantum mechanics or matrices at
          all. None of these are random matrices — but their spectra
          have the same statistics as random matrices, because the
          systems are sufficiently complicated that only their
          symmetries survive. That is the lever Wigner pulled, and the
          subject of the remaining two chapters is the leverage you can
          do with it.
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
