const titleText = document.querySelectorAll('.title__svg path');

console.log(titleText);

titleText.forEach((letter, i) => {
  letter.style.strokeDasharray = letter.getTotalLength();
  letter.style.strokeDashoffset = letter.getTotalLength();
  letter.style.animation = `title-animation 0.5s ease forwards ${
    0.25 * i - 3
  }s`;
});
