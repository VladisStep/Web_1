export default class Controller {

    name = "";


    constructor(game, view) {

        this.game = game;
        this.view = view;
        this.intervalId = null; // для сохранения интервала времени при паузе
        this.isPlaying = false; // для режима паузы

        document.addEventListener('keydown', this.handleKeyDown.bind(this));    // bind - привязка к метода к классу
        document.addEventListener('keydown', this.handleKeyUp.bind(this));    // bind - привязка к метода к классу


    }

    update () {
        this.game.movePieceDown();
        this.updateView();
    }

    play () {
        document.getElementById('table').style.display = "none";
        document.getElementById('pauseMenu').style.display = "none";
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
    }

    pause() {
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
        document.getElementById('pauseMenu').style.display = "block";

    }

    reset() {

        document.getElementById('endGameMenu').style.display = "none";
        this.game.reset();
        this.play();
    }

    updateView() {

        const state = this.game.getState();
        if (state.isGameOver){
            this.stopTimer();
            document.getElementById('endGameMenu').style.display = "block";
           this.rewriteRecord();
           this.writeTable();
            document.getElementById('table').style.display = "block";

            this.view.renderGameOverScreen(state);
        } else if (!this.isPlaying){
            this.view.renderPauseScreen();
        } else {
            this.view.renderMainScrean(this.game.getState());
        }

    }

    startTimer() {
        const speed = 1000 - this.game.getState().level * 100;

        if (!this.intervalId){
            this.intervalId = setInterval(() => {
                this.update();
            }, speed > 0 ? speed: 100);
        }


    }

    stopTimer() {
        if (this.intervalId){
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }



    handleKeyDown(event) {

        const state = this.game.getState();

        switch (event.keyCode){
            case 13: // ENTER

                // if (state.isGameOver) {
                //     this.reset();
                // } else if (this.isPlaying){
                //     this.pause();
                // }else{
                //     this.play();
                // }
                if (this.isPlaying && !state.isGameOver) this.pause();
                break;
            case 37: // left arrow

                if (this.isPlaying && !state.isGameOver){
                    this.game.movePieceLeft();
                    this.updateView();
                }
                break;
            case 38: // up arrow
                if (this.isPlaying && !state.isGameOver){
                    this.game.rotatePiece();
                    this.updateView();
                }
                break;
            case 39: // right arrow
                if (this.isPlaying && !state.isGameOver){
                    this.game.movePieceRight();
                    this.updateView();
                }
                break;
            case 40: // down arrow
                if (this.isPlaying && !state.isGameOver){
                    this.stopTimer()
                    this.game.movePieceDown();
                    this.updateView();
                }
                break;
            case 32: // down arrow
                if (this.isPlaying && !state.isGameOver){
                    this.game.fastMovePieceDown();
                    this.updateView();
                }
                break;
        }
    }

    handleKeyUp (event){
        const state = this.game.getState();


        switch (event.keyCode){
            case 40: // down arrow
                if (this.isPlaying && !state.isGameOver){
                    this.startTimer();
                }
                break;
        }
    }

    startGame(){
        document.getElementById('startMenu').style.display = "none";
        this.updateView();
        this.play();

        //this.store(1, "G1", 1000);
        //this.store(2, "G2", 100);
        //this.store(3, "G3", 10);



        this.name = document.getElementById("p").value;

    }

    store(num, n, sc) {

        const elem = {
            name: n,
            score: sc
        }
        localStorage.setItem(num.toString(), JSON.stringify(elem));
    }

    read(num) {
        return JSON.parse(localStorage.getItem(num.toString()));
    }

    rewriteRecord() {

        let i = 0;
        let elem;

        for (i; i < 5; i++){

            elem = this.read(i+1);

            if ((elem == null) || (elem.score < this.game.score)){
                this.store(i+1, this.name, this.game.score);

                if (elem != null) {

                    i++;
                    let buff;

                    for (i; i < 5; i++){
                        buff = this.read(i+1);
                        this.store(i+1, elem.name, elem.score);
                        elem = buff;

                        if (elem == null){
                            break;
                        }
                    }
                }

                break;
            }
        }
    }


    writeTable(){

        let elem = document.querySelector('#table');

        let table = document.createElement('table');

        for(let i = 0; i < 6; i ++){
            let tr = document.createElement('tr');


            let td1 = document.createElement('td');
            let td2 = document.createElement('td');

            const gamer = JSON.parse(localStorage.getItem(i.toString()));
            if (gamer){
                td1.innerText = gamer.name;
                td2.innerText = gamer.score;
            }

            tr.appendChild(td1);
            tr.appendChild(td2);

            table.appendChild(tr);
        }

        elem.appendChild(table);
    }

      


};