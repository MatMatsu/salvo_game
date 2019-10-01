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

    @Autowired
    private GameRepository gameRepo;

    @Autowired
    private PlayerRepository playRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private boolean isGuest(Authentication authentication) {
        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
    }

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

    @Autowired
    private GamePlayerRepository gamePlayRepo;

    @RequestMapping("/game_view/{gamePlayer_id}")
    public Map<String, Object> findGame(@PathVariable Long gamePlayer_id) {
        GamePlayer gamePlayer = gamePlayRepo.findById(gamePlayer_id).get();
        Map<String, Object> result = gamePlayer.getGame().makeGameDTO();
        result.put("ships", gamePlayer.getPlayerShip());
        result.put("salvoes", gamePlayer.getGame().makeSalvoesDTO());
        return result;
    }

    @RequestMapping(value="/players", method=RequestMethod.POST)
    public ResponseEntity<String> createPlayer(@RequestBody Player player) {
        Player playerExist = playRepo.findByUserName(player.getUserName());
        if (playerExist != null) {
            throw new UsernameNotFoundException("Unknown user: " + player.getUserName());
        } else {
            Map<String, Object> result = new HashMap<>();
            result.put("name", player.getUserName());
            result.put("pass", passwordEncoder.encode(player.getPassword()));

            //Player newPlayer = new Player(player.getUserName(),passwordEncoder.encode(player.getPassword()));
            Player newPlayer = new Player(player.getUserName(),player.getPassword());
            playRepo.save(newPlayer);

        }
        return null;
    }

}