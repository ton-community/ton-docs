import Feedback from '@site/src/components/Feedback';

# Canonical cell serialization

## Вес ячейки

`Weight` это характеристика каждой ячейки в дереве ячеек, которая определяется следующим образом:

- Если ячейка является конечным узлом в дереве ячее: `weight = 1`;
- Для обычных ячеек (не листьев) вес — это сумма: `cell weight = children weight + 1`;
- Если ячейка является _special_, ее вес устанавливается равным нулю.

This concept is used to construct a weight-balanced tree structure when serializing cells. Приведенный ниже алгоритм объясняет, как и когда мы назначаем веса каждой ячейке для создания сбалансированного по весу дерева.

## Алгоритм переупорядочивания весов

Каждая ячейка является сбалансированным по весу деревом, и метод [reorder_cells()](https://github.com/ton-blockchain/ton/blob/15088bb8784eb0555469d223cd8a71b4e2711202/crypto/vm/boc.cpp#L249) переназначает веса на основе совокупного веса потомков. Порядок обхода — roots -> children.
The traversal order for recalculating weights is breadth-first, starting from the roots and moving toward the children. This is _likely_ chosen to preserve cache linearity.
The method also:

- Recalculates hash sizes
- Reindexes the bag of cells (roots), and each tree
- Assigns new indexes for empty references

Reindexing is performed in depth-first order, likely due to specific dependencies or optimizations. As stated in the whitepaper, this indexing order is preferred.

Чтобы следовать сериализации bag of cells исходного узла, вам следует:

- Во-первых, если веса ячеек не установлены (узел делает это при импорте ячеек), мы устанавливаем вес для каждой ячейки на `1 + sum_child_weight`, где `sum_child_weight` — это сумма весов его дочерних узлов. Добавляем один, чтобы листья имели вес 1.

- Iterate over all root cells. Повторяем все корни для каждой корневой ячейки:
  - Проверьте, имеет ли каждая из его ссылок вес меньше, чем `maximum_possible_weight - 1 + ref_index`, разделенный на количество ссылок в корневой ячейке, чтобы они равномерно распределяли родительский вес, мы делаем (+ index), чтобы убедиться, что если язык при делении принимает значение 0, мы всегда получаем математически округленное число (например, для 5 / 3, c++ вернул бы значение 1, но здесь нам нужно значение 2) This ensures that the parent’s weight is distributed uniformly among its children. The `ref_index` adjustment accounts for integer division rounding behavior in some languages (e.g., in C++, 5 / 3 yields 1, but we want 2 in this case).
  - If any reference violates this rule, add it to a list or, for efficiency, use a bitmask as done in the original implementation. Then, iterate over the invalid references and clamp their weight to `weight_left / invalid_ref_count`, where `weight_left` is calculated as `maximum_possible_weight - 1 - sum_of_valid_ref_weights`.
  - В коде это может быть реализовано как уменьшение переменной counter, которая сначала инициализируется значением `maximum_possible_weight - 1`, а затем уменьшается как `counter -= valid_ref_weight`. This effectively redistributes the remaining weight among the invalid references to balance them.

- Iterate over the root cells again. Снова перебираем корни для каждого корня:
  - Убедитесь, что новая сумма весов его ссылки меньше, чем `maximum_possible_weight`, проверьте, стала ли новая сумма меньше веса предыдущей корневой ячейки, и сопоставьте ее вес с новой суммой. (если `new_sum < root_cell_weight`, установите `root_cell_weight` равным `new_sum`)
  - Если новая сумма больше веса корня, то это должен быть особый узел, который имеет вес 0, установим его. Set the weight to 0 accordingly. (Увеличьте здесь количество внутренних хэшей на количество хэшей узла)

- Iterate over the root cells once more. For each root:
  - Снова перебираем корни для каждого корня: Если это не особый узел (если его weight > 0), увеличим количество верхних хэшей на количество хэшей узла.

- Рекурсивно переиндексируем дерево:
  - Сначала мы просматриваем все корневые ячейки. Если мы не просматривали или не посещали этот узел раньше, рекурсивно проверьте все его ссылки на наличие специальных узлов. If a special node is encountered, it must be revisited and visited before any other node. Если мы находим специальный узел, мы должны просмотреть его раньше других, это означает, что дочерние узлы этого специального узла будут первыми в списке (их индексы будут самыми низкими).
  - After handling special nodes, process the remaining children in order from the deepest to the highest in the tree.
  - Корни находятся в самом конце списка (у них самые большие индексы).

- Таким образом, в итоге мы получаем отсортированный список, где чем глубже находится узел, тем меньший у него индекс.

`maximum_possible_weight` это константа 64

## Notes

- Специальная ячейка не имеет веса (это 0)
- Убедитесь, что вес при импорте укладывается в 8 бит (weight \<= 255)
- Внутреннее количество хэшей — это сумма количества хэшей всех специальных корневых узлов
- Верхнее количество хэшей — это сумма количества хэшей всех остальных (не специальных) корневых узлов
  <Feedback />

