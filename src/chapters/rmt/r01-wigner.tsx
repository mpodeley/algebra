import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function ChapterR01() {
  const next = getNextChapter('r01-wigner')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.rmt}
        number="12"
        title="Wigner's gambit."
        dek="A physicist in 1955, defeated by an equation he could not solve, decides to give up. He replaces the equation with a coin flip — and the coin flip turns out to know the answer."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          Eugene Wigner had a problem that he could not solve, and he was
          not the first physicist to have it. The atomic nucleus had been
          pried open in the 1930s, and by 1950 the experimental data was
          piling up faster than the theory could absorb it. Hit a heavy
          nucleus with a slow neutron and it would absorb the neutron,
          form a transient excited state called a <em>compound nucleus</em>,
          and then either decay back or radiate. The energies at which
          this absorption happened — the <em>resonances</em> — were
          measurable to spectacular precision and present in spectacular
          numbers. Uranium-238 has hundreds of them between 0 and 10
          electronvolts; some heavy nuclei have thousands.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          Each resonance is, in the language of quantum mechanics, an
          eigenvalue of an operator: the nucleus&apos;s Hamiltonian, the
          matrix that describes its energy levels. By the previous chapter
          this is something we know how to think about. The Hamiltonian
          is a self-adjoint linear transformation; it has a spectrum;
          the spectrum is the list of energies the nucleus can sit at.
          A clean problem, in principle.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          In practice, hopeless. The Hamiltonian of a uranium nucleus
          contains the position, spin, and isospin of 238 protons and
          neutrons, all interacting through the strong force, the
          electromagnetic force, and the weak force, in a manner that
          even sixty years later cannot be written down on a single
          piece of paper. Solving for its eigenvalues is so far beyond
          what mid-century physics could do that the question almost
          stopped meaning anything. There <em>was</em> a Hamiltonian; it
          could be specified in principle; it determined the data; nobody
          could compute its spectrum, even approximately.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          What Wigner did, in a 1955 paper that almost did not get
          published because reviewers thought it absurd, was to give up.
          He proposed that, since nobody could compute the actual
          Hamiltonian and the resonances seemed to behave with a
          statistical character anyway, the right object to study was
          not <em>the</em> Hamiltonian but a <em>random</em> Hamiltonian
          — a matrix whose entries had been drawn out of a probability
          distribution.
        </p>

        <KeyInsight label="Wigner's gambit, 1955">
          <p>
            The matrix is too complicated to write down. So write down a
            <em> random matrix</em> instead and study the statistics of
            its spectrum. If the universal features of the actual nuclei
            are universal enough, the random model will get them right —
            because what is universal is independent of the details that
            you didn&apos;t know.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          On its face this is unhinged. You replace a specific
          mathematical object — the Hamiltonian of a real, physical
          nucleus — with a coin flip. You do not even bother to ask which
          coin flip, exactly: any reasonable distribution will do, so
          long as it respects the symmetries you know are present
          (Hermitian, real, time-reversible). And from this gambit you
          extract predictions about real nuclei, predictions that are
          supposed to match experiments to several decimal places.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          And yet. By 1962 the predictions had been compared to data
          from <em>thousands</em> of nuclear resonances, in dozens of
          isotopes, and the agreement was stunning. The spacings between
          neighboring resonances follow a distribution that Wigner had
          guessed (we will meet it in chapter four of this act). The
          density of resonances follows a curve called the <em>semicircle
          law</em> (chapter three). The fluctuations are described by
          something now known as the <em>Wigner-Dyson statistics</em>,
          which are the same on uranium as they are on hafnium as they
          are on samarium.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The reason this works is the central concept of the next eight
          chapters — <em>universality</em>. The spectral statistics of a
          random matrix do not depend on the details of the entry
          distribution. They depend only on the symmetry class of the
          matrix and on its size, and they describe the spectrum of
          almost any complicated enough operator with the same symmetries.
          The compound nucleus, the prime numbers, the conduction in a
          quantum dot, the loss landscape of a deep neural network, the
          channel matrix of a wireless link, the eigenfunctions of the
          Laplacian on a chaotic billiard — these all have the same
          spectral fluctuations as a random matrix, because in some sense
          that nobody fully understands they all <em>are</em> random
          matrices.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          Random matrix theory, in 2025, is the place where number theory
          meets quantum chaos meets statistical physics meets machine
          learning. It is also one of the few branches of mathematics
          where you can make rigorous predictions about the behavior of
          things you do not understand at all, simply by acknowledging
          that you do not understand them. The next seven chapters earn
          you the right to draw a 1000×1000 random matrix, compute its
          eigenvalues, and watch the curve they form be exactly the same
          curve every time.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          We start with the simplest possible random matrix, and the
          simplest possible question we can ask of it.
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
