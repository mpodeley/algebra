import { InlineMath, BlockMath } from 'react-katex'

export function Eq({ tex }: { tex: string }) {
  return (
    <span className="text-ink">
      <InlineMath math={tex} />
    </span>
  )
}

export function EqBlock({ tex }: { tex: string }) {
  return (
    <div className="my-6 overflow-x-auto text-ink">
      <BlockMath math={tex} />
    </div>
  )
}
