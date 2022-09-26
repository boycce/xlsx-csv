#!/usr/bin/env bash

cd rust-pkg

build () {
  echo "Building: $1"
  local target=$1
  cargo build --release --target=$target -v
}

build "x86_64-unknown-linux-musl"
# build "x86_64-pc-windows-gnu"
# build "x86_64-apple-darwin"
# build "aarch64-apple-darwin"
