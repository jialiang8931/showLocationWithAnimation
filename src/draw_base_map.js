
function drawCity() {
  clear();
  push();
  noFill();
  strokeWeight(3);

  beginShape();
  for (let i = 0; i < shpCity.length; i+=20) {
    let pos = myMap.latLngToPixel(shpCity[i][1], shpCity[i][0]);
    vertex(pos.x, pos.y);
  }
  endShape(CLOSE);
}



function onChangeDrawCity() {
  clear();
  push();
  noFill();
  strokeWeight(3);
  let curZoom = myMap.zoom();

  beginShape();
  for (let i = 0; i < shpCity.length; i+=20) {
    let pos = myMap.latLngToPixel(shpCity[i][1], shpCity[i][0]);
    vertex(pos.x, pos.y);
  }
  endShape(CLOSE);



}