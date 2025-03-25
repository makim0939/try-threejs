import { PerspectiveCamera } from "@react-three/drei";
import type * as THREE from "three";
import "./App.css";
import { useEffect, useRef } from "react";
import { FirstDemo } from "./components/01_firstDemo";
import ImportGltf from "./components/02_importGltf";

function App() {
	const cameraRef = useRef<THREE.PerspectiveCamera>(null);
	useEffect(() => {
		if (!cameraRef.current) return;
		cameraRef.current.lookAt(0, 1, 0);
	});

	return (
		<>
			<PerspectiveCamera
				ref={cameraRef}
				makeDefault // デフォルトカメラとして設定
				position={[0, 2, 5]}
				fov={75}
				near={0.1}
				far={1000}
			/>
			{/* <FirstDemo /> */}
			<ImportGltf />
		</>
	);
}

export default App;
