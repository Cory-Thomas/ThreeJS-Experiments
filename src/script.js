import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**
 * Debug
 */
const gui = new dat.GUI();
gui.hide();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const colorTexture = textureLoader.load('/textures/metal_grill/basecolor.jpg');
const ambientOcclusionTexture = textureLoader.load(
  '/textures/metal_grill/ambientOcclusion.jpg'
);
const heightTexture = textureLoader.load('/textures/metal_grill/height.png');
const normalTexture = textureLoader.load('/textures/metal_grill/normal.jpg');
const metallicTexture = textureLoader.load('/textures/metal_grill/normal.jpg');
const roughnessTexture = textureLoader.load(
  '/textures/metal_grill/roughness.jpg'
);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.1;
material.map = colorTexture;
material.aoMap = ambientOcclusionTexture;
material.aoMapIntensity = 3;
material.bumpMap = heightTexture;
material.normalMap = normalTexture;
material.normalScale.set(1, 1);
material.transparent = true;
material.metalnessMap = metallicTexture;
material.roughnessMap = roughnessTexture;

gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(10).step(0.0001);
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001);
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001);

const box = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5, 160, 160, 160),
  material
);
box.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(box.geometry.attributes.uv.array, 2)
);

scene.add(box);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 6;
scene.add(pointLight);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 7;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  box.rotation.y = 0.1 * elapsedTime;
  box.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
