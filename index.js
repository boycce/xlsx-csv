import path from 'path'
import run from './rust-run.js'

export function convertFile(filePath, sheetName, keepNewlines) {
  const args = [filePath]
  if (sheetName) args.push(sheetName)
  if (keepNewlines) args.push(keepNewlines)

  run(...args)

  return { filePath: changeExtension(filePath, '.csv') }
}

export function changeExtension(filePath, extension) {
  const basename = path.basename(filePath, path.extname(filePath))
  return path.join(path.dirname(filePath), basename + extension)
}

export default convertFile
