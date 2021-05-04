const mappa = new Mappa('Leaflet');
let myMap;
let canvas;
let endP;

let config;
let layerCity;
let shpCity;

let dataWells = [];
let dataEvents;
let infoWell;
let date = new Date("1970-08-01")
let plotDiameter;
let sliderDate, sliderP;
let bottomStop;
let statusButtom = 1;

function preload() {
  config = loadJSON("./config/config.json");
  layerCity = loadJSON('./assets/layer/huwei-city.geojson');
  dataWells = loadTable("./assets/layer/points.csv", 'header');
  dataEvents = loadTable("./assets/data/events.csv", 'header');
  console.log("Done!!!");
}


function setup() {
  canvas = createCanvas(windowWidth*0.99, windowHeight*0.9);
  myMap = mappa.tileMap(config);
  myMap.overlay(canvas);
  sliderDate = createSlider(0, dataEvents.rows.length-1, 0);
  sliderP = createP("1970-08-01");
  buttomStop = createButton("STOP");
  endP = createP("");
  dateP = createP("1970-08-01");
  dateP.position(70, 0); 
  dateP.style("z-index", "100"); dateP.style("font-size", "30"); 
  dateP.style("background", "#ffffffa3"); 
  endP.position(10, windowHeight*0.95); 
  // plotDiameter helps the buffer has breath light effect.
  plotDiameter = PI/2+1;

  shpCity = layerCity["features"][0]["geometry"]["coordinates"][0][0];
  myMap.onChange(onChangeDrawCity);

  sliderDate.position(10, windowHeight*0.92);
  sliderP.position(150, windowHeight*0.905);
  sliderDate.input(plotDateEvent);

  buttomStop.position(250, windowHeight*0.92);
  buttomStop.mousePressed(stopAnimation);
  frameRate(12)



}

let days = 0;
let c = 0;
function draw() {
  clear();
  drawCity();


  // This part is trying to plot the location of well.
  let totalDays = dataEvents.rows.length;
  let totalWells = dataEvents.columns.length;
  for (let i = 0; i < totalWells; i++) {
    let well = dataEvents.columns[i].split(',');
    let x = Number(well[1]); 
    let y = Number(well[0]); 
    let pos = myMap.latLngToPixel(y, x);
    fill(0, 0, 0, 255);
    strokeWeight(1);
    ellipse(pos.x, pos.y, 6, 6);

    fill(255, 255, 255, 255);
    strokeWeight(1);
    ellipse(pos.x, pos.y, 4, 4);



  // This part is trying to plot events.
    if (dataEvents.rows[days].get(dataEvents.columns[i]) === "1" ) {
      let well = dataEvents.columns[i].split(',');
      let x = Number(well[1]); 
      let y = Number(well[0]); 
      let pos = myMap.latLngToPixel(y, x);
      fill(0, 0, 255, 125);
      strokeWeight(1);
      ellipse(pos.x, pos.y, 30*sin(plotDiameter));
    }

  }
  let interval = 0.2;
  c += interval;
  plotDiameter -= PI/2 * interval*1.25;
  // plotDiameter helps the buffer has breath light effect.
  if ((floor(c)-days) === 1) {plotDiameter = PI/2+1;}


 // Show the date of events.
  days = floor(c);
  if ( (round(c,3) % 1) === 0 && (c > 1)) {
    date.setDate(date.getDate() + 1);
    let M = date.getMonth()+1 >= 10 ? date.getMonth()+1 : "0" + (date.getMonth()+1);
    let D = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
    sliderDate.value(days);
    sliderP.html(date.getFullYear()+ '-' + M + '-' + D );
    dateP.html(date.getFullYear()+ '-' + M + '-' + D );
  }  
  
  // Reset the date of events.
  if (c >= dataEvents.rows.length-1) {
    c = 0;
    date = new Date("1970-08-01");
  }

  // Show the frame rate of window.
  endP.html("frameRate:　" + round(frameRate()) + ";　days：" + (days+1));
}



function plotDateEvent(){
  c = sliderDate.value();
  clear();
  drawCity();

  // This part is trying to plot the location of well.
  let totalDays = dataEvents.rows.length;
  let totalWells = dataEvents.columns.length;
  for (let i = 0; i < totalWells; i++) {
    let well = dataEvents.columns[i].split(',');
    let x = Number(well[1]); 
    let y = Number(well[0]); 
    let pos = myMap.latLngToPixel(y, x);
    fill(0, 0, 0, 255);
    strokeWeight(1);
    ellipse(pos.x, pos.y, 6, 6);

    fill(255, 255, 255, 255);
    strokeWeight(1);
    ellipse(pos.x, pos.y, 4, 4);

  // This part is trying to plot events.
    if (dataEvents.rows[days].get(dataEvents.columns[i]) === "1" ) {
      let well = dataEvents.columns[i].split(',');
      let x = Number(well[1]); 
      let y = Number(well[0]); 
      let pos = myMap.latLngToPixel(y, x);
      fill(0, 0, 255, 125);
      strokeWeight(1);
      ellipse(pos.x, pos.y, 30*sin(PI/2));
    }
  }

 // Show the date of events.
  days = floor(c);
  date = new Date("1970-08-01")
  date.setDate(date.getDate() + days);
  let M = date.getMonth()+1 >= 10 ? date.getMonth()+1 : "0" + (date.getMonth()+1);
  let D = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
  dateP.html(date.getFullYear()+ '-' + M + '-' + D );
  sliderP.html(date.getFullYear()+ '-' + M + '-' + D );
  
  // Show the frame rate of window.
  endP.html("frameRate:　" + round(frameRate()) + ";　days：" + (days+1));
  buttomStop.html("PLAY");
  noLoop(); statusButtom = -1;

}

function stopAnimation(){
  statusButtom *= -1
  if (statusButtom === -1) {
    buttomStop.html("PLAY");
    noLoop();
  } 

  if (statusButtom === 1) {
    buttomStop.html("STOP");
    loop();
  }

}