var JOGAR = 1
var ENCERRAR = 0
var estadojogo = JOGAR;
var trex, trex_correndo, bordas;
var imagemdosolo, solo, soloinvisivel;
var nuvem, nuvemimagem;
var obs1, obs2, obs3, obs4, obs5, obs6, grupodeobstaculos, grupodenuvens;
var obstaculos;
var pontuacao = 0;
var trex_collided;
var fimdejogo, fimdejogoimagem;
var restart, restartImg;
var sompular, sommorrer, som100;


function preload(){
  //adicionar imagem
  obs1 = loadImage("obstacle1.png");
  obs2 = loadImage("obstacle2.png");
  obs3 = loadImage("obstacle3.png");
  obs4 = loadImage("obstacle4.png");
  obs5 = loadImage("obstacle5.png");
  obs6 = loadImage("obstacle6.png");
  sompular = loadSound("jump.mp3");
  sommorrer = loadSound("die.mp3");
  som100 = loadSound("checkPoint.mp3");
  
  trex_collided = loadAnimation("trex_collided.png");
  
  fimdejogoimagem = loadImage("gameOver.png");
  
  trex_correndo = 
    
  loadAnimation("trex1.png","trex3.png","trex4.png");
  
  imagemdosolo = loadImage( "ground2.png");
  
  nuvemimagem = loadImage ("cloud.png");
  
  restartImg = loadImage("restart.png");
}

function setup(){
  
  createCanvas(600,200);
  
  // criando o trex 
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("parado", trex_collided);
  bordas = createEdgeSprites();
  restart = 
  
  //criando imagem solo
  solo = createSprite(200, 180, 400,20);
  solo.addImage("ground", imagemdosolo);
  solo.x = solo.width/2;
  
  //fim de jogo
  fimdejogo = createSprite(300,100 );
  fimdejogo.addImage("fim", fimdejogoimagem);
  fimdejogo.scale = 0.5
  
  //reiniciar o jogo
  restart = createSprite(300,130, 100, 20 );
  restart.addImage("reiniciar", restartImg);
  restart.scale = 0.5
  
  //criando solo invisivel
  soloinvisivel = createSprite(200, 190, 400, 10);
  soloinvisivel.visible = false;
  
  //adicionando escala e posição ao trex
  trex.scale = 0.5;
  trex.x = 50
  
  grupodeobstaculos = new Group();
  grupodenuvens = new Group();
  //numero aleatorio
  var numeroaleatorio = Math.round(random(1,100));
  console.log(numeroaleatorio);
  
  trex.setCollider("circle", 10,10,40);

  trex.debug = false;
  
 
}
function draw(){ 
  
// definir cor de fundo
  background(180);
  //posicao e a contagem da pontuacao atraves da distancia entre os obstaculos
  text("pontuação:" + pontuacao, 500, 40);
  
  
  
    if (estadojogo === JOGAR){
      
      //tornar possivel o game over e o restart aparecerem na tela quando o jogo acabar
      restart.visible = false;
      fimdejogo.visible = false;
      solo.velocityX = -(6 + pontuacao /500);
    
      pontuacao = pontuacao + Math.round (frameRate()/60);
    
      if(pontuacao > 0 && pontuacao %100 === 0){
        
        som100.play();
      }
      
     
      
      
      if(solo.x<0){
      
        solo.x = solo.width/2;
      
     
  }
    
     // o trex pula quando a tecla espaço é acionada só funciona o espaço quando a posição
  //y estiver maios ou igual a 100 não permitindo pular mais.
      if(keyDown("space") && trex.y >=100){
      trex.velocityY = -10;
        
        sompular.play();
        
  }
  //gravidade
   trex.velocityY = trex.velocityY + 0.5;
  
  //mostrar as nuvens
   gerarNuvens(); 
  
  //criar obstaculos na tela
   gerarObstaculos();
    
      if (grupodeobstaculos.isTouching(trex)){
        
        estadojogo = ENCERRAR;
        //trex.velocityY = -12;
       // sompular.play();
        sommorrer.play();
    }
  }
    else if (estadojogo === ENCERRAR){
      
      restart.visible = true;
      fimdejogo.visible = true;
      //os dois estao em 0 pq eles nao estao se mexendo
      solo.velocityX = 0;
      trex.velocityY = 0;
      //fazer eles pararem
      grupodeobstaculos.setVelocityXEach (0);
      grupodenuvens.setVelocityXEach (0);
      trex.changeAnimation("parado", trex_collided);
 //definindo o tempo de vida dos objetos para que nao sejam destruidos
      
      grupodeobstaculos.setLifetimeEach(-1);
      grupodenuvens.setLifetimeEach(-1);
      
     if ( mousePressedOver(restart)){
    reset();
  }
      
    }
  
  
// registrando a posição y do trex
  //console.log(trex.y)
  //console.log(solo.x);
  
  
 
  
  // impedir o trex de cair 
  trex.collide( soloinvisivel);
  
  // esse console e para ver o numero de quedros do nosso jogo
 // console.log(frameCount)
  
  
  
  drawSprites();
}

function reset(){
  estadojogo = JOGAR;
  restart.visible = false;
  fimdejogo.visible = false;
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();
  trex.changeAnimation("running", trex_correndo);
  pontuacao = 0
  
  
}


//function nuvem
function gerarNuvens(){
  //a cada 60 quadros passados aparece uma nuvem
  //esse operador matematico de porcentagem e para dividir o numero de quadros na tela e o resto da divisao tem que ser 0
  if (frameCount %60 === 0){
      //posicao, altura, largura fora da area do jogo
    nuvem = createSprite (600, 100, 40, 10);
      //a velocidade da nuvem no lado esquerdo
    nuvem.velocityX = -2
      //adicionar imagem da nuvem
    nuvem.addImage("sky", nuvemimagem);
    //diminuir o tamanho da nuvem
    nuvem.scale = 0.5;
    // posicionou as nuvens na posicao y
    nuvem.y  =  Math.round(random(10, 80));
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth +1;
    console.log (trex.depth);
    console.log (nuvem.depth);
     grupodenuvens.add(nuvem);
       
     }
  

   
}
function gerarObstaculos(){
  
  //a cada 92 quadros aparece um obstaculo
  if (frameCount %92 === 0){
    obstaculos = createSprite(600, 170, 10, 50)
    obstaculos.velocityX = - (6 + pontuacao /500);
   var num = Math.round(random(1, 6));
    //ajuda a selecionar um imagem aleatoria dos obstaculos atraves dos cases abaixo
    
    
    switch(num){
        
        //adicionar imagem ao obstaculo
      case 1:obstaculos.addImage(obs1);
        break;
        case 2:obstaculos.addImage(obs2);
        break;
        case 3:obstaculos.addImage(obs3);
        break;
        case 4:obstaculos.addImage(obs4);
        break;
        case 5:obstaculos.addImage(obs5);
        break;
        case 6:obstaculos.addImage(obs6);
        break;
        default:break;
        
    }
    //diminuir os obstaculos
   obstaculos.scale = 0.5;
    //o tempo de vida de cada obstaculo pelo tamanha da area de jogo no eixo x600 dividido pela velocidade x
   

     obstaculos.lifetime = 300
     grupodeobstaculos.add(obstaculos);
  
  }
}
  