package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

import static java.util.stream.Collectors.toList;

@Entity
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    private LocalDateTime creationDate;

    @OneToMany(mappedBy="game", fetch=FetchType.EAGER)
    private Set<GamePlayer> gamePlayers;

    @OneToMany(mappedBy="game", fetch=FetchType.EAGER)
    private Set<Score> scores;

    public Game() {}

    public Game(int hora) {
        creationDate = LocalDateTime.now().plusHours(hora);
    }

    public Map<String, Object> makeGameDTO () {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", getId());
        dto.put("created", getCreationDate());
        dto.put("gamePlayers", gamePlayers.stream().map(GamePlayer::makeGamePlayerDTO));
        return dto;
    }

    public Map<String, Object> makeGameScoreDTO () {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", getId());
        dto.put("created", getCreationDate());
        List<Object> game = scores.stream()
                                    .filter(a->a.getGame().getId() == getId())
                                    .map(a->a.getFinishDate())
                                    .collect(toList());
        dto.put("finishDate", game.get(0));
        dto.put("gamePlayers", gamePlayers.stream().map(GamePlayer::makeGamePlayerScoreDTO));
        return dto;
    }

    public List<Object> makeSalvoesDTO () {
        return gamePlayers.stream().sorted(Comparator.comparingLong(a->a.getPlayer().getId())).map(GamePlayer::getGameSalvoes).collect(toList());
    }

    public long getId() { return id; }

    public LocalDateTime getCreationDate() { return creationDate; }

    public Set<GamePlayer> getGamePlayers() { return gamePlayers; }
}