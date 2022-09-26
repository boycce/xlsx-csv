# xlsx-csv-rust

Fast xlsx to csv converter based on Rust package [Calamine](https://github.com/tafia/calamine). It faster than [SheetJs][https://github.com/SheetJS/sheetjs] at least 3 times and eats 5 times smaller memory

### Install
`npm install xlsx-csv-rust`

### Usage

```js
import fs from 'fs'
import { convertFile } from 'xlsx-to-csv'

const { filepath } = convertFile('./file.xlsx')
const csvData = fs.readFileSync(filepath, { encoding: 'utf-8' })

console.log(csvData)
```

### Testing

1. Install rust
2. `cargo install cargo-watch`
3. `npm run test` or `npm run test:integration` (for node integration test)

### Building for release

1. Install rust
2. Install rust target enviornments
  ```bash
  rustup target add x86_64-apple-darwin  # requires macos machine to build
  rustup target add aarch64-apple-darwin # requires macos machine to build
  rustup target add x86_64-pc-windows-gnu
  rustup target add x86_64-unknown-linux-musl
  ```
3. (on linux) install build tool required for windows `sudo apt-get install mingw-w64`
4. `npm run build`

### Licence

MIT
