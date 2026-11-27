// ============================================================
// SCARY SPACE GAME - Lógica principal do jogo
// ============================================================

const canvas = document.getElementById("tela-jogo");
const ctx = canvas.getContext("2d");

// Elementos da interface (HUD e Modais)
const textoTerminais = document.getElementById("texto-terminais");
const textoPontos = document.getElementById("texto-pontos");
const textoLaser = document.getElementById("texto-laser");
const textoModoCorrida = document.getElementById("modo-corrida");
const barraEstamina = document.getElementById("barra-estamina");
const avisoInteracao = document.getElementById("aviso-interacao");
const bannerFeedback = document.getElementById("banner-feedback");

const modalInicio = document.getElementById("modal-inicio");
const modalPergunta = document.getElementById("modal-pergunta");
const modalFim = document.getElementById("modal-fim");

const etiquetaPergunta = document.getElementById("etiqueta-pergunta");
const tituloPergunta = document.getElementById("titulo-pergunta");
const enunciadoPergunta = document.getElementById("enunciado-pergunta");
const listaOpcoes = document.getElementById("lista-opcoes");
const explicacaoBox = document.getElementById("explicacao-box");
const textoExplicacao = document.getElementById("texto-explicacao");

// Botões
const btnComecar = document.getElementById("btn-comecar");
const btnContinuarJogo = document.getElementById("btn-continuar-jogo");
const btnReiniciar = document.getElementById("btn-reiniciar");
const btnTema = document.getElementById("btn-tema");
const btnAjuda = document.getElementById("btn-ajuda");
const btnInteragir = document.getElementById("btn-interagir");
const btnCorrer = document.getElementById("btn-correr");
const btnLaser = document.getElementById("btn-laser");

// ============================================================
// BANCO DE PERGUNTAS (10 Terminais + Perguntas de Defesa)
// Nível sobe aos poucos: fáceis no início, desafios maiores depois
// ============================================================

