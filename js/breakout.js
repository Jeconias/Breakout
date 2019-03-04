/*  ############################# 
    #       Jeconias Santos     #
    #       Breakout v0.1       #
    ############################# 
*/

class Breakout {

    constructor()
    {
        // TAMANHO DA TELA
        this.width  = (window.innerWidth > 600) ? 600 : window.innerWidth;
        this.height = window.innerHeight;

        // CANVAS E CONTEXT
        this.canvas = document.getElementById('canvas');
        this.ctx    = this.canvas.getContext('2d');

        // LARGURA E ALTURA DO CANVAS
        this.canvas.width   = this.width;
        this.canvas.height  = this.height;

        // ESTILO DO CANVAS
        this.canvas.style.display = "block";
        this.canvas.style.backgroundColor = "#f2f2f2";
        this.canvas.style.margin = "0 auto";

        // A BOLA
        this.ball = {
            eixoX: 500,
            eixoY: 100,
            vx: Math.floor(Math.random() * 15) + 1,
            vy: 0,
            radius: 5,
            color: "#444",
            lastPointOnBar: null
        };

        // A BARRA
        this.bar = {
            eixoX: this.canvas.width / 2,
            eixoY: this.canvas.height - 15,
            width: 180,
            height: 7,
            color: "#444",
            moviment: {
                left: false,
                right: false,
            }
        };

        // OS BLOCOS
        this.block = {
            eixoX: 1,
            eixoY: 1,
            width: 100, 
            height: 15,
            positions: {
                x: [],
                y: [],
            },
            qtd: {
                total: 30,
                restantes: 30,
                colors: []
            },
            limitY: 6,
            colors: [
                "#55efc4", 
                "#00b894",
                "#81ecec", 
                "#00cec9", 
                "#74b9ff", 
                "#0984e3", 
                "#a29bfe", 
                "#6c5ce7", 
                "#dfe6e9", 
                "#b2bec3", 
                "#ffeaa7", 
                "#fdcb6e",
                "#fab1a0",
                "#e17055",
                "#ff7675",
                "#d63031",
                "#fd79a8",
                "#e84393",
                "#636e72",
                "#2d3436"
            ]
        };

        // MECANICA
        this.game = {
            gravidade: 0.1,
            status: true
        }

        // EVENTOS
        window.addEventListener("keydown", this.keydownEvent.bind(null, this), false);
        window.addEventListener("keyup", this.keyupEvent.bind(null, this), false);

        // DESENHAR OS BLOCOS
        this.blockMaker();
    }

    clear(x = 0, y = 0){
        // LIMPAR O CANVAS
        this.ctx.clearRect(x, y, this.canvas.width, this.canvas.height);
    }

    ballDraw(){
        // INFORMAR QUE SERA FEITO UM DESENHO
        this.ctx.beginPath();
        // DEFINIR A COR DO CIRCULO
        this.ctx.fillStyle = this.ball.color;
        // DEFININDO A LARGURA DA LINHA
        this.ctx.lineWidth = 1.5;
        // DESENHANDO O CIRCULO
        this.ctx.arc(this.ball.eixoX, this.ball.eixoY, this.ball.radius, 0, Math.PI * 2);
        // DEIXAR O CIRCULO SEM FUNDO
        this.ctx.fill();
        // INFORMAR QUE O DESENHO FOI FINALIZADO
        this.ctx.closePath();
    }

    barDraw(){
        // INICIANDO UM CAMINHO
        this.ctx.beginPath();
        // DEFINIR A COR DO CIRCULO
        this.ctx.fillStyle = this.bar.color;
        // DEFININDO A LARGURA DA LINHA
        this.ctx.lineWidth = 1.5;
        // DESENHANDO UM RETANGULO
        this.ctx.fillRect(this.bar.eixoX, this.bar.eixoY, this.bar.width, this.bar.height);
        // INFORMAR QUE O DESENHO FOI FINALIZADO
        this.ctx.closePath();
    }

