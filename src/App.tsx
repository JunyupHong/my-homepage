import React, { useEffect, useRef } from 'react';
import './App.scss';
import * as THREE from 'three';

function App() {
    enum Shape {
        CYLINDER = 'cylinder',
        CONE = 'cone',
        TORUS = 'torus',
        TORUSKNOT = 'torusknot',
        OCTAHEDRON = 'octahedron',
        ICOSAHEDRON = 'icosahedron'
    };
    type MeshObject = {
        mesh: THREE.Mesh,
        positionVector: THREE.Vector3,
        rotationVector: THREE.Vector3,
        lifeTime: number,
        init: () => MeshObject
    };

    const canvas = useRef<HTMLDivElement>(null);
    const scene: THREE.Scene = new THREE.Scene();
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const light: THREE.PointLight = new THREE.PointLight(0xffffff, 2, 100, 2);
    const renderer: THREE.Renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    const mousePosition: THREE.Vector3 = new THREE.Vector3(0, 0, 50);

    const meshObjects: Array<MeshObject> = [];
    const objectCount: number = 50;

    let tick = 1;
    useEffect(() => {
        initCanvas();

        for (let i = 0; i < objectCount; i++) {
            meshObjects.push(createShapeMeshObject(Shape.CONE).init());
            meshObjects.push(createShapeMeshObject(Shape.CYLINDER).init());
            meshObjects.push(createShapeMeshObject(Shape.OCTAHEDRON).init());
            meshObjects.push(createShapeMeshObject(Shape.TORUS).init());
            // meshObjects.push(createShapeMeshObject(Shape.TORUSKNOT).init());
            meshObjects.push(createShapeMeshObject(Shape.ICOSAHEDRON).init());
        }

        scene.add(...meshObjects.map(object => object.mesh));
        window.addEventListener('resize', onResizeWindow);
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        
        updateCanvas();

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (canvas && canvas.current) canvas.current.removeChild(renderer.domElement);
            while (meshObjects.length) meshObjects.pop();
            window.removeEventListener('resize', onResizeWindow);
            renderer.domElement.removeEventListener('mousemove', onMouseMove);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateCanvas = () => {
        tick++;
        meshObjects.forEach(object => {
            if (tick % object.lifeTime === 0) object.init();
            if (object.mesh.position.y > window.innerHeight / 3) object.init();
            object.mesh.position.x += object.positionVector.x;
            object.mesh.position.y += object.positionVector.y;
            object.mesh.position.z += object.positionVector.z;

            object.mesh.rotation.x += object.rotationVector.x * Math.PI / 180;
            object.mesh.rotation.y += object.rotationVector.y;
            object.mesh.rotation.z += object.rotationVector.z;
        });

        light.position.set(mousePosition.x, mousePosition.y, mousePosition.z);
        renderer.render(scene, camera);
        requestAnimationFrame(updateCanvas);
    };

    const initCanvas = () => {
        scene.background = new THREE.Color(0x010101);

        if (!canvas || !canvas.current) return;        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.setAttribute('style',`
            position: absolute;
            z-index: 1;
            opacity: 0.9;
        `);

        canvas.current.appendChild(renderer.domElement);

        camera.position.z = 300;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        light.position.set(mousePosition.x, mousePosition.y, mousePosition.z);
        light.castShadow = true;
        scene.add(light);
    }

    const onMouseMove = (evt: MouseEvent) => {
        mousePosition.set((evt.offsetX - (window.innerWidth / 2)) * 75 / 180, ((window.innerHeight / 2) - evt.offsetY) * 75 /180, mousePosition.z);
    }
    const onResizeWindow = (evt: UIEvent) => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    const createShapeMesh = (shape: Shape) => {
        let geometry!: THREE.Geometry;
        const material = new THREE.MeshStandardMaterial( { color: 0x101010 } );
        switch(shape) {
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
                break;
            case 'cone':
                geometry = new THREE.ConeGeometry(5, 12, 20);
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(10, 3, 16, 100); 
                break;
            case 'torusknot':
                geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
                break;
            case 'octahedron':
                geometry = new THREE.OctahedronGeometry(10, 0);
                break;
            case 'icosahedron':
                geometry = new THREE.IcosahedronGeometry(10);
        }
        return new THREE.Mesh(geometry, material);
    }

    const createShapeMeshObject = (shape: Shape): MeshObject => {
        const object: MeshObject = {
            mesh: createShapeMesh(shape),
            positionVector: new THREE.Vector3(),
            rotationVector: new THREE.Vector3(),
            lifeTime: 0,
            init: (): MeshObject => {
                object.mesh.position.set(-(window.innerWidth / 2) * 75 / 180 + (Math.random() - 0.5) * 100, (window.innerHeight / 2) * 75 / 180 + (Math.random() - 0.5) * 100 - 100, 0);
                object.mesh.rotateZ(Math.PI / 2 + Math.sin(Math.random() - 0.5));
                object.positionVector.set((Math.random() + 0.2) * 0.6, (Math.random() - 0.7) * 0.6, Math.random() / 2 - 0.25);
                object.rotationVector.set((Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.03);
                object.lifeTime = Math.floor(700 + Math.random() * 600);
                return object;
            }
        };
        return object.init();
    }

    return (
        <div className="app" ref={canvas}>
            <header className="app-header">header</header>
            <section className="app-section">section</section>
            <footer className="app-footer">footer</footer>
        </div>
    );
}

export default App;
