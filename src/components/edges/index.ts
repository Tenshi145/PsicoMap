import NormalEdge from './NormalEdge'
import FusedEdge from './FusedEdge'
import ConflictEdge from './ConflictEdge'
import BreakEdge from './BreakEdge'
import PositiveEdge from './PositiveEdge'
import NegativeEdge from './NegativeEdge'

export const edgeTypes = {
  normal: NormalEdge,
  fused: FusedEdge,
  conflict: ConflictEdge,
  break: BreakEdge,
  positive: PositiveEdge,
  negative: NegativeEdge,
}
