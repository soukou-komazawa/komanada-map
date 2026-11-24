//=============================================================================
// KMS_Minimap.js
//  last update: 2019/01/01 (Modified for High-Density & Smart Edge-Clamp Minimap)
//=============================================================================
// Copyright (c) 2015-2019 TOMY (Kamesoft)
// Released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc
 * [v0.2.1-mod] Display high-density minimap with smart edge clamp & natural icon effects.
 *
 * @author TOMY (Kamesoft) / Modified
 *
 * @param Map rect
 * @default 524, 32, 260, 200
 * @desc
 * Specify minimap position and its size.
 * Format: X, Y, Width, Height
 *
 * @param Grid size
 * @default 10
 * @desc Grid size of the minimap in pixel.
 *
 * @param Blink time
 * @default 180
 * @desc Blinking interval of icons on the minimap in frames.
 *
 * @param Foreground color
 * @default rgba(224, 224, 240, 0.6)
 * @desc
 * Format: rgba(Red, Green, Blue, Alpha)
 *
 * @param Background color
 * @default rgba(0, 0, 160, 0.6)
 * @desc
 * Format: rgba(Red, Green, Blue, Alpha)
 *
 * @param Mask style
 * @default 0
 * @desc
 * Mask style for minimap.
 * 0: None  1: Ellipse  2: Rounded rectangle  3, 4: Hex
 *
 * @param Mask radius
 * @default 48
 * @desc
 * The radius of each of the corners.
 * (Rounded rectangle style only)
 *
 * @param --- Extended Settings ---
 *
 * @param Clamp at map edge
 * @type boolean
 * @default true
 * @desc Stop scrolling at the edges of the reachable area and center smaller areas.
 *
 * @param Edge padding tiles
 * @type number
 * @min 0
 * @max 20
 * @default 2
 * @desc Number of outer wall tiles kept visible around the reachable area when clamped.
 *
 * @param Shrink grid border
 * @type boolean
 * @default false
 * @desc Shrink grid size by 1px at impassable edges. Disable for fine grid sizes (e.g. 4px).
 *
 * @param Reachability check
 * @type boolean
 * @default true
 * @desc Fill unreachable isolated areas as impassable unless marked with exception comments.
 *
 * @param Fixed event blocks passage
 * @type boolean
 * @default true
 * @desc Treat non-moving impassable events as obstacles during reachability check.
 *
 * @param Map color tone
 * @default 0, 0, 0, 0
 * @desc Overall color tone of the minimap (R, G, B, Gray). Original default was -64, -64, 128, 64.
 *
 * @param Player icon scale
 * @type number
 * @decimals 2
 * @default 0.60
 * @desc Base scale of the player icon.
 *
 * @param Object icon scale
 * @type number
 * @decimals 2
 * @default 0.60
 * @desc Base scale of object/person icons.
 *
 * @param Icon smoothing
 * @type boolean
 * @default false
 * @desc Enable linear smoothing on icons. Disable (false) to prevent white fringe artifacts when scaled down.
 *
 * @param Snap icon pixel
 * @type boolean
 * @default true
 * @desc Round icon coordinates to integer pixels to prevent sub-pixel shimmer when scaled down.
 *
 * @param Player icon blink
 * @type boolean
 * @default true
 * @desc Enable blinking animation for the player icon.
 *
 * @param Player blink time
 * @type number
 * @min 0
 * @default 0
 * @desc Blink interval for the player icon in frames (0 = use Blink time).
 *
 * @param Blink mode
 * @type select
 * @option White Flash (Default)
 * @value flash
 * @option Alpha Blink
 * @value alpha
 * @option Both
 * @value both
 * @default flash
 * @desc Visual style for icon blinking.
 *
 * @param Blink max flash
 * @type number
 * @min 0
 * @max 255
 * @default 140
 * @desc Max white flash intensity (0-255). Lowering from 255 prevents whiteout on scaled-down icons.
 *
 * @param Blink min opacity
 * @type number
 * @min 0
 * @max 255
 * @default 80
 * @desc Minimum opacity (0-255) when Blink mode uses alpha blinking.
 *
 * @param Default pulse scale
 * @type number
 * @decimals 2
 * @default 1.40
 * @desc Default max scale multiplier for <Minimap: Pulse> events.
 *
 * @param Default pulse period
 * @type number
 * @min 1
 * @default 60
 * @desc Default cycle frames for <Minimap: Pulse> events.
 *
 * @param Message behavior
 * @type select
 * @option Keep visible
 * @value keep
 * @option Fade
 * @value fade
 * @option Hide
 * @value hide
 * @default keep
 * @desc Minimap behavior while a message window is open.
 *
 * @param Top message behavior
 * @type select
 * @option Same as Message behavior
 * @value inherit
 * @option Keep visible
 * @value keep
 * @option Fade
 * @value fade
 * @option Hide
 * @value hide
 * @default fade
 * @desc Minimap behavior when message window position is Top.
 *
 * @param Message fade opacity
 * @type number
 * @min 0
 * @max 255
 * @default 64
 * @desc Target opacity when faded during messages.
 *
 * @param Message fade speed
 * @type number
 * @min 1
 * @max 255
 * @default 16
 * @desc Opacity change speed per frame during message transitions.
 *
 * @param Border color
 * @default rgba(255, 255, 255, 0.45)
 * @desc Border line CSS color around the minimap. Leave empty to disable.
 *
 * @param Border width
 * @type number
 * @min 0
 * @max 10
 * @default 1
 * @desc Border line width in pixels.
 *
 * @help
 * ## Map Note Tags
 * <NoMinimap>                   # Disable minimap on this map
 * <MinimapBounds: x1,x2,y1,y2>  # Manually override clamp tile bounds (optional)
 *
 * ## Event Comment Tags (Place at top of event page)
 * <Minimap: Wall>             # Treat tile as impassable wall
 * <Minimap: Move>             # Show move/warp icon
 * <Minimap: Person N>         # Show person icon index N
 * <Minimap: Object N>         # Show object icon index N
 * <Minimap: Seed>             # Add as reachability search origin (for warp destinations)
 * <Minimap: Through>          # Allow reachability check to pass through (for breakable rocks/doors)
 * <Minimap: Color #00ff88>    # Paint tile with custom CSS color
 * <Minimap: NoBlink>          # Disable blinking for this icon
 * <Minimap: BlinkTime 30>     # Custom blink interval in frames
 * <Minimap: Pulse>            # Enable scale pulsing animation
 * <Minimap: Pulse 1.5 60>     # Custom pulse max scale and period
 *
 * ## Plugin command
 * Minimap show     # Show minimap.
 * Minimap hide     # Hide minimap.
 * Minimap refresh  # Redraw and recalculate minimap.
 *
 * @requiredAssets img/system/MinimapPlayerIcon
 * @requiredAssets img/system/MinimapObjectIcon
 */

