package victor.backend8puzzle.backend8puzzle.api;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import victor.backend8puzzle.backend8puzzle.core.SolverService;
import victor.backend8puzzle.backend8puzzle.diretorio.MoveRequest;
import victor.backend8puzzle.backend8puzzle.diretorio.SolveRequest;
import victor.backend8puzzle.backend8puzzle.diretorio.SolveResponse;

import java.util.List;
import java.util.Map;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class PuzzleController {

    private final SolverService solverService;

    public PuzzleController(SolverService solverService) {
        this.solverService = solverService;
    }

    // Endpoint principal para resolver o puzzle
    @PostMapping("/solve")
    public SolveResponse solvePuzzle(@Valid @RequestBody SolveRequest request) {
        return solverService.solve(request);
    }

    //Embaralhar
    @GetMapping("/shuffle")
    public List<Integer> getShuffledBoard() {
        return solverService.getShuffledBoard();
    }

    //Move as peças
    @PostMapping("/move")
    public List<Integer> processUserMove(@RequestBody MoveRequest request) {
        return solverService.processMove(request);
    }

    // Verificar se ta ok o backend
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }
}