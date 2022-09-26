// Checks if there are any differences in the column count on each row. This can be caused by unescaped " or linebreaks
// (The rust binary should always produce the same columns if keepNewlines = false)
console.clear()

import fs from 'fs'
import path from 'path'
import url from 'url'
import xlsxCsvRust from '../index.js'

let error
let __dirname = path.dirname(url.fileURLToPath(import.meta.url))
let filepath = xlsxCsvRust(__dirname + '/test1.xlsx').filePath
let rows = fs.readFileSync(filepath, { encoding: 'utf-8' }).split(/\r?\n/)

console.log('row 1', rows[0].split(';').length)

for (let i=1, l=rows.length; i<l; i++) {
  if (rows[i].split(';').length !== rows[0].split(';').length) {
    console.error('row ' + (i+1), rows[i].split(';').length, rows[i])
    error = true
    break
  }
}

if (!error) console.log('\nsuccess.')
else console.error('\nerror...')