/*:ja
 * @plugindesc
 * [v0.2.1-mod] 画面上に高精細ミニマップを表示します（歩行領域端止め・自然点滅対応）。
 *
 * @author TOMY (Kamesoft) / 改変
 *
 * @param Map rect
 * @default 524, 32, 260, 200
 * @desc
 * ミニマップの表示位置とサイズをピクセル単位で指定します。
 * 書式: X, Y, 幅, 高さ
 *
 * @param Grid size
 * @default 10
 * @desc ミニマップの 1 マスのサイズをピクセル単位で指定します。
 *
 * @param Blink time
 * @default 180
 * @desc ミニマップ上のアイコンを点滅させる時間をフレーム単位で指定します。
 *
 * @param Foreground color
 * @default rgba(224, 224, 240, 0.6)
 * @desc
 * ミニマップの通行可能領域の色を CSS カラーで指定します。
 * 書式: rgba(赤, 緑, 青, 不透明度)
 *
 * @param Background color
 * @default rgba(0, 0, 160, 0.6)
 * @desc
 * ミニマップの通行不可領域の色を CSS カラーで指定します。
 * 書式: rgba(赤, 緑, 青, 不透明度)
 *
 * @param Mask style
 * @default 0
 * @desc
 * ミニマップの表示領域のマスク方法を指定します。
 * 0: なし  1: 楕円  2: 角丸矩形  3: 六角形1  4: 六角形2
 *
 * @param Mask radius
 * @default 48
 * @desc
 * 角丸矩形マスクを指定した場合の、角の丸め具合を指定します。
 *
 * @param --- 拡張設定 ---
 *
 * @param Clamp at map edge
 * @text 歩行領域の端でスクロール停止
 * @type boolean
 * @default true
 * @desc 周囲の装飾用通行不能エリアを除き、実際に歩ける領域の端でスクロールを止めます。
 *
 * @param Edge padding tiles
 * @text 端止め時の外周壁余白(マス)
 * @type number
 * @min 0
 * @max 20
 * @default 2
 * @desc 歩ける領域の端でスクロールを止める際、外側の壁を何マス分残して表示するか指定します。
 *
 * @param Shrink grid border
 * @text 通行不可境界の1px削り
 * @type boolean
 * @default false
 * @desc 壁に接するマスの描画を1px削ります。細かいドット(4px等)ではfalse推奨。
 *
 * @param Reachability check
 * @text 到達不能エリア塗りつぶし
 * @type boolean
 * @default true
 * @desc プレイヤーが到達できない孤立領域を通行不能として塗りつぶします。
 *
 * @param Fixed event blocks passage
 * @text 固定イベントを壁とみなす
 * @type boolean
 * @default true
 * @desc 自律移動が「固定」で通行不可のイベントを到達判定の障害物として扱います。
 *
 * @param Map color tone
 * @text ミニマップ全体の色調補正
 * @default 0, 0, 0, 0
 * @desc ミニマップ全体の色調(赤, 緑, 青, グレー)。元の青紫フィルターに戻す場合は -64, -64, 128, 64 を指定。
 *
 * @param Player icon scale
 * @text プレイヤーアイコン倍率
 * @type number
 * @decimals 2
 * @default 0.60
 * @desc プレイヤーアイコンの基準拡大率です。
 *
 * @param Object icon scale
 * @text オブジェクトアイコン倍率
 * @type number
 * @decimals 2
 * @default 0.60
 * @desc 人・オブジェクトアイコンの基準拡大率です。
 *
 * @param Icon smoothing
 * @text アイコンの線形補間(ぼかし)
 * @type boolean
 * @default false
 * @desc 縮小時の補間処理。falseにすると輪郭の白いフチ浮きや滲みを防ぎくっきり描画します。
 *
 * @param Snap icon pixel
 * @text アイコン座標の整数スナップ
 * @type boolean
 * @default true
 * @desc 移動中のアイコン座標を整数pxに丸め、縮小時のチラつきや輪郭の滲みを防ぎます。
 *
 * @param Player icon blink
 * @text プレイヤーアイコンの点滅
 * @type boolean
 * @default true
 * @desc プレイヤー自身の現在地マークを点滅させるかどうかを指定します。
 *
 * @param Player blink time
 * @text プレイヤー点滅周期(フレーム)
 * @type number
 * @min 0
 * @default 0
 * @desc プレイヤーアイコンの点滅周期(0を指定すると「Blink time」と同じ値を使用)。
 *
 * @param Blink mode
 * @text チカチカ(点滅)方式
 * @type select
 * @option 白フラッシュ明滅 (標準)
 * @value flash
 * @option 不透明度点滅
 * @value alpha
 * @option 白フラッシュ＋不透明度点滅
 * @value both
 * @default flash
 * @desc アイコンの点滅表現方法を選択します。
 *
 * @param Blink max flash
 * @text 白フラッシュの最大強度
 * @type number
 * @min 0
 * @max 255
 * @default 140
 * @desc 白フラッシュ明滅の最大白さ(0〜255)。縮小時の白飛び・形状潰れを防ぐため140前後を推奨。
 *
 * @param Blink min opacity
 * @text 点滅時の最小不透明度
 * @type number
 * @min 0
 * @max 255
 * @default 80
 * @desc 不透明度点滅を使用する場合の最小不透明度(0〜255)です。
 *
 * @param Default pulse scale
 * @text 拡縮演出の標準最大倍率
 * @type number
 * @decimals 2
 * @default 1.40
 * @desc <ミニマップ: 拡縮> 指定時の標準最大倍率です。
 *
 * @param Default pulse period
 * @text 拡縮演出の標準周期
 * @type number
 * @min 1
 * @default 60
 * @desc <ミニマップ: 拡縮> 指定時の1往復あたりのフレーム数です。
 *
 * @param Message behavior
 * @text 会話中の挙動(通常)
 * @type select
 * @option そのまま表示
 * @value keep
 * @option 半透明化
 * @value fade
 * @option 非表示
 * @value hide
 * @default keep
 * @desc メッセージウィンドウ表示中のミニマップの挙動です。
 *
 * @param Top message behavior
 * @text 会話中の挙動(上ウィンドウ時)
 * @type select
 * @option 通常設定に従う
 * @value inherit
 * @option そのまま表示
 * @value keep
 * @option 半透明化
 * @value fade
 * @option 非表示
 * @value hide
 * @default fade
 * @desc メッセージウィンドウが「上」表示のときの個別挙動です。
 *
 * @param Message fade opacity
 * @text 会話中半透明の不透明度
 * @type number
 * @min 0
 * @max 255
 * @default 64
 * @desc 会話中に半透明化する際の目標不透明度(0〜255)です。
 *
 * @param Message fade speed
 * @text 会話中フェード速度
 * @type number
 * @min 1
 * @max 255
 * @default 16
 * @desc 会話開始・終了時に不透明度が変化する1フレームあたりの速度です。
 *
 * @param Border color
 * @text 外枠ボーダー色
 * @default rgba(255, 255, 255, 0.45)
 * @desc ミニマップ外周の枠線色(CSSカラー)。空欄にすると枠線を描画しません。
 *
 * @param Border width
 * @text 外枠ボーダー太さ
 * @type number
 * @min 0
 * @max 10
 * @default 1
 * @desc ミニマップ外周の枠線の太さ(px)です。
 *
 * @help
 * ## マップメモ欄タグ
 * <NoMinimap>                     # そのマップではミニマップを非表示にします
 * <MinimapBounds: x1, x2, y1, y2> # 端止めスクロールのタイル範囲を手動指定します(任意)
 *
 * ## イベント注釈タグ（イベントページの先頭に「注釈」で記述）
 * <ミニマップ: 壁>           # 通行不可の壁として扱います
 * <ミニマップ: 移動>         # 移動アイコンを表示します
 * <ミニマップ: 人物 N>       # 人物アイコン(N番)を表示します
 * <ミニマップ: OBJ N>        # オブジェクトアイコン(N番)を表示します
 * <ミニマップ: 起点>         # 魔法陣のワープ先など、孤立エリアの探索起点に追加します
 * <ミニマップ: 貫通>         # いわくだき岩や扉など、その先へ到達探索を通過させます
 * <ミニマップ: 色 #00ff88>   # そのマスを指定したCSSカラーで塗ります
 * <ミニマップ: 点滅無効>     # このアイコンの点滅(チカチカ)を無効にします
 * <ミニマップ: 点滅周期 30>  # このアイコンの点滅周期(フレーム数)を個別に変更します
 * <ミニマップ: 拡縮>         # このアイコンの拡大縮小アニメーションを有効にします
 * <ミニマップ: 拡縮 1.5 60>  # 最大倍率(1.5倍)と周期(60F)を指定して拡大縮小させます
 *
 * ## プラグインコマンド
 * Minimap show     # ミニマップを表示します。<NoMinimap> を指定したマップでは表示できません。
 * Minimap hide     # ミニマップを隠します。
 * Minimap refresh  # ミニマップを再計算・再描画します。
 *
 * @requiredAssets img/system/MinimapPlayerIcon
 * @requiredAssets img/system/MinimapObjectIcon
 */

var KMS = KMS || {};

