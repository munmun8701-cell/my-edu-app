# アプリ説明 一括追加ツール（むん先生の学習クエスト）
# 各アプリの index.html の </body> の直前に「このアプリについて（保護者・先生の方へ）」の説明を入れます。
# ・説明の中身は、同じ場所にある mq_about_data.json に入っています
# ・何回実行しても大丈夫（前に入れた説明は、新しい説明に置きかわります）
# ・<head> に説明文（meta description）がないページには、説明文も入れます
# ・文字コード（UTF-8）や改行はそのまま。ほかの部分は変えません
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$utf8 = New-Object System.Text.UTF8Encoding($false, $true)
Write-Host ''
Write-Host '=== アプリ説明 一括追加ツール ===' -ForegroundColor Cyan
Write-Host ('作業する場所: ' + $root)
$dataPath = Join-Path $root 'mq_about_data.json'
if (-not (Test-Path (Join-Path $root 'index.html')) -or -not (Test-Path $dataPath)) {
  Write-Host 'このツールと mq_about_data.json を、トップページの index.html と同じ場所に置いて実行してください。' -ForegroundColor Red
  Read-Host 'Enterキーで終了'; exit 1
}
$data = [System.IO.File]::ReadAllText($dataPath, $utf8) | ConvertFrom-Json
$added = 0; $updated = 0; $missing = 0; $errors = 0
$blockRe = New-Object System.Text.RegularExpressions.Regex('(?s)<!-- mq-about:start.*?<!-- mq-about:end -->\r?\n?')
foreach ($e in $data) {
  $file = Join-Path $root ($e.path -replace '/', [System.IO.Path]::DirectorySeparatorChar)
  if (-not (Test-Path -LiteralPath $file)) { Write-Host ('  - ' + $e.path + ' : ファイルがありません（とばします）') -ForegroundColor DarkGray; $missing++; continue }
  try {
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $bom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
    try { $text = $utf8.GetString($bytes) } catch { Write-Host ('  × ' + $e.path + ' : 文字コードが UTF-8 ではないので、さわりませんでした') -ForegroundColor Red; $errors++; continue }
    if ($text.Length -gt 0 -and $text[0] -eq [char]0xFEFF) { $text = $text.Substring(1) }
    $nl = "`n"; if ($text.Contains("`r`n")) { $nl = "`r`n" }
    $html = ($e.html -replace "`r?`n", $nl)
    $wasThere = $blockRe.IsMatch($text)
    $text = $blockRe.Replace($text, '')
    $i = $text.LastIndexOf('</body>', [System.StringComparison]::OrdinalIgnoreCase)
    if ($i -ge 0) { $text = $text.Insert($i, $html + $nl) } else { $text = $text + $nl + $html + $nl }
    # <head> への追加（なければ）
    $headAdd = ''
    if ($text -notmatch '(?i)<meta[^>]+name\s*=\s*["'']description["'']') { $headAdd += '<meta name="description" content="' + [System.Net.WebUtility]::HtmlEncode($e.desc) + '">' + $nl }
    if ($e.canonical -and $text -notmatch '(?i)<link[^>]+rel\s*=\s*["'']canonical["'']') { $headAdd += '<link rel="canonical" href="' + $e.canonical + '">' + $nl }
    if ($e.noindex -and $text -notmatch '(?i)<meta[^>]+name\s*=\s*["'']robots["'']') { $headAdd += '<meta name="robots" content="noindex">' + $nl }
    if ($headAdd) {
      $h = $text.IndexOf('</head>', [System.StringComparison]::OrdinalIgnoreCase)
      if ($h -ge 0) { $text = $text.Insert($h, $headAdd) }
    }
    [System.IO.File]::WriteAllText($file, $text, (New-Object System.Text.UTF8Encoding($bom)))
    if ($wasThere) { $updated++; Write-Host ('  ○ ' + $e.path + ' : 説明を新しくしました') -ForegroundColor Green }
    else { $added++; Write-Host ('  ○ ' + $e.path + ' : 説明を追加しました') -ForegroundColor Green }
  } catch { Write-Host ('  × ' + $e.path + ' : ' + $_.Exception.Message) -ForegroundColor Red; $errors++ }
}
Write-Host ''
Write-Host ('おわり！  追加: ' + $added + ' こ ／ 新しくした: ' + $updated + ' こ ／ ファイルなし: ' + $missing + ' こ ／ できなかった: ' + $errors + ' こ') -ForegroundColor Cyan
Write-Host 'このあと、いつも通り GitHub にアップロードしてください。'
Read-Host 'Enterキーで終了'
