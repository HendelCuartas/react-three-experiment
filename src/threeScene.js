import React, { Component } from 'react';
import * as THREE from 'three';

class ThreeScene extends Component {
    componentDidMount() {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight
        //ADD SCENE
        this.scene = new THREE.Scene()
        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
        )
        this.camera.position.z = 10
        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor('#000000')
        this.renderer.setSize(width, height)
        this.mount.appendChild(this.renderer.domElement)
        //ADD LIGHT
        //Create a PointLight and turn on shadows for the light
        var light = new THREE.PointLight( 0xffffff, 1, 100 );
        light.position.set( 0, 10, 10 );
        light.castShadow = true;            // default false
        this.scene.add( light );

        //Set up shadow properties for the light
        light.shadow.mapSize.width = 1080;  // default
        light.shadow.mapSize.height = 1080; // default
        light.shadow.camera.near = 0.5;       // default
        light.shadow.camera.far = 1000      // default
        //ADD CUBE
        const geometry = new THREE.SphereGeometry(1, 15, 15)
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 })
        this.cube = new THREE.Mesh(geometry, material)
        this.cube.receiveShadow = true
        this.scene.add(this.cube)
        this.velocity = new THREE.Vector3(0, 0, 0)
        this.acceleration = new THREE.Vector3(0, 0, 0)
        this.gravity = new THREE.Vector3(0, -0.01, 0)
        this.wind = new THREE.Vector3(0.5, 0, 0)
        //ADD PLANE
        var geometryPlaneDown = new THREE.PlaneGeometry( 50, 50, 2 );
        var materialPlaneDown = new THREE.MeshStandardMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
        var planeDown = new THREE.Mesh( geometryPlaneDown, materialPlaneDown );
        this.scene.add( planeDown );
        this.start()
        document.addEventListener('mousedown', () => {
            this.applyForceSphere(this.wind);
        })
    }

    applyForceSphere = (force) => {
        this.acceleration.add(force);
    }

    updateSphere = () => {
        this.velocity.add(this.acceleration)
        this.cube.position.add(this.velocity)
        this.acceleration.multiplyScalar(0)
    }

    edgesSphere = () => {
        if (this.cube.position.y < -7) {
            this.velocity.y *= -1
            this.cube.position.y = -7;
        }
        if (this.cube.position.x > 12) {
            this.velocity.x *= -1
            this.cube.position.x = 12;
        }
        if (this.cube.position.x < -12) {
            this.velocity.x *= -1
            this.cube.position.x = -12;
        }
    }

    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop = () => {
        cancelAnimationFrame(this.frameId)
    }

    animate = () => {
        //this.cube.rotation.x += 0.01
        //this.cube.rotation.y += 0.01
        this.applyForceSphere(this.gravity)
        this.updateSphere()
        this.edgesSphere()
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    }

    render() {
        return(
        <div
            style={{ width: `${window.innerWidth}px`, height: `${window.innerHeight}px` }}
            ref={(mount) => { this.mount = mount }}
        />
        )
    }
}
export default ThreeScene