(function()
{

'use strict';

KMS.imported = KMS.imported || {};
KMS.imported['Minimap'] = true;

/**
 * 矩形を表す文字列を解析
 */
var parseRect = function(str)
{
    var rectReg = /([-]?\d+),\s*([-]?\d+),\s*([-]?\d+),\s*([-]?\d+)/;
    var rect = new PIXI.Rectangle(524, 32, 260, 200);
    var match = rectReg.exec(str);
    if (match)
    {
        rect.x      = Number(match[1]);
        rect.y      = Number(match[2]);
        rect.width  = Number(match[3]);
        rect.height = Number(match[4]);
    }

    return rect;
};

/**
 * 4要素の数値配列(色調など)を解析
 */
var parseTone = function(str)
{
    var reg = /([-]?\d+),\s*([-]?\d+),\s*([-]?\d+),\s*([-]?\d+)/;
    var match = reg.exec(str);
    if (match)
    {
        return [
            Number(match[1]),
            Number(match[2]),
            Number(match[3]),
            Number(match[4])
        ];
    }
    return [0, 0, 0, 0];
};

/**
 * CSSカラー文字列からPIXI用16進数カラーとアルファ値を抽出
 */
var parseCssColor = function(cssColor)
{
    if (!cssColor)
    {
        return null;
    }
    var str = String(cssColor).trim();
    if (!str)
    {
        return null;
    }

    var rgbaMatch = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)/i.exec(str);
    if (rgbaMatch)
    {
        var r = Math.max(0, Math.min(255, Number(rgbaMatch[1])));
        var g = Math.max(0, Math.min(255, Number(rgbaMatch[2])));
        var b = Math.max(0, Math.min(255, Number(rgbaMatch[3])));
        var a = rgbaMatch[4] !== undefined ? Math.max(0, Math.min(1, Number(rgbaMatch[4]))) : 1.0;
        return { color: (r << 16) | (g << 8) | b, alpha: a };
    }

    var hexMatch = /^#([0-9a-f]{6})$/i.exec(str);
    if (hexMatch)
    {
        return { color: parseInt(hexMatch[1], 16), alpha: 1.0 };
    }

    return { color: 0xffffff, alpha: 0.5 };
};

var pluginParams = PluginManager.parameters('KMS_Minimap');
var Params = {};
Params.mapRect = parseRect(pluginParams['Map rect']);
Params.gridSize = Number(pluginParams['Grid size'] || 10);
Params.blinkTime = Number(pluginParams['Blink time'] || 180);
Params.foregroundColor = pluginParams['Foreground color'] || 'rgba(224, 224, 240, 0.6)';
Params.backgroundColor = pluginParams['Background color'] || 'rgba(  0,   0, 160, 0.6)';
Params.playerIconImage = pluginParams['Player icon'] || 'MinimapPlayerIcon';
Params.objectIconImage = pluginParams['Object icon'] || 'MinimapObjectIcon';
Params.displayTileImage = pluginParams['Display tile'];
Params.maskStyle = Number(pluginParams['Mask style'] || 0);
Params.maskRadius = Number(pluginParams['Mask radius'] || 48);

// 拡張パラメータ
Params.clampAtMapEdge = String(pluginParams['Clamp at map edge'] || 'true') === 'true';
Params.edgePaddingTiles = Math.max(0, Number(pluginParams['Edge padding tiles'] !== undefined ? pluginParams['Edge padding tiles'] : 2));
Params.shrinkGridBorder = String(pluginParams['Shrink grid border'] || 'false') === 'true';
Params.reachabilityCheck = String(pluginParams['Reachability check'] || 'true') === 'true';
Params.fixedEventBlocks = String(pluginParams['Fixed event blocks passage'] || 'true') === 'true';
Params.mapColorTone = parseTone(pluginParams['Map color tone'] !== undefined ? pluginParams['Map color tone'] : '0, 0, 0, 0');
Params.playerIconScale = Number(pluginParams['Player icon scale'] || 0.60);
Params.objectIconScale = Number(pluginParams['Object icon scale'] || 0.60);
Params.iconSmoothing = String(pluginParams['Icon smoothing'] || 'false') === 'true';
Params.snapIconPixel = String(pluginParams['Snap icon pixel'] || 'true') === 'true';
Params.playerIconBlink = String(pluginParams['Player icon blink'] || 'true') === 'true';
Params.playerBlinkTime = Math.max(0, Number(pluginParams['Player blink time'] || 0));
Params.blinkMode = String(pluginParams['Blink mode'] || 'flash');
Params.blinkMaxFlash = Math.max(0, Math.min(255, Number(pluginParams['Blink max flash'] !== undefined ? pluginParams['Blink max flash'] : 140)));
Params.blinkMinOpacity = Math.max(0, Math.min(255, Number(pluginParams['Blink min opacity'] !== undefined ? pluginParams['Blink min opacity'] : 80)));
Params.defaultPulseScale = Number(pluginParams['Default pulse scale'] || 1.40);
Params.defaultPulsePeriod = Math.max(1, Number(pluginParams['Default pulse period'] || 60));
Params.messageBehavior = String(pluginParams['Message behavior'] || 'keep');
Params.topMessageBehavior = String(pluginParams['Top message behavior'] || 'fade');
Params.messageFadeOpacity = Number(pluginParams['Message fade opacity'] || 64);
Params.messageFadeSpeed = Math.max(1, Number(pluginParams['Message fade speed'] || 16));
Params.borderColor = String(pluginParams['Border color'] !== undefined ? pluginParams['Border color'] : 'rgba(255, 255, 255, 0.45)');
Params.borderWidth = Math.max(0, Number(pluginParams['Border width'] !== undefined ? pluginParams['Border width'] : 1));

var Minimap = {};
Minimap.passageCacheCountMax = 5;
Minimap.regex = {
    wallEvent:    /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:壁|障害物|WALL)>/i,
    moveEvent:    /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:移動|MOVE)>/i,
    person:       /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:人物|PERSON)\s*(\d+)>/i,
    object:       /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*OBJ(?:ECT)?\s*(\d+)>/i,
    seed:         /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:起点|SEED)>/i,
    through:      /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:貫通|例外|THROUGH)>/i,
    color:        /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:色|COLOR)\s*([^>]+)>/i,
    noBlink:      /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:点滅無効|NO_?BLINK)>/i,
    blinkTime:    /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:点滅周期|BLINK_?TIME)\s*(\d+)>/i,
    pulse:        /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:拡縮|拡大縮小|PULSE)(?:\s+([0-9.]+))?(?:\s+(\d+))?\s*>/i
};
Minimap.keysRequireNumber = [ 'person', 'object' ];
Minimap.dirFlags = { down: 0x01, left: 0x02, right: 0x04, up: 0x08 };
Minimap.maskStyles = { none: 0, ellipse: 1, roundedRect: 2, hex1: 3, hex2: 4 };


/**
 * 指定した円に内接する正 n 角形の塗り潰し／描画
 */
var drawRegularPolygon = function(graphics, x, y, width, height, startRad, vertexCount)
{
    if (vertexCount < 1)
    {
        return;
    }

    var points = [];
    for (var i = 0; i < vertexCount; i++)
    {
        var angle = i * Math.PI * 2 / vertexCount - Math.PI / 2 + startRad;
        points.push(x + Math.cos(angle) * width);
        points.push(y + Math.sin(angle) * height);
    }

    graphics.drawPolygon(points);
};


//-----------------------------------------------------------------------------
// Plugin commands

var _KMS_Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args)
{
    _KMS_Game_Interpreter_pluginCommand.call(this, command, args);

    if (command !== 'Minimap')
    {
        return;
    }

    switch (args[0])
    {
    case 'show':
        $gameSystem.setMinimapEnabled(true);
        break;
    case 'hide':
        $gameSystem.setMinimapEnabled(false);
        break;
    case 'refresh':
        $gameMap.refreshMinimapCache();
        break;
    default:
        console.log('[Minimap %1] Unknown command.'.format(args[0]));
        break;
    }
};


//-----------------------------------------------------------------------------
// Tilemap

Tilemap.prototype.getTileCount = function()
{
    return {
        x: Math.ceil(this._width  / this._tileWidth)  + 1,
        y: Math.ceil(this._height / this._tileHeight) + 1
    };
};


//-----------------------------------------------------------------------------
// Game_Temp

var _KMS_Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function()
{
    _KMS_Game_Temp_initialize.call(this);

    this._minimapPassageCache     = [];
    this._minimapCacheRefreshFlag = false;
};

Object.defineProperty(Game_Temp.prototype, 'minimapCacheRefreshFlag', {
    get: function()
    {
        return this._minimapCacheRefreshFlag;
    },
    set: function(value)
    {
        this._minimapCacheRefreshFlag = value;
    },
    configurable: true
});

Game_Temp.prototype.registerMinimapPassageCache = function(mapId, passage)
{
    var newCache = [ { mapId: mapId, passage: passage } ].concat(
        this._minimapPassageCache.filter(function(cache)
        {
            return cache.mapId !== mapId;
        }));

    this._minimapPassageCache = newCache.slice(0, Minimap.passageCacheCountMax);
};

Game_Temp.prototype.getMinimapPassageCache = function(mapId)
{
    for (var i = 0; i < this._minimapPassageCache.length; i++)
    {
        var tempCache = this._minimapPassageCache[i];
        if (tempCache.mapId !== mapId)
        {
            continue;
        }

        if (i > 0)
        {
            this.registerMinimapPassageCache(mapId, tempCache.passage);
        }
        return tempCache;
    }

    return null;
};

