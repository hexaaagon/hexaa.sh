"use client";

import "leaflet/dist/leaflet.css";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import {
  krlTransportation,
  mrtTransportation,
} from "@/constants/blog/jakarta-transport";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false },
);

// Jakarta coordinates
const JAKARTA_CENTER: [number, number] = [-6.2088, 106.8456];
const DESKTOP_ZOOM = 13;
const MOBILE_ZOOM = 12;

export function JakartaTransportMap({
  adjustCenter = false,
  isMobile = false,
}: {
  adjustCenter?: boolean;
  isMobile?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const zoomLevel = isMobile ? MOBILE_ZOOM : DESKTOP_ZOOM;
  const [zoom, setZoom] = useState(zoomLevel);
  const [selectedLine, setSelectedLine] = useQueryState("line", {
    defaultValue: "",
  });

  // Adjust map center for desktop layout (when blog panel is on the left)
  const mapCenter: [number, number] = adjustCenter
    ? [JAKARTA_CENTER[0] + 0.01, JAKARTA_CENTER[1] - 0.06] // Shift east more to compensate for left panel
    : [JAKARTA_CENTER[0] + 0.03, JAKARTA_CENTER[1] - 0.02];

  useEffect(() => {
    // Fix for Leaflet default marker icon in Next.js
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    }
  }, []);

  return (
    <div className="size-full overflow-hidden" data-smoothcursor-prevent>
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        ref={(mapInstance) => {
          if (mapInstance) {
            mapInstance.on("zoomend", () => {
              setZoom(mapInstance.getZoom());
            });
            // Clear selection when clicking on map background
            mapInstance.on("click", () => {
              setSelectedLine("");
            });
          }
        }}
      >
        <TileLayer
          url={
            resolvedTheme === "dark"
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          }
          attribution={
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://gis-dpmptsp.jakarta.go.id/">DPMPTSP Jakarta</a>'
          }
        />

        {/* KRL Lines */}
        {krlTransportation.lines.map((line) => {
          const coords = line.coordinates.coordinates as any[];
          const lineStrings =
            Array.isArray(coords) && Array.isArray(coords[0]?.[0])
              ? (coords as Array<Array<[number, number]>>)
              : ([coords] as Array<Array<[number, number]>>);

          const lineKey = `krl-${line.id}`;
          const isHovered = hoveredLine === lineKey;
          const isSelected = selectedLine === line.id;
          const isDimmed =
            (hoveredLine !== null || (selectedLine && selectedLine !== "")) &&
            !isHovered &&
            !isSelected;

          // Calculate weight with zoom-based hit area
          const baseWeight = 3;
          const displayWeight = isHovered || isSelected ? 5 : baseWeight;
          const zoomFactor = Math.max(1, 12 - zoom);
          const hitAreaWeight = baseWeight + zoomFactor * 3;

          return (
            <React.Fragment key={lineKey}>
              {lineStrings.map((lineCoords, idx) => {
                const latLngs = lineCoords.map(
                  (coord) => [coord[1], coord[0]] as [number, number],
                );
                const segmentKey = `${lineKey}-${lineCoords[0]?.[0]}-${lineCoords[0]?.[1]}-${idx}`;
                return (
                  <React.Fragment key={segmentKey}>
                    {/* Invisible hit area */}
                    <Polyline
                      positions={latLngs}
                      pathOptions={{
                        color: line.code.color,
                        weight: hitAreaWeight,
                        opacity: 0,
                      }}
                      bubblingMouseEvents={false}
                      eventHandlers={{
                        mouseover: () => setHoveredLine(lineKey),
                        mouseout: () => setHoveredLine(null),
                        click: (e) => {
                          e.originalEvent.stopPropagation();
                          setSelectedLine(line.id);
                        },
                      }}
                    />
                    {/* Visible line */}
                    <Polyline
                      positions={latLngs}
                      pathOptions={{
                        color: line.code.color,
                        weight: displayWeight,
                        opacity: isDimmed
                          ? 0.2
                          : isHovered || isSelected
                            ? 1
                            : 0.7,
                      }}
                      bubblingMouseEvents={false}
                      interactive={false}
                    />
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}

        {/* MRT Lines */}
        {mrtTransportation.lines.map((line) => {
          const coords = line.coordinates.coordinates as any[];
          const lineStrings =
            Array.isArray(coords) && Array.isArray(coords[0]?.[0])
              ? (coords as Array<Array<[number, number]>>)
              : ([coords] as Array<Array<[number, number]>>);

          const lineKey = `mrt-${line.id}`;
          const isHovered = hoveredLine === lineKey;
          const isSelected = selectedLine === line.id;
          const isDimmed =
            (hoveredLine !== null || (selectedLine && selectedLine !== "")) &&
            !isHovered &&
            !isSelected;

          // Calculate weight with zoom-based hit area
          const baseWeight = 4;
          const displayWeight = isHovered || isSelected ? 6 : baseWeight;
          const zoomFactor = Math.max(1, 12 - zoom);
          const hitAreaWeight = baseWeight + zoomFactor * 3;

          return (
            <React.Fragment key={lineKey}>
              {lineStrings.map((lineCoords, idx) => {
                const latLngs = lineCoords.map(
                  (coord) => [coord[1], coord[0]] as [number, number],
                );
                const segmentKey = `${lineKey}-${lineCoords[0]?.[0]}-${lineCoords[0]?.[1]}-${idx}`;
                return (
                  <React.Fragment key={segmentKey}>
                    {/* Invisible hit area */}
                    <Polyline
                      positions={latLngs}
                      pathOptions={{
                        color: line.code.color,
                        weight: hitAreaWeight,
                        opacity: 0,
                      }}
                      bubblingMouseEvents={false}
                      eventHandlers={{
                        mouseover: () => setHoveredLine(lineKey),
                        mouseout: () => setHoveredLine(null),
                        click: (e) => {
                          e.originalEvent.stopPropagation();
                          setSelectedLine(line.id);
                        },
                      }}
                    />
                    {/* Visible line */}
                    <Polyline
                      positions={latLngs}
                      pathOptions={{
                        color: line.code.color,
                        weight: displayWeight,
                        opacity: isDimmed
                          ? 0.2
                          : isHovered || isSelected
                            ? 1
                            : 0.8,
                        dashArray: line.isUnderConstruction
                          ? "5, 5"
                          : undefined,
                      }}
                      bubblingMouseEvents={false}
                      interactive={false}
                    />
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
