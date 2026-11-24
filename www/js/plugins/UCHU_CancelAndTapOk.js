//=============================================================================
// UCHU_CancelAndTapOk.js
// Based on UCHU_MobileOperation.js (Version: 1.1.4)
//----------------------------------------------------------------------------
// Copyright (c) 2015 uchuzine
// Modified for VirtualStick compatibility, Tap-to-OK, and Auto-Hide/Evacuate Cancel Button
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
@target MV MZ
@plugindesc 仮想スティック併用向け：画面タップ決定＆自動退避キャンセルボタン
@author uchuzine (改変)
@help
VirtualStick.js（仮想スティック）と競合しない専用のキャンセルボタンと、
マップ上の短タップ決定機能を提供するプラグインです。

【重要：配置順】
プラグイン管理画面では、必ず「VirtualStick.js」よりも下に配置してください。

【主な機能】
1. 競合しない新規押しキャンセルボタン
   - キャンセルボタンへのタッチは背後の仮想スティックへ貫通しません。
   - ボタン上で新規に押下された瞬間（トリガー入力）のみ反応し、
     押しっぱなしや指のスライド侵入によるメニュー連続開閉を防ぎます。
2. マップ上のどこでも短タップ決定
   - キャンセルボタン以外の画面領域をドラッグせず短くタップして離すと、
     プレイヤーの正面に対して決定キー（調べる・話す）が発火します。
   - タッチ座標への自動移動・不要な振り向きは無効化されます。
3. シーン・メッセージ連動の自動非表示＆位置退避（高速フェード）
   - タイトル／ゲームオーバー／メッセージ表示中は高速フェードアウトして非表示になります。
   - 戦闘画面などUIと重なるシーンでは退避位置（初期値：右上）へ自動移動します。
   - 選択肢ウィンドウ表示中は「文章あり」「文章なし」で個別に挙動を設定できます。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。

@param --- 基本設定 ---
@default

@param PC BtnDisplay
@text PCテスト時もボタン表示
@type boolean
@default false
@desc PCでテストプレイする際もキャンセルボタンを表示します。

@param CancelBtn Image
@text キャンセルボタン画像
@type file
@dir img
@desc キャンセルボタン画像のファイルパス（拡張子なし指定も可。例: system/CancelButton）
@default system/CancelButton

@param Button Opacity
@text ボタン不透明度
@type number
@decimals 2
@min 0.10
@max 1.00
@default 0.75
@desc 表示時のキャンセルボタンの不透明度（0.10～1.00）

@param Fade Duration
@text フェード時間(ms)
@type number
@min 0
@max 1000
@default 90
@desc メッセージ開閉時などにボタンが消える／現れるフェード時間（ミリ秒）

@param Tap Max Move
@text 短タップ判定の許容移動距離(px)
@type number
@min 1
@max 50
@default 8
@desc マップ上で指を動かさず離した（決定キー）とみなす最大移動距離。VirtualStickのMARGINと合わせるのを推奨。

@param --- ボタンサイズ・拡大率 ---
@default

@param CancelBtn Size
@text ボタン基準サイズ(px)
@type number
@min 24
@max 300
@default 72
@desc キャンセルボタンの基本サイズ(px)

@param Vertical BtnZoom
@text スマホ縦持ち拡大率
@type number
@decimals 2
@min 0.50
@max 3.00
@default 1.25
@desc スマホ縦画面で表示したときのボタン拡大率

@param Tablet BtnZoom
@text タブレット横持ち拡大率
@type number
@decimals 2
@min 0.50
@max 3.00
@default 0.90
@desc タブレット横画面で表示したときのボタン拡大率

@param TabVertical BtnZoom
@text タブレット縦持ち拡大率
@type number
@decimals 2
@min 0.50
@max 3.00
@default 1.05
@desc タブレット縦画面で表示したときのボタン拡大率

@param --- 通常位置・退避位置設定 ---
@default

@param CancelBtn Orientation
@text [通常時] 基準位置
@type select
@option 右下 (right; bottom)
@value right; bottom
@option 左下 (left; bottom)
@value left; bottom
@option 右上 (right; top)
@value right; top
@option 左上 (left; top)
@value left; top
@default right; bottom
@desc マップやメニュー画面でのキャンセルボタンの基準位置

@param CancelBtn Margin
@text [通常時] 画面端からの余白(px)
@type string
@default 14; 14
@desc 通常位置の画面端からの余白。「横余白; 縦余白」の形式で指定（例: 14; 14）

