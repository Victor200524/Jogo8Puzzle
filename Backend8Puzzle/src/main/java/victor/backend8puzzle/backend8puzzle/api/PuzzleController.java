package victor.backend8puzzle.backend8puzzle.api;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class PuzzleController {

    @GetMapping("/health")
    public Map<String, String> health(){
        //Map.of vai criar um JSON {"status", "ok"}
        return Map.of("status", "ok");
    }
}
