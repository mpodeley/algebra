import { ChapterHeader } from '../../components/layout/ChapterHeader'
import { ChapterFooter } from '../../components/layout/ChapterFooter'
import { Section } from '../../components/layout/Section'
import { KeyInsight } from '../../components/layout/KeyInsight'
import { Caption } from '../../components/ui/Caption'
import { Eq, EqBlock } from '../../components/ui/Equation'
import { MIMOCapacityDemo } from '../../components/viz/MIMOCapacityDemo'
import { MarchenkoPastur } from '../../components/viz/MarchenkoPastur'
import { ACT_LABEL, getNextChapter } from '../../lib/content'

export default function ChapterR07() {
  const next = getNextChapter('r07-applications')
  return (
    <article>
      <ChapterHeader
        act={ACT_LABEL.rmt}
        number="18"
        title="Applications: MIMO, ML, finance."
        dek="Three concrete places where the theory pays its rent. Wireless capacity, machine-learning training dynamics, and the difference between signal and noise in financial covariance estimation — all problems where the input is a random matrix in disguise."
      />

      <Section width="prose" className="py-12">
        <h2 className="font-serif text-2xl text-ink">
          MIMO and the channel matrix
        </h2>
        <p className="mt-4 text-[17px] leading-[1.7] text-ink">
          A wireless link with <em>N</em> transmit antennas and{' '}
          <em>N</em> receive antennas is described, in the small-frequency
          regime, by an <em>N × N</em> complex matrix <em>H</em> whose
          entry <Eq tex="H_{ij}" /> is the channel gain from transmit
          antenna <em>j</em> to receive antenna <em>i</em>. In a
          richly-scattering environment those entries are well-modeled
          as independent complex Gaussians.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The Shannon capacity of the link is
        </p>

        <EqBlock tex="C \;=\; \log_2 \det\!\Bigl( I + \tfrac{\rho}{N} \, H H^\dagger \Bigr) \;=\; \sum_{i=1}^{N} \log_2\!\Bigl(1 + \tfrac{\rho}{N} \sigma_i^2\Bigr)" />

        <p className="text-[17px] leading-[1.7] text-ink">
          where <em>ρ</em> is the signal-to-noise ratio and{' '}
          <Eq tex="\sigma_i^2" /> are the eigenvalues of{' '}
          <Eq tex="H H^\dagger" />. The eigenvalues are themselves
          random variables, distributed (for square <em>H</em>)
          according to the Marchenko-Pastur law with <em>q = 1</em>. This
          is exactly the setup of random matrix theory, just dressed in
          telecom clothing.
        </p>
      </Section>

      <Section width="wide">
        <MIMOCapacityDemo />
        <Caption>
          Average and per-sample capacity of an <em>N × N</em> Gaussian
          MIMO channel as a function of <em>N</em>. The empirical mean
          (teal) tracks the asymptotic prediction (coral), and capacity
          grows linearly in <em>N</em>: doubling antennas almost doubles
          capacity. This linear scaling is the engineering reason every
          modern wireless standard (WiFi 6, 5G, Starlink) uses many
          antennas at both ends.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <h2 className="font-serif text-2xl text-ink">
          Machine learning: the Hessian during training
        </h2>
        <p className="mt-4 text-[17px] leading-[1.7] text-ink">
          The loss landscape of a neural network is a function of
          millions to billions of parameters. The local geometry near a
          point in parameter space is captured by the <em>Hessian</em>{' '}
          matrix of second derivatives — a square matrix the size of the
          parameter count. Computing the full Hessian is impossible at
          scale, but its <em>eigenvalue spectrum</em> can be estimated
          via subsampling tricks, and the spectrum has been measured for
          dozens of architectures and datasets since around 2018.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The structure that almost everyone reports is the same: a{' '}
          <em>bulk</em> region of small eigenvalues that looks
          remarkably like a Marchenko-Pastur density (or sometimes a
          shifted semicircle) plus a small set of <em>outlier</em>{' '}
          eigenvalues, much larger, off to the right. The bulk is the
          random-matrix part — the noise that comes from finite-sample
          training. The outliers are the signal — typically associated
          with directions of strong curvature and corresponding to
          features the network has actually learned.
        </p>

        <p className="mt-6 text-[17px] leading-[1.7] text-ink">
          The same bulk-vs-outlier decomposition shows up in a closely
          related setting: <em>covariance matrices</em>.
        </p>

        <h2 className="mt-12 font-serif text-2xl text-ink">
          Finance: signal versus noise in correlation matrices
        </h2>
        <p className="mt-4 text-[17px] leading-[1.7] text-ink">
          Estimate the covariance matrix of <em>N</em> stock returns from{' '}
          <em>T</em> days of data, and you get an <em>N × N</em> sample
          covariance matrix. In the simplest model — each day&apos;s
          return on each stock is an independent Gaussian random variable
          — the eigenvalues of the sample covariance follow the
          Marchenko-Pastur law,
        </p>

        <EqBlock tex="\rho_{\text{MP}}(\lambda) \;=\; \frac{1}{2 \pi q \lambda} \sqrt{(\lambda_+ - \lambda)(\lambda - \lambda_-)}, \quad \lambda_\pm = (1 \pm \sqrt{q})^2," />

        <p className="text-[17px] leading-[1.7] text-ink">
          where <em>q = N/T</em>. This density tells you what
          eigenvalues of the sample covariance you would see <em>if the
          underlying time series were pure noise</em>. Anything in the
          empirical spectrum that does not fit inside the support{' '}
          <Eq tex="[\lambda_-, \lambda_+]" /> is, statistically, signal.
        </p>
      </Section>

      <Section width="wide">
        <MarchenkoPastur />
        <Caption>
          Sample covariance eigenvalue histogram for an <em>N × T</em>{' '}
          Gaussian matrix at <em>q = N / T</em>. The teal histogram is
          empirical; the coral curve is the Marchenko-Pastur prediction.
          Increase <em>q</em> and the support spreads; in the limit{' '}
          <Eq tex="q \to 1" /> the lower edge touches zero.
        </Caption>
      </Section>

      <Section width="prose" className="py-12">
        <p className="text-[17px] leading-[1.7] text-ink">
          For a real financial dataset of <em>N = 500</em> equities and{' '}
          <em>T = 1000</em> days of returns (so <em>q = 0.5</em>), the
          MP support runs from about <em>0.09</em> to <em>2.91</em>. In
          practice, real correlation matrices have one or two
          eigenvalues out near 100 (the &ldquo;market mode&rdquo; — every
          stock co-moves), a handful in the range 5–20 (sectoral modes —
          tech moves with tech, banks with banks), and the rest crammed
          inside the MP bulk. The bulk is, statistically, noise; the
          outliers are signal worth caring about. Trading strategies
          that ignore this distinction reliably overfit.
        </p>

        <KeyInsight>
          <p>
            In all three applications, the structure is the same: an
            empirical matrix has a bulk eigenvalue distribution that
            agrees with a random matrix prediction, plus a small number
            of outliers. The bulk is the noise floor. Anything outside
            it is information.
          </p>
        </KeyInsight>

        <p className="text-[17px] leading-[1.7] text-ink">
          One last surprise to come, in the closing chapter — the most
          unexpected place that random matrix statistics show up. Not
          in physics, not in engineering, not in machine learning. In{' '}
          <em>number theory</em>.
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
