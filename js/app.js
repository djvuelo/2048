"use strict";

const colors = {
    empty: "#ccc0b4",
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f1b179",
    16: "#f59563",
    32: "#f57c60",
    64: "#f55d3b",
    128: "#eccf73",
    256: "#edcc62",
    512: "#ecc850",
    1024: "#edc53f",
    2048: "#ecc32e"
};
function createCell(i, j, value){
    const cell = {
        value: null,
        domNode: null,
        cellMovement: null,
        speed: 20,
        widthHeight: 60,
        toRemove: false,
        animationStop: true,
        indexes: {
            i: i,
            j: j
        },
        position: {
            x: 0,
            y: 0
        },
        init: function () {
            this.position.x = this.indexes.i * this.widthHeight;
            this.position.y = this.indexes.j * this.widthHeight;
            this.value = value;
            const app = document.querySelector("#app");
            this.domNode = document.createElement("div");
            this.domNode.classList.add("cell");
            this.domNode.style.backgroundColor = colors[value];
            this.domNode.textContent = value;
            this.domNode.style.top = `${this.position.x}px`;
            this.domNode.style.left = `${this.position.y}px`;
            app.append(this.domNode);
            return this;
        },
        moveTo: function(i, j) {
            this.animationStop = false;
            if (this.cellMovement !== null) clearInterval(this.cellMovement);
            let currentPositionX = this.indexes.i * this.widthHeight;
            let currentPositionY = this.indexes.j * this.widthHeight;
            this.position.x = i * this.widthHeight;
            this.position.y = j * this.widthHeight;
            this.indexes.i = i;
            this.indexes.j = j;
            this.cellMovement = setInterval(()=>{
                if (this.position.x !== currentPositionX) {

                    if (this.position.x < currentPositionX) currentPositionX-=this.speed;
                    else
                    currentPositionX+=this.speed;

                    this.domNode.style.top = `${currentPositionX}px`;
                    this.domNode.style.left = `${currentPositionY}px`;
                }
                else if (this.position.y !== currentPositionY) {
                    
                    if (this.position.y < currentPositionY) currentPositionY-=this.speed;
                    else
                    currentPositionY+=this.speed;

                    this.domNode.style.top = `${currentPositionX}px`;
                    this.domNode.style.left = `${currentPositionY}px`;
                }
                else{
                     clearInterval(this.cellMovement);
                     this.animationStop = true;
                     if (this.toRemove) this.remove();
                }
            },10);
        },
        remove: function() {
            this.toRemove = true;
            if (this.animationStop) this.domNode.remove();
        }
    };
    return cell.init();
}

