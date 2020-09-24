/* eslint-disable no-undef */
'use strict';
//-----------------------
//Varibales
Product.all = [];
const imagesPath = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];
const imagesName = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
let round = 25;
let hold = [];// hold Previous Images
let indexArr = []; //hold images
let numOfImg = 3; // Defult Shown Number of image
let imgAccess = true; // Check If its the first load for images
let fristTime = true; //to make object just 1 time on start
//---
const artElm = document.getElementById('ArticleSubmit'); //For the Images in Article
const articleElm = document.getElementById('result'); //  Result Article
const sectionLeft = document.getElementById('section-left'); // Left section
const sectionRight = document.getElementById('section-right'); // Right Section
//-----------------------
//Genrate Random Number
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
//-----------------------
//Constructor
function Product(name, path) {
  this.title = name;
  this.path = `img/${path}`;
  this.vote = 0;
  this.shown = 0;
  Product.all.push(this);
}
//-----------------------
//Check if there duplicate Photo in same line
function noDuplicateH() {

  for (let i = 0; i < numOfImg; i++) {
    for (let k = 0; k < indexArr.length; k++) {
      if (i === k)
        continue;
      else {
        if (indexArr[i] === indexArr[k]) {
          indexArr[i] = (getRandomInt(0, Product.all.length));
          k = -1;
        }
      }
    }
  }
  return true;
}
//-----------------------
//Check if there duplicate Photo with last Previous image
function noDuplicate() {

  for (let i = 0; i < indexArr.length; i++) {
    for (let k = 0; k < hold.length; k++) {
      if (indexArr[i] === hold[k]) {
        indexArr[i] = getRandomInt(0, Product.all.length);
        noDuplicateH();
        noDuplicate();

      }
    }
  }
  return true;
}
//-----------------------
//RenderRightSection
function render() {
  if (localStorage.getItem('numImg') !== null)
    numOfImg = localStorage.getItem('numImg');
  //---
  //Create first img set
  for (let i = 0; i < numOfImg; i++) {
    indexArr[i] = (getRandomInt(0, Product.all.length));
  }
  //---
  noDuplicateH();
  if (hold.length !== 0) //No duplicate in first time
    noDuplicate();
  //---
  hold = indexArr.slice(); //Make a copy for Previous Image

  let imgElm = document.createElement('img');

  if (imgAccess === true)
    for (let i = 0; i < indexArr.length; i++) {
      imgElm = document.createElement('img');
      artElm.appendChild(imgElm);
      imgElm.id = i;
    }
  imgAccess = false;
  //Assign images to index and make it as shown
  for (let i = 0; i < indexArr.length; i++) {
    Product.all[indexArr[i]].shown++;
    imgElm = document.getElementById(i);
    imgElm.src = Product.all[indexArr[i]].path;//--- Src Attribute
    imgElm.alt = Product.all[indexArr[i]].title;//---Alt Attribute
    imgElm.title = Product.all[indexArr[i]].title;//---Title Attribute
  }

}
//-----------------------
//RenderLeftSection
function renderResult() {
  sectionLeft.style.display = 'block';
  sectionRight.style.width = '65%';
  articleElm.style.overflow = 'scroll';
  //Create the result at once
  let pElm = document.createElement('p');
  for (let i = 0; i < Product.all.length; i++) {
    pElm = document.createElement('p');
    pElm.innerHTML = `<span>${Product.all[i].title}</span> had (<span>${Product.all[i].vote}</span>) votes and was shown (<span>${Product.all[i].shown}</span>) times`;
    articleElm.appendChild(pElm);
  }
  storeData();
  chartMake();
}
//-----------------------
//Event for voting and get new images after vote
sectionRight.addEventListener('click', voting);
function voting(event) {
  let start = false; //to start or function job

  //check that we click on an image
  for (let k = 0; k < indexArr.length; k++) {
    if (Number(event.target.id) === k)
      start = true;
  }
  //---
  if (start) {
    //Check the object of image and incement vote
    for (let i = 0; i < Product.all.length; i++)
      if (event.target.title === Product.all[i].title) {
        Product.all[i].vote++;
      }
    if (round <= 1) {
      sectionRight.removeEventListener('click', voting);
      renderResult();
    }
    else {
      round--;
      render();
    }
    //Stop the event listener after rounds end
  }

}
//-----------------------
//User Voting Rounds/Images number Change/restart website Button
let votingRound = document.getElementById('votingRound');
votingRound.addEventListener('click', rounds);
function rounds(event) {
  event.preventDefault();
  //Submit for new rounds number and reset website
  if (event.target.id === 'submit') {
    round = Number(document.getElementById('numRound').value);
    localStorage.setItem('round', round);
    document.location.reload();
    if (round <= 0) {
      sectionRight.removeEventListener('click', voting);
      renderResult();
    }
  }
  //Reload the website
  if (event.target.id === 'Restart')
    location.reload();

  //change photo number that show up
  if (event.target.id === 'Change') {
    numOfImg = Number(document.getElementById('imgNumber').value);
    localStorage.setItem('numImg', numOfImg);
    if (numOfImg >= 1 && numOfImg <= Product.all.length) {
      imgAccess = true;
      indexArr = [];
      artElm.innerHTML = ''; //Empty the article
      //reset shown
      for (let i = 0; i < Product.all.length; i++) {
        Product.all[i].shown = 0;
      }
      render();
    }
  }
}
//-----------------------
//reset round after submit out range
window.addEventListener('load', function () {
  round = localStorage.getItem('round');
  if (round === null)
    round = 25;
  if (round <= 0) {
    sectionRight.removeEventListener('click', voting);
    renderResult();
  }
  localStorage.removeItem('round');
  localStorage.removeItem('numImg');

});
//-----------------------
//ChartMaker Variables(change type)
let type = 'bar';
let pass = false;
let inputListElm = document.getElementById('ChartType');
inputListElm.addEventListener('change', chartTypeChose);
function chartTypeChose(event) {
  type = event.target.value;
  pass = true;
  renderResult();

}
let canvasContiner = document.getElementById('canvas-container');
let canvasElm = document.createElement('canvas');
canvasElm.id = 'myChart';
canvasContiner.appendChild(canvasElm);
//-----------------------
//ChartMaker
function chartMake() {
  let shows = [], votes = [];
  for (let i = 0; i < Product.all.length; i++) {
    shows.push(Product.all[i].shown);
    votes.push(Product.all[i].vote);
  }
  if (pass) {
    canvasElm.parentNode.removeChild(canvasElm);
    canvasElm = document.createElement('canvas');
    canvasElm.id = 'myChart';
    canvasContiner.appendChild(canvasElm);
  }
  const ctx = document.getElementById('myChart').getContext('2d');
  if (pass) {
    ctx.clearRect(0, 0, canvasElm.width, canvasElm.height);
  }

  canvasElm.style.display = 'block';

  // eslint-disable-next-line no-unused-vars
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: type,

    // The data for our dataset
    data: {
      labels: imagesName,
      datasets: [{//Vote bar Part
        label: 'Votes',
        backgroundColor: 'rgb(25, 99, 132,0.7)',
        borderColor: 'rgb(25, 99, 132)',
        data: votes,
        maxBarThickness: 15,
        hoverBackgroundColor: 'yellow',
      }, { //Shows bar Part
        label: 'Shows',
        backgroundColor: 'rgb(255, 99, 12,0.7)',
        borderColor: 'rgb(255, 99, 132)',
        data: shows,
        maxBarThickness: 15,
        hoverBackgroundColor: 'yellow',
      }]
    },
    // Configuration options go here
    options: {
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Bus Mall Product Bar',
      }, scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: 'red'
          },
        }],
        xAxes: [{
          ticks: {
            fontColor: 'red'
          },
        }]
      }
    }
  });
}
//-----------------------
//Storing Previous data
function storeData() {
  localStorage.setItem('myProducts', JSON.stringify(Product.all));
}
//-----------------------
//Recover Previous data
function retraveData() {
  var myData = JSON.parse(localStorage.getItem('myProducts'));
  if (myData) {
    Product.all = [];
    for (let i = 0; i < myData.length; i++) {
      new Product(imagesName[i], imagesPath[i]);
      Product.all[i].vote += myData[i].vote;
      Product.all[i].shown += myData[i].shown;
    }
  }
}
//-----------------------
//Create Objects
if (fristTime) {
  for (let i = 0; i < imagesPath.length; i++) {
    new Product(imagesName[i], imagesPath[i]);
  }
  fristTime = false;
}
//-----------------------
//Call Render Page
render();
retraveData();
