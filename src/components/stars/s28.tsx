export default function Star28({
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
        d="M121 5C96.7 5 77 24.7 77 49v29H5c0 24.301 19.7 44 44 44h28v73c24.301 0 44-19.699 44-44v-29h74c0-24.3-19.699-44-44-44h-30z"
        clipRule="evenodd"
        fillRule="evenodd"
      />
    </svg>
  )
}
