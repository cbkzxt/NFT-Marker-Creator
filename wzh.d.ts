export default class NftMarkerCreator_Wzh {
  params: any[]

  validImageExt: string[]

  srcImage: string

  buffer: Buffer

  foundInputPath: {
    b: boolean,
    i: number
  }

  imageData: {
    sizeX: number,
    sizeY: number,
    nc: number,
    dpi: number,
    array: any[]
  }

  useJPG(buf: Buffer): void

  usePNG(buf: Buffer): void

  getValues(str: string, type: string): number | { w: number, h: number }

  detectColorSpace(arr: any[]): number

  rgbaToRgb(arr: any[]): any[]

  calculateQuality(): { level: number, entropy: number }

  toGrayscale(arr: any[]): number[]
  
  getHistogram(arr: any[]): number[]

  loadPic(picPath: string): void

  parse(): { iset: Buffer, fset: Buffer, fset3: Buffer }

}