import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Play, Pause, RotateCcw, Box, Eye, Layers, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

interface ThreeSceneProps {
  modelType: 'handling' | 'sorting' | 'robot' | 'torno';
  title?: string;
}

// Module-level scratch variables to prevent GC in render loop (Per Three.js skill)
const _vec3 = new THREE.Vector3();

export const ThreeScene: React.FC<ThreeSceneProps> = ({ modelType, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [controlsCollapsed, setControlsCollapsed] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'front' | 'top'>('iso');

  // Zoom action callbacks for UI buttons
  const zoomInRef = useRef<(() => void) | null>(null);
  const zoomOutRef = useRef<(() => void) | null>(null);

  // Mutable refs for animation loop
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);
  const wireframeRef = useRef(wireframe);
  const isExplodedRef = useRef(isExploded);
  const requestResetRef = useRef(false);
  const presetRef = useRef(cameraPreset);

  isPlayingRef.current = isPlaying;
  speedRef.current = speed;
  wireframeRef.current = wireframe;
  isExplodedRef.current = isExploded;
  presetRef.current = cameraPreset;

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Detect software WebGL per Three.js skill
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 2. Setup Scene and Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Deep industrial slate

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4, 3.2, 4.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig (Key directional + Cool Hemisphere + Studio Rim)
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 1.2);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    keyLight.position.set(5, 7, 4);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 25;
      keyLight.shadow.camera.left = -4;
      keyLight.shadow.camera.right = 4;
      keyLight.shadow.camera.top = 4;
      keyLight.shadow.camera.bottom = -4;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // Ground Grid & Contact Shadow Grounding
    const gridHelper = new THREE.GridHelper(10, 20, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    const shadowPlaneGeo = new THREE.PlaneGeometry(6, 6);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.005;
    scene.add(shadowMesh);

    // Procedural Industrial Materials Library
    const mats = {
      aluminum: new THREE.MeshStandardMaterial({
        color: 0xd4d4d8,
        metalness: 0.85,
        roughness: 0.25,
      }),
      darkMetal: new THREE.MeshStandardMaterial({
        color: 0x27272a,
        metalness: 0.9,
        roughness: 0.3,
      }),
      festoBlue: new THREE.MeshStandardMaterial({
        color: 0x0284c7, // Festo signature blue
        metalness: 0.4,
        roughness: 0.35,
      }),
      robotWhite: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9, // Mitsubishi arm clean industrial white
        metalness: 0.25,
        roughness: 0.4,
      }),
      latheRed: new THREE.MeshStandardMaterial({
        color: 0xdc2626, // EMCO lathe signature red
        metalness: 0.3,
        roughness: 0.35,
      }),
      brassGold: new THREE.MeshStandardMaterial({
        color: 0xeab308,
        metalness: 0.95,
        roughness: 0.2,
      }),
      conveyorBlack: new THREE.MeshStandardMaterial({
        color: 0x18181b,
        metalness: 0.1,
        roughness: 0.85,
      }),
      workpieceMetal: new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.9,
        roughness: 0.2,
      }),
      workpiecePlastic: new THREE.MeshStandardMaterial({
        color: 0xef4444, // Red plastic test piece
        metalness: 0.05,
        roughness: 0.5,
      }),
      ledGreen: new THREE.MeshBasicMaterial({ color: 0x22c55e }),
      ledRed: new THREE.MeshBasicMaterial({ color: 0xef4444 }),
      glassShield: new THREE.MeshPhysicalMaterial({
        color: 0x93c5fd,
        transmission: isSoftwareGl ? 0 : 0.85,
        transparent: true,
        opacity: isSoftwareGl ? 0.4 : 0.9,
        roughness: 0.1,
        ior: 1.5,
      }),
    };

    // Root model group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Dynamic animators holder
    const animators: Array<(time: number, delta: number, speed: number) => void> = [];
    const explodables: Array<{ mesh: THREE.Object3D; basePos: THREE.Vector3; explodeDir: THREE.Vector3 }> = [];

    // Helper to register parts for exploded view
    const registerExplode = (mesh: THREE.Object3D, explodeDir: THREE.Vector3) => {
      explodables.push({
        mesh,
        basePos: mesh.position.clone(),
        explodeDir: explodeDir.clone(),
      });
    };

    // ==========================================
    // 1. MODEL: MPS DE SELECCIÓN (HANDLING)
    // ==========================================
    if (modelType === 'handling') {
      const handlingGroup = new THREE.Group();

      // Aluminium base profile (slotted table)
      const baseGeo = new THREE.BoxGeometry(3.6, 0.12, 1.8);
      const baseMesh = new THREE.Mesh(baseGeo, mats.aluminum);
      baseMesh.position.y = 0.06;
      baseMesh.receiveShadow = true;
      handlingGroup.add(baseMesh);

      // Grooves on table
      for (let i = -0.7; i <= 0.7; i += 0.25) {
        const grooveGeo = new THREE.BoxGeometry(3.6, 0.02, 0.04);
        const groove = new THREE.Mesh(grooveGeo, mats.darkMetal);
        groove.position.set(0, 0.125, i);
        handlingGroup.add(groove);
      }

      // Festo DGE-25 Rodless Linear Drive (X-Axis rail)
      const railGroup = new THREE.Group();
      railGroup.position.set(0, 1.1, 0);

      const railBeamGeo = new THREE.BoxGeometry(2.8, 0.14, 0.12);
      const railBeam = new THREE.Mesh(railBeamGeo, mats.aluminum);
      railBeam.castShadow = true;
      railGroup.add(railBeam);

      // Festo blue end caps and brackets
      const endCapGeo = new THREE.BoxGeometry(0.12, 0.18, 0.16);
      const leftCap = new THREE.Mesh(endCapGeo, mats.festoBlue);
      leftCap.position.set(-1.4, 0, 0);
      railGroup.add(leftCap);

      const rightCap = new THREE.Mesh(endCapGeo, mats.festoBlue);
      rightCap.position.set(1.4, 0, 0);
      railGroup.add(rightCap);

      // Vertical support columns
      const colGeo = new THREE.BoxGeometry(0.12, 0.98, 0.12);
      const leftCol = new THREE.Mesh(colGeo, mats.aluminum);
      leftCol.position.set(-1.25, -0.55, 0);
      railGroup.add(leftCol);

      const rightCol = new THREE.Mesh(colGeo, mats.aluminum);
      rightCol.position.set(1.25, -0.55, 0);
      railGroup.add(rightCol);

      // Travelling Carriage (Eje X)
      const carriage = new THREE.Group();
      const carriageBodyGeo = new THREE.BoxGeometry(0.32, 0.2, 0.22);
      const carriageBody = new THREE.Mesh(carriageBodyGeo, mats.aluminum);
      carriageBody.castShadow = true;
      carriage.add(carriageBody);

      // Festo DZF Guided Cylinder (Eje Z - vertical descent)
      const zCylGroup = new THREE.Group();
      zCylGroup.position.set(0, -0.15, 0.12);

      const zBodyGeo = new THREE.BoxGeometry(0.14, 0.45, 0.12);
      const zBody = new THREE.Mesh(zBodyGeo, mats.aluminum);
      zBody.castShadow = true;
      zCylGroup.add(zBody);

      const zBlueLabel = new THREE.Mesh(new THREE.BoxGeometry(0.145, 0.12, 0.08), mats.festoBlue);
      zBlueLabel.position.y = 0.05;
      zCylGroup.add(zBlueLabel);

      // Piston rod descending
      const pistonGroup = new THREE.Group();
      const rodGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 16);
      const rod = new THREE.Mesh(rodGeo, mats.aluminum);
      rod.position.y = -0.15;
      pistonGroup.add(rod);

      // Festo pneumatic parallel gripper
      const gripperBody = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.1), mats.aluminum);
      gripperBody.position.y = -0.32;
      pistonGroup.add(gripperBody);

      // Left finger
      const leftFinger = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.09, 0.03), mats.darkMetal);
      leftFinger.position.set(-0.04, -0.38, 0);
      pistonGroup.add(leftFinger);

      // Right finger
      const rightFinger = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.09, 0.03), mats.darkMetal);
      rightFinger.position.set(0.04, -0.38, 0);
      pistonGroup.add(rightFinger);

      zCylGroup.add(pistonGroup);
      carriage.add(zCylGroup);
      railGroup.add(carriage);
      handlingGroup.add(railGroup);

      // Pick & Place Workpiece
      const pieceGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.12, 24);
      const piece = new THREE.Mesh(pieceGeo, mats.workpieceMetal);
      piece.castShadow = true;
      handlingGroup.add(piece);

      // Input feeding magazine
      const magGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.4, 24, 1, true);
      const magMat = new THREE.MeshStandardMaterial({ color: 0x71717a, side: THREE.DoubleSide });
      const magazine = new THREE.Mesh(magGeo, magMat);
      magazine.position.set(-0.9, 0.32, 0.12);
      handlingGroup.add(magazine);

      // Output tray
      const trayGeo = new THREE.BoxGeometry(0.35, 0.06, 0.4);
      const tray = new THREE.Mesh(trayGeo, mats.festoBlue);
      tray.position.set(0.9, 0.15, 0.12);
      handlingGroup.add(tray);

      // Festo Valve Manifold with status LEDs
      const valveGroup = new THREE.Group();
      valveGroup.position.set(0, 0.18, -0.6);
      const manifold = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.16, 0.18), mats.darkMetal);
      valveGroup.add(manifold);

      const valveBlue = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.1), mats.festoBlue);
      valveBlue.position.y = 0.06;
      valveGroup.add(valveBlue);

      const led1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.03), mats.ledGreen);
      led1.position.set(-0.1, 0.1, 0);
      valveGroup.add(led1);

      const led2 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.03), mats.ledRed);
      led2.position.set(0.1, 0.1, 0);
      valveGroup.add(led2);
      handlingGroup.add(valveGroup);

      // Register exploded view offsets
      registerExplode(railBeam, new THREE.Vector3(0, 0.4, 0));
      registerExplode(carriage, new THREE.Vector3(0, 0.2, 0.3));
      registerExplode(zCylGroup, new THREE.Vector3(0, -0.2, 0.3));
      registerExplode(valveGroup, new THREE.Vector3(0, 0, -0.4));

      rootGroup.add(handlingGroup);

      // Kinetic Pick & Place animation
      animators.push((time, delta, spd) => {
        const cycle = ((time * spd * 0.4) % 1); // 0 to 1 cycle
        let targetX = -0.9;
        let targetZ = 0;
        let gripDist = 0.04;

        if (cycle < 0.2) {
          // 1. Descend at pick location (-0.9)
          targetX = -0.9;
          targetZ = -0.16 * (cycle / 0.2);
          gripDist = 0.04;
        } else if (cycle < 0.3) {
          // 2. Close gripper
          targetX = -0.9;
          targetZ = -0.16;
          gripDist = 0.025;
        } else if (cycle < 0.45) {
          // 3. Ascend with piece
          targetX = -0.9;
          targetZ = -0.16 * (1 - (cycle - 0.3) / 0.15);
          gripDist = 0.025;
        } else if (cycle < 0.65) {
          // 4. Move Carriage X from -0.9 to +0.9
          const progress = (cycle - 0.45) / 0.2;
          targetX = -0.9 + 1.8 * Math.sin((progress * Math.PI) / 2);
          targetZ = 0;
          gripDist = 0.025;
        } else if (cycle < 0.8) {
          // 5. Descend at place location (+0.9)
          targetX = 0.9;
          targetZ = -0.16 * ((cycle - 0.65) / 0.15);
          gripDist = 0.025;
        } else if (cycle < 0.9) {
          // 6. Release piece
          targetX = 0.9;
          targetZ = -0.16;
          gripDist = 0.04;
        } else {
          // 7. Ascend & return
          targetX = 0.9 * (1 - (cycle - 0.9) / 0.1) - 0.9 * ((cycle - 0.9) / 0.1);
          targetZ = -0.16 * (1 - (cycle - 0.9) / 0.1);
          gripDist = 0.04;
        }

        carriage.position.x = targetX;
        pistonGroup.position.y = targetZ;
        leftFinger.position.x = -gripDist;
        rightFinger.position.x = gripDist;

        // Piece tracking
        if (cycle >= 0.25 && cycle < 0.85) {
          piece.position.set(targetX, 1.1 + targetZ - 0.44, 0.12);
        } else if (cycle >= 0.85) {
          piece.position.set(0.9, 0.21, 0.12);
        } else {
          piece.position.set(-0.9, 0.21, 0.12);
        }

        // Valve LEDs toggle
        led1.visible = cycle < 0.5;
        led2.visible = cycle >= 0.5;
      });
    }

    // ==========================================
    // 2. MODEL: MPS DE POSICIONAMIENTO (SORTING)
    // ==========================================
    else if (modelType === 'sorting') {
      const sortingGroup = new THREE.Group();

      // Table base
      const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 2.0), mats.aluminum);
      baseMesh.position.y = 0.06;
      sortingGroup.add(baseMesh);

      // Conveyor Belt assembly
      const beltFrame = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.14, 0.35), mats.aluminum);
      beltFrame.position.set(0, 0.45, -0.1);
      beltFrame.castShadow = true;
      sortingGroup.add(beltFrame);

      const beltMat = mats.conveyorBlack.clone();
      const beltSurface = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.02, 0.3), beltMat);
      beltSurface.position.set(0, 0.53, -0.1);
      sortingGroup.add(beltSurface);

      // DC Motor Dunkermotoren 4610 with Transparent Encoder Cap
      const motorGroup = new THREE.Group();
      motorGroup.position.set(-1.4, 0.5, 0.25);

      const motorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 24), mats.aluminum);
      motorBody.rotation.x = Math.PI / 2;
      motorGroup.add(motorBody);

      // Worm gearbox
      const gearbox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.18), mats.darkMetal);
      gearbox.position.set(0, -0.12, -0.18);
      motorGroup.add(gearbox);

      // Encoder disc inside motor top
      const encoderDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 0.015, 32),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 })
      );
      encoderDisc.rotation.x = Math.PI / 2;
      encoderDisc.position.z = 0.2;
      motorGroup.add(encoderDisc);

      // Optical sensor fork over encoder
      const optoFork = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.04), mats.darkMetal);
      optoFork.position.set(0, 0.08, 0.2);
      motorGroup.add(optoFork);

      // Motor white cap
      const motorCap = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.1, 24), mats.robotWhite);
      motorCap.rotation.x = Math.PI / 2;
      motorCap.position.z = 0.24;
      motorGroup.add(motorCap);

      sortingGroup.add(motorGroup);

      // Inductive Sensor (barrel type)
      const indSensorGroup = new THREE.Group();
      indSensorGroup.position.set(-0.5, 0.65, 0.12);
      const indBody = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.2, 16), mats.aluminum);
      indBody.rotation.x = Math.PI / 2;
      indSensorGroup.add(indBody);
      const indBlueTip = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.04, 16), mats.festoBlue);
      indBlueTip.rotation.x = Math.PI / 2;
      indBlueTip.position.z = -0.1;
      indSensorGroup.add(indBlueTip);
      sortingGroup.add(indSensorGroup);

      // 3 Sorting Ramps
      const ramps: THREE.Group[] = [];
      const rampPositions = [-0.1, 0.5, 1.1];
      rampPositions.forEach((posX, idx) => {
        const rampGroup = new THREE.Group();
        rampGroup.position.set(posX, 0.42, 0.55);

        const rampBed = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.8), mats.aluminum);
        rampBed.rotation.x = 0.25; // Incline down
        rampGroup.add(rampBed);

        const leftGuide = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.8), mats.darkMetal);
        leftGuide.position.set(-0.11, 0.03, 0);
        leftGuide.rotation.x = 0.25;
        rampGroup.add(leftGuide);

        const rightGuide = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.8), mats.darkMetal);
        rightGuide.position.set(0.11, 0.03, 0);
        rightGuide.rotation.x = 0.25;
        rampGroup.add(rightGuide);

        sortingGroup.add(rampGroup);
        ramps.push(rampGroup);
      });

      // Pneumatic Diverters (Cilindros Desviadores Festo)
      const diverter1 = new THREE.Group();
      diverter1.position.set(-0.1, 0.58, -0.32);
      const div1Body = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.2), mats.aluminum);
      diverter1.add(div1Body);
      const div1Arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.02), mats.festoBlue);
      div1Arm.position.set(0, 0, 0.12);
      diverter1.add(div1Arm);
      sortingGroup.add(diverter1);

      const diverter2 = new THREE.Group();
      diverter2.position.set(0.5, 0.58, -0.32);
      const div2Body = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.2), mats.aluminum);
      diverter2.add(div2Body);
      const div2Arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.02), mats.festoBlue);
      div2Arm.position.set(0, 0, 0.12);
      diverter2.add(div2Arm);
      sortingGroup.add(diverter2);

      // AM1 / AM2 Amplifier cards on rail
      const am1 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.04), mats.robotWhite);
      am1.position.set(0.8, 0.2, -0.7);
      sortingGroup.add(am1);

      const am2 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.04), mats.robotWhite);
      am2.position.set(1.2, 0.2, -0.7);
      sortingGroup.add(am2);

      // Test pieces (Metallic piece vs Plastic red piece)
      const metalPiece = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 20), mats.workpieceMetal);
      metalPiece.castShadow = true;
      sortingGroup.add(metalPiece);

      const plasticPiece = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 20), mats.workpiecePlastic);
      plasticPiece.castShadow = true;
      sortingGroup.add(plasticPiece);

      // Register exploded offsets
      registerExplode(motorGroup, new THREE.Vector3(-0.4, 0.2, 0));
      registerExplode(diverter1, new THREE.Vector3(0, 0.2, -0.3));
      registerExplode(diverter2, new THREE.Vector3(0, 0.2, -0.3));
      registerExplode(ramps[0], new THREE.Vector3(0, 0, 0.3));

      rootGroup.add(sortingGroup);

      // Continuous animation
      animators.push((time, delta, spd) => {
        encoderDisc.rotation.z += delta * 8 * spd;

        const cycleTime = (time * spd * 0.5) % 1; // 0 to 1 loop

        // Metal piece trajectory: starts at -1.3, moves right, diverted at Ramp 1 (-0.1)
        if (cycleTime < 0.5) {
          const t = cycleTime / 0.5;
          if (t < 0.6) {
            // moving along belt
            metalPiece.position.set(-1.3 + t * 2.0, 0.58, -0.1);
            div1Arm.position.z = 0.12;
          } else {
            // Diverter 1 triggers and slides piece down ramp 1
            div1Arm.position.z = 0.24;
            const slideT = (t - 0.6) / 0.4;
            metalPiece.position.set(-0.1, 0.58 - slideT * 0.2, -0.1 + slideT * 0.7);
          }
        } else {
          metalPiece.position.set(-1.3, 0.58, -0.1);
        }

        // Plastic piece trajectory: starts slightly delayed, bypasses Ramp 1, diverted at Ramp 2 (0.5)
        const pCycle = ((time * spd * 0.5) + 0.5) % 1;
        if (pCycle < 0.7) {
          const t = pCycle / 0.7;
          if (t < 0.75) {
            plasticPiece.position.set(-1.3 + t * 2.4, 0.58, -0.1);
            div2Arm.position.z = 0.12;
          } else {
            div2Arm.position.z = 0.24;
            const slideT = (t - 0.75) / 0.25;
            plasticPiece.position.set(0.5, 0.58 - slideT * 0.2, -0.1 + slideT * 0.7);
          }
        } else {
          plasticPiece.position.set(-1.3, 0.58, -0.1);
        }
      });
    }

    // ==========================================
    // 3. MODEL: BRAZO ROBOT (MPS ROBOT MELFA RV-2AJ)
    // ==========================================
    else if (modelType === 'robot') {
      const robotGroup = new THREE.Group();

      // Slotted table
      const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 2.2), mats.aluminum);
      baseMesh.position.y = 0.06;
      robotGroup.add(baseMesh);

      // Base pedestal (Cylindrical mount J1)
      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.3, 32), mats.robotWhite);
      pedestal.position.set(0, 0.27, 0);
      pedestal.castShadow = true;
      robotGroup.add(pedestal);

      // J1: Swivel Base
      const j1Group = new THREE.Group();
      j1Group.position.set(0, 0.42, 0);

      const j1Body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.22, 28), mats.robotWhite);
      j1Group.add(j1Body);

      // Festo blue accent band
      const j1Band = new THREE.Mesh(new THREE.CylinderGeometry(0.242, 0.242, 0.04, 28), mats.festoBlue);
      j1Band.position.y = 0.05;
      j1Group.add(j1Band);

      // J2: Shoulder Link
      const j2Group = new THREE.Group();
      j2Group.position.set(0, 0.16, 0);

      const shoulderArmGeo = new THREE.BoxGeometry(0.2, 0.65, 0.22);
      const shoulderArm = new THREE.Mesh(shoulderArmGeo, mats.robotWhite);
      shoulderArm.position.set(0, 0.32, 0);
      shoulderArm.castShadow = true;
      j2Group.add(shoulderArm);

      // J3: Elbow Joint
      const j3Group = new THREE.Group();
      j3Group.position.set(0, 0.65, 0);

      const elbowCap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.22, 24), mats.darkMetal);
      elbowCap.rotation.z = Math.PI / 2;
      j3Group.add(elbowCap);

      // Forearm link
      const forearmGeo = new THREE.BoxGeometry(0.16, 0.55, 0.16);
      const forearm = new THREE.Mesh(forearmGeo, mats.robotWhite);
      forearm.position.set(0, 0.28, 0);
      forearm.castShadow = true;
      j3Group.add(forearm);

      // Festo blue cable spiral conduit
      const cableConduit = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.55, 12), mats.festoBlue);
      cableConduit.position.set(0.11, 0.28, 0);
      j3Group.add(cableConduit);

      // J4: Wrist Pitch
      const j4Group = new THREE.Group();
      j4Group.position.set(0, 0.55, 0);

      const wristPitch = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.14, 20), mats.darkMetal);
      wristPitch.rotation.z = Math.PI / 2;
      j4Group.add(wristPitch);

      // J5: Wrist Roll & Tool Flange
      const j5Group = new THREE.Group();
      j5Group.position.set(0, 0.08, 0);

      const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 24), mats.aluminum);
      j5Group.add(flange);

      // Festo Pneumatic Parallel Gripper
      const gripperBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.08), mats.festoBlue);
      gripperBody.position.y = 0.07;
      j5Group.add(gripperBody);

      const leftFinger = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 0.03), mats.darkMetal);
      leftFinger.position.set(-0.04, 0.15, 0);
      j5Group.add(leftFinger);

      const rightFinger = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 0.03), mats.darkMetal);
      rightFinger.position.set(0.04, 0.15, 0);
      j5Group.add(rightFinger);

      // Workpiece held by gripper
      const heldPiece = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 20), mats.workpieceMetal);
      heldPiece.position.set(0, 0.17, 0);
      j5Group.add(heldPiece);

      j4Group.add(j5Group);
      j3Group.add(j4Group);
      j2Group.add(j3Group);
      j1Group.add(j2Group);
      robotGroup.add(j1Group);

      // Teach Pendant R28TB on stand
      const tpGroup = new THREE.Group();
      tpGroup.position.set(1.1, 0.5, 0.6);

      const tpBody = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.36, 0.08), mats.robotWhite);
      tpBody.rotation.x = -0.4;
      tpGroup.add(tpBody);

      // LCD Screen
      const tpLcd = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.1), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
      tpLcd.rotation.x = -0.4;
      tpLcd.position.set(0, 0.08, 0.045);
      tpGroup.add(tpLcd);

      // Emergency Stop Mushroom Button
      const estop = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 16), mats.ledRed);
      estop.rotation.x = -0.4;
      estop.position.set(0.07, 0.08, 0.05);
      tpGroup.add(estop);
      robotGroup.add(tpGroup);

      // Register exploded offsets
      registerExplode(pedestal, new THREE.Vector3(0, -0.1, 0));
      registerExplode(j1Body, new THREE.Vector3(0, 0.15, 0));
      registerExplode(shoulderArm, new THREE.Vector3(0.15, 0.25, 0));
      registerExplode(forearm, new THREE.Vector3(-0.15, 0.35, 0));
      registerExplode(tpGroup, new THREE.Vector3(0.3, 0, 0.2));

      rootGroup.add(robotGroup);

      // Coordinated Inverse Kinematics / 5-Axis Motion
      animators.push((time, delta, spd) => {
        const t = time * spd * 0.8;
        // J1 Base swivel
        j1Group.rotation.y = Math.sin(t) * 0.85;
        // J2 Shoulder pitch
        j2Group.rotation.z = Math.sin(t * 1.2) * 0.35 - 0.2;
        // J3 Elbow pitch
        j3Group.rotation.z = Math.cos(t * 1.2) * 0.45 + 0.4;
        // J4 Wrist pitch
        j4Group.rotation.z = -Math.sin(t * 1.2) * 0.4;
        // J5 Tool roll
        j5Group.rotation.y = Math.sin(t * 2) * 0.6;

        // Gripper breathing
        const gripOffset = 0.035 + Math.sin(t * 1.5) * 0.015;
        leftFinger.position.x = -gripOffset;
        rightFinger.position.x = gripOffset;
      });
    }

    // ==========================================
    // 4. MODEL: ESTACIÓN DE TORNO CNC (EMCO PC TURN)
    // ==========================================
    else if (modelType === 'torno') {
      const tornoGroup = new THREE.Group();

      // Main heavy lathe casting bed
      const bed = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.35, 1.6), mats.darkMetal);
      bed.position.y = 0.18;
      bed.receiveShadow = true;
      tornoGroup.add(bed);

      // EMCO Red front panel cover
      const frontCover = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.35, 0.04), mats.latheRed);
      frontCover.position.set(0, 0.5, 0.78);
      tornoGroup.add(frontCover);

      // Precision ground guide ways (Z axis)
      const guideWay1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.05, 0.08), mats.aluminum);
      guideWay1.position.set(0.2, 0.38, 0.15);
      tornoGroup.add(guideWay1);

      const guideWay2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.05, 0.08), mats.aluminum);
      guideWay2.position.set(0.2, 0.38, -0.25);
      tornoGroup.add(guideWay2);

      // Spindle Headstock (Husillo Principal)
      const headstock = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.65, 0.9), mats.latheRed);
      headstock.position.set(-1.1, 0.68, 0);
      headstock.castShadow = true;
      tornoGroup.add(headstock);

      // 3-Jaw Chuck (Mandril de sujeción giratorio)
      const chuckGroup = new THREE.Group();
      chuckGroup.position.set(-0.7, 0.7, 0);
      const chuckBody = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.14, 32), mats.aluminum);
      chuckBody.rotation.z = Math.PI / 2;
      chuckGroup.add(chuckBody);

      // 3 jaws
      for (let j = 0; j < 3; j++) {
        const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.06), mats.darkMetal);
        const ang = (j * Math.PI * 2) / 3;
        jaw.position.set(0.08, Math.sin(ang) * 0.16, Math.cos(ang) * 0.16);
        chuckGroup.add(jaw);
      }

      // Workpiece being turned
      const workStock = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.85, 32), mats.workpieceMetal);
      workStock.rotation.z = Math.PI / 2;
      workStock.position.x = 0.45;
      chuckGroup.add(workStock);

      tornoGroup.add(chuckGroup);

      // Carriage & Tool Turret (Ejes X y Z)
      const carriageZ = new THREE.Group();
      carriageZ.position.set(0.1, 0.42, 0);

      const zSaddle = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.1, 0.7), mats.darkMetal);
      carriageZ.add(zSaddle);

      // Cross slide (Eje X)
      const crossSlideX = new THREE.Group();
      crossSlideX.position.set(0, 0.1, 0);
      const xSaddle = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.45), mats.latheRed);
      crossSlideX.add(xSaddle);

      // 8-Position Indexable Tool Turret
      const turretGroup = new THREE.Group();
      turretGroup.position.set(0, 0.16, 0.08);

      const turretDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.14, 16), mats.darkMetal);
      turretDisc.rotation.z = Math.PI / 2;
      turretGroup.add(turretDisc);

      // Cutting tool holder & carbide insert
      const toolHolder = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.04), mats.darkMetal);
      toolHolder.position.set(0, 0, -0.15);
      turretGroup.add(toolHolder);

      const carbideInsert = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.04), mats.brassGold);
      carbideInsert.position.set(0, 0, -0.18);
      turretGroup.add(carbideInsert);

      crossSlideX.add(turretGroup);
      carriageZ.add(crossSlideX);
      tornoGroup.add(carriageZ);

      // Tailstock (Contrapunto)
      const tailstock = new THREE.Group();
      tailstock.position.set(1.0, 0.6, 0);

      const tailBody = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.4), mats.latheRed);
      tailstock.add(tailBody);

      const quill = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.25, 16), mats.aluminum);
      quill.rotation.z = Math.PI / 2;
      quill.position.set(-0.15, 0.1, 0);
      tailstock.add(quill);

      const centerPoint = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 16), mats.aluminum);
      centerPoint.rotation.z = Math.PI / 2;
      centerPoint.position.set(-0.29, 0.1, 0);
      tailstock.add(centerPoint);
      tornoGroup.add(tailstock);

      // GE Fanuc Series 21 Console
      const consoleGroup = new THREE.Group();
      consoleGroup.position.set(1.4, 1.2, -0.4);

      const fanucPanel = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.75, 0.1), mats.robotWhite);
      consoleGroup.add(fanucPanel);

      const fanucScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.28), new THREE.MeshBasicMaterial({ color: 0x0369a1 }));
      fanucScreen.position.set(-0.08, 0.12, 0.055);
      consoleGroup.add(fanucScreen);

      // Fanuc logo badge
      const fanucBadge = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.05), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      fanucBadge.position.set(0.16, 0.3, 0.055);
      consoleGroup.add(fanucBadge);

      // Keypad grid
      const keypad = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.25), mats.darkMetal);
      keypad.position.set(0, -0.18, 0.055);
      consoleGroup.add(keypad);
      tornoGroup.add(consoleGroup);

      // Safety Enclosure with acrylic shield
      const shield = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 0.02), mats.glassShield);
      shield.position.set(0.1, 0.95, 0.65);
      tornoGroup.add(shield);

      // Register exploded offsets
      registerExplode(headstock, new THREE.Vector3(-0.3, 0.2, 0));
      registerExplode(carriageZ, new THREE.Vector3(0, 0.2, 0.3));
      registerExplode(tailstock, new THREE.Vector3(0.4, 0, 0));
      registerExplode(consoleGroup, new THREE.Vector3(0.3, 0.3, -0.2));
      registerExplode(shield, new THREE.Vector3(0, 0.3, 0.4));

      rootGroup.add(tornoGroup);

      // Turning animation loop
      animators.push((time, delta, spd) => {
        // High-speed spindle rotation (150 - 4000 RPM)
        chuckGroup.rotation.x += delta * 24 * spd;

        // Cutting tool longitudinal & cross feed motion (G01 interpolation)
        const t = (time * spd * 0.6) % 1;
        // Tool passes along workpiece
        carriageZ.position.x = 0.5 - t * 0.6;
        crossSlideX.position.z = -0.08 + Math.sin(t * Math.PI) * 0.02;
      });
    }

    // Touch and Mouse Interaction Orbit Logic with Responsive Sensitive Zoom
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let rotX = 0.4;
    let rotY = 0.6;
    let zoomDist = 5.2;
    let targetZoomDist = 5.2;

    // Connect button triggers to smoothly step targetZoomDist
    zoomInRef.current = () => {
      targetZoomDist = Math.max(1.6, targetZoomDist * 0.72);
    };
    zoomOutRef.current = () => {
      targetZoomDist = Math.min(9.5, targetZoomDist * 1.35);
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevPointerX;
      const dy = e.clientY - prevPointerY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;

      rotY += dx * 0.008;
      rotX = Math.max(0.08, Math.min(Math.PI / 2.1, rotX + dy * 0.008));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Responsive Wheel Zoom:
    // Reaches large view within 2-3 comfortable wheel turns without taking endless spins,
    // while remaining highly sensitive and smooth to small rotation adjustments.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 20; // Firefox line scroll
      else if (e.deltaMode === 2) dy *= 200; // Page scroll

      // Proportional factor based on current distance:
      // When far away, moves more; when close up, moves subtly to prevent clipping
      const clampedDelta = Math.sign(dy) * Math.min(Math.abs(dy), 180);
      const zoomFactor = 1 + (clampedDelta / 100) * 0.22;
      targetZoomDist = Math.max(1.6, Math.min(9.5, targetZoomDist * zoomFactor));
    };

    // Touch pinch-to-zoom
    let initialTouchDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialTouchDist = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if (initialTouchDist > 0) {
          const ratio = initialTouchDist / Math.max(dist, 1);
          targetZoomDist = Math.max(1.6, Math.min(9.5, targetZoomDist * (1 + (ratio - 1) * 0.8)));
          initialTouchDist = dist;
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation & Pacing Loop
    let animFrameId = 0;
    let lastTime = performance.now();
    let accumulatedTime = 0;

    // Software WebGL pacing helper per Three.js skill
    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          animFrameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          animFrameId = window.setTimeout(cb, 80);
        }
      };
      animFrameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (isPlayingRef.current) {
        accumulatedTime += delta;
        animators.forEach((fn) => fn(accumulatedTime, delta, speedRef.current));
      }

      // Smooth camera presets or orbit damping
      if (presetRef.current === 'iso') {
        // target rotX ~ 0.5, rotY ~ 0.7
      } else if (presetRef.current === 'front') {
        rotX = THREE.MathUtils.damp(rotX, 0.15, 6, delta);
        rotY = THREE.MathUtils.damp(rotY, 0.0, 6, delta);
      } else if (presetRef.current === 'top') {
        rotX = THREE.MathUtils.damp(rotX, 1.45, 6, delta);
        rotY = THREE.MathUtils.damp(rotY, 0.0, 6, delta);
      }

      // Butter-smooth damping for agile camera zoom distance
      zoomDist = THREE.MathUtils.damp(zoomDist, targetZoomDist, 12, delta);

      // Smooth camera position with spherical coordinates
      const targetCamX = zoomDist * Math.sin(rotY) * Math.cos(rotX);
      const targetCamY = zoomDist * Math.sin(rotX);
      const targetCamZ = zoomDist * Math.cos(rotY) * Math.cos(rotX);

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 10, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 10, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 10, delta);
      camera.lookAt(0, 0.6, 0);

      // Handle Exploded View transition
      const targetExplodeFactor = isExplodedRef.current ? 1.0 : 0.0;
      explodables.forEach((item) => {
        const currentTarget = _vec3
          .copy(item.basePos)
          .addScaledVector(item.explodeDir, targetExplodeFactor);
        item.mesh.position.lerp(currentTarget, delta * 5);
      });

      // Handle Wireframe toggling
      Object.values(mats).forEach((mat) => {
        if ('wireframe' in mat) {
          mat.wireframe = wireframeRef.current;
        }
      });

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        animFrameId = requestAnimationFrame(tick);
      }
    };

    // Pre-warm renderer
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    tick();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animFrameId);
      clearTimeout(animFrameId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [modelType]);

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] lg:h-[520px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Model Badge */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 pointer-events-none flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] sm:text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
          <Box className="w-3.5 h-3.5 text-cyan-400" />
          3D CAD
        </span>
        {title && (
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/50 text-slate-300 text-[11px] sm:text-xs font-medium truncate max-w-[140px] sm:max-w-none">
            {title}
          </span>
        )}
      </div>

      {/* Top Right Quick Hint */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 pointer-events-none hidden md:flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-400 text-xs font-mono">
          Rotar: arrastrar • Zoom: rueda sensible / pellizco
        </span>
      </div>

      {/* Unified Bottom Ergonomic Control Dock (Consolidated per Three.js skill) */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 max-w-[96vw] w-auto transition-transform duration-300 pointer-events-auto">
        <div className="flex flex-col items-center">
          {/* Collapse/Expand Toggle Tab */}
          <button
            onClick={() => setControlsCollapsed(!controlsCollapsed)}
            className="mb-1 px-3 py-0.5 rounded-t-lg bg-slate-900/95 border-t border-x border-slate-700/60 text-[10px] font-mono uppercase tracking-wider text-slate-400 hover:text-cyan-300 cursor-pointer"
          >
            {controlsCollapsed ? '▲ Controles 3D' : '▼ Ocultar'}
          </button>

          {!controlsCollapsed && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-slate-900/95 border border-slate-700/70 shadow-2xl text-xs text-slate-200">
              {/* Play / Pause button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-1.5 sm:p-2 rounded-xl transition flex items-center gap-1.5 font-medium cursor-pointer ${
                  isPlaying
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title={isPlaying ? 'Pausar animación' : 'Reanudar animación'}
              >
                {isPlaying ? <Pause className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> : <Play className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
                <span className="text-[11px] sm:text-xs">{isPlaying ? 'Pausa' : 'Animar'}</span>
              </button>

              {/* Zoom In & Zoom Out Fast Buttons */}
              <div className="flex items-center gap-0.5 bg-slate-950/80 p-0.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => zoomInRef.current?.()}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition cursor-pointer"
                  title="Acercar modelo (Zoom In sensible)"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-cyan-300" />
                </button>
                <button
                  onClick={() => zoomOutRef.current?.()}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition cursor-pointer"
                  title="Alejar modelo (Zoom Out sensible)"
                >
                  <ZoomOut className="w-3.5 h-3.5 text-cyan-300" />
                </button>
              </div>

              {/* Speed multiplier selector */}
              <div className="flex items-center gap-1 bg-slate-950/70 px-2 py-1 rounded-xl border border-slate-800">
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">Vel:</span>
                {[0.5, 1.0, 2.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-1.5 sm:px-2 py-0.5 rounded text-[11px] sm:text-xs font-mono transition cursor-pointer ${
                      speed === s
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Camera Presets */}
              <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setCameraPreset('iso')}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs transition cursor-pointer ${
                    cameraPreset === 'iso' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Iso
                </button>
                <button
                  onClick={() => setCameraPreset('front')}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs transition cursor-pointer ${
                    cameraPreset === 'front' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Frontal
                </button>
                <button
                  onClick={() => setCameraPreset('top')}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs transition cursor-pointer ${
                    cameraPreset === 'top' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Planta
                </button>
              </div>

              {/* Exploded View Toggle */}
              <button
                onClick={() => setIsExploded(!isExploded)}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border transition flex items-center gap-1 sm:gap-1.5 cursor-pointer ${
                  isExploded
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Separar componentes para ver el ensamblaje interior"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="text-[11px] sm:text-xs">Despiece</span>
              </button>

              {/* Wireframe toggle */}
              <button
                onClick={() => setWireframe(!wireframe)}
                className={`p-1.5 sm:p-2 rounded-xl border transition cursor-pointer ${
                  wireframe
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title="Modo Malla (Wireframe CAD)"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
