const titleText = document.querySelectorAll('.title__svg path');

const colorLines = document.querySelector('.color-lines');

const rangeSlider = document.querySelector('.range-slider__slider');

const canvas = document.querySelector('.grid-container__grid');

const colorPicker = document.querySelector('.buttons-container__input-color');

const clearAllBtn = document.querySelector('.clear-all');

const radioBtns = document.querySelectorAll('input[type="radio"]');
console.log(radioBtns);

let canvasSize = 51;

// Draw Etch-a-Sketch
const drawTitle = () => {
  titleText.forEach((letter, i) => {
    letter.style.strokeDasharray = letter.getTotalLength();
    letter.style.strokeDashoffset = letter.getTotalLength();
    letter.style.animation = `title-animation 0.5s ease forwards ${
      0.25 * i - 3
    }s`;
  });
};
drawTitle();

rangeSlider.oninput = () => {
  console.log(rangeSlider.value);
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
    divsContainer.appendChild(canvasDiv);
    // console.log(i);
  }
  canvas.appendChild(divsContainer);
};

rangeSlider.addEventListener('change', () => {
  console.log('levantaste');
  canvasSize = rangeSlider.value;
  updateCanvasSize();
});

const getRandomNumber = () => {
  return Math.floor(Math.random() * 255);
};

const getRandomColor = () => {
  return `rgb(${getRandomNumber()},${getRandomNumber()},${getRandomNumber()})`;
};

const paintDiv = (e) => {
  const target = e.target.closest('.grid-container__grid-div');

  // if (!e.target.closest('.grid-container__grid-div') || e.buttons !== 1) return;
  if (!target || e.buttons !== 1) return;
  // e.target.closest('.grid-container__grid-div').style.backgroundColor = colorPicker.value;
  if (radioBtns[0].checked) target.style.backgroundColor = colorPicker.value;

  if (radioBtns[3].checked) target.style.backgroundColor = getRandomColor();
};

canvas.addEventListener('mouseover', paintDiv);

////////
// COLOR
const drawColorLines = () => {
  colorLines.style.animation = ``;
  colorLines.style.strokeDasharray = colorLines.getTotalLength();
  colorLines.style.strokeDashoffset = colorLines.getTotalLength();
  colorLines.style.animation = `title-animation 2.5s ease-in-out forwards`;
};
drawColorLines();

colorPicker.addEventListener('change', function (e) {
  colorLines.style.stroke = colorPicker.value;
  drawColorLines();
});

clearAllBtn.addEventListener('click', updateCanvasSize);

updateCanvasSize();
