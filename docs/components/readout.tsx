// A list of labelled values under a chart.
type Props = { items: readonly (readonly [string, string])[] }

export function Readout({ items }: Props) {
  return (
    <dl className="readout">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}