@param Evacuate Orientation
@text [退避時] 基準位置
@type select
@option 右上 (right; top)
@value right; top
@option 左上 (left; top)
@value left; top
@option 右下 (right; bottom)
@value right; bottom
@option 左下 (left; bottom)
@value left; bottom
@default right; top
@desc 戦闘画面などUIと被る場面での退避先基準位置

@param Evacuate Margin
@text [退避時] 画面端からの余白(px)
@type string
@default 14; 14
@desc 退避位置の画面端からの余白。「横余白; 縦余白」の形式で指定（例: 14; 14）

@param --- 自動非表示・退避ルール ---
@default

@param Choice With Text Mode
@text 選択肢中（文章あり）の挙動
@type select
@option 非表示にする (hidden)
@value hidden
@option 退避位置へ移動 (evacuate)
@value evacuate
@option 通常位置で表示 (normal)
@value normal
@default hidden
@desc メッセージ文章と一緒に選択肢ウィンドウが表示されているときのキャンセルボタンの扱い

@param Choice Only Mode
@text 選択肢中（文章なし）の挙動
@type select
@option 退避位置へ移動 (evacuate)
@value evacuate
@option 非表示にする (hidden)
@value hidden
@option 通常位置で表示 (normal)
@value normal
@default evacuate
@desc メッセージ文章がなく選択肢ウィンドウのみが表示されているときのキャンセルボタンの扱い

@param Evacuate Scenes
@text 退避位置へ移動するシーン一覧
@type string
@default Scene_Battle, Scene_Shop
@desc 通常位置だと下部UIと被るため退避位置へ移動させるシーンクラス名（カンマ区切り）
*/

var Imported = Imported || {};
Imported.UCHU_CancelAndTapOk = "1.0.0";

