const slides = document.querySelector('.slides');
const images = document.querySelectorAll('.slides img');
const dots = document.querySelectorAll('.dot');
let index = 0;

function atualizarDots() {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function carrossel() {
    index++;

    if (index > images.length - 1) {
        index = 0;
    }

    slides.style.transform = `translateX(${-index * 100}%)`;
    atualizarDots();
}

// Inicia o intervalo automático
setInterval(carrossel, 4000); // 4 segundos para dar tempo de apreciar a imagem