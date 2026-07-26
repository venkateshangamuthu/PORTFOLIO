/**
 * Venkatesh A - 3D Portfolio WebGL Scene Engine
 * Powered by Three.js
 */

(function () {
  'use strict';

  // Check if Three.js is loaded
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. 3D background disabled.');
    return;
  }

  const container = document.getElementById('canvas-container');
  if (!container) return;

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070913, 0.015);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 30;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Mouse / Touch interaction coordinates
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  // --- 1. PARTICLE CONSTELLATION ---
  const particlesCount = 1000;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  const sizes = new Float32Array(particlesCount);

  const color1 = new THREE.Color(0x06b6d4); // Cyan glow
  const color2 = new THREE.Color(0x8b5cf6); // Purple glow
  const color3 = new THREE.Color(0x3b82f6); // Blue glow

  for (let i = 0; i < particlesCount; i++) {
    // Position within a sphere boundary
    const radius = 60;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    // Color gradient interpolation
    const mixRatio = Math.random();
    const particleColor = mixRatio < 0.5 
      ? color1.clone().lerp(color2, mixRatio * 2)
      : color2.clone().lerp(color3, (mixRatio - 0.5) * 2);

    colors[i * 3] = particleColor.r;
    colors[i * 3 + 1] = particleColor.g;
    colors[i * 3 + 2] = particleColor.b;

    sizes[i] = Math.random() * 1.8 + 0.5;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Particle Material
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // --- 2. HERO 3D GEOMETRIC OBJECTS ---
  // A. Torus Knot (Main Futuristic Core)
  const torusKnotGeometry = new THREE.TorusKnotGeometry(5, 1.4, 120, 16, 2, 3);
  const torusKnotMaterial = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    wireframe: true,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x1e1b4b,
    emissiveIntensity: 0.6,
  });
  const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
  torusKnot.position.set(16, 2, -5);
  scene.add(torusKnot);

  // B. Wireframe Icosahedron (Floating secondary core)
  const icoGeometry = new THREE.IcosahedronGeometry(7, 1);
  const icoMaterial = new THREE.MeshPhongMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
  });
  const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
  icoMesh.position.set(-18, -8, -10);
  scene.add(icoMesh);

  // C. Small Floating Spheres/Octahedrons (Tech Orbs)
  const orbGroup = new THREE.Group();
  const orbGeometries = [
    new THREE.OctahedronGeometry(1.2, 0),
    new THREE.TetrahedronGeometry(1.5, 0),
    new THREE.DodecahedronGeometry(1.0, 0)
  ];

  const orbMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.9, roughness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.9, roughness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.9, roughness: 0.1 })
  ];

  const floatingOrbs = [];
  for (let i = 0; i < 15; i++) {
    const geo = orbGeometries[i % orbGeometries.length];
    const mat = orbMaterials[i % orbMaterials.length];
    const orb = new THREE.Mesh(geo, mat);

    orb.position.set(
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 30
    );

    orb.userData = {
      rotSpeedX: (Math.random() - 0.5) * 0.02,
      rotSpeedY: (Math.random() - 0.5) * 0.02,
      floatSpeed: Math.random() * 0.01 + 0.005,
      floatOffset: Math.random() * Math.PI * 2,
      initialY: orb.position.y
    };

    orbGroup.add(orb);
    floatingOrbs.push(orb);
  }
  scene.add(orbGroup);

  // --- 3. LIGHTING SYSTEM ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const pointLightCyan = new THREE.PointLight(0x06b6d4, 3, 50);
  pointLightCyan.position.set(10, 10, 10);
  scene.add(pointLightCyan);

  const pointLightPurple = new THREE.PointLight(0x8b5cf6, 3, 50);
  pointLightPurple.position.set(-10, -10, 10);
  scene.add(pointLightPurple);

  const mouseLight = new THREE.PointLight(0x38bdf8, 2, 30);
  scene.add(mouseLight);

  // --- 4. EVENT LISTENERS ---
  function onPointerMove(event) {
    targetX = (event.clientX - windowHalfX) * 0.0015;
    targetY = (event.clientY - windowHalfY) * 0.0015;

    // Move interactive light
    const vec = new THREE.Vector3(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5
    );
    vec.unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    mouseLight.position.copy(pos);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('mousemove', onPointerMove, false);
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      onPointerMove(e.touches[0]);
    }
  }, false);
  window.addEventListener('resize', onWindowResize, false);

  // Scroll parallax effect
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // --- 5. ANIMATION LOOP ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth lerp mouse targets
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    // Rotate Torus Knot
    torusKnot.rotation.x = elapsedTime * 0.25;
    torusKnot.rotation.y = elapsedTime * 0.35 + mouseX * 2;
    torusKnot.position.y = 2 + Math.sin(elapsedTime * 1.5) * 0.8;

    // Rotate Icosahedron
    icoMesh.rotation.x = -elapsedTime * 0.15;
    icoMesh.rotation.y = elapsedTime * 0.2 + mouseY * 2;
    icoMesh.position.y = -8 + Math.cos(elapsedTime * 1.2) * 1.2;

    // Rotate Particle System & Orbs
    particleSystem.rotation.y = elapsedTime * 0.03 + mouseX * 0.5;
    particleSystem.rotation.x = mouseY * 0.5;

    floatingOrbs.forEach(orb => {
      orb.rotation.x += orb.userData.rotSpeedX;
      orb.rotation.y += orb.userData.rotSpeedY;
      orb.position.y = orb.userData.initialY + Math.sin(elapsedTime * 2 + orb.userData.floatOffset) * 0.6;
    });

    // Camera movement based on mouse & scroll
    camera.position.x += (mouseX * 12 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 12 - (scrollY * 0.01) - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();
})();
