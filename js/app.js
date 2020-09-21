'use strict';
Product.all = [];
let firstTime = true;
let round = 25;
const imagesPath = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];

const imagesName = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
const artElm = document.getElementById('ArticleSubmit');
let articleElm = document.getElementById('result');
const sectionLeft = document.getElementById('section-left');
let sectionRight = document.getElementById('section-right');

let numOfImg = 3;
let indexArr = [];
//---------------
//Genrate Random Number
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
//------------
//----------------- Constructor
function Product(name, path) {
  this.title = name;
  this.path = `img/${path}`;
  this.vote = 0;
  this.shown = 0;
  Product.all.push(this);
}
//-----------------
//-----------------RenderRightSection
function render() {
  if (sessionStorage.getItem('numImg')!==null)
    numOfImg = sessionStorage.getItem('numImg');

  for (let i = 0; i < numOfImg; i++) {
    indexArr[i] = (getRandomInt(0, Product.all.length));
  }
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

  //-----
  //--- Src Attribute
  let imgElm = document.createElement('img');

  if (firstTime === true)
    for (let i = 0; i < indexArr.length; i++) {
      imgElm = document.createElement('img');
      artElm.appendChild(imgElm);
      imgElm.id = i;
    }
  firstTime = false;
  for (let i = 0; i < indexArr.length; i++) {
    Product.all[indexArr[i]].shown++;
    imgElm = document.getElementById(i);
    imgElm.src = Product.all[indexArr[i]].path;//--- Src Attribute
    imgElm.alt = Product.all[indexArr[i]].title;//---Alt Attribute
    imgElm.title = Product.all[indexArr[i]].title;//---Title Attribute
  }

}
//------------
//-----------------RenderLeftSection
function renderResult() {
  sectionLeft.style.display='block';
  sectionRight.style.width='65%';

  let pElm = document.createElement('p');
  for (let i = 0; i < Product.all.length; i++) {
    pElm = document.createElement('p');
    pElm.innerHTML = `<span>${Product.all[i].title}</span> had (<span>${Product.all[i].vote}</span>) votes and was shown (<span>${Product.all[i].shown}</span>) times`;
    articleElm.appendChild(pElm);
  }
  articleElm.style.overflow='scroll';
}
//------------
//-----------------Event
sectionRight.addEventListener('click', voting);
function voting(event) {
  let start = false;
  for (let k = 0; k < indexArr.length; k++) {
    if (Number(event.target.id) === k)
      start = true;
  }
  if (start) {

    for (let i = 0; i < Product.all.length; i++)
      if (event.target.title === Product.all[i].title) {
        Product.all[i].vote++;
      }

    if (round <= 1) {
      sectionRight.removeEventListener('click', voting);
      renderResult();
    }
    round--;
    render();
  }

}
//------------
//------------Voting Round
let votingRound = document.getElementById('votingRound');
votingRound.addEventListener('click', rounds);
function rounds(event) {
  event.preventDefault();
  if (event.target.id === 'submit') {
    round = Number(document.getElementById('numRound').value);
    sessionStorage.setItem('round', round);
    document.location.reload();
    if (round <= 0) {
      sectionRight.removeEventListener('click', voting);
      renderResult();
    }
  }
  if (event.target.id === 'Restart')
    location.reload();

  if (event.target.id === 'Change') {

    numOfImg = Number(document.getElementById('imgNumber').value);
    sessionStorage.setItem('numImg',numOfImg);
    if (numOfImg >= 1 && numOfImg<=Product.all.length) {
      firstTime = true;
      indexArr = [];
      artElm.innerHTML = '';
      for (let i = 0; i < Product.all.length; i++) {
        Product.all[i].shown = 0;
      }
      render();
    }
  }
}
//------------
//------------Create Objects
for (let i = 0; i < imagesPath.length; i++) {
  new Product(imagesName[i], imagesPath[i]);
}
//------------
//------------Call Render Page
render();
window.addEventListener('load', function () {
  round = sessionStorage.getItem('round');

  if (round === null)
    round = 25;

  if (round <= 0) {
    sectionRight.removeEventListener('click', voting);
    renderResult();
  }
  sessionStorage.removeItem('round');
  sessionStorage.removeItem('numImg');

});
