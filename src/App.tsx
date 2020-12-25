import React, { useEffect, useRef } from 'react';
import './App.scss';
import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


function App() {
    
    const canvas = useRef<HTMLDivElement>(null);
    const scene: THREE.Scene = new THREE.Scene();
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, 0, 0.1, 1000);
    const renderer: THREE.Renderer = new THREE.WebGLRenderer({ antialias: true });
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    let tick = 0;
    const update = () => {
        tick++;
        requestAnimationFrame(update);
        heartShape.moveTo( 5, 5 );
        if (tick % 5 === 0) camera.position.z = 3*Math.sin(tick) + 100;
        // camera.position.y += Math.sin(tick * 0.1) / 3;

        renderer.render(scene, camera);
    };
    
    useEffect(() => {
        if (!canvas || !canvas.current) return;
        const width = canvas.current.clientWidth;
        const height = canvas.current.clientHeight;
        
        renderer.setSize(width, height);
        canvas.current.appendChild(renderer.domElement);
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        camera.position.z = 100;

        
        heartShape.moveTo( x + 5, y - 5 );
        heartShape.bezierCurveTo( x + 5, y - 5, x + 4, y, x, y );
        heartShape.bezierCurveTo( x - 6, y, x - 6, y - 7,x - 6, y - 7 );
        heartShape.bezierCurveTo( x - 6, y - 11, x - 3, y - 15.4, x + 5, y - 19 );
        heartShape.bezierCurveTo( x + 12, y - 15.4, x + 16, y - 11, x + 16, y - 7 );
        heartShape.bezierCurveTo( x + 16, y - 7, x + 16, y, x + 10, y );
        heartShape.bezierCurveTo( x + 7, y, x + 5, y - 5, x + 5, y - 5 );
        const geometry = new THREE.ShapeGeometry( heartShape );
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        const mesh = new THREE.Mesh( geometry, material ) ;
        scene.add( mesh );

        const controls = new DragControls( [mesh], camera, renderer.domElement );

        // add event listener to highlight dragged objects

        controls.addEventListener( 'dragstart', event => {
            console.log(event)
            console.log(event.object.material)
            event.object.material.color.set(0xaa0000);
        });

        controls.addEventListener( 'dragend', function ( event ) {
            event.object.material.color.set( 0xff0000 );
        });

        

        // const geometry = new THREE.BufferGeometry();
        // const vertices = new Float32Array([
        //     -1.0,
        //     -1.0,
        //     1.0,
        //     1.0,
        //     -1.0,
        //     1.0,
        //     1.0,
        //     1.0,
        //     1.0,

        //     1.0,
        //     1.0,
        //     1.0,
        //     -1.0,
        //     1.0,
        //     1.0,
        //     -1.0,
        //     -1.0,
        //     1.0,
        // ]);

        // geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        // const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
        // const mesh = new THREE.Mesh(geometry, material);

        // scene.add(mesh);
        // console.log(scene);

        update();



    }, []);

    return (
        <div className="app" ref={canvas}>
            <header className="app-header"></header>
            <section className="app-section"></section>
            <footer className="app-footer"></footer>
        </div>
    );
}

export default App;
