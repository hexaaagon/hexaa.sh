"use client";

import "leaflet/dist/leaflet.css";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import {
  krlTransportation,
  mrtTransportation,
} from "@/constants/blog/jakarta-transport";
import { useMapSelection } from "@/lib/store/map-selection-store";

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
const ZOOM_LEVEL = 11;

export function JakartaTransportMap() {
  const { resolvedTheme } = useTheme();
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [zoom, setZoom] = useState(ZOOM_LEVEL);
  const { selectedLine, setSelectedLine } = useMapSelection();

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
    <div className="w-full space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <h2 className="mb-2 font-semibold text-xl">
          Jakarta Transportation Map
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="mb-2 font-semibold">KRL Lines (Solid)</h3>
            <div className="space-y-1">
              {krlTransportation.lines.map((line) => {
                const lineKey = `krl-${line.id}`;
                const isSelected = selectedLine === lineKey;
                return (
                  <button
                    key={line.id}
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2 text-left transition-opacity hover:opacity-80"
                    onClick={() => setSelectedLine(lineKey)}
                  >
                    <div
                      className="h-3 w-6 rounded"
                      style={{ backgroundColor: line.code.color }}
                    />
                    <span className={isSelected ? "font-bold text-xl" : ""}>
                      {line.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">MRT Lines</h3>
            <div className="space-y-1">
              {mrtTransportation.lines.map((line) => {
                const lineKey = `mrt-${line.id}`;
                const isSelected = selectedLine === lineKey;
                return (
                  <button
                    key={line.id}
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2 text-left transition-opacity hover:opacity-80"
                    onClick={() => setSelectedLine(lineKey)}
                  >
                    <div
                      className="h-3 w-6 rounded"
                      style={{
                        backgroundColor: line.code.color,
                        backgroundImage: line.isUnderConstruction
                          ? "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,.1) 2px, rgba(0,0,0,.1) 4px)"
                          : undefined,
                      }}
                    />
                    <span className={isSelected ? "font-bold" : ""}>
                      {line.name}
                      {line.isUnderConstruction && " (Under Construction)"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        className="w-full overflow-hidden rounded-lg border"
        style={{ height: "600px" }}
        data-smoothcursor-prevent
      >
        <MapContainer
          center={JAKARTA_CENTER}
          zoom={ZOOM_LEVEL}
          style={{ height: "600px", width: "100%" }}
          zoomControl={true}
          ref={(mapInstance) => {
            if (mapInstance) {
              mapInstance.on("zoomend", () => {
                setZoom(mapInstance.getZoom());
              });
              // Clear selection when clicking on map background
              mapInstance.on("click", () => {
                setSelectedLine(null);
              });
            }
          }}
        >
          <TileLayer
            url={
              resolvedTheme === "dark"
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution={
              resolvedTheme === "dark"
                ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
            const isSelected = selectedLine === lineKey;
            const isDimmed =
              (hoveredLine !== null || selectedLine !== null) &&
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
                            setSelectedLine(lineKey);
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
            const isSelected = selectedLine === lineKey;
            const isDimmed =
              (hoveredLine !== null || selectedLine !== null) &&
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
                            setSelectedLine(lineKey);
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
    </div>
  );
}
