import * as coordinates from "./jakarta-transport-coords";

export type JakartaTransportation =
  | {
      type: "krl";
      lines: Array<{
        id: `krl-${string}`;
        name: `${string} Line`;
        code: {
          color: `#${string}`;
          short: string;
        };
        coordinates:
          | {
              type: "LineString";
              coordinates: Array<[number, number]>;
            }
          | {
              type: "MultiLineString";
              coordinates: Array<Array<[number, number]>>;
            };
        isOperational: boolean;
        isUnderConstruction: boolean;
      }>;
    }
  | {
      type: "mrt";
      lines: Array<{
        id: `mrt-${string}`;
        name: `${string} Line`;
        code: {
          color: `#${string}`;
          short: string;
        };
        coordinates:
          | {
              type: "LineString";
              coordinates: Array<[number, number]>;
            }
          | {
              type: "MultiLineString";
              coordinates: Array<Array<[number, number]>>;
            };
        isOperational: boolean;
        isUnderConstruction: boolean;
      }>;
    };

// KRL Lines Data
export const krlTransportation: JakartaTransportation = {
  type: "krl",
  lines: [
    {
      id: "krl-rangkasbitung",
      name: "Rangkasbitung Line",
      code: {
        color: "#98C93F",
        short: "R",
      },
      coordinates: {
        type: "LineString",
        coordinates: coordinates.krlLine2Coordinates,
      },
      isOperational: true,
      isUnderConstruction: false,
    },
    {
      id: "krl-cikarang-loop",
      name: "Cikarang Loop Line",
      code: {
        color: "#26BAED",
        short: "C",
      },
      coordinates: {
        type: "MultiLineString",
        coordinates: [
          coordinates.krlLine1Coordinates,
          coordinates.krlLine11Coordinates,
          coordinates.krlLine10Coordinates,
          coordinates.krlLine9Coordinates,
          coordinates.krlLine8Coordinates,
          coordinates.krlLine7Coordinates,
          coordinates.krlLine5Coordinates,
          coordinates.krlLine13Coordinates,
          coordinates.krlLine12Coordinates,
        ],
      },
      isOperational: true,
      isUnderConstruction: false,
    },
    {
      id: "krl-bogor",
      name: "Bogor Line",
      code: {
        color: "#EC2329",
        short: "B",
      },
      coordinates: {
        type: "MultiLineString",
        coordinates: [
          coordinates.krlLine6Coordinates,
          coordinates.krlLine3Coordinates,
        ],
      },
      isOperational: true,
      isUnderConstruction: false,
    },
    {
      id: "krl-tangerang",
      name: "Tangerang Line",
      code: {
        color: "#C25F28",
        short: "T",
      },
      coordinates: {
        type: "LineString",
        coordinates: coordinates.krlLine4Coordinates,
      },
      isOperational: true,
      isUnderConstruction: false,
    },
    {
      id: "krl-tanjung-priok",
      name: "Tanjung Priok Line",
      code: {
        color: "#EF509A",
        short: "TP",
      },
      coordinates: {
        type: "MultiLineString",
        coordinates: [
          coordinates.krlLine14Coordinates,
          coordinates.krlLine15Coordinates,
        ],
      },
      isOperational: true,
      isUnderConstruction: false,
    },
  ],
};

// MRT Lines Data
export const mrtTransportation: JakartaTransportation = {
  type: "mrt",
  lines: [
    {
      id: "mrt-north-south-1",
      name: "MRT North-South (Fase 1) Line",
      code: {
        color: "#E31E24",
        short: "NS1",
      },
      coordinates: {
        type: "MultiLineString",
        coordinates: coordinates.mrtNorthSouth1Coordinates,
      },
      isOperational: true,
      isUnderConstruction: false,
    },
    {
      id: "mrt-north-south-2a",
      name: "MRT North-South (Fase 2A) Line",
      code: {
        color: "#E31E24",
        short: "NS2A",
      },
      coordinates: {
        type: "LineString",
        coordinates: coordinates.mrtNorthSouth2ACoordinates,
      },
      isOperational: false,
      isUnderConstruction: true,
    },
    {
      id: "mrt-north-south-2b",
      name: "MRT North-South (Fase 2B) Line",
      code: {
        color: "#E31E24",
        short: "NS2B",
      },
      coordinates: {
        type: "LineString",
        coordinates: coordinates.mrtNorthSouth2BCoordinates,
      },
      isOperational: false,
      isUnderConstruction: true,
    },
    {
      id: "mrt-east-west-3",
      name: "MRT East-West (Fase 3) Line",
      code: {
        color: "#00B4D8",
        short: "EW3",
      },
      coordinates: {
        type: "MultiLineString",
        coordinates: coordinates.mrtEastWest3Coordinates,
      },
      isOperational: false,
      isUnderConstruction: true,
    },
  ],
};
