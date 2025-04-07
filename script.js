let carro = document.getElementById("carro");
    let pontuacaoElement = document.getElementById("pontuacao");
    let vidasElement = document.getElementById("vidas");
    let gameOverScreen = document.getElementById("gameOver");
    let pauseMenu = document.getElementById("pauseMenu");
    let pauseButton = document.getElementById("pauseButton");
    
    let posX = 175;
    let velocidade = 5;
    let pontuacao = 0;
    let vidas = 3;
    let jogoAtivo = true;
    let intervalos = [];

    // Controles do Carro
    document.addEventListener("keydown", (e) => {
      if (!jogoAtivo) return;
      e.preventDefault();
      
      switch(e.key) {
        case "ArrowLeft": posX = Math.max(0, posX - 20); break;
        case "ArrowRight": posX = Math.min(350, posX + 20); break;
      }
      carro.style.left = posX + "px";
    });

    // Sistema de Obstáculos
    function criarObstaculo() {
      const isPowerup = Math.random() < 0.1; // 10% chance de powerup
      const elemento = document.createElement("div");
      elemento.className = isPowerup ? "powerup" : "obstaculo";
      
      elemento.style.cssText = `
        left: ${Math.random() * 350}px;
        top: -100px;
        width: ${isPowerup ? "40px" : "50px"};
        height: ${isPowerup ? "40px" : "80px"};
        position: absolute;
      `;

      gameContainer.appendChild(elemento);
      moverElemento(elemento);
    }

    function moverElemento(elemento) {
      let posY = -100;
      const intervalo = setInterval(() => {
        if (!jogoAtivo) return;
        
        posY += velocidade;
        elemento.style.top = posY + "px";

        // Remover elemento ao sair da tela
        if (posY > 600) {
          elemento.remove();
          clearInterval(intervalo);
          intervalos.splice(intervalos.indexOf(intervalo), 1);
          return;
        }

        // Verificar colisão
        if (verificarColisao(elemento, carro)) {
          elemento.remove();
          clearInterval(intervalo);
          intervalos.splice(intervalos.indexOf(intervalo), 1);

          if (elemento.classList.contains("powerup")) {
            vidas += 1; // Permite aumentar além de 3
            mostrarFeedbackVida(elemento);
          } else {
            vidas = Math.max(0, vidas - 1);
            if (vidas === 0) gameOver(); // Só termina quando chegar a 0
          }
          atualizarHUD();
        }
      }, 20);
      intervalos.push(intervalo);
    }

    function mostrarFeedbackVida(elemento) {
      const feedback = document.createElement("div");
      feedback.className = "vida-extra";
      feedback.textContent = "+1 VIDA!";
      feedback.style.left = elemento.style.left;
      feedback.style.top = elemento.style.top;
      gameContainer.appendChild(feedback);
      setTimeout(() => feedback.remove(), 1000);
    }

    function verificarColisao(a, b) {
      const rectA = a.getBoundingClientRect();
      const rectB = b.getBoundingClientRect();
      return !(
        rectA.right < rectB.left ||
        rectA.left > rectB.right ||
        rectA.bottom < rectB.top ||
        rectA.top > rectB.bottom
      );
    }

    // Sistema de Jogo
    function atualizarHUD() {
      pontuacaoElement.textContent = pontuacao;
      vidasElement.textContent = '❤️'.repeat(vidas);
      pontuacao += Math.floor(velocidade);
      velocidade += 0.005;
    }

    function gameOver() {
      jogoAtivo = false;
      gameOverScreen.style.display = "block";
      document.getElementById("finalScore").textContent = pontuacao;
      intervalos.forEach(clearInterval);
    }

    function reiniciarJogo() {
      location.reload();
    }

    function pausarJogo() {
      jogoAtivo = !jogoAtivo;
      pauseMenu.style.display = jogoAtivo ? "none" : "block";
      pauseButton.textContent = jogoAtivo ? "⏸️ Pausar" : "▶️ Continuar";
    }

    function continuarJogo() {
      pausarJogo();
    }

    // Loop principal
    setInterval(() => {
      if (jogoAtivo) {
        criarObstaculo();
        atualizarHUD();
      }
    }, 1000);

    // Inicialização
    for (let i = 0; i < 3; i++) criarObstaculo();