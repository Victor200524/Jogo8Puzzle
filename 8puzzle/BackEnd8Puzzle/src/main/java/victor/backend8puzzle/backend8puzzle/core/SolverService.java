package victor.backend8puzzle.backend8puzzle.core;

import org.springframework.stereotype.Service;
import victor.backend8puzzle.backend8puzzle.diretorio.*;

import java.util.*;

@Service
public class SolverService {

    // Tabela de movimentos possíveis para cada posição do '0' no tabuleiro
    // Um exemplo é se o '0' está na posição 0, ele pode ir para a 1 ou 3
    private static final int[][] MOVES = {
            {1, 3}, {0, 2, 4}, {1, 5},
            {0, 4, 6}, {1, 3, 5, 7}, {2, 4, 8},
            {3, 7}, {4, 6, 8}, {5, 7}
    };
    //função prinicipal que resolve o puzzle
    public SolveResponse solve(SolveRequest request) {
        long startTime = System.currentTimeMillis();

        // Fila de prioridade que sempre mantém o estado com menor custo 'f' no topo
        PriorityQueue<PuzzleState> openQueue = new PriorityQueue<>();

        // Conjunto (Set) para guardar os estados que já visitamos, para não entrar em loop
        Set<List<Integer>> closedSet = new HashSet<>();

        // Calcula a heurística inicial e cria o primeiro estado (o ponto de partida)
        int initialH = calculateHeuristic(request.initial(), request.goal(), request.heuristic());
        PuzzleState startState = new PuzzleState(request.initial(), 0, initialH, null);

        openQueue.add(startState);
        int visitedNodes = 0;
        SolveResponse response = null;

        // Loop principal: continua enquanto houver estados para explorar
        while (!openQueue.isEmpty() && response == null) {
            // Pega o estado com o menor custo 'f' da fila
            PuzzleState current = openQueue.poll();
            visitedNodes++;

            // Se o estado atual é o objetivo, encontramos o resultado solicitado pelo usuario
            if (current.getTiles().equals(request.goal())) {
                long endTime = System.currentTimeMillis();
                List<List<Integer>> path = reconstructPath(current);
                SolveResponse.Metrics metrics = new SolveResponse.Metrics(
                        endTime - startTime,
                        visitedNodes,
                        path.size() - 1,
                        current.getG()
                );
                response = new SolveResponse(path, metrics);
            }
            else {
                // Adiciona o estado atual ao conjunto de visitados
                closedSet.add(current.getTiles());

                // Gera todos os movimentos possíveis a partir do estado atual
                for (List<Integer> neighborTiles : generateNeighbors(current.getTiles())) {
                    // Se o vizinho já foi visitado, pula para o próximo
                    if (!closedSet.contains(neighborTiles)) {
                        // Calcula os custos para o vizinho
                        int g = current.getG() + 1;
                        int h = calculateHeuristic(neighborTiles, request.goal(), request.heuristic());

                        // No A*, f = g + h. No Greedy, f = h
                        int f = (request.algorithm() == Algoritimo.ASTAR) ? g + h : h;

                        PuzzleState neighborState = new PuzzleState(neighborTiles, g, h, current);
                        openQueue.add(neighborState);
                    }
                }
            }
        }

        if(response != null) {
            return response;
        }
        else {
            // Se o loop terminar e não encontrarmos solução, lança um erro
            throw new RuntimeException("Solução não encontrada");
        }
    }

    //Calcula a heurística para um dado estado
    private int calculateHeuristic(List<Integer> tiles, List<Integer> goal, Heuristico heuristic) {
        if (heuristic == Heuristico.MANHATTAN) {
            return hManhattan(tiles, goal);
        }
        else {
            return hMisplaced(tiles, goal);
        }
    }

    // Na Heurística 1, conta quantas peças estão no lugar errado
    private int hMisplaced(List<Integer> tiles, List<Integer> goal) {
        int misplacedCount = 0;
        for (int i = 0; i < tiles.size(); i++) {
            // Se a peça na posição 'i' não é a peça vazia e está no lugar errado
            if (tiles.get(i) != 0 && !tiles.get(i).equals(goal.get(i))) {
                misplacedCount++;
            }
        }
        return misplacedCount;
    }

