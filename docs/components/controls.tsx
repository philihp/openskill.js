'use client'
// The inputs of the explorers. Each one reports a change to its owner and
// holds no state of its own.
import { useId } from 'react'

type SliderProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  format?: (value: number) => string
}

export function Slider({ label, value, min, max, step = 1, onChange, format = String }: SliderProps) {
  const id = useId()
  return (
    <div className="control">
      <label htmlFor={id}>{label}</label>
      <output htmlFor={id}>{format(value)}</output>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}

type ToggleProps = { label: string; checked: boolean; onChange: (checked: boolean) => void }

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  )
}

type ChoiceProps<T extends string> = {
  label: string
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (value: T) => void
}

export function Choice<T extends string>({ label, value, options, onChange }: ChoiceProps<T>) {
  return (
    <div className="choice" role="group" aria-label={label}>
      <span>{label}</span>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
