package victor.backend8puzzle.backend8puzzle.diretorio;

import java.util.List;

/**
 * Resposta do POST /api/solve
 * Exemplo de JSON:
 * {
 *   "path": [[1,2,3,4,0,6,7,5,8], [1,2,3,4,5,6,7,8,0]],
 *   "metrics": { "millis": 12, "visited": 42, "depth": 2, "cost": 2 }
 * }
 */
public record SolveResponse(
        List<List<Integer>> path,
        Metrics metrics
) {
    public record Metrics(long millis, int visited, int depth, int cost) {}
}
