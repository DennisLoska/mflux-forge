#!/bin/bash
# mflux-forge setup script for Mac
set -e

echo "🚀 Setting up mflux-forge..."
echo "============================="

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
	echo "❌ This setup script is only for macOS"
	exit 1
fi

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
	echo "❌ No virtual environment found. Please create one first:"
	echo "python -m venv .venv"
	exit 1
fi

echo "✅ Found existing virtual environment"

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source .venv/bin/activate >/dev/null 2>&1 || true

# Check if Homebrew is installed
if ! command -v brew &>/dev/null; then
	echo "📦 Installing Homebrew..."
	/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
	echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >>~/.zprofile
	eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# Install wget for Real-ESRGAN
if ! command -v wget &>/dev/null; then
	echo "📥 Installing wget..."
	brew install wget
fi

# Install opencode CLI
if ! command -v opencode &>/dev/null; then
	echo "🤖 Installing OpenCode CLI..."
	brew install anomalyco/tap/opencode
fi

# Check if mflux is installed in venv
if ! pip list --format=freeze 2>/dev/null | grep -q "^mflux=="; then
	echo "🎨 Installing MFlux in virtual environment..."
	pip install mflux --pre 2>/dev/null
else
	echo "✅ MFlux already installed in virtual environment"
fi

# Setup Real-ESRGAN NCNN binary
if [ ! -d "realesrgan-ncnn" ]; then
	echo "🔍 Downloading Real-ESRGAN NCNN binary..."
	mkdir -p realesrgan-ncnn
	cd realesrgan-ncnn

	# Download the macOS NCNN binary (using v0.2.5.0 as v0.3.0 doesn't have NCNN binaries)
	wget https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/realesrgan-ncnn-vulkan-20220424-macos.zip

  # Extract the zip file
  unzip realesrgan-ncnn-vulkan-20220424-macos.zip
  rm realesrgan-ncnn-vulkan-20220424-macos.zip

  # Make the binary executable
  chmod +x realesrgan-ncnn-vulkan

  # Create .gitignore to ignore contents but keep directory
  echo "*" >.gitignore

	cd ..
else
	echo "✅ Real-ESRGAN NCNN binary already exists"
fi

# Install project dependencies (Bun/JavaScript)
echo "📦 Installing project dependencies..."
if command -v bun &>/dev/null; then
	bun install
else
	echo "⚠️  Bun not found. Installing Bun..."
	curl -fsSL https://bun.sh/install | bash
	source ~/.zshrc
	bun install
fi

# Deactivate venv
deactivate

echo "✅ Setup complete!"
echo "=================="
echo "Your virtual environment is ready with all dependencies."
echo ""
echo "To activate the virtual environment for Python work:"
echo "source .venv/bin/activate"
echo ""
echo "To run the application:"
echo "bun start"
echo ""
