export default class View {

    static colors = {
        '1': 'cyan',
        '2': 'blue',
        '3': 'orange',
        '4': 'yellow',
        '5': 'green',
        '6': 'purple',
        '7': 'red'
    }

    constructor(element, width, height, rows, columns) {
        this.element = element;
        this.width = width;
        this.height = height;

        this.canvas = document.createElement('canvas'); // холст
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        this.playfieldBorderWidth = 4;  //ширина границы
        this.playfieldX = this.playfieldBorderWidth;    // начальные координаты поля
        this.playfieldY = this.playfieldBorderWidth;
        this.playfieldWidth = this.width * 2 / 3;   // ширина и длина игрового поля
        this.playfieldHeigth = this.height;
        this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2; //ширина и длина поля без границ
        this.playfieldInnerHeight = this.playfieldHeigth - this.playfieldBorderWidth * 2;

        this.blockWidth = this.playfieldInnerWidth / columns;
        this.blockHight = this.playfieldInnerHeight / rows;

        this.panelX = this.playfieldWidth + 10; // панель со статистикой
        this.panelY = 0;
        this.panelWidth = this.width / 3;
        this.panelHeight = this.height;

        this.element.appendChild(this.canvas)   // добавление холста в коневой элемент

    }

    renderMainScrean( state ){ // перерисовка
        this.clearScreen();
        this.renderPlayfield(state);
        this.renderPanel(state)
    }

    clearScreen(){  // очистка холста
        this.context.clearRect(0, 0, this.width, this.height);

    }

    renderStartScreen(){    // стартовый экран
        this.context.fillStyle = 'white';
        this.context.front = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
    }

    renderPauseScreen(){    // экран паузы

       // this.context.fillStyle = 'rgba(0,0,0,0.75)'; // затемнение экрана;
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = 'white';
        this.context.front = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
    }

    renderGameOverScreen({ score }){    // экран окончания игры

        this.clearScreen();

        this.context.fillStyle = 'white';
        this.context.front = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Game over', this.width / 2, this.height / 2 - 48);
        this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);


    }

    renderPlayfield ({ playfield }){

        for(let y = 0; y < playfield.length; y++){
            const line = playfield[y];

            for(let x = 0; x < line.length; x++){
                const block = line[x];

                if(block){
                    this.renderBLock(
                        this.playfieldX + (x * this.blockWidth),
                        this.playfieldY + (y * this.blockHight),
                        this.blockWidth,
                        this.blockHight,
                        View.colors[block]
                    );
                }
            }
        }
    }

    renderPanel({ level, score, lines, nextPiece }){
        this.context.textAlign = "start";   // форматироване по левому краю
        this.context.textBaseline = "top";  // форматирование по верхнему краю
        this.context.fillStyle = 'white';   // цвет текста
        this.context.font = '14px "Press Start 2p"';    // шрифт

        this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + 0);   // рисовка
        this.context.fillText(`Liens: ${lines}`, this.panelX, this.panelY + 24);
        this.context.fillText(`Level: ${level}`, this.panelX, this.panelY + 48);
        this.context.fillText(`Next: `, this.panelX, this.panelY + 96);

        for (let y = 0; y < nextPiece.blocks.length; y++){
            for (let x = 0; x < nextPiece.blocks[y].length; x++){
                const block = nextPiece.blocks[y][x];

                if (block){
                  this.renderBLock(
                      this.panelX + (x * this.blockWidth * 0.5),
                      this.panelY + 100 + (y * this.blockHight * 0.5),
                      this.blockWidth * 0.5,
                      this.blockHight * 0.5,
                      View.colors[block]);
                }
            }
        }

        this.context.strokeStyle = 'white'; // граница
        this.context.lineWidth = this.playfieldBorderWidth;
        this.context.strokeRect(0, 0, this.playfieldWidth, this.playfieldHeigth);
    }

    renderBLock(x, y, width, height, color){
        this.context.fillStyle = color;  // цвет закраски
        this.context.strokeStyle = 'black';    // цвет обводки
        this.context.lineWidth = 2; // ширина обводки

        this.context.fillRect(x, y, width, height);    // рисуем прямоугольник
        this.context.strokeRect(x, y, width, height)    // рисуем обводки
    }
}