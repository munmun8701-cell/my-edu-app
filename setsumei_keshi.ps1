# アプリ説明の「ぜんぶ取りのぞく」ツール（むん先生の学習クエスト）
# 各アプリのページに入っている「このアプリについて」の説明ブロック（mq-about）を、すべて消して、元のページにもどします。
# ・このツールと同じフォルダ（トップページの index.html がある場所）から、下のフォルダぜんぶをさがします
# ・消すのは「mq-about:start 〜 mq-about:end」のあいだだけ。ほかは変えません（文字コードと改行もそのまま）
# ・何回実行しても大丈夫です
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$utf8 = New-Object System.Text.UTF8Encoding($false, $true)
Write-Host ''
Write-Host '=== アプリ説明を取りのぞくツール ===' -ForegroundColor Cyan
Write-Host ('さがす場所: ' + $root)
$rx = New-Object System.Text.RegularExpressions.Regex('(?s)(<style>@media print\{#mq-about\{display:none!important\}\}</style>\r?\n?)?<!-- mq-about:start.*?<!-- mq-about:end -->\r?\n?')
$n = 0; $seen = 0
Get-ChildItem -LiteralPath $root -Recurse -File -Include *.html | ForEach-Object {
  try {
    $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
    $text = $utf8.GetString($bytes)
    if ($text.IndexOf('mq-about:start') -lt 0) { return }
    $seen++
    $bom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
    if ($text.Length -gt 0 -and $text[0] -eq [char]0xFEFF) { $text = $text.Substring(1) }
    $new = $rx.Replace($text, '')
    [System.IO.File]::WriteAllText($_.FullName, $new, (New-Object System.Text.UTF8Encoding($bom)))
    $n++
    Write-Host ('  ○ ' + $_.FullName.Substring($root.Length).TrimStart('\','/') + ' : 取りのぞきました') -ForegroundColor Green
  } catch { Write-Host ('  × ' + $_.FullName + ' : ' + $_.Exception.Message) -ForegroundColor Red }
}
Write-Host ''
Write-Host ('おわり！  取りのぞいたページ: ' + $n + ' こ') -ForegroundColor Cyan
Write-Host 'このあと、いつも通り GitHub にアップロードしてください。'
Read-Host 'Enterキーで終了'
