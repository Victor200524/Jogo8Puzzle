package victor.backend8puzzle.backend8puzzle.diretorio;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Corpo do POST /api/solve
 * Exemplo de JSON:
 * {
 *   "initial":   [1,2,3,4,0,6,7,5,8],
 *   "goal":      [1,2,3,4,5,6,7,8,0],
 *   "algorithm": "ASTAR",
 *   "heuristic": "MANHATTAN"
 * }
 */

public record SolveRequest (
        @NotNull @Size(min = 9, max = 9) List<Integer> initial, // esse size vai garantir que entra 9 numeros
        @NotNull @Size(min = 9, max = 9) List<Integer> goal, // Usamos Lis pq o JSON vai chegar como Array
        @NotNull Algoritimo algorithm,
        @NotNull Heuristico heuristic
) {

}
