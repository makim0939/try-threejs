// import { rotationCube } from "../threeFunctions/01_rotationCube";
// import { importGlb } from "../threeFunctions/02_importGlb";
// import { orbitControls } from "../threeFunctions/03_orbitControls";
import { arjs } from "./threeFunctions/04_arjs";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

// rotationCube();
// importGlb();
// orbitControls();
arjs();
