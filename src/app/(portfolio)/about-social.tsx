// "use client"; - social api info section is currently broken. disabled for now.
// import store, { useStoreState } from "@/lib/store/social";

function SocialSectionComponent() {
  // const _state = useStoreState((state) => state);

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 font-montreal-mono text-xs *:overflow-x-scroll *:rounded-lg *:bg-black/10 *:p-4 *:px-8 *:dark:bg-black/20"></div>
    </section>
  );
}

export default function SocialSection() {
  // useEffect(() => {
  //   store.getActions().init();
  //
  //   return () => {
  //     store.getActions().cleanup();
  //   };
  // }, []);

  return (
    // <StoreProvider store={store}>
    <SocialSectionComponent />
    // </StoreProvider>
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
