export default function Star40({
  color,
  size,
  stroke,
  strokeWidth,
  pathClassName,
  width,
  height,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  color?: string;
  size?: number;
  stroke?: string;
  pathClassName?: string;
  strokeWidth?: number;
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
        d="M90.5 5h19v78.546l68.022-39.273 9.5 16.454L119 100l68.022 39.273-9.5 16.454-68.022-39.273V195h-19v-78.546l-68.023 39.273-9.5-16.454L81 100 12.977 60.727l9.5-16.454L90.5 83.546z"
        clipRule="evenodd"
        fillRule="evenodd"
      />
    </svg>
  );
}
