import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const orbitControls = () => {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		0.1,
		1000,
	);
	camera.position.set(0, 0, 5);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);

	const controls = new OrbitControls(camera, renderer.domElement);
	//慣性を有効にする
	controls.enableDamping = true;
	controls.dampingFactor = 0.2;

	scene.add(cube);

	function animate() {
		requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera);
	}
	animate();
	return;
};
