type Props = {
  label?: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (next: number) => void
  display?: string
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  display,
}: Props) {
  return (
    <label className="block">
      {(label || display) && (
        <span className="mb-2 flex items-baseline justify-between">
          {label && (
            <span className="text-sm text-mute">{label}</span>
          )}
          {display !== undefined && (
            <span className="font-mono text-sm text-ink">{display}</span>
          )}
        </span>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="
          h-9 w-full cursor-pointer appearance-none bg-transparent
          [&::-webkit-slider-runnable-track]:h-[3px]
          [&::-webkit-slider-runnable-track]:rounded-full
          [&::-webkit-slider-runnable-track]:bg-line
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:-mt-[7px]
          [&::-webkit-slider-thumb]:h-[18px]
          [&::-webkit-slider-thumb]:w-[18px]
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-accent
          [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_var(--color-bg)]
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-track]:h-[3px]
          [&::-moz-range-track]:rounded-full
          [&::-moz-range-track]:bg-line
          [&::-moz-range-thumb]:h-[18px]
          [&::-moz-range-thumb]:w-[18px]
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:bg-accent
        "
      />
    </label>
  )
}
