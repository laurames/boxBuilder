/*
Software Studies for Media Designers final project
using guidlines at: http://softwarestudies.mlog.taik.fi/assignment/
teacher: Markku Reunanen & Jukka Eerikäinen
by Laura Meskanen-Kundu
*/

//global variables
var windowHalfX = window.innerWidth / 2,
		windowHalfY = window.innerHeight / 2,
    selected = null,
    canvas = document.getElementById('myCanvas'),
    dance = false,
    beatCount = 0;

var scene,
    camera,
    controls,
    renderer,
    ambientLight,
    pointLight,
    raycaster,
    mouse,
    cubeColor,
    popSound,
    song;

var objects = []; //array of movable cubes
var counter = 0; //number of boxes created

//setup
function init(){
  renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myCanvas')});
  renderer.setClearColor(0xfdfdfd);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  //camera is always at postion (0, 0, 0):
  camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 0;
  
  //controls for swinging the camera around:
  //controls = new THREE.OrbitControls( camera, renderer.domElement );
  //controls.enableZoom = true; //way too dificult for user to understand
  
  //create the scene:
  scene = new THREE.Scene();
  
  //the light:
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  pointLight = new THREE.PointLight(0xffffff, 0.5);
  scene.add(ambientLight, pointLight);
  
  //creating a rayCaster that will catch objects so we can move them
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Initialize audio
  popSound = new Audio('../sounds/pop.wav');
  popSound.volume = 0.1;
  
  //start the animation loop:
  requestAnimationFrame( animate );
  
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  
  window.addEventListener( 'resize', onWindowResize, false );
}

//animation loop
function animate() {
  /*if(dance){
    if(song.isOnBeat()){
      if(beatCount == 5){
        camera.position.x = 0;
      }else{
        camera.position.y = (Math.random()*10);
      }
      beatCount++;
    }
  }*/
  renderer.render(scene,camera);
  requestAnimationFrame( animate );
}

// movement - please calibrate these values
var xSpeed = 0.1;
var ySpeed = 0.1;
var zSpeed = 0.1;

//key pressed and we move our box we just created
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(e) {
  var keyCode = event.which;
  if(selected != undefined || selected != null){
    if(e.keyCode == 39) { // moving to right
      selected.object.position.x += xSpeed;
    }
    else if(e.keyCode == 37) { // moving left
      selected.object.position.x -= xSpeed;
    }
    else if(e.keyCode == 38) { // moving up
      selected.object.position.y += ySpeed;
    }
    else if(e.keyCode == 40) { // moving down
      selected.object.position.y -= ySpeed;
    }
    else if(e.keyCode == 90) { // rotate object z towards
      selected.object.position.z += zSpeed;
    }
    else if(e.keyCode == 88) { // rotate object z behind
      selected.object.position.z -= zSpeed;
    }
  }
  
}

function onDocumentTouchStart( event ) {
  event.preventDefault();

  event.clientX = event.touches[0].clientX;
  event.clientY = event.touches[0].clientY;
  onDocumentMouseDown( event );

}

function onDocumentMouseDown( event ) {
  event.preventDefault();

  mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects( objects );
  if( event.clientY > document.getElementById('container').offsetHeight ){
    if ( intersects.length > 0 ) {
      popSound.play();
      selected = intersects[ 0 ];
      intersects[ 0 ].object.material.wireframe = true;
    }else{
      console.log("in else");
      removeWireframe();
    }
  }
}

function removeWireframe(){
  for(var i in objects){
    objects[i].material.wireframe = false;
    selected = null;
    i++;
  }
}

//adds cubes to scene
function addCube(){
  //the cube
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshLambertMaterial(); //one can place any color
  
  objects.push(new THREE.Mesh(geometry,material));
  objects[objects.length-1].material.color.setHex(cubeColor);
  objects[objects.length-1].position.set(0, 0, -10);
  objects[objects.length-1].name = counter;
  console.log(objects);
  counter++;
  
  console.log("selected is: " + selected);
  
  scene.add(objects[objects.length-1]);
}

//removes cubes to scene
function removeCube(selected) {
  if(selected != undefined || selected != null){
    console.log("in remove");
    scene.remove(scene.getObjectByName(selected.object.name));
    objects.splice(objects[selected],1)
    console.log(objects);
  }
}

//get color from picker:
function setCubeColor(picker){
  cubeColor = '0x' + picker.toString();
}

/*function lotsOfCubes(){
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshLambertMaterial();
  
  for ( var i = 0; i < 50; i ++ ) {
    var mesh = new THREE.Mesh( geometry, material );
    mesh.material.color.setHex('0x'+getRandomColor());
    mesh.position.x = ( Math.random() - 0.5 ) * 10;
    mesh.position.y = ( Math.random() - 0.5 ) * 10;
    mesh.position.z = ( Math.random() - 0.5 ) * 10;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = true;
    scene.add( mesh );
  }
  
  console.log(scene);
}*/

function removeEverything(){
  while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
  }
}

/* Extra not yet done
function dancingCubes(){
  song = new stasilo.BeatDetector({
         sens: 				      5.0,
         visualizerFFTSize: 256, 
         analyserFFTSize:   256, 
         passFreq:          600,
         url:               "sounds/Ryan_Little-Good_Grief.mp3" } );
  dance = true;
  console.log(song);
}

function stopDancing(){
  if(sound != undefined || sound != null){
    dance = false;
    song.stop();
  }
}*/

//random hexColor code:
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//keep the scene looking good
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

//give a warning if there is no WebGL
if (Detector.webgl) {
  // Initiate function if user has webgl
  init();
} else {
  var warning = Detector.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);
}