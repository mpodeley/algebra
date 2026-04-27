import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq } from '../../components/ui/Equation'
import { RandomMatrixGenerator } from '../../components/viz/RandomMatrixGenerator'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function ChapterR02() {
  const next = getNextChapter('r02-experiment')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.rmt}
        number="13"
        title="The experiment."
        dek="The simplest random matrix you can construct, and the simplest question you can ask of it. The answer will, by the end of this act, be the bridge between nuclear physics, prime numbers, and machine learning."
      />

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The simplest random matrix is the one Wigner studied: an{' '}
          <em>N × N</em> symmetric matrix with independent Gaussian
          entries, called the <em>Gaussian Orthogonal Ensemble</em>, or
          <em> GOE</em>. The recipe is short. Take an <em>N × N</em>{' '}
          matrix; fill the diagonal with independent samples from{' '}
          <Eq tex="\mathcal{N}(0, 1)" />, the standard normal
          distribution; fill the upper triangle with independent samples
          from <Eq tex="\mathcal{N}(0, 1/2)" />, the Gaussian with
          variance one-half; mirror the upper triangle into the lower
          triangle so the matrix is symmetric. That is it.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The half in the off-diagonal variance is a bookkeeping
          decision; it is the choice that makes the eigenvalues
          (after dividing by <Eq tex="\sqrt{N}" />) lie in the interval{' '}
          <Eq tex="[-2, 2]" /> in the limit. Different texts use different
          conventions; the fluctuations and shape of the spectrum are the
          same up to a uniform rescaling.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The widget below draws one fresh GOE sample at the size you
          pick. Above, the matrix as a heatmap: blue for positive
          entries, coral for negative, with intensity tied to magnitude.
          Below, the spectrum: each eigenvalue plotted as a tick on a
          number line. Press <em>generate</em> to draw a new sample.
        </p>
      </Section>

      <Section width="wide">
        <RandomMatrixGenerator />
        <Caption>
          One sample. Each press of <em>generate</em> draws a new matrix.
          Notice that, for any fixed <em>N</em>, the eigenvalues never
          venture far from a roughly bounded interval, the density along
          the line is roughly the same shape every time, and the
          structure of the matrix as a heatmap looks like static noise.
          Three things hide in those observations.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          The first observation: the eigenvalues do not wander out to
          infinity. The matrix entries are unbounded — Gaussian, after
          all — and yet the eigenvalues seem to live in a finite range,
          and they do. The largest eigenvalue is, with high probability,
          near <Eq tex="2 \sqrt{N}" />, and the smallest near{' '}
          <Eq tex="-2 \sqrt{N}" />. After dividing by{' '}
          <Eq tex="\sqrt{N}" />, the spectrum lives on{' '}
          <Eq tex="[-2, 2]" /> almost surely.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The second observation: the <em>density</em> along that
          interval has a recognizable shape. Press <em>generate</em>{' '}
          enough times at <em>N = 64</em> and you will start to notice it.
          More eigenvalues in the middle, fewer near the edges, with the
          density tapering off so that there is no sharp boundary.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The third observation: the eigenvalues are not where they
          would be if you simply scattered <em>N</em> points uniformly at
          random over <Eq tex="[-2, 2]" />. They are conspicuously{' '}
          <em>spaced out</em> — they keep their distance from each
          other. We will spend a chapter on this in particular.
        </p>

        <KeyInsight>
          <p>
            For any GOE sample of size <em>N</em>: the eigenvalues stay
            confined to <Eq tex="[-2 \sqrt{N}, 2 \sqrt{N}]" />, their
            density along that interval has a fixed predictable shape,
            and they repel each other in a way that suppresses tight
            clusters. None of these facts depends on the choice of
            distribution, only on the matrix being a real symmetric
            matrix with finite-variance independent entries.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          The next chapter is the central wow of random matrix theory.
          We will sample many such matrices, pile their eigenvalues
          together into a histogram, and watch the histogram converge to
          a curve as <em>N</em> grows. The curve has a name and it is
          one of the most surprising things in mathematics: a perfect
          half-circle.
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
