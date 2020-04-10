const path = require('path')
const fs = require('fs')
const PNG = require('pngjs').PNG
const jpeg = require('jpeg-js')

var artoolkit_wasm_url = './libs/NftMarkerCreator_wasm.wasm'

class NftMarkerCreator_Wzh {

  params = [
    0,
    0
  ];

  validImageExt = ['.jpg', '.jpeg', '.png'];

  srcImage

  buffer

  foundInputPath = {
    b: false,
    i: -1
  }

  imageData = {
    sizeX: 0,
    sizeY: 0,
    nc: 0,
    dpi: 0,
    array: []
  }

  useJPG(buf) {
    let decoded = jpeg.decode(buf, true)
    let newArr = []

    let verifyColorSpace = this.detectColorSpace(decoded.data)

    if (verifyColorSpace == 1) {
      for (let j = 0; j < decoded.data.length; j += 4) {
        newArr.push(decoded.data[j])
      }
    } else if (verifyColorSpace == 3) {
      for (let j = 0; j < decoded.data.length; j += 4) {
        newArr.push(decoded.data[j])
        newArr.push(decoded.data[j + 1])
        newArr.push(decoded.data[j + 2])
      }
    }

    let uint = new Uint8Array(newArr)
    this.imageData.nc = verifyColorSpace
    this.imageData.array = uint
    this.imageData.sizeX = decoded.width
    this.imageData.sizeY = decoded.height
    this.imageData.dpi = 72
  }

  usePNG(buf) {
    let data
    var png = PNG.sync.read(buf)

    var arrByte = new Uint8Array(png.data)
    if (png.alpha) {
      data = this.rgbaToRgb(arrByte)
    } else {
      data = arrByte
    }

    let newArr = []

    let verifyColorSpace = this.detectColorSpace(data)

    if (verifyColorSpace == 1) {
      for (let j = 0; j < data.length; j += 4) {
        newArr.push(data[j])
      }
    } else if (verifyColorSpace == 3) {
      for (let j = 0; j < data.length; j += 4) {
        newArr.push(data[j])
        newArr.push(data[j + 1])
        newArr.push(data[j + 2])
      }
    }

    let uint = new Uint8Array(newArr)

    this.imageData.array = uint
    this.imageData.nc = verifyColorSpace
    this.imageData.sizeX = png.width
    this.imageData.sizeY = png.height
    this.imageData.dpi = 72
  }

  getValues(str, type) {
    let values
    if (type == 'wh') {
      let Wstr = 'W='
      let Hstr = 'H='
      var doesContainW = str.indexOf(Wstr)
      var doesContainH = str.indexOf(Hstr)

      let valW = parseInt(str.slice(doesContainW + 2, doesContainH))
      let valH = parseInt(str.slice(doesContainH + 2))

      values = {
        w: valW,
        h: valH
      }
    } else if (type == 'nc') {
      let nc = 'NC='
      var doesContainNC = str.indexOf(nc)
      values = parseInt(str.slice(doesContainNC + 3))
    } else if (type == 'dpi') {
      let dpi = 'DPI='
      var doesContainDPI = str.indexOf(dpi)
      values = parseInt(str.slice(doesContainDPI + 4))
    }

    return values
  }

  detectColorSpace(arr) {
    let target = Math.floor(arr.length / 4)

    let counter = 0

    for (let j = 0; j < arr.length; j += 4) {
      let r = arr[j]
      let g = arr[j + 1]
      let b = arr[j + 2]

      if (r == g && r == b) {
        counter++
      }
    }

    if (target == counter) {
      return 1
    } else {
      return 3
    }
  }

