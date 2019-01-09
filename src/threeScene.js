import React, { Component } from 'react';
import * as THREE from 'three';
import Button from './components/Button';

class ThreeScene extends Component {

    // GLOBAL VARIABLES SETUP
    mouse = {x: 0, y: 0};
    velocity = new THREE.Vector3(0, 0, 0);
    acceleration = new THREE.Vector3(0, 0, 0);
    gravity = new THREE.Vector3(0, -1, 0);
    wind = new THREE.Vector3(0.8, 0, 0);
    isGravity = false;
    isWind = false;
    maxSpeed = 6;
    maxForce = 0.5;
    mousePressed = false;
    spheres = [];

    componentDidMount() {
        this.setupScene();
        this.setupCamera();
        this.createLight();
        this.createRandomSphere();
        this.setupRenderer();
        this.animate();
        window.addEventListener( 'resize', this.onWindowResize, false );
        document.addEventListener('mousemove', this.onMouseMove, false);
        document.addEventListener('mousedown', this.onMouseClick, false)
        document.addEventListener('mouseup', this.onMouseRelease, false)
    }

    magSq = (vector) => {
        var x = vector.x;
        var y = vector.y;
        var z = vector.z;
        return x * x + y * y + z * z;
    }

    limit = (vector, max) => {
        var mSq = this.magSq(vector);
        if (mSq > max * max) {
            vector.normalize().multiplyScalar(max);
        }
        return vector;
    }

    heading = function heading(vector) {
        var h = Math.atan2(vector.y, vector.x);
        return h;
    }

