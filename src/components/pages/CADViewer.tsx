import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../store/appStore';
import { Box, ZoomIn, ZoomOut, Maximize, ChevronRight, ChevronDown, Move } from 'lucide-react';
import { MOTOR_COMPONENTS } from '../../data/sampleData';
import { cn } from '../../lib/utils';
import { PartCategory } from '../../types';

// Using Three.js from CDN as requested
declare global {
  interface Window {
    THREE: any;
  }
}

export function CADViewer() {
  const { state } = useApp();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isExploded, setIsExploded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'root': true });

  const sceneRef = useRef<any>(null);
  const meshesRef = useRef<Record<string, any>>({});
  const pivotRef = useRef<any>(null);

  useEffect(() => {
    // Inject Three.js script if not present
    if (!window.THREE) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => initThree();
      document.head.appendChild(script);
    } else {
      initThree();
    }

    return () => {
      // Cleanup
      if (sceneRef.current) {
        // Simple cleanup
      }
    };
  }, []);

  const initThree = () => {
    if (!canvasRef.current || !window.THREE) return;
    const THREE = window.THREE;
    
    setIsLoaded(true);

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF8FAFC);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    canvasRef.current.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(8, 12, 8);
    scene.add(mainLight);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xF1F5F9, 0.3));

    // Grid
    const grid = new THREE.GridHelper(10, 20, 0xE2E8F0, 0xE2E8F0);
    grid.position.y = -2.5;
    scene.add(grid);

    // Assembly Pivot Root
    const pivot = new THREE.Group();
    pivotRef.current = pivot;
    scene.add(pivot);

    // Simple Geometry Factories
    const createMesh = (geo: any, color: number, name: string) => {
      const mat = new THREE.MeshPhongMaterial({ color, shininess: 10 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.name = name;
      return mesh;
    };

    // Build Motor Mocks
    // Frame
    const frameGeo = new THREE.CylinderGeometry(3, 3, 4.5, 32);
    const frame = createMesh(frameGeo, 0x94A3B8, 'EMA-001');
    pivot.add(frame);
    meshesRef.current['EMA-001'] = frame;

    // Stator
    const statorGeo = new THREE.CylinderGeometry(2.55, 2.55, 4, 32);
    const stator = createMesh(statorGeo, 0x1E3A5F, 'EMA-002');
    pivot.add(stator);
    meshesRef.current['EMA-002'] = stator;

    // Rotor
    const rotorGeo = new THREE.CylinderGeometry(1.85, 1.85, 4.2, 32);
    const rotor = createMesh(rotorGeo, 0x64748B, 'EMA-004');
    pivot.add(rotor);
    meshesRef.current['EMA-004'] = rotor;

    // Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.27, 0.27, 8, 16);
    const shaft = createMesh(shaftGeo, 0xCBD5E1, 'EMA-006');
    shaft.rotation.z = Math.PI / 2;
    pivot.add(shaft);
    meshesRef.current['EMA-006'] = shaft;

    // Bearings
    const bearingGeo = new THREE.TorusGeometry(0.82, 0.21, 16, 32);
    const bDE = createMesh(bearingGeo, 0xD97706, 'EMA-007');
    bDE.position.x = 3.3;
    bDE.rotation.y = Math.PI / 2;
    pivot.add(bDE);
    meshesRef.current['EMA-007'] = bDE;

    const bNDE = createMesh(bearingGeo, 0xD97706, 'EMA-008');
    bNDE.position.x = -3.3;
    bNDE.rotation.y = Math.PI / 2;
    pivot.add(bNDE);
    meshesRef.current['EMA-008'] = bNDE;

    // Controls Logic (Manual as requested)
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let theta = 0.3;
    let phi = 1.1;
    let radius = 14;

    const updateCamera = () => {
      camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(0, 0, 0);
    };

    const onMouseDown = (e: any) => { isDragging = true; prevX = e.clientX; prevY = e.clientY; };
    const onMouseMove = (e: any) => {
      if (!isDragging) return;
      theta -= (e.clientX - prevX) * 0.008;
      phi = Math.max(0.2, Math.min(2.4, phi - (e.clientY - prevY) * 0.008));
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e: any) => {
      radius = Math.max(5, Math.min(22, radius + e.deltaY * 0.008));
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);

    const animate = () => {
      requestAnimationFrame(animate);
      if (!isDragging) {
        theta += 0.002;
      }
      
      // Rotation animation for rotor
      if (meshesRef.current['EMA-004']) {
        meshesRef.current['EMA-004'].rotation.y += 0.004;
      }

      updateCamera();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!canvasRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
  };

  const toggleExploded = () => {
    setIsExploded(!isExploded);
    const THREE = window.THREE;
    if (!THREE) return;

    // Simulation of exploded view lerping targets
    const targets: Record<string, [number, number, number]> = {
      'EMA-001': [7, 0, 0],
      'EMA-002': [0, 4.5, 0],
      'EMA-004': [0, -4.5, 0],
      'EMA-006': [0, 0, 0],
      'EMA-007': [6.5, 0, 0],
      'EMA-008': [-6.5, 0, 0]
    };

    // In a real implementation we'd lerp inside the animation loop
    // For this prototype, we'll snap or use simple mock logic
    Object.entries(meshesRef.current).forEach(([id, mesh]) => {
      if (isExploded) {
        (mesh as any).position.set(id === 'EMA-007' ? 3.3 : id === 'EMA-008' ? -3.3 : 0, 0, 0);
      } else {
        const t = targets[id];
        if (t) (mesh as any).position.set(...t);
      }
    });
  };

  const getCategoryColor = (cat?: PartCategory) => {
    switch (cat) {
      case PartCategory.MANUFACTURED: return 'bg-blue-500';
      case PartCategory.PURCHASED: return 'bg-purple-500';
      case PartCategory.FASTENER: return 'bg-amber-500';
      case PartCategory.CONSUMABLE: return 'bg-orange-500';
      case PartCategory.FLOOR_STOCK: return 'bg-slate-400';
      default: return 'bg-slate-300';
    }
  };

  const selectedPart = MOTOR_COMPONENTS.find(p => p.id === selectedId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">CAD Assembly Structure Viewer</h2>
        <p className="text-sm text-slate-500">Engineering assembly hierarchy and 3D component visualization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[600px]">
        {/* Left Panel: Tree */}
        <div className="lg:col-span-4 flex flex-col h-full bg-white border border-slate-200 rounded-lg">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Engineering BOM Tree</h3>
            <span className="bg-slate-100 px-1.5 rounded text-[10px] font-bold">25 COMPONENTS</span>
          </div>
          
          <div className="overflow-y-auto flex-1 p-4 space-y-1">
            {MOTOR_COMPONENTS.slice(0, 10).map((part) => (
              <div 
                key={part.id}
                onClick={() => setSelectedId(part.id)}
                className={cn(
                  "border border-slate-100 rounded-md p-2 flex items-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all",
                  selectedId === part.id && "ring-2 ring-blue-500 border-blue-400 bg-blue-50"
                )}
              >
                <div className={cn("w-1 h-6 rounded", getCategoryColor(part.category))} title={part.category} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-blue-700 font-bold bg-blue-50 px-1 rounded">{part.partNumber}</span>
                    <span className="text-xs font-medium text-slate-700 truncate">{part.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={cn("w-1.5 h-1.5 rounded-full", getCategoryColor(part.category).replace('bg-', 'bg-'))} />
                    <span className="text-[10px] text-slate-400">Qty: {part.quantity}</span>
                  </div>
                </div>
                {part.level < 3 && <ChevronRight className="w-3 h-3 text-slate-400" />}
              </div>
            ))}
          </div>

          {selectedPart && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
                <div><p className="text-slate-400">PART NUMBER</p><p className="font-mono font-bold text-blue-700">{selectedPart.partNumber}</p></div>
                <div><p className="text-slate-400">MATERIAL</p><p className="font-bold">{selectedPart.material}</p></div>
                <div><p className="text-slate-400">WEIGHT</p><p className="font-bold">{selectedPart.weight} kg</p></div>
                <div><p className="text-slate-400">REVISION</p><p className="font-bold">{selectedPart.revision}</p></div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Three.js */}
        <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden relative">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button onClick={toggleExploded} className="btn-secondary py-1 text-[10px] bg-white/90 backdrop-blur">
              {isExploded ? 'Assembly View' : 'Exploded View'}
            </button>
            <button onClick={() => {}} className="btn-secondary py-1 text-[10px] bg-white/90 backdrop-blur">Reset Camera</button>
          </div>
          
          <div className="absolute top-4 right-4 z-10 space-y-2">
            <button className="p-1.5 bg-white border border-slate-200 rounded-md shadow-sm block"><ZoomIn className="w-4 h-4 text-slate-500" /></button>
            <button className="p-1.5 bg-white border border-slate-200 rounded-md shadow-sm block"><ZoomOut className="w-4 h-4 text-slate-500" /></button>
            <button className="p-1.5 bg-white border border-slate-200 rounded-md shadow-sm block"><Move className="w-4 h-4 text-slate-500" /></button>
          </div>

          <div ref={canvasRef} className="flex-1 w-full" />

          {/* Footer Metrics */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex items-center gap-8 justify-center">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Assembly Weight</p>
                <p className="text-sm font-semibold">28.52 kg</p>
              </div>
              <div className="h-4 w-[1px] bg-slate-200" />
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Heaviest Part</p>
                <p className="text-sm font-semibold text-slate-700">Motor Frame (12.5 kg)</p>
              </div>
              <div className="h-4 w-[1px] bg-slate-200" />
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Material Count</p>
                <p className="text-sm font-semibold">9 Types</p>
              </div>
            </div>
            
            <div className="mt-4 flex gap-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
              <div className="h-full bg-blue-500" style={{ width: '45%' }} />
              <div className="h-full bg-purple-500" style={{ width: '25%' }} />
              <div className="h-full bg-amber-500" style={{ width: '15%' }} />
              <div className="h-full bg-orange-500" style={{ width: '10%' }} />
              <div className="h-full bg-slate-400" style={{ width: '5%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