const perguntasTerminais = [
  {
    materia: "Língua Inglesa • Gírias (Nível 1)",
    titulo: "Tradução no corredor",
    enunciado: "Um tripulante deixou um bilhete: 'This mission is a piece of cake!'. O que 'piece of cake' significa?",
    opcoes: [
      "Algo muito fácil de fazer",
      "Um problema gigante",
      "Hora do lanche na nave"
    ],
    correta: 0,
    explicacao: "'Piece of cake' é uma gíria usada para dizer que algo é 'moleza' ou muito fácil."
  },
  {
    materia: "Matemática • Regra de Três (Nível 1)",
    titulo: "Cilindros de Oxigênio",
    enunciado: "2 cilindros garantem oxigênio por 6 horas. Quantas horas 5 cilindros iguais vão durar?",
    opcoes: [
      "12 horas",
      "15 horas",
      "10 horas"
    ],
    correta: 1,
    explicacao: "Cada cilindro dura 3 horas (6 ÷ 2 = 3). Logo, 5 cilindros × 3 horas = 15 horas."
  },
  {
    materia: "Língua Inglesa • Gírias (Nível 1)",
    titulo: "Aviso de Rádio",
    enunciado: "No rádio você ouve: 'Hang in there! Help is coming.' O que a pessoa está dizendo?",
    opcoes: [
      "Desista agora!",
      "Aguente firme!",
      "Desligue os motores!"
    ],
    correta: 1,
    explicacao: "'Hang in there' é uma expressão muito comum para encorajar alguém a não desistir e aguentar firme."
  },
  {
    materia: "Matemática • Regra de Três (Nível 2)",
    titulo: "Velocidade da Nave",
    enunciado: "Uma sonda percorre 120 km em 3 minutos. Mantendo o ritmo, quantos quilômetros percorre em 7 minutos?",
    opcoes: [
      "240 km",
      "280 km",
      "300 km"
    ],
    correta: 1,
    explicacao: "Em 1 minuto ela anda 40 km (120 ÷ 3). Multiplicando 40 × 7 minutos, temos 280 km."
  },
  {
    materia: "Língua Inglesa • Gírias (Nível 2)",
    titulo: "Diário do Capitão",
    enunciado: "O capitão escreveu: 'I'm feeling under the weather today.' Como ele está se sentindo?",
    opcoes: [
      "Cheio de energia",
      "Um pouco doente ou indisposto",
      "Com muito frio"
    ],
    correta: 1,
    explicacao: "'Under the weather' significa estar meio mal, indisposto ou com início de gripe."
  },
  {
    materia: "Matemática • Regra de Três (Nível 2)",
    titulo: "Baterias da Lanterna",
    enunciado: "Com 4 baterias carregadas, o radar funciona por 18 dias. Quantos dias ele funciona com 6 baterias?",
    opcoes: [
      "24 dias",
      "27 dias",
      "30 dias"
    ],
    correta: 1,
    explicacao: "4 está para 18 assim como 6 está para x: (6 × 18) ÷ 4 = 108 ÷ 4 = 27 dias."
  },
  {
    materia: "Língua Inglesa • Gírias (Nível 3)",
    titulo: "Segredo no Laboratório",
    enunciado: "Alguém gritou: 'Don't spill the beans about the alien!' O que 'spill the beans' quer dizer?",
    opcoes: [
      "Derrubar a comida no chão",
      "Contar um segredo antes da hora",
      "Ligar o alarme vermelho"
    ],
    correta: 1,
    explicacao: "'Spill the beans' é a gíria para 'dar com a língua nos dentes' ou revelar um segredo."
  },
  {
    materia: "Matemática • Regra de Três (Nível 3)",
    titulo: "Escudo Térmico",
    enunciado: "Para resfriar o reator, 3 bombas levam 20 minutos. Se usarmos 5 bombas iguais juntas, quanto tempo leva? (Atenção: mais bombas = menos tempo!)",
    opcoes: [
      "12 minutos",
      "33 minutos",
      "15 minutos"
    ],
    correta: 0,
    explicacao: "É inversamente proporcional! Mais bombas reduzem o tempo: (3 × 20) ÷ 5 = 60 ÷ 5 = 12 minutos."
  },
  {
    materia: "Língua Inglesa • Gírias (Nível 3)",
    titulo: "Fim de Turno",
    enunciado: "O engenheiro disse: 'We fixed the door, let's call it a day.' O que ele propôs?",
    opcoes: [
      "Encerrar o trabalho por hoje",
      "Trabalhar a noite inteira",
      "Chamar reforços pelo telefone"
    ],
    correta: 0,
    explicacao: "'Call it a day' significa encerrar as atividades ou dar o trabalho do dia por concluído."
  },
  {
    materia: "Matemática • Regra de Três (Nível Final)",
    titulo: "Combustível de Fuga",
    enunciado: "Para viajar 450 anos-luz, a nave gasta 18 toneladas de plasma. Quantas toneladas precisa para 600 anos-luz?",
    opcoes: [
      "22 toneladas",
      "24 toneladas",
      "25 toneladas"
    ],
    correta: 1,
    explicacao: "450 está para 18 assim como 600 está para x: (600 × 18) ÷ 450 = 10.800 ÷ 450 = 24 toneladas."
  }
];

