import React, { useEffect, useRef } from 'react';
import './App.scss';
import * as THREE from 'three';

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
    scene.background = new THREE.Color(0x010101);
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const light: THREE.PointLight = new THREE.PointLight(0xffffff, 2, undefined, 2);
    // const light: THREE.SpotLight = new THREE.SpotLight(0xffffff, 1);
    const renderer: THREE.Renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    let mousePosition: THREE.Vector3 = new THREE.Vector3(0, 0, window.innerWidth * 2);
    const meshes: Array<THREE.Mesh> = [];


    let tick = 0;
    useEffect(() => {
        initCanvas();

        createShape(Shape.CYLINDER);
        createShape(Shape.CYLINDER);
        createShape(Shape.CYLINDER);
        createShape(Shape.CYLINDER);
        createShape(Shape.CYLINDER);
        createShape(Shape.CYLINDER);
        createShape(Shape.CYLINDER);
        createShape(Shape.CYLINDER);
        createShape(Shape.CYLINDER);
        // createShape(Shape.TORUSKNOT);
        // createShape(Shape.TORUS);
        // createShape(Shape.OCTAHEDRON);
        // createShape(Shape.CONE);
        meshes[0].position.x = 0;
        meshes[1].position.x = 100;
        meshes[2].position.x = 200;
        meshes[3].position.x = -100;
        meshes[4].position.x = -200;
        meshes[5].position.y = -100;
        meshes[6].position.y = -200;
        meshes[7].position.y = 100;
        meshes[8].position.y = 200;
        meshes[0].position.z = -10;
        meshes[1].position.z = -20;
        meshes[2].position.z = -30;
        meshes[3].position.z = -40;
        meshes[4].position.z = -50;
        meshes[5].position.z = -60;
        meshes[6].position.z = -70;
        meshes[7].position.z = -80;
        meshes[8].position.z = -90;
        

        scene.add(...meshes);

        window.addEventListener('resize', onResizeWindow);
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        updateCanvas();

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (canvas && canvas.current) canvas.current.removeChild(renderer.domElement);
            window.removeEventListener('resize', onResizeWindow);
            renderer.domElement.removeEventListener('mousemove', onMouseMove);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateCanvas = () => {
        tick++;
        // meshes.forEach((mesh, i) => {
        //     mesh.rotation.x = tick * (i+1) / 300;
        //     mesh.rotation.y = tick * (i+1) / 100;
        // });
        light.position.set(mousePosition.x, mousePosition.y, 0);
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

    const createShape = (shape: Shape) => {
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
