var app = new Vue({
  el: "#app",
  data: {
    allGames: [],
    user: {},
    players: [],
    finishGames: [],
    name: "",
    pass: ""
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      let url = "/api/games";
      fetch(url).then(response=>{
        return response.json();
      }).then(values=>{
        this.allGames = values.games;
        this.user = values.player;
        this.players = this.getPlayers(this.allGames);
        this.finishGames = this.getFinishGames(this.allGames);
        this.getDataFinishGames(this.finishGames, this.players);
        this.createGamesTable(this.allGames);
        this.createLeaderboard(this.players);
      })
    },logFetchData() {
        let url = "/api/players"
        fetch(url, {
          method: "POST",
          body: JSON.stringify({userName: this.name, password: this.pass}),
          headers: new Headers({
            "Content-Type": "application/json"
          })
        }).then(res => res.text()
        ).then(response => {
          if(response == "Exist") {
            alert("El usuario ya existe.");
          } else {
            alert("Usuario registrado exitosamente. Ahora logueate!");
            document.querySelector("#username").value = document.querySelector("#newUsername").value;
          }
          document.querySelector("#newUsername").value = "";
          document.querySelector("#newPassword").value = "";
        })
    },getValues(event) {
      this.name = document.querySelector("#newUsername").value;
      this.pass = document.querySelector("#newPassword").value;

      this.logFetchData();
    },
    getFinishGames(juegos) {
      let terminados = [];
      for(let i = 0; i < juegos.length; i++) {
        if(juegos[i].finishDate !== null) {
          terminados.push(juegos[i]);
        }
      }
      return terminados;
    },
    getPlayers(juegos) {
      let jugadores = [];
      let auxJugadores = [];
      for(let i = 0; i < juegos.length; i++) {
        for(let j = 0; j < juegos[i].gamePlayers.length; j++) {
          let ref = juegos[i].gamePlayers[j].player.email;
          let jugador = {
            "email": "",
            "total": 0,
            "won": 0,
            "lost": 0,
            "tied": 0
          };
          if(auxJugadores.indexOf(ref) == -1) {
            jugador.email = ref;
            auxJugadores.push(ref);
            jugadores.push(jugador);
          }
        }
      }
      return jugadores;
    },
    getDataFinishGames(juegosTerminados, jugadores) {
      let jugador = [];
      for(let i = 0; i < jugadores.length; i++) {
        jugador.push(jugadores[i].email);
      }
      for(let i = 0; i < juegosTerminados.length; i++) {
        for(let j = 0; j < juegosTerminados[i].gamePlayers.length; j++) {
          let gamePlayer = juegosTerminados[i].gamePlayers[j].player;
          let pos = jugador.indexOf(gamePlayer.email);
          if(gamePlayer.score > 0.5) {
            jugadores[pos].total += gamePlayer.score;
            jugadores[pos].won++;
          } else if(gamePlayer.score < 0.5) {
            jugadores[pos].lost++;
          } else {
            jugadores[pos].total += gamePlayer.score;
            jugadores[pos].tied++;
          }
        }
      }
      jugadores.sort((a,b)=>{return b.total - a.total});
    },
    createLeaderboard(jugadores) {
      for(let i = 0; i < jugadores.length; i++) {
        let tr = document.createElement("tr");

        for(x in jugadores[i]) {
          let td = document.createElement("td");
          td.innerHTML = jugadores[i][x];
          tr.appendChild(td);
        }

        document.querySelector(".bodyLeaderboard").appendChild(tr);
      }
    },
    createGamesTable(juegos) {
      for(let i = 0; i < juegos.length; i++) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");

        /*REORDENAR FECHA Y HORA*/
        let fecha = juegos[i].created;
        fecha = fecha.split("T");
        fecha[0] = fecha[0].split("-");
        fecha[1] = fecha[1].slice(0, fecha[1].indexOf("."));
        td.innerHTML = fecha[0][2] + "/" + fecha[0][1] + "/" + fecha[0][0] + " " + fecha[1] + "hs";
        tr.appendChild(td);

        let gamePlayerRef = juegos[i].gamePlayers; /*REF A LOS GAMEPLAYERS EN ALLGAMES*/

        for(let j = 0; j < 2; j++) {
          td = document.createElement("td");
          if(gamePlayerRef[j] == undefined) {
            td.innerHTML = "Waiting for a oponent...";
            tr.appendChild(td);
          } else {
            td.innerHTML = gamePlayerRef[j].player.email;
            tr.appendChild(td);
          }
        }
        document.querySelector(".bodyGamesTable").appendChild(tr);
      }
    }
  }
})