package victor.backend8puzzle.backend8puzzle.diretorio;

import java.util.List;

/**
 * Representa a requisição do frontend quando o usuário clica para mover uma peça.
 * Contém o estado atual do tabuleiro e o índice da peça que o usuário clicou.
 */
public record MoveRequest(List<Integer> currentState, int tileIndex) {

}