const game2048 = {
    appDiv: "#app",
    generalCells: 4,
    grid: [],
    init: function(cells) {
        this.generalCells = cells;
        this.grid = this.createGrid();
        this.randomCells(2);
        return this;
    },
    createGrid: function() {
        const grid = [];
        for (let i=0;i<this.generalCells;i++){
            grid.push([]);
        }
        return grid;
    },
    left: function(withAdd) {
        const grid = this.createGrid();
        let movement = false;
        let pluses = false;
        this.grid.forEach((item, i) => {
            let counter = 0;
            if (item.length !== 0){
                item.forEach((c, j)=>{
                    if (!c.toRemove) {
                        if (c.indexes.j !== counter){
                            movement = true;
                            c.moveTo(c.indexes.i, counter);
                        }
                        grid[c.indexes.i][counter] = c;
                        counter++;
                    }
                });

                if (withAdd)
                for(let k=0;k<grid[i].length;k++) {
                    if (grid[i][k+1] !== undefined){
                        if (grid[i][k].value === grid[i][k+1].value) {
                            grid[i][k].remove();
                            grid[i][k+1].remove();
                            grid[i][k] = createCell(i, k, grid[i][k].value + grid[i][k + 1].value);
                            k+=2;
                            pluses = true;
                            movement = true;
                        }
                    }
                }

            }
        });
        this.grid = grid;
        if (pluses) setTimeout(()=>this.left(false), 30);
        if (movement) setTimeout(()=>this.randomCells(1), 30);
    },
    right: function(withAdd) {
        const grid = this.createGrid();
        let movement = false;
        let pluses = false;
        this.grid.forEach((item, i) => {
            let counter = this.generalCells - 1;
            item.reverse();
            if (item.length !== 0){
                item.forEach((c, j)=>{
                    if (!c.toRemove) {
                        if (c.indexes.j !== counter){
                            movement = true;
                            c.moveTo(c.indexes.i, counter);
                        }
                        grid[c.indexes.i][counter] = c;
                        counter--;
                    }
                });

                if (withAdd)
                for(let k=grid[i].length - 1;k>=0;k--) {
                    if (grid[i][k-1] !== undefined){
                        if (grid[i][k].value === grid[i][k-1].value) {
                            grid[i][k].remove();
                            grid[i][k-1].remove();
                            grid[i][k] = createCell(i, k, grid[i][k].value + grid[i][k - 1].value);
                            k-=2;
                            pluses = true;
                            movement = true;
                        }
                    }
                }

            }
        });
        this.grid = grid;
        if (pluses) this.right(false);
        if (movement) this.randomCells(1);
    },
    bottom: function(withAdd) {
        const grid = this.createGrid();
        let movement = false;
        let pluses = false;

        for (let i=0; i < this.generalCells; i++){
            let counter = this.generalCells -1;
            for (let j=this.generalCells -1; j >= 0; j--){
                if (this.grid[j][i] !== undefined){
                    if (!this.grid[j][i].toRemove){
                        if (this.grid[j][i].indexes.i !== counter){
                            movement = true;
                            this.grid[j][i].moveTo(counter, this.grid[j][i].indexes.j);
                        }
                        grid[counter][this.grid[j][i].indexes.j] = this.grid[j][i];
                        counter--;
                    }
                }
            }
        }

        if (withAdd)
        for (let i=0; i < this.generalCells; i++){
            for (let j=this.generalCells -1; j > 0; j--){
                console.log(j-1);

                if (grid[j-1][i] !== undefined){
                    if (grid[j][i].value === grid[j-1][i].value) {
                        grid[j][i].remove();
                        grid[j-1][i].remove();
                        grid[j][i] = createCell(j, i, grid[j][i].value + grid[j-1][i].value);
                        j-=2;
                        pluses = true;
                        movement = true;
                    }
                }
            }
        }

        this.grid = grid;
        if (pluses) this.bottom(false);
        if (movement) this.randomCells(1);
    },
    top: function (withAdd) {
        const grid = this.createGrid();
        let movement = false;
        let pluses = false;

        for (let i=0; i < this.generalCells; i++){
            let counter = 0;
            for (let j=0; j < this.generalCells; j++){
                console.log(j);
                if (this.grid[j][i] !== undefined){
                    if (!this.grid[j][i].toRemove){
                        if (this.grid[j][i].indexes.i !== counter){
                            movement = true;
                            this.grid[j][i].moveTo(counter, this.grid[j][i].indexes.j);
                        }
                        grid[counter][this.grid[j][i].indexes.j] = this.grid[j][i];
                        counter++;
                    }
                }
            }
        }

        if (withAdd)
        for (let i=0; i < this.generalCells; i++){
            for (let j=0; j < this.generalCells -1; j++){
                //console.log(j+1);

                if (grid[j+1][i] !== undefined){
                    if (grid[j][i].value === grid[j+1][i].value) {
                        grid[j][i].remove();
                        grid[j+1][i].remove();
                        grid[j][i] = createCell(j, i, grid[j][i].value + grid[j+1][i].value);
                        j+=2;
                        pluses = true;
                        movement = true;
                    }
                }
            }
        }

        this.grid = grid;
        if (pluses) this.top(false);
        if (movement) this.randomCells(1);
    },
    randomCells: function (count) {
        for (let i=0; i<count;i++){
            const freeCells = [];
            for (let i=0;i<this.generalCells;i++){
                for (let j=0;j<this.generalCells;j++){
                    if (this.grid[i][j] === undefined) freeCells.push([i, j]);
                }
            }
            if (freeCells.length !== 0) {
                let randomNumber = 2;
                if (count !== 1) randomNumber = this.getRandomInt(1,2) * 2;
                const randomCell = freeCells[this.getRandomInt(0, freeCells.length-1)];
                const newCell = createCell(randomCell[0], randomCell[1], randomNumber);
                this.grid[randomCell[0]][randomCell[1]] = newCell;
            }
        }
    },
    getRandomInt: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
};
let newGame2048;
onload = () => {
    newGame2048 = game2048.init(4);
    onkeydown = (event) => {
        if (event.key === "ArrowLeft") newGame2048.left(true);
        if (event.key === "ArrowRight") newGame2048.right(true);
        if (event.key === "ArrowDown") newGame2048.bottom(true);
        if (event.key === "ArrowUp") newGame2048.top(true);
        console.log(event.key);
    }
}




