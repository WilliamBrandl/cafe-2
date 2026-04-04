// --- CONFIGURAÇÕES DO CARROSSEL ---
const slides = document.querySelector('.slides');
const images = document.querySelectorAll('.slides img');
const dots = document.querySelectorAll('.dot');
let index = 0;

function atualizarDots() {
    if (dots.length > 0) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
}

function carrossel() {
    index++;
    if (index > images.length - 1) {
        index = 0;
    }
    if (slides) {
        slides.style.transform = `translateX(${-index * 100}%)`;
        atualizarDots();
    }
}

// Inicia o carrossel a cada 4 segundos
setInterval(carrossel, 4000);

// --- FUNÇÃO DO CLIMA COM EMOJIS DINÂMICOS (DIA/NOITE) ---
async function getWeather() {
    const apiKey = '7ac2bb399a2c778fbadb99d04bffc72c';
    let city = 'São Paulo'; // Cidade padrão caso algo falhe

    try {
        // 1. BUSCA A LOCALIZAÇÃO PELO IP (Sem pedir permissão ao usuário)
        const ipResponse = await fetch('https://ipapi.co/json/');
        const ipData = await ipResponse.json();

        if (ipData.city) {
            city = ipData.city;
        }

        // 2. BUSCA O CLIMA DA CIDADE ENCONTRADA
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.main) {
            const temp = Math.round(data.main.temp);
            const desc = data.weather[0].description.toLowerCase();

            // Lógica de Noite/Dia
            const hora = new Date().getHours();
            const eNoite = (hora >= 18 || hora < 6);

            let emoji = "☕";
            if (desc.includes("céu limpo") || desc.includes("sol")) {
                emoji = eNoite ? "🌙" : "☀️";
            } else if (desc.includes("nuvens") || desc.includes("nublado")) {
                emoji = eNoite ? "☁️" : "🌥️";
            } else if (desc.includes("chuva")) {
                emoji = "🌧️";
            }

            const infoElement = document.getElementById('weather-info');
            if (infoElement) {
                // Exibe a cidade real encontrada pelo IP
                infoElement.innerHTML = `${city} ${emoji} | ${temp}°C — <span style="text-transform: capitalize;">${desc}</span>`;
            }
        }
    } catch (error) {
        console.error("Erro na localização/clima:", error);
        const infoElement = document.getElementById('weather-info');
        if (infoElement) infoElement.innerHTML = "O clima perfeito para um TAHOR ☕";
    }
}

// --- INICIALIZAÇÃO AO CARREGAR A PÁGINA ---
window.onload = function () {
    getWeather();
    // Você pode adicionar outras funções aqui se precisar futuramente
};