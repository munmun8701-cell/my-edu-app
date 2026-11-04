# もどるボタン一括追加ツール（むん先生の学習クエスト）
# 1・3〜6年算数と歴史カードクエストの各単元フォルダ、国語・社会・学習ゲーム・1年生・支援学級のアプリの index.html に、次の1行を </body> の直前に入れます。
#   <script src="/mun-link.js"></script>
# ・すでに入っているファイルは、そのままにします（何回実行しても大丈夫）
# ・文字コード（UTF-8）や改行はそのまま。1行を足すだけで、ほかは変えません
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$folders = @('1nennseisannsuu', '3nennseisannsuu', '4nennseisannsuu', '5nenseisannsuu', '6nennseisannsuu', 'syakai/rekishi')
$tag = '<script src="/mun-link.js"></script>'
# 国語・社会・学習ゲーム・1年生・支援学級のアプリ（学習時間を数えるため。2026.11 追加）
$files = @(
  'kokugo/kannzinoboukenn/dist/index.html',
  'kokugo/kannziteigakunenn/index.html',
  'kokugo/kannzityugakunenn/index.html',
  'kokugo/kannzikougakunen/index.html',
  'kokugo/kotodamakuronikuru1/index.html',
  'kokugo/kotodamakuronikuru2/index.html',
  'kokugo/kotodamakuronikuru3/index.html',
  'tanosikugakusyuusiyou/kotodamakuronikuru4/index.html',
  'tanosikugakusyuusiyou/kotodamakuronikuru5/index.html',
  'tanosikugakusyuusiyou/kotodamakuronikuru6/index.html',
  'kokugo/syuzaisitakotowohoukokubunnni/index.html',
  'syakai/noukatokouzyou/index.html',
  'kurasuyou/tizukigou/index.html',
  'syakai/kurasiwomamoru/index.html',
  'syakai/nagareyamashinouturikawari/index.html',
  'tanosikugakusyuusiyou/sannsuukuesuto/dist/index.html',
  'tanosikugakusyuusiyou/sannsuusaiba/index.html',
  'tanosikugakusyuusiyou/sannsuu3nennzyoumatme/index.html',
  'tanosikugakusyuusiyou/3nennseisannsuuge/index.html',
  'tanosikugakusyuusiyou/math81/index.html',
  'tanosikugakusyuusiyou/munmuntaipinngu/kotobanotennkuuzyou/index.html',
  'tanosikugakusyuusiyou/kotobanotennkuuzyou/index.html',
  'tanosikugakusyuusiyou/englishnomati/index.html',
  'tanosikugakusyuusiyou/oserotyesusyougi/index.html',
  'tanosikugakusyuusiyou/mozimon/index.html',
  'tanosikugakusyuusiyou/saiba-taipingu/index.html',
  'tanosikugakusyuusiyou/todoufukennkuesuto/index.html',
  'tanosikugakusyuusiyou/kotodamakuronikuru1/index.html',
  'tanosikugakusyuusiyou/kotodamakuronikuru2/index.html',
  'tanosikugakusyuusiyou/kotodamakuronikuru3/index.html',
  '1nennseiyougakusyuugame/tashizanhikizanhiragana/index.html',
  'sienngaxtukyuu/poxtupuko-nnwokaou/index.html'
)
$strict = New-Object System.Text.UTF8Encoding($false, $true)
$added = 0; $skipped = 0; $errors = 0

Write-Host ''
Write-Host '=== もどるボタン一括追加ツール ===' -ForegroundColor Cyan
Write-Host ('作業する場所: ' + $root)
if (-not (Test-Path (Join-Path $root 'index.html'))) {
  Write-Host 'このツールは、トップページの index.html と同じ場所に置いて実行してください。' -ForegroundColor Red
  Read-Host 'Enterキーで終了'; exit 1
}
function Add-Tag([string]$file, [string]$name) {
  if (-not (Test-Path -LiteralPath $file)) { Write-Host ('  - ' + $name + ' : index.html がありません') -ForegroundColor DarkGray; return }
  try {
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $bom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
    try { $text = $strict.GetString($bytes) } catch { Write-Host ('  × ' + $name + ' : 文字コードが UTF-8 ではないので、さわりませんでした') -ForegroundColor Red; $script:errors++; return }
    if ($text.Length -gt 0 -and $text[0] -eq [char]0xFEFF) { $text = $text.Substring(1) }
    if ($text -match 'mun-link\.js') { Write-Host ('  ・' + $name + ' : もう入っています') -ForegroundColor DarkGray; $script:skipped++; return }
    $nl = "`n"; if ($text.Contains("`r`n")) { $nl = "`r`n" }
    $i = $text.LastIndexOf('</body>', [System.StringComparison]::OrdinalIgnoreCase)
    if ($i -ge 0) { $text = $text.Insert($i, $tag + $nl) } else { $text = $text + $nl + $tag + $nl }
    [System.IO.File]::WriteAllText($file, $text, (New-Object System.Text.UTF8Encoding($bom)))
    Write-Host ('  ○ ' + $name + ' : 追加しました') -ForegroundColor Green; $script:added++
  } catch { Write-Host ('  × ' + $name + ' : ' + $_.Exception.Message) -ForegroundColor Red; $script:errors++ }
}
foreach ($f in $folders) {
  $dir = Join-Path $root $f
  if (-not (Test-Path $dir)) { Write-Host ('（' + $f + ' フォルダがないので、とばします）') -ForegroundColor DarkGray; continue }
  Write-Host ''
  Write-Host ('[' + $f + ']') -ForegroundColor Yellow
  foreach ($unit in (Get-ChildItem -LiteralPath $dir -Directory | Sort-Object Name)) { Add-Tag (Join-Path $unit.FullName 'index.html') $unit.Name }
}
Write-Host ''
Write-Host '[国語・社会・学習ゲーム・1年生・支援学級]' -ForegroundColor Yellow
foreach ($p in $files) { Add-Tag (Join-Path $root $p) $p }
Write-Host ''
Write-Host ('おわり！  追加: ' + $added + ' こ ／ もう入っていた: ' + $skipped + ' こ ／ できなかった: ' + $errors + ' こ') -ForegroundColor Cyan
Write-Host 'このあと、いつも通り GitHub にアップロードしてください。'
Read-Host 'Enterキーで終了'
