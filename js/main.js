/*
Software Studies for Media Designers final project
using guidlines at: http://softwarestudies.mlog.taik.fi/assignment/
teacher: Markku Reunanen & Jukka Eerikäinen
by Laura Meskanen-Kundu
*/

//global variables
var selected = null,
    canvas = document.getElementById('myCanvas'),
    dance = false,
    beatCount = 0,
    containerOffSet = document.getElementById('container').offsetHeight;

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
    song,
    controls;

var objects = []; //array of movable cubes
var counter = 0; //number of boxes created

//setup
function init(){
  renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myCanvas')});
  renderer.setClearColor(0xfdfdfd);
  renderer.setSize(window.innerWidth, window.innerHeight-containerOffSet);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  //camera is always at postion (0, 0, 0):
  camera = new THREE.PerspectiveCamera(35, window.innerWidth/(window.innerHeight-containerOffSet), 0.1, 1000);
  camera.position.z = 1;
  
  //controls for swinging the camera around:
  //controls = new THREE.OrbitControls( camera, renderer.domElement );
  //controls.enableZoom = true; //way too dificult for user to understand
  
  //trackball:
  /*controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;*/
  
  //create the scene:
  scene = new THREE.Scene();
  
  //the light:
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  pointLight = new THREE.PointLight(0xffffff, 0.5);
  scene.add(ambientLight, pointLight);
  
  //creating a rayCaster that will catch objects so we can move them
  //it is there but cast into the wrong place
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
  renderer.render(scene,camera);
  requestAnimationFrame( animate );
}

// movement
var xSpeed = 0.1;
var ySpeed = 0.1;
var zSpeed = 0.1;

//key pressed and we move our box we just created
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(e) {
  var keyCode = event.which;
  if(selected != undefined || selected != null){
    if(e.keyCode == 39) {      // moving to right
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

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / (window.innerHeight+containerOffSet) ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects( objects );
  if( event.clientY > containerOffSet ){
    if ( intersects.length > 0 ) {
      console.log("in raycaster");
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

//removes cubes from scene
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

function removeEverything(){
  while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
  }
}

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
  camera.aspect = window.innerWidth / (window.innerHeight-containerOffSet);
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight-containerOffSet );
}

//give a warning if there is no WebGL
if (Detector.webgl) {
  // Initiate function if user has webgl
  init();
} else {
  var warning = Detector.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);
}