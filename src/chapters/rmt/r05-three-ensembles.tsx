import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq } from '../../components/ui/Equation'
import { EnsembleComparison } from '../../components/viz/EnsembleComparison'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function ChapterR05() {
  const next = getNextChapter('r05-three-ensembles')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.rmt}
        number="16"
        title="Three ensembles."
        dek="There is not one universality class but three. Each one is picked out by a single number — the Dyson index β — and the index records what physical symmetries you remembered to keep when you wrote down your random matrix."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Up to this chapter we have been studying real symmetric
          matrices, which Dyson labeled with β = 1 and called the
          orthogonal ensemble. There are exactly two more universality
          classes for finite-dimensional Hermitian random matrices, and
          the only difference between them is the field that the entries
          live in.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          Take Hermitian matrices over the complex numbers — entries
          satisfying <Eq tex="H_{ij} = \overline{H_{ji}}" /> with
          complex off-diagonal entries — and you get the{' '}
          <em>Gaussian Unitary Ensemble</em> (GUE), with{' '}
          <Eq tex="\beta = 2" />. Take Hermitian matrices over the
          quaternions and you get the <em>Gaussian Symplectic Ensemble</em>{' '}
          (GSE), with <Eq tex="\beta = 4" />. The integer{' '}
          <em>β</em> counts the number of real degrees of freedom per
          off-diagonal matrix entry: 1 for real, 2 for complex, 4 for
          quaternion. Dyson&apos;s 1962 theorem says these are the only
          three classes possible, full stop.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The three Wigner surmises corresponding to <em>β = 1, 2, 4</em>{' '}
          are below. The macroscopic spectrum (the semicircle) is the
          same in all three; what differs is the small-<em>s</em>{' '}
          behavior, where the spacing density is suppressed as{' '}
          <Eq tex="s^{\beta}" /> rather than just <em>s</em>.
        </p>
      </Section>

      <Section width="wide">
        <EnsembleComparison />
        <Caption>
          The three Wigner surmises. The main panel makes the broader
          shape visible — wider distributions for higher β. The log-log
          inset highlights the small-<em>s</em> power law: linear,
          quadratic, quartic suppression. The slopes in log-log are the
          β values directly.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Which class shows up depends on the symmetries of the system
          you are modelling. The mapping is precise and not negotiable:
        </p>

        <ul className="my-6 ml-5 space-y-2 text-[17px] leading-[1.6] text-ink">
          <li>
            <strong>β = 1 (GOE):</strong> the system is{' '}
            <em>time-reversal invariant</em> and rotationally symmetric.
            Real Hamiltonians, no magnetic field, no spin-orbit
            coupling. Most heavy nuclei. Most chaotic billiards. Also,
            for a wholly different reason, the eigenvalues of any large
            real symmetric matrix with i.i.d. real entries.
          </li>
          <li>
            <strong>β = 2 (GUE):</strong> time-reversal is{' '}
            <em>broken</em>, often by a magnetic field. Quantum systems
            with a Lorentz-force term, conduction in a metal in a
            magnetic field. The nontrivial zeros of the Riemann zeta
            function fit this class — a fact we will see in the closing
            chapter.
          </li>
          <li>
            <strong>β = 4 (GSE):</strong> time-reversal preserved but{' '}
            <em>spin-orbit coupling</em> is strong; the system has
            half-integer spin and Kramers degeneracy. Heavy-element
            metals where relativistic effects matter.
          </li>
        </ul>

        <KeyInsight label="Dyson's three-fold way">
          <p>
            All real-spectrum random matrix universality classes are one
            of three: GOE (β=1), GUE (β=2), GSE (β=4). The exponent{' '}
            <em>β</em> appears as the small-<em>s</em> power in the
            spacing distribution and is in correspondence with which
            time-reversal/spin-rotation symmetries the underlying
            system preserves.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          One of the cleanest experimental confirmations of this scheme
          is in <em>microwave billiards</em>: brass cavities of carefully
          designed shape, into which microwaves are injected. The
          resonance frequencies are eigenvalues of the Helmholtz
          operator on the cavity. Build a cavity that respects
          time-reversal — it gives you GOE statistics. Insert a
          ferrite block that breaks time-reversal — the same cavity now
          gives GUE statistics. The transition is sharp, and the change
          in statistics is exactly what Dyson&apos;s 1962 paper said it
          should be. The system did not need to know any of the math;
          it just had to remember its symmetries.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The next chapter generalizes one step further. We have
          observed empirically (in chapter 14) that the semicircle does
          not depend on the entry distribution. We have not yet
          explained why, and the explanation deserves its own chapter,
          because what is at stake is the entire conceptual reason
          random matrix theory works.
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
