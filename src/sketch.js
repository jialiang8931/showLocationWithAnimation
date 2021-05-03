const mappa = new Mappa('Leaflet');
let myMap;
let canvas;
let endP;

let config;
let layerCity;
let shpCity;

let dataWells = [];
let infoWell;
let oriZoom;

function preload() {
  config = loadJSON("./config/config.json");
  layerCity = loadJSON('./assets/layer/huwei-city.geojson');
  dataWells = loadTable("./assets/layer/points.csv", 'header');
  console.log("Done!!!");
}


function setup() {
  canvas = createCanvas(windowWidth*0.9, windowHeight*0.9);
  myMap = mappa.tileMap(config);
  myMap.overlay(canvas);
  endP = createP("");
  endP.position(10, windowHeight*0.95); 

  shpCity = layerCity["features"][0]["geometry"]["coordinates"][0][0];
  myMap.onChange(onChangeDrawCity);
  frameRate(12);


}

var c=0;
function draw(){
  clear();
  drawCity();
  for (let i = 0; i < dataWells.rows.length; i++){
    let row = dataWells.rows[i];
    let x = dataWells.rows[i].get("X(WGS84)");
    let y = dataWells.rows[i].get("Y(WGS84)");
    let pos = myMap.latLngToPixel(y, x);
    fill(0, 255, 125, 125);
    strokeWeight(1);
    ellipse(pos.x, pos.y, 20*(( myMap.zoom()**2 / config.zoom**2 ))*sin(c*0.125) );
  }
  c++;
  endP.html(frameRate());
}
