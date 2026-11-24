"use strict";
/*:
@target MV MZ
@plugindesc virtual stick v1.1.4 (Analog Dash, Threshold Appear & Yami_8DirEx Compat Mod)
@author unagi ootoro (Modified)
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/VirtualStickController.js
@help
It is a plugin that introduces a virtual stick with analog dash control.

【How to use】
By changing the "stick mode" of the plug-in parameter
・ Move in 4 directions
・ Move in 8 directions
・ 360 degree movement
You can choose one of them.

【Modified Features】
1. Threshold-based Appearance (Tap-to-OK Compatibility)
   - The virtual stick stays hidden until the finger moves beyond the threshold
     (automatically synced with UCHU_CancelAndTapOk's "Tap Max Move" if installed).
   - Short taps do not cause the stick to flicker on screen.
2. Analog Tilt Dash & Option Inversion
   - Tilting beyond the threshold ratio switches between Walk and Dash.
   - When the in-game option "Always Dash" is ON, behavior is inverted.
3. Yami_8DirEx.js Full Compatibility
   - Restores 8-direction keyboard/gamepad input when Yami_8DirEx.js is active.
   - Syncs with Yami_8DirEx's "dir4 Switch ID" to dynamically toggle 4-dir / 8-dir.

【License】
This plugin is available under the terms of the MIT license.


@param STICK_MODE
@text stick mode
@type number
@default 0
@desc
Specifies the mode of the virtual stick.
0: 4 directions move 1: 8 directions move 2: 360 degrees move

@param PAD_SIZE
@text pad size
@type number
@default 128
@desc
Specifies the size of the virtual stick.

@param STICK_SIZE
@text stick size
@type number
@default 64
@desc
Specifies the stick size of the virtual stick.

@param MARGIN
@text margin
@type number
@default 8
@desc
Specifies the pad center judgment margin.

@param ALWAYS_DUSH
@text always dash
@type boolean
@default false
@desc
If set to true, pad movement will always be a dash regardless of tilt or options.

@param PAD_IMAGE_FILE_NAME
@text pad image file name
@type file
@dir img
@desc
Specify the file name of the pad image.

@param STICK_IMAGE_FILE_NAME
@text stick image file name
@type file
@dir img
@desc
Specify the file name of the stick image.

@param PAD_STROKE_COLOR
@text Pad border color
@type string
@default #0000aa
@desc
Specifies the color of the pad border.

@param PAD_FILL_COLOR
@text Pad fill color
@type string
@default #0000ff
@desc
Specifies the color of the pad fill.

@param PAD_OPACITY
@text pad transparency
@type number
@default 64
@desc
Specify the transparency of the pad from 0 to 255.

@param STICK_STROKE_COLOR
@text Stick border color
@type string
@default #0000aa
@desc
Specifies the color of the stick border.

@param STICK_FILL_GRAD1_COLOR
@text Stick fill gradient start
@type string
@default #ffffff
@desc
Stick fill Specifies the color at which the gradient starts.

@param STICK_FILL_GRAD2_COLOR
@text Stick fill gradient middle
@type string
@default #aaaaff
@desc
Stick fill gradient Specifies a color in the middle.

@param STICK_FILL_GRAD3_COLOR
@text Stick fill gradient end
@type string
@default #0000ff
@desc
Stick fill Specifies the color at the end of the gradient.

@param --- Analog Dash & Extended Settings ---

@param SYNC_TAP_THRESHOLD
@text Sync appear threshold with Tap-OK
@type boolean
@default true
@desc
Automatically uses UCHU_CancelAndTapOk's "Tap Max Move" as the stick appearance threshold if installed.

@param APPEAR_THRESHOLD
@text Stick appear threshold (px)
@type number
@min 0
@max 100
@default 8
@desc
Minimum drag distance (px) required before the virtual stick appears (used when Sync is OFF or standalone).

@param DASH_THRESHOLD_RATIO
@text Dash threshold ratio
@type number
@decimals 2
@min 0.10
@max 1.00
@default 0.65
@desc
Ratio of pad radius (0.10 - 1.00) required to trigger dash (or walk when Always Dash option is ON).

@param DASH_HYSTERESIS_RATIO
@text Dash hysteresis ratio
@type number
@decimals 2
@min 0.00
@max 0.30
@default 0.05
@desc
Buffer ratio around the threshold to prevent rapid flickering between walk and dash.

@param ANALOG_STICK_FOLLOW
@text Analog stick visual follow
@type boolean
@default true
@desc
If true, the stick visually moves smoothly with finger distance from center to edge.

@param CLAMP_PAD_TO_SCREEN
@text Clamp pad inside screen
@type boolean
@default true
@desc
Adjusts the pad visual position inward when touching near screen edges so it stays inside the screen.

@param SCREEN_EDGE_PADDING
@text Screen edge padding
@type number
@min 0
@max 100
@default 8
@desc
Minimum margin (px) between the pad outer edge and screen border when clamping is enabled.

@param DASH_STICK_STROKE_COLOR
@text [Dash] Stick border color
@type string
@default #aa2200
@desc
Stick border color when in Dash state.

@param DASH_STICK_GRAD1_COLOR
@text [Dash] Stick gradient start
@type string
@default #ffffff
@desc
Stick gradient start color when in Dash state.

@param DASH_STICK_GRAD2_COLOR
@text [Dash] Stick gradient middle
@type string
@default #ffaa66
@desc
Stick gradient middle color when in Dash state.

@param DASH_STICK_GRAD3_COLOR
@text [Dash] Stick gradient end
@type string
@default #ff3300
@desc
Stick gradient end color when in Dash state.

@param DASH_STICK_SCALE
@text [Dash] Stick scale multiplier
@type number
@decimals 2
@min 0.80
@max 1.50
@default 1.08
@desc
Scale multiplier applied to the stick when in Dash state.
*/
/*:ja
@target MV MZ
@plugindesc 仮想スティック v1.1.4 (倒し量ダッシュ・閾値出現・Yami_8DirEx互換改変版)
@author うなぎおおとろ (改変)
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/VirtualStickController.js
@help
仮想スティックを導入するプラグインです。

【使用方法】
プラグインパラメータの「スティックモード」を変更することで、
・4方向移動
・8方向移動
・360度移動
のいずれかを選択することができます。

【改変機能】
1. 決定キー閾値を超過するまでスティック非表示
   - 画面に触れただけでは仮想スティックは表示されず、閾値以上に指を動かした瞬間に
     出現して即座に移動を開始します。短タップ決定時のチラつきを完全に防ぎます。
   - 「UCHU_CancelAndTapOk.js」導入時は、決定キーの許容移動距離と自動同期します。
2. 倒し量によるダッシュ切替＆オプション連動反転
   - スティックを閾値以上に大きく倒すと「ダッシュ」、小さく倒すと「歩き」になります。
   - ゲーム内オプションの「常時ダッシュ」がONのときは反転挙動となり、
     スティックの色と大きさで現在の状態（ダッシュ／歩き）を判別できます。
3. Yami_8DirEx.js との完全互換対応
   - Yami_8DirEx.js 併用時に失われていたキーボード／ゲームパッドの8方向入力を復元します。
   - Yami_8DirEx.js の「dir4 Switch ID」スイッチがONのときは、仮想スティック側も
     自動的に4方向移動へ切り替わります。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


@param STICK_MODE
@text スティックモード
@type number
@default 0
@desc
仮想スティックのモードを指定します。
0: 4方向移動  1: 8方向移動  2: 360度移動

@param PAD_SIZE
@text パッドサイズ
@type number
@default 128
@desc
仮想スティックのサイズを指定します。

@param STICK_SIZE
@text スティックサイズ
@type number
@default 64
@desc
仮想スティックのスティックのサイズを指定します。

@param MARGIN
@text マージン
@type number
@default 8
@desc
パッド中央判定のマージンを指定します。

@param ALWAYS_DUSH
@text 常時ダッシュ
@type boolean
@default false
@desc
trueを設定するとパッド移動が常にダッシュになります（倒し量判定より優先）。

@param PAD_IMAGE_FILE_NAME
@text パッド画像ファイル名
@type file
@dir img
@desc
パッド画像のファイル名を指定します。

@param STICK_IMAGE_FILE_NAME
@text スティック画像ファイル名
@type file
@dir img
@desc
スティック画像のファイル名を指定します。

@param PAD_STROKE_COLOR
@text パッド枠線色
@type string
@default #0000aa
@desc
パッドの枠線の色を指定します。

@param PAD_FILL_COLOR
@text パッド塗りつぶし色
@type string
@default #0000ff
@desc
パッドの塗りつぶしの色を指定します。

@param PAD_OPACITY
@text パッド透明度
@type number
@default 64
@desc
パッドの透明度を0～255で指定します。

@param STICK_STROKE_COLOR
@text スティック枠線色
@type string
@default #0000aa
@desc
スティックの枠線の色を指定します。

@param STICK_FILL_GRAD1_COLOR
@text スティック塗りつぶしグラデーション開始
@type string
@default #ffffff
@desc
スティックの塗りつぶしグラデーション開始の色を指定します。

@param STICK_FILL_GRAD2_COLOR
@text スティック塗りつぶしグラデーション中間
@type string
@default #aaaaff
@desc
スティックの塗りつぶしグラデーション中間の色を指定します。

@param STICK_FILL_GRAD3_COLOR
@text スティック塗りつぶしグラデーション終端
@type string
@default #0000ff
@desc
スティックの塗りつぶしグラデーション終端の色を指定します。

@param --- 倒し量ダッシュ・拡張設定 ---

@param SYNC_TAP_THRESHOLD
@text タップ決定プラグインと閾値を自動同期
@type boolean
@default true
@desc
trueの場合、UCHU_CancelAndTapOkの「Tap Max Move」の値をスティック出現閾値として自動採用します。

@param APPEAR_THRESHOLD
@text スティック出現の移動閾値(px)
@type number
@min 0
@max 100
@default 8
@desc
タッチ開始位置からこの距離(px)以上指を動かすまで仮想スティックを表示しません。

@param DASH_THRESHOLD_RATIO
@text ダッシュ切替の倒し量割合
@type number
@decimals 2
@min 0.10
@max 1.00
@default 0.65
@desc
パッド半径に対する倒し量の割合(0.10～1.00)。この割合以上でダッシュ(常時ダッシュON時は歩き)になります。

@param DASH_HYSTERESIS_RATIO
@text ダッシュ境界の緩衝幅割合
@type number
@decimals 2
@min 0.00
@max 0.30
@default 0.05
@desc
閾値付近で歩きとダッシュが激しく切り替わる(チャタリング)のを防ぐ緩衝割合です。

@param ANALOG_STICK_FOLLOW
@text スティックのアナログ追従描画
@type boolean
@default true
@desc
trueにすると、指の移動距離に合わせてスティックが中心から外周まで滑らかに動きます。

@param CLAMP_PAD_TO_SCREEN
@text 画面端タッチ時のパッド表示位置補正
@type boolean
@default true
@desc
画面端ギリギリをタッチした際、パッド表示が画面外へはみ出さないよう内側へ補正します。

@param SCREEN_EDGE_PADDING
@text 画面端補正の余白(px)
@type number
@min 0
@max 100
@default 8
@desc
画面端補正を有効にした際、画面端からパッド外周まで確保する余白(px)です。

@param DASH_STICK_STROKE_COLOR
@text [ダッシュ時] スティック枠線色
@type string
@default #aa2200
@desc
ダッシュ状態中のスティック枠線の色です。

@param DASH_STICK_GRAD1_COLOR
@text [ダッシュ時] スティックグラデーション開始
@type string
@default #ffffff
@desc
ダッシュ状態中のスティック塗りつぶしグラデーション開始色です。

@param DASH_STICK_GRAD2_COLOR
@text [ダッシュ時] スティックグラデーション中間
@type string
@default #ffaa66
@desc
ダッシュ状態中のスティック塗りつぶしグラデーション中間色です。

@param DASH_STICK_GRAD3_COLOR
@text [ダッシュ時] スティックグラデーション終端
@type string
@default #ff3300
@desc
ダッシュ状態中のスティック塗りつぶしグラデーション終端色です。

@param DASH_STICK_SCALE
@text [ダッシュ時] スティック拡大率
@type number
@decimals 2
@min 0.80
@max 1.50
@default 1.08
@desc
ダッシュ状態中にスティックを拡大する倍率です。
*/
const VirtualStickPluginName = document.currentScript ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1]) : "VirtualStickController";
let $virtualStickController;
var VirtualStick;
(function (VirtualStick) {
    const params = PluginManager.parameters(VirtualStickPluginName);
    const STICK_MODE = parseInt(params["STICK_MODE"]);
    const PAD_SIZE = parseInt(params["PAD_SIZE"]);
    const STICK_SIZE = parseInt(params["STICK_SIZE"]);
    const MARGIN = parseInt(params["MARGIN"]);
    const ALWAYS_DUSH = params["ALWAYS_DUSH"] === "true";
    const PAD_IMAGE_FILE_NAME = params["PAD_IMAGE_FILE_NAME"];
    const STICK_IMAGE_FILE_NAME = params["STICK_IMAGE_FILE_NAME"];
    const PAD_STROKE_COLOR = params["PAD_STROKE_COLOR"];
    const PAD_FILL_COLOR = params["PAD_FILL_COLOR"];
    const PAD_OPACITY = params["PAD_OPACITY"];
    const STICK_STROKE_COLOR = params["STICK_STROKE_COLOR"];
    const STICK_FILL_GRAD1_COLOR = params["STICK_FILL_GRAD1_COLOR"];
    const STICK_FILL_GRAD2_COLOR = params["STICK_FILL_GRAD2_COLOR"];
    const STICK_FILL_GRAD3_COLOR = params["STICK_FILL_GRAD3_COLOR"];

    // 拡張パラメータ
    const SYNC_TAP_THRESHOLD = String(params["SYNC_TAP_THRESHOLD"] !== undefined ? params["SYNC_TAP_THRESHOLD"] : "true") === "true";
    const APPEAR_THRESHOLD = Number(params["APPEAR_THRESHOLD"] !== undefined ? params["APPEAR_THRESHOLD"] : 8);
    const DASH_THRESHOLD_RATIO = Number(params["DASH_THRESHOLD_RATIO"] !== undefined ? params["DASH_THRESHOLD_RATIO"] : 0.65);
    const DASH_HYSTERESIS_RATIO = Number(params["DASH_HYSTERESIS_RATIO"] !== undefined ? params["DASH_HYSTERESIS_RATIO"] : 0.05);
    const ANALOG_STICK_FOLLOW = String(params["ANALOG_STICK_FOLLOW"] !== undefined ? params["ANALOG_STICK_FOLLOW"] : "true") === "true";
    const CLAMP_PAD_TO_SCREEN = String(params["CLAMP_PAD_TO_SCREEN"] !== undefined ? params["CLAMP_PAD_TO_SCREEN"] : "true") === "true";
    const SCREEN_EDGE_PADDING = Number(params["SCREEN_EDGE_PADDING"] !== undefined ? params["SCREEN_EDGE_PADDING"] : 8);
    const DASH_STICK_STROKE_COLOR = String(params["DASH_STICK_STROKE_COLOR"] || "#aa2200");
    const DASH_STICK_GRAD1_COLOR = String(params["DASH_STICK_GRAD1_COLOR"] || "#ffffff");
    const DASH_STICK_GRAD2_COLOR = String(params["DASH_STICK_GRAD2_COLOR"] || "#ffaa66");
    const DASH_STICK_GRAD3_COLOR = String(params["DASH_STICK_GRAD3_COLOR"] || "#ff3300");
    const DASH_STICK_SCALE = Number(params["DASH_STICK_SCALE"] !== undefined ? params["DASH_STICK_SCALE"] : 1.08);

    // Yami_8DirEx.js 互換検出
    const yamiParams = PluginManager.parameters("Yami_8DirEx");
    const HAS_YAMI_8DIR = (yamiParams && Object.keys(yamiParams).length > 0) ||
        typeof Game_Player.prototype.processMoveByInput === "function";
    const YAMI_DIR4_SWITCH_ID = (yamiParams && yamiParams["dir4 Switch ID"] !== undefined)
        ? Number(yamiParams["dir4 Switch ID"])
        : 100;

    function isYamiDir4Forced() {
        return HAS_YAMI_8DIR && $gameSwitches && $gameSwitches.value(YAMI_DIR4_SWITCH_ID);
    }

    function getEffectiveAppearThreshold() {
        if (SYNC_TAP_THRESHOLD) {
            const tapOkParams = PluginManager.parameters("UCHU_CancelAndTapOk");
            if (tapOkParams && tapOkParams["Tap Max Move"] !== undefined) {
                const synced = Number(tapOkParams["Tap Max Move"]);
                if (!Number.isNaN(synced)) {
                    return synced;
                }
            }
        }
        return APPEAR_THRESHOLD;
    }

    class VirtualStickController {
        constructor() {
            this.reset();
        }
        update() {
            if (this._state === "closing")
                this.updateClosing();
        }
        updateClosing() {
            if (this._remainClosingWaitTime > 0) {
                this._remainClosingWaitTime--;
                if (this._remainClosingWaitTime === 0) {
                    this.resetStateOnly();
                }
            }
        }
        resetStateOnly() {
            this._visible = false;
            this._originPoint = null;
            this._displayPoint = null;
            this._deg = null;
            this._far = 0;
            this._thresholdExceeded = false;
            this._state = "close";
            this._remainClosingWaitTime = 0;
        }
        reset() {
            this._VirtualStickTouched = false;
            this._touchActionResult = false;
            this.resetStateOnly();
        }
        isVisible() {
            return this._visible;
        }
        isActive() {
            return this._visible && this._state === "open" && this._originPoint != null;
        }
        open(point, isNewTouch) {
            // 新規タッチ開始、または待機・閉じ状態からの開始は pending に入る
            if (isNewTouch || this._state === "close" || this._state === "closing") {
                const threshold = getEffectiveAppearThreshold();
                this._originPoint = point;
                this._displayPoint = this.clampInitialPoint(point);
                this._far = 0;
                this._deg = null;
                this._thresholdExceeded = false;
                this._remainClosingWaitTime = 0;

                if (threshold <= 0) {
                    this._state = "open";
                    this._visible = true;
                }
                else {
                    this._state = "pending";
                    this._visible = false;
                }
                return;
            }

            if (this._state === "pending") {
                const far = this.calcFar(this._originPoint, point);
                this._far = far;
                const threshold = getEffectiveAppearThreshold();
                if (far >= threshold) {
                    // 決定キー閾値を上回った瞬間にスティックを出現させ、即座に移動開始
                    this._state = "open";
                    this._visible = true;
                    this._deg = this.calcDeg(this._originPoint, point);
                    this.updateDashThresholdState(far);
                }
                else {
                    this._visible = false;
                    this._deg = null;
                    this._thresholdExceeded = false;
                }
                return;
            }

            if (this._state === "open") {
                const far = this.calcFar(this._originPoint, point);
                this._far = far;
                if (far >= MARGIN) {
                    this._deg = this.calcDeg(this._originPoint, point);
                    this.updateDashThresholdState(far);
                }
                else {
                    this._deg = null;
                    this._thresholdExceeded = false;
                }
            }
        }
        clampInitialPoint(point) {
            if (!CLAMP_PAD_TO_SCREEN) {
                return point;
            }
            const padRadius = PAD_SIZE / 2;
            const minMargin = padRadius + SCREEN_EDGE_PADDING;
            const screenW = Graphics.boxWidth || Graphics.width;
            const screenH = Graphics.boxHeight || Graphics.height;

            let cx = point.x;
            let cy = point.y;
            if (screenW > minMargin * 2) {
                cx = Math.max(minMargin, Math.min(cx, screenW - minMargin));
            }
            if (screenH > minMargin * 2) {
                cy = Math.max(minMargin, Math.min(cy, screenH - minMargin));
            }
            return new Point(cx, cy);
        }
        maxEffectiveRadius() {
            return Math.max(MARGIN + 1, (PAD_SIZE / 2) - 4);
        }
        updateDashThresholdState(far) {
            const maxR = this.maxEffectiveRadius();
            const ratio = Math.min(1.0, far / maxR);
            const enterRatio = DASH_THRESHOLD_RATIO;
            const exitRatio = Math.max(0, DASH_THRESHOLD_RATIO - DASH_HYSTERESIS_RATIO);

            if (this._thresholdExceeded) {
                if (ratio < exitRatio) {
                    this._thresholdExceeded = false;
                }
            }
            else {
                if (ratio >= enterRatio) {
                    this._thresholdExceeded = true;
                }
            }
        }
        isDashThresholdExceeded() {
            return this._thresholdExceeded;
        }
        isEffectiveDashing() {
            if (ALWAYS_DUSH) {
                return true;
            }
            const alwaysDashOption = ($gameSystem && typeof $gameSystem.isAlwaysDash === "function")
                ? $gameSystem.isAlwaysDash()
                : !!ConfigManager.alwaysDash;
            const dashInput = this._thresholdExceeded || Input.isPressed("shift");
            return alwaysDashOption ? !dashInput : dashInput;
        }
        close() {
            if (this._state === "pending") {
                // 未出現のまま指を離した場合は即座にリセット（チラつきゼロ）
                this.resetStateOnly();
            }
            else if (this._state === "open") {
                this._remainClosingWaitTime = VirtualStickController.CLOSING_WAIT_TIME;
                this._state = "closing";
            }
        }
        point() {
            return this._displayPoint;
        }
        deg() {
            return this._deg;
        }
        far() {
            return this._far;
        }
        dir4() {
            if (!this._deg)
                return 0;
            const deg = this._deg;
            if ((deg >= 315 && deg < 360) || (deg >= 0 && deg < 45)) {
                return 8;
            }
            else if (deg >= 45 && deg < 135) {
                return 6;
            }
            else if (deg >= 135 && deg < 225) {
                return 2;
            }
            else if (deg >= 225 && deg < 315) {
                return 4;
            }
            throw new Error(`${deg} is invalid`);
        }
        dir8() {
            if (!this._deg)
                return 0;
            const deg = this._deg;
            if ((deg >= 337.5 && deg < 360) || (deg >= 0 && deg < 22.5)) {
                return 8;
            }
            else if (deg >= 22.5 && deg < 67.5) {
                return 9;
            }
            else if (deg >= 67.5 && deg < 112.5) {
                return 6;
            }
            else if (deg >= 112.5 && deg < 157.5) {
                return 3;
            }
            else if (deg >= 157.5 && deg < 202.5) {
                return 2;
            }
            else if (deg >= 202.5 && deg < 247.5) {
                return 1;
            }
            else if (deg >= 247.5 && deg < 292.5) {
                return 4;
            }
            else if (deg >= 292.5 && deg < 337.5) {
                return 7;
            }
            throw new Error(`${deg} is invalid`);
        }
        touchActionResult() {
            return this._touchActionResult;
        }
        setTouchActionResult(result) {
            this._touchActionResult = result;
        }
        virtualStickTouched() {
            return this._VirtualStickTouched;
        }
        setVirtualStickTouched(touched) {
            this._VirtualStickTouched = touched;
        }
        calcDeg(fromPoint, newPoint) {
            const ox = newPoint.x - fromPoint.x;
            const oy = newPoint.y - fromPoint.y;
            const rad = Math.atan2(oy, ox);
            let deg = rad / Math.PI * 180 + 90;
            if (deg > 360)
                deg = deg % 360;
            if (deg < 0) {
                let rdeg = -deg;
                if (rdeg > 360)
                    rdeg = rdeg % 360;
                deg = 360 - rdeg;
            }
            return deg;
        }
        calcFar(fromPoint, newPoint) {
            const xDiff = newPoint.x - fromPoint.x;
            const yDiff = newPoint.y - fromPoint.y;
            if (xDiff === 0 && yDiff === 0)
                return 0;
            return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
        }
    }
    VirtualStickController.CLOSING_WAIT_TIME = 4;
    VirtualStick.VirtualStickController = VirtualStickController;
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function () {
        _DataManager_createGameObjects.call(this);
        $virtualStickController = new VirtualStickController();
    };
    const _Scene_Map_create = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function () {
        _Scene_Map_create.call(this);
        $virtualStickController.reset();
    };
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        $virtualStickController.setVirtualStickTouched(false);
        _Scene_Map_update.call(this);
        this.updateVirtualStick();
    };
    Scene_Map.prototype.updateVirtualStick = function () {
        $virtualStickController.update();
        if ($gameMap.isEventRunning() || this.isBusy()) {
            $virtualStickController.close();
        }
        else {
            if ($virtualStickController.virtualStickTouched()) {
                const screenX = TouchInput.x;
                const screenY = TouchInput.y;
                $virtualStickController.open(new Point(screenX, screenY), TouchInput.isTriggered());
            }
            else {
                $virtualStickController.close();
            }
        }
    };
    // 仮想パッド表示フラグをONにする
    const _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function () {
        // DotMoveSystem_DecideTriggerExPluginName.jsとの併用に対応する
        if (typeof DotMoveSystem_DecideTriggerExPluginName !== "undefined") {
            const startEvent = this.checkCharacterEventStarted();
            if (startEvent)
                return;
        }
        if (Utils.RPGMAKER_NAME === "MZ") {
            if (TouchInput.isPressed() && !this.isAnyButtonPressed()) {
                $virtualStickController.setVirtualStickTouched(true);
            }
        }
        else {
            if (TouchInput.isPressed()) {
                $virtualStickController.setVirtualStickTouched(true);
            }
        }
        // 従来の処理はイベント起動に必要なため、そのまま残す
        _Scene_Map_processMapTouch.call(this);
    };
    // ドット移動対応時のタッチポイント到達時にDestinationをクリアする処理を無効化
    Game_Player.prototype.updateTouchPoint = function () {
    };
    Game_Player.prototype.updateDashing = function () {
        if (this.isMoving()) {
            return;
        }
        if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
            if ($virtualStickController && $virtualStickController.isActive()) {
                this._dashing = $virtualStickController.isEffectiveDashing();
            }
            else if (ALWAYS_DUSH) {
                this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
            }
            else {
                this._dashing = this.isDashButtonPressed();
            }
        }
        else {
            this._dashing = false;
        }
    };
    Game_Player.prototype.getInputDeg = function () {
        return null;
    };
    Game_Player.prototype.moveByInput = function () {
        if (!this.isMoving() && this.canMove()) {
            const forceDir4 = isYamiDir4Forced();
            // Yami_8DirEx.js 導入時はキーボード/ゲームパッドの8方向入力（Input.dir8）を復元
            let direction = HAS_YAMI_8DIR
                ? (forceDir4 ? Input.dir4 : Input.dir8)
                : this.getInputDirection();
            let deg = this.getInputDeg();

            if (direction > 0) {
                $gameTemp.clearDestination();
            }
            else if (deg != null) {
                $gameTemp.clearDestination();
                if (typeof DotMoveSystemPluginName !== "undefined") {
                    this.dotMoveByDeg(deg);
                }
            }
            else {
                if (forceDir4) {
                    // Yami_8DirEx.js の 4方向切替スイッチがONのときは強制4方向
                    direction = $virtualStickController.dir4();
                }
                else if (STICK_MODE === 1) {
                    direction = $virtualStickController.dir8();
                }
                else if (STICK_MODE === 2) {
                    deg = $virtualStickController.deg();
                    if (typeof DotMoveSystemPluginName !== "undefined") {
                        if (deg != null)
                            this.dotMoveByDeg(deg);
                    }
                    else {
                        throw new Error("DotMoveSystem.js is not installed.");
                    }
                }
                else {
                    direction = $virtualStickController.dir4();
                }
            }
            if (direction > 0) {
                // Yami_8DirEx.jsとの併用に対応
                if (typeof this.processMoveByInput === "function") {
                    this.processMoveByInput(direction);
                }
                else {
                    this.executeMove(direction);
                }
            }
        }
    };
    // 事前に設定しておいたDestinationに応じて振り向き、イベントがあれば起動する
    // イベントを起動しなかった場合は振り向きをキャンセルする
    const _Game_Player_triggerTouchAction = Game_Player.prototype.triggerTouchAction;
    Game_Player.prototype.triggerTouchAction = function () {
        const currentDir = $gamePlayer.direction();
        const x = $gameTemp.destinationX();
        const y = $gameTemp.destinationY();
        if (y < $gamePlayer.y) {
            $gamePlayer.setDirection(8);
        }
        else if (x > $gamePlayer.x) {
            $gamePlayer.setDirection(6);
        }
        else if (y > $gamePlayer.y) {
            $gamePlayer.setDirection(2);
        }
        else if (x < $gamePlayer.x) {
            $gamePlayer.setDirection(4);
        }
        const touchActionResult = _Game_Player_triggerTouchAction.call(this);
        $virtualStickController.setTouchActionResult(touchActionResult);
        if (touchActionResult) {
            // タッチでアクションを実行したときは仮想パッドを表示しない
            $virtualStickController.setVirtualStickTouched(false);
            return true;
        }
        else {
            $gameTemp.clearDestination();
            $gamePlayer.setDirection(currentDir);
        }
        return false;
    };
    let spriteClass;
    if (Utils.RPGMAKER_NAME === "MZ") {
        spriteClass = Sprite;
    }
    else {
        // @ts-ignore // MV Compatible
        spriteClass = Sprite_Base;
    }
    class Sprite_VirtualStick extends spriteClass {
        initialize() {
            super.initialize();
            this._stickSprite = null;
            this.createBitmap();
            this.createStick();
            this.hide();
        }
        update() {
            super.update();
            if ($virtualStickController.isVisible()) {
                this.show();
                const point = $virtualStickController.point();
                const pad = this.padding();
                this.x = point.x - this.bitmap.width / 2 - pad;
                this.y = point.y - this.bitmap.height / 2 - pad;
                const deg = $virtualStickController.deg();
                const far = $virtualStickController.far();
                const isDashing = $virtualStickController.isEffectiveDashing();
                this._stickSprite.setDashVisual(isDashing);
                if (deg == null) {
                    this.moveStickToCenter();
                }
                else {
                    this.moveStickByDeg(deg, far);
                }
            }
            else {
                this.hide();
            }
        }
        createBitmap() {
            if (PAD_IMAGE_FILE_NAME) {
                this.bitmap = ImageManager.loadBitmap("img/", PAD_IMAGE_FILE_NAME);
            }
            else {
                this.createDefaultBitmap();
            }
        }
        createDefaultBitmap() {
            this.bitmap = new Bitmap(PAD_SIZE, PAD_SIZE);
            const ctx = this.bitmap._context;
            const pad = this.padding();
            const cx = this.bitmap.width / 2;
            const cy = this.bitmap.height / 2;
            const r = this.bitmap.width / 2 - pad;
            const beginRad = 0;
            const endRad = 2 * Math.PI;
            ctx.arc(cx, cy, r, beginRad, endRad, false);
            ctx.strokeStyle = PAD_STROKE_COLOR;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = PAD_OPACITY / 255.0;
            ctx.fillStyle = PAD_FILL_COLOR;
            ctx.fill();
        }
        createStick() {
            this._stickSprite = new Sprite_Stick();
            this.addChild(this._stickSprite);
        }
        show() {
            super.show();
            this._stickSprite.show();
        }
        hide() {
            super.hide();
            this._stickSprite.hide();
        }
        moveStickToCenter() {
            const pad = this.padding();
            const cx = this.bitmap.width / 2;
            const cy = this.bitmap.height / 2;
            const x = cx - (this._stickSprite.width * this._stickSprite.scale.x) / 2 + pad;
            const y = cy - (this._stickSprite.height * this._stickSprite.scale.y) / 2 + pad;
            this._stickSprite.x = x;
            this._stickSprite.y = y;
        }
        moveStickByDeg(deg, far) {
            this.moveStickToCenter();
            const rad = (deg - 90) / 180 * Math.PI;
            const pad = this.padding();
            const pad2 = this._stickSprite.padding();
            const r = this.bitmap.width / 2 - pad;
            const r2 = (this._stickSprite.bitmap.width * this._stickSprite.scale.x) / 2 - pad2;
            const maxOffset = Math.max(0, r - r2 - pad2);

            let ratio = 1.0;
            if (ANALOG_STICK_FOLLOW) {
                const maxR = $virtualStickController.maxEffectiveRadius();
                ratio = Math.min(1.0, Math.max(0, far / maxR));
            }

            const dist = maxOffset * ratio;
            this._stickSprite.x += Math.cos(rad) * dist;
            this._stickSprite.y += Math.sin(rad) * dist;
        }
        padding() {
            return 4;
        }
    }
    VirtualStick.Sprite_VirtualStick = Sprite_VirtualStick;
    class Sprite_Stick extends spriteClass {
        initialize() {
            super.initialize();
            this._isDashVisual = false;
            this._normalBitmap = null;
            this._dashBitmap = null;
            this.createBitmap();
        }
        update() {
            super.update();
        }
        createBitmap() {
            if (STICK_IMAGE_FILE_NAME) {
                this._normalBitmap = ImageManager.loadBitmap("img/", STICK_IMAGE_FILE_NAME);
                this._dashBitmap = this._normalBitmap;
                this.bitmap = this._normalBitmap;
            }
            else {
                this._normalBitmap = this.createStickBitmap(
                    STICK_STROKE_COLOR,
                    STICK_FILL_GRAD1_COLOR,
                    STICK_FILL_GRAD2_COLOR,
                    STICK_FILL_GRAD3_COLOR
                );
                this._dashBitmap = this.createStickBitmap(
                    DASH_STICK_STROKE_COLOR,
                    DASH_STICK_GRAD1_COLOR,
                    DASH_STICK_GRAD2_COLOR,
                    DASH_STICK_GRAD3_COLOR
                );
                this.bitmap = this._normalBitmap;
            }
        }
        createStickBitmap(strokeColor, grad1, grad2, grad3) {
            const bmp = new Bitmap(STICK_SIZE, STICK_SIZE);
            const ctx = bmp._context;
            const pad = this.padding();
            const cx = bmp.width / 2;
            const cy = bmp.height / 2;
            const r = bmp.width / 2 - pad;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            const grdCx = bmp.width / 3;
            const grdCy = bmp.height / 3;
            const grd = ctx.createRadialGradient(grdCx, grdCy, 0, cx, cy, r);
            grd.addColorStop(0, grad1);
            grd.addColorStop(0.25, grad2);
            grd.addColorStop(1, grad3);
            ctx.fillStyle = grd;
            ctx.fill();
            return bmp;
        }
        setDashVisual(isDashing) {
            if (this._isDashVisual === isDashing) {
                return;
            }
            this._isDashVisual = isDashing;
            this.bitmap = isDashing ? this._dashBitmap : this._normalBitmap;
            const s = isDashing ? DASH_STICK_SCALE : 1.0;
            this.scale.x = s;
            this.scale.y = s;
            if (STICK_IMAGE_FILE_NAME) {
                this.setBlendColor(isDashing ? [255, 100, 50, 96] : [0, 0, 0, 0]);
            }
        }
        padding() {
            return 4;
        }
    }
    VirtualStick.Sprite_Stick = Sprite_Stick;
    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function () {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createVirtualStick();
    };
    Spriteset_Map.prototype.createVirtualStick = function () {
        this._virtualStickSprite = new Sprite_VirtualStick();
        this._baseSprite.addChild(this._virtualStickSprite);
    };
    // 仮想パッドを表示するときはDestination矩形を表示しない
    Sprite_Destination.prototype.update = function () {
        Sprite.prototype.update.call(this);
        if ($gameTemp.isDestinationValid() && $virtualStickController.touchActionResult()) {
            this.updatePosition();
            this.updateAnimation();
            this.visible = true;
        }
        else {
            this._frameCount = 0;
            this.visible = false;
        }
    };
})(VirtualStick || (VirtualStick = {}));