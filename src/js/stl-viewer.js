import * as THREE from "three";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function initViewer(container) {
  const src = container.getAttribute("data-src");
  if (!src) return;

  if (window.location.protocol === "file:") {
    container.classList.add("h-stl-viewer--no-fetch");
    container.innerHTML =
      '<p class="h-stl-viewer__message">Для просмотра 3D-модели откройте страницу через веб-сервер (например, <code>npm run start</code>). При открытии файла напрямую (file://) загрузка STL блокируется браузером.</p>';
    return;
  }

  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, 0, 2);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(1, 1, 1);
  scene.add(directional);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const loader = new STLLoader();
  loader.load(
    src,
    (geometry) => {
      geometry.computeBoundingBox();
      const box = geometry.boundingBox;
      const center = new THREE.Vector3();
      box.getCenter(center);
      geometry.translate(-center.x, -center.y, -center.z);

      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.5 / maxDim;
      geometry.scale(scale, scale, scale);

      const material = new THREE.MeshPhongMaterial({
        color: 0x2196f3,
        specular: 0x111111,
        shininess: 200,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    },
    undefined,
    (err) => {
      console.error("STL load error:", err);
    }
  );

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(container);

  return () => {
    resizeObserver.disconnect();
    renderer.dispose();
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".h-stl-viewer");
  containers.forEach((el) => initViewer(el));
});
