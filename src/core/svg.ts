import { fabric } from 'fabric'
import processURL from '/src/assets/atom-solid.svg'
import IOURL from '/src/assets/file-type-light-io.svg'
type SVGType = 'process' | 'IO' | 'runQueue' | 'waitQueue' | 'readyQueue'
interface SVG {
  type: SVGType
  url: string
}
const SVG_PATHS: SVG[] = [{
  type: 'process',
  url: processURL,
},
{
  type: 'IO',
  url: IOURL,
},
// {
//   type: 'runQueue',
//   url: 'run-all.svg',
// },
// {
//   type: 'waitQueue',
//   url: 'stop-circle.svg',
// },
// {
//   type: 'readyQueue',
//   url: 'message-queue.svg',
// }
]

function loadSVG(svg: SVG): Promise<{ type: SVGType; group: fabric.Object[] }> {
  return new Promise((resolve) => {
    fabric.loadSVGFromURL(`${svg.url}`, (result) => {
      resolve({
        type: svg.type,
        group: result,
      })
    })
  })
}

function loadAllSVGs(svgs: SVG[]) {
  const arr = svgs.map(v => loadSVG(v))
  return Promise.all(arr)
}

function svgArr2Map(svgs: {
  type: SVGType
  group: fabric.Object[]
}[]): Map<SVGType, fabric.Object[]> {
  const result = new Map<SVGType, fabric.Object[]>()
  for (const v of svgs)
    result.set(v.type, v.group)
  return result
}

const SVGArr = await loadAllSVGs(SVG_PATHS)

export const SVGs = svgArr2Map(SVGArr)
