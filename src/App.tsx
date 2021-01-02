import React, { useEffect, useRef } from 'react';
import './App.scss';
import * as THREE from 'three';
import Main from './page/main/main';
import MeshObject, { MeshShape } from './class/MeshObject';

function App() {
    const canvas = useRef<HTMLDivElement>(null);
    const scene: THREE.Scene = new THREE.Scene();
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const light: THREE.PointLight = new THREE.PointLight(0xffffff, 2, 100, 2);
    const renderer: THREE.Renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    const mousePosition: THREE.Vector3 = new THREE.Vector3(0, 0, 50);

    const meshObjects: Array<MeshObject> = [];
    const objectCount: number = 10;

    let tick = 1;
    useEffect(() => {
        initCanvas();

        for (let i = 0; i < objectCount; i++) {
            meshObjects.push(new MeshObject(MeshShape.CONE).initRandom());
            meshObjects.push(new MeshObject(MeshShape.CYLINDER).initRandom());
            meshObjects.push(new MeshObject(MeshShape.ICOSAHEDRON).initRandom());
            meshObjects.push(new MeshObject(MeshShape.OCTAHEDRON).initRandom());
            meshObjects.push(new MeshObject(MeshShape.TORUS).initRandom());
        }

        scene.add(...meshObjects.map(object => object.mesh));
        window.addEventListener('resize', onResizeWindow);
        window.addEventListener('mousemove', setMousePosition);

        updateCanvas();

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (canvas && canvas.current) canvas.current.removeChild(renderer.domElement);
            while (meshObjects.length) meshObjects.pop();
            window.removeEventListener('resize', onResizeWindow);
            window.removeEventListener('mousemove', setMousePosition);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateCanvas = () => {
        tick++;
        meshObjects.forEach(object => {
            if (tick % object.lifeTime === 0) object.initRandom();
            if (object.mesh.position.y > window.innerHeight / 3) object.initRandom();
            
            object.move();
            object.rotate();
        });

        light.position.set(mousePosition.x, mousePosition.y, mousePosition.z);
        renderer.render(scene, camera);
        requestAnimationFrame(updateCanvas);
    };

    const initCanvas = () => {
        scene.background = new THREE.Color(0x010101);

        if (!canvas || !canvas.current) return;        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.setAttribute('style', 'opacity: 0.9;');

        canvas.current.appendChild(renderer.domElement);

        camera.position.z = 300;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        light.position.set(mousePosition.x, mousePosition.y, mousePosition.z);
        light.castShadow = true;
        scene.add(light);
    }

    const setMousePosition = (evt: MouseEvent) => {
        mousePosition.set((evt.offsetX - (window.innerWidth / 2)) * 75 / 180, ((window.innerHeight / 2) - evt.offsetY) * 75 /180, mousePosition.z);
    }
    const onResizeWindow = (evt: UIEvent) => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    return (
        <div className="app">
            <div className="app-background" ref={canvas}></div>
            <header className="app-header">header</header>
            <section className="app-section">section</section>
            <footer className="app-footer">footer</footer>
            <Main></Main>
        </div>
    );
}

export default App;
