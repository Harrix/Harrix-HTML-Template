import * as THREE from "three";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function isDarkTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function getSceneBg() {
  return isDarkTheme() ? 0x1a1a1a : 0xf0f0f0;
}

function getLoadErrorMessage() {
  const lang = document.documentElement.lang;
  if (lang === "ru") {
    return "Не удалось загрузить 3D-модель.";
  }
  return "Failed to load 3D model.";
}

function isSafeStlUrl(raw) {
  try {
    const url = new URL(raw, window.location.href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    if (url.origin !== window.location.origin) return false;
    if (!url.pathname.toLowerCase().endsWith(".stl")) return false;
    return true;
  } catch {
    return false;
  }
}

function setMessage(container, html) {
  container.textContent = "";
  const p = document.createElement("p");
  p.className = "h-stl-viewer__message";
  p.innerHTML = html;
  container.appendChild(p);
}

function initViewer(container) {
  const src = container.getAttribute("data-src");
  if (!src) return;

  if (window.location.protocol === "file:") {
    container.classList.add("h-stl-viewer--no-fetch");
    setMessage(container, getNoFetchMessage());
    return;
  }

  if (!isSafeStlUrl(src)) {
    container.classList.add("h-stl-viewer--load-error");
    setMessage(container, getLoadErrorMessage());
    return;
  }

  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(getSceneBg());

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(1.2, 1.2, 1.2);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);
  const directional = new THREE.DirectionalLight(0xffffff, 0.85);
  directional.position.set(1.5, 2, 1.5);
  directional.castShadow = true;
  directional.shadow.mapSize.width = 1024;
  directional.shadow.mapSize.height = 1024;
  directional.shadow.camera.near = 0.1;
  directional.shadow.camera.far = 5;
  directional.shadow.camera.left = -1.5;
  directional.shadow.camera.right = 1.5;
  directional.shadow.camera.top = 1.5;
  directional.shadow.camera.bottom = -1.5;
  directional.shadow.bias = -0.0001;
  scene.add(directional);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
  fillLight.position.set(-1, 0.5, -0.5);
  scene.add(fillLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  let stopped = false;

  const loader = new STLLoader();
  loader.load(
    src,
    (geometry) => {
      geometry.rotateX(-Math.PI / 2);
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
        specular: 0x333333,
        shininess: 120,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    },
    undefined,
    (err) => {
      stopped = true;
      container.classList.add("h-stl-viewer--load-error");
      setMessage(container, getLoadErrorMessage());
      // console.* is dropped in production builds; keep this only for development visibility.
      console.error("STL load error:", err);
    }
  );

  function animate() {
    if (stopped) return;
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

function getNoFetchMessage() {
  const lang = document.documentElement.lang;
  if (lang === "ru") {
    return 'Для просмотра 3D-модели откройте страницу через веб-сервер (например, <code>npm run start</code>). При открытии файла напрямую (file://) загрузка STL блокируется браузером.';
  }
  return 'To view the 3D model, open the page via a web server (e.g. <code>npm run start</code>). Opening the file directly (file://) blocks STL loading in the browser.';
}

document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".h-stl-viewer");
  const cleanups = [];
  containers.forEach((el) => {
    const cleanup = initViewer(el);
    if (cleanup) cleanups.push({ el, cleanup, reinit: null });
  });

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === "data-theme") {
        containers.forEach((el) => {
          const canvas = el.querySelector("canvas");
          if (!canvas) return;
          const entry = cleanups.find((c) => c.el === el);
          if (entry) {
            entry.cleanup();
            const newCleanup = initViewer(el);
            if (newCleanup) entry.cleanup = newCleanup;
          }
        });
        break;
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
});
