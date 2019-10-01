package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static java.util.stream.Collectors.toList;

@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    private String userName;
    private String password;

    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    private Set<GamePlayer> gamePlayers;

    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    private Set<Score> scores;

    public Player() { }

    public Player(String user, String pass) {
        userName = user;
        password = pass;
    }

    public Map<String, Object> makePlayerDTO(Player jugador) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", jugador.getId());
        dto.put("email", jugador.getUserName());
        return dto;
    }

    public Map<String, Object> makePlayerScoreDTO(Player jugador, Game game) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", jugador.getId());
        dto.put("email", jugador.getUserName());
        List<Object> puntos = scores.stream()
                                    .filter(a->a.getGame().equals(game) && a.getPlayer().equals(jugador))
                                    .map(a->a.getPuntos())
                                    .collect(toList());
        dto.put("score", puntos.get(0));
        return dto;
    }

    public long getId() { return id; }

    public String getUserName() {
        return userName;
    }

    public String getPassword() { return password; }
    public void setPassword(String pass) { this.password = pass; }

    public String toString() {
        return userName;
    }

    public Set<Score> getScores() { return scores; }

}