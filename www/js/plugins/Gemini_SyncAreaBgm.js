//=============================================================================
// SyncAreaBgm.js (v1.0.2)
// ----------------------------------------------------------------------------
// Released under the MIT License.
//=============================================================================

/*:
 * @plugindesc エリア連携・再生位置引き継ぎクロスフェードBGMプラグイン
 * @author Assistant
 *
 * @param defaultFadeTime
 * @text デフォルトフェード秒数
 * @desc クロスフェードにかける標準の秒数です。
 * @default 1.5
 * @type number
 * @decimals 2
 * @min 0
 *
 * @param debugLog
 * @text デバッグログ出力
 * @desc F8(F12)コンソールにリージョン検知とBGM切り替え状況を出力します。
 * @default false
 * @type boolean
 *
 * @help
 * マップのメモ欄に以下の書式で記述します（複数行記述可能）。
 * <SyncBgm リージョンID: BGMファイル名>
 * <SyncBgm リージョンID: BGMファイル名, フェード秒数>
 *
 * 【プラグインコマンド】
 * SYNC_BGM_PLAY BGMファイル名 [フェード秒数]
 * SYNC_BGM_LOCK ON
 * SYNC_BGM_LOCK OFF
 */

(function() {
    'use strict';

    var pluginName = 'SyncAreaBgm';
    var parameters = PluginManager.parameters(pluginName);
    var defaultFadeTime = Number(parameters['defaultFadeTime'] || 1.5);
    var debugLog = String(parameters['debugLog'] || 'false') === 'true';

    function logDebug(msg) {
        if (debugLog && console && console.log) {
            console.log('[SyncAreaBgm] ' + msg);
        }
    }

    //=========================================================================
    // AudioManager 拡張（デコード済みキャッシュ＆精密位置引き継ぎ）
    //=========================================================================
    AudioManager._fadingOutBgms = [];
    AudioManager._crossFadeIn = null;
    AudioManager._syncBgmCache = {};

    /**
     * BGMを事前デコードしてキャッシュに保持する
     */
    AudioManager.preloadBgmBuffer = function(name) {
        if (!name) return null;
        if (!this._syncBgmCache[name]) {
            logDebug('プリロード開始: "' + name + '"');
            this._syncBgmCache[name] = this.createBuffer('bgm', name);
        }
        return this._syncBgmCache[name];
    };

    /**
     * キャッシュ済みのAudioBufferからデコード待ち0msのWebAudioインスタンスを生成
     */
    AudioManager.createInstantBgmBuffer = function(name) {
        var cached = this.preloadBgmBuffer(name);
        if (cached && cached.isReady() && cached._buffer) {
            var buf = Object.create(WebAudio.prototype);
            buf.clear();
            buf._url = cached._url;
            buf._buffer = cached._buffer;
            buf._totalTime = cached._totalTime;
            buf._sampleRate = cached._sampleRate;
            buf._loopStart = cached._loopStart;
            buf._loopLength = cached._loopLength;
            return buf;
        }
        // 未完了の場合は通常のバッファを返す
        return this.createBuffer('bgm', name);
    };

    var _AudioManager_stopBgm = AudioManager.stopBgm;
    AudioManager.stopBgm = function() {
        _AudioManager_stopBgm.apply(this, arguments);
        this.clearFadingOutBgms();
        this._crossFadeIn = null;
    };

    AudioManager.clearFadingOutBgms = function() {
        this._fadingOutBgms.forEach(function(item) {
            if (item.buffer) {
                item.buffer.stop();
            }
        });
        this._fadingOutBgms = [];
    };

    AudioManager.playSyncBgm = function(bgm, fadeTime) {
        if (!bgm || !bgm.name) return;
        fadeTime = (fadeTime !== undefined && !isNaN(fadeTime)) ? Math.max(0, fadeTime) : defaultFadeTime;

        if (this.isCurrentBgm(bgm)) {
            if (!this._crossFadeIn) {
                this.updateBgmParameters(bgm);
            }
            return;
        }

        // 現在の正確な再生位置（秒）と切り替え要求時刻を記録
        var currentPos = 0;
        if (this._bgmBuffer && this._bgmBuffer.isPlaying()) {
            currentPos = this._bgmBuffer.seek() || 0;
        }
        var requestTime = Date.now();

        // フェード時間が0以下の場合は即時切り替え
        if (fadeTime <= 0) {
            this.clearFadingOutBgms();
            this._crossFadeIn = null;
            this.playBgm(bgm, currentPos);
            return;
        }

        // 現在再生中のメインバッファをフェードアウト配列へ退避
        if (this._bgmBuffer && this._currentBgm) {
            var oldVol = this._crossFadeIn ? this._crossFadeIn.currentVolume : this._currentBgm.volume;
            this._fadingOutBgms.push({
                buffer: this._bgmBuffer,
                bgm: JsonEx.makeDeepCopy(this._currentBgm),
                startVolume: oldVol,
                startTime: requestTime,
                duration: fadeTime * 1000
            });
            this._bgmBuffer = null;
            this._currentBgm = null;
        }

        // キャッシュから即時再生用バッファを取得（未デコード時のみ非同期ロード）
        var newBuffer = this.createInstantBgmBuffer(bgm.name);
        var isInstant = newBuffer.isReady();

        var startBgm = {
            name: bgm.name,
            volume: 0,
            pitch: bgm.pitch || 100,
            pan: bgm.pan || 0
        };

        this._currentBgm = JsonEx.makeDeepCopy(bgm);
        this._bgmBuffer = newBuffer;
        this.updateBgmParameters(startBgm);

        this._crossFadeIn = {
            targetBgm: JsonEx.makeDeepCopy(bgm),
            currentVolume: 0,
            startTime: requestTime,
            duration: fadeTime * 1000
        };

        if (!this._meBuffer) {
            if (isInstant) {
                // キャッシュ済み：0msで完全同期再生
                var pos = this.normalizeSyncPos(newBuffer, currentPos);
                logDebug('即時同期切り替え: "' + bgm.name + '" (位置: ' + pos.toFixed(3) + '秒)');
                newBuffer.play(true, pos);
            } else {
                // 未デコード時：ロード完了までの経過時間を加算してズレを相殺
                var self = this;
                newBuffer.addLoadListener(function() {
                    var loadDelaySec = (Date.now() - requestTime) / 1000;
                    var compensatedPos = self.normalizeSyncPos(newBuffer, currentPos + loadDelaySec);
                    newBuffer._offset = compensatedPos;
                    logDebug('非同期補正切り替え: "' + bgm.name + '" (遅延補正: +' + loadDelaySec.toFixed(3) + '秒)');
                });
                newBuffer.play(true, currentPos);
            }
        }
    };

    /**
     * ループタグを考慮した安全な再生位置の正規化
     */
    AudioManager.normalizeSyncPos = function(buffer, pos) {
        if (pos <= 0 || !buffer) return 0;
        // ループ情報がある場合はMVコアスクリプトの _startPlaying が自動巻き戻しを行うためそのまま返す
        if (buffer._loopLength > 0) {
            return pos;
        }
        if (buffer._totalTime > 0) {
            return pos % buffer._totalTime;
        }
        return pos;
    };

    AudioManager.updateSyncBgmFade = function() {
        var now = Date.now();

        for (var i = this._fadingOutBgms.length - 1; i >= 0; i--) {
            var item = this._fadingOutBgms[i];
            var elapsed = now - item.startTime;
            var rate = Math.min(elapsed / item.duration, 1);
            var vol = item.startVolume * (1 - rate);

            if (item.buffer) {
                var configVolume = this._bgmVolume / 100;
                item.buffer.volume = configVolume * (vol / 100);
            }

            if (rate >= 1) {
                if (item.buffer) {
                    item.buffer.stop();
                }
                this._fadingOutBgms.splice(i, 1);
            }
        }

        if (this._crossFadeIn && this._bgmBuffer && this._currentBgm) {
            var fadeIn = this._crossFadeIn;
            var elapsedIn = now - fadeIn.startTime;
            var rateIn = Math.min(elapsedIn / fadeIn.duration, 1);
            var currentVol = Math.round(fadeIn.targetBgm.volume * rateIn);
            fadeIn.currentVolume = currentVol;

            var tempBgm = {
                name: fadeIn.targetBgm.name,
                volume: currentVol,
                pitch: fadeIn.targetBgm.pitch,
                pan: fadeIn.targetBgm.pan
            };
            this.updateBgmParameters(tempBgm);

            if (rateIn >= 1) {
                this.updateBgmParameters(fadeIn.targetBgm);
                this._crossFadeIn = null;
            }
        }
    };

    //=========================================================================
    // SceneManager / Scene_Map 連携
    //=========================================================================
    var _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene = function() {
        _SceneManager_updateScene.apply(this, arguments);
        AudioManager.updateSyncBgmFade();
    };

    var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.apply(this, arguments);
        $gameMap.preloadSyncBgms();
        $gamePlayer.checkSyncAreaBgm(true);
    };

    //=========================================================================
    // Game_System
    //=========================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._syncBgmLocked = false;
    };

    Game_System.prototype.isSyncBgmLocked = function() {
        return !!this._syncBgmLocked;
    };

    Game_System.prototype.setSyncBgmLocked = function(locked) {
        this._syncBgmLocked = !!locked;
    };

    //=========================================================================
    // Game_Map
    //=========================================================================
    var _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.apply(this, arguments);
        this.parseSyncBgmNotes();
        // マップ遷移フェード中にプリロードを開始させる
        this.preloadSyncBgms();
    };

    Game_Map.prototype.parseSyncBgmNotes = function() {
        this._syncBgmMap = {};
        if (!$dataMap || !$dataMap.note) return;

        var regex = /<SyncBgm[\s ]+(\d+)[\s ]*[:：][\s ]*([^,>\r\n]+)(?:[\s ]*[,，][\s ]*([\d.]+))?[\s ]*>/gi;
        var match;
        while ((match = regex.exec($dataMap.note)) !== null) {
            var regionId = Number(match[1]);
            var bgmName = match[2].trim();
            var fadeTime = match[3] !== undefined ? Number(match[3]) : defaultFadeTime;
            this._syncBgmMap[regionId] = {
                name: bgmName,
                volume: 90,
                pitch: 100,
                pan: 0,
                fadeTime: fadeTime
            };
        }
    };

    Game_Map.prototype.getSyncBgmByRegion = function(regionId) {
        return this._syncBgmMap ? this._syncBgmMap[regionId] : null;
    };

    Game_Map.prototype.preloadSyncBgms = function() {
        if (!this._syncBgmMap) return;
        Object.keys(this._syncBgmMap).forEach(function(regionId) {
            var data = this._syncBgmMap[regionId];
            if (data && data.name) {
                AudioManager.preloadBgmBuffer(data.name);
            }
        }, this);
    };

    //=========================================================================
    // Game_Player
    //=========================================================================
    var _Game_Player_updateMove = Game_Player.prototype.updateMove;
    Game_Player.prototype.updateMove = function() {
        var wasMoving = this.isMoving();
        _Game_Player_updateMove.apply(this, arguments);
        if (wasMoving && !this.isMoving()) {
            this.checkSyncAreaBgm(false);
        }
    };

    Game_Player.prototype.checkSyncAreaBgm = function(isMapEnter) {
        var regionId = $gameMap.regionId(this.x, this.y);
        if ($gameSystem.isSyncBgmLocked()) return;
        var syncData = $gameMap.getSyncBgmByRegion(regionId);
        if (syncData) {
            if (isMapEnter && (!AudioManager._currentBgm || !AudioManager._currentBgm.name)) {
                AudioManager.playBgm(syncData, 0);
            } else {
                AudioManager.playSyncBgm(syncData, syncData.fadeTime);
            }
        }
    };

    //=========================================================================
    // Game_Interpreter
    //=========================================================================
    var _Game_Interpreter_command241 = Game_Interpreter.prototype.command241;
    Game_Interpreter.prototype.command241 = function() {
        $gameSystem.setSyncBgmLocked(true);
        AudioManager.clearFadingOutBgms();
        AudioManager._crossFadeIn = null;
        return _Game_Interpreter_command241.apply(this, arguments);
    };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var cmd = (command || '').toUpperCase();
        if (cmd === 'SYNC_BGM_PLAY') {
            var bgmName = args[0];
            var fadeTime = args[1] !== undefined ? Number(args[1]) : defaultFadeTime;
            if (bgmName) {
                $gameSystem.setSyncBgmLocked(false);
                AudioManager.playSyncBgm({
                    name: bgmName,
                    volume: 90,
                    pitch: 100,
                    pan: 0
                }, fadeTime);
            }
        } else if (cmd === 'SYNC_BGM_LOCK') {
            var state = (args[0] || '').toUpperCase();
            if (state === 'ON') {
                $gameSystem.setSyncBgmLocked(true);
            } else if (state === 'OFF') {
                $gameSystem.setSyncBgmLocked(false);
                $gamePlayer.checkSyncAreaBgm(false);
            }
        }
    };
})();