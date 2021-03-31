const titleText = document.querySelectorAll('.title__svg path');
const modalText = document.querySelectorAll('.modal__svg path');
const modal = document.querySelector('.modal');
const tools = document.querySelectorAll('.tools-container img');
const colorLines = document.querySelector('.color-lines');
const rangeSlider = document.querySelector('.range-slider__slider');
const canvas = document.querySelector('.grid-container__grid');
const inputColor = document.querySelector('.buttons-container__input-color');
const clearAllBtn = document.querySelector('.clear-all');
const radioBtns = document.querySelectorAll('input[type="radio"]');
const radioBtnContainer = document.querySelectorAll(
  '.buttons-container__radio-btn-container'
);
const gridSizeText = document.querySelector(
  '.grid-container__grid-size--right'
);
let canvasSize = 51;
let prevTouchedDiv = '';
let currentTouchedDiv = '';

///////////////////////////////
// DYNAMIC MEDIA QUERY DETECTOR
let mediaqueryList = window.matchMedia('(orientation:portrait)');
const mediaqueryDetector = (tall) => {
  if (tall.matches) {
    modal.classList.add('visible');
    drawModalText();
  } else {
    modal.classList.remove('visible');
  }
};

/////////////
// ANIMATIONS
const setupSvgAnimation = (svg) => {
  svg.style.animation = ``;
  svg.style.strokeDasharray = svg.getTotalLength();
  svg.style.strokeDashoffset = svg.getTotalLength();
};
const drawTitle = () => {
  titleText.forEach((letter, i) => {
    setupSvgAnimation(letter);
    letter.style.animation = `title-animation 0.5s ease forwards ${
      0.25 * i - 3
    }s`;
  });
};
const drawModalText = () => {
  modalText.forEach((word, i) => {
    setupSvgAnimation(word);
    word.style.animation = `title-animation 1.5s linear forwards ${1.5 * i}s`;
  });
};
const drawColorLines = () => {
  setupSvgAnimation(colorLines);
  colorLines.style.animation = `title-animation 2.5s ease-in-out forwards`;
};

/////////
// CANVAS
rangeSlider.oninput = () => {
  gridSizeText.textContent = `${rangeSlider.value} X ${rangeSlider.value}`;
};

const calcWidth = () => {
  const canvasHeight = window
    .getComputedStyle(canvas, null)
    .getPropertyValue('height');
  canvas.style.width = canvasHeight;
};

const updateCanvasSize = () => {
  // More performance
  let divsContainer = document.createDocumentFragment();

  canvas.innerHTML = '';

  canvas.style.gridTemplateRows = `repeat(${canvasSize}, 1fr)`;
  canvas.style.gridTemplateColumns = `repeat(${canvasSize}, 1fr)`;

  for (let i = 0; i < canvasSize * canvasSize; i++) {
    const canvasDiv = document.createElement('div');
    canvasDiv.classList.add('grid-container__grid-div');
    canvasDiv.id = i;
    canvasDiv.style.backgroundColor = 'rgb(255, 255, 255)';
    divsContainer.appendChild(canvasDiv);
  }
  canvas.appendChild(divsContainer);
};

//////////////
// COLOR LOGIC
const removeRGBText = (rgbString) => {
  return rgbString.slice(4, -1).split(',');
};
const getRandomNumber = () => {
  return Math.floor(Math.random() * 255);
};
const getRandomColor = () => {
  return `rgb(${getRandomNumber()},${getRandomNumber()},${getRandomNumber()})`;
};

const modifyColor = (target, command) => {
  let newColor = removeRGBText(target.style.backgroundColor)
    .map((color) => {
      if (command === 'lighten') return +color + 25;
      else return +color - 25;
    })
    .join(',');
  return `rgb(${newColor})`;
};

const paintStyle = (target) => {
  if (radioBtns[0].checked) target.style.backgroundColor = inputColor.value;
  if (radioBtns[1].checked) {
    target.style.backgroundColor = modifyColor(target, 'lighten');
  }
  if (radioBtns[2].checked) {
    target.style.backgroundColor = modifyColor(target, 'darken');
  }
  if (radioBtns[3].checked) target.style.backgroundColor = getRandomColor();
};

const setActiveTool = (e) => {
  tools.forEach((tool) => tool.classList.remove('active'));
  e.target.classList.add('active');
  if (!tools[0].classList.contains('active')) {
    radioBtnContainer.forEach((btn) => (btn.style.opacity = '0'));
  } else radioBtnContainer.forEach((btn) => (btn.style.opacity = '1'));
};

///////////////
// COLOR PICKER
const rgbToHex = (rgb) => {
  const pickedColor = removeRGBText(rgb)
    .map((color) => {
      let hex = Number(color).toString(16);
      if (hex.length < 2) hex = '0' + hex;
      return hex;
    })
    .join('');
  return `#${pickedColor}`;
};

const getColorPicked = (e) => {
  if (!tools[2].classList.contains('active')) return;
  const divColor = e.target.style.backgroundColor;
  colorLines.style.stroke = divColor;
  inputColor.value = rgbToHex(divColor);
  drawColorLines();
};

const getActiveTool = (target) => {
  if (tools[0].classList.contains('active')) {
    paintStyle(target);
  }
  if (tools[1].classList.contains('active')) {
    target.style.backgroundColor = 'rgb(255, 255, 255)';
  }
};

const paintDivMouse = (e) => {
  const target = e.target.closest('.grid-container__grid-div');
  if (!target || e.buttons !== 1) return;
  getActiveTool(target);
};

const paintDivTouch = (e) => {
  e.preventDefault();

  const changedTouch = e.changedTouches[0];
  const target = document.elementFromPoint(
    changedTouch.clientX,
    changedTouch.clientY
  );
  currentTouchedDiv = target.id;

  if (!target.closest('.grid-container__grid-div')) return;
  if (currentTouchedDiv !== prevTouchedDiv) {
    prevTouchedDiv = currentTouchedDiv;
    getActiveTool(target);
  }
};

const init = () => {
  tools.forEach((tool) => {
    tool.addEventListener('click', setActiveTool);
  });

  rangeSlider.addEventListener('change', () => {
    canvasSize = rangeSlider.value;
    updateCanvasSize();
  });
  inputColor.value = '#444444';
  inputColor.addEventListener('change', function (e) {
    colorLines.style.stroke = inputColor.value;
    radioBtns[0].checked = true;
    drawColorLines();
  });
  canvas.addEventListener('click', getColorPicked);
  canvas.addEventListener('mouseover', paintDivMouse);
  canvas.addEventListener('touchmove', paintDivTouch);
  clearAllBtn.addEventListener('click', updateCanvasSize);
  mediaqueryList.addEventListener('change', mediaqueryDetector);
  updateCanvasSize();
  gridSizeText.textContent = `${rangeSlider.value} X ${rangeSlider.value}`;

  // Uncomment to make the canvas a perfect square, but check out _grid-container.scss before doing so
  // calcWidth();
  // window.onresize = calcWidth;
  drawColorLines();
  drawTitle();
  mediaqueryDetector(mediaqueryList);
};

init();
