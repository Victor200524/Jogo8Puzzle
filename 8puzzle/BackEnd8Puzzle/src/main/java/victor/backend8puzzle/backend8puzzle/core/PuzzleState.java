package victor.backend8puzzle.backend8puzzle.core;

import java.util.List;

import java.util.Objects;

/**
 Esta classe representa um único estado (ou "nó") na árvore de busca do puzzle.
 Ela é imutável: uma vez criada, seus valores não mudam.
 Implementa 'Comparable' para que possamos usar a PriorityQueue, que vai
 sempre nos dar o estado com o menor custo 'f' automaticamente.
 */
public class PuzzleState implements Comparable<PuzzleState> {

    // O estado atual do tabuleiro (uma lista de 9 números)
    private final List<Integer> tiles;

    // O custo real para chegar deste o início até este estado (número de movimentos)
    private final int g;

    // O valor da heurística (a "suposição" de quão longe estamos do fim)
    private final int h;

    // O custo total (f = g + h). É o valor que usamos para decidir qual estado explorar.
    private final int f;

    // O estado "pai" que veio antes deste. Usado para reconstruir o caminho no final.
    private final PuzzleState parent;

    // Construtor para criar um novo estado
    public PuzzleState(List<Integer> tiles, int g, int h, PuzzleState parent) {
        this.tiles = tiles;
        this.g = g;
        this.h = h;
        this.f = g + h; // O custo 'f' é sempre a soma de 'g' e 'h'
        this.parent = parent;
    }

    // Métodos "get" para que outras classes possam ler os valores
    public List<Integer> getTiles() {
        return tiles;
    }
    public int getG() {
        return g;
    }
    public PuzzleState getParent() {
        return parent;
    }

    /** Vai comparar dois estados baseado no seu custo 'f', onde
     * PriorityQueue usará isso para manter o estado de menor 'f' sempre no topo
     */
    @Override
    public int compareTo(PuzzleState other) {
        return Integer.compare(this.f, other.f);
    }

    /**Nessa função, é essencial para o HashSet de "visitados"
     * Eles garantem que o Set consiga identificar se dois estados são "iguais"
     * apenas olhando para o tabuleiro (a lista 'tiles'), ignorando g, h, f ou parent
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PuzzleState that = (PuzzleState) o;
        return Objects.equals(tiles, that.tiles);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tiles);
    }
}
