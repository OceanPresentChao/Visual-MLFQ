import { fabric } from 'fabric'
interface SVG {
  type: string
  url: string
}
const SVG_PATHS: SVG[] = [{
  type: 'process',
  url: 'atom-solid.svg',
}]

function loadSVG(svg: SVG): Promise<{ type: string; group: fabric.Object[] }> {
  return new Promise((resolve) => {
    fabric.loadSVGFromURL(svg.url, (result) => {
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
  type: string
  group: fabric.Object[]
}[]): Map<string, fabric.Object[]> {
  const result = new Map<string, fabric.Object[]>()
  for (const v of svgs)
    result.set(v.type, v.group)
  return result
}

const SVGArr = await loadAllSVGs(SVG_PATHS)

export const SVGs = svgArr2Map(SVGArr)
