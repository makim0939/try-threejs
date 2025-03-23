import { THREEx } from "@ar-js-org/ar.js-threejs";
import type {
	IArToolkitContext,
	IArToolkitSource,
} from "@ar-js-org/ar.js-threejs/types/CommonInterfaces/THREEx-interfaces";
import * as THREE from "three";
import { type GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const PATTERN_PATH = "./pattern-marker.patt";
const MODEL_PATH = "./avatar_wavinghand_v6.glb";

export const arjs = () => {
	let w: number;
	let h: number;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;

	let arToolkitSource: IArToolkitSource;
	let arToolkitContext: IArToolkitContext;

	function init() {
		w = window.innerWidth;
		h = window.innerHeight;
		setScene();
		setCamera();
		setObject();
		setArToolkit();
		setRenderer();
	}

	const setScene = () => {
		scene = new THREE.Scene();
		scene.visible = false;
	};

	const setCamera = () => {
		camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 30);
		scene.add(camera);
	};

	const setArToolkit = () => {
		//ArToolkitSourceの初期化
		const onReady = () => {
			setTimeout(() => {
				onResize();
			}, 2000);
		};
		const onError = (error: unknown) => {
			console.log(error);
		};
		arToolkitSource = new THREEx.ArToolkitSource({
			sourceType: "webcam",
			sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480,
			sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640,
		});
		arToolkitSource.init(onReady, onError);

		//ArToolkitContextの初期化
		arToolkitContext = new THREEx.ArToolkitContext({
			detectionMode: "mono",
			cameraParametersUrl: `${THREEx.ArToolkitContext.baseURL}../data/data/camera_para.dat`,
			patternRatio: 0.5,
		});

		arToolkitContext.init(() => {
			camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
		});

		// const onRenderFcts = [];
		// onRenderFcts.push(() => {
		// 	if (arToolkitSource.ready === false) return;
		// 	arToolkitContext.update(arToolkitSource.domElement);
		// 	scene.visible = camera.visible;
		// });

		// ArMarkerControlsを設定
		const markerControls = new THREEx.ArMarkerControls(
			arToolkitContext,
			camera,
			{
				type: "pattern",
				patternUrl: PATTERN_PATH,
				changeMatrixMode: "cameraTransformMatrix",
			},
		);
	};

	const setObject = () => {
		const ambientLight = new THREE.AmbientLight(0xffffff, 1);
		ambientLight.position.set(0, 10, 0);
		const directionalLight = new THREE.DirectionalLight(0xffffd0, 1);
		directionalLight.position.set(0, 10, 0);
		scene.add(ambientLight);
		scene.add(directionalLight);

		//gltfファイルの読み込み
		const loader = new GLTFLoader();
		let mixer: THREE.AnimationMixer;
		//gltfロード用の関数を宣言
		const onGltfLoad = (gltf: GLTF) => {
			const model = gltf.scene;

			model.traverse((child) => {
				const setPolygonOffsetFactor = (
					child: THREE.Object3D<THREE.Object3DEventMap>,
					factor: number,
				) => {
					if (!(child instanceof THREE.Mesh)) return;
					child.material.polygonOffset = true;
					child.material.polygonOffsetFactor = factor;
				};
				const setPolygonOffsetUnits = (
					child: THREE.Object3D<THREE.Object3DEventMap>,
					units: number,
				) => {
					if (!(child instanceof THREE.Mesh)) return;
					child.material.polygonOffset = true;
					child.material.polygonOffsetUnits = units;
				};

				if (child instanceof THREE.Mesh) {
					child.material.depthWrite = true;
					// child.material.depthTest = true;
					child.material.polygonOffset = true;
					if (child.name === "Hair") {
						setPolygonOffsetFactor(child, -1.0);
						setPolygonOffsetUnits(child, -1.0);
					}
					if (child.name === "Tops") {
						setPolygonOffsetFactor(child, -0.7);
						setPolygonOffsetUnits(child, -0.5);
					}
					if (child.name === "Bottoms") {
						setPolygonOffsetFactor(child, -0.25);
						setPolygonOffsetUnits(child, -0.25);
					}

					if (child.name === "Body_1") {
						//body
						setPolygonOffsetFactor(child, 1.25);
						setPolygonOffsetUnits(child, 0.75);
					}
					if (child.name === "Body_2") {
						//face
						setPolygonOffsetFactor(child, 0.5);
						setPolygonOffsetUnits(child, 1.0);
					}
					if (child.name === "Body_3") {
						//eye
						setPolygonOffsetFactor(child, 0.25);
						setPolygonOffsetUnits(child, 0.25);
					}
				}
			});

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
		loader.load(MODEL_PATH, onGltfLoad, onGltfProgress, onGltfError);

		const clock = new THREE.Clock();
		clock.getElapsedTime();
		function tick() {
			const deltaTime = clock.getDelta();
			if (mixer) {
				mixer.update(deltaTime);
			}
			window.requestAnimationFrame(tick);
		}
		tick();
	};

	const setRenderer = () => {
		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
		});
		renderer.setClearColor(0x000000, 0);
		renderer.setSize(w, h);
		renderer.setPixelRatio(window.devicePixelRatio);
		document.body.appendChild(renderer.domElement);

		renderer.setAnimationLoop(() => {
			render();
		});
	};

	const render = () => {
		if (arToolkitSource.ready) {
			arToolkitContext.update(arToolkitSource.domElement);
			scene.visible = camera.visible;
		}
		renderer.render(scene, camera);
	};

	const onResize = () => {
		arToolkitSource.onResizeElement();
		arToolkitSource.copyElementSizeTo(renderer.domElement);
		if (arToolkitContext.arController !== null) {
			arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
		}
	};

	window.addEventListener("resize", () => {
		onResize();
	});

	window.onload = () => {
		init();
	};
};