(function () {
    "use strict";

    const pluginName = document.currentScript
        ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1])
        : "UCHU_CancelAndTapOk";

    const Parameters = PluginManager.parameters(pluginName);

    function parseSpot(str, fallback) {
        const parts = String(str || fallback).split(";");
        return [
            (parts[0] || "right").replace(/\s+/g, ""),
            (parts[1] || "bottom").replace(/\s+/g, "")
        ];
    }

    function parseMargin(str, fallback) {
        const parts = String(str || fallback).split(";");
        return [
            Number((parts[0] || "14").trim()) || 0,
            Number((parts[1] || "14").trim()) || 0
        ];
    }

    function resolveImageUrl(rawPath) {
        const path = String(rawPath || "").trim();
        if (!path) return "";
        if (path.startsWith("./") || path.startsWith("img/")) {
            return path.endsWith(".png") ? path : path + ".png";
        }
        return "./img/" + (path.endsWith(".png") ? path : path + ".png");
    }

    const PRM = {
        pcBtn: Parameters["PC BtnDisplay"] === "true",
        imageUrl: resolveImageUrl(Parameters["CancelBtn Image"] || "system/CancelButton"),
        opacity: Number(Parameters["Button Opacity"] !== undefined ? Parameters["Button Opacity"] : 0.75),
        fadeDuration: Number(Parameters["Fade Duration"] !== undefined ? Parameters["Fade Duration"] : 90),
        tapMaxMove: Number(Parameters["Tap Max Move"] !== undefined ? Parameters["Tap Max Move"] : 8),
        size: Number(Parameters["CancelBtn Size"] !== undefined ? Parameters["CancelBtn Size"] : 72),
        vZoom: Number(Parameters["Vertical BtnZoom"] !== undefined ? Parameters["Vertical BtnZoom"] : 1.25),
        tabZoom: Number(Parameters["Tablet BtnZoom"] !== undefined ? Parameters["Tablet BtnZoom"] : 0.90),
        tabvZoom: Number(Parameters["TabVertical BtnZoom"] !== undefined ? Parameters["TabVertical BtnZoom"] : 1.05),
        normalSpot: parseSpot(Parameters["CancelBtn Orientation"], "right; bottom"),
        normalMargin: parseMargin(Parameters["CancelBtn Margin"], "14; 14"),
        evacuateSpot: parseSpot(Parameters["Evacuate Orientation"], "right; top"),
        evacuateMargin: parseMargin(Parameters["Evacuate Margin"], "14; 14"),
        choiceWithTextMode: String(Parameters["Choice With Text Mode"] || "hidden"),
        choiceOnlyMode: String(Parameters["Choice Only Mode"] || "evacuate"),
        evacuateScenes: String(Parameters["Evacuate Scenes"] || "Scene_Battle, Scene_Shop")
            .split(",")
            .map(s => s.trim())
            .filter(Boolean)
    };

    const ua = (function (u) {
        return {
            Tablet: (u.indexOf("windows") !== -1 && u.indexOf("touch") !== -1) ||
                u.indexOf("ipad") !== -1 ||
                (u.indexOf("android") !== -1 && u.indexOf("mobile") === -1) ||
                (u.indexOf("firefox") !== -1 && u.indexOf("tablet") !== -1) ||
                u.indexOf("kindle") !== -1 ||
                u.indexOf("silk") !== -1 ||
                u.indexOf("playbook") !== -1
        };
    })(window.navigator.userAgent.toLowerCase());

    const hvzoom = ua.Tablet ? [PRM.tabZoom, PRM.tabvZoom] : [1, PRM.vZoom];
    const isButtonEnabled = Utils.isMobileDevice() || PRM.pcBtn;

    // 1フレームだけのトリガー入力管理（新規押し専用）
    let escapeTriggerFrames = 0;
    let okTriggerFrames = 0;
    let cancelButtonInstance = null;

    function triggerOneFrameKey(keyName) {
        Input._currentState[keyName] = true;
        if (keyName === "escape") {
            escapeTriggerFrames = 1;
        } else if (keyName === "ok") {
            okTriggerFrames = 1;
        }
    }

    const _Input_update = Input.update;
    Input.update = function () {
        _Input_update.call(this);
        if (escapeTriggerFrames > 0) {
            escapeTriggerFrames--;
            if (escapeTriggerFrames === 0) {
                this._currentState["escape"] = false;
            }
        }
        if (okTriggerFrames > 0) {
            okTriggerFrames--;
            if (okTriggerFrames === 0) {
                this._currentState["ok"] = false;
            }
        }
    };

    //-------------------------------------------------------------------------
    // Cancel Button DOM Controller
    //-------------------------------------------------------------------------
    class CancelButtonController {
        constructor() {
            this._currentMode = "hidden";
            this._currentPosMode = "";
            this._initializedTransition = false;
            this.createDom();
        }

        createDom() {
            const img = new Image();
            img.onerror = () => {
                console.warn(`[${pluginName}] CancelBtn Image was not found: ${PRM.imageUrl}`);
            };
            img.src = PRM.imageUrl;

            const div = document.createElement("div");
            div.id = "escapeBtn";
            div.style.position = "fixed";
            div.style.width = PRM.size + "px";
            div.style.height = PRM.size + "px";
            div.style.opacity = "0";
            div.style.pointerEvents = "none";
            div.style.zIndex = "20";
            div.style.userSelect = "none";
            div.style.webkitUserSelect = "none";
            div.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
            div.style.background = `url(${PRM.imageUrl}) 50% 50% / contain no-repeat`;

            this.div = div;
            this.applyPosition("normal");

            // 新規押し（touchstart / mousedown）のみを受け付け、背後へのイベント貫通を完全遮断
            const onNewPress = (e) => {
                e.stopPropagation();
                if (e.cancelable) {
                    e.preventDefault();
                }
                if (this._currentMode === "hidden") return;
                if (SceneManager.isSceneChanging()) return;
                triggerOneFrameKey("escape");
            };

            div.addEventListener("touchstart", onNewPress, { passive: false });
            div.addEventListener("touchmove", (e) => {
                e.stopPropagation();
                if (e.cancelable) e.preventDefault();
            }, { passive: false });
            div.addEventListener("touchend", (e) => {
                e.stopPropagation();
                if (e.cancelable) e.preventDefault();
            }, { passive: false });

            if (!Utils.isMobileDevice() && PRM.pcBtn) {
                div.addEventListener("mousedown", onNewPress, false);
                div.addEventListener("mouseup", (e) => e.stopPropagation(), false);
                div.addEventListener("click", (e) => e.stopPropagation(), false);
            }

            document.body.appendChild(div);
        }

        applyPosition(posMode) {
            if (this._currentPosMode === posMode) return;
            this._currentPosMode = posMode;

            const spot = posMode === "evacuate" ? PRM.evacuateSpot : PRM.normalSpot;
            const margin = posMode === "evacuate" ? PRM.evacuateMargin : PRM.normalMargin;

            this.div.style.top = "";
            this.div.style.bottom = "";
            this.div.style.left = "";
            this.div.style.right = "";

            this.div.style[spot[0]] = margin[0] + "px";
            this.div.style[spot[1]] = margin[1] + "px";
        }

        setDisplayMode(mode) {
            if (!this._initializedTransition) {
                this._initializedTransition = true;
                requestAnimationFrame(() => {
                    this.div.style.transition = `opacity ${PRM.fadeDuration}ms ease`;
                });
            }

            if (mode !== "hidden") {
                this.applyPosition(mode);
            }

            if (this._currentMode === mode) return;
            this._currentMode = mode;

            if (mode === "hidden") {
                this.div.style.opacity = "0";
                this.div.style.pointerEvents = "none";
            } else {
                this.div.style.opacity = String(PRM.opacity);
                this.div.style.pointerEvents = "auto";
            }
        }

        updateZoom(zoom) {
            this.div.style.zoom = zoom;
        }
    }

    function evaluateDesiredButtonMode() {
        const scene = SceneManager._scene;
        if (!scene) return "hidden";

        const ctorName = scene.constructor ? scene.constructor.name : "";
        if (ctorName === "Scene_Boot" || ctorName === "Scene_Title" || ctorName === "Scene_Gameover") {
            return "hidden";
        }

        // メッセージ・選択肢ウィンドウ稼働中の判定
        if ($gameMessage && $gameMessage.isBusy()) {
            if ($gameMessage.isChoice()) {
                return $gameMessage.hasText() ? PRM.choiceWithTextMode : PRM.choiceOnlyMode;
            }
            return "hidden";
        }

        // UI重複回避の退避シーン判定
        if (PRM.evacuateScenes.includes(ctorName)) {
            return "evacuate";
        }

        return "normal";
    }

    //-------------------------------------------------------------------------
    // Scene_Base & Graphics Integration
    //-------------------------------------------------------------------------
    const _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function () {
        _Scene_Base_start.call(this);
        if (isButtonEnabled) {
            if (!cancelButtonInstance) {
                cancelButtonInstance = new CancelButtonController();
                Graphics._updateRealScale();
                document.documentElement.style.webkitUserSelect = "none";
            }
            cancelButtonInstance.setDisplayMode(evaluateDesiredButtonMode());
        }
    };

    const _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function () {
        _Scene_Base_update.call(this);
        if (cancelButtonInstance) {
            cancelButtonInstance.setDisplayMode(evaluateDesiredButtonMode());
        }
    };

    const _Graphics_updateRealScale = Graphics._updateRealScale;
    Graphics._updateRealScale = function () {
        _Graphics_updateRealScale.call(this);
        if (cancelButtonInstance) {
            const zoom = window.innerWidth < window.innerHeight ? hvzoom[1] : hvzoom[0];
            cancelButtonInstance.updateZoom(zoom);
        }
    };

    //-------------------------------------------------------------------------
    // Scene_Map: 短タップ決定＆タッチ目的地移動の無効化
    //-------------------------------------------------------------------------
    let tapTracking = false;
    let tapStartX = 0;
    let tapStartY = 0;

    // マップ上でのタッチ目的地設定を無効化
    const _Game_Temp_setDestination = Game_Temp.prototype.setDestination;
    Game_Temp.prototype.setDestination = function (x, y) {
        if (SceneManager._scene instanceof Scene_Map) {
            this._destinationX = null;
            this._destinationY = null;
            return;
        }
        _Game_Temp_setDestination.call(this, x, y);
    };

    // VirtualStick.js 等によるタッチ座標方向への自動振り向き・イベント起動を抑止
    Game_Player.prototype.triggerTouchAction = function () {
        return false;
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        this.updateTapToOk();
        _Scene_Map_update.call(this);
    };

    Scene_Map.prototype.canAcceptMapTapOk = function () {
        if (SceneManager.isSceneChanging()) return false;
        if ($gameMap.isEventRunning() || this.isBusy()) return false;
        if ($gameMessage && $gameMessage.isBusy()) return false;
        if (!$gamePlayer || !$gamePlayer.canMove()) return false;
        if (Utils.RPGMAKER_NAME === "MZ" && this.isAnyButtonPressed && this.isAnyButtonPressed()) {
            return false;
        }
        return true;
    };

    Scene_Map.prototype.updateTapToOk = function () {
        if (TouchInput.isTriggered()) {
            if (this.canAcceptMapTapOk()) {
                tapTracking = true;
                tapStartX = TouchInput.x;
                tapStartY = TouchInput.y;
            } else {
                tapTracking = false;
            }
        }

        if (tapTracking && TouchInput.isPressed()) {
            const dx = TouchInput.x - tapStartX;
            const dy = TouchInput.y - tapStartY;
            if (Math.hypot(dx, dy) >= PRM.tapMaxMove) {
                // 一定以上指が動いた場合は仮想スティック操作とみなしてタップ決定をキャンセル
                tapTracking = false;
            }
        }

        if (TouchInput.isReleased()) {
            if (tapTracking && this.canAcceptMapTapOk()) {
                triggerOneFrameKey("ok");
            }
            tapTracking = false;
        }
    };
})();