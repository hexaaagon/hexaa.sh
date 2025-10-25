export default function Star8({
  color,
  size,
  stroke,
  strokeWidth,
  pathClassName,
  width,
  height,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  color?: string
  size?: number
  stroke?: string
  pathClassName?: string
  strokeWidth?: number
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 200 200"
      width={size ?? width}
      height={size ?? height}
      {...props}
    >
      <path
        fill={color ?? "currentColor"}
        stroke={stroke}
        strokeWidth={strokeWidth}
        className={pathClassName}
        d="M100 5s5.088 49.035 25.527 69.473C145.965 94.912 195 100 195 100s-49.035 5.088-69.473 25.527C105.088 145.965 100 195 100 195s-5.088-49.035-25.527-69.473C54.035 105.088 5 100 5 100s49.035-5.088 69.473-25.527C94.912 54.035 100 5 100 5"
      />
    </svg>
  )
}
