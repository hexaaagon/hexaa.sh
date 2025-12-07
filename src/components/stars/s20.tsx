export default function Star20({
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
        d="M107.6 5H92.4v76.652L38.199 27.451 27.45 38.199 81.65 92.4H5v15.2h76.652L27.45 161.801l10.748 10.748L92.4 118.348V195h15.2v-76.652l54.201 54.201 10.748-10.748-54.201-54.201H195V92.4h-76.652l54.201-54.201-10.748-10.748-54.201 54.2z"
        clipRule="evenodd"
        fillRule="evenodd"
      />
    </svg>
  )
}