const perguntasDefesaMonstro = [
  {
    materia: "DEFESA DE EMERGÊNCIA • Inglês",
    titulo: "O monstro te encurralou!",
    enunciado: "Responda rápido para escapar: O que significa a gíria 'Break a leg!' antes de uma apresentação ou missão?",
    opcoes: [
      "Boa sorte!",
      "Cuidado para não cair!",
      "Corra o mais rápido que puder!"
    ],
    correta: 0,
    explicacao: "'Break a leg' é uma gíria famosa usada para desejar 'boa sorte'!"
  },
  {
    materia: "DEFESA DE EMERGÊNCIA • Matemática",
    titulo: "O monstro bloqueou o corredor!",
    enunciado: "Calcule rápido para ativar o escudo: Se 5 passos levam 2 segundos, quantos segundos levam 20 passos no mesmo ritmo?",
    opcoes: [
      "6 segundos",
      "8 segundos",
      "10 segundos"
    ],
    correta: 1,
    explicacao: "20 passos é 4 vezes maior que 5 passos, então 2 segundos × 4 = 8 segundos."
  },
  {
    materia: "DEFESA DE EMERGÊNCIA • Inglês",
    titulo: "Ataque surpresa!",
    enunciado: "Se alguém diz 'That new spacesuit costs an arm and a leg', o traje é:",
    opcoes: [
      "Muito barato",
      "Extremamente caro",
      "Feito sob medida"
    ],
    correta: 1,
    explicacao: "'Cost an arm and a leg' significa custar os olhos da cara (muito caro)."
  },
  {
    materia: "DEFESA DE EMERGÊNCIA • Matemática",
    titulo: "Última chance!",
    enunciado: "Uma impressora 3D faz 8 peças em 12 minutos. Quantas peças ela faz em 30 minutos?",
    opcoes: [
      "18 peças",
      "20 peças",
      "24 peças"
    ],
    correta: 1,
    explicacao: "(8 × 30) ÷ 12 = 240 ÷ 12 = 20 peças."
  }
];

// ============================================================
// MAPA DO LABIRINTO (19 colunas x 11 linhas, blocos de 40px)
// 1 = parede metálica, 0 = corredor
// ============================================================
const TAMANHO_BLOCO = 40;
const mapaLabirinto = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,1],
  [1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Posições fixas dos 10 terminais nos corredores
const posicoesTerminais = [
  { col: 3, lin: 1 },
  { col: 7, lin: 3 },
  { col: 15, lin: 1 },
  { col: 1, lin: 5 },
  { col: 9, lin: 5 },
  { col: 17, lin: 5 },
  { col: 3, lin: 7 },
  { col: 13, lin: 7 },
  { col: 1, lin: 9 },
  { col: 17, lin: 9 }
];

// ============================================================
// ESTADO DO JOGO
// ============================================================
let estado = {
  rodando: false,
  pausado: false,
  tempoInicio: 0,
  tempoAcumuladoMs: 0,
  pontos: 0,
  terminaisResolvidos: 0,
  cargasLaser: 3,
  correndo: false,
  estamina: 100,
  raioFeixeLaser: 0,
  indiceDefesa: 0
};

const jogador = {
  x: 1.5 * TAMANHO_BLOCO,
  y: 1.5 * TAMANHO_BLOCO,
  raio: 11,
  velAndar: 135,
  velCorrer: 225,
  anguloLanterna: 0
};

const monstro = {
  x: 17.5 * TAMANHO_BLOCO,
  y: 9.5 * TAMANHO_BLOCO,
  raio: 13,
  velocidadeBase: 92,
  tempoStun: 0,
  tempoImunidade: 0
};

let terminais = [];
const teclas = {};
let perguntaAtual = null;
let tipoPerguntaAtual = "terminal"; // "terminal" ou "monstro"
let terminalAlvo = null;
let ultimoFrame = 0;

// ============================================================
// INICIALIZAÇÃO E REINÍCIO
// ============================================================
function prepararPartida() {
  estado.rodando = true;
  estado.pausado = false;
  estado.tempoInicio = performance.now();
  estado.tempoAcumuladoMs = 0;
  estado.pontos = 0;
  estado.terminaisResolvidos = 0;
  estado.cargasLaser = 3;
  estado.correndo = false;
  estado.estamina = 100;
  estado.raioFeixeLaser = 0;
  estado.indiceDefesa = 0;

  // Posição inicial do jogador (canto superior esquerdo)
  jogador.x = 1.5 * TAMANHO_BLOCO;
  jogador.y = 1.5 * TAMANHO_BLOCO;
  jogador.anguloLanterna = 0;

  // Posição inicial do monstro (canto inferior direito)
  resetarPosicaoMonstro();
  monstro.tempoStun = 0;
  monstro.tempoImunidade = 1.5;

  // Cria os 10 terminais
  terminais = posicoesTerminais.map((pos, idx) => ({
    id: idx,
    x: (pos.col + 0.5) * TAMANHO_BLOCO,
    y: (pos.lin + 0.5) * TAMANHO_BLOCO,
    resolvido: false,
    pergunta: perguntasTerminais[idx]
  }));

  atualizarHUD();
  notificarAlturaPortal();
}

function resetarPosicaoMonstro() {
  monstro.x = 17.5 * TAMANHO_BLOCO;
  monstro.y = 9.5 * TAMANHO_BLOCO;
}

// ============================================================
// CONTROLES DE TECLADO E BOTÕES NA TELA
// ============================================================
window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  teclas[k] = true;

  if (!estado.rodando || estado.pausado) return;

  if (k === "f") {
    alternarCorrida();
  } else if (k === "e") {
    tentarInteragirTerminal();
  } else if (k === " " || e.code === "Space") {
    e.preventDefault();
    dispararLaser();
  }
});

