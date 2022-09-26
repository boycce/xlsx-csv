// Checks if there are any column count differences on each row. This can be caused by unescaped ", commas, or linebreaks
console.clear()
const workbook = '/test.xlsx'

import fs from 'fs'
import path from 'path'
import url from 'url'
import csvParser from 'csv-parser'
import xlsxCsvRust from '../index.js'

function readCsv(filepath) {
  return new Promise((resolve, reject) => {
    let array = []
    fs.createReadStream(filepath)
      .pipe(csvParser({
        separator: ',',
        headers: false,
        mapHeaders: ({ header, index }) => index,
      }))
      .on('data', function(object) {
        // `this` refers to the new stream
        return array.push(object)
      })
      .on('end', () => resolve(array))
      .on('error', err => reject(err))
  })
}

async function main() {
  let error
  // Convert to csv
  let __dirname = path.dirname(url.fileURLToPath(import.meta.url))
  let filepath = xlsxCsvRust(__dirname + workbook).filePath

  // Read csv
  let rows = await readCsv(filepath)
  // console.log(rows)

  console.log('row 1 - ', Object.keys(rows[0]).length, 'columns')

  for (let i=1, l=rows.length; i<l; i++) {
    if (Object.keys(rows[i]).length !== Object.keys(rows[0]).length) {
      console.error('row ' + (i+1) + ' - ', Object.keys(rows[i]).length, rows[i])
      error = true
      break
    }
  }

  if (!error) console.log('\nsuccess.')
  else console.error('\nerror...')
}

main()
