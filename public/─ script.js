// ===== AOS INIT =====
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
});

// ===== NAVIGATION =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const header = document.getElementById('header');

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active link & scroll shadow
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = 'hero';
    sections.forEach(sec => {
        const top = sec.offsetTop - 100;
        if (window.scrollY >= top) current = sec.id;
    });
    navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
    header.classList.toggle('scrolled', window.scrollY > 30);
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

function setTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', theme);
    currentTheme = theme;
}
setTheme(currentTheme);

themeToggle.addEventListener('click', () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// ===== 3D SCENE (Three.js) =====
(function init3D() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4, 2.5, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvas.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 8, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.6);
    fillLight.position.set(-3, 2, -4);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(-2, -1, 5);
    scene.add(rimLight);

    // Medical Cross
    const crossGroup = new THREE.Group();

    const vGeo = new THREE.BoxGeometry(0.6, 2.4, 0.6);
    const vMat = new THREE.MeshPhysicalMaterial({
        color: 0x2563eb,
        metalness: 0.1,
        roughness: 0.25,
        clearcoat: 0.3,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.08,
    });
    const vBar = new THREE.Mesh(vGeo, vMat);
    vBar.castShadow = true;
    crossGroup.add(vBar);

    const hGeo = new THREE.BoxGeometry(1.8, 0.6, 0.6);
    const hMat = new THREE.MeshPhysicalMaterial({
        color: 0x2563eb,
        metalness: 0.1,
        roughness: 0.25,
        clearcoat: 0.3,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.08,
    });
    const hBar = new THREE.Mesh(hGeo, hMat);
    hBar.position.y = 0.3;
    hBar.castShadow = true;
    crossGroup.add(hBar);

    const ringGeo = new THREE.TorusGeometry(1.3, 0.045, 24, 48);
    const ringMat = new THREE.MeshPhysicalMaterial({
        color: 0x60a5fa,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.7,
        metalness: 0.2,
        roughness: 0.1,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.15;
    crossGroup.add(ring);

    const ring2Geo = new THREE.TorusGeometry(1.5, 0.025, 16, 48);
    const ring2Mat = new THREE.MeshPhysicalMaterial({
        color: 0x93c5fd,
        emissive: 0x60a5fa,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.5,
        metalness: 0.1,
        roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.z = Math.PI / 3;
    ring2.rotation.x = Math.PI / 4;
    ring2.position.y = 0.15;
    crossGroup.add(ring2);

    const sphereGeo = new THREE.SphereGeometry(0.15, 20, 20);
    const sphereMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.6,
        metalness: 0.3,
        roughness: 0.1,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.y = 0.15;
    crossGroup.add(sphere);

    scene.add(crossGroup);

    // Particles
    const particlesGeo = new THREE.BufferGeometry();
    const count = 220;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r = 1.8 + Math.random() * 2.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 2;
        positions[i * 3] = Math.sin(theta) * Math.cos(phi) * r;
        positions[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * r * 0.6 + 0.15;
        positions[i * 3 + 2] = Math.cos(theta) * r;
        const c = new THREE.Color().setHSL(0.6 + Math.random() * 0.15, 0.6, 0.5 + Math.random() * 0.3);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const particles = new THREE.Points(particlesGeo, particleMat);
    scene.add(particles);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(6, 6);
    const floorMat = new THREE.MeshPhysicalMaterial({
        color: 0xe2e8f0,
        transparent: true,
        opacity: 0.15,
        metalness: 0.0,
        roughness: 1,
        side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.4;
    scene.add(floor);

    // Animation
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.008;

        crossGroup.rotation.y += 0.004;
        crossGroup.rotation.x = Math.sin(time * 0.3) * 0.04;
        crossGroup.rotation.z = Math.sin(time * 0.2) * 0.02;

        ring.material.opacity = 0.5 + Math.sin(time * 1.2) * 0.25;
        ring2.material.opacity = 0.35 + Math.sin(time * 0.9 + 1) * 0.2;

        const pos = particles.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
            const idx = i * 3;
            pos[idx + 1] += Math.sin(time * 0.6 + i) * 0.0006;
            pos[idx] += Math.sin(time * 0.4 + i * 0.7) * 0.0004;
            pos[idx + 2] += Math.cos(time * 0.5 + i * 0.5) * 0.0004;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }
    animate();

    // Resize
    function resize() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight || 420;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener('resize', resize);
    if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => resize());
        ro.observe(canvas);
    }
    setTimeout(resize, 100);

    // Update background on theme change
    const themeObserver = new MutationObserver(() => {
        const isDark = document.body.classList.contains('dark');
        scene.background = new THREE.Color(isDark ? 0x0f172a : 0xf1f5f9);
    });
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();

// ===== CONTACT FORM (API call) =====
const contactForm = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    feedback.textContent = 'Sending...';
    feedback.className = 'form-feedback';

    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (res.ok) {
            feedback.textContent = '✅ Message sent successfully!';
            feedback.className = 'form-feedback success';
            contactForm.reset();
        } else {
            feedback.textContent = '❌ ' + (result.error || 'Something went wrong.');
            feedback.className = 'form-feedback error';
        }
    } catch (err) {
        feedback.textContent = '❌ Network error. Please try again.';
        feedback.className = 'form-feedback error';
    }
});
