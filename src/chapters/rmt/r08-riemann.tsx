import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { RiemannZeroSpacing } from '../../components/viz/RiemannZeroSpacing'
import { ACT_LABEL } from '../../lib/content'

export default function ChapterR08() {
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.rmt}
        number="19"
        title="The Riemann bridge."
        dek="The most surprising place that random matrix statistics show up is not physics or engineering. It is the prime numbers — through an object called the Riemann zeta function whose nontrivial zeros, on inspection, look unmistakably like the eigenvalues of a Gaussian Unitary matrix."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The Riemann zeta function is the analytic continuation, to the
          whole complex plane, of the apparently humble sum
        </p>

        <EqBlock tex="\zeta(s) \;=\; \sum_{n=1}^{\infty} \frac{1}{n^s}, \qquad \mathrm{Re}(s) > 1." />

        <p className="text-[17px] leading-[1.7] text-ink">
          What makes <em>ζ</em> a number-theory object rather than a
          calculus exercise is Euler&apos;s 1737 identity, which factors
          the same sum as a product over primes:
        </p>

        <EqBlock tex="\zeta(s) \;=\; \prod_{p \text{ prime}} \frac{1}{1 - p^{-s}}." />

        <p className="text-[17px] leading-[1.7] text-ink">
          So the zeros of <em>ζ</em> contain the entirety of the
          information about the primes. The famous Riemann hypothesis,
          unsolved since 1859, asserts that every nontrivial zero of{' '}
          <em>ζ</em> lies on the critical line{' '}
          <Eq tex="\mathrm{Re}(s) = 1/2" />. If true, the location of
          the zeros tightly controls the distribution of primes — by an
          amount that is, by 2025, the most consequential open problem in
          mathematics.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          For our purposes, the question is more limited: what does the
          <em> distribution</em> of those zeros look like, taking the
          critical-line conjecture for granted? The first few imaginary
          parts are 14.13, 21.02, 25.01, 30.42, and so on, marching off
          to infinity with a density that grows logarithmically. Local
          spacings between consecutive zeros, after appropriate
          normalization, look like — well, look at them.
        </p>
      </Section>

      <Section width="wide">
        <RiemannZeroSpacing />
        <Caption>
          The histogram is the empirical density of normalized spacings
          between the first 100 Riemann zeros (so, 99 spacings). The
          coral curve is the GUE Wigner surmise{' '}
          <Eq tex="P(s) = \tfrac{32}{\pi^2} s^2 e^{-4 s^2 / \pi}" />. The
          dashed amber and purple curves are the GOE and Poisson
          predictions, drawn faintly for contrast — neither one fits.
          Even with this small sample, the histogram visibly tracks the
          GUE.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The reason the histogram looks rough is that 100 zeros is a
          tiny sample, included here to keep the page small. Hugh
          Montgomery noticed the same agreement in 1973 — without
          embedded JavaScript visualizations, with a pencil and the
          published spacings of the first few hundred zeros — and
          conjectured that the pair correlation of zeros matches
          <em> exactly</em> the pair correlation of GUE eigenvalues. He
          presented the conjecture at the Institute for Advanced Study,
          where the physicist Freeman Dyson (the same Dyson) immediately
          recognized the formula from his work on heavy-nucleus
          spectra. The agreement, Dyson and Montgomery realized, was not
          something either field had any business expecting. There is no
          reason — none that anyone has been able to give to this day —
          for the prime numbers to know about quantum mechanics.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          Andrew Odlyzko spent the late 1980s and 1990s computing
          billions of Riemann zeros to high precision and checking
          the local statistics against random matrix theory. The
          agreement is exquisite, far beyond what one could write off as
          coincidence. The Odlyzko-Schönhage tables, which underpin
          most modern computational verification of the hypothesis, are
          consistent with the Riemann zeros being eigenvalues of a
          self-adjoint operator with the symmetries of a GUE matrix —
          that is, of an operator with broken time-reversal symmetry.
          Such an operator, if it exists, is called the{' '}
          <em>Hilbert-Pólya operator</em>, and finding it would prove
          the Riemann hypothesis. We do not know if it exists. We only
          know that the spectrum behaves as if it did.
        </p>

        <KeyInsight label="The unreasonable connection">
          <p>
            The local statistics of Riemann zeros — pair correlations,
            spacings, higher moments — match the corresponding
            statistics of GUE random matrices to every order tested.
            There is no known proof of this fact. There is no known
            geometric or arithmetic reason why it should be true. There
            is also no doubt, after thirty years of computer experiments,
            that it is.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          A short list of the things that are known, in 2025, to share
          this same statistical class with random matrices:
        </p>

        <ul className="my-6 ml-5 space-y-2 text-[17px] leading-[1.6] text-ink">
          <li>The energy levels of large nuclei (uranium, hafnium, samarium, ...).</li>
          <li>The eigenvalues of the Laplacian on chaotic billiards and quantum dots.</li>
          <li>The conductance fluctuations of disordered metals.</li>
          <li>The eigenvalues of the Hessian of a trained neural network, in the bulk.</li>
          <li>The singular values of a wireless MIMO channel matrix.</li>
          <li>The eigenvalues of an empirical correlation matrix when the underlying processes are noise.</li>
          <li>The nontrivial zeros of the Riemann zeta function.</li>
        </ul>

        <p className="text-[17px] leading-[1.7] text-ink">
          The list is not coincidental. It is, in some sense that
          mathematics is still working out, evidence that the same
          statistical law governs every system whose inner workings are
          complicated enough to look random. The spectrum of a complex
          enough operator is a random matrix. We do not know what
          &ldquo;complex enough&rdquo; really means. We only know that it
          covers nuclei, conductors, neural networks, microwaves, and
          the prime numbers.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The whole essay started, eighteen chapters ago, with two
          drag-and-drop arrows in a plane. The ground covered between
          there and here is exactly what makes this final coincidence
          earnable: addition and scaling, basis and span, transformation
          and matrix, eigenvector and spectrum, randomness and
          universality. The trip from the colored grid to the prime
          numbers turns out to be one chapter long, if you draw it the
          right way.
        </p>

        <p className="mt-12 font-serif text-[17px] italic leading-[1.7] text-mute">
          End.
        </p>
      </Section>

      <ChapterFooter />
    </article>
  )
}
