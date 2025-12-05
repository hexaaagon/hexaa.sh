"use client";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState, type JSX } from "react";

const divisions = 2;

// Shape renderers that return JSX nodes
const shapeSquare = (s: number, color: string) => {
  const level = Math.floor(Math.random() * divisions) + 1;
  const nodes: JSX.Element[] = [];
  for (let i = 1; i < level + 1; i++) {
    const w = s - (i - 1) * (s / divisions);
    const offset = (i - 1) * (s / divisions / 2);
    nodes.push(
      <rect
        key={`sq-${i}-${Math.random()}`}
        width={w}
        height={w}
        x={offset}
        y={offset}
        fill={color}
      />,
    );
  }
  return nodes;
};

const shapeVSquare = (s: number, color: string) => {
  const level = Math.floor(Math.random() * divisions) + 1;
  const nodes: JSX.Element[] = [];
  for (let i = 1; i < level + 1; i++) {
    const w = s / 2 - (i - 1) * (s / divisions / 2);
    const h = s - (i - 1) * (s / divisions);
    const ox = (i - 1) * (s / divisions / 2);
    const oy = (i - 1) * (s / divisions / 2);
    nodes.push(
      <rect
        key={`vs-a-${i}-${Math.random()}`}
        x={ox}
        y={oy}
        width={w}
        height={h}
        fill={color}
      />,
    );
    nodes.push(
      <rect
        key={`vs-b-${i}-${Math.random()}`}
        x={s / 2}
        y={oy}
        width={w}
        height={h}
        fill={color}
      />,
    );
  }
  return nodes;
};

const shapeHSquare = (s: number, color: string) => {
  const level = Math.floor(Math.random() * divisions) + 1;
  const nodes: JSX.Element[] = [];
  for (let i = 1; i < level + 1; i++) {
    const h = s / 2 - (i - 1) * (s / divisions / 2);
    const w = s - (i - 1) * (s / divisions);
    const ox = (i - 1) * (s / divisions / 2);
    const oy = (i - 1) * (s / divisions / 2);
    nodes.push(
      <rect
        key={`hs-a-${i}-${Math.random()}`}
        x={ox}
        y={oy}
        width={w}
        height={h}
        fill={color}
      />,
    );
    nodes.push(
      <rect
        key={`hs-b-${i}-${Math.random()}`}
        x={ox}
        y={s / 2}
        width={w}
        height={h}
        fill={color}
      />,
    );
  }
  return nodes;
};

const shapeCornerSquare = (s: number, color: string) => {
  const corners = [
    Math.random() < 0.5,
    Math.random() < 0.5,
    Math.random() < 0.5,
    Math.random() < 0.5,
  ];
  const nodes: JSX.Element[] = [];
  if (corners[0])
    nodes.push(
      <rect
        key={`cs-0-${Math.random()}`}
        width={s / 2}
        height={s / 2}
        x={0}
        y={0}
        fill={color}
      />,
    );
  if (corners[1])
    nodes.push(
      <rect
        key={`cs-1-${Math.random()}`}
        width={s / 2}
        height={s / 2}
        x={s / 2}
        y={0}
        fill={color}
      />,
    );
  if (corners[2])
    nodes.push(
      <rect
        key={`cs-2-${Math.random()}`}
        width={s / 2}
        height={s / 2}
        x={0}
        y={s / 2}
        fill={color}
      />,
    );
  if (corners[3])
    nodes.push(
      <rect
        key={`cs-3-${Math.random()}`}
        width={s / 2}
        height={s / 2}
        x={s / 2}
        y={s / 2}
        fill={color}
      />,
    );
  return nodes;
};

const shapeCircle = (s: number, color: string) => {
  const level = Math.floor(Math.random() * divisions) + 1;
  const nodes: JSX.Element[] = [];
  for (let i = 1; i < level + 1; i++) {
    const r = s / 2 - (i - 1) * (s / divisions / 2);
    nodes.push(
      <circle
        key={`c-${i}-${Math.random()}`}
        cx={s / 2}
        cy={s / 2}
        r={r}
        fill={color}
      />,
    );
  }
  return nodes;
};

