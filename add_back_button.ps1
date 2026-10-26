# もどるボタン一括追加ツール（むん先生の学習クエスト）
# 3〜6年算数の各単元フォルダの index.html に、次の1行を </body> の直前に入れます。
#   <script src="/mun-link.js"></script>
# ・すでに入っているファイルは、そのままにします（何回実行しても大丈夫）
# ・文字コード（UTF-8）や改行はそのまま。1行を足すだけで、ほかは変えません
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$folders = @('3nennseisannsuu', '4nennseisannsuu', '5nenseisannsuu', '6nennseisannsuu')
$tag = '<script src="/mun-link.js"></script>'
$strict = New-Object System.Text.UTF8Encoding($false, $true)
$added = 0; $skipped = 0; $errors = 0

Write-Host ''
Write-Host '=== もどるボタン一括追加ツール ===' -ForegroundColor Cyan
Write-Host ('作業する場所: ' + $root)
if (-not (Test-Path (Join-Path $root 'index.html'))) {
  Write-Host 'このツールは、トップページの index.html と同じ場所に置いて実行してください。' -ForegroundColor Red
  Read-Host 'Enterキーで終了'; exit 1
}
foreach ($f in $folders) {
  $dir = Join-Path $root $f
  if (-not (Test-Path $dir)) { Write-Host ('（' + $f + ' フォルダがないので、とばします）') -ForegroundColor DarkGray; continue }
  Write-Host ''
  Write-Host ('[' + $f + ']') -ForegroundColor Yellow
  foreach ($unit in (Get-ChildItem -LiteralPath $dir -Directory | Sort-Object Name)) {
    $file = Join-Path $unit.FullName 'index.html'
    if (-not (Test-Path -LiteralPath $file)) { Write-Host ('  - ' + $unit.Name + ' : index.html がありません') -ForegroundColor DarkGray; continue }
    try {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $bom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
      try { $text = $strict.GetString($bytes) } catch { Write-Host ('  × ' + $unit.Name + ' : 文字コードが UTF-8 ではないので、さわりませんでした') -ForegroundColor Red; $errors++; continue }
      if ($text.Length -gt 0 -and $text[0] -eq [char]0xFEFF) { $text = $text.Substring(1) }
      if ($text -match 'mun-link\.js') { Write-Host ('  ・' + $unit.Name + ' : もう入っています') -ForegroundColor DarkGray; $skipped++; continue }
      $nl = "`n"; if ($text.Contains("`r`n")) { $nl = "`r`n" }
      $i = $text.LastIndexOf('</body>', [System.StringComparison]::OrdinalIgnoreCase)
      if ($i -ge 0) { $text = $text.Insert($i, $tag + $nl) } else { $text = $text + $nl + $tag + $nl }
      [System.IO.File]::WriteAllText($file, $text, (New-Object System.Text.UTF8Encoding($bom)))
      Write-Host ('  ○ ' + $unit.Name + ' : 追加しました') -ForegroundColor Green; $added++
    } catch { Write-Host ('  × ' + $unit.Name + ' : ' + $_.Exception.Message) -ForegroundColor Red; $errors++ }
  }
}
Write-Host ''
Write-Host ('おわり！  追加: ' + $added + ' こ ／ もう入っていた: ' + $skipped + ' こ ／ できなかった: ' + $errors + ' こ') -ForegroundColor Cyan
Write-Host 'このあと、いつも通り GitHub にアップロードしてください。'
Read-Host 'Enterキーで終了'