Game_Temp.prototype.clearMinimapPassageCache = function()
{
    this._minimapPassageCache     = [];
    this._minimapCacheRefreshFlag = true;
};


//-----------------------------------------------------------------------------
// Game_System

Game_System.prototype.isMinimapEnabled = function()
{
    return this._minimapEnabled != null ? this._minimapEnabled : true;
};

Game_System.prototype.setMinimapEnabled = function(enabled)
{
    this._minimapEnabled = !!enabled;
};


//-----------------------------------------------------------------------------
// Game_Map

var _KMS_Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId)
{
    _KMS_Game_Map_setup.call(this, mapId);

    this.setupMinimap();
};

Game_Map.prototype.setupMinimap = function()
{
    this._minimapEnabled = !$dataMap.meta.NoMinimap;
    this._minimapManualBounds = null;

    if ($dataMap.meta.MinimapBounds)
    {
        var reg = /([-]?\d+),\s*([-]?\d+),\s*([-]?\d+),\s*([-]?\d+)/;
        var match = reg.exec(String($dataMap.meta.MinimapBounds));
        if (match)
        {
            this._minimapManualBounds = {
                minX: Number(match[1]),
                maxX: Number(match[2]),
                minY: Number(match[3]),
                maxY: Number(match[4])
            };
        }
    }

    this.refreshMinimapCache();
};

Game_Map.prototype.isMinimapEnabled = function()
{
    return this._minimapEnabled;
};

Game_Map.prototype.minimapManualBounds = function()
{
    return this._minimapManualBounds;
};

Game_Map.prototype.refreshMinimapCache = function()
{
    $gameTemp.clearMinimapPassageCache();
};


//-----------------------------------------------------------------------------
// Game_Character

Game_Character.prototype.isMinimapAttributeDirty = function()
{
    return false;
};

Game_Character.prototype.setMinimapAttributeDirty = function()
{
};

Game_Character.prototype.clearMinimapAttributeDirty = function()
{
};


//-----------------------------------------------------------------------------
// Game_Event

var _KMS_Game_Event_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function()
{
    _KMS_Game_Event_setupPage.call(this);

    this.setupMinimapAttribute();

    if ($gameMap && $gameTemp)
    {
        $gameMap.refreshMinimapCache();
    }
};

/**
 * ミニマップ用属性の設定
 */
Game_Event.prototype.setupMinimapAttribute = function()
{
    this._minimapAttribute = {
        dirty:       true,
        wall:        false,
        move:        false,
        person:      -1,
        object:      -1,
        seed:        false,
        through:     false,
        color:       null,
        noBlink:     false,
        blinkTime:   0,
        pulse:       false,
        pulseScale:  Params.defaultPulseScale,
        pulsePeriod: Params.defaultPulsePeriod
    };

    var isComment = function(command)
    {
        return command && (command.code === 108 || command.code === 408);
    };

    var page = this.page();
    if (!page)
    {
        return;
    }

    var commands = page.list;
    var index    = 0;
    var command  = commands[index++];
    while (isComment(command))
    {
        var comment = command.parameters[0];

        this._minimapAttribute.wall    |= Minimap.regex.wallEvent.test(comment);
        this._minimapAttribute.move    |= Minimap.regex.moveEvent.test(comment);
        this._minimapAttribute.seed    |= Minimap.regex.seed.test(comment);
        this._minimapAttribute.through |= Minimap.regex.through.test(comment);
        this._minimapAttribute.noBlink |= Minimap.regex.noBlink.test(comment);

        Minimap.keysRequireNumber.forEach(function(key)
        {
            var match = Minimap.regex[key].exec(comment);
            if (match)
            {
                this._minimapAttribute[key] = Number(match[1]);
            }
        }, this);

        var colorMatch = Minimap.regex.color.exec(comment);
        if (colorMatch)
        {
            this._minimapAttribute.color = colorMatch[1].trim();
        }

        var blinkMatch = Minimap.regex.blinkTime.exec(comment);
        if (blinkMatch)
        {
            this._minimapAttribute.blinkTime = Math.max(1, Number(blinkMatch[1]));
        }

        var pulseMatch = Minimap.regex.pulse.exec(comment);
        if (pulseMatch)
        {
            this._minimapAttribute.pulse = true;
            if (pulseMatch[1] !== undefined)
            {
                this._minimapAttribute.pulseScale = Number(pulseMatch[1]);
            }
            if (pulseMatch[2] !== undefined)
            {
                this._minimapAttribute.pulsePeriod = Math.max(1, Number(pulseMatch[2]));
            }
        }

        command = commands[index++];
    }
};

Game_Event.prototype.isMinimapAttributeDirty = function()
{
    return this._minimapAttribute.dirty;
};

Game_Event.prototype.setMinimapAttributeDirty = function()
{
    this._minimapAttribute.dirty = true;
};

Game_Event.prototype.clearMinimapAttributeDirty = function()
{
    this._minimapAttribute.dirty = false;
};

Game_Event.prototype.isMinimapWall = function()
{
    return !!this._minimapAttribute.wall;
};

Game_Event.prototype.isMinimapMove = function()
{
    return !!this._minimapAttribute.move;
};

Game_Event.prototype.isMinimapSeed = function()
{
    return !!this._minimapAttribute.seed;
};

Game_Event.prototype.isMinimapThrough = function()
{
    return !!this._minimapAttribute.through;
};

Game_Event.prototype.minimapCustomColor = function()
{
    return this._minimapAttribute.color;
};

Game_Event.prototype.isMinimapNoBlink = function()
{
    return !!this._minimapAttribute.noBlink;
};

Game_Event.prototype.minimapBlinkTime = function()
{
    return this._minimapAttribute.blinkTime || Params.blinkTime;
};

Game_Event.prototype.isMinimapPulse = function()
{
    return !!this._minimapAttribute.pulse;
};

Game_Event.prototype.minimapPulseScale = function()
{
    return this._minimapAttribute.pulseScale;
};

Game_Event.prototype.minimapPulsePeriod = function()
{
    return this._minimapAttribute.pulsePeriod;
};

Game_Event.prototype.minimapPersonType = function()
{
    return this._minimapAttribute.person;
};

Game_Event.prototype.minimapObjectType = function()
{
    return this._minimapAttribute.object;
};


//-----------------------------------------------------------------------------
// Game_Vehicle

Game_Vehicle.prototype.isInCurrentMap = function()
{
    return this._mapId === $gameMap.mapId();
};


//-----------------------------------------------------------------------------
// Game_MinimapPassageCache
//
// マップ全体の通行フラグ・到達可能領域・カスタム色・外接境界を保持します。

function Game_MinimapPassageCache()
{
    this.initialize.apply(this, arguments);
}

Game_MinimapPassageCache.prototype.initialize = function(map)
{
    this._mapId = map.mapId();
    this._width = map.width();
    this._height = map.height();

    var size = this._width * this._height;
    this._flags = new Array(size);
    this._reachable = new Array(size);
    this._customColors = new Array(size);
    this._bounds = { minX: 0, maxX: this._width - 1, minY: 0, maxY: this._height - 1 };
    this._built = false;
};

Game_MinimapPassageCache.prototype.normalizeCoord = function(x, y)
{
    if ($gameMap.isLoopHorizontal())
    {
        x = ((x % this._width) + this._width) % this._width;
    }
    else if (x < 0 || x >= this._width)
    {
        return null;
    }

    if ($gameMap.isLoopVertical())
    {
        y = ((y % this._height) + this._height) % this._height;
    }
    else if (y < 0 || y >= this._height)
    {
        return null;
    }

    return { x: x, y: y };
};

/**
 * マップ全体の通行データ・到達可能領域・有効境界を一括構築
 */
