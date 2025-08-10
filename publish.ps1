# Remove lock file if it exists
if (Test-Path ".\Move.lock") {
    Remove-Item ".\Move.lock" -Force
}

if (Test-Path ".\Move.locksB7Q5C") {
    Remove-Item ".\Move.locksB7Q5C" -Force
}

Write-Host "Building package..."
sui move build

Write-Host "Publishing package..."
sui client publish --gas-budget 100000000