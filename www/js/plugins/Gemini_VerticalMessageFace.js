//=============================================================================
// Gemini_VerticalMessageFace.js
//=============================================================================
/*:
 * @plugindesc [480x720縦長画面向け] 顔グラウィンドウ外拡大配置・Z順制御・高機能自動改行
 * @author Gemini
 *
 * @param FaceScale
 * @text 顔グラ拡大率
 * @desc 純正サイズ(144x144)に対する拡大率です。(例: 1.20 = 約173x173px)
 * @type number
 * @decimals 2
 * @min 0.50
 * @max 3.00
 * @default 1.20
 *
 * @param LayerOrder
 * @text 顔グラの描画順(Z順)
 * @desc ウィンドウとの前後関係を指定します。どちらを選んでも名前ウィンドウより背面になります。
 * @type select
 * @option メッセージ窓の手前 / 名前窓の背面 (推奨)
 * @value betweenWindows
 * @option メッセージ窓・名前窓の両方より背面
 * @value belowWindow
 * @default betweenWindows
 *
 * @param BottomFaceX
 * @text [下ウィンドウ時] 顔グラX座標
 * @desc メッセージウィンドウ左端を0としたXオフセット(px)
 * @type number
 * @min -480
 * @max 480
 * @default 12
 *
 * @param BottomFaceY
 * @text [下ウィンドウ時] 顔グラY座標
 * @desc メッセージウィンドウ上端を0としたYオフセット(px)。マイナスで上へ移動
 * @type number
 * @min -720
 * @max 720
 * @default -164
 *
 * @param MiddleFaceX
 * @text [中ウィンドウ時] 顔グラX座標
 * @desc メッセージウィンドウ左端を0としたXオフセット(px)
 * @type number
 * @min -480
 * @max 480
 * @default 12
 *
 * @param MiddleFaceY
 * @text [中ウィンドウ時] 顔グラY座標
 * @desc メッセージウィンドウ上端を0としたYオフセット(px)。マイナスで上へ移動
 * @type number
 * @min -720
 * @max 720
 * @default -164
 *
 * @param TopFaceX
 * @text [上ウィンドウ時] 顔グラX座標
 * @desc メッセージウィンドウ左端を0としたXオフセット(px)
 * @type number
 * @min -480
 * @max 480
 * @default 12
 *
 * @param TopFaceY
 * @text [上ウィンドウ時] 顔グラY座標
 * @desc メッセージウィンドウ上端を0としたYオフセット(px)。上配置時は下側へ出すのが推奨
 * @type number
 * @min -720
 * @max 720
 * @default 172
 *
 * @param EnableAutoWrap
 * @text 自動改行を有効化
 * @desc 文章がウィンドウ右端に達した際に自動で改行します。
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 *
 * @param WrapRightMargin
 * @text 自動改行の右余白(px)
 * @desc ウィンドウ右端から何px手前で折り返すかを指定します。
 * @type number
 * @min 0
 * @max 100
 * @default 8
 *
 * @param LineStartKinsokuChars
 * @text 行頭禁則文字リスト
 * @desc これらの文字が行頭に来そうになった場合、1文字手前で改行します。
 * @type string
 * @default 、。！？）」』】〉》〕］｝・ー〜.,!?)
 *
 * @param LineEndKinsokuChars
 * @text 行末禁則文字リスト
 * @desc これらの文字が行末に孤立しそうになった場合、その文字ごと次行へ送ります。
 * @type string
 * @default 「『（【［〈《
 *
 * @param PreventShortWordBreak
 * @text 短い英数字の途中分断を防止
 * @desc 指定文字数以下の連続する半角英数字が右端で途切れる場合、単語ごと次行へ送ります。
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 *
 * @param ShortWordMaxLen
 * @text 分断防止する英数字の最大長
 * @desc この文字数以下の連続半角英数字を1つの塊として扱います。(例: 10000G, HP500)
 * @type number
 * @min 2
 * @max 30
 * @default 10
 *
 * @param EnableHangingIndent
 * @text ぶら下げインデントを有効化
 * @desc 行頭が括弧や箇条書き記号で始まる場合、次行以降を記号幅分だけ字下げします。
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 *
 * @param KeepIndentOnManualNewLine
 * @text 括弧内の手動改行でも字下げ維持
 * @desc 括弧が閉じられる前に手動改行(\n)が入った場合も字下げを維持します。(直後の連続空白は自動吸収)
 * @type boolean
 * @on 維持する
 * @off 維持しない
 * @default true
 *
 * @param HangingOpenBrackets
 * @text ぶら下げ対象：開き括弧
 * @desc 行頭にある場合、対応する閉じ括弧まで次行以降を字下げする開き括弧リスト
 * @type string
 * @default 「『（【［〈《
 *
 * @param HangingCloseBrackets
 * @text ぶら下げ対象：閉じ括弧
 * @desc 上記の開き括弧と1対1で対応する閉じ括弧リスト（同じ順番で記述）
 * @type string
 * @default 」』）】］〉》
 *
 * @param HangingBulletChars
 * @text ぶら下げ対象：箇条書き記号
 * @desc 行頭にある場合、手動改行されるまで次行以降を字下げする記号リスト
 * @type string
 * @default ・※＊●■◆▶-
 *
 * @param WarnLineOverflow
 * @text 5行目突入時のコンソール警告
 * @desc テストプレイ中、自動改行等で4行枠を超えた場合にF8コンソールへ警告を出します。
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 *
 * @help
 * ============================================================================
 * 概要
 * ============================================================================
 * スマホ向け縦長解像度(480x720想定)のRPGツクールMV作品向けに、
 * 以下の機能を実装します。
 *
 * 1. 顔グラフィックのウィンドウ外配置＆拡大表示
 *    メッセージウィンドウ内の顔グラ用余白(字下げ)をなくし、ウィンドウ幅
 *    いっぱいを文章表示に使用します。
 *
 * 2. ウィンドウ位置(上・中・下)に応じた座標自動切替
 *    「文章の表示」で指定されたウィンドウ位置に応じて、X/Y座標を切り替えます。
 *
 * 3. 名前ウィンドウ(Lunatlazur_ActorNameWindow)より背面へのZ順制御
 *    ツクールMVのWindowLayer仕様を回避し、顔グラをWindow_Messageの子要素
 *    またはシーン背面レイヤーに配置することで、名前ウィンドウの背面に描画します。
 *
 * 4. 高機能自動改行（行頭・行末禁則／英数字分断防止／ぶら下げインデント）
 *    ・行頭禁則（句読点・閉じ括弧等）および行末禁則（開き括弧等）に対応。
 *    ・短い半角英数字の途中改行を防止。
 *    ・行頭が括弧や箇条書き記号で始まる場合、記号幅（直後のスペース含む）分だけ
 *      2行目以降をぶら下げインデントします（地の文途中の括弧は字下げしません）。
 *    ・二重括弧のネストや、括弧内での手動改行後のインデント維持（および
 *      改行直後の手打ち連続空白の自動吸収）にも対応します。
 *
 * ============================================================================
 * 注意点
 * ============================================================================
 * ・プラグイン管理画面では「Lunatlazur_ActorNameWindow」よりも下(後)に
 *   本プラグインを配置してください。
 * ・1回の「文章の表示」で表示できる最大行数はMV標準の4行までです。
 *   5行目以降は枠外に見切れるため、F8コンソール警告を参考にページを分けてください。
 */

