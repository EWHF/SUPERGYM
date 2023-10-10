

const play = document.querySelector(".play");

const preview = document.querySelector(".preview");

play.addEventListener("click", (event) => {
  
  play.classList.add("hide");

  preview.classList.add("hide");

  document.querySelector("iframe").src="https://www.youtube.com/embed/7cIVLb9qPQY?autoplay=1";
  
})

