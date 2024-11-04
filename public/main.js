document.addEventListener('DOMContentLoaded', () => {
  // Three.js scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x03061c);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 50);
  camera.lookAt(0, 0, 0);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Galaxy parameters
  const galaxyParams = {
    color: 0xaaaaaa,
    particleSize: 0.3,
    particleCount: 30000,
    discRadius: 12,
    centralBulgeRadius: 20,
    spread: 1,
    sizeVariation: 2.5,
  };

  // Background star parameters
  const starParams = {
    color: 0xffffff,
    particleSize: 0.2,
    particleCount: 5000,
    spread: 100,
  };

  // Function to create a circular texture for particles
  function createCircleTexture() {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // Create background stars
  const starsGeometry = new THREE.BufferGeometry();
  const starPositions = [];

  for (let i = 0; i < starParams.particleCount; i++) {
    const x = (Math.random() - 0.5) * starParams.spread;
    const y = (Math.random() - 0.5) * starParams.spread;
    const z = (Math.random() - 0.5) * starParams.spread;
    starPositions.push(x, y, z);
}

  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));

  const starsMaterial = new THREE.PointsMaterial({
    color: starParams.color,
    size: starParams.particleSize,
    map: createCircleTexture(),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  });

  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);


  // Galaxy particles geometry
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = [];
  const sizes = [];

  // Create particles for the galaxy disc with a denser, bulging center
  for (let i = 0; i < galaxyParams.particleCount; i++) {
    let radius, tilt, angle;

    if (Math.random() < 0.3) {
      radius = Math.pow(Math.random(), 0.5) * galaxyParams.centralBulgeRadius; // Bulge center
    } else {
      radius = galaxyParams.discRadius * (Math.pow(Math.random(), 0.5) * galaxyParams.spread); // Disc edge
    }

    angle = Math.random() * Math.PI * 2;
    tilt = (Math.random() - 0.5) * (Math.PI / 25); // Disc thickness

    positions.push(
      Math.cos(angle) * radius,
      Math.sin(tilt) * radius * 0.3, // Compressed for disc shape
      Math.sin(angle) * radius
    );

    sizes.push(galaxyParams.particleSize * (0.5 + Math.random() * galaxyParams.sizeVariation)); // Size variation
  }

  particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 0.5));

  // Galaxy material using the circular texture
  const particlesMaterial = new THREE.PointsMaterial({
    color: galaxyParams.color,
    size: galaxyParams.particleSize,
    map: createCircleTexture(),
    blending: THREE.AdditiveBlending,
    transparent: true,
  });

  // Create galaxy points mesh
  const galaxy = new THREE.Points(particlesGeometry, particlesMaterial);
  // scene.add(galaxy);
  
  // Load the Earth texture (replace with a URL to an Earth texture image)
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('/images/earth-texture.jpg');

  // Create Earth geometry and material
  const earthRadius = 15;
  const earthGeometry = new THREE.SphereGeometry(earthRadius, 32, 32);
  const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });

  // Create Earth mesh
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earth.rotation.y = THREE.MathUtils.degToRad(23.5);
  earth.position.set(0, -5, 20);
  scene.add(earth);

  // Lighting for the Earth
  const earthLight = new THREE.PointLight(0xffffff, 3);
  earthLight.position.set(0, 100, 50);
  scene.add(earthLight);


  // Animation function
  function animate() {
    requestAnimationFrame(animate);
    galaxy.rotation.y += 0.0005;
    stars.rotation.x += 0.00001;
    stars.rotation.y -= 0.00001;
    earth.rotation.y += 0.0007;
    renderer.render(scene, camera);
  }

  // Listen to window resize events
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Start animation
  animate();
})
