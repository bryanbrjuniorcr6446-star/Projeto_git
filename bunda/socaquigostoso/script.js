/**
 * Lógica do Jogo: Cachorro Fantasma - A Fuga
 */

const canvas = document.getElementById("horrorCanvas");
const ctx = canvas.getContext("2d");
const timerElement = document.getElementById("timer");
const deathScreen = document.getElementById("deathScreen");

// Configurações do Jogo
let player, enemy, particles, gameActive, startTime, mouseX, mouseY;
let heartbeat = 0; // Para efeito visual de pulsação

function init() {
    player = { x: 300, y: 250, size: 40 };
    enemy = { x: -50, y: -50, size: 55, speed: 1.8 };
    particles = [];
    gameActive = true;
    startTime = Date.now();
    mouseX = 300;
    mouseY = 250;
    
    deathScreen.style.display = "none";
    requestAnimationFrame(gameLoop);
}

// Captura movimento do mouse
window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

function update() {
    if (!gameActive) return;

    // Movimento suave do jogador
    player.x += (mouseX - player.x) * 0.08;
    player.y += (mouseY - player.y) * 0.08;

    // Perseguição do inimigo
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    enemy.x += (dx / distance) * enemy.speed;
    enemy.y += (dy / distance) * enemy.speed;

    // Dificuldade progressiva
    enemy.speed += 0.0012;
    heartbeat += 0.05 + (enemy.speed * 0.02); // Pulsação acelera com a dificuldade

    // Cronômetro
    const timePassed = Math.floor((Date.now() - startTime) / 1000);
    timerElement.innerText = timePassed;

    // Colisão
    if (distance < 35) {
        gameOver(timePassed);
    }
}

function draw() {
    // Limpar tela com rastro (efeito de movimento)
    ctx.fillStyle = "rgba(5, 5, 5, 0.3)"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Lanterna (Campo de Visão Dinâmico)
    const pulse = Math.sin(heartbeat) * 10;
    const gradient = ctx.createRadialGradient(
        player.x, player.y, 10, 
        player.x, player.y, 180 + pulse
    );
    gradient.addColorStop(0, "rgba(100, 0, 0, 0.2)"); // Luz avermelhada
    gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar Inimigo
    const distToEnemy = Math.sqrt((player.x - enemy.x)**2 + (player.y - enemy.y)**2);
    ctx.save();
    ctx.globalAlpha = distToEnemy < 220 ? 1 : 0; // Só aparece se estiver perto da luz
    ctx.shadowBlur = 15;
    ctx.shadowColor = "red";
    ctx.font = "55px Arial";
    ctx.fillText("🐺", enemy.x - 27, enemy.y + 20);
    ctx.restore();

    // Desenhar Jogador
    ctx.font = "40px Arial";
    ctx.shadowBlur = 5;
    ctx.shadowColor = "white";
    ctx.fillText("🐕", player.x - 20, player.y + 15);

    if (gameActive) {
        update();
        requestAnimationFrame(draw);
    }
}

function gameOver(score) {
    gameActive = false;
    deathScreen.style.display = "flex";
    document.getElementById("finalTime").innerText = `Você sobreviveu por ${score} segundos.`;
}

function gameLoop() {
    draw();
}

// Iniciar ao carregar
window.onload = init;
