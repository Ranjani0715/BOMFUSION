import React, { useEffect, useRef, useState } from 'react';
import { ComponentItem } from '../types';

declare const THREE: any;

interface CADCanvasProps {
  isExploded: boolean;
  selectedPartId: string | null;
  components: ComponentItem[];
  onSelectPart: (partId: string) => void;
  onResetCameraTrigger?: number;
}

interface ProjectedLabel {
  id: string;
  name: string;
  x: number;
  y: number;
}

export const CADCanvas: React.FC<CADCanvasProps> = ({
  isExploded,
  selectedPartId,
  components,
  onSelectPart,
  onResetCameraTrigger = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [labels, setLabels] = useState<ProjectedLabel[]>([]);

  // Internal Three.js references
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const meshesRef = useRef<Record<string, { mesh: any; origPos: any; expPos: any; origColor: number }>>({});
  const rotorMeshRef = useRef<any>(null);
  const fanGroupRef = useRef<any>(null);

  // Camera spherical coordinates
  const cameraStateRef = useRef({
    radius: 14,
    theta: 0.3,
    phi: 1.1,
    targetRadius: 14,
    targetTheta: 0.3,
    targetPhi: 1.1,
    isDragging: false,
    prevX: 0,
    prevY: 0,
  });

  // Setup Three.js scene
  useEffect(() => {
    if (!containerRef.current || typeof THREE === 'undefined') return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xf8fafc, 1);
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(8, 12, 8);
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xf1f5f9, 0.3);
    scene.add(hemiLight);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(10, 20, 0xe2e8f0, 0xe2e8f0);
    gridHelper.position.y = -2.5;
    scene.add(gridHelper);

    // Mesh definitions mapping component IDs
    const meshes: Record<string, { mesh: any; origPos: any; expPos: any; origColor: number }> = {};

    // 1. Motor Frame EMA-001
    const frameGeo = new THREE.CylinderGeometry(3, 3, 4.5, 32);
    const frameMat = new THREE.MeshPhongMaterial({ color: 0x94a3b8, transparent: true, opacity: 1 });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    scene.add(frameMesh);
    meshes['EMA-001'] = {
      mesh: frameMesh,
      origPos: new THREE.Vector3(0, 0, 0),
      expPos: new THREE.Vector3(7, 0, 0),
      origColor: 0x94a3b8,
    };

    // 2. Stator Core EMA-002
    const statorGeo = new THREE.CylinderGeometry(2.55, 2.55, 4, 32);
    const statorMat = new THREE.MeshPhongMaterial({ color: 0x1e3a5f, transparent: true, opacity: 1 });
    const statorMesh = new THREE.Mesh(statorGeo, statorMat);
    scene.add(statorMesh);
    meshes['EMA-002'] = {
      mesh: statorMesh,
      origPos: new THREE.Vector3(0, 0, 0),
      expPos: new THREE.Vector3(0, 4.5, 0),
      origColor: 0x1e3a5f,
    };

    // 3. Rotor Core EMA-004
    const rotorGeo = new THREE.CylinderGeometry(1.85, 1.85, 4.2, 32);
    const rotorMat = new THREE.MeshPhongMaterial({ color: 0x64748b, transparent: true, opacity: 1 });
    const rotorMesh = new THREE.Mesh(rotorGeo, rotorMat);
    scene.add(rotorMesh);
    rotorMeshRef.current = rotorMesh;
    meshes['EMA-004'] = {
      mesh: rotorMesh,
      origPos: new THREE.Vector3(0, 0, 0),
      expPos: new THREE.Vector3(0, -4.5, 0),
      origColor: 0x64748b,
    };

    // 4. Shaft EMA-006
    const shaftGeo = new THREE.CylinderGeometry(0.27, 0.27, 8, 16);
    shaftGeo.rotateZ(Math.PI / 2);
    const shaftMat = new THREE.MeshPhongMaterial({ color: 0xcbd5e1, transparent: true, opacity: 1 });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    scene.add(shaftMesh);
    meshes['EMA-006'] = {
      mesh: shaftMesh,
      origPos: new THREE.Vector3(0, 0, 0),
      expPos: new THREE.Vector3(0, 0, 0),
      origColor: 0xcbd5e1,
    };

    // 5. Bearing DE EMA-007
    const bearingDEGeo = new THREE.TorusGeometry(0.82, 0.21, 16, 32);
    bearingDEGeo.rotateY(Math.PI / 2);
    const bearingDEMat = new THREE.MeshPhongMaterial({ color: 0xd97706, transparent: true, opacity: 1 });
    const bearingDEMesh = new THREE.Mesh(bearingDEGeo, bearingDEMat);
    bearingDEMesh.position.set(3.3, 0, 0);
    scene.add(bearingDEMesh);
    meshes['EMA-007'] = {
      mesh: bearingDEMesh,
      origPos: new THREE.Vector3(3.3, 0, 0),
      expPos: new THREE.Vector3(6.5, 0, 0),
      origColor: 0xd97706,
    };

    // 6. Bearing NDE EMA-008
    const bearingNDEGeo = new THREE.TorusGeometry(0.82, 0.21, 16, 32);
    bearingNDEGeo.rotateY(Math.PI / 2);
    const bearingNDEMat = new THREE.MeshPhongMaterial({ color: 0xd97706, transparent: true, opacity: 1 });
    const bearingNDEMesh = new THREE.Mesh(bearingNDEGeo, bearingNDEMat);
    bearingNDEMesh.position.set(-3.3, 0, 0);
    scene.add(bearingNDEMesh);
    meshes['EMA-008'] = {
      mesh: bearingNDEMesh,
      origPos: new THREE.Vector3(-3.3, 0, 0),
      expPos: new THREE.Vector3(-6.5, 0, 0),
      origColor: 0xd97706,
    };

    // 7. End Shield DE EMA-009
    const shieldDEGeo = new THREE.CylinderGeometry(2.85, 2.85, 0.3, 32);
    shieldDEGeo.rotateZ(Math.PI / 2);
    const shieldDEMat = new THREE.MeshPhongMaterial({ color: 0xe2e8f0, transparent: true, opacity: 1 });
    const shieldDEMesh = new THREE.Mesh(shieldDEGeo, shieldDEMat);
    shieldDEMesh.position.set(2.3, 0, 0);
    scene.add(shieldDEMesh);
    meshes['EMA-009'] = {
      mesh: shieldDEMesh,
      origPos: new THREE.Vector3(2.3, 0, 0),
      expPos: new THREE.Vector3(4.5, 0, 0),
      origColor: 0xe2e8f0,
    };

    // 8. End Shield NDE EMA-010
    const shieldNDEGeo = new THREE.CylinderGeometry(2.85, 2.85, 0.3, 32);
    shieldNDEGeo.rotateZ(Math.PI / 2);
    const shieldNDEMat = new THREE.MeshPhongMaterial({ color: 0xe2e8f0, transparent: true, opacity: 1 });
    const shieldNDEMesh = new THREE.Mesh(shieldNDEGeo, shieldNDEMat);
    shieldNDEMesh.position.set(-2.3, 0, 0);
    scene.add(shieldNDEMesh);
    meshes['EMA-010'] = {
      mesh: shieldNDEMesh,
      origPos: new THREE.Vector3(-2.3, 0, 0),
      expPos: new THREE.Vector3(-4.5, 0, 0),
      origColor: 0xe2e8f0,
    };

    // 9. Cooling Fan EMA-011
    const fanGroup = new THREE.Group();
    fanGroup.position.set(-4.1, 0, 0);
    const bladeGeo = new THREE.BoxGeometry(0.2, 1.7, 0.07);
    const bladeMat = new THREE.MeshPhongMaterial({ color: 0x93c5fd, transparent: true, opacity: 1 });
    for (let i = 0; i < 6; i++) {
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.rotation.x = i * (Math.PI / 3);
      fanGroup.add(blade);
    }
    scene.add(fanGroup);
    fanGroupRef.current = fanGroup;
    meshes['EMA-011'] = {
      mesh: fanGroup,
      origPos: new THREE.Vector3(-4.1, 0, 0),
      expPos: new THREE.Vector3(-8, 0, 0),
      origColor: 0x93c5fd,
    };

    // 10. Fan Cover EMA-012
    const coverGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.85, 16);
    coverGeo.rotateZ(Math.PI / 2);
    const coverMat = new THREE.MeshPhongMaterial({
      color: 0x94a3b8,
      wireframe: true,
      transparent: true,
      opacity: 1,
    });
    const coverMesh = new THREE.Mesh(coverGeo, coverMat);
    coverMesh.position.set(-3.7, 0, 0);
    scene.add(coverMesh);
    meshes['EMA-012'] = {
      mesh: coverMesh,
      origPos: new THREE.Vector3(-3.7, 0, 0),
      expPos: new THREE.Vector3(-7, 0, 0),
      origColor: 0x94a3b8,
    };

    // 11. Terminal Box EMA-013
    const boxGeo = new THREE.BoxGeometry(1.2, 0.85, 0.85);
    const boxMat = new THREE.MeshPhongMaterial({ color: 0x1d4ed8, transparent: true, opacity: 1 });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.position.set(0, 3.3, 0);
    scene.add(boxMesh);
    meshes['EMA-013'] = {
      mesh: boxMesh,
      origPos: new THREE.Vector3(0, 3.3, 0),
      expPos: new THREE.Vector3(0, 6, 0),
      origColor: 0x1d4ed8,
    };

    meshesRef.current = meshes;

    // Animation loop
    let animFrameId: number;
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      const st = cameraStateRef.current;

      // Auto-rotate camera if not dragging
      if (!st.isDragging) {
        st.theta += 0.002;
      }

      // Smooth camera spherical coordinate lerp
      const cX = st.radius * Math.sin(st.phi) * Math.cos(st.theta);
      const cY = st.radius * Math.cos(st.phi);
      const cZ = st.radius * Math.sin(st.phi) * Math.sin(st.theta);
      camera.position.set(cX, cY, cZ);
      camera.lookAt(0, 0, 0);

      // Rotate rotor & fan blades
      if (rotorMeshRef.current) {
        rotorMeshRef.current.rotation.y += 0.004;
      }
      if (fanGroupRef.current) {
        fanGroupRef.current.rotation.x += 0.02;
      }

      // Lerp mesh positions based on explosion state
      const targetKey = isExploded ? 'expPos' : 'origPos';
      Object.keys(meshesRef.current).forEach((id) => {
        const item = meshesRef.current[id];
        if (item) {
          const target = item[targetKey];
          item.mesh.position.lerp(target, 0.06);
        }
      });

      renderer.render(scene, camera);

      // Project 2D labels if exploded
      if (isExploded && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const projected: ProjectedLabel[] = [];

        Object.keys(meshesRef.current).forEach((id) => {
          const item = meshesRef.current[id];
          const comp = components.find((c) => c.id === id);
          if (comp && item) {
            const tempV = item.mesh.position.clone();
            tempV.project(camera);
            const x = (tempV.x * 0.5 + 0.5) * rect.width;
            const y = (-(tempV.y * 0.5) + 0.5) * rect.height;

            if (tempV.z < 1) {
              projected.push({ id: comp.id, name: comp.name, x, y });
            }
          }
        });

        setLabels(projected);
      } else {
        setLabels([]);
      }
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
    };
  }, []);

  // Update selected part materials
  useEffect(() => {
    Object.keys(meshesRef.current).forEach((id) => {
      const item = meshesRef.current[id];
      if (!item) return;

      const isSelected = selectedPartId === id;
      const isAnySelected = selectedPartId !== null;

      if (item.mesh.material) {
        if (isSelected) {
          item.mesh.material.color.setHex(0x2563eb);
          item.mesh.material.opacity = 1.0;
        } else if (isAnySelected) {
          item.mesh.material.color.setHex(item.origColor);
          item.mesh.material.opacity = 0.15;
        } else {
          item.mesh.material.color.setHex(item.origColor);
          item.mesh.material.opacity = 1.0;
        }
      }
    });
  }, [selectedPartId]);

  // Reset camera trigger
  useEffect(() => {
    if (onResetCameraTrigger > 0) {
      cameraStateRef.current.radius = 14;
      cameraStateRef.current.theta = 0.3;
      cameraStateRef.current.phi = 1.1;
    }
  }, [onResetCameraTrigger]);

  // Manual Trackball Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    cameraStateRef.current.isDragging = true;
    cameraStateRef.current.prevX = e.clientX;
    cameraStateRef.current.prevY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const st = cameraStateRef.current;
    if (!st.isDragging) return;

    const deltaX = e.clientX - st.prevX;
    const deltaY = e.clientY - st.prevY;
    st.prevX = e.clientX;
    st.prevY = e.clientY;

    st.theta -= deltaX * 0.008;
    // clamp phi between 0.2 and 2.4 to prevent camera flipping
    st.phi = Math.max(0.2, Math.min(2.4, st.phi - deltaY * 0.008));
  };

  const handleMouseUp = () => {
    cameraStateRef.current.isDragging = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const st = cameraStateRef.current;
    st.radius = Math.max(5, Math.min(22, st.radius + e.deltaY * 0.008));
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden"
    >
      {/* 2D Projected Overlay Labels for Exploded View */}
      {isExploded &&
        labels.map((lbl) => (
          <div
            key={lbl.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPart(lbl.id);
            }}
            style={{
              left: `${lbl.x}px`,
              top: `${lbl.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute bg-white/90 backdrop-blur-xs border border-slate-300 rounded px-2 py-0.5 text-[10px] font-mono font-medium text-slate-800 shadow-xs cursor-pointer hover:border-blue-500 hover:text-blue-700 pointer-events-auto"
          >
            <span className="font-semibold text-blue-700">{lbl.id}</span>: {lbl.name}
          </div>
        ))}
    </div>
  );
};
