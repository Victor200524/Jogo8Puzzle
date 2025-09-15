package victor.backend8puzzle.backend8puzzle.diretorio;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public class SolveRequest {
    @NotNull List<Integer> inicial;
    @NotNull List<Integer> goal;
    @NotNull Algoritimo algoritimo;
    @NotNull Heuristico heuristico;
}