    blockDraw(){
        // INICIANDO UM CAMINHO
        this.ctx.beginPath();
        // DEFININDO A LARGURA DA LINHA
        this.ctx.lineWidth = 1.5;
        
        for(let i = 0; i < this.block.qtd.restantes; i++){

            // DEFINIR A COR DO BLOCO
            this.ctx.fillStyle = this.block.qtd.colors[i];

            // DESENHANDO OS BLOCOS
            this.ctx.fillRect(this.block.positions.x[i], this.block.positions.y[i], this.block.width, this.block.height);
        }

        // INFORMAR QUE O DESENHO FOI FINALIZADO
        this.ctx.closePath();

    }

    blockMaker(){
        // DEFININDO OS LOCAIS DOS BLOCOS
        let spaceX = 0;
        let limitY = this.block.limitY;
        for(let i = 0; i < this.block.qtd.total; i++){

            // QUEBRAR A LINHA DOS BLOCOS
            if(i == limitY){
                this.block.eixoY += (this.block.height + 2);
                this.block.eixoX = 1;
                limitY += this.block.limitY;
                spaceX = 0;
                
            }

            let blockPositionX = (this.block.eixoX + spaceX);
            let blockPositionY = this.block.eixoY;

            // SETAR AS CORES PARA CADA BLOCO
            if(this.block.qtd.colors.length <= this.block.qtd.total){
                this.block.qtd.colors.push( this.block.colors[Math.floor(Math.random() * 20) + 1] );
            }

            // ADICIONAR OS VALORES DO ARRAY
            this.block.positions.x.push(blockPositionX);
            this.block.positions.y.push(blockPositionY);

            // AUMENTAR O ESPACO
            spaceX += (this.block.width + 1);
        }
    }


    // MOVER A BARRA
    barMove(){
         
        if(this.bar.moviment.left)
         {
            this.bar.eixoX = (this.bar.eixoX <= 0) ? 0 : this.bar.eixoX - 8;
         }

         if(this.bar.moviment.right)
         {
            this.bar.eixoX = (this.bar.eixoX >= (this.canvas.width - this.bar.width)) ? this.canvas.width - this.bar.width : this.bar.eixoX + 8;
         }

    }


    // ATUALIZAR O GAME
    update(){

        // VERIFICAR SE O USUARIO GANHOU
        if(this.block.qtd.restantes === 0) this.win();

        this.ball.vy += this.game.gravidade;
        this.ball.eixoY += this.ball.vy;
        this.ball.eixoX += this.ball.vx;

        // COLISAO COM OS BLOCOS
        for(let i = 0; i < this.block.qtd.restantes; i++){

            // COLISAO EM UM UNICO BLOCO
            if((this.ball.eixoY - this.ball.radius) <= (this.block.positions.y[i] + this.block.height)
            && this.block.positions.x[i] <= (this.ball.eixoX - this.ball.radius) 
            && (this.block.positions.x[i] + this.block.width) >= (this.ball.eixoX + this.ball.radius)
            && this.block.positions.y[i] <= (this.ball.eixoY - this.ball.radius)){

                //this.ball.eixoY = (this.block.positions.y[i] + this.block.height);
                this.ball.vy *= -0.3;

                // REMOVER AS POSICOES E COR DA BARRA
                this.block.positions.x.splice(i, 1);
                this.block.positions.y.splice(i, 1);
                this.block.qtd.colors.splice(i, 1);

                this.block.qtd.restantes--;
            }
        }

        // COLISAO DA BOLA COM A PARTE SUPERIOR DO CANVAS
        if((this.ball.eixoY - this.ball.radius) <= 0){
            this.ball.eixoY = (this.ball.eixoY + this.ball.radius);
            this.ball.vy *= -0.5;
        }

        // COLISAO DA BOLA COM A PARTE INFERIR DO CANVAS
        if((this.ball.eixoY + this.ball.radius) > this.canvas.height){
            
            // PARAR A BOLA
            this.ball.eixoY = (this.canvas.height - this.ball.radius);
            this.ball.vy *= -0;
            this.ball.vx = 0;

            // TELA DE DERROTA
            this.loser();

        }

        // CONLISAO DA BOLA COM AS LATERAIS DO CANVAS
        if((this.ball.eixoX - this.ball.radius) < 0 || (this.ball.eixoX + this.ball.radius) > this.canvas.width){
            this.ball.eixoX = ((this.ball.eixoX - this.ball.radius) < 0) ? this.ball.radius : (this.canvas.width - this.ball.radius);
            this.ball.vx *= -0.5;
        }

        // COLISAO DA BOLA COM A BARRA
        if((this.ball.eixoY + this.ball.radius) > this.bar.eixoY && this.bar.eixoX <= this.ball.eixoX && (this.bar.eixoX + this.bar.width) >= this.ball.eixoX)
        {

            this.ball.eixoY = (this.bar.eixoY - this.ball.radius);
            this.lastPointOnBar = "center";
            this.ball.vy *= -1.2;

            // FAZER A BOLA IR PARA O LADO ESQUERDO
            if((this.bar.eixoX + 40) > this.ball.eixoX){
                this.ball.vx -= 1.2;
                this.lastPointOnBar = "left";
            }
            
            // FAZER A BOLA IR PARA O LADO DIREITO
            if(((this.bar.eixoX + this.bar.width) - 40) < this.ball.eixoX){
                this.ball.vx = 1.2;
                this.lastPointOnBar = "right";
            }

            // REGISTRAR
            this.actionsRegister();
        }
    }

