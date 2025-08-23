"use client";
import store, { useStoreState } from "@/lib/store/social";
import { StoreProvider } from "easy-peasy";
import { useEffect } from "react";

function SocialCard() {
  const state = useStoreState((state) => state);

  return (
    <main className="flex flex-col gap-8">
      <section className="font-montreal-mono flex flex-col gap-4 text-xs *:overflow-x-scroll *:rounded-lg *:bg-black/10 *:p-4 *:px-8 *:dark:bg-black/20">
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </section>
    </main>
  );
}

export default function SocialCardProvider() {
  useEffect(() => {
    store.getActions().init();

    return () => {
      store.getActions().cleanup();
    };
  }, []);

  return (
    <StoreProvider store={store}>
      <SocialCard />
    </StoreProvider>
  );
}

// export function SpotifyCard({
//   className,
//   style,
//   discord,
//   ...props
// }: Omit<React.ComponentProps<"div">, "children"> & {
//   discord: LanyardWebsocket;
// }) {
//   // TODO: animating this thing
//   if (!discord.status) return <></>;
//
//   discord.status.spotify && discord.status.
//
//   return (
//     <div
//       className={cn("bg-cover", className)}
//       style={{
//         ...style,
//         backgroundImage: `url(${discord.status.spotify.album_art_url})`,
//       }}
//       {...props}
//     >
//       <div className="bg h-full w-full"></div>
//     </div>
//   );
// }
