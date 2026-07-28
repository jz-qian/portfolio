const darkModeToggle = document.getElementById('darkModeToggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const body = document.body;

// Three.js 3D Wireframe Blob
let scene, camera, renderer, blob, mouse;

function initBlob() {
    // Scene setup
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const canvas = document.getElementById('blob-canvas');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create blob geometry
    const geometry = new THREE.IcosahedronGeometry(4, 3);
    const material = new THREE.MeshBasicMaterial({
        color: 0x6BA5D9,
        wireframe: true,
        transparent: true,
        opacity: 1.0
    });

    blob = new THREE.Mesh(geometry, material);
    blob.position.y = 2.5;

    scene.add(blob);

    // Mouse tracking
    mouse = { x: 0, y: 0 };

    // Handle dark mode color
    updateBlobColor();

    animate();
}

function updateBlobColor() {
    if (blob) {
        const isDark = document.body.classList.contains('dark-mode');
        // blob.material.opacity = isDark ? 0.4 : 0.3;
        blob.material.color.setHex(0x6BA5D9);
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Morph blob vertices
    const time = Date.now() * 0.001;
    const positions = blob.geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);

        // Create morphing effect
        const noise = Math.sin(x * 2 + time) * 0.15 +
            Math.cos(y * 2 + time * 0.8) * 0.15 +
            Math.sin(z * 2 + time * 1.2) * 0.15;

        const length = Math.sqrt(x * x + y * y + z * z);
        const normalizedX = x / length;
        const normalizedY = y / length;
        const normalizedZ = z / length;

        positions.setXYZ(
            i,
            normalizedX * (2 + noise),
            normalizedY * (2 + noise),
            normalizedZ * (2 + noise)
        );
    }

    positions.needsUpdate = true;

    // React to mouse position
    blob.rotation.x += (mouse.y * 0.3 - blob.rotation.x) * 0.05;
    blob.rotation.y += (mouse.x * 0.3 - blob.rotation.y) * 0.05;

    // Continuous gentle rotation
    blob.rotation.z += 0.001;

    renderer.render(scene, camera);
}

// Mouse move tracking
document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Initialize blob on load
window.addEventListener('load', initBlob);

// Dark mode
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
    body.classList.add('dark-mode');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'flex';
}

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);

    // Toggle icon visibility
    if (isDark) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'flex';
    } else {
        sunIcon.style.display = 'flex';
        moonIcon.style.display = 'none';
    }

    // Update blob color
    updateBlobColor();
});

// Modal Management - Static HTML approach
const folders = document.querySelectorAll('.folder');
const allModals = document.querySelectorAll('.modal');
const modalCloseButtons = document.querySelectorAll('.modal-close');
const navButtons = document.querySelectorAll('.modal-nav .nav-button');

// Open modal when folder is clicked
folders.forEach(folder => {
    folder.addEventListener('click', () => {
        const projectId = folder.dataset.project;
        openModal(projectId);
    });
});

// Close modal buttons
modalCloseButtons.forEach(button => {
    button.addEventListener('click', closeModal);
});

// Navigation buttons
navButtons.forEach(button => {
    if (button.dataset.target) {
        button.addEventListener('click', () => {
            const targetProject = button.dataset.target;
            closeAllModals();
            openModal(targetProject);
        });
    }
});

function openModal(projectId) {
    const modal = document.getElementById(`modal-${projectId}`);
    if (modal) {
        closeAllModals();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.scrollTop = 0;
    }
}

function closeModal() {
    closeAllModals();
}

function closeAllModals() {
    allModals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const activeModal = document.querySelector('.modal.active');

    if (e.key === 'Escape' && activeModal) {
        closeModal();
    }
});

// Close modal when clicking outside
allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log('Portfolio loaded successfully!');
