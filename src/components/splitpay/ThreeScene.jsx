import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0x1b1b3a, 2.5);
    scene.add(ambientLight);

    // Electric Lime Accent Point Light
    const limeLight = new THREE.PointLight(0xc6ff3d, 3, 50);
    limeLight.position.set(12, 10, 8);
    scene.add(limeLight);

    // Coral Accent Point Light
    const coralLight = new THREE.PointLight(0xff6b4a, 2, 40);
    coralLight.position.set(-12, -8, 6);
    scene.add(coralLight);

    // Blue Deep Depth Light
    const blueLight = new THREE.DirectionalLight(0x0082fb, 1.8);
    blueLight.position.set(0, -10, -5);
    scene.add(blueLight);

    // --- Floating 3D Geometric Objects (Fintech Nodes & Holographic Tokens) ---
    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Icosahedron Wireframe
    const icoGeometry = new THREE.IcosahedronGeometry(3.6, 1);
    const icoMaterial = new THREE.MeshStandardMaterial({
      color: 0xc6ff3d,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      roughness: 0.2,
      metalness: 0.8
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(7, 1, -2);
    group.add(icosahedron);

    // 2. Translucent Inner Core (Indigo/Navy)
    const coreGeo = new THREE.SphereGeometry(2.4, 32, 32);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x1b1b3a,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.4,
      transparent: true,
      opacity: 0.5
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(7, 1, -2);
    group.add(coreMesh);

    // 3. Floating 3D Coin Discs (Symbolizing Rupee / Split Units)
    const coins = [];
    const coinGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.15, 32);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xc6ff3d,
      roughness: 0.3,
      metalness: 0.85,
      emissive: 0x1b1b3a,
      emissiveIntensity: 0.4
    });

    const coinCoords = [
      { x: -8, y: 4, z: -4, rx: 0.5, ry: 0.3 },
      { x: 9, y: -5, z: -1, rx: -0.4, ry: 0.6 },
      { x: -6, y: -4, z: 2, rx: 0.8, ry: -0.2 },
      { x: 5, y: 6, z: -5, rx: 0.2, ry: 0.9 },
      { x: -10, y: 0, z: -3, rx: 0.6, ry: 0.4 }
    ];

    coinCoords.forEach((coord, i) => {
      const coin = new THREE.Mesh(coinGeo, coinMat.clone());
      coin.position.set(coord.x, coord.y, coord.z);
      coin.rotation.set(coord.rx, coord.ry, 0);
      coin.userData = {
        speedX: 0.005 + i * 0.002,
        speedY: 0.008 + i * 0.001,
        baseY: coord.y,
        offset: i * 1.2
      };
      group.add(coin);
      coins.push(coin);
    });

    // 4. 3D Glowing Particle Field (Network Constellation)
    const particleCount = 180;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 45;
      posArray[i + 1] = (Math.random() - 0.5) * 35;
      posArray[i + 2] = (Math.random() - 0.5) * 20;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xc6ff3d,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particlesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      targetX = mouseX * 1.5;
      targetY = -mouseY * 1.2;
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (targetY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Rotate central icosahedron
      icosahedron.rotation.x = elapsedTime * 0.2;
      icosahedron.rotation.y = elapsedTime * 0.25;

      // Animate floating coins
      coins.forEach((coin) => {
        coin.rotation.x += coin.userData.speedX;
        coin.rotation.y += coin.userData.speedY;
        coin.position.y = coin.userData.baseY + Math.sin(elapsedTime + coin.userData.offset) * 0.45;
      });

      // Subtle particle swirl
      particlesMesh.rotation.y = elapsedTime * 0.03;
      particlesMesh.rotation.x = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
      aria-hidden="true"
    />
  );
};

export default ThreeScene;