    // Na heurística 2, a soma das distâncias de Manhattan para todas as peças
    private int hManhattan(List<Integer> tiles, List<Integer> goal) {
        int distanceSum = 0;
        for (int i = 0; i < tiles.size(); i++) {
            int value = tiles.get(i);
            // Ignora a peça vazia
            if (value != 0) {
                // Acha a posição onde esta peça deveria estar no gabarito 'goal'
                int goalIndex = goal.indexOf(value);

                // Calcula a posição (linha, coluna) atual e do objetivo
                int currentRow = i / 3;
                int currentCol = i % 3;
                int goalRow = goalIndex / 3;
                int goalCol = goalIndex % 3;

                // Soma a distância vertical e horizontal
                distanceSum += Math.abs(currentRow - goalRow) + Math.abs(currentCol - goalCol);
            }
        }
        return distanceSum;
    }

    //Gera uma lista de novos estados a partir dos movimentos possíveis
    private List<List<Integer>> generateNeighbors(List<Integer> tiles) {
        List<List<Integer>> neighbors = new ArrayList<>();
        // Acha a posição da peça vazia ('0')
        int zeroIndex = tiles.indexOf(0);

        // Para cada movimento possível a partir da posição do '0'
        for (int moveIndex : MOVES[zeroIndex]) {
            // Cria uma cópia do tabuleiro atual para não modificar o original
            List<Integer> neighborTiles = new ArrayList<>(tiles);
            // Troca a peça '0' com a peça do movimento
            Collections.swap(neighborTiles, zeroIndex, moveIndex);
            neighbors.add(neighborTiles);
        }
        return neighbors;
    }

    //Reconstrói o caminho da solução, começando do estado final e voltando pelos "pais" até chegar no estado inicial
    private List<List<Integer>> reconstructPath(PuzzleState finalState) {
        List<List<Integer>> path = new ArrayList<>();
        PuzzleState current = finalState;
        // Enquanto houver um "pai", continue voltando
        while (current != null) {
            path.add(current.getTiles());
            current = current.getParent();
        }
        // O caminho foi construído de trás para frente, então precisamos invertê-lo.
        Collections.reverse(path);
        return path;
    }

    //Abaixo eu emabarlho o tabuleiro
    public List<Integer> getShuffledBoard() {
        // Começa com o tabuleiro resolvido
        List<Integer> board = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 0));

        // Faz 150 movimentos aleatórios para embaralhar bem
        int shuffleSteps = 150;
        Random random = new Random();

        for (int i = 0; i < shuffleSteps; i++) {
            int zeroIndex = board.indexOf(0);
            int[] possibleMoves = MOVES[zeroIndex];

            // Pega um movimento aleatório da lista de movimentos possíveis
            int randomMoveIndex = possibleMoves[random.nextInt(possibleMoves.length)];

            // Troca o zero de lugar com a peça escolhida
            Collections.swap(board, zeroIndex, randomMoveIndex);
        }
        return board;
    }

    // Vai processar o movimento que o usuário solicitou
    public List<Integer> processMove(MoveRequest request) {
        List<Integer> currentBoard = new ArrayList<>(request.currentState());
        int tileIndexToMove = request.tileIndex();

        int zeroIndex = currentBoard.indexOf(0);

        // Verifica se a peça clicada é vizinha do espaço vazio
        boolean isValidMove = false;
        for (int validMoveIndex : MOVES[zeroIndex]) {
            if (validMoveIndex == tileIndexToMove) {
                isValidMove = true;
            }
        }

        // Se o movimento for válido, troca as peças
        // Se não for, apenas retorna o tabuleiro como estava, sem alterações
        if (isValidMove) {
            Collections.swap(currentBoard, zeroIndex, tileIndexToMove);
        }

        return currentBoard;
    }
}