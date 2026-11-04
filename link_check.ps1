# リンクチェックツール（むん先生の学習クエスト）
# トップページ・学習ガイド・各ページのリンク先のファイルが、ちゃんとあるかを調べます。
# ・ネットにはつなぎません。パソコンの中のフォルダだけを調べます
# ・ファイルは何も書きかえません（結果を「リンクチェック結果.txt」に書き出すだけ）
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$site = 'https://www.munmungstudymax.com/'
$utf8 = New-Object System.Text.UTF8Encoding($false)

Write-Host ''
Write-Host '=== リンクチェックツール ===' -ForegroundColor Cyan
Write-Host ('しらべる場所: ' + $root)
if (-not (Test-Path (Join-Path $root 'index.html'))) {
  Write-Host 'このツールは、トップページの index.html と同じ場所に置いて実行してください。' -ForegroundColor Red
  Read-Host 'Enterキーで終了'; exit 1
}

# しらべるページ
$pages = New-Object System.Collections.Generic.List[string]
foreach ($n in @('index.html', 'guide.html', 'about.html', 'privacy.html', 'katei.html', 'koushin.html', 'houkoku.html')) {
  $p = Join-Path $root $n; if (Test-Path -LiteralPath $p) { $pages.Add($p) }
}
foreach ($d in @('guide', 'koinn')) {
  $dir = Join-Path $root $d
  if (Test-Path -LiteralPath $dir) { Get-ChildItem -LiteralPath $dir -Filter *.html -File | ForEach-Object { $pages.Add($_.FullName) } }
}

$bad = New-Object System.Collections.Generic.List[string]
$checked = 0
$seen = @{}
function Test-Target([string]$from, [string]$link) {
  $u = $link.Trim()
  if ($u -eq '' -or $u.StartsWith('#')) { return $null }
  if ($u -match '^(?i)(https?:|mailto:|tel:|javascript:|data:|blob:|//)') {
    if ($u.StartsWith($site)) { $u = '/' + $u.Substring($site.Length) } else { return $null }
  }
  $u = ($u -split '[?#]')[0]
  if ($u -eq '') { return $null }
  try { $u = [System.Uri]::UnescapeDataString($u) } catch {}
  if ($u.StartsWith('/')) { $full = Join-Path $root ($u.TrimStart('/')) }
  else { $full = Join-Path (Split-Path -Parent $from) $u }
  if ($u.EndsWith('/') -or $u -eq '.' -or $u -eq './') { $full = Join-Path $full 'index.html' }
  $full = [System.IO.Path]::GetFullPath($full)
  if (Test-Path -LiteralPath $full) { return $true }
  return $false
}

foreach ($page in $pages) {
  $text = [System.IO.File]::ReadAllText($page, [System.Text.Encoding]::UTF8)
  $text = [regex]::Replace($text, '(?s)<!--.*?-->', '')                     # コメントの中はしらべない
  $text = [regex]::Replace($text, '(?s)<script\b[^>]*>.*?</script>', '<script></script>')  # プログラムの中もしらべない
  $rel = $page.Substring($root.Length).TrimStart('\', '/')
  foreach ($m in [regex]::Matches($text, '(?i)\s(?:href|src)\s*=\s*"([^"]*)"')) {
    $link = $m.Groups[1].Value
    $r = Test-Target $page $link
    if ($r -eq $null) { continue }
    $checked++
    if (-not $r) {
      $key = $rel + ' -> ' + $link
      if (-not $seen.ContainsKey($key)) { $seen[$key] = 1; $bad.Add($key) }
    }
  }
}

# サイトマップ
$sm = Join-Path $root 'sitemap.xml'
if (Test-Path -LiteralPath $sm) {
  $t = [System.IO.File]::ReadAllText($sm, [System.Text.Encoding]::UTF8)
  foreach ($m in [regex]::Matches($t, '<loc>([^<]+)</loc>')) {
    $r = Test-Target (Join-Path $root 'index.html') $m.Groups[1].Value
    if ($r -eq $null) { continue }
    $checked++
    if (-not $r) { $bad.Add('sitemap.xml -> ' + $m.Groups[1].Value) }
  }
}

$out = New-Object System.Collections.Generic.List[string]
$out.Add('リンクチェック結果（' + (Get-Date -Format 'yyyy/MM/dd HH:mm') + '）')
$out.Add('しらべたリンク: ' + $checked + ' こ ／ 見つからないファイル: ' + $bad.Count + ' こ')
$out.Add('')
if ($bad.Count -eq 0) { $out.Add('すべてのリンク先のファイルがありました。') }
else {
  $out.Add('▼ リンク先のファイルが見つかりませんでした（どのページ -> どこへのリンク）')
  foreach ($b in $bad) { $out.Add('  ' + $b) }
  $out.Add('')
  $out.Add('※ フォルダ名のつづりがちがう、ファイルをまだアップロードしていない、などが考えられます。')
}
$report = Join-Path $root 'リンクチェック結果.txt'
[System.IO.File]::WriteAllLines($report, $out, (New-Object System.Text.UTF8Encoding($true)))

Write-Host ''
if ($bad.Count -eq 0) { Write-Host ('OK！ しらべたリンク ' + $checked + ' こ。見つからないファイルはありませんでした。') -ForegroundColor Green }
else {
  Write-Host ('見つからないファイルが ' + $bad.Count + ' こ ありました：') -ForegroundColor Yellow
  foreach ($b in $bad) { Write-Host ('  × ' + $b) -ForegroundColor Red }
}
Write-Host ('結果は「リンクチェック結果.txt」にも書き出しました。（サイトに上げる必要はありません）')
Read-Host 'Enterキーで終了'