const shapeDiamond = (s: number, color: string) => {
  const level = Math.floor(Math.random() * divisions) + 1;
  const nodes: JSX.Element[] = [];
  for (let i = 1; i < level + 1; i++) {
    const off = (i - 1) * (s / divisions / 2);
    const points = `${s / 2},${off} ${off},${s / 2} ${s / 2},${s - off} ${s - off},${s / 2}`;
    nodes.push(
      <polygon key={`d-${i}-${Math.random()}`} points={points} fill={color} />,
    );
  }
  return nodes;
};

const shapeQuarterCircle = (s: number, color: string) => {
  const level = Math.floor(Math.random() * divisions) + 1;
  const offsetX = Math.floor(Math.random() * 2);
  const offsetY = Math.floor(Math.random() * 2);
  const nodes: JSX.Element[] = [];
  for (let i = 1; i < level + 1; i++) {
    const r = s - (i - 1) * (s / divisions);
    nodes.push(
      <circle
        key={`qc-${i}-${Math.random()}`}
        cx={offsetX * s}
        cy={offsetY * s}
        r={r}
        fill={color}
      />,
    );
  }
  return nodes;
};

const shapeDots = (s: number, color: string) => {
  const offset = s / divisions;
  const radius = s / divisions / 4;
  const nodes: JSX.Element[] = [];
  for (let i = 0; i < divisions; i++) {
    for (let j = 0; j < divisions; j++) {
      nodes.push(
        <circle
          key={`dt-${i}-${j}-${Math.random()}`}
          cx={j * offset + offset / 2}
          cy={i * offset + offset / 2}
          r={radius}
          fill={color}
        />,
      );
    }
  }
  return nodes;
};

const shapeSemiCircles = (s: number, color: string) => {
  const offset = s / 2;
  const r = s / 2;
  const coords = [
    { cx: 0, cy: offset },
    { cx: s, cy: offset },
    { cx: offset, cy: 0 },
    { cx: offset, cy: s },
  ];
  return coords.map((c, idx) => (
    <circle
      key={`sc-${idx}-${Math.random()}`}
      cx={c.cx}
      cy={c.cy}
      r={r}
      fill={color}
    />
  ));
};

const shapeHSemi = (s: number, color: string) => {
  const offset = s / 2;
  const r = s / 2;
  return [
    <circle
      key={`hsc-0-${Math.random()}`}
      cx={0}
      cy={offset}
      r={r}
      fill={color}
    />,
    <circle
      key={`hsc-1-${Math.random()}`}
      cx={s}
      cy={offset}
      r={r}
      fill={color}
    />,
  ];
};

const shapeVSemi = (s: number, color: string) => {
  const offset = s / 2;
  const r = s / 2;
  return [
    <circle
      key={`vsc-0-${Math.random()}`}
      cx={offset}
      cy={0}
      r={r}
      fill={color}
    />,
    <circle
      key={`vsc-1-${Math.random()}`}
      cx={offset}
      cy={s}
      r={r}
      fill={color}
    />,
  ];
};

const shapeFns = [
  shapeSquare,
  shapeVSquare,
  shapeHSquare,
  shapeCornerSquare,
  shapeCircle,
  shapeDiamond,
  shapeQuarterCircle,
  shapeDots,
  shapeSemiCircles,
  shapeHSemi,
  shapeVSemi,
];

const randomShapeNodes = (s: number, color: string) => {
  const fn = shapeFns[Math.floor(Math.random() * shapeFns.length)];
  return fn(s, color);
};

export interface BauhausProps {
  width?: number;
  height?: number;
  size?: number;
  colors?: string[];
}

