import MaleNode from './MaleNode'
import FemaleNode from './FemaleNode'
import PregnancyNode from './PregnancyNode'
import DeceasedNode from './DeceasedNode'
import StudentNode from './StudentNode'

export const nodeTypes = {
  male: MaleNode,
  female: FemaleNode,
  pregnancy: PregnancyNode,
  deceased: DeceasedNode,
  student: StudentNode,
}
