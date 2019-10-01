package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

@Entity
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    private LocalDateTime finishDate;
    private float puntos;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gameID")
    private Game game;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="playerID")
    private Player player;

    public Score() {}

    public Score(Game newGame, Player newPlayer, float newScore) {
        game = newGame;
        player = newPlayer;
        if(newScore > -1f) {
            puntos = newScore;
            finishDate = newGame.getCreationDate().plusMinutes(30);
        }
    }

    public long getId() { return id; }

    public LocalDateTime getFinishDate() { return finishDate; }

    public float getPuntos() { return puntos; }

    public Game getGame() { return game; }

    public Player getPlayer() { return player; }
}

