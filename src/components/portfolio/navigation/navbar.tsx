import NavbarClient from "./navbar.client";
import { labs } from "@/lib/source";

export default function Navbar() {
  return <NavbarClient tree={labs.pageTree} />;
}
