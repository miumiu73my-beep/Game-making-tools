// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: pencil-alt;
(async () => {
  const html = String.raw`
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<title>Pixel Command Painter Pro</title>
<style>
:root{
  --bg:#08111f;
  --panel:#101a2a;
  --panel2:#152236;
  --line:#2d415a;
  --text:#e5edf6;
  --muted:#9fb2c8;
  --accent:#38bdf8;
  --ok:#22c55e;
  --warn:#f43f5e;
  --paste:#a855f7;
  --select:#3b82f6;
  --gold:#f59e0b;
  --radius:14px;
}
*{box-sizing:border-box}
html,body{
  margin:0;padding:0;background:linear-gradient(180deg,#07101d 0%, #0b1728 100%);
  color:var(--text);
  font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Noto Sans JP",sans-serif;
}
body{
  min-height:100vh;
  padding:12px;
  padding-top:calc(18px + env(safe-area-inset-top) + 28px);
  padding-bottom:calc(16px + env(safe-area-inset-bottom));
}
.app{display:grid;gap:12px;max-width:1320px;margin:0 auto}
.panel{
  background:rgba(16,26,42,.97);
  border:1px solid rgba(159,178,200,.14);
  border-radius:var(--radius);
  overflow:hidden;
}
.panel h2{
  margin:0;padding:11px 14px;
  font-size:15px;font-weight:800;
  background:rgba(255,255,255,.03);
  border-bottom:1px solid rgba(159,178,200,.12);
}
.panel-body{padding:12px;display:grid;gap:10px}
.grid-two{display:grid;gap:12px;grid-template-columns:minmax(0,1.45fr) minmax(300px,.95fr)}
.grid-three{display:grid;gap:10px;grid-template-columns:repeat(3,1fr)}
.scroll-x{overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;touch-action:pan-x pinch-zoom;padding-bottom:2px}
.wide-three{grid-template-columns:repeat(3,minmax(300px,1fr));min-width:980px}
.row{display:grid;gap:10px}
.row.two{grid-template-columns:1fr 1fr}
.row.three{grid-template-columns:repeat(3,1fr)}
.row.four{grid-template-columns:repeat(4,1fr)}
.row.five{grid-template-columns:repeat(5,1fr)}
label{display:grid;gap:6px;font-size:12px;color:var(--muted)}
input,select,textarea,button{
  font:inherit;color:var(--text);
  font-size:16px;
  background:#0c1421;border:1px solid #31455f;border-radius:10px;
  padding:10px 12px;min-height:42px;
}
input,textarea,select{-webkit-user-select:text;user-select:text}
input[type="color"]{padding:4px;min-height:42px;width:100%}
input[type="range"]{padding:0;min-height:32px;background:transparent;border:none}
input[type="file"]{padding:8px 10px;min-height:42px}
textarea{
  min-height:120px;resize:vertical;line-height:1.45;
  white-space:pre-wrap;
}
button{
  background:#152540;cursor:pointer;font-weight:700;
  -webkit-tap-highlight-color:transparent;
  -webkit-touch-callout:none;
  -webkit-user-select:none;
  user-select:none;
  touch-action:manipulation;
  transition:transform .08s ease, filter .12s ease, box-shadow .12s ease, border-color .12s ease, background .12s ease;
  box-shadow:0 2px 0 rgba(0,0,0,.24);
}
button:focus{outline:none}
button:active,button.just-pressed{
  transform:translateY(1px) scale(.985);
  filter:brightness(1.08);
  box-shadow:0 1px 0 rgba(0,0,0,.16), inset 0 0 0 999px rgba(255,255,255,.05);
  border-color:rgba(255,255,255,.26);
}
button.primary{background:linear-gradient(180deg,#0ea5e9,#0284c7);border-color:transparent}
button.good{background:linear-gradient(180deg,#16a34a,#15803d);border-color:transparent}
button.warn{background:linear-gradient(180deg,#e11d48,#be123c);border-color:transparent}
button.gold{background:linear-gradient(180deg,#f59e0b,#d97706);border-color:transparent}
button.ghost{background:transparent}
button.active{outline:2px solid rgba(56,189,248,.9);outline-offset:1px}
button:disabled{opacity:.58;cursor:default}
.hint{font-size:12px;line-height:1.5;color:var(--muted)}
.notice-box{
  display:grid;gap:8px;
}
.statusbar{display:flex;flex-wrap:wrap;gap:8px}
.pill{
  display:inline-flex;align-items:center;gap:8px;
  padding:6px 10px;border-radius:999px;font-size:12px;
  background:rgba(148,163,184,.10);border:1px solid rgba(148,163,184,.18);color:#d9e6f3;
}
.notice{background:rgba(56,189,248,.10);border-color:rgba(56,189,248,.25)}
.toolbar{display:flex;flex-wrap:wrap;gap:8px}
.toolbar-split{display:grid;gap:10px;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
.toolbar-group{
  display:flex;flex-wrap:wrap;gap:8px;align-items:center;
  padding:8px;border:1px solid rgba(159,178,200,.12);border-radius:12px;background:rgba(255,255,255,.025)
}
.toolbar-group.left{justify-content:flex-start}
.toolbar-group.right{justify-content:flex-end}
.group-label{font-size:11px;font-weight:800;letter-spacing:.04em;color:var(--muted);padding:4px 2px;min-width:100%}
.examples.hidden{display:none}
.canvas-shell{
  border:1px solid rgba(159,178,200,.14);
  border-radius:12px;
  overflow:auto;
  -webkit-overflow-scrolling:touch;
  overscroll-behavior:contain;
  touch-action:pan-x pan-y;
  background:radial-gradient(circle at top, rgba(56,189,248,.08), transparent 30%), #0b1422;
  min-height:320px;
  max-height:60vh;
  padding:10px;
}
#gridCanvas{
  display:block;touch-action:none;border:1px solid #31455f;border-radius:8px;
  background:
    linear-gradient(45deg, rgba(255,255,255,.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.05) 75%),
    linear-gradient(45deg, rgba(255,255,255,.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.05) 75%);
  background-size:20px 20px;background-position:0 0,10px 10px;
}
.canvas-shell.theme-dark{background:radial-gradient(circle at top, rgba(56,189,248,.08), transparent 30%), #0b1422}
.canvas-shell.theme-light{background:radial-gradient(circle at top, rgba(56,189,248,.06), transparent 28%), #eef4fb}
#gridCanvas.theme-dark{
  background-color:#0b1422;
  background-image:
    linear-gradient(45deg, rgba(255,255,255,.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.05) 75%),
    linear-gradient(45deg, rgba(255,255,255,.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.05) 75%);
}
#gridCanvas.theme-light{
  border-color:#b8c7d9;
  background-color:#ffffff;
  background-image:
    linear-gradient(45deg, rgba(15,23,42,.05) 25%, transparent 25%, transparent 75%, rgba(15,23,42,.05) 75%),
    linear-gradient(45deg, rgba(15,23,42,.05) 25%, transparent 25%, transparent 75%, rgba(15,23,42,.05) 75%);
}
.mode-bar{display:flex;flex-wrap:wrap;gap:8px}
.footer-note{font-size:11px;line-height:1.5;color:var(--muted)}
.examples,.codebox,.logbox,.jsonbox,.resbox{
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  font-size:12px;line-height:1.5;padding:10px;border-radius:10px;background:#0c1421;border:1px solid #24364c;color:#d5e2ef;white-space:pre-wrap;
}
.code-editor{position:relative;border:1px solid #24364c;border-radius:10px;background:#0c1421;overflow:hidden;min-height:140px}
.code-editor textarea,.code-editor pre{
  margin:0;width:100%;min-height:140px;padding:10px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  font-size:12px;line-height:1.5;white-space:pre-wrap;word-break:break-word;tab-size:2
}
.code-editor textarea{
  position:relative;z-index:2;background:transparent;border:none;border-radius:0;color:#d5e2ef;resize:vertical;
  contain:layout style paint;
}
.code-editor textarea:focus{outline:none}
.code-editor pre{position:absolute;inset:0;z-index:1;pointer-events:none;color:transparent;overflow:hidden}
.code-editor.plain-mode pre{display:none}
.code-editor.plain-mode textarea{background:#0c1421;color:#d5e2ef}
.command-line{display:block;min-height:1.5em;border-radius:6px}
.command-line.error{background:rgba(244,63,94,.20);box-shadow:inset 3px 0 0 rgba(244,63,94,.92)}
.command-line.error.blank{background:rgba(244,63,94,.16)}
.mini-grid{display:grid;gap:10px;grid-template-columns:1fr 1fr}
.layer-list,.asset-list,.resource-list,.template-list{
  display:grid;gap:8px;max-height:280px;overflow:auto;padding-right:2px;padding-bottom:8px;min-height:0;
  -webkit-overflow-scrolling:touch;overscroll-behavior-y:contain;touch-action:pan-y;scrollbar-gutter:stable both-edges
}
.layer-item,.asset-item,.resource-item,.template-item{
  border:1px solid rgba(159,178,200,.12);border-radius:12px;background:rgba(255,255,255,.025);padding:10px;display:grid;gap:8px
}
.layer-head,.asset-head,.resource-head,.template-head{display:flex;justify-content:space-between;align-items:center;gap:8px}
.layer-title,.asset-title,.resource-title,.template-title{font-size:13px;font-weight:800}
.layer-sub,.asset-sub,.resource-sub,.template-sub{font-size:11px;color:var(--muted);line-height:1.45}
.inline-tools{display:flex;flex-wrap:wrap;gap:6px}
.inline-tools button{min-height:34px;padding:8px 10px;font-size:13px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{
  display:inline-flex;align-items:center;gap:6px;padding:5px 8px;border-radius:999px;
  font-size:11px;background:rgba(148,163,184,.10);border:1px solid rgba(148,163,184,.18)
}
.palette-grid{display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(96px,1fr))}
.palette-chip{
  display:flex;align-items:center;gap:8px;border:1px solid rgba(159,178,200,.14);border-radius:12px;
  background:rgba(255,255,255,.03);padding:8px 10px;min-height:42px;cursor:pointer
}
.palette-chip.active{outline:2px solid rgba(56,189,248,.9);outline-offset:1px}
.swatch{width:22px;height:22px;border-radius:6px;border:1px solid rgba(255,255,255,.22);flex:0 0 auto}
.logbox{min-height:110px;max-height:220px;overflow:auto}
.badge{font-size:11px;padding:4px 7px;border-radius:999px;border:1px solid rgba(159,178,200,.18);background:rgba(255,255,255,.05)}
.badge.ok{color:#bbf7d0;border-color:rgba(34,197,94,.22);background:rgba(34,197,94,.08)}
.badge.warn{color:#fecaca;border-color:rgba(244,63,94,.22);background:rgba(244,63,94,.08)}
.badge.lock{color:#fde68a;border-color:rgba(245,158,11,.22);background:rgba(245,158,11,.08)}
.split-compact{display:grid;gap:10px;grid-template-columns:1fr auto}
.small{font-size:12px}
.hidden{display:none!important}
@media (max-width:980px){
  .grid-two,.toolbar-split,.mini-grid,.row.two,.row.three,.row.four,.row.five{grid-template-columns:1fr}
  .toolbar-group.right{justify-content:flex-start}
  .canvas-shell{max-height:54vh;min-height:260px}
}
</style>
</head>
<body>
<div class="app">
  <section class="panel">
    <h2>1. キャンバスと保存名</h2>
    <div class="panel-body">
      <div class="row five">
        <label>横マス数 (Cols)
          <input id="colsInput" type="number" min="1" max="1024" value="32">
        </label>
        <label>縦マス数 (Rows)
          <input id="rowsInput" type="number" min="1" max="1024" value="32">
        </label>
        <label>表示サイズ(px)
          <input id="cellSizeInput" type="number" min="2" max="60" value="18">
        </label>
        <label>書き出し倍率(px/1マス)
          <input id="exportScaleInput" type="number" min="1" max="200" value="16">
        </label>
        <label>キャンバス表示色
          <select id="canvasThemeSelect">
            <option value="dark" selected>黒系</option>
            <option value="light">白系</option>
          </select>
        </label>
      </div>
      <div class="row two">
        <label>保存名
          <input id="fileNameInput" type="text" value="pixel-art-pro">
        </label>
        <label>テンプレート
          <select id="templateSelect"></select>
        </label>
      </div>
      <div class="toolbar-split">
        <div class="toolbar-group left">
          <div class="group-label">保存</div>
          <button id="savePngBtn" class="good">PNG保存</button>
          <button id="savePsdBtn" class="good">PSD保存</button>
          <button id="saveBothBtn" class="good">PNG+PSD保存</button>
          <button id="saveJsonBtn" class="gold">JSON保存</button>
          <button id="exportJsonBtn">JSON欄へ書き出し</button>
        </div>
        <div class="toolbar-group right">
          <div class="group-label">キャンバス操作</div>
          <button id="applyTemplateBtn" class="primary">テンプレ適用</button>
          <button id="rebuildBtn" class="primary">サイズ反映</button>
          <button id="clearCanvasBtn" class="warn">全部クリア</button>
        </div>
      </div>
      <div class="hint">PNG / PSD / JSON は Scriptable bridge がある場合はそのまま保存要求を送ります。bridge が無い通常ブラウザではダウンロードへ自動で切り替えます。</div>
    </div>
  </section>

  <section class="panel">
    <h2>2. 色番号・命令入力・ログ</h2>
    <div class="panel-body">
      <div class="grid-two">
        <div class="row">
          <label>色番号辞書
            <textarea id="paletteInput" spellcheck="false">1 = #0000
2 = #1F2937
3 = #F5F5F4
4 = #EF4444
5 = #F59E0B
6 = #10B981
7 = #3B82F6
8 = #A855F7</textarea>
          </label>
          <div id="paletteGrid" class="palette-grid"></div>
          <div class="toolbar-split">
            <div class="toolbar-group left">
              <div class="group-label">色番号</div>
              <button id="applyPaletteBtn">色番号だけ反映</button>
              <button id="clearPaletteBtn" class="ghost">色番号辞書を消す</button>
            </div>
            <div class="toolbar-group right">
              <div class="group-label">例</div>
              <button id="toggleExamplesBtn" class="ghost">命令例を表示</button>
            </div>
          </div>
        </div>
        <div class="row">
          <label>命令入力
            <div id="commandEditor" class="code-editor">
              <pre id="commandHighlight" aria-hidden="true"></pre>
              <textarea id="commandInput" spellcheck="false">X=2-6, Y=3-5, 4
copy x=2-6 y=3-5
paste x=10 y=3
layer add face
layer use face
dot x=8 y=8 color=7</textarea>
            </div>
          </label>
          <div class="toolbar-split">
            <div class="toolbar-group left">
              <div class="group-label">命令</div>
              <button id="runBtn" class="primary">命令をまとめて実行</button>
              <button id="clearCommandBtn" class="ghost">命令欄を消す</button>
            </div>
            <div class="toolbar-group right">
              <div class="group-label">JSON</div>
              <button id="loadJsonFileBtn" class="gold">JSONファイルを選んで読み込む</button>
              <button id="clearJsonBtn" class="ghost">JSON表示欄を消す</button>
            </div>
          </div>
          <div class="notice-box">
            <div id="examplesBox" class="examples hidden">基本:
1 = #FF0000
X=2, Y=3-5, 1
X=4-6, Y=2, #00CCFF
erase x=7-9 y=1
copy x=2-4 y=3-6
paste x=8 y=3
左右反転
上下反転
選択解除
clear

点単位:
dot x=12 y=8 color=5
dots (12,8,5) (13,8,5) (14,9,6)
line x1=2 y1=2 x2=14 y2=9 color=7
replace x=1-16 y=1-16 from=4 to=5

レイヤー:
layer add face
layer use face
layer hide shadow
layer show shadow
layer lock line
layer unlock line
layer rename face -> face_main
layer up face
layer down shadow

パーツ:
part save eye_open
stamp eye_open x=20 y=8
part delete eye_open

パッチ:
patch base neutral
patch save smile from neutral
patch apply smile
patch remove smile
patch delete smile

メタ:
meta project=CommonAssets category=characters resourceId=hero_face character=hero expression=smile variant=summer note=demo</div>
            <div id="noticePill" class="pill notice">準備OK</div>
            <div id="logBox" class="logbox"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="panel">
    <h2>3. プレビューと微調整</h2>
    <div class="panel-body">
      <div class="mode-bar">
        <button id="paintModeBtn" class="active">塗る</button>
        <button id="eraseModeBtn">消す</button>
        <button id="undoBtn">undo</button>
        <button id="redoBtn">redo</button>
        <button id="lockModeBtn">一時ロック</button>
        <button id="fitViewBtn">全体表示</button>
        <button id="selectModeBtn">範囲選択</button>
        <button id="copyBtn">コピー</button>
        <button id="pasteModeBtn">貼り付け位置</button>
        <button id="applyPasteBtn" class="good">貼り付け実行</button>
        <button id="flipHBtn">左右反転</button>
        <button id="flipVBtn">上下反転</button>
        <button id="clearSelectionBtn">選択解除</button>
      </div>
      <div class="statusbar">
        <span id="modePill" class="pill">モード: 塗る</span>
        <span id="colorPill" class="pill">現在色: 1 → #0000</span>
        <span id="selectionPill" class="pill">選択: なし</span>
        <span id="clipboardPill" class="pill">コピー: なし</span>
        <span id="layerPill" class="pill">レイヤー: base</span>
        <span id="partPill" class="pill">パーツ: なし</span>
        <span id="patchPill" class="pill">パッチ: なし</span>
        <span id="resourcePill" class="pill">resource: -</span>
      </div>
      <div class="canvas-shell">
        <canvas id="gridCanvas"></canvas>
      </div>
      <div class="footer-note">描画は現在レイヤーへだけ行われます。表示中レイヤーだけが合成表示され、PNG / PSD 書き出しもその合成結果を使います。ロック中レイヤーは編集不可です。</div>
    </div>
  </section>

  <section class="panel">
    <h2>4. レイヤー・パーツ・パッチ</h2>
    <div class="panel-body">
      <div class="hint">この3列は横にスライドできます。</div>
      <div class="scroll-x">
        <div class="grid-three wide-three">
        <div class="row">
          <label>新規レイヤー名
            <input id="newLayerNameInput" type="text" value="layer-2">
          </label>
          <div class="toolbar">
            <button id="addLayerBtn" class="primary">レイヤー追加</button>
            <button id="renameLayerBtn">名前変更</button>
            <button id="deleteLayerBtn" class="warn">削除</button>
          </div>
          <div class="toolbar">
            <button id="toggleLayerVisibleBtn">表示/非表示</button>
            <button id="toggleLayerLockBtn">ロック/解除</button>
            <button id="moveLayerUpBtn">上へ</button>
            <button id="moveLayerDownBtn">下へ</button>
          </div>
          <div id="layerList" class="layer-list"></div>
        </div>
        <div class="row">
          <label>パーツ名
            <input id="partNameInput" type="text" value="eye_open">
          </label>
          <div class="toolbar">
            <button id="savePartBtn" class="primary">選択範囲をパーツ保存</button>
            <button id="deletePartBtn" class="warn">削除</button>
          </div>
          <div class="row two">
            <label>stamp X
              <input id="stampXInput" type="number" min="1" value="1">
            </label>
            <label>stamp Y
              <input id="stampYInput" type="number" min="1" value="1">
            </label>
          </div>
          <div class="toolbar">
            <button id="stampPartBtn">選択パーツを貼る</button>
          </div>
          <div id="partList" class="asset-list"></div>
        </div>
        <div class="row">
          <label>パッチ名
            <input id="patchNameInput" type="text" value="smile">
          </label>
          <label>比較基準名（neutral など）
            <input id="patchBaseNameInput" type="text" value="neutral">
          </label>
          <div class="toolbar">
            <button id="savePatchBaseBtn" class="gold">現在レイヤーを基準保存</button>
            <button id="savePatchBtn" class="primary">差分パッチ保存</button>
          </div>
          <div class="toolbar">
            <button id="applyPatchBtn">選択パッチ適用</button>
            <button id="removePatchBtn">適用解除</button>
            <button id="deletePatchBtn" class="warn">削除</button>
          </div>
          <div id="patchList" class="asset-list"></div>
        </div>
        </div>
      </div>
    </div>
  </section>

  <section class="panel">
    <h2>5. メタ情報・resourceMap 互換・テンプレート</h2>
    <div class="panel-body">
      <div class="grid-two">
        <div class="row">
          <div class="row two">
            <label>project
              <input id="metaProjectInput" type="text" value="">
            </label>
            <label>category
              <input id="metaCategoryInput" type="text" value="">
            </label>
          </div>
          <div class="row two">
            <label>resourceId
              <input id="metaResourceIdInput" type="text" value="">
            </label>
            <label>character
              <input id="metaCharacterInput" type="text" value="">
            </label>
          </div>
          <div class="row two">
            <label>expression
              <input id="metaExpressionInput" type="text" value="">
            </label>
            <label>variant
              <input id="metaVariantInput" type="text" value="">
            </label>
          </div>
          <label>note
            <textarea id="metaNoteInput" spellcheck="false" style="min-height:80px"></textarea>
          </label>
          <div class="hint">このメタ情報はゲーム固有に縛られず、どのアセットでも使える汎用欄です。</div>
        </div>
        <div class="row">
          <label>resourceMap / 汎用 JSON / JS オブジェクト貼り付け
            <textarea id="resourceMapInput" spellcheck="false" style="min-height:220px">const resourceMap = {
  characters: {
    hero: {
      neutral: { resourceId: "hero_neutral", category: "characters", character: "hero", expression: "neutral" },
      smile: { resourceId: "hero_smile", category: "characters", character: "hero", expression: "smile" }
    }
  },
  backgrounds: {
    room_day: { resourceId: "room_day", category: "backgrounds" }
  },
  ui: {
    button_ok: { resourceId: "button_ok", category: "ui" }
  }
};</textarea>
          </label>
          <div class="toolbar">
            <button id="parseResourceMapBtn" class="primary">resourceMap を解析</button>
            <button id="applyResourceMetaBtn">選択 resource のメタ反映</button>
            <button id="loadResourceDataBtn">選択 resource の内容読込</button>
          </div>
          <div id="resourceList" class="resource-list"></div>
        </div>
      </div>
      <div class="grid-two">
        <div class="row">
          <label>テンプレート定義（編集可 JSON）
            <textarea id="templateJsonInput" spellcheck="false" style="min-height:210px">[
  {"name":"dot 24x24","type":"dot","cols":24,"rows":24},
  {"name":"dot 32x32","type":"dot","cols":32,"rows":32},
  {"name":"dot 48x48","type":"dot","cols":48,"rows":48},
  {"name":"background 160x90","type":"background","cols":160,"rows":90},
  {"name":"background 320x180","type":"background","cols":320,"rows":180},
  {"name":"background 480x270","type":"background","cols":480,"rows":270},
  {"name":"standing 96x160","type":"standing","cols":96,"rows":160},
  {"name":"standing 128x192","type":"standing","cols":128,"rows":192}
]</textarea>
          </label>
          <div class="toolbar">
            <button id="reloadTemplatesBtn">テンプレ再読込</button>
          </div>
        </div>
        <div class="row">
          <div class="hint">テンプレートは固定ではなく自由に編集できます。サイズだけの最小定義でも、type や meta を付けた定義でも読み込めます。</div>
          <div id="templateList" class="template-list"></div>
        </div>
      </div>
    </div>
  </section>

  <section class="panel">
    <h2>6. ガイド・オーバーレイ・JSON</h2>
    <div class="panel-body">
      <div class="grid-two">
        <div class="row">
          <div class="row two">
            <label><span>中心線</span><button id="toggleCenterGuideBtn">ON/OFF</button></label>
            <label><span>顔ガイド</span><button id="toggleFaceGuideBtn">ON/OFF</button></label>
          </div>
          <div class="row two">
            <label><span>頭身ガイド</span><button id="toggleHeadsGuideBtn">ON/OFF</button></label>
            <label>頭身数
              <input id="headsCountInput" type="number" min="2" max="12" value="8">
            </label>
          </div>
          <label>参照画像オーバーレイ
            <input id="overlayFileInput" type="file" accept="image/*">
          </label>
          <div class="row three">
            <label>不透明度
              <input id="overlayOpacityInput" type="range" min="0" max="100" value="35">
            </label>
            <label>拡大率(1=キャンバス基準)
              <input id="overlayScaleInput" type="number" min="0.1" max="5" step="0.1" value="1">
            </label>
            <label>表示
              <button id="toggleOverlayBtn">ON/OFF</button>
            </label>
          </div>
          <div class="row two">
            <label>オーバーレイ Xずれ(マス)
              <input id="overlayOffsetXInput" type="number" step="0.1" value="0">
            </label>
            <label>オーバーレイ Yずれ(マス)
              <input id="overlayOffsetYInput" type="number" step="0.1" value="0">
            </label>
          </div>
          <div class="toolbar">
            <button id="clearOverlayBtn" class="ghost">オーバーレイ削除</button>
          </div>
        </div>
        <div class="row">
          <div id="jsonFilePill" class="pill">読込JSON: なし</div>
          <label>JSON表示欄（書き出し確認用）
            <textarea id="jsonInput" class="jsonbox" spellcheck="false" style="min-height:330px"></textarea>
          </label>
          <div class="hint">JSONの読込は上の「JSONファイルを選んで読み込む」から行います。保存対象: キャンバス状態 / レイヤー / パーツ / パッチ / パレット / テンプレート / メタ情報 / ガイド設定 / resourceIndex。</div>
        </div>
      </div>
    </div>
  </section>
</div>

<script>
(function(){
  'use strict';

  const $ = function(id){ return document.getElementById(id); };
  const els = {
    colsInput: $('colsInput'), rowsInput: $('rowsInput'), cellSizeInput: $('cellSizeInput'), exportScaleInput: $('exportScaleInput'),
    canvasThemeSelect: $('canvasThemeSelect'), fileNameInput: $('fileNameInput'), templateSelect: $('templateSelect'), applyTemplateBtn: $('applyTemplateBtn'),
    rebuildBtn: $('rebuildBtn'), clearCanvasBtn: $('clearCanvasBtn'), savePngBtn: $('savePngBtn'), savePsdBtn: $('savePsdBtn'),
    saveBothBtn: $('saveBothBtn'), saveJsonBtn: $('saveJsonBtn'), exportJsonBtn: $('exportJsonBtn'),
    paletteInput: $('paletteInput'), paletteGrid: $('paletteGrid'), applyPaletteBtn: $('applyPaletteBtn'), clearPaletteBtn: $('clearPaletteBtn'),
    toggleExamplesBtn: $('toggleExamplesBtn'), examplesBox: $('examplesBox'),
    commandEditor: $('commandEditor'), commandHighlight: $('commandHighlight'), commandInput: $('commandInput'), runBtn: $('runBtn'), clearCommandBtn: $('clearCommandBtn'),
    logBox: $('logBox'), noticePill: $('noticePill'), jsonInput: $('jsonInput'), loadJsonFileBtn: $('loadJsonFileBtn'), clearJsonBtn: $('clearJsonBtn'), jsonFilePill: $('jsonFilePill'),
    paintModeBtn: $('paintModeBtn'), eraseModeBtn: $('eraseModeBtn'), undoBtn: $('undoBtn'), redoBtn: $('redoBtn'), lockModeBtn: $('lockModeBtn'), fitViewBtn: $('fitViewBtn'),
    selectModeBtn: $('selectModeBtn'), copyBtn: $('copyBtn'), pasteModeBtn: $('pasteModeBtn'), applyPasteBtn: $('applyPasteBtn'),
    flipHBtn: $('flipHBtn'), flipVBtn: $('flipVBtn'), clearSelectionBtn: $('clearSelectionBtn'),
    modePill: $('modePill'), colorPill: $('colorPill'), selectionPill: $('selectionPill'), clipboardPill: $('clipboardPill'),
    layerPill: $('layerPill'), partPill: $('partPill'), patchPill: $('patchPill'), resourcePill: $('resourcePill'),
    canvasShell: document.querySelector('.canvas-shell'), gridCanvas: $('gridCanvas'),
    newLayerNameInput: $('newLayerNameInput'), addLayerBtn: $('addLayerBtn'), renameLayerBtn: $('renameLayerBtn'),
    deleteLayerBtn: $('deleteLayerBtn'), toggleLayerVisibleBtn: $('toggleLayerVisibleBtn'), toggleLayerLockBtn: $('toggleLayerLockBtn'),
    moveLayerUpBtn: $('moveLayerUpBtn'), moveLayerDownBtn: $('moveLayerDownBtn'), layerList: $('layerList'),
    partNameInput: $('partNameInput'), savePartBtn: $('savePartBtn'), deletePartBtn: $('deletePartBtn'),
    stampXInput: $('stampXInput'), stampYInput: $('stampYInput'), stampPartBtn: $('stampPartBtn'), partList: $('partList'),
    patchNameInput: $('patchNameInput'), patchBaseNameInput: $('patchBaseNameInput'), savePatchBaseBtn: $('savePatchBaseBtn'),
    savePatchBtn: $('savePatchBtn'), applyPatchBtn: $('applyPatchBtn'), removePatchBtn: $('removePatchBtn'), deletePatchBtn: $('deletePatchBtn'), patchList: $('patchList'),
    metaProjectInput: $('metaProjectInput'), metaCategoryInput: $('metaCategoryInput'), metaResourceIdInput: $('metaResourceIdInput'),
    metaCharacterInput: $('metaCharacterInput'), metaExpressionInput: $('metaExpressionInput'), metaVariantInput: $('metaVariantInput'), metaNoteInput: $('metaNoteInput'),
    resourceMapInput: $('resourceMapInput'), parseResourceMapBtn: $('parseResourceMapBtn'), applyResourceMetaBtn: $('applyResourceMetaBtn'),
    loadResourceDataBtn: $('loadResourceDataBtn'), resourceList: $('resourceList'),
    templateJsonInput: $('templateJsonInput'), reloadTemplatesBtn: $('reloadTemplatesBtn'), templateList: $('templateList'),
    toggleCenterGuideBtn: $('toggleCenterGuideBtn'), toggleFaceGuideBtn: $('toggleFaceGuideBtn'), toggleHeadsGuideBtn: $('toggleHeadsGuideBtn'),
    headsCountInput: $('headsCountInput'), overlayFileInput: $('overlayFileInput'), overlayOpacityInput: $('overlayOpacityInput'), overlayScaleInput: $('overlayScaleInput'),
    toggleOverlayBtn: $('toggleOverlayBtn'), overlayOffsetXInput: $('overlayOffsetXInput'), overlayOffsetYInput: $('overlayOffsetYInput'), clearOverlayBtn: $('clearOverlayBtn')
  };

  const ctx = els.gridCanvas.getContext('2d', { alpha:true, willReadFrequently:true });
  const downloadAnchor = document.createElement('a');
  const colorProbe = document.createElement('canvas');
  colorProbe.width = 1; colorProbe.height = 1;
  const colorProbeCtx = colorProbe.getContext('2d', { willReadFrequently:true });

  const state = {
    cols: 32,
    rows: 32,
    cellSize: 18,
    exportScale: 16,
    canvasTheme: 'dark',
    layers: [],
    currentLayerId: null,
    palette: new Map(),
    activeColor: '#0000',
    activePaletteNumber: 1,
    mode: 'paint',
    tempLock: false,
    selection: null,
    selectStart: null,
    dragging: false,
    copied: null,
    pasteMode: false,
    pastePreview: null,
    lastCellKey: '',
    noticeTimer: null,
    panStart: null,
    canvasPan: null,
    historyUndo: [],
    historyRedo: [],
    historyLimit: 18,
    activePointers: new Map(),
    pinchState: null,
    strokeHistoryArmed: false,
    parts: {},
    currentPartName: '',
    patchBases: {},
    patches: {},
    currentPatchName: '',
    patchApplyState: {},
    resourceIndex: [],
    currentResourceKey: '',
    templates: [],
    meta: {
      project:'', category:'', resourceId:'', character:'', expression:'', variant:'', note:''
    },
    guides: {
      center:true, face:false, heads:false, headsCount:8
    },
    overlay: {
      image:null, visible:false, opacity:0.35, scale:1, offsetX:0, offsetY:0, name:''
    },
    commandErrorLines: new Set(),
    commandHighlightTimer: null,
    commandPlainMode: false,
    commandPasteGuard: false,
    logs: []
  };

  function clamp(v, min, max){ return Math.min(max, Math.max(min, v)); }
  function sanitizeName(name, fallback){
    const raw = String(name == null ? '' : name).trim();
    const cleaned = raw.replace(/[\/:*?"<>|]/g, '_').replace(/\s+/g, '_');
    return cleaned || fallback || 'item';
  }
  function sanitizeFileName(name){
    const raw = String(name == null ? '' : name).trim();
    const cleaned = raw.replace(/[\\/:*?"<>|]/g, '_');
    return cleaned || 'item';
  }
  function uid(prefix){ return (prefix || 'id') + '_' + Math.random().toString(36).slice(2, 9); }
  function normalizeText(value){
    return String(value || '')
      .replace(/[！-～]/g, function(s){ return String.fromCharCode(s.charCodeAt(0) - 0xFEE0); })
      .replace(/　/g, ' ')
      .replace(/[‐‑‒–—ー－]/g, '-')
      .replace(/[〜～]/g, '~')
      .replace(/[，、]/g, ',')
      .replace(/[：]/g, ':')
      .replace(/[＝]/g, '=')
      .replace(/[→]/g, '->');
  }
  function normalizeCommand(value){ return normalizeText(value).replace(/\t/g, ' ').replace(/\s+/g, ' ').trim(); }
  function createEmptyCells(cols, rows){
    return Array.from({ length: rows }, function(){
      return Array.from({ length: cols }, function(){ return null; });
    });
  }
  function cloneCells(cells){ return cells.map(function(row){ return row.slice(); }); }
  function isValidCssColor(value){
    if (!value) return false;
    const probe = new Option().style;
    probe.color = '';
    probe.color = value;
    return probe.color !== '';
  }
  function normalizeColor(value){
    const input = normalizeCommand(value).replace(/\s+/g, '');
    if (!input) return null;
    if (/^#[0-9a-f]{3,8}$/i.test(input)) return input.toUpperCase();
    if (isValidCssColor(input)) return input;
    return null;
  }
  function parsePaletteEntries(text){
    const lines = normalizeText(text).split(/\r?\n/);
    const entries = [];
    lines.forEach(function(raw){
      const line = raw.trim();
      if (!line) return;
      const m = line.match(/^(\d+)\s*(?:=|:|->|=>|\s)\s*(#[0-9a-f]{3,8}|[a-z]+)$/i);
      if (!m) return;
      const no = parseInt(m[1], 10);
      const color = normalizeColor(m[2]);
      if (no >= 0 && color) entries.push([no, color]);
    });
    return entries;
  }
  function paletteEntriesToText(){
    return Array.from(state.palette.entries())
      .sort(function(a,b){ return a[0] - b[0]; })
      .map(function(entry){ return entry[0] + ' = ' + entry[1]; })
      .join('\n');
  }
  function syncPaletteTextareaFromState(){
    if (!els.paletteInput) return;
    els.paletteInput.value = paletteEntriesToText();
  }
  function findPaletteNumberByColor(color){
    const normalized = normalizeColor(color);
    if (!normalized) return null;
    const entries = Array.from(state.palette.entries()).sort(function(a,b){ return a[0] - b[0]; });
    for (let i = 0; i < entries.length; i++){
      if (normalizeColor(entries[i][1]) === normalized) return entries[i][0];
    }
    return null;
  }
  function getNextUnusedPaletteNumber(){
    let no = 1;
    while (state.palette.has(no)) no++;
    return no;
  }
  function trackAutoPaletteAdd(number, color){
    state.commandAutoPaletteAdds = state.commandAutoPaletteAdds || [];
    const key = String(number) + ' = ' + String(color);
    if (!state.commandAutoPaletteAdds.includes(key)) state.commandAutoPaletteAdds.push(key);
  }
  function ensurePaletteEntryForColor(color, preferredNumber){
    const normalized = normalizeColor(color);
    if (!normalized) return null;
    const existing = findPaletteNumberByColor(normalized);
    if (existing != null){
      return { number: existing, color: state.palette.get(existing), created: false };
    }
    const preferred = parseInt(preferredNumber, 10);
    const nextNumber = Number.isInteger(preferred) && preferred > 0 && !state.palette.has(preferred) ? preferred : getNextUnusedPaletteNumber();
    state.palette.set(nextNumber, normalized);
    trackAutoPaletteAdd(nextNumber, normalized);
    return { number: nextNumber, color: normalized, created: true };
  }
  function mapToObject(map){
    const obj = {};
    Array.from(map.entries()).sort(function(a,b){ return a[0]-b[0]; }).forEach(function(entry){ obj[entry[0]] = entry[1]; });
    return obj;
  }
  function objectToMap(obj){
    const map = new Map();
    if (!obj || typeof obj !== 'object') return map;
    Object.keys(obj).forEach(function(key){
      const num = parseInt(key, 10);
      const color = normalizeColor(obj[key]);
      if (!Number.isNaN(num) && color) map.set(num, color);
    });
    return map;
  }
  function utf8ToBase64(str){ return btoa(unescape(encodeURIComponent(str))); }
  function base64ToUtf8(base64){ return decodeURIComponent(escape(atob(base64))); }

  function deepClone(value){ return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function createHistorySnapshot(){
    return {
      cols: state.cols,
      rows: state.rows,
      layers: deepClone(state.layers),
      currentLayerId: state.currentLayerId,
      selection: deepClone(state.selection),
      copied: deepClone(state.copied),
      pasteMode: !!state.pasteMode,
      pastePreview: deepClone(state.pastePreview),
      parts: deepClone(state.parts),
      currentPartName: state.currentPartName || '',
      patchBases: deepClone(state.patchBases),
      patches: deepClone(state.patches),
      currentPatchName: state.currentPatchName || '',
      patchApplyState: deepClone(state.patchApplyState)
    };
  }
  function applyHistorySnapshot(snapshot){
    if (!snapshot) return false;
    state.cols = clamp(parseInt(snapshot.cols, 10) || state.cols, 1, 1024);
    state.rows = clamp(parseInt(snapshot.rows, 10) || state.rows, 1, 1024);
    els.colsInput.value = String(state.cols);
    els.rowsInput.value = String(state.rows);
    state.layers = Array.isArray(snapshot.layers) && snapshot.layers.length ? deepClone(snapshot.layers) : [createLayer('base')];
    state.currentLayerId = snapshot.currentLayerId || (state.layers[0] && state.layers[0].id) || null;
    state.selection = deepClone(snapshot.selection);
    state.copied = deepClone(snapshot.copied);
    state.pasteMode = !!snapshot.pasteMode;
    state.pastePreview = deepClone(snapshot.pastePreview);
    state.parts = snapshot.parts && typeof snapshot.parts === 'object' ? deepClone(snapshot.parts) : {};
    state.currentPartName = snapshot.currentPartName || '';
    state.patchBases = snapshot.patchBases && typeof snapshot.patchBases === 'object' ? deepClone(snapshot.patchBases) : {};
    state.patches = snapshot.patches && typeof snapshot.patches === 'object' ? deepClone(snapshot.patches) : {};
    state.currentPatchName = snapshot.currentPatchName || '';
    state.patchApplyState = snapshot.patchApplyState && typeof snapshot.patchApplyState === 'object' ? deepClone(snapshot.patchApplyState) : {};
    ensureLayers();
    render();
    return true;
  }
  function pushHistory(label){
    state.historyUndo.push({ label: label || 'edit', snapshot: createHistorySnapshot() });
    if (state.historyUndo.length > state.historyLimit) state.historyUndo.shift();
    state.historyRedo = [];
    updateStatus();
  }
  function armStrokeHistory(label){
    if (state.strokeHistoryArmed) return;
    pushHistory(label || 'stroke');
    state.strokeHistoryArmed = true;
  }
  function clearStrokeHistoryFlag(){ state.strokeHistoryArmed = false; }
  function undoHistory(){
    const entry = state.historyUndo.pop();
    if (!entry){ setNotice('undoできる履歴がありません', 'error'); return false; }
    state.historyRedo.push({ label: entry.label || 'edit', snapshot: createHistorySnapshot() });
    applyHistorySnapshot(entry.snapshot);
    setNotice('undoしました', 'success');
    logMessage('undoしました', 'success');
    updateStatus();
    return true;
  }
  function redoHistory(){
    const entry = state.historyRedo.pop();
    if (!entry){ setNotice('redoできる履歴がありません', 'error'); return false; }
    state.historyUndo.push({ label: entry.label || 'edit', snapshot: createHistorySnapshot() });
    if (state.historyUndo.length > state.historyLimit) state.historyUndo.shift();
    applyHistorySnapshot(entry.snapshot);
    setNotice('redoしました', 'success');
    logMessage('redoしました', 'success');
    updateStatus();
    return true;
  }
  function getActivePaintColor(){
    if (state.activePaletteNumber != null && state.palette.has(state.activePaletteNumber)) {
      const paletteColor = state.palette.get(state.activePaletteNumber);
      state.activeColor = paletteColor;
      return paletteColor;
    }
    const directColor = normalizeColor(state.activeColor);
    if (directColor) {
      state.activeColor = directColor;
      return directColor;
    }
    const first = Array.from(state.palette.entries()).sort(function(a,b){ return a[0] - b[0]; })[0];
    if (first){
      state.activePaletteNumber = first[0];
      state.activeColor = first[1];
      return first[1];
    }
    return null;
  }
  function updateCanvasTouchAction(){
    if (!els.gridCanvas) return;
    els.gridCanvas.style.touchAction = 'none';
  }
  function distanceBetweenPoints(a, b){
    return Math.hypot((a.clientX || 0) - (b.clientX || 0), (a.clientY || 0) - (b.clientY || 0));
  }
  function midpointBetweenPoints(a, b){
    return { clientX: ((a.clientX || 0) + (b.clientX || 0)) / 2, clientY: ((a.clientY || 0) + (b.clientY || 0)) / 2 };
  }
  function beginPinchGesture(){
    const pointers = Array.from(state.activePointers.values());
    if (pointers.length < 2) return false;
    const mid = midpointBetweenPoints(pointers[0], pointers[1]);
    const rect = els.gridCanvas.getBoundingClientRect();
    const dist = distanceBetweenPoints(pointers[0], pointers[1]);
    if (!dist) return false;
    state.pinchState = {
      startDistance: dist,
      startCellSize: state.cellSize,
      gridX: (mid.clientX - rect.left) / Math.max(1, state.cellSize),
      gridY: (mid.clientY - rect.top) / Math.max(1, state.cellSize)
    };
    state.dragging = false;
    state.selectStart = null;
    state.lastCellKey = '';
    endCanvasPan();
    clearStrokeHistoryFlag();
    return true;
  }
  function zoomCanvasToCellSize(nextSize, anchorClientX, anchorClientY){
    const targetSize = clamp(parseInt(nextSize, 10) || state.cellSize, 2, 60);
    const oldSize = state.cellSize;
    const beforeRect = els.gridCanvas.getBoundingClientRect();
    const gridX = (anchorClientX - beforeRect.left) / Math.max(1, oldSize);
    const gridY = (anchorClientY - beforeRect.top) / Math.max(1, oldSize);
    if (targetSize !== oldSize){
      els.cellSizeInput.value = String(targetSize);
      render();
    }
    const afterRect = els.gridCanvas.getBoundingClientRect();
    const desiredLeft = anchorClientX - gridX * targetSize;
    const desiredTop = anchorClientY - gridY * targetSize;
    els.canvasShell.scrollLeft += afterRect.left - desiredLeft;
    els.canvasShell.scrollTop += afterRect.top - desiredTop;
  }
  function toggleTempLock(){
    state.tempLock = !state.tempLock;
    if (state.tempLock){
      state.pasteMode = false;
      state.pastePreview = null;
      state.dragging = false;
      state.selectStart = null;
      state.lastCellKey = '';
      endCanvasPan();
      clearStrokeHistoryFlag();
      setNotice('一時ロックをONにしました', 'accent');
    } else {
      setNotice('一時ロックをOFFにしました', 'accent');
    }
    updateCanvasTouchAction();
    render();
  }
  function setNotice(text, tone){
    if (state.noticeTimer){ clearTimeout(state.noticeTimer); state.noticeTimer = null; }
    const label = String(text || '').trim() || '準備OK';
    els.noticePill.textContent = label;
    let bg = 'rgba(56,189,248,.10)', border = 'rgba(56,189,248,.25)', color='#d9eefb';
    if (tone === 'success'){ bg='rgba(34,197,94,.12)'; border='rgba(34,197,94,.28)'; color='#dcfce7'; }
    if (tone === 'error'){ bg='rgba(244,63,94,.12)'; border='rgba(244,63,94,.28)'; color='#fecdd3'; }
    if (tone === 'accent'){ bg='rgba(168,85,247,.12)'; border='rgba(168,85,247,.28)'; color='#f3e8ff'; }
    if (tone === 'gold'){ bg='rgba(245,158,11,.12)'; border='rgba(245,158,11,.28)'; color='#fde68a'; }
    els.noticePill.style.background = bg;
    els.noticePill.style.borderColor = border;
    els.noticePill.style.color = color;
    if (tone !== 'error'){
      state.noticeTimer = window.setTimeout(function(){
        if (els.noticePill.textContent === label){
          els.noticePill.textContent = '準備OK';
          els.noticePill.style.background = 'rgba(56,189,248,.10)';
          els.noticePill.style.borderColor = 'rgba(56,189,248,.25)';
          els.noticePill.style.color = '#d9eefb';
        }
      }, 2600);
    }
  }
  function logMessage(text, tone){
    const stamp = new Date();
    const hh = String(stamp.getHours()).padStart(2, '0');
    const mm = String(stamp.getMinutes()).padStart(2, '0');
    const ss = String(stamp.getSeconds()).padStart(2, '0');
    state.logs.unshift({ time: hh+':'+mm+':'+ss, text: String(text || ''), tone: tone || '' });
    state.logs = state.logs.slice(0, 80);
    renderLog();
  }
  function renderLog(){
    els.logBox.innerHTML = '';
    if (!state.logs.length){
      els.logBox.textContent = 'ログはここに表示されます。';
      return;
    }
    state.logs.forEach(function(item){
      const row = document.createElement('div');
      row.style.padding = '4px 0';
      row.style.borderBottom = '1px solid rgba(255,255,255,.06)';
      const tone = item.tone === 'error' ? '#fecaca' : (item.tone === 'success' ? '#bbf7d0' : '#d5e2ef');
      row.innerHTML = '<span style="color:#93c5fd">[' + escapeHtml(item.time) + ']</span> <span style="color:' + tone + '">' + escapeHtml(item.text) + '</span>';
      els.logBox.appendChild(row);
    });
  }
  function escapeHtml(str){
    return String(str || '').replace(/[&<>"']/g, function(ch){
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch];
    });
  }
  function syncCommandHighlightScroll(){
    if (!els.commandHighlight || !els.commandInput) return;
    const x = els.commandInput.scrollLeft || 0;
    const y = els.commandInput.scrollTop || 0;
    els.commandHighlight.style.transform = 'translate(' + (-x) + 'px,' + (-y) + 'px)';
  }
  function normalizeMultilineText(value){
    return String(value == null ? '' : value)
      .replace(/\r\n?/g, '\n')
      .replace(/[\u2028\u2029]/g, '\n')
      .replace(/\u00A0/g, ' ');
  }
  function setCommandEditorPlainMode(on){
    const next = !!on;
    state.commandPlainMode = next;
    if (els.commandEditor) els.commandEditor.classList.toggle('plain-mode', next);
    if (next && els.commandHighlight){
      els.commandHighlight.innerHTML = '';
      els.commandHighlight.style.transform = 'translate(0px,0px)';
    }
  }
  function insertTextAtCursor(textarea, text){
    if (!textarea) return;
    const value = String(textarea.value || '');
    const start = typeof textarea.selectionStart === 'number' ? textarea.selectionStart : value.length;
    const end = typeof textarea.selectionEnd === 'number' ? textarea.selectionEnd : start;
    const next = value.slice(0, start) + text + value.slice(end);
    textarea.value = next;
    const caret = start + text.length;
    try { textarea.selectionStart = caret; textarea.selectionEnd = caret; } catch (error) {}
  }
  function updateCommandHighlight(){
    if (!els.commandHighlight || !els.commandInput) return;
    if (state.commandPlainMode){
      els.commandHighlight.innerHTML = '';
      return;
    }
    const source = normalizeMultilineText(els.commandInput.value || '');
    const lines = source.split('\n');
    const errorLines = state.commandErrorLines || new Set();
    els.commandHighlight.innerHTML = lines.map(function(line, index){
      const isError = errorLines.has(index + 1);
      const safe = escapeHtml(line || ' ');
      return '<span class="command-line' + (isError ? ' error' : '') + (!line ? ' blank' : '') + '">' + safe + '</span>';
    }).join('');
    syncCommandHighlightScroll();
  }
  function refreshCommandEditor(forcePlainOff){
    if (!els.commandInput) return;
    const normalized = normalizeMultilineText(els.commandInput.value || '');
    if (normalized !== els.commandInput.value){
      const selStart = els.commandInput.selectionStart;
      const selEnd = els.commandInput.selectionEnd;
      els.commandInput.value = normalized;
      try {
        els.commandInput.selectionStart = Math.min(selStart, normalized.length);
        els.commandInput.selectionEnd = Math.min(selEnd, normalized.length);
      } catch (error) {}
    }
    const lineCount = normalized ? normalized.split('\n').length : 1;
    const heavy = !forcePlainOff && (normalized.length > 12000 || lineCount > 420);
    setCommandEditorPlainMode(heavy);
    updateCommandHighlight();
  }
  function scheduleCommandEditorRefresh(delay, forcePlainOff){
    if (state.commandHighlightTimer){
      clearTimeout(state.commandHighlightTimer);
      state.commandHighlightTimer = null;
    }
    state.commandHighlightTimer = window.setTimeout(function(){
      state.commandHighlightTimer = null;
      refreshCommandEditor(!!forcePlainOff);
    }, typeof delay === 'number' ? delay : 0);
  }
  function beginCommandPasteGuard(){
    state.commandPasteGuard = true;
    setCommandEditorPlainMode(true);
  }
  function finishCommandPasteGuard(){
    state.commandPasteGuard = false;
    refreshCommandEditor(false);
  }
  function scheduleCommandPasteRecovery(){
    [0, 40, 160, 420].forEach(function(delay, index){
      window.setTimeout(function(){
        if (index === 3) finishCommandPasteGuard();
        else refreshCommandEditor(false);
      }, delay);
    });
  }
  function applyCanvasTheme(){
    const theme = state.canvasTheme === 'light' ? 'light' : 'dark';
    state.canvasTheme = theme;
    if (els.canvasThemeSelect) els.canvasThemeSelect.value = theme;
    if (els.canvasShell){
      els.canvasShell.classList.toggle('theme-light', theme === 'light');
      els.canvasShell.classList.toggle('theme-dark', theme !== 'light');
    }
    if (els.gridCanvas){
      els.gridCanvas.classList.toggle('theme-light', theme === 'light');
      els.gridCanvas.classList.toggle('theme-dark', theme !== 'light');
    }
  }
  function createLayer(name){
    return { id: uid('layer'), name: sanitizeName(name, 'layer'), visible:true, locked:false, cells:createEmptyCells(state.cols, state.rows) };
  }
  function getLayerById(id){ return state.layers.find(function(layer){ return layer.id === id; }) || null; }
  function getLayerByName(name){
    const target = String(name || '').trim();
    return state.layers.find(function(layer){ return layer.name === target; }) || null;
  }
  function getLayerByNameOrId(name){ return getLayerById(name) || getLayerByName(name); }
  function getCurrentLayer(){ return getLayerById(state.currentLayerId) || state.layers[0] || null; }
  function ensureLayers(){
    if (!state.layers.length){
      const base = createLayer('base');
      state.layers.push(base);
      state.currentLayerId = base.id;
    }
    if (!getCurrentLayer()) state.currentLayerId = state.layers[0].id;
  }
  function resizeCellsPreserve(cells, newCols, newRows){
    const out = createEmptyCells(newCols, newRows);
    const h = Math.min(newRows, cells.length);
    const w = Math.min(newCols, cells[0] ? cells[0].length : 0);
    for (let y = 0; y < h; y++){
      for (let x = 0; x < w; x++) out[y][x] = cells[y][x];
    }
    return out;
  }
  function resizeAllLayers(newCols, newRows){
    state.layers.forEach(function(layer){ layer.cells = resizeCellsPreserve(layer.cells, newCols, newRows); });
    Object.keys(state.patchBases).forEach(function(key){
      const base = state.patchBases[key];
      base.cells = resizeCellsPreserve(base.cells, newCols, newRows);
      base.cols = newCols; base.rows = newRows;
    });
  }
  function applyPaletteFromTextarea(){
    const entries = parsePaletteEntries(els.paletteInput.value);
    if (!entries.length){
      setNotice('色番号辞書を解釈できませんでした', 'error');
      logMessage('色番号辞書を解釈できませんでした', 'error');
      return false;
    }
    state.palette.clear();
    entries.forEach(function(entry){ state.palette.set(entry[0], entry[1]); });
    const first = entries[0];
    if (state.activePaletteNumber != null && state.palette.has(state.activePaletteNumber)) {
      state.activeColor = state.palette.get(state.activePaletteNumber);
    } else {
      state.activePaletteNumber = first[0];
      state.activeColor = first[1];
    }
    renderPaletteGrid();
    render();
    setNotice(entries.length + '件の色番号を反映しました', 'success');
    logMessage(entries.length + '件の色番号を反映しました', 'success');
    return true;
  }
  function renderPaletteGrid(){
    const sortedPalette = Array.from(state.palette.entries()).sort(function(a,b){ return a[0]-b[0]; });
    if (sortedPalette.length && (state.activePaletteNumber == null || !state.palette.has(state.activePaletteNumber))){
      state.activePaletteNumber = sortedPalette[0][0];
      state.activeColor = sortedPalette[0][1];
    }
    els.paletteGrid.innerHTML = '';
    sortedPalette.forEach(function(entry){
      const no = entry[0], color = entry[1];
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'palette-chip' + (state.activePaletteNumber === no ? ' active' : '');
      item.innerHTML = '<span class="swatch" style="background:' + escapeHtml(color) + '"></span><span>' + escapeHtml(String(no)) + '<br><span class="small">' + escapeHtml(color) + '</span></span>';
      item.addEventListener('click', function(){
        state.activePaletteNumber = no;
        state.activeColor = color;
        renderPaletteGrid();
        updateStatus();
      });
      els.paletteGrid.appendChild(item);
    });
  }
  function readMetaFromInputs(){
    state.meta.project = els.metaProjectInput.value.trim();
    state.meta.category = els.metaCategoryInput.value.trim();
    state.meta.resourceId = els.metaResourceIdInput.value.trim();
    state.meta.character = els.metaCharacterInput.value.trim();
    state.meta.expression = els.metaExpressionInput.value.trim();
    state.meta.variant = els.metaVariantInput.value.trim();
    state.meta.note = els.metaNoteInput.value;
  }
  function writeMetaToInputs(){
    els.metaProjectInput.value = state.meta.project || '';
    els.metaCategoryInput.value = state.meta.category || '';
    els.metaResourceIdInput.value = state.meta.resourceId || '';
    els.metaCharacterInput.value = state.meta.character || '';
    els.metaExpressionInput.value = state.meta.expression || '';
    els.metaVariantInput.value = state.meta.variant || '';
    els.metaNoteInput.value = state.meta.note || '';
    updateStatus();
  }
  function setMetaFields(fields){
    Object.keys(fields || {}).forEach(function(key){
      if (key in state.meta) state.meta[key] = fields[key] == null ? '' : String(fields[key]);
    });
    writeMetaToInputs();
  }
  function getModeLabel(){
    if (state.pasteMode) return '貼り付け位置';
    if (state.mode === 'erase') return '消す';
    if (state.mode === 'select') return '範囲選択';
    return '塗る';
  }
  function getNormalizedSelection(){
    if (!state.selection) return null;
    return { x1:Math.min(state.selection.x1,state.selection.x2), x2:Math.max(state.selection.x1,state.selection.x2), y1:Math.min(state.selection.y1,state.selection.y2), y2:Math.max(state.selection.y1,state.selection.y2) };
  }
  function updateModeButtons(){
    els.paintModeBtn.classList.toggle('active', state.mode === 'paint' && !state.pasteMode && !state.tempLock);
    els.eraseModeBtn.classList.toggle('active', state.mode === 'erase' && !state.pasteMode && !state.tempLock);
    els.selectModeBtn.classList.toggle('active', state.mode === 'select' && !state.pasteMode && !state.tempLock);
    els.pasteModeBtn.classList.toggle('active', !!state.pasteMode && !state.tempLock);
    els.lockModeBtn.classList.toggle('active', !!state.tempLock);
    els.applyPasteBtn.disabled = !(state.pasteMode && state.pastePreview && state.copied) || !!state.tempLock;
    els.undoBtn.disabled = !state.historyUndo.length;
    els.redoBtn.disabled = !state.historyRedo.length;
  }
  function updateStatus(){
    const layer = getCurrentLayer();
    const sel = getNormalizedSelection();
    const paintColor = getActivePaintColor();
    els.modePill.textContent = 'モード: ' + getModeLabel() + (state.tempLock ? ' / 一時ロック中' : '');
    els.colorPill.textContent = '現在色: ' + (state.activePaletteNumber != null ? state.activePaletteNumber + ' → ' + (paintColor || 'なし') : (paintColor || 'なし'));
    els.selectionPill.textContent = sel ? ('選択: X=' + sel.x1 + '-' + sel.x2 + ', Y=' + sel.y1 + '-' + sel.y2) : '選択: なし';
    if (state.pasteMode && state.pastePreview && state.copied){
      els.clipboardPill.textContent = '貼り付け: X=' + state.pastePreview.x + ', Y=' + state.pastePreview.y + ' (' + state.copied.width + '×' + state.copied.height + ')';
    } else if (state.copied){
      els.clipboardPill.textContent = 'コピー: ' + state.copied.width + '×' + state.copied.height;
    } else {
      els.clipboardPill.textContent = 'コピー: なし';
    }
    els.layerPill.textContent = 'レイヤー: ' + (layer ? layer.name : '-');
    els.partPill.textContent = 'パーツ: ' + (state.currentPartName || 'なし');
    const applied = Object.keys(state.patchApplyState).filter(function(name){ return state.patchApplyState[name] && state.patchApplyState[name].applied; });
    els.patchPill.textContent = 'パッチ: ' + (applied.length ? applied.join(', ') : (state.currentPatchName || 'なし'));
    const resourceBits = [state.meta.category, state.meta.resourceId, state.meta.expression].filter(Boolean);
    els.resourcePill.textContent = 'resource: ' + (resourceBits.length ? resourceBits.join(' / ') : '-');
    updateModeButtons();
    updateCanvasTouchAction();
  }
  function updateJsonFilePill(){
    if (!els.jsonFilePill) return;
    const name = String(state.lastJsonFileName || '').trim();
    els.jsonFilePill.textContent = '読込JSON: ' + (name || 'なし');
  }

  function setCell(layer, x, y, color){
    if (!layer) return;
    if (x < 1 || y < 1 || x > state.cols || y > state.rows) return;
    layer.cells[y - 1][x - 1] = color;
  }
  function getCell(layer, x, y){
    if (!layer) return null;
    if (x < 1 || y < 1 || x > state.cols || y > state.rows) return null;
    return layer.cells[y - 1][x - 1];
  }
  function setCurrentLayerByName(name){
    const layer = getLayerByNameOrId(name);
    if (!layer) return false;
    state.currentLayerId = layer.id;
    render();
    return true;
  }
  function fillRangeOnLayer(layer, x1, x2, y1, y2, color){
    const minX = Math.max(1, Math.min(x1, x2));
    const maxX = Math.min(state.cols, Math.max(x1, x2));
    const minY = Math.max(1, Math.min(y1, y2));
    const maxY = Math.min(state.rows, Math.max(y1, y2));
    for (let y = minY; y <= maxY; y++){
      for (let x = minX; x <= maxX; x++) setCell(layer, x, y, color);
    }
  }
  function flipHorizontal(){
    const sel = getNormalizedSelection();
    const layer = getCurrentLayer();
    if (!sel || !layer) return false;
    for (let y = sel.y1 - 1; y < sel.y2; y++){
      const slice = layer.cells[y].slice(sel.x1 - 1, sel.x2).reverse();
      for (let x = sel.x1 - 1; x < sel.x2; x++) layer.cells[y][x] = slice[x - (sel.x1 - 1)];
    }
    render();
    return true;
  }
  function flipVertical(){
    const sel = getNormalizedSelection();
    const layer = getCurrentLayer();
    if (!sel || !layer) return false;
    const rowsSlice = layer.cells.slice(sel.y1 - 1, sel.y2).map(function(row){ return row.slice(sel.x1 - 1, sel.x2); }).reverse();
    for (let y = sel.y1 - 1; y < sel.y2; y++){
      for (let x = sel.x1 - 1; x < sel.x2; x++) layer.cells[y][x] = rowsSlice[y - (sel.y1 - 1)][x - (sel.x1 - 1)];
    }
    render();
    return true;
  }
  function clearSelection(){
    state.selection = null;
    state.selectStart = null;
    render();
  }
  function copySelection(){
    const sel = getNormalizedSelection();
    const layer = getCurrentLayer();
    if (!sel || !layer) return false;
    const cells = [];
    for (let y = sel.y1; y <= sel.y2; y++){
      const row = [];
      for (let x = sel.x1; x <= sel.x2; x++) row.push(layer.cells[y - 1][x - 1]);
      cells.push(row);
    }
    state.copied = { width: sel.x2 - sel.x1 + 1, height: sel.y2 - sel.y1 + 1, cells: cells, layerId: layer.id };
    state.pastePreview = { x: sel.x1, y: sel.y1 };
    render();
    return true;
  }
  function ensurePastePreview(){
    if (!state.copied) return false;
    if (!state.pastePreview) state.pastePreview = { x:1, y:1 };
    return true;
  }
  function setPastePreview(x, y){
    if (!state.copied) return false;
    const maxX = Math.max(1, state.cols - state.copied.width + 1);
    const maxY = Math.max(1, state.rows - state.copied.height + 1);
    state.pastePreview = { x:clamp(x,1,maxX), y:clamp(y,1,maxY) };
    render();
    return true;
  }
  function pasteAt(x, y, targetLayer){
    const layer = targetLayer || getCurrentLayer();
    if (!layer || !state.copied) return false;
    for (let yy = 0; yy < state.copied.height; yy++){
      for (let xx = 0; xx < state.copied.width; xx++){
        const tx = x + xx, ty = y + yy;
        if (tx >= 1 && tx <= state.cols && ty >= 1 && ty <= state.rows) layer.cells[ty - 1][tx - 1] = state.copied.cells[yy][xx];
      }
    }
    state.selection = { x1:x, y1:y, x2:Math.min(state.cols, x + state.copied.width - 1), y2:Math.min(state.rows, y + state.copied.height - 1) };
    render();
    return true;
  }

  function getCellFromEvent(evt){
    return getCellFromClient(evt.clientX, evt.clientY);
  }
  function getCellFromClient(clientX, clientY){
    const rect = els.gridCanvas.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / state.cellSize) + 1;
    const y = Math.floor((clientY - rect.top) / state.cellSize) + 1;
    if (x < 1 || y < 1 || x > state.cols || y > state.rows) return null;
    return { x:x, y:y };
  }
  function cellKey(cell){ return cell ? (cell.x + ',' + cell.y) : ''; }
  function beginCanvasPan(clientX, clientY){
    state.canvasPan = {
      clientX: clientX,
      clientY: clientY,
      scrollLeft: els.canvasShell.scrollLeft,
      scrollTop: els.canvasShell.scrollTop
    };
    state.dragging = false;
    state.selectStart = null;
    state.lastCellKey = '';
    clearStrokeHistoryFlag();
  }
  function moveCanvasPan(clientX, clientY){
    if (!state.canvasPan) return false;
    const dx = clientX - state.canvasPan.clientX;
    const dy = clientY - state.canvasPan.clientY;
    els.canvasShell.scrollLeft = state.canvasPan.scrollLeft - dx;
    els.canvasShell.scrollTop = state.canvasPan.scrollTop - dy;
    return true;
  }
  function endCanvasPan(){ state.canvasPan = null; }
  function beginCanvasEditAt(clientX, clientY){
    if (state.tempLock){
      beginCanvasPan(clientX, clientY);
      return true;
    }
    const cell = getCellFromClient(clientX, clientY);
    if (!cell) return false;
    state.dragging = true;
    state.lastCellKey = cellKey(cell);
    if (state.pasteMode){ setPastePreview(cell.x, cell.y); return true; }
    if (!isCurrentLayerEditable() && state.mode !== 'select') return false;
    const layer = getCurrentLayer();
    if (state.mode === 'paint'){
      const paintColor = getActivePaintColor();
      if (!paintColor){ setNotice('先に色番号を反映してください', 'error'); return false; }
      armStrokeHistory('paint');
      setCell(layer, cell.x, cell.y, paintColor);
      render();
      return true;
    }
    if (state.mode === 'erase'){
      armStrokeHistory('erase');
      setCell(layer, cell.x, cell.y, null);
      render();
      return true;
    }
    state.selectStart = cell;
    state.selection = { x1:cell.x, y1:cell.y, x2:cell.x, y2:cell.y };
    render();
    return true;
  }
  function moveCanvasEditAt(clientX, clientY){
    if (state.canvasPan) return moveCanvasPan(clientX, clientY);
    if (!state.dragging) return false;
    const cell = getCellFromClient(clientX, clientY);
    if (!cell) return false;
    const key = cellKey(cell);
    if (key === state.lastCellKey) return false;
    state.lastCellKey = key;
    if (state.pasteMode){ setPastePreview(cell.x, cell.y); return true; }
    if (!isCurrentLayerEditable() && state.mode !== 'select') return false;
    const layer = getCurrentLayer();
    if (state.mode === 'paint'){
      const paintColor = getActivePaintColor();
      if (!paintColor) return false;
      armStrokeHistory('paint');
      setCell(layer, cell.x, cell.y, paintColor);
      render();
      return true;
    }
    if (state.mode === 'erase'){
      armStrokeHistory('erase');
      setCell(layer, cell.x, cell.y, null);
      render();
      return true;
    }
    if (state.mode === 'select' && state.selectStart){
      state.selection = { x1:state.selectStart.x, y1:state.selectStart.y, x2:cell.x, y2:cell.y };
      render();
      return true;
    }
    return false;
  }
  function selectionButtonOff(){ if (state.mode === 'select') state.mode = 'paint'; updateStatus(); }
  function setMode(mode){ state.mode = mode; state.tempLock = false; state.pasteMode = false; state.pastePreview = null; state.panStart = null; updateCanvasTouchAction(); updateStatus(); render(); }
  function isCurrentLayerEditable(){
    const layer = getCurrentLayer();
    if (!layer){ setNotice('レイヤーがありません', 'error'); return false; }
    if (layer.locked){ setNotice('現在レイヤーはロック中です', 'error'); return false; }
    return true;
  }

  function drawOverlay(){
    if (!state.overlay.image || !state.overlay.visible) return;
    ctx.save();
    ctx.globalAlpha = clamp(state.overlay.opacity, 0, 1);
    const baseW = state.cols * state.cellSize;
    const baseH = state.rows * state.cellSize;
    const drawW = baseW * Number(state.overlay.scale || 1);
    const drawH = baseH * Number(state.overlay.scale || 1);
    const dx = Number(state.overlay.offsetX || 0) * state.cellSize;
    const dy = Number(state.overlay.offsetY || 0) * state.cellSize;
    ctx.drawImage(state.overlay.image, dx, dy, drawW, drawH);
    ctx.restore();
  }
  function drawVisibleLayers(){
    state.layers.forEach(function(layer){
      if (!layer.visible) return;
      for (let y = 0; y < state.rows; y++){
        for (let x = 0; x < state.cols; x++){
          const color = layer.cells[y][x];
          if (color){
            ctx.fillStyle = color;
            ctx.fillRect(x * state.cellSize, y * state.cellSize, state.cellSize, state.cellSize);
          }
        }
      }
    });
  }
  function drawGuides(){
    ctx.save();
    if (state.guides.center){
      ctx.strokeStyle = 'rgba(56,189,248,.7)';
      ctx.lineWidth = 2;
      const cx = state.cols * state.cellSize / 2;
      const cy = state.rows * state.cellSize / 2;
      ctx.beginPath();
      ctx.moveTo(cx, 0); ctx.lineTo(cx, state.rows * state.cellSize);
      ctx.moveTo(0, cy); ctx.lineTo(state.cols * state.cellSize, cy);
      ctx.stroke();
    }
    if (state.guides.face){
      const w = state.cols * state.cellSize;
      const h = state.rows * state.cellSize;
      const faceW = w * 0.42;
      const faceH = h * 0.33;
      const x = (w - faceW) / 2;
      const y = h * 0.16;
      ctx.strokeStyle = 'rgba(245,158,11,.75)';
      ctx.lineWidth = 2;
      ctx.setLineDash([7,4]);
      ctx.strokeRect(x, y, faceW, faceH);
      ctx.beginPath();
      ctx.moveTo(x, y + faceH * 0.45); ctx.lineTo(x + faceW, y + faceH * 0.45);
      ctx.moveTo(x + faceW * 0.33, y); ctx.lineTo(x + faceW * 0.33, y + faceH);
      ctx.moveTo(x + faceW * 0.66, y); ctx.lineTo(x + faceW * 0.66, y + faceH);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (state.guides.heads){
      const count = clamp(parseInt(els.headsCountInput.value || state.guides.headsCount || 8, 10) || 8, 2, 12);
      const totalH = state.rows * state.cellSize;
      ctx.strokeStyle = 'rgba(168,85,247,.62)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5,4]);
      for (let i = 1; i < count; i++){
        const y = totalH * i / count;
        ctx.beginPath();
        ctx.moveTo(0, y); ctx.lineTo(state.cols * state.cellSize, y); ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    ctx.restore();
  }
  function drawSelectionAndPaste(){
    const sel = getNormalizedSelection();
    if (sel){
      ctx.fillStyle = 'rgba(59,130,246,.18)';
      ctx.fillRect((sel.x1 - 1) * state.cellSize, (sel.y1 - 1) * state.cellSize, (sel.x2 - sel.x1 + 1) * state.cellSize, (sel.y2 - sel.y1 + 1) * state.cellSize);
      ctx.strokeStyle = 'rgba(59,130,246,.98)';
      ctx.lineWidth = 2;
      ctx.strokeRect((sel.x1 - 1) * state.cellSize + 1, (sel.y1 - 1) * state.cellSize + 1, (sel.x2 - sel.x1 + 1) * state.cellSize - 2, (sel.y2 - sel.y1 + 1) * state.cellSize - 2);
    }
    if (state.pasteMode && state.copied && state.pastePreview){
      const px = state.pastePreview.x - 1, py = state.pastePreview.y - 1;
      const pw = Math.min(state.copied.width, state.cols - px), ph = Math.min(state.copied.height, state.rows - py);
      if (pw > 0 && ph > 0){
        ctx.save();
        ctx.fillStyle = 'rgba(168,85,247,.18)';
        ctx.strokeStyle = 'rgba(168,85,247,.98)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6,4]);
        ctx.fillRect(px * state.cellSize, py * state.cellSize, pw * state.cellSize, ph * state.cellSize);
        ctx.strokeRect(px * state.cellSize + 1, py * state.cellSize + 1, pw * state.cellSize - 2, ph * state.cellSize - 2);
        ctx.restore();
      }
    }
  }
  function drawGridLines(){
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(159,178,200,.35)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= state.cols; x++){
      const gx = x * state.cellSize + 0.5;
      ctx.moveTo(gx, 0); ctx.lineTo(gx, els.gridCanvas.height);
    }
    for (let y = 0; y <= state.rows; y++){
      const gy = y * state.cellSize + 0.5;
      ctx.moveTo(0, gy); ctx.lineTo(els.gridCanvas.width, gy);
    }
    ctx.stroke();
  }
  function renderLayerList(){
    els.layerList.innerHTML = '';
    state.layers.slice().reverse().forEach(function(layer){
      const card = document.createElement('div');
      const isCurrent = layer.id === state.currentLayerId;
      card.className = 'layer-item';
      card.innerHTML = '<div class="layer-head"><div><div class="layer-title">' + escapeHtml(layer.name) + '</div><div class="layer-sub">' + (isCurrent ? '現在レイヤー' : '描画対象外') + '</div></div><div class="chips">' +
        (layer.visible ? '<span class="badge ok">表示</span>' : '<span class="badge warn">非表示</span>') +
        (layer.locked ? '<span class="badge lock">ロック</span>' : '<span class="badge ok">編集可</span>') + '</div></div>';
      const tools = document.createElement('div');
      tools.className = 'inline-tools';
      const btnUse = makeMiniButton('使う', isCurrent ? 'primary' : '');
      btnUse.addEventListener('click', function(){ state.currentLayerId = layer.id; render(); });
      const btnShow = makeMiniButton(layer.visible ? '隠す' : '表示', '');
      btnShow.addEventListener('click', function(){ layer.visible = !layer.visible; render(); });
      const btnLock = makeMiniButton(layer.locked ? '解除' : 'ロック', '');
      btnLock.addEventListener('click', function(){ layer.locked = !layer.locked; render(); });
      const btnUp = makeMiniButton('上', '');
      btnUp.addEventListener('click', function(){ moveLayer(layer.id, 1); });
      const btnDown = makeMiniButton('下', '');
      btnDown.addEventListener('click', function(){ moveLayer(layer.id, -1); });
      tools.append(btnUse, btnShow, btnLock, btnUp, btnDown);
      card.appendChild(tools);
      els.layerList.appendChild(card);
    });
  }
  function renderPartList(){
    els.partList.innerHTML = '';
    const names = Object.keys(state.parts);
    if (!names.length){ els.partList.innerHTML = '<div class="asset-item"><div class="asset-sub">保存済みパーツはありません。</div></div>'; return; }
    names.sort().forEach(function(name){
      const part = state.parts[name];
      const card = document.createElement('div');
      card.className = 'asset-item';
      card.innerHTML = '<div class="asset-head"><div><div class="asset-title">' + escapeHtml(name) + '</div><div class="asset-sub">' + part.width + '×' + part.height + ' / 元レイヤー: ' + escapeHtml(part.layerName || '-') + '</div></div>' + (state.currentPartName === name ? '<span class="badge ok">選択中</span>' : '') + '</div>';
      const tools = document.createElement('div');
      tools.className = 'inline-tools';
      const btnUse = makeMiniButton('選択', state.currentPartName === name ? 'primary' : '');
      btnUse.addEventListener('click', function(){ state.currentPartName = name; render(); });
      const btnStamp = makeMiniButton('貼る', '');
      btnStamp.addEventListener('click', function(){ state.currentPartName = name; stampSelectedPart(); });
      const btnDelete = makeMiniButton('削除', 'warn');
      btnDelete.addEventListener('click', function(){ delete state.parts[name]; if (state.currentPartName === name) state.currentPartName = ''; render(); });
      tools.append(btnUse, btnStamp, btnDelete);
      card.appendChild(tools);
      els.partList.appendChild(card);
    });
  }
  function renderPatchList(){
    els.patchList.innerHTML = '';
    const names = Object.keys(state.patches);
    if (!names.length){ els.patchList.innerHTML = '<div class="asset-item"><div class="asset-sub">保存済みパッチはありません。</div></div>'; return; }
    names.sort().forEach(function(name){
      const patch = state.patches[name];
      const applyState = state.patchApplyState[name];
      const card = document.createElement('div');
      card.className = 'asset-item';
      card.innerHTML = '<div class="asset-head"><div><div class="asset-title">' + escapeHtml(name) + '</div><div class="asset-sub">diff ' + patch.diffs.length + 'セル / 基準: ' + escapeHtml(patch.baseName || '-') + ' / レイヤー: ' + escapeHtml(patch.layerName || '-') + '</div></div>' + (applyState && applyState.applied ? '<span class="badge ok">適用中</span>' : (state.currentPatchName === name ? '<span class="badge ok">選択中</span>' : '')) + '</div>';
      const tools = document.createElement('div');
      tools.className = 'inline-tools';
      const btnUse = makeMiniButton('選択', state.currentPatchName === name ? 'primary' : '');
      btnUse.addEventListener('click', function(){ state.currentPatchName = name; render(); });
      const btnApply = makeMiniButton('適用', '');
      btnApply.addEventListener('click', function(){ state.currentPatchName = name; applyPatch(name); });
      const btnRemove = makeMiniButton('解除', '');
      btnRemove.addEventListener('click', function(){ removePatch(name); });
      const btnDelete = makeMiniButton('削除', 'warn');
      btnDelete.addEventListener('click', function(){ delete state.patches[name]; delete state.patchApplyState[name]; if (state.currentPatchName === name) state.currentPatchName = ''; render(); });
      tools.append(btnUse, btnApply, btnRemove, btnDelete);
      card.appendChild(tools);
      els.patchList.appendChild(card);
    });
  }
  function renderResourceList(){
    els.resourceList.innerHTML = '';
    if (!state.resourceIndex.length){
      els.resourceList.innerHTML = '<div class="resource-item"><div class="resource-sub">解析済み resource はありません。</div></div>';
      return;
    }
    state.resourceIndex.forEach(function(item){
      const card = document.createElement('div');
      card.className = 'resource-item';
      card.innerHTML = '<div class="resource-head"><div><div class="resource-title">' + escapeHtml(item.resourceId || item.key) + '</div><div class="resource-sub">category=' + escapeHtml(item.category || '-') + ' / character=' + escapeHtml(item.character || '-') + ' / expression=' + escapeHtml(item.expression || '-') + '</div></div>' + (state.currentResourceKey === item.key ? '<span class="badge ok">選択中</span>' : '') + '</div>';
      const tools = document.createElement('div');
      tools.className = 'inline-tools';
      const btnUse = makeMiniButton('選択', state.currentResourceKey === item.key ? 'primary' : '');
      btnUse.addEventListener('click', function(){ state.currentResourceKey = item.key; render(); });
      const btnMeta = makeMiniButton('メタ反映', '');
      btnMeta.addEventListener('click', function(){ state.currentResourceKey = item.key; applyCurrentResourceMeta(); });
      const btnLoad = makeMiniButton('内容読込', '');
      btnLoad.addEventListener('click', function(){ state.currentResourceKey = item.key; loadCurrentResourceData(); });
      tools.append(btnUse, btnMeta, btnLoad);
      card.appendChild(tools);
      els.resourceList.appendChild(card);
    });
  }
  function renderTemplateOptions(){
    els.templateSelect.innerHTML = '';
    state.templates.forEach(function(tpl, index){
      const opt = document.createElement('option');
      opt.value = String(index);
      opt.textContent = tpl.name + ' (' + tpl.cols + 'x' + tpl.rows + ')';
      els.templateSelect.appendChild(opt);
    });
    renderTemplateList();
  }
  function renderTemplateList(){
    els.templateList.innerHTML = '';
    if (!state.templates.length){ els.templateList.innerHTML = '<div class="template-item"><div class="template-sub">テンプレートはありません。</div></div>'; return; }
    state.templates.forEach(function(tpl, index){
      const card = document.createElement('div');
      card.className = 'template-item';
      card.innerHTML = '<div class="template-head"><div><div class="template-title">' + escapeHtml(tpl.name || ('template-' + (index + 1))) + '</div><div class="template-sub">type=' + escapeHtml(tpl.type || '-') + ' / ' + tpl.cols + '×' + tpl.rows + '</div></div>' + (String(index) === els.templateSelect.value ? '<span class="badge ok">選択中</span>' : '') + '</div>';
      const tools = document.createElement('div');
      tools.className = 'inline-tools';
      const btnSel = makeMiniButton('選ぶ', String(index) === els.templateSelect.value ? 'primary' : '');
      btnSel.addEventListener('click', function(){ els.templateSelect.value = String(index); renderTemplateList(); });
      const btnApply = makeMiniButton('適用', '');
      btnApply.addEventListener('click', function(){ els.templateSelect.value = String(index); applySelectedTemplate(); });
      tools.append(btnSel, btnApply);
      card.appendChild(tools);
      els.templateList.appendChild(card);
    });
  }
  function makeMiniButton(text, cls){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = text;
    if (cls) btn.className = cls;
    return btn;
  }
  function render(){
    state.cols = clamp(parseInt(els.colsInput.value || state.cols, 10) || state.cols, 1, 1024);
    state.rows = clamp(parseInt(els.rowsInput.value || state.rows, 10) || state.rows, 1, 1024);
    state.cellSize = clamp(parseInt(els.cellSizeInput.value || state.cellSize, 10) || state.cellSize, 2, 60);
    state.exportScale = clamp(parseInt(els.exportScaleInput.value || state.exportScale, 10) || state.exportScale, 1, 200);
    ensureLayers();
    applyCanvasTheme();
    els.gridCanvas.width = state.cols * state.cellSize;
    els.gridCanvas.height = state.rows * state.cellSize;
    els.gridCanvas.style.width = els.gridCanvas.width + 'px';
    els.gridCanvas.style.height = els.gridCanvas.height + 'px';
    ctx.clearRect(0, 0, els.gridCanvas.width, els.gridCanvas.height);
    drawOverlay();
    drawVisibleLayers();
    drawGuides();
    drawSelectionAndPaste();
    drawGridLines();
    renderLayerList();
    renderPartList();
    renderPatchList();
    renderResourceList();
    renderTemplateList();
    updateStatus();
    updateCommandHighlight();
  }
  function fitCanvasToView(){
    const shell = els.canvasShell;
    const shellStyle = window.getComputedStyle(shell);
    const padX = (parseFloat(shellStyle.paddingLeft) || 0) + (parseFloat(shellStyle.paddingRight) || 0);
    const padY = (parseFloat(shellStyle.paddingTop) || 0) + (parseFloat(shellStyle.paddingBottom) || 0);
    const availableWidth = Math.max(120, shell.clientWidth - padX - 2);
    const availableHeight = Math.max(120, shell.clientHeight - padY - 2);
    const fitByWidth = Math.floor(availableWidth / Math.max(1, state.cols));
    const fitByHeight = Math.floor(availableHeight / Math.max(1, state.rows));
    els.cellSizeInput.value = String(clamp(Math.min(fitByWidth, fitByHeight), 2, 60));
    render();
    shell.scrollLeft = 0; shell.scrollTop = 0;
    setNotice('キャンバス全体が見やすいサイズにしました', 'accent');
  }
  function resizeCanvasPreserve(){
    readMetaFromInputs();
    const newCols = clamp(parseInt(els.colsInput.value || state.cols, 10) || state.cols, 1, 1024);
    const newRows = clamp(parseInt(els.rowsInput.value || state.rows, 10) || state.rows, 1, 1024);
    resizeAllLayers(newCols, newRows);
    state.cols = newCols;
    state.rows = newRows;
    clearSelection();
    state.pastePreview = null;
    render();
    setNotice('サイズを反映しました（既存内容は可能な範囲で保持）', 'success');
    logMessage('キャンバスサイズを ' + newCols + '×' + newRows + ' に反映', 'success');
  }
  function clearAllLayers(){
    state.layers.forEach(function(layer){ layer.cells = createEmptyCells(state.cols, state.rows); });
    state.selection = null; state.selectStart = null; state.pasteMode = false; state.pastePreview = null; state.panStart = null;
    render();
    setNotice('全レイヤーをクリアしました', 'success');
    logMessage('全レイヤーをクリアしました', 'success');
  }
  function rebuildProjectFresh(cols, rows){
    state.cols = cols; state.rows = rows;
    els.colsInput.value = String(cols); els.rowsInput.value = String(rows);
    state.layers = [createLayer('base')];
    state.currentLayerId = state.layers[0].id;
    state.selection = null; state.selectStart = null; state.copied = null; state.pasteMode = false; state.pastePreview = null;
    state.parts = {}; state.currentPartName = ''; state.patchBases = {}; state.patches = {}; state.currentPatchName = ''; state.patchApplyState = {};
    render();
  }
  function addLayer(name){
    const safe = sanitizeName(name, 'layer-' + (state.layers.length + 1));
    if (getLayerByName(safe)){ setNotice('同名レイヤーがあります', 'error'); return false; }
    const layer = createLayer(safe);
    state.layers.push(layer);
    state.currentLayerId = layer.id;
    render();
    setNotice('レイヤーを追加しました: ' + safe, 'success');
    return true;
  }
  function renameCurrentLayer(newName){
    const layer = getCurrentLayer();
    if (!layer) return false;
    const safe = sanitizeName(newName, layer.name);
    if (!safe) return false;
    if (state.layers.some(function(item){ return item.id !== layer.id && item.name === safe; })){
      setNotice('同名レイヤーがあります', 'error'); return false;
    }
    const oldName = layer.name;
    layer.name = safe;
    Object.keys(state.parts).forEach(function(name){ if (state.parts[name].layerName === oldName) state.parts[name].layerName = safe; });
    Object.keys(state.patchBases).forEach(function(name){ if (state.patchBases[name].layerName === oldName) state.patchBases[name].layerName = safe; });
    Object.keys(state.patches).forEach(function(name){ if (state.patches[name].layerName === oldName) state.patches[name].layerName = safe; });
    render();
    setNotice('レイヤー名を変更しました', 'success');
    return true;
  }
  function deleteCurrentLayer(){
    const layer = getCurrentLayer();
    if (!layer) return false;
    if (state.layers.length <= 1){ setNotice('最後の1枚は削除できません', 'error'); return false; }
    state.layers = state.layers.filter(function(item){ return item.id !== layer.id; });
    state.currentLayerId = state.layers[Math.max(0, state.layers.length - 1)].id;
    render();
    setNotice('レイヤーを削除しました', 'success');
    return true;
  }
  function moveLayer(layerId, direction){
    const index = state.layers.findIndex(function(layer){ return layer.id === layerId; });
    if (index === -1) return false;
    const next = direction > 0 ? index + 1 : index - 1;
    if (next < 0 || next >= state.layers.length) return false;
    const tmp = state.layers[index];
    state.layers[index] = state.layers[next];
    state.layers[next] = tmp;
    render();
    return true;
  }
  function savePart(name){
    const safe = sanitizeName(name, 'part');
    const sel = getNormalizedSelection();
    const layer = getCurrentLayer();
    if (!layer || !sel){ setNotice('先に範囲選択してください', 'error'); return false; }
    const cells = [];
    for (let y = sel.y1; y <= sel.y2; y++){
      const row = [];
      for (let x = sel.x1; x <= sel.x2; x++) row.push(layer.cells[y - 1][x - 1]);
      cells.push(row);
    }
    state.parts[safe] = { name:safe, width:sel.x2 - sel.x1 + 1, height:sel.y2 - sel.y1 + 1, cells:cells, layerName:layer.name, originX:sel.x1, originY:sel.y1 };
    state.currentPartName = safe;
    render();
    setNotice('パーツ保存: ' + safe, 'success');
    logMessage('パーツ保存: ' + safe, 'success');
    return true;
  }
  function stampPart(name, x, y, layer){
    const part = state.parts[name];
    const targetLayer = layer || getCurrentLayer();
    if (!part || !targetLayer) return false;
    if (targetLayer.locked){ setNotice('現在レイヤーはロック中です', 'error'); return false; }
    for (let yy = 0; yy < part.height; yy++){
      for (let xx = 0; xx < part.width; xx++){
        const color = part.cells[yy][xx];
        if (color == null) continue;
        setCell(targetLayer, x + xx, y + yy, color);
      }
    }
    state.selection = { x1:x, y1:y, x2:Math.min(state.cols, x + part.width - 1), y2:Math.min(state.rows, y + part.height - 1) };
    render();
    setNotice('stamp: ' + name, 'success');
    return true;
  }
  function stampSelectedPart(){
    const name = state.currentPartName || sanitizeName(els.partNameInput.value, 'part');
    const x = clamp(parseInt(els.stampXInput.value || '1', 10) || 1, 1, state.cols);
    const y = clamp(parseInt(els.stampYInput.value || '1', 10) || 1, 1, state.rows);
    if (!stampPart(name, x, y, getCurrentLayer())){ setNotice('パーツを貼れませんでした', 'error'); return false; }
    return true;
  }
  function savePatchBase(baseName){
    const safe = sanitizeName(baseName, 'neutral');
    const layer = getCurrentLayer();
    if (!layer){ setNotice('レイヤーがありません', 'error'); return false; }
    state.patchBases[safe] = { name:safe, layerId:layer.id, layerName:layer.name, cols:state.cols, rows:state.rows, cells:cloneCells(layer.cells) };
    els.patchBaseNameInput.value = safe;
    setNotice('基準保存: ' + safe, 'gold');
    logMessage('基準保存: ' + safe, 'success');
    return true;
  }
  function savePatch(name, baseName){
    const safe = sanitizeName(name, 'patch');
    const baseKey = sanitizeName(baseName, 'neutral');
    const layer = getCurrentLayer();
    const base = state.patchBases[baseKey];
    if (!layer){ setNotice('レイヤーがありません', 'error'); return false; }
    if (!base){ setNotice('比較基準がありません: ' + baseKey, 'error'); return false; }
    if (base.layerId !== layer.id && base.layerName !== layer.name){
      setNotice('基準と現在レイヤーが異なります', 'error'); return false;
    }
    const sel = getNormalizedSelection() || { x1:1, y1:1, x2:state.cols, y2:state.rows };
    const diffs = [];
    for (let y = sel.y1; y <= sel.y2; y++){
      for (let x = sel.x1; x <= sel.x2; x++){
        const current = layer.cells[y - 1][x - 1];
        const original = base.cells[y - 1] ? base.cells[y - 1][x - 1] : null;
        if (current !== original) diffs.push({ x:x - sel.x1, y:y - sel.y1, color:current });
      }
    }
    state.patches[safe] = {
      name:safe, baseName:baseKey, layerId:layer.id, layerName:layer.name,
      originX:sel.x1, originY:sel.y1, width:sel.x2 - sel.x1 + 1, height:sel.y2 - sel.y1 + 1, diffs:diffs
    };
    state.currentPatchName = safe;
    state.patchApplyState[safe] = { applied:false, undo:null };
    render();
    setNotice('差分パッチ保存: ' + safe + ' (' + diffs.length + 'セル)', 'success');
    logMessage('差分パッチ保存: ' + safe + ' / ' + diffs.length + 'セル', 'success');
    return true;
  }
  function applyPatch(name){
    const patch = state.patches[name];
    if (!patch){ setNotice('パッチがありません: ' + name, 'error'); return false; }
    const layer = getLayerById(patch.layerId) || getLayerByName(patch.layerName) || getCurrentLayer();
    if (!layer){ setNotice('対象レイヤーがありません', 'error'); return false; }
    if (layer.locked){ setNotice('対象レイヤーがロック中です', 'error'); return false; }
    const undo = [];
    patch.diffs.forEach(function(diff){
      const x = patch.originX + diff.x;
      const y = patch.originY + diff.y;
      if (x < 1 || y < 1 || x > state.cols || y > state.rows) return;
      undo.push({ x:x, y:y, prev:getCell(layer, x, y) });
      setCell(layer, x, y, diff.color == null ? null : diff.color);
    });
    state.patchApplyState[name] = { applied:true, undo:undo };
    state.currentPatchName = name;
    state.currentLayerId = layer.id;
    render();
    setNotice('パッチ適用: ' + name, 'success');
    logMessage('パッチ適用: ' + name, 'success');
    return true;
  }
  function removePatch(name){
    const patch = state.patches[name];
    const applyState = state.patchApplyState[name];
    if (!patch || !applyState || !applyState.applied || !Array.isArray(applyState.undo)){
      setNotice('解除できる適用履歴がありません', 'error'); return false;
    }
    const layer = getLayerById(patch.layerId) || getLayerByName(patch.layerName) || getCurrentLayer();
    if (!layer){ setNotice('対象レイヤーがありません', 'error'); return false; }
    if (layer.locked){ setNotice('対象レイヤーがロック中です', 'error'); return false; }
    applyState.undo.forEach(function(rec){ setCell(layer, rec.x, rec.y, rec.prev); });
    state.patchApplyState[name] = { applied:false, undo:null };
    render();
    setNotice('パッチ解除: ' + name, 'success');
    logMessage('パッチ解除: ' + name, 'success');
    return true;
  }
  function colorTokenToColor(token){
    const raw = String(token || '').trim();
    if (!raw) return null;
    if (/^\d+$/.test(raw)){
      const paletteNo = parseInt(raw, 10);
      const color = state.palette.get(paletteNo);
      if (color){ state.activePaletteNumber = paletteNo; state.activeColor = color; }
      return color;
    }
    const color = normalizeColor(raw);
    if (!color) return null;
    const ensured = ensurePaletteEntryForColor(color);
    if (ensured){
      state.activePaletteNumber = ensured.number;
      state.activeColor = ensured.color;
      return ensured.color;
    }
    state.activePaletteNumber = null;
    state.activeColor = color;
    return color;
  }
  function colorTokenToValue(token){
    if (token == null) return null;
    const raw = String(token).trim();
    if (!raw) return null;
    if (/^\d+$/.test(raw)) return colorTokenToColor(raw);
    const norm = normalizeColor(raw);
    if (norm) return norm;
    return raw;
  }
  function parseRangePart(text){
    const cleaned = normalizeCommand(text).replace(/\s+/g, '');
    const m = cleaned.match(/^(\d+)(?:\s*(?:-|~|to)\s*(\d+))?$/i);
    if (!m) return null;
    const a = parseInt(m[1], 10), b = m[2] ? parseInt(m[2], 10) : a;
    return [a,b];
  }
  function parseAxisRange(line, axisLetter){
    const reg = new RegExp(axisLetter + '\\s*[:=]?\\s*(\\d+(?:\\s*(?:-|~|to)\\s*\\d+)?)', 'i');
    const m = line.match(reg);
    return m ? parseRangePart(m[1]) : null;
  }
  function parseField(line, key){
    const reg = new RegExp(key + '\\s*[:=]\\s*([^\\s,]+)', 'i');
    const m = line.match(reg);
    return m ? m[1] : null;
  }
  function parseArrowRename(text){
    const m = text.match(/rename\s+(.+?)\s*->\s*(.+)$/i);
    if (!m) return null;
    return [m[1].trim(), m[2].trim()];
  }
  function parseColorReference(line){
    const hex = line.match(/#[0-9a-f]{3,8}\b/i);
    if (hex) return { type:'color', value: normalizeColor(hex[0]) };
    const explicitNo = line.match(/(?:color|色|c)\s*[:=]?\s*(\d+)\b/i);
    if (explicitNo) return { type:'palette', value: parseInt(explicitNo[1], 10) };
    const explicitHex = line.match(/(?:color|色|c)\s*[:=]?\s*(#[0-9a-f]{3,8}|[a-z]+)\b/i);
    if (explicitHex){
      const color = normalizeColor(explicitHex[1]);
      if (color) return { type:'color', value: color };
    }
    let rest = line;
    ['x','y','x1','y1','x2','y2','from','to','layer'].forEach(function(key){
      rest = rest.replace(new RegExp(key + '\\s*[:=]?\\s*[^\\s,]+', 'ig'), ' ');
    });
    rest = rest.replace(/塗る|ぬる|paint|fill|を|で|へ|,|:/gi, ' ');
    const nums = rest.match(/\b\d+\b/g);
    if (nums && nums.length) return { type:'palette', value: parseInt(nums[nums.length - 1], 10) };
    return null;
  }
  function plotLine(layer, x1, y1, x2, y2, color){
    let dx = Math.abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
    let dy = -Math.abs(y2 - y1), sy = y1 < y2 ? 1 : -1;
    let err = dx + dy;
    while (true){
      setCell(layer, x1, y1, color);
      if (x1 === x2 && y1 === y2) break;
      const e2 = 2 * err;
      if (e2 >= dy){ err += dy; x1 += sx; }
      if (e2 <= dx){ err += dx; y1 += sy; }
    }
  }
  function replaceColors(layer, xRange, yRange, fromColor, toColor){
    const minX = Math.max(1, Math.min(xRange[0], xRange[1]));
    const maxX = Math.min(state.cols, Math.max(xRange[0], xRange[1]));
    const minY = Math.max(1, Math.min(yRange[0], yRange[1]));
    const maxY = Math.min(state.rows, Math.max(yRange[0], yRange[1]));
    for (let y = minY; y <= maxY; y++){
      for (let x = minX; x <= maxX; x++){
        if (layer.cells[y - 1][x - 1] === fromColor) layer.cells[y - 1][x - 1] = toColor;
      }
    }
  }
  function executeCommand(rawLine){
    const original = String(rawLine || '');
    const line = normalizeCommand(original);
    if (!line) return { ok:true };
    readMetaFromInputs();

    const paletteAssign = line.match(/^(\d+)\s*(?:=|:|->|=>|\s)\s*(#[0-9a-f]{3,8}|[a-z]+)$/i);
    if (paletteAssign){
      const no = parseInt(paletteAssign[1], 10);
      const color = normalizeColor(paletteAssign[2]);
      if (!color) return { ok:false, message:'色コードが不正: ' + paletteAssign[2] };
      state.palette.set(no, color);
      if (!state.activeColor){ state.activeColor = color; state.activePaletteNumber = no; }
      renderPaletteGrid();
      return { ok:true };
    }

    if (/^(?:左右反転|flip ?h|flip ?horizontal|hflip)$/i.test(line)){
      if (!flipHorizontal()) return { ok:false, message:'左右反転するには先に範囲選択してください' };
      return { ok:true };
    }
    if (/^(?:上下反転|flip ?v|flip ?vertical|vflip)$/i.test(line)){
      if (!flipVertical()) return { ok:false, message:'上下反転するには先に範囲選択してください' };
      return { ok:true };
    }
    if (/^(?:選択解除|clear ?selection|selection ?clear|unselect)$/i.test(line)){
      clearSelection();
      return { ok:true };
    }
    if (/^(?:clear|clr|クリア|全消去|キャンバスクリア|canvas ?clear)$/i.test(line)){
      clearAllLayers();
      return { ok:true };
    }

    if (/^(?:meta)\b/i.test(line)){
      const rest = line.replace(/^meta\s*/i, '');
      const pairs = rest.split(/\s+/).filter(Boolean);
      const obj = {};
      pairs.forEach(function(pair){
        const idx = pair.indexOf('=');
        if (idx > -1){
          const key = pair.slice(0, idx).trim();
          const value = pair.slice(idx + 1).trim();
          if (key) obj[key] = value;
        }
      });
      setMetaFields(obj);
      return { ok:true };
    }

    if (/^(?:layer)\b/i.test(line)){
      const layer = getCurrentLayer();
      if (/^layer\s+add\b/i.test(line)){
        const name = line.replace(/^layer\s+add\s*/i, '').trim();
        if (!name) return { ok:false, message:'layer add は名前が必要です' };
        return addLayer(name) ? { ok:true } : { ok:false, message:'レイヤー追加に失敗しました' };
      }
      if (/^layer\s+use\b/i.test(line)){
        const name = line.replace(/^layer\s+use\s*/i, '').trim();
        return setCurrentLayerByName(name) ? { ok:true } : { ok:false, message:'レイヤーが見つかりません: ' + name };
      }
      if (/^layer\s+hide\b/i.test(line)){
        const name = line.replace(/^layer\s+hide\s*/i, '').trim();
        const target = getLayerByNameOrId(name);
        if (!target) return { ok:false, message:'レイヤーが見つかりません: ' + name };
        target.visible = false; render(); return { ok:true };
      }
      if (/^layer\s+show\b/i.test(line)){
        const name = line.replace(/^layer\s+show\s*/i, '').trim();
        const target = getLayerByNameOrId(name);
        if (!target) return { ok:false, message:'レイヤーが見つかりません: ' + name };
        target.visible = true; render(); return { ok:true };
      }
      if (/^layer\s+lock\b/i.test(line)){
        const name = line.replace(/^layer\s+lock\s*/i, '').trim();
        const target = getLayerByNameOrId(name);
        if (!target) return { ok:false, message:'レイヤーが見つかりません: ' + name };
        target.locked = true; render(); return { ok:true };
      }
      if (/^layer\s+unlock\b/i.test(line)){
        const name = line.replace(/^layer\s+unlock\s*/i, '').trim();
        const target = getLayerByNameOrId(name);
        if (!target) return { ok:false, message:'レイヤーが見つかりません: ' + name };
        target.locked = false; render(); return { ok:true };
      }
      if (/^layer\s+rename\b/i.test(line)){
        const arrow = parseArrowRename(line);
        if (arrow){
          const target = getLayerByNameOrId(arrow[0]);
          if (!target) return { ok:false, message:'レイヤーが見つかりません: ' + arrow[0] };
          const prev = state.currentLayerId;
          state.currentLayerId = target.id;
          const renamed = renameCurrentLayer(arrow[1]);
          state.currentLayerId = prev === target.id ? target.id : state.currentLayerId;
          return renamed ? { ok:true } : { ok:false, message:'rename 失敗' };
        }
        return { ok:false, message:'layer rename old -> new の形式で書いてください' };
      }
      if (/^layer\s+delete\b/i.test(line)){
        const name = line.replace(/^layer\s+delete\s*/i, '').trim();
        const target = getLayerByNameOrId(name);
        if (!target) return { ok:false, message:'レイヤーが見つかりません: ' + name };
        state.currentLayerId = target.id;
        return deleteCurrentLayer() ? { ok:true } : { ok:false, message:'削除できませんでした' };
      }
      if (/^layer\s+up\b/i.test(line)){
        const name = line.replace(/^layer\s+up\s*/i, '').trim();
        const target = getLayerByNameOrId(name);
        if (!target) return { ok:false, message:'レイヤーが見つかりません: ' + name };
        return moveLayer(target.id, 1) ? { ok:true } : { ok:false, message:'これ以上上へ動かせません' };
      }
      if (/^layer\s+down\b/i.test(line)){
        const name = line.replace(/^layer\s+down\s*/i, '').trim();
        const target = getLayerByNameOrId(name);
        if (!target) return { ok:false, message:'レイヤーが見つかりません: ' + name };
        return moveLayer(target.id, -1) ? { ok:true } : { ok:false, message:'これ以上下へ動かせません' };
      }
      if (!layer) return { ok:false, message:'レイヤーがありません' };
    }

    if (/^(?:part)\b/i.test(line)){
      if (/^part\s+save\b/i.test(line)){
        const name = line.replace(/^part\s+save\s*/i, '').trim();
        return savePart(name) ? { ok:true } : { ok:false, message:'part save に失敗しました' };
      }
      if (/^part\s+delete\b/i.test(line)){
        const name = line.replace(/^part\s+delete\s*/i, '').trim();
        if (!state.parts[name]) return { ok:false, message:'パーツが見つかりません: ' + name };
        delete state.parts[name];
        if (state.currentPartName === name) state.currentPartName = '';
        render();
        return { ok:true };
      }
      return { ok:false, message:'未対応の part 命令です' };
    }

    if (/^(?:stamp)\b/i.test(line)){
      const rest = line.replace(/^stamp\s+/i, '');
      const nameMatch = rest.match(/^([^\s]+)/);
      const name = nameMatch ? nameMatch[1] : '';
      const xRange = parseAxisRange(line, 'x');
      const yRange = parseAxisRange(line, 'y');
      if (!name || !xRange || !yRange) return { ok:false, message:'stamp name x=.. y=.. が必要です' };
      return stampPart(name, xRange[0], yRange[0], getCurrentLayer()) ? { ok:true } : { ok:false, message:'stamp に失敗しました' };
    }

    if (/^(?:patch)\b/i.test(line)){
      if (/^patch\s+base\b/i.test(line)){
        const name = line.replace(/^patch\s+base\s*/i, '').trim() || 'neutral';
        return savePatchBase(name) ? { ok:true } : { ok:false, message:'patch base 保存に失敗しました' };
      }
      if (/^patch\s+save\b/i.test(line)){
        const m = line.match(/^patch\s+save\s+([^\s]+)(?:\s+from\s+([^\s]+))?$/i);
        if (!m) return { ok:false, message:'patch save name [from base] の形式で書いてください' };
        return savePatch(m[1], m[2] || els.patchBaseNameInput.value || 'neutral') ? { ok:true } : { ok:false, message:'patch save に失敗しました' };
      }
      if (/^patch\s+apply\b/i.test(line)){
        const name = line.replace(/^patch\s+apply\s*/i, '').trim();
        return applyPatch(name) ? { ok:true } : { ok:false, message:'patch apply に失敗しました' };
      }
      if (/^patch\s+(?:remove|off|unapply)\b/i.test(line)){
        const name = line.replace(/^patch\s+(?:remove|off|unapply)\s*/i, '').trim();
        return removePatch(name) ? { ok:true } : { ok:false, message:'patch remove に失敗しました' };
      }
      if (/^patch\s+delete\b/i.test(line)){
        const name = line.replace(/^patch\s+delete\s*/i, '').trim();
        if (!state.patches[name]) return { ok:false, message:'パッチが見つかりません: ' + name };
        delete state.patches[name]; delete state.patchApplyState[name]; if (state.currentPatchName === name) state.currentPatchName = '';
        render();
        return { ok:true };
      }
      return { ok:false, message:'未対応の patch 命令です' };
    }

    if (/^(?:copy|コピー)\b/i.test(line)){
      const xRange = parseAxisRange(line, 'x'), yRange = parseAxisRange(line, 'y');
      if (!xRange || !yRange) return { ok:false, message:'copy は x と y の範囲指定が必要です' };
      state.selection = { x1:Math.min(xRange[0], xRange[1]), x2:Math.max(xRange[0], xRange[1]), y1:Math.min(yRange[0], yRange[1]), y2:Math.max(yRange[0], yRange[1]) };
      if (!copySelection()) return { ok:false, message:'コピーできませんでした' };
      return { ok:true };
    }
    if (/^(?:paste|ペースト|貼り付け|貼付)\b/i.test(line)){
      const xRange = parseAxisRange(line, 'x'), yRange = parseAxisRange(line, 'y');
      if (!xRange || !yRange) return { ok:false, message:'paste は x と y の開始位置が必要です' };
      if (!state.copied) return { ok:false, message:'コピー済みデータがありません' };
      pasteAt(xRange[0], yRange[0], getCurrentLayer());
      return { ok:true };
    }

    const currentLayer = getCurrentLayer();
    if (!currentLayer) return { ok:false, message:'レイヤーがありません' };

    if (/^(?:dot)\b/i.test(line)){
      const x = parseAxisRange(line, 'x');
      const y = parseAxisRange(line, 'y');
      const colorToken = parseField(line, 'color') || parseField(line, 'c');
      if (!x || !y || !colorToken) return { ok:false, message:'dot x=.. y=.. color=.. が必要です' };
      const color = colorTokenToColor(colorToken);
      if (color == null) return { ok:false, message:'dot の色を解釈できません: ' + colorToken };
      setCell(currentLayer, x[0], y[0], color);
      return { ok:true };
    }
    if (/^(?:dots)\b/i.test(line)){
      const tuples = line.match(/\(([^)]+)\)/g);
      if (!tuples || !tuples.length) return { ok:false, message:'dots は (x,y,color) を並べてください' };
      tuples.forEach(function(tuple){
        const parts = tuple.replace(/[()]/g, '').split(',').map(function(v){ return v.trim(); });
        if (parts.length < 3) return;
        const x = parseInt(parts[0], 10), y = parseInt(parts[1], 10), color = colorTokenToColor(parts[2]);
        if (!Number.isNaN(x) && !Number.isNaN(y) && color != null) setCell(currentLayer, x, y, color);
      });
      return { ok:true };
    }
    if (/^(?:line)\b/i.test(line)){
      const x1 = parseField(line, 'x1'), y1 = parseField(line, 'y1'), x2 = parseField(line, 'x2'), y2 = parseField(line, 'y2');
      const colorToken = parseField(line, 'color') || parseField(line, 'c');
      if ([x1,y1,x2,y2,colorToken].some(function(v){ return v == null; })) return { ok:false, message:'line x1=.. y1=.. x2=.. y2=.. color=.. が必要です' };
      const color = colorTokenToColor(colorToken);
      if (color == null) return { ok:false, message:'line の色を解釈できません' };
      plotLine(currentLayer, parseInt(x1,10), parseInt(y1,10), parseInt(x2,10), parseInt(y2,10), color);
      return { ok:true };
    }
    if (/^(?:replace)\b/i.test(line)){
      const xRange = parseAxisRange(line, 'x') || [1, state.cols];
      const yRange = parseAxisRange(line, 'y') || [1, state.rows];
      const fromToken = parseField(line, 'from');
      const toToken = parseField(line, 'to');
      if (fromToken == null || toToken == null) return { ok:false, message:'replace は from=.. to=.. が必要です' };
      const fromColor = colorTokenToColor(fromToken);
      const toColor = colorTokenToColor(toToken);
      if (fromColor == null || toColor == null) return { ok:false, message:'replace の色を解釈できません' };
      replaceColors(currentLayer, xRange, yRange, fromColor, toColor);
      return { ok:true };
    }

    const xRange = parseAxisRange(line, 'x');
    const yRange = parseAxisRange(line, 'y');
    if (!xRange || !yRange) return { ok:false, message:'命令を解釈できません: ' + original };

    if (/(?:erase|delete|clear|消す|削除|消去)/i.test(line)){
      fillRangeOnLayer(currentLayer, xRange[0], xRange[1], yRange[0], yRange[1], null);
      return { ok:true };
    }
    const colorRef = parseColorReference(line);
    if (!colorRef) return { ok:false, message:'色指定を解釈できません: ' + original };
    let color = null;
    if (colorRef.type === 'color'){
      const ensured = ensurePaletteEntryForColor(colorRef.value);
      color = ensured ? ensured.color : normalizeColor(colorRef.value);
      if (!color) return { ok:false, message:'色コードを解釈できません: ' + colorRef.value };
      if (ensured){
        state.activePaletteNumber = ensured.number;
        state.activeColor = ensured.color;
      } else {
        state.activePaletteNumber = null;
        state.activeColor = color;
      }
    } else {
      color = state.palette.get(colorRef.value);
      if (!color) return { ok:false, message:'色番号 ' + colorRef.value + ' が未登録です' };
      state.activePaletteNumber = colorRef.value;
      state.activeColor = color;
    }
    fillRangeOnLayer(currentLayer, xRange[0], xRange[1], yRange[0], yRange[1], color);
    return { ok:true };
  }
  function runCommands(){
    applyPaletteFromTextarea();
    state.commandAutoPaletteAdds = [];
    const hasCommands = els.commandInput.value.split(/\r?\n/).some(function(line){ return String(line).trim(); });
    if (hasCommands) pushHistory('command');
    state.commandErrorLines = new Set();
    const lines = els.commandInput.value.split(/\r?\n/);
    const failed = [];
    let executed = 0;
    lines.forEach(function(line, index){
      if (!String(line).trim()) return;
      try {
        const result = executeCommand(line);
        if (!result.ok){
          failed.push({ line:index + 1, message: result.message || '不明なエラー' });
        } else {
          executed++;
        }
      } catch (error){
        failed.push({ line:index + 1, message: String(error && error.message ? error.message : error) });
      }
    });
    state.commandErrorLines = new Set(failed.map(function(item){ return item.line; }));
    if (state.commandAutoPaletteAdds && state.commandAutoPaletteAdds.length){
      syncPaletteTextareaFromState();
      renderPaletteGrid();
    }
    render();
    if (failed.length){
      const msg = '一部エラー: ' + failed[0].line + '行目 / ' + failed[0].message;
      setNotice(msg, 'error');
      logMessage(msg, 'error');
      const detail = failed.map(function(item){ return '・' + item.line + '行目: ' + item.message; }).join('\n');
      alert('一部の行でエラー\n\n' + detail);
      return;
    }
    if (state.commandAutoPaletteAdds && state.commandAutoPaletteAdds.length){
      const addedMsg = '自動追加: ' + state.commandAutoPaletteAdds.join(', ');
      setNotice(executed + '行を実行しました / ' + addedMsg, 'success');
      logMessage(executed + '行を実行しました / ' + addedMsg, 'success');
      return;
    }
    setNotice(executed + '行を実行しました', 'success');
    logMessage(executed + '行を実行しました', 'success');
  }

  function getCompositeCanvas(scale){
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = state.cols * scale; exportCanvas.height = state.rows * scale;
    const exportCtx = exportCanvas.getContext('2d', { alpha:true, willReadFrequently:true });
    exportCtx.clearRect(0,0,exportCanvas.width, exportCanvas.height);
    state.layers.forEach(function(layer){
      if (!layer.visible) return;
      for (let y = 0; y < state.rows; y++){
        for (let x = 0; x < state.cols; x++){
          const color = layer.cells[y][x];
          if (color){ exportCtx.fillStyle = color; exportCtx.fillRect(x * scale, y * scale, scale, scale); }
        }
      }
    });
    return exportCanvas;
  }
  function uint16Bytes(value){ return [(value >> 8) & 255, value & 255]; }
  function uint32Bytes(value){ return [(value >>> 24)&255,(value>>>16)&255,(value>>>8)&255,value&255]; }
  function stringBytes(str){ return Array.from(str).map(function(ch){ return ch.charCodeAt(0) & 255; }); }
  function buildMinimalPsdBytes(exportCanvas){
    const width = exportCanvas.width, height = exportCanvas.height;
    const exportCtx = exportCanvas.getContext('2d', { willReadFrequently:true });
    const imageData = exportCtx.getImageData(0,0,width,height).data;
    const pixelCount = width * height, channels = 4;
    const channelBytes = new Uint8Array(pixelCount * channels);
    let rOff = 0, gOff = pixelCount, bOff = pixelCount * 2, aOff = pixelCount * 3;
    for (let i = 0, p = 0; i < imageData.length; i += 4, p++){
      channelBytes[rOff + p] = imageData[i];
      channelBytes[gOff + p] = imageData[i + 1];
      channelBytes[bOff + p] = imageData[i + 2];
      channelBytes[aOff + p] = imageData[i + 3];
    }
    const bytes = [];
    bytes.push.apply(bytes, stringBytes('8BPS'));
    bytes.push.apply(bytes, uint16Bytes(1));
    bytes.push(0,0,0,0,0,0);
    bytes.push.apply(bytes, uint16Bytes(channels));
    bytes.push.apply(bytes, uint32Bytes(height));
    bytes.push.apply(bytes, uint32Bytes(width));
    bytes.push.apply(bytes, uint16Bytes(8));
    bytes.push.apply(bytes, uint16Bytes(3));
    bytes.push.apply(bytes, uint32Bytes(0));
    bytes.push.apply(bytes, uint32Bytes(0));
    bytes.push.apply(bytes, uint32Bytes(0));
    bytes.push.apply(bytes, uint16Bytes(0));
    const header = new Uint8Array(bytes);
    const out = new Uint8Array(header.length + channelBytes.length);
    out.set(header, 0); out.set(channelBytes, header.length);
    return out;
  }
  function uint8ToBase64(uint8){
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < uint8.length; i += chunk){
      const part = uint8.subarray(i, Math.min(i + chunk, uint8.length));
      binary += String.fromCharCode.apply(null, part);
    }
    return btoa(binary);
  }
  function fileBaseName(){
    const raw = String(els.fileNameInput.value || 'pixel-art').trim() || 'pixel-art';
    return raw.replace(/[\\/:*?"<>|]/g, '_');
  }
  function getJsonSaveFileName(){
    const loaded = String(state.lastJsonFileName || '').trim();
    if (loaded) return sanitizeFileName(/\.json$/i.test(loaded) ? loaded : (loaded + '.json'));
    return sanitizeFileName(fileBaseName() + '.json');
  }

  function downloadBlob(blob, filename){
    const url = URL.createObjectURL(blob);
    downloadAnchor.href = url;
    downloadAnchor.download = filename;
    downloadAnchor.click();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1200);
  }
  function queueNative(action, payload){
    window.__nativeQueue = window.__nativeQueue || [];
    window.__nativeQueue.push({ action: action, payload: payload || null });
    try {
      location.href = 'scriptable:///bridge?action=' + encodeURIComponent(action) + '&t=' + Date.now();
    } catch (error) {
      logMessage('bridge 呼び出しに失敗: ' + String(error), 'error');
    }
  }
  function requestSave(kind){
    try {
      readMetaFromInputs();
      const name = fileBaseName();
      const exportCanvas = getCompositeCanvas(state.exportScale);
      const canUseNativeBridge = !!(window.__SCRIPTABLE_NATIVE__ && window.appBridge && window.appBridge.popNativeMessage);
      if (kind === 'png'){
        const dataUrl = exportCanvas.toDataURL('image/png');
        if (canUseNativeBridge){
          queueNative('save-file', { kind:'png', fileName:name + '.png', base64:dataUrl.split(',')[1] });
        } else {
          downloadBlob(dataURIToBlob(dataUrl), name + '.png');
        }
        setNotice(canUseNativeBridge ? 'PNG保存を送信しました' : 'PNGをダウンロード保存します', 'accent');
        return;
      }
      if (kind === 'psd'){
        const psdBase64 = uint8ToBase64(buildMinimalPsdBytes(exportCanvas));
        if (canUseNativeBridge){
          queueNative('save-file', { kind:'psd', fileName:name + '.psd', base64:psdBase64 });
        } else {
          downloadBlob(new Blob([Uint8Array.from(atob(psdBase64), function(ch){ return ch.charCodeAt(0); })], { type:'application/octet-stream' }), name + '.psd');
        }
        setNotice(canUseNativeBridge ? 'PSD保存を送信しました' : 'PSDをダウンロード保存します', 'accent');
        return;
      }
      if (kind === 'json'){
        const json = JSON.stringify(exportProjectData(), null, 2);
        const jsonFileName = getJsonSaveFileName();
        if (canUseNativeBridge){
          queueNative('save-json-file', { fileName:jsonFileName, base64:utf8ToBase64(json) });
        } else {
          downloadBlob(new Blob([json], { type:'application/json' }), jsonFileName);
        }
        setNotice(canUseNativeBridge ? 'JSON保存ダイアログを開きます' : 'JSONをダウンロード保存します', 'gold');
        return;
      }
      const pngDataUrl = exportCanvas.toDataURL('image/png');
      const psdBase64 = uint8ToBase64(buildMinimalPsdBytes(exportCanvas));
      if (canUseNativeBridge){
        queueNative('save-both', { baseName:name, files:[
          { kind:'png', fileName:name + '.png', base64:pngDataUrl.split(',')[1] },
          { kind:'psd', fileName:name + '.psd', base64:psdBase64 }
        ]});
      } else {
        downloadBlob(dataURIToBlob(pngDataUrl), name + '.png');
        downloadBlob(new Blob([Uint8Array.from(atob(psdBase64), function(ch){ return ch.charCodeAt(0); })], { type:'application/octet-stream' }), name + '.psd');
      }
      setNotice(canUseNativeBridge ? 'PNG+PSD保存を送信しました' : 'PNG+PSDをダウンロード保存します', 'accent');
    } catch (error) {
      const message = '保存準備でエラー: ' + String(error && error.message ? error.message : error);
      setNotice(message, 'error');
      logMessage(message, 'error');
    }
  }
  function dataURIToBlob(dataURI){
    const parts = dataURI.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const bin = atob(parts[1]);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type:mime });
  }
  function exportProjectData(){
    readMetaFromInputs();
    return {
      version: 2,
      app: 'Pixel Command Painter Pro',
      cols: state.cols,
      rows: state.rows,
      cellSize: state.cellSize,
      exportScale: state.exportScale,
      canvasTheme: state.canvasTheme,
      fileName: els.fileNameInput.value,
      palette: mapToObject(state.palette),
      activePaletteNumber: state.activePaletteNumber,
      activeColor: state.activeColor,
      layers: state.layers.map(function(layer){
        return { id:layer.id, name:layer.name, visible:layer.visible, locked:layer.locked, cells:cloneCells(layer.cells) };
      }),
      currentLayerId: state.currentLayerId,
      parts: JSON.parse(JSON.stringify(state.parts)),
      patchBases: JSON.parse(JSON.stringify(state.patchBases)),
      patches: JSON.parse(JSON.stringify(state.patches)),
      patchApplyState: JSON.parse(JSON.stringify(state.patchApplyState)),
      meta: Object.assign({}, state.meta),
      templates: JSON.parse(JSON.stringify(state.templates)),
      guides: Object.assign({}, state.guides),
      resourceIndex: JSON.parse(JSON.stringify(state.resourceIndex)),
      currentResourceKey: state.currentResourceKey,
      overlay: {
        visible: state.overlay.visible,
        opacity: state.overlay.opacity,
        scale: state.overlay.scale,
        offsetX: state.overlay.offsetX,
        offsetY: state.overlay.offsetY,
        name: state.overlay.name || '',
        dataUrl: state.overlay.image ? (state.overlay.image.src || '') : ''
      }
    };
  }
  function exportJsonToTextarea(){
    const json = JSON.stringify(exportProjectData(), null, 2);
    els.jsonInput.value = json;
    setNotice('JSON欄へ書き出しました', 'gold');
    logMessage('JSON欄へ書き出しました', 'success');
  }
  function importProjectData(data){
    if (!data || typeof data !== 'object') throw new Error('JSONオブジェクトではありません');
    if (!data.cols || !data.rows) throw new Error('cols / rows がありません');
    state.cols = clamp(parseInt(data.cols, 10) || 32, 1, 1024);
    state.rows = clamp(parseInt(data.rows, 10) || 32, 1, 1024);
    els.colsInput.value = String(state.cols);
    els.rowsInput.value = String(state.rows);
    els.cellSizeInput.value = String(clamp(parseInt(data.cellSize || state.cellSize, 10) || 18, 2, 60));
    els.exportScaleInput.value = String(clamp(parseInt(data.exportScale || state.exportScale, 10) || 16, 1, 200));
    state.canvasTheme = data.canvasTheme === 'light' ? 'light' : 'dark';
    if (els.canvasThemeSelect) els.canvasThemeSelect.value = state.canvasTheme;
    els.fileNameInput.value = data.fileName || els.fileNameInput.value;
    state.palette = objectToMap(data.palette || {});
    if (!state.palette.size) state.palette = objectToMap({1:'#0000',2:'#000000'});
    syncPaletteTextareaFromState();
    state.activePaletteNumber = data.activePaletteNumber != null ? data.activePaletteNumber : Array.from(state.palette.keys())[0];
    state.activeColor = data.activeColor || state.palette.get(state.activePaletteNumber) || '#0000';
    state.layers = Array.isArray(data.layers) && data.layers.length ? data.layers.map(function(layer, index){
      return {
        id: layer.id || uid('layer'),
        name: sanitizeName(layer.name, 'layer-' + (index + 1)),
        visible: layer.visible !== false,
        locked: !!layer.locked,
        cells: resizeCellsPreserve(Array.isArray(layer.cells) ? layer.cells : createEmptyCells(state.cols, state.rows), state.cols, state.rows)
      };
    }) : [createLayer('base')];
    state.currentLayerId = data.currentLayerId && getLayerById(data.currentLayerId) ? data.currentLayerId : state.layers[0].id;
    state.parts = data.parts && typeof data.parts === 'object' ? data.parts : {};
    state.patchBases = data.patchBases && typeof data.patchBases === 'object' ? data.patchBases : {};
    state.patches = data.patches && typeof data.patches === 'object' ? data.patches : {};
    state.patchApplyState = data.patchApplyState && typeof data.patchApplyState === 'object' ? data.patchApplyState : {};
    state.meta = Object.assign({ project:'', category:'', resourceId:'', character:'', expression:'', variant:'', note:'' }, data.meta || {});
    writeMetaToInputs();
    state.templates = Array.isArray(data.templates) && data.templates.length ? data.templates : state.templates;
    els.templateJsonInput.value = JSON.stringify(state.templates, null, 2);
    state.guides = Object.assign({ center:true, face:false, heads:false, headsCount:8 }, data.guides || {});
    els.headsCountInput.value = String(state.guides.headsCount || 8);
    state.resourceIndex = Array.isArray(data.resourceIndex) ? data.resourceIndex : [];
    state.currentResourceKey = data.currentResourceKey || '';
    const overlay = data.overlay || {};
    state.overlay.visible = !!overlay.visible;
    state.overlay.opacity = typeof overlay.opacity === 'number' ? overlay.opacity : 0.35;
    state.overlay.scale = Number(overlay.scale || 1);
    state.overlay.offsetX = Number(overlay.offsetX || 0);
    state.overlay.offsetY = Number(overlay.offsetY || 0);
    state.overlay.name = overlay.name || '';
    els.overlayOpacityInput.value = String(Math.round(state.overlay.opacity * 100));
    els.overlayScaleInput.value = String(state.overlay.scale);
    els.overlayOffsetXInput.value = String(state.overlay.offsetX);
    els.overlayOffsetYInput.value = String(state.overlay.offsetY);
    if (overlay.dataUrl){
      loadOverlayFromDataUrl(overlay.dataUrl, overlay.name || 'overlay');
    } else {
      state.overlay.image = null;
    }
    renderPaletteGrid();
    renderTemplateOptions();
    render();
  }
  function importJsonText(text, fileName){
    const sourceText = String(text || '').trim();
    if (!sourceText){
      setNotice('JSONファイルが空です', 'error');
      return;
    }
    if (state.isImportingJson) return;
    state.isImportingJson = true;
    setNotice('JSONファイルを読み込み中です…', 'accent');
    window.setTimeout(function(){
      try {
        const data = JSON.parse(sourceText);
        importProjectData(data);
        state.lastJsonFileName = String(fileName || '').trim() || 'selected.json';
        if (els.fileNameInput && (!String(els.fileNameInput.value || '').trim() || String(els.fileNameInput.value).trim() === 'pixel-art-pro')) {
          els.fileNameInput.value = state.lastJsonFileName.replace(/\.json$/i, '');
        }
        updateJsonFilePill();
        setNotice('JSONファイルを読み込みました', 'success');
        logMessage('JSONファイルを読み込みました: ' + state.lastJsonFileName, 'success');
      } catch (error){
        setNotice('JSON読込失敗: ' + String(error.message || error), 'error');
        logMessage('JSON読込失敗: ' + String(error.message || error), 'error');
      } finally {
        state.isImportingJson = false;
      }
    }, 30);
  }
  function requestJsonFilePick(){
    queueNative('pick-json-file', {});
    setNotice('JSONファイルを選択してください', 'accent');
  }
  function parseObjectLikeText(text){
    const src = String(text || '').trim();
    if (!src) return null;
    try { return JSON.parse(src); } catch (error) {}
    try {
      const stripped = src
        .replace(/^\s*(?:const|let|var)\s+[A-Za-z0-9_$]+\s*=\s*/, '')
        .replace(/^\s*window\.[A-Za-z0-9_$]+\s*=\s*/, '')
        .replace(/;\s*$/, '');
      return Function('"use strict"; return (' + stripped + ');')();
    } catch (error) {}
    return null;
  }
  function looksLikeResourceLeaf(node){
    if (!node || typeof node !== 'object' || Array.isArray(node)) return true;
    const keys = Object.keys(node);
    return keys.some(function(key){
      return ['resourceId','meta','layers','grid','cells','commands','palette','cols','rows','width','height'].indexOf(key) !== -1;
    });
  }
  function collectResourceEntries(root){
    const out = [];
    if (!root || typeof root !== 'object') return out;
    Object.keys(root).forEach(function(categoryKey){
      walkResourceNode(root[categoryKey], categoryKey, [], out);
    });
    return out;
  }
  function walkResourceNode(node, topCategory, path, out){
    if (node == null) return;
    if (typeof node !== 'object' || Array.isArray(node) || looksLikeResourceLeaf(node)){
      const lastKey = path[path.length - 1] || topCategory;
      const character = topCategory === 'characters' ? (path[0] || (node && node.character) || '') : ((node && node.character) || '');
      const expression = topCategory === 'characters' ? ((node && node.expression) || path[path.length - 1] || '') : ((node && node.expression) || '');
      const resourceId = node && node.resourceId ? node.resourceId : lastKey;
      out.push({
        key: topCategory + ':' + path.join('/'),
        category: (node && node.category) || topCategory,
        resourceId: resourceId,
        character: character,
        expression: expression,
        variant: node && node.variant ? node.variant : '',
        note: node && node.note ? node.note : '',
        raw: node,
        path: [topCategory].concat(path)
      });
      return;
    }
    Object.keys(node).forEach(function(key){ walkResourceNode(node[key], topCategory, path.concat(key), out); });
  }
  function parseResourceMapInput(){
    const obj = parseObjectLikeText(els.resourceMapInput.value);
    if (!obj){ setNotice('resourceMap を解析できませんでした', 'error'); logMessage('resourceMap 解析失敗', 'error'); return false; }
    state.resourceIndex = collectResourceEntries(obj);
    if (state.resourceIndex[0]) state.currentResourceKey = state.resourceIndex[0].key;
    render();
    setNotice('resourceMap を ' + state.resourceIndex.length + '件 解析しました', 'success');
    logMessage('resourceMap を ' + state.resourceIndex.length + '件 解析しました', 'success');
    return true;
  }
  function getCurrentResourceEntry(){
    return state.resourceIndex.find(function(item){ return item.key === state.currentResourceKey; }) || state.resourceIndex[0] || null;
  }
  function applyCurrentResourceMeta(){
    const item = getCurrentResourceEntry();
    if (!item){ setNotice('選択中 resource がありません', 'error'); return false; }
    setMetaFields({
      category: item.category || '',
      resourceId: item.resourceId || '',
      character: item.character || '',
      expression: item.expression || '',
      variant: item.variant || '',
      note: item.note || state.meta.note || ''
    });
    setNotice('resource メタを反映しました', 'success');
    return true;
  }
  function loadCurrentResourceData(){
    const item = getCurrentResourceEntry();
    if (!item){ setNotice('選択中 resource がありません', 'error'); return false; }
    const raw = item.raw;
    applyCurrentResourceMeta();
    if (!raw || typeof raw !== 'object'){
      setNotice('この resource はメタのみです', 'accent');
      return true;
    }
    if (raw.palette){
      state.palette = objectToMap(raw.palette);
      syncPaletteTextareaFromState();
      renderPaletteGrid();
    }
    if (raw.cols || raw.rows || raw.width || raw.height){
      const newCols = parseInt(raw.cols || raw.width || state.cols, 10) || state.cols;
      const newRows = parseInt(raw.rows || raw.height || state.rows, 10) || state.rows;
      rebuildProjectFresh(newCols, newRows);
    }
    if (Array.isArray(raw.layers)){
      importProjectData(Object.assign(exportProjectData(), { layers: raw.layers, cols: raw.cols || state.cols, rows: raw.rows || state.rows, meta: Object.assign({}, state.meta, raw.meta || {}) }));
      setNotice('resource 内容を読み込みました', 'success');
      return true;
    }
    if (Array.isArray(raw.grid) || Array.isArray(raw.cells)){
      const grid = Array.isArray(raw.grid) ? raw.grid : raw.cells;
      const rows = grid.length || state.rows;
      const cols = grid[0] ? grid[0].length : state.cols;
      rebuildProjectFresh(cols, rows);
      const layer = getCurrentLayer();
      layer.cells = resizeCellsPreserve(grid, cols, rows);
      render();
      setNotice('grid 内容を読み込みました', 'success');
      return true;
    }
    if (raw.commands){
      els.commandInput.value = Array.isArray(raw.commands) ? raw.commands.join('\n') : String(raw.commands);
      setNotice('commands を命令欄へ入れました', 'success');
      return true;
    }
    setNotice('読み込める本体データは見つからず、メタのみ反映しました', 'accent');
    return true;
  }
  function reloadTemplates(){
    try {
      const list = JSON.parse(els.templateJsonInput.value);
      if (!Array.isArray(list)) throw new Error('配列ではありません');
      state.templates = list.map(function(item, index){
        return {
          name: item.name || ('template-' + (index + 1)),
          type: item.type || '',
          cols: clamp(parseInt(item.cols, 10) || 32, 1, 1024),
          rows: clamp(parseInt(item.rows, 10) || 32, 1, 1024),
          meta: item.meta || {}
        };
      });
      renderTemplateOptions();
      setNotice('テンプレートを再読込しました', 'success');
      logMessage('テンプレートを再読込しました', 'success');
    } catch (error){
      setNotice('テンプレート解析失敗: ' + String(error.message || error), 'error');
      logMessage('テンプレート解析失敗: ' + String(error.message || error), 'error');
    }
  }
  function applySelectedTemplate(){
    const index = parseInt(els.templateSelect.value || '0', 10);
    const tpl = state.templates[index];
    if (!tpl){ setNotice('テンプレートが選ばれていません', 'error'); return false; }
    rebuildProjectFresh(tpl.cols, tpl.rows);
    if (tpl.meta) setMetaFields(tpl.meta);
    setNotice('テンプレート適用: ' + tpl.name, 'success');
    logMessage('テンプレート適用: ' + tpl.name, 'success');
    return true;
  }
  function loadOverlayFromDataUrl(dataUrl, name){
    const img = new Image();
    img.onload = function(){
      state.overlay.image = img;
      state.overlay.name = name || 'overlay';
      state.overlay.visible = true;
      render();
      setNotice('オーバーレイを読み込みました', 'success');
    };
    img.onerror = function(){ setNotice('オーバーレイ画像を読めませんでした', 'error'); };
    img.src = dataUrl;
  }
  function handleOverlayFile(file){
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt){ loadOverlayFromDataUrl(String(evt.target.result || ''), file.name || 'overlay'); };
    reader.readAsDataURL(file);
  }

  function onNativeResult(message){
    if (!message) return;
    if (message.kind === 'json-load'){
      try {
        const text = message.base64 ? base64ToUtf8(message.base64) : String(message.text || '');
        importJsonText(text, message.fileName || 'selected.json');
      } catch (error){
        setNotice('JSON読込失敗: ' + String(error.message || error), 'error');
        logMessage('JSON読込失敗: ' + String(error.message || error), 'error');
      }
      return;
    }
    if (message.ok){
      setNotice(message.message || '保存しました', 'success');
      logMessage(message.message || '保存しました', 'success');
    } else {
      setNotice(message.message || '保存に失敗しました', 'error');
      logMessage(message.message || '保存に失敗しました', 'error');
    }
  }
  window.appBridge = {
    popNativeMessage: function(){
      window.__nativeQueue = window.__nativeQueue || [];
      return window.__nativeQueue.shift() || null;
    },
    onNativeResult: onNativeResult
  };

  function pulseButton(button){
    if (!button) return;
    button.classList.remove('just-pressed');
    window.requestAnimationFrame(function(){
      button.classList.add('just-pressed');
      window.setTimeout(function(){ button.classList.remove('just-pressed'); }, 140);
    });
  }
  function stabilizeButtonViewport(button){
    let lastX = 0, lastY = 0;
    function remember(){ lastX = window.scrollX || window.pageXOffset || 0; lastY = window.scrollY || window.pageYOffset || 0; }
    function restore(){
      try { if (document.activeElement === button && typeof button.blur === 'function') button.blur(); } catch (error) {}
      window.requestAnimationFrame(function(){
        const nowX = window.scrollX || window.pageXOffset || 0;
        const nowY = window.scrollY || window.pageYOffset || 0;
        if (Math.abs(nowX - lastX) > 1 || Math.abs(nowY - lastY) > 1) window.scrollTo(lastX, lastY);
      });
    }
    button.addEventListener('touchstart', remember, { passive:true });
    button.addEventListener('pointerdown', remember, { passive:true });
    button.addEventListener('mousedown', remember, { passive:true });
    button.addEventListener('click', restore, { passive:true });
    button.addEventListener('touchend', restore, { passive:true });
  }
  function installButtonFeedback(){
    document.querySelectorAll('button').forEach(function(button){
      button.type = 'button';
      stabilizeButtonViewport(button);
      button.addEventListener('click', function(){ pulseButton(button); try { button.blur(); } catch (error) {} });
      button.addEventListener('touchend', function(){ try { button.blur(); } catch (error) {} }, { passive:true });
    });
  }

  function handleCanvasDown(evt){
    if (evt.pointerType === 'touch') return;
    if (state.tempLock){
      beginCanvasPan(evt.clientX, evt.clientY);
      evt.preventDefault();
      return;
    }
    if (beginCanvasEditAt(evt.clientX, evt.clientY)) evt.preventDefault();
  }
  function handleCanvasMove(evt){
    if (evt.pointerType === 'touch') return;
    if (moveCanvasEditAt(evt.clientX, evt.clientY)) evt.preventDefault();
  }
  function handleCanvasUp(){
    state.dragging = false;
    state.selectStart = null;
    state.lastCellKey = '';
    state.panStart = null;
    endCanvasPan();
    clearStrokeHistoryFlag();
  }
  function handleCanvasTouchStart(evt){
    const touches = evt.touches;
    if (!touches || !touches.length) return;
    if (touches.length >= 2){
      const a = touches[0], b = touches[1];
      state.activePointers.clear();
      state.activePointers.set(1, { clientX:a.clientX, clientY:a.clientY, pointerType:'touch' });
      state.activePointers.set(2, { clientX:b.clientX, clientY:b.clientY, pointerType:'touch' });
      beginPinchGesture();
      endCanvasPan();
      evt.preventDefault();
      return;
    }
    const touch = touches[0];
    if (state.pinchState){
      state.pinchState = null;
      beginCanvasPan(touch.clientX, touch.clientY);
      evt.preventDefault();
      return;
    }
    if (beginCanvasEditAt(touch.clientX, touch.clientY)) evt.preventDefault();
  }
  function handleCanvasTouchMove(evt){
    const touches = evt.touches;
    if (!touches || !touches.length) return;
    if (touches.length >= 2){
      const a = touches[0], b = touches[1];
      state.activePointers.clear();
      state.activePointers.set(1, { clientX:a.clientX, clientY:a.clientY, pointerType:'touch' });
      state.activePointers.set(2, { clientX:b.clientX, clientY:b.clientY, pointerType:'touch' });
      if (!state.pinchState) beginPinchGesture();
      if (state.pinchState){
        const p1 = state.activePointers.get(1);
        const p2 = state.activePointers.get(2);
        const mid = midpointBetweenPoints(p1, p2);
        const dist = distanceBetweenPoints(p1, p2);
        const scale = dist / Math.max(1, state.pinchState.startDistance || 1);
        const nextSize = clamp(Math.round((state.pinchState.startCellSize || state.cellSize) * scale), 2, 60);
        zoomCanvasToCellSize(nextSize, mid.clientX, mid.clientY);
        evt.preventDefault();
      }
      return;
    }
    const touch = touches[0];
    if (state.pinchState){
      state.pinchState = null;
      beginCanvasPan(touch.clientX, touch.clientY);
      evt.preventDefault();
      return;
    }
    if (moveCanvasEditAt(touch.clientX, touch.clientY)) evt.preventDefault();
  }
  function handleCanvasTouchEnd(evt){
    const touches = evt.touches;
    if (touches && touches.length >= 2){
      const a = touches[0], b = touches[1];
      state.activePointers.clear();
      state.activePointers.set(1, { clientX:a.clientX, clientY:a.clientY, pointerType:'touch' });
      state.activePointers.set(2, { clientX:b.clientX, clientY:b.clientY, pointerType:'touch' });
      state.pinchState = null;
      beginPinchGesture();
      return;
    }
    if (touches && touches.length === 1){
      const touch = touches[0];
      if (state.pinchState){
        state.pinchState = null;
        beginCanvasPan(touch.clientX, touch.clientY);
      }
      return;
    }
    state.activePointers.clear();
    state.pinchState = null;
    state.dragging = false;
    state.selectStart = null;
    state.lastCellKey = '';
    state.panStart = null;
    endCanvasPan();
    clearStrokeHistoryFlag();
  }

  function bindEvents(){
    els.rebuildBtn.addEventListener('click', function(){ pushHistory('resize'); resizeCanvasPreserve(); });
    els.canvasThemeSelect.addEventListener('change', function(){ state.canvasTheme = els.canvasThemeSelect.value === 'light' ? 'light' : 'dark'; applyCanvasTheme(); });
    els.clearCanvasBtn.addEventListener('click', function(){ pushHistory('clear'); clearAllLayers(); selectionButtonOff(); });
    els.applyTemplateBtn.addEventListener('click', function(){ pushHistory('template'); applySelectedTemplate(); });
    els.savePngBtn.addEventListener('click', function(){ requestSave('png'); selectionButtonOff(); });
    els.savePsdBtn.addEventListener('click', function(){ requestSave('psd'); selectionButtonOff(); });
    els.saveBothBtn.addEventListener('click', function(){ requestSave('both'); selectionButtonOff(); });
    els.saveJsonBtn.addEventListener('click', function(){ requestSave('json'); });
    els.exportJsonBtn.addEventListener('click', function(){ exportJsonToTextarea(); });

    els.applyPaletteBtn.addEventListener('click', function(){ applyPaletteFromTextarea(); });
    els.clearPaletteBtn.addEventListener('click', function(){ els.paletteInput.value = ''; state.palette.clear(); renderPaletteGrid(); render(); setNotice('色番号辞書を消しました', 'accent'); });
    els.toggleExamplesBtn.addEventListener('click', function(){
      const hidden = els.examplesBox.classList.toggle('hidden');
      els.toggleExamplesBtn.textContent = hidden ? '命令例を表示' : '命令例を隠す';
      els.toggleExamplesBtn.classList.toggle('active', !hidden);
    });
    els.runBtn.addEventListener('click', function(){ runCommands(); selectionButtonOff(); });
    els.clearCommandBtn.addEventListener('click', function(){ els.commandInput.value = ''; state.commandErrorLines = new Set(); refreshCommandEditor(true); setNotice('命令欄を消しました', 'accent'); });
    els.loadJsonFileBtn.addEventListener('click', function(){ requestJsonFilePick(); });
    els.clearJsonBtn.addEventListener('click', function(){ els.jsonInput.value = ''; setNotice('JSON表示欄を消しました', 'accent'); });

    els.paintModeBtn.addEventListener('click', function(){ setMode('paint'); });
    els.eraseModeBtn.addEventListener('click', function(){ setMode('erase'); });
    els.undoBtn.addEventListener('click', function(){ undoHistory(); });
    els.redoBtn.addEventListener('click', function(){ redoHistory(); });
    els.lockModeBtn.addEventListener('click', function(){ toggleTempLock(); });
    els.fitViewBtn.addEventListener('click', function(){ fitCanvasToView(); selectionButtonOff(); });
    els.selectModeBtn.addEventListener('click', function(){ state.mode = 'select'; state.tempLock = false; state.pasteMode = false; state.pastePreview = null; state.panStart = null; updateCanvasTouchAction(); updateStatus(); render(); });
    els.copyBtn.addEventListener('click', function(){ if (!copySelection()){ setNotice('先に範囲選択してください', 'error'); return; } selectionButtonOff(); setNotice('選択範囲をコピーしました', 'success'); });
    els.pasteModeBtn.addEventListener('click', function(){
      if (!state.copied){ setNotice('先にコピーしてください', 'error'); return; }
      state.pasteMode = !state.pasteMode;
      if (state.pasteMode){ ensurePastePreview(); state.mode = 'paint'; setNotice('紫の枠をタップして位置を決めてください', 'accent'); }
      else { state.pastePreview = null; setNotice('貼り付け位置選択を終了しました', 'accent'); }
      render();
    });
    els.applyPasteBtn.addEventListener('click', function(){
      if (!(state.pasteMode && state.copied && state.pastePreview)){ setNotice('先に貼り付け位置を選んでください', 'error'); return; }
      if (!isCurrentLayerEditable()) return;
      pushHistory('paste');
      pasteAt(state.pastePreview.x, state.pastePreview.y, getCurrentLayer());
      state.pasteMode = false; state.pastePreview = null; selectionButtonOff(); setNotice('貼り付けました', 'success'); render();
    });
    els.flipHBtn.addEventListener('click', function(){ if (!isCurrentLayerEditable()) return; pushHistory('flip-h'); if (!flipHorizontal()){ setNotice('先に範囲選択してください', 'error'); return; } selectionButtonOff(); setNotice('左右反転しました', 'success'); });
    els.flipVBtn.addEventListener('click', function(){ if (!isCurrentLayerEditable()) return; pushHistory('flip-v'); if (!flipVertical()){ setNotice('先に範囲選択してください', 'error'); return; } selectionButtonOff(); setNotice('上下反転しました', 'success'); });
    els.clearSelectionBtn.addEventListener('click', function(){ clearSelection(); selectionButtonOff(); setNotice('選択解除しました', 'accent'); });

    els.addLayerBtn.addEventListener('click', function(){ pushHistory('add-layer'); addLayer(els.newLayerNameInput.value); });
    els.renameLayerBtn.addEventListener('click', function(){ pushHistory('rename-layer'); renameCurrentLayer(els.newLayerNameInput.value); });
    els.deleteLayerBtn.addEventListener('click', function(){ pushHistory('delete-layer'); deleteCurrentLayer(); });
    els.toggleLayerVisibleBtn.addEventListener('click', function(){ const layer = getCurrentLayer(); if (!layer) return; pushHistory('toggle-visible'); layer.visible = !layer.visible; render(); });
    els.toggleLayerLockBtn.addEventListener('click', function(){ const layer = getCurrentLayer(); if (!layer) return; pushHistory('toggle-layer-lock'); layer.locked = !layer.locked; render(); });
    els.moveLayerUpBtn.addEventListener('click', function(){ const layer = getCurrentLayer(); if (!layer) return; pushHistory('layer-up'); moveLayer(layer.id, 1); });
    els.moveLayerDownBtn.addEventListener('click', function(){ const layer = getCurrentLayer(); if (!layer) return; pushHistory('layer-down'); moveLayer(layer.id, -1); });

    els.savePartBtn.addEventListener('click', function(){ savePart(els.partNameInput.value); });
    els.deletePartBtn.addEventListener('click', function(){ const name = state.currentPartName || els.partNameInput.value.trim(); if (!name || !state.parts[name]){ setNotice('削除対象パーツがありません', 'error'); return; } delete state.parts[name]; if (state.currentPartName === name) state.currentPartName = ''; render(); setNotice('パーツ削除: ' + name, 'success'); });
    els.stampPartBtn.addEventListener('click', function(){ pushHistory('stamp-part'); stampSelectedPart(); });

    els.savePatchBaseBtn.addEventListener('click', function(){ savePatchBase(els.patchBaseNameInput.value); });
    els.savePatchBtn.addEventListener('click', function(){ savePatch(els.patchNameInput.value, els.patchBaseNameInput.value); });
    els.applyPatchBtn.addEventListener('click', function(){ const name = state.currentPatchName || els.patchNameInput.value.trim(); if (!name){ setNotice('パッチ名がありません', 'error'); return; } pushHistory('apply-patch'); applyPatch(name); });
    els.removePatchBtn.addEventListener('click', function(){ const name = state.currentPatchName || els.patchNameInput.value.trim(); if (!name){ setNotice('パッチ名がありません', 'error'); return; } pushHistory('remove-patch'); removePatch(name); });
    els.deletePatchBtn.addEventListener('click', function(){ const name = state.currentPatchName || els.patchNameInput.value.trim(); if (!name || !state.patches[name]){ setNotice('削除対象パッチがありません', 'error'); return; } pushHistory('delete-patch'); delete state.patches[name]; delete state.patchApplyState[name]; if (state.currentPatchName === name) state.currentPatchName = ''; render(); setNotice('パッチ削除: ' + name, 'success'); });

    ['metaProjectInput','metaCategoryInput','metaResourceIdInput','metaCharacterInput','metaExpressionInput','metaVariantInput','metaNoteInput'].forEach(function(id){
      els[id].addEventListener('input', function(){ readMetaFromInputs(); updateStatus(); });
    });
    els.parseResourceMapBtn.addEventListener('click', function(){ parseResourceMapInput(); });
    els.applyResourceMetaBtn.addEventListener('click', function(){ applyCurrentResourceMeta(); });
    els.loadResourceDataBtn.addEventListener('click', function(){ loadCurrentResourceData(); });
    els.reloadTemplatesBtn.addEventListener('click', function(){ reloadTemplates(); });
    els.templateSelect.addEventListener('change', function(){ renderTemplateList(); });

    els.toggleCenterGuideBtn.addEventListener('click', function(){ state.guides.center = !state.guides.center; render(); });
    els.toggleFaceGuideBtn.addEventListener('click', function(){ state.guides.face = !state.guides.face; render(); });
    els.toggleHeadsGuideBtn.addEventListener('click', function(){ state.guides.heads = !state.guides.heads; render(); });
    els.headsCountInput.addEventListener('input', function(){ state.guides.headsCount = clamp(parseInt(els.headsCountInput.value || '8', 10) || 8, 2, 12); render(); });
    els.overlayOpacityInput.addEventListener('input', function(){ state.overlay.opacity = clamp(parseInt(els.overlayOpacityInput.value || '35', 10) || 35, 0, 100) / 100; render(); });
    els.overlayScaleInput.addEventListener('input', function(){ state.overlay.scale = Math.max(0.1, Number(els.overlayScaleInput.value || '1')); render(); });
    els.overlayOffsetXInput.addEventListener('input', function(){ state.overlay.offsetX = Number(els.overlayOffsetXInput.value || '0'); render(); });
    els.overlayOffsetYInput.addEventListener('input', function(){ state.overlay.offsetY = Number(els.overlayOffsetYInput.value || '0'); render(); });
    els.toggleOverlayBtn.addEventListener('click', function(){ state.overlay.visible = !state.overlay.visible; render(); });
    els.clearOverlayBtn.addEventListener('click', function(){ state.overlay.image = null; state.overlay.name = ''; state.overlay.visible = false; render(); setNotice('オーバーレイを削除しました', 'accent'); });
    els.overlayFileInput.addEventListener('change', function(evt){ handleOverlayFile(evt.target.files && evt.target.files[0]); });

    els.commandInput.addEventListener('input', function(){
      state.commandErrorLines = new Set();
      scheduleCommandEditorRefresh(state.commandPasteGuard ? 60 : 0, false);
    });
    els.commandInput.addEventListener('paste', function(evt){
      beginCommandPasteGuard();
      const text = evt.clipboardData && evt.clipboardData.getData ? evt.clipboardData.getData('text/plain') : '';
      if (typeof text === 'string' && text.length){
        evt.preventDefault();
        insertTextAtCursor(els.commandInput, normalizeMultilineText(text));
        state.commandErrorLines = new Set();
      }
      setNotice('長い命令を貼り付け中です…', 'accent');
      scheduleCommandPasteRecovery();
    });
    els.commandInput.addEventListener('beforeinput', function(evt){
      const type = String(evt.inputType || '');
      if (type === 'insertFromPaste' || type === 'insertReplacementText'){
        beginCommandPasteGuard();
        setNotice('長い命令を貼り付け中です…', 'accent');
        scheduleCommandPasteRecovery();
        return;
      }
      if (type === 'insertText' && typeof evt.data === 'string' && evt.data.length > 1000){
        beginCommandPasteGuard();
        setNotice('長い命令を反映中です…', 'accent');
        scheduleCommandPasteRecovery();
      }
    });
    els.commandInput.addEventListener('scroll', function(){ syncCommandHighlightScroll(); }, { passive:true });
    els.commandInput.addEventListener('blur', function(){ scheduleCommandEditorRefresh(0, false); });
    els.gridCanvas.addEventListener('pointerdown', handleCanvasDown);
    els.gridCanvas.addEventListener('pointermove', handleCanvasMove);
    els.gridCanvas.addEventListener('pointerup', handleCanvasUp);
    els.gridCanvas.addEventListener('pointerleave', handleCanvasUp);
    els.gridCanvas.addEventListener('pointercancel', handleCanvasUp);
    els.gridCanvas.addEventListener('touchstart', handleCanvasTouchStart, { passive:false });
    els.gridCanvas.addEventListener('touchmove', handleCanvasTouchMove, { passive:false });
    els.gridCanvas.addEventListener('touchend', handleCanvasTouchEnd, { passive:false });
    els.gridCanvas.addEventListener('touchcancel', handleCanvasTouchEnd, { passive:false });
    els.paletteInput.addEventListener('change', function(){ if (els.paletteInput.value.trim()) applyPaletteFromTextarea(); });
  }

  function init(){
    state.layers = [createLayer('base')];
    state.currentLayerId = state.layers[0].id;
    state.historyUndo = [];
    state.historyRedo = [];
    state.lastJsonFileName = '';
    updateJsonFilePill();
    reloadTemplates();
    applyPaletteFromTextarea();
    renderLog();
    bindEvents();
    installButtonFeedback();
    readMetaFromInputs();
    refreshCommandEditor(false);
    updateCanvasTouchAction();
    render();
    setNotice('準備OK', 'accent');
    logMessage('起動しました', 'success');
  }

  init();
})();
</script>
</body>
</html>

`;

  const fmLocal = FileManager.local();
  const fmCloud = FileManager.iCloud();
  const exportDirLocal = fmLocal.joinPath(fmLocal.documentsDirectory(), "PixelCommandPainterExports");
  const exportDirCloud = fmCloud.joinPath(fmCloud.documentsDirectory(), "PixelCommandPainterExports");
  if (!fmLocal.fileExists(exportDirLocal)) {
    fmLocal.createDirectory(exportDirLocal, true);
  }
  if (!fmCloud.fileExists(exportDirCloud)) {
    fmCloud.createDirectory(exportDirCloud, true);
  }

  function sleep(seconds) {
    return new Promise((resolve) => {
      const timer = Timer.schedule(seconds, false, () => {
        try { timer.invalidate(); } catch (e) {}
        resolve();
      });
    });
  }

  function sanitizeFileName(name) {
    const raw = String(name || "pixel-art").trim() || "pixel-art";
    return raw.replace(/[\\/:*?"<>|]/g, "_");
  }

  async function sendResultToPage(webView, payload) {
    try {
      const js = 'window.appBridge && window.appBridge.onNativeResult && window.appBridge.onNativeResult(' + JSON.stringify(payload || {}) + ');';
      await webView.evaluateJavaScript(js);
    } catch (e) {}
  }

  async function writeBase64File(fileName, base64) {
    const safeName = sanitizeFileName(fileName);
    const data = Data.fromBase64String(base64);
    if (!data) {
      throw new Error("base64データを読み込めませんでした");
    }
    const savedNames = [];
    const localPath = fmLocal.joinPath(exportDirLocal, safeName);
    fmLocal.write(localPath, data);
    savedNames.push("local:" + safeName);
    try {
      const cloudPath = fmCloud.joinPath(exportDirCloud, safeName);
      fmCloud.write(cloudPath, data);
      savedNames.push("iCloud:" + safeName);
    } catch (error) {}
    return savedNames;
  }

  async function handleBridgeMessage(webView, message) {
    if (!message || !message.action) return;
    if (message.action === "pick-json-file") {
      try {
        const paths = await DocumentPicker.open(["public.json", "public.text", "public.plain-text"]);
        if (!paths || !paths.length) {
          await sendResultToPage(webView, { ok:false, message:"JSONファイルの選択をキャンセルしました" });
          return;
        }
        const filePath = paths[0];
        const fmPick = FileManager.local();
        const fileName = String(filePath).split('/').pop() || 'selected.json';
        const text = fmPick.readString(filePath);
        await sendResultToPage(webView, {
          ok: true,
          kind: "json-load",
          fileName: fileName,
          base64: Data.fromString(text).toBase64String()
        });
      } catch (error) {
        await sendResultToPage(webView, { ok:false, message:"JSONファイルを読めませんでした: " + String(error) });
      }
      return;
    }
    if (message.action === "save-json-file") {
      const payload = message.payload || {};
      try {
        const safeName = sanitizeFileName(payload.fileName || "pixel-art-pro.json");
        const data = Data.fromBase64String(String(payload.base64 || ""));
        if (!data) throw new Error("base64データを読み込めませんでした");
        const text = data.toRawString();
        if (typeof DocumentPicker.exportString === "function") {
          await DocumentPicker.exportString(text, safeName);
          await sendResultToPage(webView, {
            ok: true,
            message: "JSONを保存しました: " + safeName
          });
          return;
        }
        const savedNames = await writeBase64File(safeName, String(payload.base64 || ""));
        await sendResultToPage(webView, {
          ok: true,
          message: "JSONを保存しました: " + savedNames.join(" / ")
        });
      } catch (error) {
        await sendResultToPage(webView, {
          ok: false,
          message: "JSON保存に失敗しました: " + String(error)
        });
      }
      return;
    }
    if (message.action === "save-file") {
      const payload = message.payload || {};
      const savedNames = await writeBase64File(payload.fileName, payload.base64);
      await sendResultToPage(webView, {
        ok: true,
        message: "保存しました: " + savedNames.join(" / ")
      });
      return;
    }

    if (message.action === "save-both") {
      const payload = message.payload || {};
      const files = Array.isArray(payload.files) ? payload.files : [];
      const saved = [];
      for (const file of files) {
        const savedNames = await writeBase64File(file.fileName, file.base64);
        saved.push.apply(saved, savedNames);
      }
      await sendResultToPage(webView, {
        ok: true,
        message: "保存しました: " + saved.join(" / ")
      });
      return;
    }

    await sendResultToPage(webView, {
      ok: false,
      message: "未対応の操作です"
    });
  }

  const webView = new WebView();
  const queue = [];
  webView.shouldAllowRequest = (request) => {
    const url = request && request.url ? String(request.url) : "";
    if (url.startsWith("scriptable:///bridge")) {
      queue.push(url);
      return false;
    }
    return true;
  };

  await webView.loadHTML(html);
  await webView.evaluateJavaScript('window.__SCRIPTABLE_NATIVE__ = true; true;');

  let closed = false;
  let presentError = null;
  const presentPromise = webView.present(true)
    .catch((error) => {
      presentError = error;
    })
    .finally(() => {
      closed = true;
    });

  while (!closed || queue.length) {
    if (queue.length) {
      queue.shift();
      try {
        const raw = await webView.evaluateJavaScript(
          'JSON.stringify(window.appBridge && window.appBridge.popNativeMessage ? window.appBridge.popNativeMessage() : null)'
        );
        const message = raw ? JSON.parse(raw) : null;
        if (message) {
          await handleBridgeMessage(webView, message);
        }
      } catch (error) {
        await sendResultToPage(webView, {
          ok: false,
          message: "保存処理でエラー: " + String(error)
        });
      }
    } else {
      await sleep(0.15);
    }
  }

  if (presentError) {
    throw presentError;
  }

  Script.complete();
})().catch((error) => {
  console.error(error);
  throw error;
});
