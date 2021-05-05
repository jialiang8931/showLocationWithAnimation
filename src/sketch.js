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
let crop;
let date = new Date("2016-06-01")
let plotDiameter;
let sliderDate, sliderP;
let buttomStop, buttomMove, buttomBack;
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
  sliderP = createP("2016-06-01");
  buttomStop = createButton("STOP");
  buttomMove = createButton("＋");
  buttomBack = createButton("－");
  endP = createP("");
  dateP = createP("2016-06-01");
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

  buttomStop.position(300, windowHeight*0.92);
  buttomStop.mousePressed(stopAnimation);

  buttomMove.position(260, windowHeight*0.92);
  buttomMove.mousePressed(changeDay1);

  buttomBack.position(230, windowHeight*0.92);
  buttomBack.mousePressed(changeDay2);

  canvas.mousePressed(stopAnimation);

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
      crop = Number(well[2]);
      switch (crop) {
        case 1 : fill(  30, 144, 255, 180); break; // Dodger blue
        case 2 : fill(  85, 107,  47, 180); break; // Dark Olive Green
        case 3 : fill( 255, 105, 180, 180); break; // Hot Pink
        case 4 : fill( 255, 215,   0, 180); break; // Gold
        }
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
    date = new Date("2016-06-01");
  }

  // Show the frame rate of window.
  endP.html("frameRate:　" + round(frameRate()) + ";　days：" + (days+1));
  drawLegend();

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
    crop = Number(well[2]);
      switch (crop) {
        case 1 : fill(  30, 144, 255, 180); break; // Dodger blue
        case 2 : fill(  85, 107,  47, 180); break; // Dark Olive Green
        case 3 : fill( 255, 105, 180, 180); break; // Hot Pink
        case 4 : fill( 255, 215,   0, 180); break; // Gold
        }
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
  date = new Date("2016-06-01")
  date.setDate(date.getDate() + days);
  let M = date.getMonth()+1 >= 10 ? date.getMonth()+1 : "0" + (date.getMonth()+1);
  let D = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
  dateP.html(date.getFullYear()+ '-' + M + '-' + D );
  sliderP.html(date.getFullYear()+ '-' + M + '-' + D );
  
  // Show the frame rate of window.
  endP.html("frameRate:　" + round(frameRate()) + ";　days：" + (days+1));
  buttomStop.html("PLAY");
  drawLegend();
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




function changeDay1() {
  days = sliderDate.value() + 1;
  c = days;
  sliderDate.value(days);
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
    crop = Number(well[2]);
      switch (crop) {
        case 1 : fill(  30, 144, 255, 180); break; // Dodger blue
        case 2 : fill(  85, 107,  47, 180); break; // Dark Olive Green
        case 3 : fill( 255, 105, 180, 180); break; // Hot Pink
        case 4 : fill( 255, 215,   0, 180); break; // Gold
        }
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
      crop = Number(well[2]);
        switch (crop) {
          case 1 : fill(  30, 144, 255, 180); break; // Dodger blue
          case 2 : fill(  85, 107,  47, 180); break; // Dark Olive Green
          case 3 : fill( 255, 105, 180, 180); break; // Hot Pink
          case 4 : fill( 255, 215,   0, 180); break; // Gold
          }
      strokeWeight(1);
      ellipse(pos.x, pos.y, 30*sin(PI/2));
    }
  }
  
 // Show the date of events.
  date = new Date("2016-06-01")
  date.setDate(date.getDate() + days);
  let M = date.getMonth()+1 >= 10 ? date.getMonth()+1 : "0" + (date.getMonth()+1);
  let D = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
  dateP.html(date.getFullYear()+ '-' + M + '-' + D );
  sliderP.html(date.getFullYear()+ '-' + M + '-' + D );
  
  // Show the frame rate of window.
  endP.html("frameRate:　" + round(frameRate()) + ";　days：" + (days+1));
  buttomStop.html("PLAY");
  drawLegend();
  noLoop(); statusButtom = -1;
}



function changeDay2() {
  days = sliderDate.value() - 1;
  c = days;
  sliderDate.value(days);
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
    crop = Number(well[2]);
      switch (crop) {
        case 1 : fill(  30, 144, 255, 180); break; // Dodger blue
        case 2 : fill(  85, 107,  47, 180); break; // Dark Olive Green
        case 3 : fill( 255, 105, 180, 180); break; // Hot Pink
        case 4 : fill( 255, 215,   0, 180); break; // Gold
        }
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
      crop = Number(well[2]);
        switch (crop) {
          case 1 : fill(  30, 144, 255, 180); break; // Dodger blue
          case 2 : fill(  85, 107,  47, 180); break; // Dark Olive Green
          case 3 : fill( 255, 105, 180, 180); break; // Hot Pink
          case 4 : fill( 255, 215,   0, 180); break; // Gold
        }
      strokeWeight(1);
      ellipse(pos.x, pos.y, 30*sin(PI/2));
    }
  }
  
 // Show the date of events.
  date = new Date("2016-06-01")
  date.setDate(date.getDate() + days);
  let M = date.getMonth()+1 >= 10 ? date.getMonth()+1 : "0" + (date.getMonth()+1);
  let D = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
  dateP.html(date.getFullYear()+ '-' + M + '-' + D );
  sliderP.html(date.getFullYear()+ '-' + M + '-' + D );
  
  // Show the frame rate of window.
  endP.html("frameRate:　" + round(frameRate()) + ";　days：" + (days+1));
  buttomStop.html("PLAY");
  drawLegend();
  noLoop(); statusButtom = -1;
}



function drawLegend() {
  let offset = 20;
  let offsetText = 7;
  let offsetMig = 16;
  let refPx = 25;
  let refPy = height - 116;

  stroke(0, 200);
  fill( 255, 180);
  rect( refPx-20, refPy-18, 140, 126);

  textSize(20);
  textStyle(BOLD);
  stroke(255);
  fill(0);
  text('LEGEND', refPx-18, refPy - 22 + offset*0);

  textSize(16);
  textStyle(NORMAL);
  stroke(0);
  strokeWeight(0.1);
  
  text('PADDY', refPx+offsetMig, refPy + offset*0+ offsetText);
  text('DROUGHT', refPx+offsetMig, refPy + offset*1.5+ offsetText);
  text('VEGETABLE', refPx+offsetMig, refPy + offset*3+ offsetText);
  text('ROTATION', refPx+offsetMig, refPy + offset*4.5+offsetText);

  stroke(0, 180);
  strokeWeight(1);
  fill(  30, 144, 255, 180); // Dodger blue
  ellipse(refPx, refPy+offset*0, 20*sin(PI/2));

  fill(  85, 107,  47, 180); // Dark Olive Green
  ellipse(refPx, refPy+offset*1.5, 20*sin(PI/2));

  fill( 255, 105, 180, 180); // Hot Pink
  ellipse(refPx, refPy+offset*3.0, 20*sin(PI/2));

  fill( 255, 215,   0, 180); // Gold
  ellipse(refPx, refPy+offset*4.5, 20*sin(PI/2));

}