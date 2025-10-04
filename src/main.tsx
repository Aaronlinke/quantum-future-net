import { createRoot } from "react-dom/client";
import { AppRouter } from "./app/Router.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<AppRouter />);