Game_MinimapPassageCache.prototype.build = function(originX, originY)
{
    var w = this._width;
    var h = this._height;
    var size = w * h;

    var wallMap = new Array(size);
    var throughMap = new Array(size);
    var fixedBlockMap = new Array(size);
    var seedQueue = [];

    for (var idx = 0; idx < size; idx++)
    {
        this._flags[idx] = 0;
        this._reachable[idx] = 0;
        this._customColors[idx] = null;
        wallMap[idx] = false;
        throughMap[idx] = false;
        fixedBlockMap[idx] = false;
    }

    var events = $gameMap.events();
    for (var i = 0; i < events.length; i++)
    {
        var ev = events[i];
        if (!ev || ev._erased)
        {
            continue;
        }
        var ex = ev.x;
        var ey = ev.y;
        if (ex < 0 || ex >= w || ey < 0 || ey >= h)
        {
            continue;
        }
        var eIdx = ex + ey * w;

        if (ev.isMinimapWall())
        {
            wallMap[eIdx] = true;
        }
        if (ev.isMinimapThrough())
        {
            throughMap[eIdx] = true;
        }
        if (ev.isMinimapSeed())
        {
            seedQueue.push({ x: ex, y: ey });
        }
        if (ev.minimapCustomColor())
        {
            this._customColors[eIdx] = ev.minimapCustomColor();
        }

        if (Params.fixedEventBlocks && !ev.isMinimapThrough() &&
            ev._moveType === 0 && ev.isNormalPriority() && !ev.isThrough())
        {
            fixedBlockMap[eIdx] = true;
        }
    }

    for (var y = 0; y < h; y++)
    {
        for (var x = 0; x < w; x++)
        {
            var tIdx = x + y * w;
            if (wallMap[tIdx])
            {
                this._flags[tIdx] = 0;
                continue;
            }

            var flag = 0;
            for (var d = 0; d < 4; d++)
            {
                var dir = (d + 1) * 2;
                if ($gameMap.isPassable(x, y, dir))
                {
                    flag |= 1 << (dir / 2 - 1);
                }
            }
            if (flag === 0 && throughMap[tIdx])
            {
                flag = 0x0f;
            }
            this._flags[tIdx] = flag;
        }
    }

    if (!Params.reachabilityCheck)
    {
        for (var k = 0; k < size; k++)
        {
            this._reachable[k] = this._flags[k] !== 0 ? 1 : 0;
        }
        this.computeBounds();
        this._built = true;
        return;
    }

    var queue = [];
    var enqueue = function(qx, qy)
    {
        var norm = this.normalizeCoord(qx, qy);
        if (!norm)
        {
            return;
        }
        var nIdx = norm.x + norm.y * w;
        if (wallMap[nIdx] || this._reachable[nIdx])
        {
            return;
        }
        this._reachable[nIdx] = 1;
        queue.push(norm);
    }.bind(this);

    enqueue(originX, originY);
    for (var s = 0; s < seedQueue.length; s++)
    {
        enqueue(seedQueue[s].x, seedQueue[s].y);
    }

    var dirs = [
        { dir: 2, dx:  0, dy:  1, rev: 8 },
        { dir: 4, dx: -1, dy:  0, rev: 6 },
        { dir: 6, dx:  1, dy:  0, rev: 4 },
        { dir: 8, dx:  0, dy: -1, rev: 2 }
    ];

    var head = 0;
    while (head < queue.length)
    {
        var curr = queue[head++];
        var cIdx = curr.x + curr.y * w;
        var isCurrThrough = throughMap[cIdx];

        for (var j = 0; j < 4; j++)
        {
            var info = dirs[j];
            var next = this.normalizeCoord(curr.x + info.dx, curr.y + info.dy);
            if (!next)
            {
                continue;
            }
            var nIdx = next.x + next.y * w;
            if (this._reachable[nIdx] || wallMap[nIdx])
            {
                continue;
            }

            var isNextThrough = throughMap[nIdx];
            if (isCurrThrough || isNextThrough)
            {
                this._reachable[nIdx] = 1;
                queue.push(next);
                continue;
            }

            if (fixedBlockMap[nIdx])
            {
                continue;
            }

            var canLeave = $gameMap.isPassable(curr.x, curr.y, info.dir);
            var canEnter = $gameMap.isPassable(next.x, next.y, info.rev);
            if (canLeave && canEnter && this._flags[nIdx] !== 0)
            {
                this._reachable[nIdx] = 1;
                queue.push(next);
            }
        }
    }

    this.computeBounds();
    this._built = true;
};

/**
 * 到達可能領域の外接矩形（バウンディングボックス）を算出
 */
