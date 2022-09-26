import os from 'os'
import fs from 'fs'
import path from 'path'
import url from 'url'
import { spawnSync } from 'child_process'

export function getPlatform() {
  const type = os.type()
  const arch = os.arch()
  if (type === 'Linux' && arch === 'x64') return 'x86_64-unknown-linux-musl'       //linux
  else if (type === 'Windows_NT' && arch === 'x64') return 'x86_64-pc-windows-gnu' //win64
  else if (type === 'Darwin' && arch === 'x64') return 'x86_64-apple-darwin'       //macos-x86_64
  else if (type === 'Darwin' && arch === 'arm64') return 'aarch64-apple-darwin'    //macos-aarch64
  else throw new Error(`Unsupported platform: ${ type } ${ arch }`)
}

export function run(...args) {
  // Will always try to use target/debug first
  let filepath
  let __dirname = path.dirname(url.fileURLToPath(import.meta.url))
  let debugPath = path.join(__dirname, 'rust-pkg/target/debug/xlsx-csv-rust')
  let releasePath = path.join(__dirname, `rust-pkg/target/${getPlatform()}/release/xlsx-csv-rust`)

  if (fs.existsSync(debugPath)) filepath = debugPath
  else if (fs.existsSync(debugPath + '.exe')) filepath = debugPath + '.exe'
  else if (fs.existsSync(releasePath)) filepath = releasePath
  else if (fs.existsSync(releasePath + '.exe')) filepath = releasePath + '.exe'
  else throw 'No rust binary found...'

  const result = spawnSync(filepath, args, {})
  if (result.error) throw result.error
  return result
}

export default run
