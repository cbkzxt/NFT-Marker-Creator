const process = require('process')
const path = require('path')
const fs = require('fs').promises

const NftMarkerCreator_Wzh = require('./wzh')

function removeExt(url) {
  let extName = path.extname(url)
  return url.substring(0, url.length - extName.length)
}

(async function () {
  let cc = new NftMarkerCreator_Wzh()
  cc.loadPic(path.resolve(path.join(process.argv[2], process.argv[3])))
  let { iset, fset, fset3 } = await cc.parse()
  let baseName = removeExt(path.join(process.argv[4], process.argv[3]))
  await fs.writeFile(baseName + '.iset', iset)
  await fs.writeFile(baseName + '.fset', fset)
  await fs.writeFile(baseName + '.fset3', fset3)
})()