(function() {
    'use strict';

    var pluginName = 'Gemini_VerticalMessageFace';
    var parameters = PluginManager.parameters(pluginName);

    var faceScale                 = Number(parameters['FaceScale'] || 1.20);
    var layerOrder                = String(parameters['LayerOrder'] || 'betweenWindows');
    var bottomFaceX               = Number(parameters['BottomFaceX'] || 12);
    var bottomFaceY               = Number(parameters['BottomFaceY'] || -164);
    var middleFaceX               = Number(parameters['MiddleFaceX'] || 12);
    var middleFaceY               = Number(parameters['MiddleFaceY'] || -164);
    var topFaceX                  = Number(parameters['TopFaceX'] || 12);
    var topFaceY                  = Number(parameters['TopFaceY'] || 172);
    var enableAutoWrap            = String(parameters['EnableAutoWrap'] || 'true') === 'true';
    var wrapRightMargin           = Number(parameters['WrapRightMargin'] || 8);
    var lineStartKinsokuChars     = String(parameters['LineStartKinsokuChars'] || '\u3001\u3002\uff01\uff1f\uff09\u300d\u300f\u3011\u3009\u300b\u3015\uff3d\uff5d\u30fb\u30fc\u301c.,!?)');
    var lineEndKinsokuChars       = String(parameters['LineEndKinsokuChars'] || '\u300c\u300e\uff08\u3010\uff3b\u3008\u300a');
    var preventShortWordBreak     = String(parameters['PreventShortWordBreak'] || 'true') === 'true';
    var shortWordMaxLen           = Number(parameters['ShortWordMaxLen'] || 10);
    var enableHangingIndent       = String(parameters['EnableHangingIndent'] || 'true') === 'true';
    var keepIndentOnManualNewLine = String(parameters['KeepIndentOnManualNewLine'] || 'true') === 'true';
    var hangingOpenBrackets       = String(parameters['HangingOpenBrackets'] || '\u300c\u300e\uff08\u3010\uff3b\u3008\u300a');
    var hangingCloseBrackets      = String(parameters['HangingCloseBrackets'] || '\u300d\u300f\uff09\u3011\uff3d\u3009\u300b');
    var hangingBulletChars        = String(parameters['HangingBulletChars'] || '\u30fb\u203b\uff0a\u25cf\u25a0\u25c6\u25b6-');
    var warnLineOverflow          = String(parameters['WarnLineOverflow'] || 'true') === 'true';

    //-------------------------------------------------------------------------
    // Window_Message: 初期化・状態管理
    //-------------------------------------------------------------------------
    var _Window_Message_initMembers = Window_Message.prototype.initMembers;
    Window_Message.prototype.initMembers = function() {
        _Window_Message_initMembers.call(this);
        this.resetHangingIndentState();
        this._currentLineCount = 1;
        this._currentLineStartX = 0;
        this._overflowWarned = false;
        this._isExternalFaceReady = false;
        this._faceLoadRequestId = 0;
    };

    Window_Message.prototype.clearExternalFaceSprite = function() {
        this._isExternalFaceReady = false;
        this._faceLoadRequestId++;
        if (this._externalFaceSprite) {
            this._externalFaceSprite.visible = false;
            this._externalFaceSprite.bitmap = null;
        }
    };

    Window_Message.prototype.resetHangingIndentState = function() {
        this._isParagraphStart = true;
        this._hangingIndentWidth = 0;
        this._hangingTargetOpenBracket = '';
        this._hangingTargetCloseBracket = '';
        this._hangingBracketDepth = 0;
        this._hangingSpacePending = false;
        this._absorbLeadingSpaces = false;
    };

    var _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        // ウィンドウが完全に閉じた状態からの新規会話、または顔グラなしメッセージの場合のみ事前クリア
        if (this.isClosed() || !$gameMessage.faceName()) {
            this.clearExternalFaceSprite();
        }
        this.resetHangingIndentState();
        this._currentLineCount = 1;
        this._overflowWarned = false;
        _Window_Message_startMessage.call(this);
        if (this._textState) {
            this._currentLineStartX = this._textState.x;
        }
    };

    var _Window_Message_newPage = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function(textState) {
        // ページ送り時に顔グラが指定されていない場合のみ即時クリア（顔グラありなら上書き差し替え）
        if (!$gameMessage.faceName()) {
            this.clearExternalFaceSprite();
        }
        this.resetHangingIndentState();
        this._currentLineCount = 1;
        this._overflowWarned = false;
        _Window_Message_newPage.call(this, textState);
        if (textState) {
            this._currentLineStartX = textState.x;
        }
    };

    //-------------------------------------------------------------------------
    // Window_Message: 顔グラ用インデントの廃止
    //-------------------------------------------------------------------------
    var _Window_Message_newLineX = Window_Message.prototype.newLineX;
    Window_Message.prototype.newLineX = function() {
        if ($gameMessage.faceName()) {
            return 0;
        }
        return _Window_Message_newLineX.call(this);
    };

    //-------------------------------------------------------------------------
    // Window_Message: 外部顔グラスプライトの生成とZ順制御
    //-------------------------------------------------------------------------
    Window_Message.prototype.ensureExternalFaceSprite = function() {
        if (!this._externalFaceSprite) {
            this._externalFaceSprite = new Sprite();
            this._externalFaceSprite.visible = false;
        }

        if (layerOrder === 'belowWindow') {
            var scene = SceneManager._scene;
            if (scene && scene._windowLayer) {
                var wlIndex = scene.children.indexOf(scene._windowLayer);
                var currentIdx = scene.children.indexOf(this._externalFaceSprite);
                if (currentIdx === -1 || currentIdx > wlIndex) {
                    scene.addChildAt(this._externalFaceSprite, Math.max(0, wlIndex));
                }
            }
        } else {
            if (this._externalFaceSprite.parent !== this) {
                this.addChild(this._externalFaceSprite);
            }
        }
    };

    //-------------------------------------------------------------------------
    // Window_Message: 顔グラ描画と位置更新（ちらつき防止＆残像防止の両立）
    //-------------------------------------------------------------------------
    Window_Message.prototype.drawMessageFace = function() {
        var faceName = $gameMessage.faceName();
        var faceIndex = $gameMessage.faceIndex();
        this.ensureExternalFaceSprite();

        if (!faceName || !this._externalFaceSprite) {
            this.clearExternalFaceSprite();
            return;
        }

        // ウィンドウが閉じている（新規会話開始）場合のみ前の残像を消してからロード開始
        if (this.isClosed() || this.openness === 0) {
            this.clearExternalFaceSprite();
        }

        this._faceLoadRequestId++;
        var requestId = this._faceLoadRequestId;
        var sprite = this._externalFaceSprite;
        var bitmap = ImageManager.loadFace(faceName);
        var self = this;

        bitmap.addLoadListener(function() {
            if (self._faceLoadRequestId !== requestId) {
                return;
            }
            if ($gameMessage.faceName() !== faceName || $gameMessage.faceIndex() !== faceIndex) {
                return;
            }

            var pw = Window_Base._faceWidth;
            var ph = Window_Base._faceHeight;
            var sx = (faceIndex % 4) * pw;
            var sy = Math.floor(faceIndex / 4) * ph;

            // 座標・スケール・フレームを整えた状態でビットマップを一括差し替え
            sprite.scale.x = faceScale;
            sprite.scale.y = faceScale;
            self.updateExternalFacePosition();
            sprite.bitmap = bitmap;
            sprite.setFrame(sx, sy, pw, ph);
            self._isExternalFaceReady = true;
            sprite.visible = self.openness > 0;
        });
    };

    Window_Message.prototype.updateExternalFacePosition = function() {
        if (!this._externalFaceSprite) {
            return;
        }
        var posType = $gameMessage.positionType();
        var offsetX = bottomFaceX;
        var offsetY = bottomFaceY;

        if (posType === 0) {
            offsetX = topFaceX;
            offsetY = topFaceY;
        } else if (posType === 1) {
            offsetX = middleFaceX;
            offsetY = middleFaceY;
        } else {
            offsetX = bottomFaceX;
            offsetY = bottomFaceY;
        }

        if (layerOrder === 'belowWindow') {
            this._externalFaceSprite.x = this.x + offsetX;
            this._externalFaceSprite.y = this.y + offsetY;
        } else {
            this._externalFaceSprite.x = offsetX;
            this._externalFaceSprite.y = offsetY;
        }
    };

    var _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        _Window_Message_updatePlacement.call(this);
        this.ensureExternalFaceSprite();
        this.updateExternalFacePosition();
    };

    var _Window_Message_update = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        _Window_Message_update.call(this);
        if (this._externalFaceSprite) {
            // 連続する「文章の表示」の合間に1フレームだけ $gameMessage.faceName() が空になる仕様を無視し、
            // ウィンドウが完全に閉じた（isClosed）タイミングでのみ残像を消去する
            if (this.isClosed()) {
                if (this._isExternalFaceReady || this._externalFaceSprite.bitmap) {
                    this.clearExternalFaceSprite();
                }
                return;
            }
            this._externalFaceSprite.visible = this._isExternalFaceReady && this.openness > 0;
            this._externalFaceSprite.opacity = this.contentsOpacity;
            if (this._externalFaceSprite.visible) {
                this.updateExternalFacePosition();
            }
        }
    };

    var _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        _Window_Message_terminateMessage.call(this);
        this.resetHangingIndentState();
    };

    //-------------------------------------------------------------------------
    // Window_Message: 文字判定・禁則処理・英数字塊幅計測
    //-------------------------------------------------------------------------
    Window_Message.prototype.isSpaceChar = function(ch) {
        return ch === '\u0020' || ch === '\u3000' || ch === '\u00A0';
    };

    Window_Message.prototype.isLineStartKinsoku = function(ch) {
        return !!ch && lineStartKinsokuChars.indexOf(ch) !== -1;
    };

    Window_Message.prototype.isLineEndKinsoku = function(ch) {
        return !!ch && lineEndKinsokuChars.indexOf(ch) !== -1;
    };

    Window_Message.prototype.isWordChar = function(ch) {
        return !!ch && /[A-Za-z0-9_.,+\-%]/.test(ch);
    };

    Window_Message.prototype.measureShortWordWidth = function(textState) {
        var text = textState.text;
        var idx = textState.index;
        var current = text[idx];
        if (!this.isWordChar(current)) {
            return 0;
        }
        if (idx > 0 && this.isWordChar(text[idx - 1])) {
            return 0;
        }
        var len = 0;
        var word = '';
        while (idx + len < text.length && this.isWordChar(text[idx + len])) {
            word += text[idx + len];
            len++;
            if (len > shortWordMaxLen) {
                return 0;
            }
        }
        return len >= 2 ? this.textWidth(word) : 0;
    };

    Window_Message.prototype.shouldAutoWrap = function(textState, itemWidth) {
        if (!enableAutoWrap || !textState) {
            return false;
        }
        if (textState.x <= this._currentLineStartX) {
            return false;
        }

        var maxWidth = this.contentsWidth() - wrapRightMargin;
        var currentChar = textState.text[textState.index];

        if (textState.x + itemWidth > maxWidth) {
            if (!this.isLineStartKinsoku(currentChar)) {
                return true;
            }
        }

        if (this.isLineEndKinsoku(currentChar)) {
            var afterOpen = textState.text[textState.index + 1];
            if (afterOpen && afterOpen !== '\n' && afterOpen !== '\r' && afterOpen !== '\x1b') {
                if (textState.x + itemWidth + this.textWidth(afterOpen) > maxWidth) {
                    return true;
                }
            }
        }

        if (preventShortWordBreak) {
            var wordWidth = this.measureShortWordWidth(textState);
            if (wordWidth > 0 && textState.x + wordWidth > maxWidth) {
                return true;
            }
        }

        var nextChar = textState.text[textState.index + 1];
        if (nextChar && nextChar !== '\n' && nextChar !== '\r' && nextChar !== '\x1b' && this.isLineStartKinsoku(nextChar)) {
            var nextWidth = this.textWidth(nextChar);
            if (textState.x + itemWidth + nextWidth > maxWidth) {
                return true;
            }
        }

        return false;
    };

    Window_Message.prototype.insertAutoNewLine = function(textState) {
        this._isAutoWrapping = true;
        textState.index--;
        this.processNewLine(textState);
        this._isAutoWrapping = false;
    };

    var _Window_Message_processNewLine = Window_Message.prototype.processNewLine;
    Window_Message.prototype.processNewLine = function(textState) {
        _Window_Message_processNewLine.call(this, textState);

        this._currentLineCount++;
        if (warnLineOverflow && !this._overflowWarned && this._currentLineCount > 4) {
            this._overflowWarned = true;
            if (typeof $gameTemp !== 'undefined' && $gameTemp && $gameTemp.isPlaytest()) {
                console.warn('[Gemini_VerticalMessageFace] メッセージが5行目に入り枠外に見切れています:', $gameMessage.allText());
            }
        }

        if (this._isAutoWrapping) {
            if (enableHangingIndent && this._hangingIndentWidth > 0) {
                textState.x += this._hangingIndentWidth;
            }
        } else {
            if (enableHangingIndent && keepIndentOnManualNewLine && this._hangingBracketDepth > 0 && this._hangingIndentWidth > 0) {
                textState.x += this._hangingIndentWidth;
                this._absorbLeadingSpaces = true;
            } else {
                this.resetHangingIndentState();
            }
        }

        this._currentLineStartX = textState.x;
    };

    Window_Message.prototype.updateHangingIndentByChar = function(c) {
        if (!enableHangingIndent || !c) {
            return;
        }
        if (this._isParagraphStart) {
            this._isParagraphStart = false;
            var openIdx = hangingOpenBrackets.indexOf(c);
            if (openIdx !== -1) {
                this._hangingIndentWidth = this.textWidth(c);
                this._hangingTargetOpenBracket = c;
                this._hangingTargetCloseBracket = hangingCloseBrackets[openIdx] || '';
                this._hangingBracketDepth = 1;
                this._hangingSpacePending = true;
                return;
            }
            if (hangingBulletChars.indexOf(c) !== -1) {
                this._hangingIndentWidth = this.textWidth(c);
                this._hangingTargetOpenBracket = '';
                this._hangingTargetCloseBracket = '';
                this._hangingBracketDepth = 0;
                this._hangingSpacePending = true;
                return;
            }
            this._hangingIndentWidth = 0;
            this._hangingTargetOpenBracket = '';
            this._hangingTargetCloseBracket = '';
            this._hangingBracketDepth = 0;
            this._hangingSpacePending = false;
        } else {
            if (this._hangingSpacePending) {
                this._hangingSpacePending = false;
                if (this.isSpaceChar(c)) {
                    this._hangingIndentWidth += this.textWidth(c);
                    return;
                }
            }
            if (this._hangingBracketDepth > 0) {
                if (this._hangingTargetOpenBracket && c === this._hangingTargetOpenBracket) {
                    this._hangingBracketDepth++;
                } else if (this._hangingTargetCloseBracket && c === this._hangingTargetCloseBracket) {
                    this._hangingBracketDepth--;
                    if (this._hangingBracketDepth <= 0) {
                        this._hangingBracketDepth = 0;
                        this._hangingIndentWidth = 0;
                        this._hangingTargetOpenBracket = '';
                        this._hangingTargetCloseBracket = '';
                    }
                }
            }
        }
    };

    var _Window_Message_processNormalCharacter = Window_Message.prototype.processNormalCharacter;
    Window_Message.prototype.processNormalCharacter = function(textState) {
        var c = textState.text[textState.index];

        if (c === '\r') {
            textState.index++;
            return;
        }

        if (this._absorbLeadingSpaces) {
            if (this.isSpaceChar(c)) {
                textState.index++;
                return;
            }
            if (c !== '\n' && c !== '\x1b') {
                this._absorbLeadingSpaces = false;
            }
        }

        if (c && c !== '\n') {
            var w = this.textWidth(c);
            if (this.shouldAutoWrap(textState, w)) {
                this.insertAutoNewLine(textState);
                if (this.pause) {
                    return;
                }
            }
            this.updateHangingIndentByChar(c);
        }
        _Window_Message_processNormalCharacter.call(this, textState);
    };

    var _Window_Message_processDrawIcon = Window_Message.prototype.processDrawIcon;
    Window_Message.prototype.processDrawIcon = function(iconIndex, textState) {
        this._absorbLeadingSpaces = false;
        var iconBoxWidth = Window_Base._iconWidth + 4;
        if (this.shouldAutoWrap(textState, iconBoxWidth)) {
            this.insertAutoNewLine(textState);
            if (this.pause) {
                return;
            }
        }
        if (this._isParagraphStart) {
            this._isParagraphStart = false;
            this._hangingSpacePending = false;
        }
        _Window_Message_processDrawIcon.call(this, iconIndex, textState);
    };

})();