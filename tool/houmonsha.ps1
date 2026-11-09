# 訪問者数を書きかえるツール（むん先生の学習クエスト）
# Cloudflare Web Analytics などで見た「これまでの訪問者数」を入力すると、
# トップページ（index.html）のいちばん上の表示が書きかわります。ネットにはつなぎません。
param([string]$Num = '', [switch]$Yes)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$idx = Join-Path $root 'index.html'
$utf8 = New-Object System.Text.UTF8Encoding($false)
function Done([int]$c) { if (-not $Yes) { Read-Host 'Enterキーで終了' | Out-Null }; exit $c }
Write-Host ''
Write-Host '=== 訪問者数の書きかえ ===' -ForegroundColor Cyan
if (-not (Test-Path -LiteralPath $idx)) { Write-Host 'index.html と同じ場所に置いて実行してください。' -ForegroundColor Red; Done 1 }
$text = [System.IO.File]::ReadAllText($idx, $utf8)
$m = [regex]::Match($text, 'data-visitors="(\d*)" data-vdate="([^"]*)"')
if (-not $m.Success) { Write-Host '訪問者数を書く場所が見つかりませんでした。' -ForegroundColor Red; Done 1 }
Write-Host ('いまの表示：' + $m.Groups[1].Value + ' 人（' + $m.Groups[2].Value + '）')
Write-Host '0 にすると、表示が消えます。' -ForegroundColor DarkGray
$n = $Num; if ($n -eq '') { $n = Read-Host 'これまでの訪問者数（数字だけ。カンマはあってもOK）' }
$n = ($n -replace '[,，、\s人]', '')
$n = $n.Normalize([System.Text.NormalizationForm]::FormKC)
if ($n -notmatch '^\d{1,9}$') { Write-Host '数字で入力してください。' -ForegroundColor Red; Done 1 }
$n = [string][int64]$n
$d = Get-Date -Format 'yyyy-MM-dd'
$text = $text.Remove($m.Index, $m.Length).Insert($m.Index, 'data-visitors="' + $n + '" data-vdate="' + $d + '"')
[System.IO.File]::WriteAllText($idx, $text, $utf8)
Write-Host ('○ ' + $n + ' 人（' + $d + ' 時点）にしました。index.html をアップロードしてください。') -ForegroundColor Green
Done 0
