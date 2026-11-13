import { createElement } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import { pageForPath, pages, type PageId } from "./pages/pages";

const container = document.getElementById("root")!;
const prerenderedPage = container.dataset.page as PageId | undefined;

if (prerenderedPage) {
  hydrateRoot(container, createElement(pages[prerenderedPage]));
} else {
  createRoot(container).render(
    createElement(pages[pageForPath(location.pathname)]),
  );
}
