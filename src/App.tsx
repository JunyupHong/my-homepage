import React, { useState, useEffect, useRef } from 'react';
import './App.scss';
import * as THREE from 'three';
import { DoubleSide } from 'three';

function App() {
    enum Shape {
        CYLINDER = 'cylinder',
        CONE = 'cone',
        TORUS = 'torus',
        TORUSKNOT = 'torusknot',
        OCTAHEDRON = 'octahedron'
    };

    const canvas = useRef<HTMLDivElement>(null);
    const scene: THREE.Scene = new THREE.Scene();
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, 0, 200, 600);
    const light: THREE.PointLight = new THREE.PointLight(0xffffff, 2, window.innerWidth);
    // const backLight: THREE.PointLight = new THREE.PointLight(0xffffff, 0.2, window.innerWidth);
    const renderer: THREE.Renderer = new THREE.WebGLRenderer({ antialias: true });

    const mousePosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const meshes: Array<THREE.Mesh> = [];

    let tick = 0;
    useEffect(() => {
        initCanvas();

        createShape(Shape.CYLINDER);
        createShape(Shape.TORUSKNOT);
        createShape(Shape.TORUS);
        createShape(Shape.OCTAHEDRON);
        createShape(Shape.CONE);
        meshes[0].position.x = -200;
        meshes[1].position.x = -100;
        meshes[2].position.x = 0;
        meshes[3].position.x = 100;
        meshes[4].position.x = 200;

        scene.add(...meshes);

        renderer.domElement.addEventListener('mousemove', mouseMove);

        updateCanvas();

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (canvas && canvas.current) canvas.current.removeChild(renderer.domElement);
            renderer.domElement.removeEventListener('mousemove', mouseMove);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateCanvas = () => {
        tick++;
        meshes.forEach((mesh, i) => {
            mesh.rotation.x = tick * (i+1) / 300;
            mesh.rotation.y = tick * (i+1) / 100;
        });
        light.position.set(mousePosition.x, mousePosition.y, mousePosition.z);
        renderer.render(scene, camera);
        requestAnimationFrame(updateCanvas);
    };

    const initCanvas = () => {
        if (!canvas || !canvas.current) return;
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.setAttribute('style',`
            position: absolute;
            z-index: 1;
            opacity: 0.9;
        `);

        canvas.current.appendChild(renderer.domElement);

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        camera.position.z = 300;


        light.position.set(mousePosition.x, mousePosition.y, mousePosition.z);
        light.castShadow = true;
        scene.add(light);

        // backLight.position.set(window.innerWidth / 2, window.innerHeight / 2, 0);
        // scene.add(backLight);
    }

    const mouseMove = (evt: MouseEvent) => {
        console.log(evt);
        mousePosition.set(evt.offsetX - window.innerWidth / 2, window.innerHeight / 2 - evt.offsetY, 0);
    }

    const createShape = (shape: Shape) => {
        let geometry!: THREE.Geometry;
        const material = new THREE.MeshStandardMaterial( { color: 0x444444, side: DoubleSide } );
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
        }

        meshes.push(new THREE.Mesh( geometry, material ));
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
