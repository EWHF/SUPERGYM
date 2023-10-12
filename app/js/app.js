const play = document.querySelector('.play');
const preview = document.querySelector('.preview');

play.addEventListener('click', (event) => {
  play.classList.add('hide');
  preview.classList.add('hide');
  document.querySelector('iframe').src='https://www.youtube.com/embed/7cIVLb9qPQY?autoplay=1';
})

const tabs = document.querySelectorAll('.js-tab');

tabs.forEach(button => {
  button.addEventListener('click',()=> {
    document.querySelector('.js-tab.active').classList.remove('active');
    document.querySelector('.js-tab-content.active').classList.remove('active');
    button.classList.add('active');
    document.querySelector(`[data-tab-content="${button.dataset.tabButton}"]`).classList.add('active');
  });
});