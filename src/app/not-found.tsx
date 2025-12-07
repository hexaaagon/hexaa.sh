import NotFound from "./(partials)/error-pages/(template)/not-found/page";
import RootTemplate from "./(template)/template";

export default function NotFoundPage() {
  return (
    <RootTemplate>
      <NotFound />
    </RootTemplate>
  );
}
