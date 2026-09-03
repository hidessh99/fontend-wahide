# ==============================================================================
# Wahide Frontend (fontwahide) - Next.js 16 (App Router + Turbopack + Bun)
# ==============================================================================

SHELL := /bin/bash
.DEFAULT_GOAL := help

.PHONY: help dev build start preview lint lint-fix typecheck check clean install install-clean update test

# ------------------------------------------------------------------------------
# 📖 Help Menu
# ------------------------------------------------------------------------------
help: ## Menampilkan panduan seluruh perintah Makefile yang tersedia
	@echo ""
	@echo "========================================================================"
	@echo "  ⚡ WAHIDE FRONTEND DEVELOPER COMMANDS (Bun & Next.js 16)"
	@echo "========================================================================"
	@echo "  make dev            - Menjalankan development server (Next.js + Turbopack)"
	@echo "  make build          - Mengompilasi build produksi (next build)"
	@echo "  make start          - Menjalankan server produksi hasil build"
	@echo "  make preview        - Alias untuk make start (preview hasil build)"
	@echo ""
	@echo "  make check          - Quality Gate: Menjalankan typecheck & lint"
	@echo "  make typecheck      - Memeriksa type-safety TypeScript (tsc --noEmit)"
	@echo "  make lint           - Memeriksa kode dengan ESLint"
	@echo "  make lint-fix       - Memperbaiki error ESLint secara otomatis"
	@echo ""
	@echo "  make install        - Menginstal dependensi proyek menggunakan Bun"
	@echo "  make install-clean  - Menghapus node_modules dan menginstal ulang bersih"
	@echo "  make update         - Memperbarui dependensi proyek ke versi terbaru"
	@echo "  make clean          - Membersihkan folder cache .next dan build artifact"
	@echo "========================================================================"
	@echo ""

# ------------------------------------------------------------------------------
# 🚀 Development & Production Server
# ------------------------------------------------------------------------------
dev: ## Menjalankan server lokal (Turbopack: http://localhost:3000)
	bun run dev

build: ## Mengompilasi aplikasi untuk produksi
	bun run build

start: ## Menjalankan aplikasi dalam mode produksi
	bun run start

preview: ## Alias menjalankan aplikasi produksi lokal
	bun run preview

# ------------------------------------------------------------------------------
# 🔍 Quality Gates & Testing
# ------------------------------------------------------------------------------
typecheck: ## Memeriksa kesesuaian tipe TypeScript tanpa emit file
	bun x tsc --noEmit

lint: ## Memeriksa static analysis kode dengan ESLint
	bun run lint

lint-fix: ## Memperbaiki pelanggaran aturan ESLint otomatis
	bun x eslint --fix .

check: typecheck lint ## Menjalankan seluruh Quality Gate (TypeScript + ESLint)

test: ## Menjalankan unit tests menggunakan Bun Test Runner
	bun test

# ------------------------------------------------------------------------------
# 🧹 Maintenance & Package Management
# ------------------------------------------------------------------------------
clean: ## Menghapus cache .next, out, dan build artifact
	rm -rf .next out tsconfig.tsbuildinfo node_modules/.cache
	@echo "✨ Cache .next dan build artifact berhasil dibersihkan."

install: ## Menginstal seluruh dependensi via Bun
	bun install

install-clean: clean ## Hapus total node_modules dan install ulang
	rm -rf node_modules bun.lockb bun.lock
	bun install
	@echo "✨ Seluruh dependensi berhasil diinstal ulang secara bersih."

update: ## Memperbarui seluruh dependensi proyek
	bun update
