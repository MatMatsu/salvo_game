var app = new Vue({
    el: "#app",
    data: {
        columnas: ["0","1","2","3","4","5","6","7","8","9","10"],
        filas: ["0","A","B","C","D","E","F","G","H","I","J"],
        game: [],
        naves: [],
        marcasPropias: [],
        marcasAjenas: [],
        playerOne: {},
        playerTwo: {},
        gp: new URLSearchParams(window.location.search).get("gp")
    },
    methods: {
        fetchData() {
            let url = "/api/game_view/" + this.gp;
            fetch(url).then(response=>{
                return response.json();
            }).then(values=>{
                this.game = values;
                this.naves = this.objNaves(this.game.ships);

                if (this.game.gamePlayers.length == 2) {
                    if(this.gp == this.game.gamePlayers[0].id) {
                        this.playerOne = this.game.gamePlayers[0].player;
                        this.playerTwo = this.game.gamePlayers[1].player;
                    } else {
                        this.playerOne = this.game.gamePlayers[1].player;
                        this.playerTwo = this.game.gamePlayers[0].player;
                    }
                    if(this.game.salvoes[0][this.playerOne.id] == undefined) {
                        this.marcasPropias = this.game.salvoes[1][this.playerOne.id];
                        this.marcasAjenas = this.game.salvoes[0][this.playerTwo.id];
                    } else {
                        this.marcasPropias = this.game.salvoes[0][this.playerOne.id];
                        this.marcasAjenas = this.game.salvoes[1][this.playerTwo.id];
                    }
                } else {
                    this.playerOne = this.game.gamePlayers[0].player;
                    this.playerTwo = {"email": "Waiting for player 2..."};
                    this.marcasPropias = this.game.salvoes[0][this.playerOne.id];
                    this.marcasAjenas = this.game.salvoes[0][this.playerTwo.id];
                }

                this.hacerTablas();
                this.mostrarNaves();
                this.mostrarSalvoesPropios();
                this.mostrarSalvoesAjenos();
                this.tablaNaves();
            })
        },
        hacerTablas() {
            for(let i = 0; i < 2; i++) {
                let tabla = document.createElement("table");
                let titulo = document.createElement("caption");
                if(i == 0) {
                    titulo.textContent = "SHIP GRID";
                    titulo.setAttribute("class", "tituloTableroNaves");
                    tabla.setAttribute("class", "tableroNaves");
                } else {
                    titulo.textContent = "SALVO GRID";
                    titulo.setAttribute("class", "tituloTableroSalvo");
                    tabla.setAttribute("class", "tableroSalvo");
                }
                let tablaHead = document.createElement("thead");
                let tablaBody = document.createElement("tbody");

                for(let j = 0; j < this.filas.length;j++) {
                    let headTr = document.createElement("tr");
                    let bodyTr = document.createElement("tr");
                    for(let k = 0; k < this.columnas.length; k++) {
                        if(j == 0) {
                            let th = document.createElement("th");
                            th.setAttribute("class", this.filas[j] + this.columnas[k]);
                            if (k != 0) {
                                th.textContent = this.columnas[k];
                            }
                            headTr.appendChild(th);
                        } else {
                            let td = document.createElement("td");
                            td.setAttribute("class", this.filas[j] + this.columnas[k]);
                            if(k == 0) {
                                td.textContent = this.filas[j];
                            }
                            bodyTr.appendChild(td);
                        }
                    }
                    if(j == 0) {
                        tablaHead.appendChild(headTr);
                    } else {
                        tablaBody.appendChild(bodyTr);
                    }

                }
                tabla.appendChild(titulo);
                tabla.appendChild(tablaHead);
                tabla.appendChild(tablaBody);
                document.querySelector("#tableros").appendChild(tabla);
            }
        },
        objNaves(naves) {
            let barcos = [];
            for (let i = 0; i < naves.length; i++) {
                let barco = {};
                barco.type = naves[i].type;
                let posiciones = naves[i].locations;
                barco.locations = [];
                for (let j = 0; j < posiciones.length; j++) {
                    barco.locations[j] = {};
                    barco.locations[j].location = posiciones[j];
                    barco.locations[j].mark = false;
                }
                barco.sunk = false;
                barcos.push(barco);
            }
            return barcos;
        },
        mostrarNaves() {
            let tablero = document.querySelector(".tableroNaves");
            for(let i = 0; i < this.naves.length; i++) {
                let posiciones = this.naves[i].locations;
                for(let j = 0; j < posiciones.length; j++) {
                    tablero.querySelector("."+posiciones[j].location).style.backgroundColor = "green";
                }
            }
        },
        mostrarSalvoesPropios() {
            let tablero = document.querySelector(".tableroSalvo");
            for(let i = 0; i < this.marcasPropias.length; i++) {
                let posiciones = this.marcasPropias[i].locations;
                let turno = this.marcasPropias[i].turn;
                for (let j = 0; j < posiciones.length; j++) {
                    tablero.querySelector("."+posiciones[j]).style.backgroundColor = "red";
                    tablero.querySelector("."+posiciones[j]).textContent = turno;
                }
            }
        },
        buscarSalvoesAjenos(salvo){
            for (let i = 0; i < this.naves.length; i++) {
                let posiciones = this.naves[i].locations;
                for (let j = 0; j < posiciones.length; j++) {
                    let posicion = posiciones[j].location;
                    if(posicion == salvo){
                        posiciones[j].mark = true;
                        console.log("The " + this.naves[i].type + " was HIT!");

                        let cantMarcas = posiciones.reduce((total, num)=>{
                            total += (num.mark==true)?1:0;
                            return total;
                        },0);

                        if(cantMarcas == posiciones.length) {
                            this.naves[i].sunk = true;
                            console.log("The " + this.naves[i].type + " was SUNKED!");
                        }

                        return 1;
                    }
                }
            }
            return 0;
        },
        mostrarSalvoesAjenos() {
            let tablero = document.querySelector(".tableroNaves");

            for(let i = 0; i < this.marcasAjenas.length; i++) {
                let posiciones = this.marcasAjenas[i].locations;
                let turno = this.marcasAjenas[i].turn;
                for (let j = 0; j < posiciones.length; j++) {
                    if (this.buscarSalvoesAjenos(posiciones[j])==1) {
                        tablero.querySelector("."+posiciones[j]).style.backgroundColor = "red";
                        tablero.querySelector("."+posiciones[j]).textContent = turno;
                    } else {
                        tablero.querySelector("."+posiciones[j]).style.backgroundColor = "blue";
                        tablero.querySelector("."+posiciones[j]).textContent = turno;
                    }
                }
            }
        },
        tablaNaves() {
            let tabla = document.createElement("table");
            tabla.setAttribute("class", "tablaNaves");
            let tablaHead = document.createElement("thead");
            let trHead = document.createElement("tr");
            let th = document.createElement("th");
            th.textContent = "Your Ships";
            trHead.appendChild(th);
            tablaHead.appendChild(trHead);
            let tablaBody = document.createElement("tbody");

            for(let i = 0; i < this.naves.length; i++) {
                let tr = document.createElement("tr");
                let td = document.createElement("td");
                td.textContent = this.naves[i].type;
                tr.appendChild(td);
                tablaBody.appendChild(tr);
            }
            tabla.appendChild(tablaHead);
            tabla.appendChild(tablaBody);
            document.querySelector("#misNaves").appendChild(tabla);
        }
    },
    created() {
        this.fetchData();
    }
})