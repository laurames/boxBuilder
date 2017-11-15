/*
Software Studies for Media Designers final project
using guidlines at: http://softwarestudies.mlog.taik.fi/assignment/
teacher: Markku Reunanen & Jukka Eerikäinen
by Laura Meskanen-Kundu


 _                 _           _ _     _
| |__   _____  __ | |__  _   _(_) | __| | ___ _ __
| '_ \ / _ \ \/ / | '_ \| | | | | |/ _` |/ _ \ '__|
| |_) | (_) >  <  | |_) | |_| | | | (_| |  __/ |
|_.__/ \___/_/\_\ |_.__/ \__,_|_|_|\__,_|\___|_|

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
  camera = new THREE.PerspectiveCamera(35, window.innerWidth/(window.innerHeight-containerOffSet), 0.1, 10000);
  camera.position.z = 1;

  //trackball:
  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

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
  popSound.volume = 1;

  //start the animation loop:
  requestAnimationFrame( animate );

  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );

  window.addEventListener( 'resize', onWindowResize, false );
}

//animation loop
function animate() {
  if(dance){
    if(song.isOnBeat()){
      if(beatCount == 5){
        camera.position.x = 0;
      }else{
        camera.position.z = (Math.random()*15);
      }
      beatCount++;
    }
  }
  controls.update();
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
    if(e.keyCode == 39) {      // moving to right (arrow >)
      selected.object.position.x += xSpeed;
    }
    else if(e.keyCode == 37) { // moving left (arrow <)
      selected.object.position.x -= xSpeed;
    }
    else if(e.keyCode == 38) { // moving up (arrow ^)
      selected.object.position.y += ySpeed;
    }
    else if(e.keyCode == 40) { // moving down (arrow v)
      selected.object.position.y -= ySpeed;
    }
    else if(e.keyCode == 90) { // rotate object z towards (z)
      selected.object.position.z += zSpeed;
    }
    else if(e.keyCode == 88) { // rotate object z behind (x)
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
      popSound.play();
      selected = intersects[ 0 ];
      intersects[ 0 ].object.material.wireframe = true;
    }else{
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

  if(objects.length > 0){
    document.getElementById("removeEverything").disabled = false;
    document.getElementById("dancingCubes").disabled = false;
  }

  //console.log("selected is: " + selected);
  camera.position.set (0, 0, 1);
  scene.add(objects[objects.length-1]);
}

//removes cubes from scene
function removeCube(selected) {
  if(selected != undefined || selected != null){
    scene.remove(scene.getObjectByName(selected.object.name));
    objects.splice(objects[selected],1)
    console.log(objects);
  }
  if(objects.length<=0){
    document.getElementById("removeEverything").disabled = true;
    document.getElementById("dancingCubes").disabled = true;
  }
}

//get color from picker:
function setCubeColor(picker){
  cubeColor = '0x' + picker.toString();
}

function removeEverything(){
  while(scene.children.length > 0){
    scene.remove(scene.children[0]);
    objects = [];
  }
  if(objects.length<=0 || scene.children.length<=0){
    document.getElementById("removeEverything").disabled = true;
    document.getElementById("dancingCubes").disabled = true;
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

function lotsOfCubes(){
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshLambertMaterial();

  for ( var i = 0; i < 50; i ++ ) {
    var mesh = new THREE.Mesh( geometry, material );
    mesh.material.color.setHex('0x'+getRandomColor());
    mesh.position.x = ( Math.random() - 0.5 ) * 10;
    mesh.position.y = ( Math.random() - 0.5 ) * 10;
    mesh.position.z = ( Math.random() - 0.5 ) * -10;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = true;
    camera.position.set (0, 0, -15);
    if(i === 49){
      for( var x = 2; x < scene.children.length-2; x++) {
        objects.push(scene.children[x]);
      }

      //console.log(mesh);
      console.log(scene.children.slice(2, scene.children.length) );
      console.log(objects);
    }
    scene.add( mesh );
  }
  if(scene.children.length > 0){
    document.getElementById("removeEverything").disabled = false;
    document.getElementById("dancingCubes").disabled = false;
  }

  //console.log(scene);
}

function dancingCubes(){
  song = new stasilo.BeatDetector({
         sens: 				      5.0,
         visualizerFFTSize: 256,
         analyserFFTSize:   256,
         passFreq:          600,
         url:               "sounds/Black_Ant_realest_year_9.mp3" } );
  dance = true;
  console.log(song);
}

/*bug in the three.js library to reset camera https://github.com/mrdoob/three.js/issues/821
function cameraReset(){
  camera.position.set = (0, 0, 1);
  camera.rotation.set( 0, 0, 1 );
}*/

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
