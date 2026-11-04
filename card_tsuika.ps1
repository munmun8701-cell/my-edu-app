# カード追加ツール（むん先生の学習クエスト）
# 質問にこたえるだけで、トップページ（index.html）に新しいアプリのカードを追加します。
#   ・index.html を書きかえる前に、_backup フォルダに今の index.html をコピーしておきます
#   ・sitemap.xml（検索エンジン用）と koushin.html（更新履歴）にも、自動で1行足します
#   ・ネットにはつなぎません
param([string]$Cat = '', [string]$Folder = '', [string]$Title = '', [string]$Yomi = '', [string]$Desc = '',
      [string]$Unit = '', [string]$Icon = '', [switch]$Yes)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$idx = Join-Path $root 'index.html'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$auto = $Yes.IsPresent

function Esc([string]$t) { return $t.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;').Replace('"', '&quot;') }
function Ask([string]$q, [string]$given) { if ($given -ne '') { return $given }; if ($auto) { return '' }; return (Read-Host $q).Trim() }
function Done([int]$code) { if (-not $auto) { Read-Host 'Enterキーで終了' | Out-Null }; exit $code }

Write-Host ''
Write-Host '=== カード追加ツール ===' -ForegroundColor Cyan
if (-not (Test-Path -LiteralPath $idx)) {
  Write-Host 'このツールは、トップページの index.html と同じ場所に置いて実行してください。' -ForegroundColor Red; Done 1
}

do {
  $text = [System.IO.File]::ReadAllText($idx, $utf8)
  $nl = "`n"; if ($text.Contains("`r`n")) { $nl = "`r`n" }
  $plain = [regex]::Replace($text, '(?s)<!--.*?-->', { param($m) ' ' * $m.Value.Length })   # コメントは同じ長さの空白に（場所がずれないように）

  # ---- 1. カテゴリをえらぶ
  $secs = @([regex]::Matches($plain, '<section class="cat" id="([^"]+)" data-cat="([^"]+)" data-label="([^"]+)"'))
  if ($secs.Count -eq 0) { Write-Host 'カテゴリが見つかりませんでした。' -ForegroundColor Red; Done 1 }
  Write-Host ''
  Write-Host 'どのカテゴリに入れますか？' -ForegroundColor Yellow
  for ($i = 0; $i -lt $secs.Count; $i++) { Write-Host ('  ' + ($i + 1) + ' : ' + $secs[$i].Groups[3].Value) }
  $n = 0; [int]::TryParse((Ask '番号を入力' $Cat), [ref]$n) | Out-Null
  if ($n -lt 1 -or $n -gt $secs.Count) { Write-Host '番号がちがいます。' -ForegroundColor Red; Done 1 }
  $sec = $secs[$n - 1]; $label = $sec.Groups[3].Value
  $secStart = $sec.Index
  $secEnd = $plain.IndexOf('</section>', $secStart)

  # ---- 2. フォルダ
  Write-Host ''
  Write-Host 'アプリのフォルダの場所を入力してください（index.html がある、いちばん上の階層から）' -ForegroundColor Yellow
  Write-Host '  例： syakai/rekishi/10taisyou' -ForegroundColor DarkGray
  $f = (Ask 'フォルダ' $Folder).Replace('\', '/').Trim().TrimStart('.').TrimStart('/')
  if ($f -eq '') { Write-Host 'フォルダが空です。' -ForegroundColor Red; Done 1 }
  if ($f -notmatch '\.html?$') { $f = $f.TrimEnd('/') + '/index.html' }
  if ($f -match '[^\w\-./]') { Write-Host 'フォルダ名には、半角の英数字・ - ・ _ ・ / だけを使ってください。' -ForegroundColor Red; Done 1 }
  $href = './' + $f
  if (-not (Test-Path -LiteralPath (Join-Path $root $f))) {
    Write-Host ('※ ' + $f + ' が見つかりません（まだアップロードしていないフォルダなら、そのままでOK）') -ForegroundColor Yellow
    if (-not $auto) { if ((Read-Host 'このまま進めますか？ (y/n)') -ne 'y') { Done 0 } }
  }
  $sameCat = $plain.Substring($secStart, $secEnd - $secStart).Contains('href="' + $href + '"')
  if ($sameCat) { Write-Host 'このカテゴリには、もう同じアプリのカードがあります。' -ForegroundColor Red; Done 1 }
  if ($plain.Contains('href="' + $href + '"')) {
    Write-Host '※ ほかのカテゴリに同じアプリのカードがあります（2か所に出したいときは、そのままでOK）' -ForegroundColor Yellow
    if (-not $auto) { if ((Read-Host 'このまま進めますか？ (y/n)') -ne 'y') { Done 0 } }
  }

  # ---- 3. 名前・説明など
  Write-Host ''
  $t = Ask 'アプリの名前（例：大正時代）' $Title
  if ($t -eq '') { Write-Host '名前が空です。' -ForegroundColor Red; Done 1 }
  $y = Ask 'よみがな（ひらがな。ひらがな検索で使います。なくてもOK）' $Yomi
  $d = Ask '説明（1行。例：大正デモクラシーと人々のくらしを学ぼう！）' $Desc
  $u = Ask '単元名（例：6年 社会・歴史「大正時代」。なくてもOK）' $Unit
  $secHtml = $plain.Substring($secStart, $secEnd - $secStart)
  $defIcon = 'fa-star'; $mi = [regex]::Match($secHtml, 'class="ci"><i class="fa-solid (fa-[a-z0-9-]+)"'); if ($mi.Success) { $defIcon = $mi.Groups[1].Value }
  $ic = Ask ('アイコン（fontawesome の fa-○○。なくてもOK → ' + $defIcon + '）') $Icon
  if ($ic -eq '') { $ic = $defIcon }
  if (-not $ic.StartsWith('fa-')) { $ic = 'fa-' + $ic }
  if ($ic -notmatch '^fa-[a-z0-9-]+$') { $ic = $defIcon }

  # ---- 4. data-id をきめる（そのカテゴリでいちばん多い形 ＋ 1）
  $ids = [regex]::Matches($secHtml, 'data-id="(app-[a-z0-9]+)-(\d+)"')
  $pref = @{}; foreach ($m in $ids) { $k = $m.Groups[1].Value; if ($pref.ContainsKey($k)) { $pref[$k]++ } else { $pref[$k] = 1 } }
  $prefix = 'app-' + $sec.Groups[2].Value
  if ($pref.Count -gt 0) { $prefix = ($pref.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 1).Key }
  $max = 0
  foreach ($m in [regex]::Matches($plain, 'data-id="' + [regex]::Escape($prefix) + '-(\d+)"')) { $v = [int]$m.Groups[1].Value; if ($v -gt $max) { $max = $v } }
  $id = $prefix + '-' + ($max + 1)
  $today = Get-Date -Format 'yyyy-MM-dd'

  # ---- 5. カードの HTML
  $ind = '              '
  $attr = ' data-badge="new" data-added="' + $today + '"'
  if ($u -ne '') { $attr += ' data-unit="' + (Esc $u) + '"' }
  if ($y -ne '') { $attr += ' data-yomi="' + (Esc ($y -replace '\s', '')) + '"' }
  $unitHtml = ''; if ($u -ne '') { $unitHtml = '<span class="app-unit"><i class="fa-solid fa-book-bookmark"></i>' + (Esc $u) + '</span>' }
  $card = $ind + '<!-- ★ ' + $today + ' カード追加ツールで追加 -->' + $nl +
          $ind + '<article class="app" data-id="' + $id + '"' + $attr + '>' + $nl +
          $ind + '  <a class="app-link" href="' + $href + '"><span class="app-icon"><i class="fa-solid ' + $ic + '"></i></span>' + $nl +
          $ind + '    <span class="app-text"><strong class="app-title">' + (Esc $t) + '</strong><span class="app-desc">' + (Esc $d) + '</span>' + $unitHtml + '</span></a>' + $nl +
          $ind + '  <button class="fav" type="button" aria-label="お気に入り"><i class="fa-solid fa-star"></i></button>' + $nl +
          $ind + '</article>' + $nl

  # ---- 6. 入れる場所（そのカテゴリの <div class="tiles"> の閉じタグの前。コメントの中は数えない）
  $ti = $plain.IndexOf('<div class="tiles">', $secStart)
  if ($ti -lt 0 -or $ti -gt $secEnd) { Write-Host 'カードを入れる場所（tiles）が見つかりませんでした。' -ForegroundColor Red; Done 1 }
  $depth = 0; $pos = -1
  foreach ($m in [regex]::Matches($plain.Substring($ti, $secEnd - $ti), '<div\b|</div>')) {
    if ($m.Value -eq '</div>') { $depth-- } else { $depth++ }
    if ($depth -eq 0) { $pos = $ti + $m.Index; break }
  }
  if ($pos -lt 0) { Write-Host 'カードを入れる場所が見つかりませんでした。' -ForegroundColor Red; Done 1 }
  $ls = $text.LastIndexOf("`n", $pos) + 1   # 閉じタグの行のはじめ

  Write-Host ''
  Write-Host '---- これで追加します ----' -ForegroundColor Cyan
  Write-Host ('カテゴリ：' + $label + ' ／ ID：' + $id)
  Write-Host ('名前：' + $t + ' ／ 説明：' + $d)
  Write-Host ('リンク：' + $href + ' ／ 単元：' + $u + ' ／ アイコン：' + $ic)
  if (-not $auto) { if ((Read-Host 'よろしいですか？ (y/n)') -ne 'y') { Write-Host '追加しませんでした。'; Done 0 } }

  # ---- 7. バックアップ → 書きこみ
  $bk = Join-Path $root '_backup'
  if (-not (Test-Path -LiteralPath $bk)) { New-Item -ItemType Directory -Path $bk | Out-Null }
  Copy-Item -LiteralPath $idx -Destination (Join-Path $bk ('index_' + (Get-Date -Format 'yyyyMMdd_HHmmss') + '.html'))
  $text = $text.Insert($ls, $card.Replace("`n", $nl).Replace("`r`r", "`r"))
  [System.IO.File]::WriteAllText($idx, $text, $utf8)
  Write-Host ('○ index.html に「' + $t + '」のカードを追加しました') -ForegroundColor Green

  # sitemap.xml
  $sm = Join-Path $root 'sitemap.xml'
  if (Test-Path -LiteralPath $sm) {
    $st = [System.IO.File]::ReadAllText($sm, $utf8)
    $loc = 'https://www.munmungstudymax.com/' + $f
    if (-not $st.Contains('<loc>' + $loc + '</loc>')) {
      $st = $st.Replace('</urlset>', '  <url><loc>' + $loc + '</loc><lastmod>' + $today + '</lastmod><priority>0.6</priority></url>' + "`n" + '</urlset>')
      [System.IO.File]::WriteAllText($sm, $st, $utf8)
      Write-Host '○ sitemap.xml に追加しました' -ForegroundColor Green
    }
  }
  # koushin.html（更新履歴）
  $kh = Join-Path $root 'koushin.html'
  if (Test-Path -LiteralPath $kh) {
    $kt = [System.IO.File]::ReadAllText($kh, $utf8)
    $mk = [regex]::Match($kt, '<!-- koushin:start[^>]*-->')
    if ($mk.Success) {
      $dt = Get-Date
      $li = "`n" + '        <li class="ki" data-date="' + $today + '"><time>' + $dt.Year + '年' + $dt.Month + '月' + $dt.Day + '日</time><div><b>新しいアプリ「' + (Esc $t) + '」</b><p>' + (Esc $label) + ' ／ ' + (Esc $d) + ' <a href="' + $href + '">ひらく</a></p></div></li>'
      $kt = $kt.Insert($mk.Index + $mk.Length, $li)
      [System.IO.File]::WriteAllText($kh, $kt, $utf8)
      Write-Host '○ 更新履歴（koushin.html）に追加しました' -ForegroundColor Green
    }
  }
  Write-Host ''
  Write-Host '※ _backup フォルダは、書きかえる前の index.html です。サイトに上げる必要はありません。' -ForegroundColor DarkGray

  $again = 'n'
  if (-not $auto) { $again = Read-Host '続けて、もう1つ追加しますか？ (y/n)' }
  $Cat = ''; $Folder = ''; $Title = ''; $Yomi = ''; $Desc = ''; $Unit = ''; $Icon = ''
} while ($again -eq 'y')

Write-Host ''
Write-Host 'おわり！ このあと、index.html・sitemap.xml・koushin.html を GitHub にアップロードしてください。' -ForegroundColor Cyan
Done 0
