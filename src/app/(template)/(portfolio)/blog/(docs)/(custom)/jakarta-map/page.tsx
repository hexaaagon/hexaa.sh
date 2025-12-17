"use client";
import { JakartaTransportMap } from "@/components/jakarta-transport-map";

export default function JakartaTransportMapPage() {
  return (
    <main className="relative min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="font-bold text-3xl tracking-tight">
            Jakarta Transportation Map
          </h1>
          <p className="mt-2 text-neutral-600">
            Explore the KRL commuter rail and MRT rapid transit lines across
            Jakarta
          </p>
        </div>
      </div>
      <JakartaTransportMap />
    </main>
  );
}
