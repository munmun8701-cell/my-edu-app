# サイトマップの「更新日」を、実際のファイルの更新日に合わせます（サイトのフォルダに置いて実行）
# 使い方：sitemap_lastmod.bat をダブルクリック。sitemap.xml は sitemap.xml.bak に控えをとってから書きかえます。
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$site = 'https://www.munmungstudymax.com/'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$map = Join-Path $root 'sitemap.xml'

Write-Host ''
Write-Host '=== サイトマップの更新日をそろえる ===' -ForegroundColor Cyan
Write-Host ('見るフォルダ: ' + $root)
if (-not (Test-Path -LiteralPath $map)) {
  Write-Host 'sitemap.xml が見つかりません。サイトのフォルダに置いて実行してください。' -ForegroundColor Red
  Read-Host 'Enterキーで終了'; exit 1
}
Copy-Item -LiteralPath $map -Destination ($map + '.bak') -Force
$xml = [System.IO.File]::ReadAllText($map, $utf8)

$changed = 0; $missing = 0
$rx = New-Object System.Text.RegularExpressions.Regex('<url>.*?</url>', 'Singleline')
$new = $rx.Replace($xml, {
  param($m)
  $blk = $m.Value
  $lm = [regex]::Match($blk, '<loc>([^<]+)</loc>')
  if (-not $lm.Success) { return $blk }
  $loc = $lm.Groups[1].Value
  $rel = $loc
  if ($rel.StartsWith($site)) { $rel = $rel.Substring($site.Length) }
  if ($rel -eq '' -or $rel.EndsWith('/')) { $rel = $rel + 'index.html' }
  $rel = $rel.Replace('/', [string][System.IO.Path]::DirectorySeparatorChar)
  $file = Join-Path $root $rel
  if (-not (Test-Path -LiteralPath $file)) { $script:missing++; return $blk }
  $d = (Get-Item -LiteralPath $file).LastWriteTime.ToString('yyyy-MM-dd')
  if ($blk -match '<lastmod>[^<]*</lastmod>') {
    $out = [regex]::Replace($blk, '<lastmod>[^<]*</lastmod>', ('<lastmod>' + $d + '</lastmod>'))
  } else {
    $out = $blk.Replace($lm.Value, $lm.Value + '<lastmod>' + $d + '</lastmod>')
  }
  if ($out -ne $blk) { $script:changed++ }
  return $out
})
[System.IO.File]::WriteAllText($map, $new, $utf8)

Write-Host ''
Write-Host ('更新日を書きかえたページ: ' + $changed + ' 件') -ForegroundColor Green
if ($missing -gt 0) { Write-Host ('ファイルが見つからなかったページ: ' + $missing + ' 件（そのままにしました）') -ForegroundColor Yellow }
Write-Host '元のファイルは sitemap.xml.bak に残してあります。'
Write-Host ''
Read-Host 'Enterキーで終了'
