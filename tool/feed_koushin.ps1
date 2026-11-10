# koushin.html のお知らせから、更新情報のフィード feed.xml を作りなおします（サイトのフォルダに置いて実行）
# 使い方：feed_koushin.bat をダブルクリック。新しいお知らせを足したあとに実行してください。
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$site = 'https://www.munmungstudymax.com'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$src = Join-Path $root 'koushin.html'

Write-Host ''
Write-Host '=== 更新情報フィード(feed.xml)をつくる ===' -ForegroundColor Cyan
if (-not (Test-Path -LiteralPath $src)) {
  Write-Host 'koushin.html が見つかりません。サイトのフォルダに置いて実行してください。' -ForegroundColor Red
  Read-Host 'Enterキーで終了'; exit 1
}
$html = [System.IO.File]::ReadAllText($src, $utf8)

function Esc([string]$t) {
  return $t.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;').Replace('"', '&quot;')
}
function Plain([string]$t) {
  $t = [regex]::Replace($t, '<[^>]+>', ' ')
  $t = [System.Net.WebUtility]::HtmlDecode($t)
  return ([regex]::Replace($t, '\s+', ' ')).Trim()
}

$items = [regex]::Matches($html, '<li class="ki" data-date="(\d{4}-\d{2}-\d{2})">(.*?)</div></li>', 'Singleline')
if ($items.Count -eq 0) {
  Write-Host 'お知らせが見つかりませんでした。feed.xml は変更していません。' -ForegroundColor Red
  Read-Host 'Enterキーで終了'; exit 1
}
$ents = New-Object System.Text.StringBuilder
$n = 0; $perDay = @{}
foreach ($m in $items) {
  if ($n -ge 30) { break }
  $date = $m.Groups[1].Value
  $body = $m.Groups[2].Value
  $tm = [regex]::Match($body, '<b>(.*?)</b>', 'Singleline')
  if (-not $tm.Success) { continue }
  $title = Plain $tm.Groups[1].Value
  $summary = Plain ($body -replace '<time>.*?</time>', '')
  if ($summary.Length -gt 300) { $summary = $summary.Substring(0, 300) + '...' }
  if (-not $perDay.ContainsKey($date)) { $perDay[$date] = 0 }
  $perDay[$date]++
  $n++
  [void]$ents.AppendLine('  <entry>')
  [void]$ents.AppendLine('    <id>tag:munmungstudymax.com,' + $date + ':' + $perDay[$date] + '</id>')
  [void]$ents.AppendLine('    <title>' + (Esc $title) + '</title>')
  [void]$ents.AppendLine('    <link href="' + $site + '/koushin.html"/>')
  [void]$ents.AppendLine('    <updated>' + $date + 'T09:00:00+09:00</updated>')
  [void]$ents.AppendLine('    <summary>' + (Esc $summary) + '</summary>')
  [void]$ents.AppendLine('  </entry>')
}
$latest = $items[0].Groups[1].Value
$out = New-Object System.Text.StringBuilder
[void]$out.AppendLine('<?xml version="1.0" encoding="UTF-8"?>')
[void]$out.AppendLine('<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="ja">')
[void]$out.AppendLine('  <title>むん先生の学習クエスト 更新情報</title>')
[void]$out.AppendLine('  <subtitle>新しいアプリや機能のお知らせ</subtitle>')
[void]$out.AppendLine('  <link href="' + $site + '/koushin.html"/>')
[void]$out.AppendLine('  <link rel="self" type="application/atom+xml" href="' + $site + '/feed.xml"/>')
[void]$out.AppendLine('  <id>' + $site + '/</id>')
[void]$out.AppendLine('  <updated>' + $latest + 'T09:00:00+09:00</updated>')
[void]$out.AppendLine('  <author><name>むん先生</name></author>')
[void]$out.Append($ents.ToString())
[void]$out.AppendLine('</feed>')
$dest = Join-Path $root 'feed.xml'
[System.IO.File]::WriteAllText($dest, $out.ToString(), $utf8)

Write-Host ''
Write-Host ('feed.xml を作りました（お知らせ ' + $n + ' 件）: ' + $dest) -ForegroundColor Green
Write-Host ''
Read-Host 'Enterキーで終了'
