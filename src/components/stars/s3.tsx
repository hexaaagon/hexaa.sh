export default function Star3({
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
        d="m100 5 3.277 63.822 16.475-61.746-10.064 63.108 28.952-56.97-22.965 59.636 40.165-49.707-34.863 53.56 49.622-40.27-45.236 45.14L182.272 52.5 128.64 87.249l61.71-16.606-59.685 22.839 63.815-3.412-63.13 9.93 63.13 9.93-63.815-3.412 59.685 22.839-61.71-16.606 53.632 34.749-56.909-29.073 45.236 45.14-49.622-40.269 34.863 53.559-40.165-49.707 22.965 59.637-28.952-56.971 10.064 63.108-16.475-61.746L100 195l-3.277-63.822-16.475 61.746 10.064-63.108-28.952 56.971 22.965-59.637-40.165 49.707 34.863-53.559L29.4 163.567l45.236-45.14-56.91 29.073 53.633-34.749-61.71 16.606 59.685-22.839L5.52 109.93 68.65 100 5.52 90.07l63.815 3.412L9.65 70.643 71.36 87.25 17.728 52.5l56.91 29.073L29.4 36.433l49.622 40.27-34.863-53.56L84.325 72.85 61.36 13.213l28.952 56.971L80.248 7.076l16.475 61.746z"
      />
    </svg>
  );
}
