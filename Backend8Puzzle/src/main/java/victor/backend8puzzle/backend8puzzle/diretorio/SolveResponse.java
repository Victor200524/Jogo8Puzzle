package victor.backend8puzzle.backend8puzzle.diretorio;

import java.util.List;

public record SolveResponse(List<List<Integer>> path, Metrics metrics) {
    public record Metrics(long millis, int visited, int depth, int cost){

    } //essa função faz
}