window.addEventListener("keyup", (e) => {
  teclas[e.key.toLowerCase()] = false;
});

// Controles touch/mouse para movimento
document.querySelectorAll(".btn-controle").forEach((btn) => {
  const dir = btn.dataset.dir;
  const mapaDir = { cima: "w", baixo: "s", esquerda: "a", direita: "d" };
  const teclaSimulada = mapaDir[dir];

  const ativar = (e) => {
    e.preventDefault();
    teclas[teclaSimulada] = true;
  };
  const desativar = () => {
    teclas[teclaSimulada] = false;
  };

  btn.addEventListener("mousedown", ativar);
  btn.addEventListener("mouseup", desativar);
  btn.addEventListener("mouseleave", desativar);
  btn.addEventListener("touchstart", ativar, { passive: false });
  btn.addEventListener("touchend", desativar);
});

btnInteragir.addEventListener("click", () => {
  if (estado.rodando && !estado.pausado) tentarInteragirTerminal();
});

btnCorrer.addEventListener("click", () => {
  if (estado.rodando && !estado.pausado) alternarCorrida();
});

btnLaser.addEventListener("click", () => {
  if (estado.rodando && !estado.pausado) dispararLaser();
});

btnComecar.addEventListener("click", () => {
  modalInicio.classList.add("escondido");
  if (!estado.rodando) {
    prepararPartida();
    ultimoFrame = performance.now();
    requestAnimationFrame(loopPrincipal);
  } else {
    estado.pausado = false;
  }
});

btnAjuda.addEventListener("click", () => {
  if (estado.rodando) estado.pausado = true;
  btnComecar.textContent = "Voltar ao Jogo";
  modalInicio.classList.remove("escondido");
});

btnReiniciar.addEventListener("click", () => {
  modalFim.classList.add("escondido");
  prepararPartida();
});

btnTema.addEventListener("click", () => {
  const atual = document.documentElement.getAttribute("data-theme");
  const proximo = atual === "light" ? "dark" : "light";
  aplicarTema(proximo);
});

