package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static java.util.stream.Collectors.*;

@RestController
@RequestMapping("/api")
public class SalvoController {
    //-----------------------------------------------------
    //  AUTOWIRED
    //-----------------------------------------------------
    @Autowired
    private GameRepository gameRepo;

    @Autowired
    private PlayerRepository playRepo;

    @Autowired
    private GamePlayerRepository gamePlayRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //-----------------------------------------------------
    // METHODS
    //-----------------------------------------------------
    private boolean isGuest(Authentication authentication) {
        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
    }

    //-----------------------------------------------------
    // REQUEST MAPPING
    //-----------------------------------------------------
    @RequestMapping("/games")
    private Map<String, Object> getMap (Authentication auth) {
        Map<String, Object> result = new HashMap<String, Object>();
        List<Object> games = gameRepo.findAll()
                                        .stream()
                                        .map(Game::makeGameScoreDTO)
                                        .collect(toList());
        Map<String, Object> player = new HashMap<>();

        if(isGuest(auth)) {
            player.put("id", null);
            player.put("name", "Anonymous");
        } else {
            player.put("id", playRepo.findByUserName(auth.getName()).getId());
            player.put("name", auth.getName());
            player.put("role", auth.getAuthorities());
        }
        result.put("player", player);
        result.put("games", games);
        return result;
    }

    @RequestMapping("/game_view/{gamePlayer_id}")
    public Map<String, Object> findGame(@PathVariable Long gamePlayer_id) {
        GamePlayer gamePlayer = gamePlayRepo.findById(gamePlayer_id).get();
        Map<String, Object> result = gamePlayer.getGame().makeGameDTO();
        result.put("ships", gamePlayer.getPlayerShip());
        result.put("salvoes", gamePlayer.getGame().makeSalvoesDTO());
        return result;
    }

    @RequestMapping(value="/players", method=RequestMethod.POST)
    public String createPlayer(@RequestBody Player player) {
        Player playerExist = playRepo.findByUserName(player.getUserName());
        if (playerExist != null) {
            return "Exist";
        } else {
            Player newPlayer = new Player(player.getUserName(),passwordEncoder.encode(player.getPassword()));
            playRepo.save(newPlayer);
        }
        return "No exist";
    }
}