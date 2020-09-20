'use strict';
const leftImagesElm = document.getElementById('left-image');
const rightImagesElm = document.getElementById('right-image');
const midImagesElm = document.getElementById('mid-image');
Product.all = [];
let round = 25;
const imagesPath = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];
const imagesName = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
//---------------
//Genrate Random Number
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
//-----------------
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
  let leftIndex = getRandomInt(0, Product.all.length);
  let midIndex = getRandomInt(0, Product.all.length);
  let rightIndex = getRandomInt(0, Product.all.length);
  //----No Replacte
  while (midIndex === leftIndex) {
    midIndex = getRandomInt(0, Product.all.length);
  }
  while (rightIndex === midIndex) {
    rightIndex = getRandomInt(0, Product.all.length);
  }
  while (rightIndex === leftIndex) {
    rightIndex = getRandomInt(0, Product.all.length);
  }

  Product.all[leftIndex].shown++;
  Product.all[midIndex].shown++;
  Product.all[rightIndex].shown++;

  //-----
  //--- Src Attribute
  leftImagesElm.src = Product.all[leftIndex].path;
  midImagesElm.src = Product.all[midIndex].path;
  rightImagesElm.src = Product.all[rightIndex].path;
  //---Alt Attribute
  leftImagesElm.alt = Product.all[leftIndex].title;
  midImagesElm.alt = Product.all[midIndex].title;
  rightImagesElm.alt = Product.all[rightIndex].title;
  //---Title Attribute
  leftImagesElm.title = Product.all[leftIndex].title;
  midImagesElm.title = Product.all[midIndex].title;
  rightImagesElm.title = Product.all[rightIndex].title;
}

//-----------------RenderLeftSection
function renderResult() {
  let articleElm = document.getElementById('result');
  let pElm = document.createElement('p');
  for (let i = 0; i < Product.all.length; i++) {
    articleElm.appendChild(pElm);
    pElm.textContent = `${Product.all[i].title} had ${Product.all[i].vote} votes and was shown ${Product.all[i].shown} times`;
    pElm = document.createElement('p');
  }

}
//-----------------Event
let sectionRight = document.getElementById('section-right');
sectionRight.addEventListener('click', voting);

function voting(event) {

  if (event.target.id === 'left-image' || event.target.id === 'mid-image' || event.target.id === 'right-image') {

    if (round <= 1) {
      sectionRight.removeEventListener('click', voting);
      renderResult();
    }

    for (let i = 0; i < Product.all.length; i++)
      if (event.target.title === Product.all[i].title) {
        Product.all[i].vote++;
      }

    round--;
    render();
  }

}

//------------Voting Round
let votingRound = document.getElementById('votingRound');
votingRound.addEventListener('click', rounds);
function rounds(event) {
  event.preventDefault();
  if (event.target.id === 'submit') {
    round = Number(document.getElementById('numRound').value);
    if (round <= 0) {
      sectionRight.removeEventListener('click', voting);
      renderResult();
    }
  }
  if (event.target.id === 'Restart')
    location.reload();
}


for (let i = 0; i < imagesPath.length; i++) {
  new Product(imagesName[i], imagesPath[i]);
}

render();