    // REGISTRAR AS INFORMACOES DA TABELA
    actionsRegister()
    {
        const table = document.getElementById('tableInfo').childNodes[3];
        const row = table.insertRow(0);
        const valuesArray = [this.block.qtd.restantes, this.lastPointOnBar, this.game.gravidade, "Fácil"];

        for(let i = 0; i < 4; i++){
            let cell = row.insertCell(i);
            cell.innerHTML = valuesArray[i];
        }
    }


    // TELA DE VITORIA
    win(){

        // PARAR E POSICIONAR A BOLA
        this.ball.eixoY = this.bar.eixoY - (this.ball.radius + 1);
        this.ball.eixoX = this.bar.eixoX + (this.bar.width / 2);
        this.ball.vy *= -0;
        this.ball.vx = 0;

        // PAUSAR O MOVIMENTO DA BARRA
        this.game.status = false;

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "40px Cuprum, sans-serif";
        this.ctx.fillText("Réeeeeh, você ganhou!", (this.canvas.width / 2) - 150, this.canvas.height/2);

        this.ctx.fillStyle = "#27ae60";
        this.ctx.font = "20px Cuprum, sans-serif";
        this.ctx.fillText("[R]estart", (this.canvas.width / 2) - 30, (this.canvas.height / 2) + 30);
    }

    loser(){
        // PAUSAR O MOVIMENTO DA BARRA
        this.game.status = false;

        // TELA DE DERROTA
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "40px Cuprum, sans-serif";
        this.ctx.fillText("Game Over", (this.canvas.width / 2) - 80, this.canvas.height/2);

        this.ctx.fillStyle = "#e74c3c";
        this.ctx.font = "20px Cuprum, sans-serif";
        this.ctx.fillText("[R]estart", (this.canvas.width / 2) - 30, (this.canvas.height / 2) + 30);
    }


    restart(){

        // TEMPORARIO
        location.reload();

    }

    keydownEvent(obj, event){
        const keyCode = event.keyCode;

        // RECOMECAR O JOGO
        if(keyCode === 82) obj.restart();

        // EVITAR O MOVIMENTO DA BARRA
        if(obj.game.status === false) return false;

        if(keyCode === 65){
            obj.bar.moviment.left = true;
        }
        
        if(keyCode === 68){
            obj.bar.moviment.right = true;
        }
    }

    keyupEvent(obj, event){
        const keyCode = event.keyCode;

        if(keyCode === 65){
            obj.bar.moviment.left = false;
        }
        
        if(keyCode === 68){
            obj.bar.moviment.right = false;
        }
    }
}

const breakout = new Breakout();

function loop()
{
    requestAnimationFrame(loop, breakout.canvas);
    breakout.clear();
    breakout.ballDraw();
    breakout.barDraw();
    breakout.blockDraw();
    breakout.barMove();
    breakout.update();
    
}

loop();