    setupCamera () {
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
        this.camera.position.z = 1000;
        this.camera.lookAt(this.scene.position);
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xf0f0f0 );
        this.scene.add( new THREE.AmbientLight( 0x505050 ) );
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.mount.appendChild(this.renderer.domElement);
    }

    createLight() {
        var light = new THREE.SpotLight( 0xffffff, 1.5 );
        light.position.set( 0, 500, 2000 );
        light.angle = Math.PI / 9;
        light.castShadow = true;
        light.shadow.camera.near = 1000;
        light.shadow.camera.far = 4000;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        this.scene.add( light );
    }

    createRandomSphere() {
        var geometry = new THREE.SphereGeometry(5, 30, 30);
        geometry.translate(0, 0, 6)
        this.sphere = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        this.sphere.position.x = Math.random() * 1000 - 500;
        this.sphere.position.y = Math.random() * 600 - 300;
        this.sphere.position.z = 450;
        this.sphere.rotation.x = Math.random() * 2 * Math.PI;
        this.sphere.rotation.y = Math.random() * 2 * Math.PI;
        this.sphere.rotation.z = Math.random() * 2 * Math.PI;
        var scale = 6;
        this.sphere.scale.set(scale, scale, scale);
        this.sphere.receiveShadow = true;
        this.scene.add( this.sphere );
    }

    createSphere(x, y) {
        var geometry = new THREE.SphereGeometry(5, 30, 30);
        var sphere = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        geometry.translate(0, 0, 6)
        sphere.position.x = x
        sphere.position.y = y
        sphere.position.z = 450;
        var scale = 6;
        sphere.scale.set(scale, scale, scale);
        sphere.receiveShadow = true;
        this.scene.add( sphere );
        this.spheres.push(sphere)
    }

    // Follows the mouse event
    onMouseMove = (event) => {
        // Update the mouse variable
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
        vector.unproject( this.camera );
        var dir = vector.sub( this.camera.position ).normalize();
        // var distance = - this.camera.position.z / dir.z;
        var distance = ( this.sphere.position.z - this.camera.position.z ) / vector.z;
        var pos = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
        this.mouseInCanvas = pos
    }

    onMouseClick = (e) => {
        this.mousePressed = true
    }

    onMouseRelease = (e) => {
        this.mousePressed = false
    }

    onButtonClick = (target) => {
        switch(target) {
            case 'GRAVITY':
                this.isGravity = !this.isGravity;
                if (this.isGravity === false) {
                    this.acceleration = new THREE.Vector3(0, 0, 0);
                    this.velocity = new THREE.Vector3(0, 0, 0);
                }
                break;
            case 'WIND':
                this.isWind = !this.isWind;
                if (this.isWind === false) {
                    this.acceleration = new THREE.Vector3(0, 0, 0);
                    this.velocity = new THREE.Vector3(0, 0, 0);
                }
                break;
            case 'SEEK':
                this.isSeek = !this.isSeek;
                if (this.isSeek === false) {
                    this.acceleration = new THREE.Vector3(0, 0, 0);
                    this.velocity = new THREE.Vector3(0, 0, 0);
                }
                break;
        }
    }

    onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    applyForceSphere = (force) => {
        this.acceleration.add(force);
    }

    updateSphere = () => {
        this.velocity.add(this.acceleration)
        this.sphere.position.add(this.velocity)
        this.acceleration.multiplyScalar(0)
        var angle = this.heading(this.velocity.clone()) * Math.PI / 2
        this.sphere.rotation.setFromVector3(new THREE.Vector3(0, 0, angle))
        this.sphere.updateMatrixWorld()
    }

    updateSpheres = (velocitySpheres, accelerationSpheres, sphere) => {
        velocitySpheres.add(accelerationSpheres)
        sphere.position.add(velocitySpheres)
        accelerationSpheres.multiplyScalar(0)
    }

    seekVector = (target) => {
        var targetPos = target.clone();
        var desired = targetPos.sub(this.sphere.position);
        var desiredSetMag = this.setMagnitude(desired, this.maxSpeed);
        var steering = desiredSetMag.sub(this.velocity);
        var steeringLimited = this.limit(steering, this.maxForce)
        this.applyForceSphere(steeringLimited);
    }

    seekVectorSpheres = (target) => {
        var targetPos = target.clone();
        this.spheres.forEach(element => {
            var vel = new THREE.Vector3(0, 0, 0)
            var acc = new THREE.Vector3(0, 0, 0)
            this.updateSpheres(vel, acc, element)
            var desired = targetPos.sub(element.position)
            var desiredSetMag = this.setMagnitude(desired, this.maxSpeed)
            var steering = desiredSetMag.sub(vel)
            acc.add(steering)
        })
        for (let index = 0; index < this.spheres.length; index++) {
            const element = this.spheres[index];
        }
    }

    setMagnitude = function(vect, magnitude) {
        return vect.normalize().multiplyScalar(magnitude);
    };

    edgesSphere = () => {
        if (this.sphere.position.y < -(window.innerHeight / 2)) {
            this.velocity.y *= -1
            this.sphere.position.y = -(window.innerHeight / 2);
        }
        if (this.sphere.position.x > window.innerWidth / 2) {
            this.velocity.x *= -1
            this.sphere.position.x = window.innerWidth / 2;
        }
        if (this.sphere.position.x < -(window.innerWidth / 2)) {
            this.velocity.x *= -1
            this.sphere.position.x = -(window.innerWidth / 2);
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
        //this.sphere.rotation.x += 0.01
        //this.sphere.rotation.y += 0.01
        if (this.isGravity) {
            this.applyForceSphere(this.gravity)
        }
        if (this.isWind) {
            this.applyForceSphere(this.wind)
        }
        if (this.isSeek) {
            this.seekVector(this.mouseInCanvas);
            this.seekVectorSpheres(this.mouseInCanvas)
        }
        //this.seekVector(this.mousePosition)
        if (this.isGravity | this.isWind) {
            this.edgesSphere()
        }
        if (this.isGravity | this.isWind | this.isSeek) {
            this.updateSphere()
        }
        // if (this.mousePressed) {
        //     this.createSphere(this.mouseInCanvas.x, this.mouseInCanvas.y)
        // }
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
            >
                <Button name="GRAVITY" top="5" left="2.5" btnClicked={this.onButtonClick}></Button>
                <Button name="WIND" top="5" left="15" btnClicked={this.onButtonClick}></Button>
                <Button name="SEEK" top="5" left="27.6" btnClicked={this.onButtonClick}></Button>
            </div>
        );
    }
}
export default ThreeScene