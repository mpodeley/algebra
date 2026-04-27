import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { SpacingDistribution } from '../../components/viz/SpacingDistribution'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function ChapterR04() {
  const next = getNextChapter('r04-level-repulsion')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.rmt}
        number="15"
        title="Level repulsion."
        dek="The semicircle was the macroscopic shape; this is the microscopic story. Eigenvalues of a random matrix do not pile up the way independent random points do. They keep their distance, with a strength that pins down which class of matrix you have."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Take a GOE sample. Sort its <em>N</em> eigenvalues; compute the
          gaps between consecutive ones; rescale by the local mean
          spacing. Pile those rescaled gaps together across many
          samples. The histogram is below — flip the GOE / Poisson toggle
          to see the alternative.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The Poisson alternative is the no-repulsion baseline. Generate
          <em> N</em> independent uniform random points on a line, sort
          them, take the gaps. The result has the spacings of a Poisson
          process: an exponential distribution{' '}
          <Eq tex="P(s) = e^{-s}" /> whose density is highest at zero.
          Independent points cluster; that is what independence{' '}
          <em>is</em>.
        </p>
      </Section>

      <Section width="wide">
        <SpacingDistribution />
        <Caption>
          The histogram is the empirical density of normalized
          consecutive-eigenvalue gaps. The coral curve is the{' '}
          <em>Wigner surmise</em>{' '}
          <Eq tex="P(s) = \tfrac{\pi}{2} s \, e^{-\pi s^2 / 4}" />,
          the prediction for the GOE. The amber dashed curve is the
          exponential <Eq tex="P(s) = e^{-s}" />, the prediction for
          Poisson. Toggle between the two sources and watch the
          histogram switch which curve it tracks.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The contrast is the whole chapter. The Poisson histogram is
          pinned to its maximum at <Eq tex="s = 0" /> — independent
          points like to land near each other, sometimes two within an
          eyelash of one another. The GOE histogram, in stark contrast,
          drops to zero at <Eq tex="s = 0" />. Eigenvalues do not bunch.
          You can call this whatever the metaphor demands —{' '}
          <em>repulsion</em>, the mutual avoidance principle of
          eigenvalues — but the formal statement is the small-<em>s</em>{' '}
          behavior of the Wigner surmise:
        </p>

        <EqBlock tex="P(s) \;\sim\; \tfrac{\pi}{2} s \quad \text{as} \quad s \to 0." />

        <p className="text-[17px] leading-[1.7] text-ink">
          Linearly suppressed. The probability of finding two
          eigenvalues separated by <em>s</em> goes to zero as <em>s</em>{' '}
          goes to zero, with first-order strength. This is what
          distinguishes the spectrum of a random matrix from the
          spectrum of a random Hamiltonian whose levels happen to be{' '}
          <em>independent</em>. There is no quantum mechanics in the
          calculation; the linear suppression follows from the{' '}
          <em>algebra</em> of nearby eigenvalues, which behaves like a
          2×2 sub-problem and contributes a factor of <em>s</em> to the
          probability density.
        </p>

        <KeyInsight label="Level repulsion">
          <p>
            Random matrix eigenvalues do not behave like independent
            random points. The probability of a small gap{' '}
            <em>s</em> between consecutive eigenvalues is suppressed
            linearly in <em>s</em> for the GOE — and the strength of
            the suppression is the signature of which matrix ensemble
            you are sampling from.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          The exponent in the small-<em>s</em> repulsion is the{' '}
          <em>Dyson index</em>, customarily called <em>β</em>. For
          symmetric real matrices, <Eq tex="\beta = 1" /> — linear
          repulsion. For Hermitian complex matrices,{' '}
          <Eq tex="\beta = 2" /> — quadratic, twice as strong. For
          self-dual quaternionic matrices, <Eq tex="\beta = 4" /> —
          quartic. These three matrix classes are the three flavors of
          random matrix ensemble, and the next chapter introduces them
          properly.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The historical observation that the spacing distributions of
          uranium-238 and erbium-166 nuclear resonances both fit the
          Wigner surmise with <Eq tex="\beta = 1" /> — to within
          experimental error — has, by 2025, accumulated thousands of
          examples in dozens of physical systems. The same statistics
          describe the energy levels of large nuclei, the eigenvalues
          of the Laplacian on a quantum chaotic billiard, and (most
          spectacularly) the nontrivial zeros of the Riemann zeta
          function. The last of those is the bridge of the final
          chapter of this essay.
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