function aplicarTema(tema) {
  if (tema === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

// ============================================================
// MECÂNICAS DO JOGADOR (CORRER, LASER E INTERAÇÃO)
// ============================================================
function alternarCorrida() {
  if (!estado.correndo && estado.estamina < 15) {
    mostrarBanner("Estamina muito baixa para correr! Aguarde recarregar.");
    return;
  }
  estado.correndo = !estado.correndo;
  btnCorrer.classList.toggle("ativo", estado.correndo);
  atualizarHUD();
}

function dispararLaser() {
  if (estado.cargasLaser <= 0) {
    mostrarBanner("Sem cargas de laser! Use sua lanterna e velocidade.");
    return;
  }

  estado.cargasLaser--;
  estado.raioFeixeLaser = 175;
  atualizarHUD();

  const dist = Math.hypot(monstro.x - jogador.x, monstro.y - jogador.y);
  if (dist <= 185) {
    monstro.tempoStun = 4.5; // Paralisa o monstro por 4,5 segundos
    mostrarBanner("ZAP! O monstro foi paralisado por 4,5 segundos!");
  } else {
    mostrarBanner("Laser disparado, mas o monstro estava longe demais!");
  }
}

function obterTerminalProximo() {
  for (const t of terminais) {
    if (!t.resolvido) {
      const dist = Math.hypot(t.x - jogador.x, t.y - jogador.y);
      if (dist <= 34) return t;
    }
  }
  return null;
}

function tentarInteragirTerminal() {
  const proximo = obterTerminalProximo();
  if (!proximo) {
    mostrarBanner("Aproxime-se de um terminal brilhante para interagir.");
    return;
  }
  abrirPergunta("terminal", proximo.pergunta, proximo);
}

// ============================================================
// SISTEMA DE PERGUNTAS (TERMINAIS E DEFESA CONTRA O MONSTRO)
// ============================================================
function abrirPergunta(tipo, dadosPergunta, terminal = null) {
  estado.pausado = true;
  tipoPerguntaAtual = tipo;
  perguntaAtual = dadosPergunta;
  terminalAlvo = terminal;

  // Limpa teclas pressionadas para o boneco não continuar andando sozinho
  for (const k in teclas) teclas[k] = false;

  etiquetaPergunta.textContent = dadosPergunta.materia;
  etiquetaPergunta.classList.toggle("perigo", tipo === "monstro");
  tituloPergunta.textContent = dadosPergunta.titulo;
  enunciadoPergunta.textContent = dadosPergunta.enunciado;

  explicacaoBox.classList.add("escondido");
  listaOpcoes.innerHTML = "";

  dadosPergunta.opcoes.forEach((textoOpcao, indice) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "btn-opcao";
    botao.textContent = textoOpcao;
    botao.addEventListener("click", () => verificarResposta(indice, botao));
    listaOpcoes.appendChild(botao);
  });

  modalPergunta.classList.remove("escondido");
  notificarAlturaPortal();
}

function verificarResposta(indiceEscolhido, botaoClicado) {
  const botoes = listaOpcoes.querySelectorAll("button");
  botoes.forEach((b) => (b.disabled = true));

  const acertou = indiceEscolhido === perguntaAtual.correta;
  botoes[perguntaAtual.correta].classList.add("correta");
  if (!acertou) {
    botaoClicado.classList.add("errada");
  }

  explicacaoBox.classList.remove("escondido");

  if (tipoPerguntaAtual === "terminal") {
    if (acertou) {
      estado.pontos += 100;
      estado.terminaisResolvidos++;
      terminalAlvo.resolvido = true;
      textoExplicacao.textContent = "Correto! +100 pontos. " + perguntaAtual.explicacao;
      btnContinuarJogo.textContent =
        estado.terminaisResolvidos >= 10 ? "Concluir Missão" : "Continuar Explorando";
    } else {
      estado.pontos = Math.max(0, estado.pontos - 20);
      textoExplicacao.textContent = "Ops, resposta incorreta! " + perguntaAtual.explicacao + " Tente esse terminal novamente depois.";
      btnContinuarJogo.textContent = "Voltar ao Corredor";
    }
  } else {
    // Pergunta de defesa quando o monstro encosta
    if (acertou) {
      textoExplicacao.textContent = "Escapou por pouco! O monstro foi enviado de volta ao início do mapa. " + perguntaAtual.explicacao;
      btnContinuarJogo.textContent = "Continuar Fugindo";
    } else {
      textoExplicacao.textContent = "Resposta errada! A criatura alcançou você. " + perguntaAtual.explicacao;
      btnContinuarJogo.textContent = "Reiniciar Missão";
    }
  }

  btnContinuarJogo.onclick = () => {
    modalPergunta.classList.add("escondido");
    atualizarHUD();

    if (tipoPerguntaAtual === "terminal") {
      if (estado.terminaisResolvidos >= 10) {
        finalizarJogoVitoria();
        return;
      }
      estado.pausado = false;
    } else {
      if (acertou) {
        resetarPosicaoMonstro();
        monstro.tempoImunidade = 2.0;
        estado.pausado = false;
      } else {
        // Errou contra o monstro: reinicia o jogo conforme pedido
        mostrarBanner("Você errou a defesa! Missão reiniciada.");
        prepararPartida();
      }
    }
  };
}

// ============================================================
// MOVIMENTAÇÃO, COLISÕES E INTELIGÊNCIA DO MONSTRO
// ============================================================
function podeMoverPara(nx, ny, raio) {
  const pontosTeste = [
    { x: nx - raio, y: ny - raio },
    { x: nx + raio, y: ny - raio },
    { x: nx - raio, y: ny + raio },
    { x: nx + raio, y: ny + raio }
  ];

  for (const p of pontosTeste) {
    const col = Math.floor(p.x / TAMANHO_BLOCO);
    const lin = Math.floor(p.y / TAMANHO_BLOCO);
    if (
      lin < 0 ||
      lin >= mapaLabirinto.length ||
      col < 0 ||
      col >= mapaLabirinto[0].length ||
      mapaLabirinto[lin][col] === 1
    ) {
      return false;
    }
  }
  return true;
}

function atualizar(dt) {
  if (!estado.rodando || estado.pausado) return;

  estado.tempoAcumuladoMs += dt * 1000;

  // Movimento do jogador
  let dx = 0;
  let dy = 0;
  if (teclas["w"] || teclas["arrowup"]) dy -= 1;
  if (teclas["s"] || teclas["arrowdown"]) dy += 1;
  if (teclas["a"] || teclas["arrowleft"]) dx -= 1;
  if (teclas["d"] || teclas["arrowright"]) dx += 1;

  const movendo = dx !== 0 || dy !== 0;

  // Controle da estamina
  if (estado.correndo && movendo) {
    estado.estamina -= 28 * dt;
    if (estado.estamina <= 0) {
      estado.estamina = 0;
      estado.correndo = false;
      btnCorrer.classList.remove("ativo");
      mostrarBanner("Sem fôlego! Voltando a andar.");
    }
  } else {
    estado.estamina = Math.min(100, estado.estamina + 16 * dt);
  }

  if (movendo) {
    const len = Math.hypot(dx, dy);
    dx /= len;
    dy /= len;
    jogador.anguloLanterna = Math.atan2(dy, dx);

    const vel = estado.correndo ? jogador.velCorrer : jogador.velAndar;
    const proxX = jogador.x + dx * vel * dt;
    const proxY = jogador.y + dy * vel * dt;

    if (podeMoverPara(proxX, jogador.y, jogador.raio)) jogador.x = proxX;
    if (podeMoverPara(jogador.x, proxY, jogador.raio)) jogador.y = proxY;
  }

  // Efeito visual do disparo do laser
  if (estado.raioFeixeLaser > 0) {
    estado.raioFeixeLaser = Math.max(0, estado.raioFeixeLaser - 420 * dt);
  }

  // Aviso de terminal próximo
  const perto = obterTerminalProximo();
  avisoInteracao.classList.toggle("escondido", !perto);

  // Movimento do monstro (dificuldade aumenta conforme terminais são resolvidos)
  if (monstro.tempoImunidade > 0) {
    monstro.tempoImunidade -= dt;
  }

  if (monstro.tempoStun > 0) {
    monstro.tempoStun -= dt;
  } else {
    const velMonstro = monstro.velocidadeBase + estado.terminaisResolvidos * 5.5;
    const angulo = Math.atan2(jogador.y - monstro.y, jogador.x - monstro.x);
    const mx = Math.cos(angulo) * velMonstro * dt;
    const my = Math.sin(angulo) * velMonstro * dt;

    if (podeMoverPara(monstro.x + mx, monstro.y, monstro.raio)) {
      monstro.x += mx;
    }
    if (podeMoverPara(monstro.x, monstro.y + my, monstro.raio)) {
      monstro.y += my;
    }
  }

  // Verifica colisão entre monstro e jogador
  const distMonstro = Math.hypot(jogador.x - monstro.x, jogador.y - monstro.y);
  if (
    distMonstro < jogador.raio + monstro.raio &&
    monstro.tempoStun <= 0 &&
    monstro.tempoImunidade <= 0
  ) {
    const perguntaDefesa =
      perguntasDefesaMonstro[estado.indiceDefesa % perguntasDefesaMonstro.length];
    estado.indiceDefesa++;
    abrirPergunta("monstro", perguntaDefesa);
  }

  atualizarHUD();
}

// ============================================================
// DESENHO DO JOGO E EFEITO DE LANTERNA
// ============================================================
function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Piso metálico da estação espacial
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grade sutil no chão
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1;
  for (let c = 0; c <= mapaLabirinto[0].length; c++) {
    ctx.beginPath();
    ctx.moveTo(c * TAMANHO_BLOCO, 0);
    ctx.lineTo(c * TAMANHO_BLOCO, canvas.height);
    ctx.stroke();
  }
  for (let l = 0; l <= mapaLabirinto.length; l++) {
    ctx.beginPath();
    ctx.moveTo(0, l * TAMANHO_BLOCO);
    ctx.lineTo(canvas.width, l * TAMANHO_BLOCO);
    ctx.stroke();
  }

  // 2. Paredes da nave
  for (let l = 0; l < mapaLabirinto.length; l++) {
    for (let c = 0; c < mapaLabirinto[l].length; c++) {
      if (mapaLabirinto[l][c] === 1) {
        const px = c * TAMANHO_BLOCO;
        const py = l * TAMANHO_BLOCO;
        ctx.fillStyle = "#334155";
        ctx.fillRect(px, py, TAMANHO_BLOCO, TAMANHO_BLOCO);
        ctx.strokeStyle = "#475569";
        ctx.strokeRect(px + 1, py + 1, TAMANHO_BLOCO - 2, TAMANHO_BLOCO - 2);
      }
    }
  }

  // 3. Terminais espalhados
  for (const t of terminais) {
    ctx.beginPath();
    ctx.arc(t.x, t.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = t.resolvido ? "#22c55e" : "#38bdf8";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  }

  // 4. Criatura alienígena (Monstro)
  ctx.beginPath();
  ctx.arc(monstro.x, monstro.y, monstro.raio, 0, Math.PI * 2);
  ctx.fillStyle = monstro.tempoStun > 0 ? "#60a5fa" : "#ef4444";
  ctx.fill();
  // Olhos brilhantes do monstro
  ctx.fillStyle = "#fef08a";
  ctx.fillRect(monstro.x - 5, monstro.y - 4, 3, 3);
  ctx.fillRect(monstro.x + 2, monstro.y - 4, 3, 3);

  // 5. Astronauta (Jogador)
  ctx.beginPath();
  ctx.arc(jogador.x, jogador.y, jogador.raio, 0, Math.PI * 2);
  ctx.fillStyle = "#f8fafc";
  ctx.fill();
  // Visor do capacete
  ctx.beginPath();
  ctx.arc(
    jogador.x + Math.cos(jogador.anguloLanterna) * 4,
    jogador.y + Math.sin(jogador.anguloLanterna) * 4,
    5,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "#0284c7";
  ctx.fill();

  // 6. Efeito de pulso do laser
  if (estado.raioFeixeLaser > 0) {
    ctx.beginPath();
    ctx.arc(jogador.x, jogador.y, 185 - estado.raioFeixeLaser, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  // 7. Escuridão com recorte de lanterna (cone direcional + luz ao redor)
  ctx.save();
  const gradienteEscuro = ctx.createRadialGradient(
    jogador.x,
    jogador.y,
    38,
    jogador.x,
    jogador.y,
    170
  );
  gradienteEscuro.addColorStop(0, "rgba(2, 6, 15, 0)");
  gradienteEscuro.addColorStop(0.65, "rgba(2, 6, 15, 0.78)");
  gradienteEscuro.addColorStop(1, "rgba(2, 6, 15, 0.97)");

  ctx.fillStyle = gradienteEscuro;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Pequeno brilho nos terminais ainda ativos para orientar no escuro
  for (const t of terminais) {
    if (!t.resolvido) {
      ctx.beginPath();
      ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(56, 189, 248, 0.55)";
      ctx.fill();
    }
  }
  ctx.restore();
}

function loopPrincipal(timestamp) {
  const dt = Math.min(0.05, (timestamp - ultimoFrame) / 1000);
  ultimoFrame = timestamp;

  atualizar(dt);
  desenhar();

  requestAnimationFrame(loopPrincipal);
}

// ============================================================
// HUD, FEEDBACK E FINALIZAÇÃO
// ============================================================
function atualizarHUD() {
  textoTerminais.textContent = `${estado.terminaisResolvidos} / 10`;
  textoPontos.textContent = estado.pontos;
  textoLaser.textContent = `${estado.cargasLaser} / 3`;
  textoModoCorrida.textContent = estado.correndo ? "Correndo" : "Andando";
  barraEstamina.style.width = `${Math.round(estado.estamina)}%`;
  barraEstamina.style.background =
    estado.estamina < 25 ? "var(--perigo)" : "var(--sucesso)";
}

let timerBanner = null;
function mostrarBanner(texto) {
  bannerFeedback.textContent = texto;
  bannerFeedback.classList.remove("escondido");
  clearTimeout(timerBanner);
  timerBanner = setTimeout(() => {
    bannerFeedback.classList.add("escondido");
  }, 2600);
}

function finalizarJogoVitoria() {
  estado.rodando = false;
  const tempoTotalMs = Math.round(estado.tempoAcumuladoMs);
  const segundos = Math.round(tempoTotalMs / 1000);

  document.getElementById("fim-terminais").textContent = "10 / 10";
  document.getElementById("fim-pontos").textContent = estado.pontos;
  document.getElementById("fim-tempo").textContent = `${segundos}s`;
  document.getElementById("mensagem-fim").textContent =
    "Você reativou todos os 10 terminais de Matemática e Língua Inglesa e escapou da estação espacial!";

  modalFim.classList.remove("escondido");
  notificarAlturaPortal();

  // Envia resultado para o portal escolar
  window.parent.postMessage(
    {
      type: "vrgame:finish",
      score: estado.pontos,
      maxScore: 1000,
      timeMs: tempoTotalMs,
      detail: { jogo: "scary-space-game" }
    },
    "*"
  );
}

// ============================================================
// CONTRATO DE COMUNICAÇÃO COM O PORTAL ESCOLAR
// ============================================================
function notificarAlturaPortal() {
  const altura = document.documentElement.scrollHeight;
  window.parent.postMessage({ type: "vrgame:resize", height: altura }, "*");
}

window.addEventListener("message", (event) => {
  const dados = event.data;
  if (!dados || typeof dados !== "object") return;

  if (dados.type === "vrgame:theme") {
    aplicarTema(dados.theme === "light" ? "light" : "dark");
  } else if (dados.type === "vrgame:fullscreen") {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }
});

window.addEventListener("resize", notificarAlturaPortal);
window.addEventListener("load", () => {
  window.parent.postMessage({ type: "vrgame:ready" }, "*");
  notificarAlturaPortal();
});