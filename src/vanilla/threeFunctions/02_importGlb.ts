import * as THREE from "three";
import { type GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// ↓gltfファイルはimport(viteの静的ファイル読み込み)非対応
// import gltb_animation from "../assets/avatar_gltf_test_animation.glb";
// import gltb from "../assets/avatar_gltf_test.glb";

export const importGlb = () => {
	const scene = new THREE.Scene();
	//カメラの設定
	//fov: 視野角
	const fov = 60;
	const camera = new THREE.PerspectiveCamera(
		fov,
		window.innerWidth / window.innerHeight,
		0.1,
		1000,
	);
	camera.position.set(0, 3, 5);
	camera.lookAt(0, 1, 0);

	//ライトの追加
	const ambientLight = new THREE.AmbientLight(0xffffff, 1);
	ambientLight.position.set(0, 10, 0);
	const directionalLight = new THREE.DirectionalLight(0xffffd0, 1);
	directionalLight.position.set(0, 10, 0);
	scene.add(ambientLight);
	scene.add(directionalLight);

	//レンダラーの設定と配置
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	//gltfファイルの読み込み
	const loader = new GLTFLoader();
	let mixer: THREE.AnimationMixer;
	//gltfロード用の関数を宣言
	const onGltfLoad = (gltf: GLTF) => {
		const model = gltf.scene;
		model.scale.set(1, 1, 1);
		model.position.set(0, 0, 0);
		scene.add(model);
		//アニメーションミキサー（アニメーションプレイヤー）を作成
		mixer = new THREE.AnimationMixer(model);
		const action = mixer.clipAction(gltf.animations[0]);
		action.play();
	};
	const onGltfProgress = (progress: ProgressEvent) => {
		console.log(progress);
	};
	const onGltfError = (error: unknown) => {
		console.error(error);
	};
	loader.load(
		"/avatar_wavinghand.glb",
		// "/avatar_gltf_test_animation.glb",
		onGltfLoad,
		onGltfProgress,
		onGltfError,
	);

	const clock = new THREE.Clock();
	clock.getElapsedTime();
	function tick() {
		const deltaTime = clock.getDelta();
		if (mixer) {
			mixer.update(deltaTime);
		}
		renderer.render(scene, camera);
		window.requestAnimationFrame(tick);
	}
	tick();
	return;
};
