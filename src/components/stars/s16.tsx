export default function Star16({
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
        d="m100 5 17.211 30.766L147.5 17.728l-.477 35.25 35.249-.478-18.038 30.289L195 100l-30.766 17.211 18.038 30.289-35.249-.477.477 35.249-30.289-18.038L100 195l-17.211-30.766L52.5 182.272l.477-35.249-35.25.477 18.039-30.289L5 100l30.766-17.211L17.728 52.5l35.25.477-.478-35.25 30.289 18.039z"
      />
    </svg>
  )
}
