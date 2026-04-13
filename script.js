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
    let city = 'São Paulo'; // Cidade padrão (Fallback)

    try {
        // Tenta buscar a cidade por IP usando HTTPS
        // Adicionamos um pequeno delay/timeout para não travar o site se a API demorar
        const ipResponse = await fetch('https://ipapi.co/json/', { timeout: 5000 });

        if (ipResponse.ok) {
            const ipData = await ipResponse.json();
            if (ipData.city) {
                city = ipData.city;
            }
        }

        // Agora busca o clima
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        // Se a cidade não for encontrada pela OpenWeather (às vezes o nome vem diferente)
        if (data.cod === "404") {
            // Tenta de novo com a cidade padrão
            const fallbackUrl = `https://api.openweathermap.org/data/2.5/weather?q=Sao Paulo&units=metric&lang=pt_br&appid=${apiKey}`;
            const fbResponse = await fetch(fallbackUrl);
            const fbData = await fbResponse.json();
            exibirClima(fbData, "São Paulo");
        } else {
            exibirClima(data, city);
        }

    } catch (error) {
        console.error("Erro na localização/clima:", error);
        document.getElementById('weather-info').innerHTML = "O clima perfeito para um TAHOR ☕";
    }
}

// Criamos uma função separada para organizar a exibição e não repetir código

function exibirClima(data, nomeCidade) {
    if (!data || !data.main || !data.weather) {
        console.error("Dados incompletos:", data);
        return;
    }

    const temp = Math.round(data.main.temp);
    // Forçamos o lowercase para evitar erros de comparação
    const desc = data.weather[0].description.toLowerCase();

    // Pega a hora atual do sistema do usuário
    const hora = new Date().getHours();
    const eNoite = (hora >= 18 || hora < 6);

    let emoji = "☁️"; // Emoji padrão caso não entre nos IFs

    // Verificação mais flexível (aceita PT e EN)
    if (desc.includes("limpo") || desc.includes("clear") || desc.includes("sol")) {
        emoji = eNoite ? "🌙" : "☀️";
    } else if (desc.includes("nuvens") || desc.includes("cloud") || desc.includes("nublado")) {
        emoji = eNoite ? "☁️" : "🌥️";
    } else if (desc.includes("chuva") || desc.includes("rain")) {
        emoji = "🌧️";
    }

    const infoElement = document.getElementById('weather-info');
    if (infoElement) {
        infoElement.innerHTML = `${nomeCidade} ${emoji} | ${temp}°C — <span style="text-transform: capitalize;">${desc}</span>`;
    } else {
        console.error("Erro: O elemento #weather-info não foi encontrado no HTML desta página.");
    }
}

// --- INICIALIZAÇÃO AO CARREGAR A PÁGINA ---
window.onload = function () {
    getWeather();
    // Você pode adicionar outras funções aqui se precisar futuramente
};