Write-Host "🚀 Starting Fast Verification..." -ForegroundColor Cyan

Write-Host "🎨 Formatting & Linting code (Biome)..."
npm run check

Write-Host "🔍 Dead Code Analysis (Knip)..."
npx knip

Write-Host "🧪 Running Unit Tests (Vitest)..."
npm run test

Write-Host "🛡️ Static analysis (Typecheck)..."
npx tsc --noEmit

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Quality Gate Passed!" -ForegroundColor Green
} else {
    Write-Host "❌ Quality Gate Failed!" -ForegroundColor Red
    exit 1
}
