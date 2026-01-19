#!/bin/bash
# Path to realesrgan-ncnn relative to current working directory
REAL_PATH="$PWD/realesrgan-ncnn"

# Convert relative paths to absolute paths before changing directory
if [[ "$1" != /* ]]; then
	IN="$PWD/$1"
else
	IN="$1"
fi

if [[ "$2" != /* ]]; then
	OUT="$PWD/$2"
else
	OUT="$2"
fi

# Navigate and run
pushd "$REAL_PATH" >/dev/null
./realesrgan-ncnn-vulkan -i "$IN" -o "$OUT" -n realesrgan-x4plus-anime -t 1280
popd >/dev/null

# Optional: sips --resampleWidth 2560 "$OUT" >/dev/null
