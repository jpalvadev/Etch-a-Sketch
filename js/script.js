const titleText = document.querySelectorAll('.title__svg path');
const radioBtn3 = document.querySelector(
  '.buttons-container__radio-btn--3 path'
);

console.log(titleText);

titleText.forEach((letter, i) => {
  letter.style.strokeDasharray = letter.getTotalLength();
  letter.style.strokeDashoffset = letter.getTotalLength();
  letter.style.animation = `title-animation 0.5s ease forwards ${
    0.25 * i - 3
  }s`;
});

console.log(radioBtn3);

radioBtn3.style.strokeDasharray = radioBtn3.getTotalLength();
console.log(radioBtn3.getTotalLength());

radioBtn3.style.strokeDashoffset = radioBtn3.getTotalLength();
radioBtn3.style.animation = `title-animation 5s ease forwards`;
