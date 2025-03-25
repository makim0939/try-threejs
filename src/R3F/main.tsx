import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import App from "./App.tsx";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
createRoot(root).render(
	<StrictMode>
		<Canvas style={{ height: "100vh", width: "100vw" }}>
			<App />
		</Canvas>
	</StrictMode>,
);
