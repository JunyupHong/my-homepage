import { Euler, Geometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { ConeGeometry, CylinderGeometry, OctahedronGeometry, TorusGeometry, TorusKnotGeometry } from 'three';

enum MeshShape {
    CYLINDER = 'cylinder',
    CONE = 'cone',
    TORUS = 'torus',
    TORUSKNOT = 'torusknot',
    OCTAHEDRON = 'octahedron',
    ICOSAHEDRON = 'icosahedron'
};

class MeshObject {
    private geometry: Geometry;
    private material: MeshStandardMaterial;
    private _mesh: Mesh;

    private positionVector: Vector3 = new Vector3(0, 0, 0);
    private rotationVector: Vector3 = new Vector3(0, 0, 0);
    private _lifeTime: number = 0;

    constructor(shape: MeshShape) {
        switch(shape) {
            default:
            case 'cylinder':
                this.geometry = new CylinderGeometry(5, 5, 20, 32);
                break;
            case 'cone':
                this.geometry = new ConeGeometry(5, 12, 20);
                break;
            case 'torus':
                this.geometry = new TorusGeometry(10, 3, 16, 100); 
                break;
            case 'torusknot':
                this.geometry = new TorusKnotGeometry(10, 3, 100, 16);
                break;
            case 'octahedron':
                this.geometry = new OctahedronGeometry(10, 0);
                break;
            case 'icosahedron':
                this.geometry = new OctahedronGeometry(10);
                break;
        }
        this.material = new MeshStandardMaterial({ color: 0x101010 });
        this._mesh = new Mesh(this.geometry, this.material);
        this._mesh.setRotationFromEuler(new Euler(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI));
    }

    get mesh(): Mesh {
        return this._mesh;
    }
    get lifeTime(): number {
        return this._lifeTime;
    }

    public initRandom: () => MeshObject = () => {
        this.mesh.position.set(-(window.innerWidth / 2) * 75 / 180 + (Math.random() - 0.5) * 100, (window.innerHeight / 2) * 75 / 180 + (Math.random() - 0.5) * 100 - 100, 0);
        this.mesh.rotateZ(Math.PI / 2 + Math.sin(Math.random() - 0.5));
        this.positionVector.set((Math.random() + 0.2) * 0.6, (Math.random() - 0.7) * 0.6, Math.random() / 2 - 0.25);
        this.rotationVector.set((Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.03);
        this._lifeTime = Math.floor(700 + Math.random() * 600);
        return this;
    }

    public move: () => void = () => {
        this.mesh.position.add(this.positionVector);
    }
    public rotate: () => void = () => {
        this.mesh.rotation.x += this.rotationVector.x;
        this.mesh.rotation.y += this.rotationVector.y;
        this.mesh.rotation.z += this.rotationVector.z;
    }
}

export { MeshObject, MeshShape };
export default MeshObject;