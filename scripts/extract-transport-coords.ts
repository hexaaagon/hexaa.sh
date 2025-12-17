import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Read GeoJSON files
const krlGeoJSON = JSON.parse(
  readFileSync(resolve("src/constants/blog/krl_wgs84.geojson"), "utf-8"),
);
const mrtGeoJSON = JSON.parse(
  readFileSync(resolve("src/constants/blog/mrt-wgs84.geojson"), "utf-8"),
);

// Extract KRL coordinates
const krlCoordinates: Record<string, Array<[number, number]>> = {};
krlGeoJSON.features.forEach((feature: any, index: number) => {
  const lineNum = index + 1;
  krlCoordinates[`krlLine${lineNum}Coordinates`] = feature.geometry.coordinates;
});

// Extract MRT coordinates and organize by fase
const mrtCoordinates: Record<string, any> = {
  mrtNorthSouth1Coordinates: [],
  mrtNorthSouth2ACoordinates: undefined,
  mrtNorthSouth2BCoordinates: undefined,
  mrtEastWest3Coordinates: [],
};

// Map features to their corresponding fase based on properties
mrtGeoJSON.features.forEach((feature: any, _idx: number) => {
  const props = feature.properties;
  const rute = props.Rute || "";
  const _objectId = props.OBJECTID;

  // Fase 1: "MRT North-South" without "Fase" in the name, or explicit "Fase 1"
  if (
    (rute === "MRT North-South" || rute.includes("Fase 1")) &&
    !rute.includes("Fase 2") &&
    !rute.includes("Fase 3")
  ) {
    if (feature.geometry.type === "MultiLineString") {
      // Concatenate all LineStrings from MultiLineString
      mrtCoordinates.mrtNorthSouth1Coordinates.push(
        ...feature.geometry.coordinates,
      );
    } else if (feature.geometry.type === "LineString") {
      mrtCoordinates.mrtNorthSouth1Coordinates.push(
        feature.geometry.coordinates,
      );
    }
  } else if (rute.includes("Fase 2A")) {
    mrtCoordinates.mrtNorthSouth2ACoordinates = feature.geometry.coordinates;
  } else if (rute.includes("Fase 2B")) {
    mrtCoordinates.mrtNorthSouth2BCoordinates = feature.geometry.coordinates;
  } else if (rute.includes("Fase 3")) {
    // Combine all Fase 3 features
    if (feature.geometry.type === "LineString") {
      mrtCoordinates.mrtEastWest3Coordinates.push(feature.geometry.coordinates);
    } else if (feature.geometry.type === "MultiLineString") {
      mrtCoordinates.mrtEastWest3Coordinates.push(
        ...feature.geometry.coordinates,
      );
    }
  }
});

// Generate TypeScript file
const tsContent = `// Auto-generated coordinates from GeoJSON files
// Generated at: ${new Date().toISOString()}

// KRL Coordinates
${Object.entries(krlCoordinates)
  .map(
    ([key, coords]) =>
      `export const ${key}: Array<[number, number]> = ${JSON.stringify(coords)};`,
  )
  .join("\n")}

// MRT Coordinates
${
  mrtCoordinates.mrtNorthSouth1Coordinates.length > 0
    ? `export const mrtNorthSouth1Coordinates: Array<Array<[number, number]>> = ${JSON.stringify(
        mrtCoordinates.mrtNorthSouth1Coordinates,
      )};`
    : ""
}
${
  mrtCoordinates.mrtNorthSouth2ACoordinates
    ? `export const mrtNorthSouth2ACoordinates: Array<[number, number]> = ${JSON.stringify(
        mrtCoordinates.mrtNorthSouth2ACoordinates,
      )};`
    : ""
}
${
  mrtCoordinates.mrtNorthSouth2BCoordinates
    ? `export const mrtNorthSouth2BCoordinates: Array<[number, number]> = ${JSON.stringify(
        mrtCoordinates.mrtNorthSouth2BCoordinates,
      )};`
    : ""
}
${
  mrtCoordinates.mrtEastWest3Coordinates.length > 0
    ? `export const mrtEastWest3Coordinates: Array<Array<[number, number]>> = ${JSON.stringify(
        mrtCoordinates.mrtEastWest3Coordinates,
      )};`
    : ""
}
`;

writeFileSync(
  resolve("src/constants/blog/jakarta-transport-coords.ts"),
  tsContent,
);

console.log("✓ Coordinates extracted successfully!");
console.log(`KRL Lines: ${Object.keys(krlCoordinates).length}`);
console.log(`MRT Lines: ${Object.keys(mrtCoordinates).length}`);