  rgbaToRgb(arr) {
    let newArr = []
    let BGColor = {
      R: 255,
      G: 255,
      B: 255
    }

    for (let i = 0; i < arr.length; i += 4) {

      let r = Math.floor(255 * (((1 - arr[i + 3]) * BGColor.R) + (arr[i + 3] * arr[i])))
      let g = Math.floor(255 * (((1 - arr[i + 3]) * BGColor.G) + (arr[i + 3] * arr[i + 1])))
      let b = Math.floor(255 * (((1 - arr[i + 3]) * BGColor.B) + (arr[i + 3] * arr[i + 2])))

      newArr.push(r)
      newArr.push(g)
      newArr.push(b)
    }
    return newArr
  }

  calculateQuality() {
    let gray = this.toGrayscale(this.imageData.array)
    let hist = this.getHistogram(gray)
    let ent = 0
    let totSize = this.imageData.sizeX * this.imageData.sizeY
    for (let i = 0; i < 255; i++) {
      if (hist[i] > 0) {
        let temp = (hist[i] / totSize) * (Math.log(hist[i] / totSize))
        ent += temp
      }
    }

    let entropy = parseFloat((-1 * ent).toFixed(2))
    let oldRange = (5.17 - 4.6)
    let newRange = (5 - 0)
    let level = (((entropy - 4.6) * newRange) / oldRange)

    if (level > 5) {
      level = 5
    } else if (level < 0) {
      level = 0
    }
    return { level, entropy }
  }

  toGrayscale(arr) {
    let gray = []
    for (let i = 0; i < arr.length; i += 3) {
      let avg = (arr[i] + arr[i + 1] + arr[i + 2]) / 3
      gray.push(Math.floor(avg))
    }
    return gray
  }

  getHistogram(arr) {
    let hist = [256]
    for (let i = 0; i < arr.length; i++) {
      hist[i] = 0
    }
    for (let i = 0; i < arr.length; i++) {
      hist[arr[i]]++
    }
    return hist
  }

  loadPic(picPath) {
    this.srcImage = path.resolve(picPath)

    let fileNameWithExt = path.basename(this.srcImage)
    let fileName = path.parse(fileNameWithExt).name
    let extName = path.parse(fileNameWithExt).ext

    this.params[1] = fileNameWithExt

    let foundExt = false
    for (let ext in this.validImageExt) {
      if (extName.toLowerCase() === this.validImageExt[ext]) {
        foundExt = true
        break
      }
    }

    if (!foundExt) {
      throw 'ERROR: Invalid image TYPE!\n Valid types:(jpg,JPG,jpeg,JPEG,png,PNG)'
    }

    if (!fs.existsSync(this.srcImage)) {
      throw 'ERROR: Not possible to read image, probably invalid image PATH!'
    } else {
      this.buffer = fs.readFileSync(this.srcImage)
    }

    if (extName.toLowerCase() == '.jpg' || extName.toLowerCase() == '.jpeg') {
      this.useJPG(this.buffer)
    } else if (extName.toLowerCase() == '.png') {
      this.usePNG(this.buffer)
    }
  }

  async parse() {
    const Module = require('./libs/NftMarkerCreator_wasm.js')
    await new Promise(resolve => Module.onRuntimeInitialized = resolve)
    let n = this.imageData.array.length * this.imageData.array.BYTES_PER_ELEMENT
    let heapSpace = Module._malloc(this.imageData.array.length * this.imageData.array.BYTES_PER_ELEMENT)
    Module.HEAPU8.set(this.imageData.array, heapSpace)
    Module._createImageSet(heapSpace, this.imageData.dpi, this.imageData.sizeX, this.imageData.sizeY, this.imageData.nc, 'temp', this.params.length, this.params)
    Module._free(heapSpace)

    let filenameIset = 'asa.iset'
    let filenameFset = 'asa.fset'
    let filenameFset3 = 'asa.fset3'

    let iset = Module.FS.readFile(filenameIset)
    let fset = Module.FS.readFile(filenameFset)
    let fset3 = Module.FS.readFile(filenameFset3)

    return { iset, fset, fset3 }
  }

}

module.exports = NftMarkerCreator_Wzh