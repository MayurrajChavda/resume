const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight,1,1000);
camera.position.z = 50;


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function createSphere(radius, widthSegments, heightSegments, color, xPosition) {
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: color });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = xPosition;
    return sphere;
}

function createPlane(width, height, rotationX, sphere) {
    const planeGeometry = new THREE.PlaneGeometry(width, height);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = rotationX;
    plane.add(sphere);
    return plane;
}

const sun = createSphere(1, 32, 32, '#ffff00', 0);
scene.add(sun);

const sphere1 = createSphere(0.1, 32, 32, '#BEBEBE', 3);
const plane1 = createPlane(10, 10, Math.PI / 1.9, sphere1);
scene.add(plane1);

const sphere2 = createSphere(0.26, 32, 32, '#EEDC82', 5);
const plane2 = createPlane(10, 10, Math.PI / 1.9, sphere2);
scene.add(plane2);

const sphere3 = createSphere(0.26, 32, 32, '#0000FF', 7);
const plane3 = createPlane(10, 10, Math.PI / 1.9, sphere3);
scene.add(plane3);

const sphere4 = createSphere(0.14, 32, 32, '#FF4500', 9);
const plane4 = createPlane(10, 10, Math.PI / 1.9, sphere4);
scene.add(plane4);

const sphere5 = createSphere(0.4, 32, 32, '#FFD700', 11);
const plane5 = createPlane(10, 10, Math.PI / 1.9, sphere5);
scene.add(plane5);

const sphere6 = createSphere(0.3, 32, 32, '#FFDAB9', 13);
const plane6 = createPlane(10, 10, Math.PI / 1.9, sphere6);
scene.add(plane6);

const sphere7 = createSphere(0.22, 32, 32, '#00FFFF', 15);
const plane7 = createPlane(10, 10, Math.PI / 1.9, sphere7);
scene.add(plane7);

const sphere8 = createSphere(0.2, 32, 32, '#4169E1', 17);
const plane8 = createPlane(10, 10, Math.PI / 1.9, sphere8);
scene.add(plane8);

const sphere9 = createSphere(0.06, 32, 32, '#A9A9A9', 19);
const plane9 = createPlane(10, 10, Math.PI / 1.9, sphere9);
scene.add(plane9);

function animate() {
    requestAnimationFrame(animate);
    plane1.rotation.z += 0.0017;
    plane2.rotation.z += 0.0004;
    plane3.rotation.z += 0.01;
    plane4.rotation.z += 0.005;
    plane5.rotation.z += 0.0082;
    plane6.rotation.z += 0.0074;
    plane7.rotation.z += 0.003;
    plane8.rotation.z += 0.003;
    plane9.rotation.z += 0.0028;
    renderer.render(scene, camera);
}

animate();