Game_MinimapPassageCache.prototype.computeBounds = function()
{
    var manual = $gameMap.minimapManualBounds();
    if (manual)
    {
        this._bounds = {
            minX: Math.max(0, Math.min(this._width - 1, manual.minX)),
            maxX: Math.max(0, Math.min(this._width - 1, manual.maxX)),
            minY: Math.max(0, Math.min(this._height - 1, manual.minY)),
            maxY: Math.max(0, Math.min(this._height - 1, manual.maxY))
        };
        return;
    }

    var w = this._width;
    var h = this._height;
    var minX = w;
    var maxX = -1;
    var minY = h;
    var maxY = -1;

    for (var y = 0; y < h; y++)
    {
        for (var x = 0; x < w; x++)
        {
            var idx = x + y * w;
            if (this._reachable[idx] && this._flags[idx] !== 0)
            {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }

    if (maxX < minX || maxY < minY)
    {
        // 万一到達タイルが見つからない場合はプレイヤー周辺を基準にする
        var px = Math.max(0, Math.min(w - 1, $gamePlayer.x));
        var py = Math.max(0, Math.min(h - 1, $gamePlayer.y));
        this._bounds = { minX: px, maxX: px, minY: py, maxY: py };
    }
    else
    {
        this._bounds = { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
    }
};

Game_MinimapPassageCache.prototype.getBounds = function()
{
    return this._bounds;
};

/**
 * プレイヤーが未到達エリアへワープした場合の追加探索
 */
Game_MinimapPassageCache.prototype.ensureReachableFrom = function(x, y)
{
    if (!this._built)
    {
        this.build(x, y);
        return true;
    }
    if (!Params.reachabilityCheck)
    {
        return false;
    }
    var norm = this.normalizeCoord(x, y);
    if (!norm)
    {
        return false;
    }
    var idx = norm.x + norm.y * this._width;
    if (!this._reachable[idx] && this._flags[idx] !== 0)
    {
        this.build(norm.x, norm.y);
        return true;
    }
    return false;
};

Game_MinimapPassageCache.prototype.getFlag = function(x, y)
{
    var norm = this.normalizeCoord(x, y);
    if (!norm)
    {
        return 0;
    }
    var idx = norm.x + norm.y * this._width;
    if (!this._reachable[idx])
    {
        return 0;
    }
    return this._flags[idx];
};

Game_MinimapPassageCache.prototype.isPassable = function(x, y)
{
    return this.getFlag(x, y) !== 0;
};

Game_MinimapPassageCache.prototype.isPassableDir = function(x, y, dir)
{
    var flag = this.getFlag(x, y);
    switch (dir)
    {
        case 2: return (flag & Minimap.dirFlags.down)  !== 0;
        case 4: return (flag & Minimap.dirFlags.left)  !== 0;
        case 6: return (flag & Minimap.dirFlags.right) !== 0;
        case 8: return (flag & Minimap.dirFlags.up)    !== 0;
        default: return false;
    }
};

Game_MinimapPassageCache.prototype.getCustomColor = function(x, y)
{
    var norm = this.normalizeCoord(x, y);
    if (!norm)
    {
        return null;
    }
    var idx = norm.x + norm.y * this._width;
    if (!this._reachable[idx])
    {
        return null;
    }
    return this._customColors[idx];
};


//-----------------------------------------------------------------------------
// Sprite_Minimap
//
// ミニマップ用のスプライトです。

function Sprite_Minimap()
{
    this.initialize.apply(this, arguments);
}

Sprite_Minimap.prototype = Object.create(Sprite_Base.prototype);
Sprite_Minimap.prototype.constructor = Sprite_Minimap;

Sprite_Minimap.prototype.initialize = function()
{
    Sprite_Base.prototype.initialize.call(this);

    var rect = Params.mapRect;
    this._viewTiles = {
        x: rect.width / Params.gridSize,
        y: rect.height / Params.gridSize
    };
    this._gridNumber = {
        x: Math.ceil(this._viewTiles.x),
        y: Math.ceil(this._viewTiles.y)
    };
    this._drawGridNumber = {
        x: this._gridNumber.x + 2,
        y: this._gridNumber.y + 2
    };

    this._camera = new PIXI.Point(0, 0);
    this._lastBaseTile = new PIXI.Point(NaN, NaN);
    this._messageFadeOpacity = 255;

    this.createSubSprites();

    this._baseOpacity = 255;
    this.setColorTone(Params.mapColorTone);

    this.move(rect.x, rect.y);
};

Sprite_Minimap.prototype.createSubSprites = function()
{
    this._bitmapSize = {
        width: this._drawGridNumber.x * Params.gridSize,
        height: this._drawGridNumber.y * Params.gridSize
    };

    this.createBaseSprite();
    this.createPassageSprite();
    this.createObjectSprites();
    this.createPlayerSprite();
    this.createBorderSprite();
};

Sprite_Minimap.prototype.createBaseSprite = function()
{
    var rect = Params.mapRect;

    this._baseSprite = new Sprite();
    this._baseSprite.bitmap = new Bitmap(rect.width, rect.height);
    this._baseSprite.bitmap.fillAll(Params.backgroundColor);

    this.addChild(this._baseSprite);

    if (Params.displayTileImage)
    {
        this._tilemap = Graphics.isWebGL() ?
            new ShaderTilemap() :
            new Tilemap();

        this._tilemap.update = null;
        this.addChild(this._tilemap);
    }

    this.applyMask(rect);
};

Sprite_Minimap.prototype.applyMask = function(rect)
{
    this._maskGraphic = new PIXI.Graphics();
    this._maskGraphic.beginFill(0x000000);

    switch (Params.maskStyle)
    {
        case Minimap.maskStyles.ellipse:
            this._maskGraphic.drawEllipse(rect.width / 2, rect.height / 2, rect.width / 2, rect.height / 2);
            break;

        case Minimap.maskStyles.roundedRect:
            this._maskGraphic.drawRoundedRect(0, 0, rect.width, rect.height, Params.maskRadius);
            break;

        case Minimap.maskStyles.hex1:
        case Minimap.maskStyles.hex2:
            drawRegularPolygon(
                this._maskGraphic,
                rect.width / 2,
                rect.height / 2,
                rect.width / 2,
                rect.height / 2,
                (Params.maskStyle === Minimap.maskStyles.hex1) ? 0 : (Math.PI / 2),
                6);
            break;

        default:
            this._maskGraphic.drawRect(0, 0, rect.width, rect.height);
            break;
    }

    this._maskGraphic.endFill();

    this.addChild(this._maskGraphic);
    this.mask = this._maskGraphic;
};

Sprite_Minimap.prototype.createBorderSprite = function()
{
    if (Params.borderWidth <= 0)
    {
        return;
    }
    var colorInfo = parseCssColor(Params.borderColor);
    if (!colorInfo)
    {
        return;
    }

    var rect = Params.mapRect;
    var bw = Params.borderWidth;
    var half = bw / 2;

    this._borderGraphic = new PIXI.Graphics();
    this._borderGraphic.lineStyle(bw, colorInfo.color, colorInfo.alpha);

    switch (Params.maskStyle)
    {
        case Minimap.maskStyles.ellipse:
            this._borderGraphic.drawEllipse(
                rect.width / 2,
                rect.height / 2,
                rect.width / 2 - half,
                rect.height / 2 - half);
            break;

        case Minimap.maskStyles.roundedRect:
            this._borderGraphic.drawRoundedRect(
                half,
                half,
                rect.width - bw,
                rect.height - bw,
                Math.max(0, Params.maskRadius - half));
            break;

        case Minimap.maskStyles.hex1:
        case Minimap.maskStyles.hex2:
            drawRegularPolygon(
                this._borderGraphic,
                rect.width / 2,
                rect.height / 2,
                rect.width / 2 - half,
                rect.height / 2 - half,
                (Params.maskStyle === Minimap.maskStyles.hex1) ? 0 : (Math.PI / 2),
                6);
            break;

        default:
            this._borderGraphic.drawRect(half, half, rect.width - bw, rect.height - bw);
            break;
    }

    this.addChild(this._borderGraphic);
};

Sprite_Minimap.prototype.createPassageSprite = function()
{
    this._passageSprite = new Sprite_MinimapPassage(this._bitmapSize.width, this._bitmapSize.height);
    this.addChild(this._passageSprite);
};

Sprite_Minimap.prototype.createObjectSprites = function()
{
    this._objectSprites = [];

    var objects = $gameMap.events().concat($gameMap.vehicles());
    objects.forEach(function(obj)
    {
        var sprite = new Sprite_MinimapIcon();
        sprite.setObject(obj);

        this._objectSprites.push(sprite);
        this.addChild(sprite);
    }, this);
};

Sprite_Minimap.prototype.createPlayerSprite = function()
{
    var rect = Params.mapRect;

    this._playerSprite = new Sprite_MinimapIcon();
    this._playerSprite.setAsPlayer(Params.playerIconImage);
    this._playerSprite.x = rect.width / 2;
    this._playerSprite.y = rect.height / 2;

    this.addChild(this._playerSprite);
};

Sprite_Minimap.prototype.setWholeOpacity = function(baseOpacity)
{
    var combined = (this._baseOpacity * baseOpacity / 255) * (this._messageFadeOpacity / 255);
    this.opacity = Math.round(combined);
};

Sprite_Minimap.prototype.move = function(x, y)
{
    this.x = x;
    this.y = y;
};

Sprite_Minimap.prototype.isNeedUpdate = function()
{
    return this.visible && this.opacity > 0;
};

Sprite_Minimap.prototype.update = function()
{
    Sprite_Base.prototype.update.call(this);

    this.updateVisibility();
    this.updateMessageFade();

    if ($gameTemp.minimapCacheRefreshFlag)
    {
        $gameTemp.minimapCacheRefreshFlag = false;
        this.refreshPassageTable();
        this._lastBaseTile.set(NaN, NaN);
    }

    if (!this.isNeedUpdate())
    {
        return;
    }

    if (this._passageCache && this._passageCache.ensureReachableFrom($gamePlayer.x, $gamePlayer.y))
    {
        this._lastBaseTile.set(NaN, NaN);
    }

    this.updateCamera();
    this.updatePosition();
    this.updateTilemap();
    this.updateObjectSprites();
    this.updatePlayerSprite();
};

Sprite_Minimap.prototype.updateVisibility = function()
{
    var enabled = $gameSystem.isMinimapEnabled() && $gameMap.isMinimapEnabled();
    if (!enabled)
    {
        this.visible = false;
        return;
    }

    var behavior = this.currentMessageBehavior();
    if (behavior === 'hide' && this._messageFadeOpacity <= 0)
    {
        this.visible = false;
    }
    else
    {
        this.visible = true;
    }
};

Sprite_Minimap.prototype.currentMessageBehavior = function()
{
    if (!$gameMessage || !$gameMessage.isBusy())
    {
        return 'keep';
    }
    if ($gameMessage.positionType() === 0 && Params.topMessageBehavior !== 'inherit')
    {
        return Params.topMessageBehavior;
    }
    return Params.messageBehavior;
};

Sprite_Minimap.prototype.updateMessageFade = function()
{
    var behavior = this.currentMessageBehavior();
    var targetOpacity = 255;

    if (behavior === 'hide')
    {
        targetOpacity = 0;
    }
    else if (behavior === 'fade')
    {
        targetOpacity = Params.messageFadeOpacity;
    }

    if (this._messageFadeOpacity < targetOpacity)
    {
        this._messageFadeOpacity = Math.min(targetOpacity, this._messageFadeOpacity + Params.messageFadeSpeed);
    }
    else if (this._messageFadeOpacity > targetOpacity)
    {
        this._messageFadeOpacity = Math.max(targetOpacity, this._messageFadeOpacity - Params.messageFadeSpeed);
    }
};

/**
 * カメラ左上タイル座標の更新（到達可能領域＋外周余白を基準とした端止めクランプ）
 */
Sprite_Minimap.prototype.updateCamera = function()
{
    var viewW = this._viewTiles.x;
    var viewH = this._viewTiles.y;
    var mapW = $gameMap.width();
    var mapH = $gameMap.height();

    var camX = ($gamePlayer._realX + 0.5) - viewW / 2;
    var camY = ($gamePlayer._realY + 0.5) - viewH / 2;

    var bounds = this._passageCache ?
        this._passageCache.getBounds() :
        { minX: 0, maxX: mapW - 1, minY: 0, maxY: mapH - 1 };

    var pad = Params.edgePaddingTiles;

    if (Params.clampAtMapEdge && !$gameMap.isLoopHorizontal())
    {
        var boundLeft = Math.max(0, bounds.minX - pad);
        var boundRight = Math.min(mapW, bounds.maxX + 1 + pad);
        var activeW = boundRight - boundLeft;

        if (activeW <= viewW)
        {
            camX = boundLeft + (activeW - viewW) / 2;
        }
        else
        {
            camX = Math.max(boundLeft, Math.min(camX, boundRight - viewW));
        }
    }

    if (Params.clampAtMapEdge && !$gameMap.isLoopVertical())
    {
        var boundTop = Math.max(0, bounds.minY - pad);
        var boundBottom = Math.min(mapH, bounds.maxY + 1 + pad);
        var activeH = boundBottom - boundTop;

        if (activeH <= viewH)
        {
            camY = boundTop + (activeH - viewH) / 2;
        }
        else
        {
            camY = Math.max(boundTop, Math.min(camY, boundBottom - viewH));
        }
    }

    this._camera.x = camX;
    this._camera.y = camY;
};

Sprite_Minimap.prototype.updateTilemap = function()
{
    if (!this._tilemap)
    {
        return;
    }

    this._tilemap.origin.x = this._camera.x * $gameMap.tileWidth();
    this._tilemap.origin.y = this._camera.y * $gameMap.tileHeight();
};

Sprite_Minimap.prototype.updateObjectSprites = function()
{
    var viewW = this._viewTiles.x;
    var viewH = this._viewTiles.y;
    var camX = this._camera.x;
    var camY = this._camera.y;

    this._objectSprites.forEach(function(sprite)
    {
        var obj = sprite.getObject();
        if (!obj)
        {
            sprite.visible = false;
            return;
        }

        sprite.updatePositionWithCamera(camX, camY, viewW, viewH);
    }, this);
};

Sprite_Minimap.prototype.updatePlayerSprite = function()
{
    var angle;
    if (KMS.imported['3DVehicle'] && $gameMap.is3DMode())
    {
        angle = -$gameMap.get3DPlayerAngle();
    }
    else
    {
        switch ($gamePlayer.direction())
        {
            case 2:  angle = Math.PI; break;
            case 4:  angle = Math.PI * 3 / 2; break;
            case 6:  angle = Math.PI / 2; break;
            case 8:  angle = 0; break;
            default: angle = 0; break;
        }
    }
    this._playerSprite.rotation = angle;
    this._playerSprite.scale.x = Params.playerIconScale;
    this._playerSprite.scale.y = Params.playerIconScale;

    var px = ($gamePlayer._realX + 0.5 - this._camera.x) * Params.gridSize;
    var py = ($gamePlayer._realY + 0.5 - this._camera.y) * Params.gridSize;
    if (Params.snapIconPixel)
    {
        px = Math.round(px);
        py = Math.round(py);
    }
    this._playerSprite.x = px;
    this._playerSprite.y = py;
};

Sprite_Minimap.prototype.refresh = function()
{
    this.refreshPassageTable();
    this._lastBaseTile.set(NaN, NaN);
    this.updateCamera();
    this.updatePosition();
    this.refreshTilemap();
};

Sprite_Minimap.prototype.refreshTilemap = function()
{
    if (!this._tilemap)
    {
        return;
    }

    var rect = Params.mapRect;
    var baseSize = {
        width:  Math.floor(rect.width  * $gameMap.tileWidth()  / Params.gridSize),
        height: Math.floor(rect.height * $gameMap.tileHeight() / Params.gridSize)
    };

    this._tilemap.tileWidth  = $gameMap.tileWidth();
    this._tilemap.tileHeight = $gameMap.tileHeight();
    this._tilemap.width      = baseSize.width;
    this._tilemap.height     = baseSize.height;
    this._tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
    this._tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
    this._tilemap.verticalWrap   = $gameMap.isLoopVertical();

    var scaleX = Params.mapRect.width / this._tilemap.width;
    var scaleY = Params.mapRect.height / this._tilemap.height;
    this._tilemap.scale.x = scaleX;
    this._tilemap.scale.y = scaleY;
    this._tilemap.x += this._tilemap._margin * scaleX;
    this._tilemap.y += this._tilemap._margin * scaleY;

    Spriteset_Map.prototype.loadTileset.call(this);

    (Graphics.isWebGL() ? ShaderTilemap : Tilemap)
        .prototype.update.call(this._tilemap);

    this._tileCount = this._tilemap.getTileCount();
};

Sprite_Minimap.prototype.refreshPassageTable = function()
{
    this._passageCache = new Game_MinimapPassageCache($gameMap);
    this._passageCache.build($gamePlayer.x, $gamePlayer.y);
};

Sprite_Minimap.prototype.updatePosition = function()
{
    var baseX = Math.floor(this._camera.x);
    var baseY = Math.floor(this._camera.y);

    if (this._lastBaseTile.x !== baseX || this._lastBaseTile.y !== baseY)
    {
        this.drawMap(baseX, baseY);
        this._lastBaseTile.set(baseX, baseY);
    }

    var subX = Math.round((this._camera.x - baseX) * Params.gridSize);
    var subY = Math.round((this._camera.y - baseY) * Params.gridSize);
    var rect = Params.mapRect;
    this._passageSprite.setFrame(subX, subY, rect.width, rect.height);
};

Sprite_Minimap.prototype.drawMap = function(baseX, baseY)
{
    var bitmap = this._passageSprite.bitmap;
    bitmap.clear();

    var cols = this._drawGridNumber.x;
    var rows = this._drawGridNumber.y;

    for (var gy = 0; gy < rows; gy++)
    {
        var ty = baseY + gy;
        for (var gx = 0; gx < cols; gx++)
        {
            var tx = baseX + gx;
            this.drawMapForegroundGrid(bitmap, tx, ty, gx, gy);
        }
    }
};

Sprite_Minimap.prototype.drawMapForegroundGrid = function(bitmap, tx, ty, gx, gy)
{
    var passage = this._passageCache;
    if (!passage || !passage.isPassable(tx, ty))
    {
        return;
    }

    var dx = gx * Params.gridSize;
    var dy = gy * Params.gridSize;
    var dw = Params.gridSize;
    var dh = Params.gridSize;

    if (Params.shrinkGridBorder && Params.gridSize > 2)
    {
        if (!passage.isPassableDir(tx, ty, 2))
        {
            dh -= 1;
        }
        if (!passage.isPassableDir(tx, ty, 4))
        {
            dx += 1;
            dw -= 1;
        }
        if (!passage.isPassableDir(tx, ty, 6))
        {
            dw -= 1;
        }
        if (!passage.isPassableDir(tx, ty, 8))
        {
            dy += 1;
            dh -= 1;
        }
    }

    var fillColor = passage.getCustomColor(tx, ty) || Params.foregroundColor;
    bitmap.fillRect(dx, dy, dw, dh, fillColor);
};


//-----------------------------------------------------------------------------
// Sprite_MinimapPassage

function Sprite_MinimapPassage()
{
    this.initialize.apply(this, arguments);
}

Sprite_MinimapPassage.prototype = Object.create(Sprite.prototype);
Sprite_MinimapPassage.prototype.constructor = Sprite_MinimapPassage;

Sprite_MinimapPassage.prototype.initialize = function(width, height)
{
    Sprite.prototype.initialize.call(this);

    this.bitmap = new Bitmap(width, height);
};


//-----------------------------------------------------------------------------
// Sprite_MinimapIcon

function Sprite_MinimapIcon()
{
    this.initialize.apply(this, arguments);
}

Sprite_MinimapIcon.prototype = Object.create(Sprite.prototype);
Sprite_MinimapIcon.prototype.constructor = Sprite_MinimapIcon;

Sprite_MinimapIcon.prototype.initialize = function()
{
    Sprite.prototype.initialize.call(this);

    this.bitmap   = ImageManager.loadSystem(Params.objectIconImage);
    this.applySmoothingSetting(this.bitmap);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this._object        = null;
    this._isPlayer      = false;
    this._lastIconIndex = -1;
    this._blinkDuration = 0;
    this._pulseDuration = 0;
    this._baseScaleX    = Params.objectIconScale;
    this._baseScaleY    = Params.objectIconScale;
};

Sprite_MinimapIcon.prototype.applySmoothingSetting = function(bitmap)
{
    if (!bitmap)
    {
        return;
    }
    bitmap.smooth = Params.iconSmoothing;
    bitmap.addLoadListener(function()
    {
        bitmap.smooth = Params.iconSmoothing;
    });
};

Sprite_MinimapIcon.prototype.setAsPlayer = function(imageName)
{
    this._isPlayer = true;
    this._object = null;
    this.bitmap = ImageManager.loadSystem(imageName);
    this.applySmoothingSetting(this.bitmap);
    this._baseScaleX = Params.playerIconScale;
    this._baseScaleY = Params.playerIconScale;
    this.scale.x = this._baseScaleX;
    this.scale.y = this._baseScaleY;
};

Sprite_MinimapIcon.prototype.isReady = function()
{
    return this.bitmap && this.bitmap.isReady();
};

Sprite_MinimapIcon.prototype.getObject = function()
{
    return this._object;
};

Sprite_MinimapIcon.prototype.setObject = function(object)
{
    this._isPlayer = false;
    this._object = object;
    if (object)
    {
        this.bitmap = ImageManager.loadSystem(Params.objectIconImage);
        this.applySmoothingSetting(this.bitmap);
        this.updateIconInfo();
    }

    this.refresh();
};

/**
 * カメラ座標基準での表示位置・可視範囲更新
 */
Sprite_MinimapIcon.prototype.updatePositionWithCamera = function(camX, camY, viewW, viewH)
{
    var obj = this._object;
    var ox = obj._realX + 0.5;
    var oy = obj._realY + 0.5;

    if ($gameMap.isLoopHorizontal())
    {
        var mapW = $gameMap.width();
        var centerX = camX + viewW / 2;
        var diffX = ox - centerX;
        diffX = diffX - Math.round(diffX / mapW) * mapW;
        ox = centerX + diffX;
    }

    if ($gameMap.isLoopVertical())
    {
        var mapH = $gameMap.height();
        var centerY = camY + viewH / 2;
        var diffY = oy - centerY;
        diffY = diffY - Math.round(diffY / mapH) * mapH;
        oy = centerY + diffY;
    }

    var relX = ox - camX;
    var relY = oy - camY;

    if (relX < -1 || relX > viewW + 1 || relY < -1 || relY > viewH + 1)
    {
        this.visible = false;
        this._inView = false;
        return;
    }

    var px = relX * Params.gridSize;
    var py = relY * Params.gridSize;
    if (Params.snapIconPixel)
    {
        px = Math.round(px);
        py = Math.round(py);
    }
    this.x = px;
    this.y = py;
    this._inView = true;
};

Sprite_MinimapIcon.prototype.updateIconInfo = function()
{
    if (!this.isReady())
    {
        this._iconSize    = null;
        this._iconColumns = null;
        return;
    }

    this._iconSize    = Math.floor(this.bitmap.height / 3);
    this._iconColumns = Math.floor(this.bitmap.width / this._iconSize);
};

Sprite_MinimapIcon.prototype.refresh = function()
{
    this._lastIconIndex = -1;
};

Sprite_MinimapIcon.prototype.update = function()
{
    Sprite.prototype.update.call(this);

    this.updateImage();
    this.updateBlink();
    this.updatePulse();
};

Sprite_MinimapIcon.prototype.updateImage = function()
{
    if (this._isPlayer || !this._object)
    {
        return;
    }

    if (!this._iconColumns)
    {
        this.updateIconInfo();
    }

    var iconIndex = this.getCurrentIconIndex();
    if (iconIndex >= 0)
    {
        if (iconIndex !== this._lastIconIndex || this._object.isMinimapAttributeDirty())
        {
            this.setIconIndex(iconIndex);
        }
        this.visible = !!this._inView;
    }
    else
    {
        this._lastIconIndex = iconIndex;
        this.visible = false;
    }
};

Sprite_MinimapIcon.prototype.getCurrentIconIndex = function()
{
    if (!(this._object && this.isReady()))
    {
        return -1;
    }

    if (this._object instanceof Game_Vehicle)
    {
        return this.getCurrentIconIndexForVehicle();
    }
    else
    {
        return this.getCurrentIconIndexForEvent();
    }
};

Sprite_MinimapIcon.prototype.getCurrentIconIndexForEvent = function()
{
    var obj = this._object;

    if (obj.isMinimapMove())
    {
        return 0;
    }
    else if (obj.minimapPersonType() >= 0)
    {
        return this._iconColumns + obj.minimapPersonType();
    }
    else if (obj.minimapObjectType() >= 0)
    {
        return this._iconColumns * 2 + obj.minimapObjectType();
    }
    else
    {
        return -1;
    }
};

Sprite_MinimapIcon.prototype.getCurrentIconIndexForVehicle = function()
{
    var obj = this._object;

    if (!obj.isInCurrentMap())
    {
        return -1;
    }
    else if (obj.isBoat())
    {
        return $gamePlayer.isInBoat() ? -1 : 1;
    }
    else if (obj.isShip())
    {
        return $gamePlayer.isInShip() ? -1 : 2;
    }
    else if (obj.isAirship())
    {
        return $gamePlayer.isInAirship() ? -1 : 3;
    }
    else
    {
        return -1;
    }
};

Sprite_MinimapIcon.prototype.setIconIndex = function(iconIndex)
{
    this.setFrame(
        (iconIndex % this._iconColumns) * this._iconSize,
        Math.floor(iconIndex / this._iconColumns) * this._iconSize,
        this._iconSize,
        this._iconSize);
    this.updateDisplaySize();

    this._object.clearMinimapAttributeDirty();
    this._lastIconIndex = iconIndex;
};

Sprite_MinimapIcon.prototype.updateDisplaySize = function()
{
    var scaleX = Params.objectIconScale;
    var scaleY = Params.objectIconScale;

    if (KMS.imported['AreaEvent'] && (this._object instanceof Game_Event))
    {
        var area = this._object.getEventTriggerArea();
        scaleX *= area.width;
        scaleY *= area.height;
    }

    this._baseScaleX = scaleX;
    this._baseScaleY = scaleY;
    this.scale.x = scaleX;
    this.scale.y = scaleY;
};

/**
 * 明滅（チカチカ）エフェクトの更新（縮小時の白飛び・フチ浮き抑制対応）
 */
Sprite_MinimapIcon.prototype.updateBlink = function()
{
    var obj = this._object;
    var blinkDisabled = false;
    var blinkTime = Params.blinkTime;

    if (this._isPlayer)
    {
        blinkDisabled = !Params.playerIconBlink;
        blinkTime = Params.playerBlinkTime > 0 ? Params.playerBlinkTime : Params.blinkTime;
    }
    else if (obj && (obj instanceof Game_Event))
    {
        blinkDisabled = obj.isMinimapNoBlink();
        blinkTime = obj.minimapBlinkTime();
    }

    if (blinkDisabled)
    {
        this.setBlendColor([0, 0, 0, 0]);
        this.opacity = 255;
        return;
    }

    blinkTime = Math.max(1, blinkTime);
    this._blinkDuration = (this._blinkDuration + 1) % blinkTime;

    var wave = 0.5 * (Math.sin(this._blinkDuration * Math.PI * 2 / blinkTime) + 1);
    var flashAlpha = Math.round(Params.blinkMaxFlash * wave);
    var minOp = Params.blinkMinOpacity;
    var alphaOp = Math.round(minOp + (255 - minOp) * wave);

    if (Params.blinkMode === 'alpha')
    {
        this.setBlendColor([0, 0, 0, 0]);
        this.opacity = alphaOp;
    }
    else if (Params.blinkMode === 'both')
    {
        this.setBlendColor([255, 255, 255, flashAlpha]);
        this.opacity = alphaOp;
    }
    else
    {
        this.setBlendColor([255, 255, 255, flashAlpha]);
        this.opacity = 255;
    }
};

/**
 * 拡大縮小（パルス）エフェクトの更新
 */
Sprite_MinimapIcon.prototype.updatePulse = function()
{
    var obj = this._object;
    if (this._isPlayer || !obj || !(obj instanceof Game_Event) || !obj.isMinimapPulse())
    {
        if (!this._isPlayer)
        {
            this.scale.x = this._baseScaleX;
            this.scale.y = this._baseScaleY;
        }
        return;
    }

    var period = obj.minimapPulsePeriod();
    var maxScale = obj.minimapPulseScale();
    this._pulseDuration = (this._pulseDuration + 1) % period;

    var wave = 0.5 * (1 - Math.cos(this._pulseDuration * Math.PI * 2 / period));
    var mult = 1.0 + (maxScale - 1.0) * wave;

    this.scale.x = this._baseScaleX * mult;
    this.scale.y = this._baseScaleY * mult;
};


//-----------------------------------------------------------------------------
// Spriteset_Map

var _KMS_Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
Spriteset_Map.prototype.createUpperLayer = function()
{
    _KMS_Spriteset_Map_createUpperLayer.call(this);

    this.createMinimap();
};

Spriteset_Map.prototype.createMinimap = function()
{
    this._minimap = new Sprite_Minimap();
    this._minimap.refresh();
    this.addChild(this._minimap);
};

var _KMS_Spriteset_Map = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function()
{
    _KMS_Spriteset_Map.call(this);

    this.updateMinimap();
};

Spriteset_Map.prototype.updateMinimap = function()
{
    this._minimap.setWholeOpacity(255 - this._fadeSprite.opacity);
    this._minimap.update();
};

})();