const BauhausGenerator = ({
  width = 4,
  height = 2,
  size = 20,
  colors = ["#F65009", "#F3C11B", "#3D38F5", "#DE7D02"],
  className,
  ...props
}: BauhausProps & React.ComponentProps<"div">) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [svgNodes, setSvgNodes] = useState<JSX.Element[] | null>(null);

  const randomBetween = (min: number, max: number) =>
    min + Math.floor(Math.random() * (max - min + 1));
  const randomBool = () => Math.random() < 0.5;

  // Return a random color from the provided palette (ensure leading '#').
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const getRandomColor = useCallback(() => {
    if (!colors || colors.length === 0) return "#000000";
    const c = colors[Math.floor(Math.random() * colors.length)];
    return c.startsWith("#") ? c : `#${c}`;
  }, []);

  // Shape renderers that return JSX nodes
  const shapeSquare = (s: number, color: string) => {
    const level = randomBetween(1, divisions);
    const nodes: JSX.Element[] = [];
    for (let i = 1; i < level + 1; i++) {
      const w = s - (i - 1) * (s / divisions);
      const offset = (i - 1) * (s / divisions / 2);
      nodes.push(
        <rect
          key={`sq-${i}-${Math.random()}`}
          width={w}
          height={w}
          x={offset}
          y={offset}
          fill={color}
        />,
      );
    }
    return nodes;
  };

  const shapeVSquare = (s: number, color: string) => {
    const level = randomBetween(1, divisions);
    const nodes: JSX.Element[] = [];
    for (let i = 1; i < level + 1; i++) {
      const w = s / 2 - (i - 1) * (s / divisions / 2);
      const h = s - (i - 1) * (s / divisions);
      const ox = (i - 1) * (s / divisions / 2);
      const oy = (i - 1) * (s / divisions / 2);
      nodes.push(
        <rect
          key={`vs-a-${i}-${Math.random()}`}
          x={ox}
          y={oy}
          width={w}
          height={h}
          fill={color}
        />,
      );
      nodes.push(
        <rect
          key={`vs-b-${i}-${Math.random()}`}
          x={s / 2}
          y={oy}
          width={w}
          height={h}
          fill={color}
        />,
      );
    }
    return nodes;
  };

  const shapeHSquare = (s: number, color: string) => {
    const level = randomBetween(1, divisions);
    const nodes: JSX.Element[] = [];
    for (let i = 1; i < level + 1; i++) {
      const h = s / 2 - (i - 1) * (s / divisions / 2);
      const w = s - (i - 1) * (s / divisions);
      const ox = (i - 1) * (s / divisions / 2);
      const oy = (i - 1) * (s / divisions / 2);
      nodes.push(
        <rect
          key={`hs-a-${i}-${Math.random()}`}
          x={ox}
          y={oy}
          width={w}
          height={h}
          fill={color}
        />,
      );
      nodes.push(
        <rect
          key={`hs-b-${i}-${Math.random()}`}
          x={ox}
          y={s / 2}
          width={w}
          height={h}
          fill={color}
        />,
      );
    }
    return nodes;
  };

  const shapeCornerSquare = (s: number, color: string) => {
    const corners = [randomBool(), randomBool(), randomBool(), randomBool()];
    const nodes: JSX.Element[] = [];
    if (corners[0])
      nodes.push(
        <rect
          key={`cs-0-${Math.random()}`}
          width={s / 2}
          height={s / 2}
          x={0}
          y={0}
          fill={color}
        />,
      );
    if (corners[1])
      nodes.push(
        <rect
          key={`cs-1-${Math.random()}`}
          width={s / 2}
          height={s / 2}
          x={s / 2}
          y={0}
          fill={color}
        />,
      );
    if (corners[2])
      nodes.push(
        <rect
          key={`cs-2-${Math.random()}`}
          width={s / 2}
          height={s / 2}
          x={0}
          y={s / 2}
          fill={color}
        />,
      );
    if (corners[3])
      nodes.push(
        <rect
          key={`cs-3-${Math.random()}`}
          width={s / 2}
          height={s / 2}
          x={s / 2}
          y={s / 2}
          fill={color}
        />,
      );
    return nodes;
  };

  const shapeCircle = (s: number, color: string) => {
    const level = randomBetween(1, divisions);
    const nodes: JSX.Element[] = [];
    for (let i = 1; i < level + 1; i++) {
      const r = s / 2 - (i - 1) * (s / divisions / 2);
      nodes.push(
        <circle
          key={`c-${i}-${Math.random()}`}
          cx={s / 2}
          cy={s / 2}
          r={r}
          fill={color}
        />,
      );
    }
    return nodes;
  };

  const shapeDiamond = (s: number, color: string) => {
    const level = randomBetween(1, divisions);
    const nodes: JSX.Element[] = [];
    for (let i = 1; i < level + 1; i++) {
      const off = (i - 1) * (s / divisions / 2);
      const points = `${s / 2},${off} ${off},${s / 2} ${s / 2},${s - off} ${s - off},${s / 2}`;
      nodes.push(
        <polygon
          key={`d-${i}-${Math.random()}`}
          points={points}
          fill={color}
        />,
      );
    }
    return nodes;
  };

  const shapeQuarterCircle = (s: number, color: string) => {
    const level = randomBetween(1, divisions);
    const offsetX = randomBetween(0, 1);
    const offsetY = randomBetween(0, 1);
    const nodes: JSX.Element[] = [];
    for (let i = 1; i < level + 1; i++) {
      const r = s - (i - 1) * (s / divisions);
      nodes.push(
        <circle
          key={`qc-${i}-${Math.random()}`}
          cx={offsetX * s}
          cy={offsetY * s}
          r={r}
          fill={color}
        />,
      );
    }
    return nodes;
  };

  const shapeDots = (s: number, color: string) => {
    const offset = s / divisions;
    const radius = s / divisions / 4;
    const nodes: JSX.Element[] = [];
    for (let i = 0; i < divisions; i++) {
      for (let j = 0; j < divisions; j++) {
        nodes.push(
          <circle
            key={`dt-${i}-${j}-${Math.random()}`}
            cx={j * offset + offset / 2}
            cy={i * offset + offset / 2}
            r={radius}
            fill={color}
          />,
        );
      }
    }
    return nodes;
  };

  const shapeSemiCircles = (s: number, color: string) => {
    const offset = s / 2;
    const r = s / 2;
    const coords = [
      { cx: 0, cy: offset },
      { cx: s, cy: offset },
      { cx: offset, cy: 0 },
      { cx: offset, cy: s },
    ];
    return coords.map((c, idx) => (
      <circle
        key={`sc-${idx}-${Math.random()}`}
        cx={c.cx}
        cy={c.cy}
        r={r}
        fill={color}
      />
    ));
  };

  const shapeHSemi = (s: number, color: string) => {
    const offset = s / 2;
    const r = s / 2;
    return [
      <circle
        key={`hsc-0-${Math.random()}`}
        cx={0}
        cy={offset}
        r={r}
        fill={color}
      />,
      <circle
        key={`hsc-1-${Math.random()}`}
        cx={s}
        cy={offset}
        r={r}
        fill={color}
      />,
    ];
  };

  const shapeVSemi = (s: number, color: string) => {
    const offset = s / 2;
    const r = s / 2;
    return [
      <circle
        key={`vsc-0-${Math.random()}`}
        cx={offset}
        cy={0}
        r={r}
        fill={color}
      />,
      <circle
        key={`vsc-1-${Math.random()}`}
        cx={offset}
        cy={s}
        r={r}
        fill={color}
      />,
    ];
  };

  const _shapeFns = [
    shapeSquare,
    shapeVSquare,
    shapeHSquare,
    shapeCornerSquare,
    shapeCircle,
    shapeDiamond,
    shapeQuarterCircle,
    shapeDots,
    shapeSemiCircles,
    shapeHSemi,
    shapeVSemi,
  ];

  const generate = useCallback(() => {
    const nodes: JSX.Element[] = [];
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        nodes.push(
          <g
            key={`${i}-${j}-${Math.random()}`}
            transform={`matrix(1,0,0,1,${j * size},${i * size})`}
            clipPath={`url(#square)`}
          >
            {randomShapeNodes(size, getRandomColor())}
          </g>,
        );
      }
    }
    setSvgNodes(nodes);
  }, [height, width, size, getRandomColor]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className={cn("bauhaus-container", className)} {...props}>
      <svg
        ref={svgRef}
        role="img"
        width={width * size}
        height={height * size}
        viewBox={`0 0 ${width * size} ${height * size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Bauhaus Art</title>
        <defs>
          <clipPath id="square">
            <rect width={size} height={size} />
          </clipPath>
        </defs>
        {svgNodes}
      </svg>
    </div>
  );
};

export default BauhausGenerator;
