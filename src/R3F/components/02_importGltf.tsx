import React from "react";
import { Avatar } from "./Avatar";

const ImportGltf = () => {
	return (
		<>
			<ambientLight intensity={Math.PI / 2} position={[0, 10, 0]} />
			<directionalLight position={[10, 10, 10]} intensity={1} />
			<Avatar />
			<mesh rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[2, 2, 2]} />
				<meshStandardMaterial color="skyblue" />
			</mesh>
		</>
	);
};

export default ImportGltf;
