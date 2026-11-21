// ===================================================================
// 架空都市「駒洋市」 いいね（スキ・拍手）集計 ＆ Discord自動通知スクリプト
// ===================================================================
// 【設置手順】
// 1. 本マップと連携している Googleスプレッドシート を開きます。
// 2. メニューバーの「拡張機能」 ＞ 「Apps Script」を開きます。
// 3. もともと書かれているコードを全消去し、このコードをすべて貼り付けます。
// 4. 下記の DISCORD_WEBHOOK_URL に、ご自身のDiscord Webhook URLを貼り付けます。
// 5. 右上の「デプロイ」 ＞ 「デプロイを管理」をクリックします。
// 6. 右上の鉛筆アイコン（編集）を押し、バージョンを「新バージョン」にして「デプロイ」を押します。
// ===================================================================

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1557951767231209585/OCz2glUXFlSkMOhMNl_ly5g0pTgkHbM08IwbGSXO027Ncq0fgVOxcXPVQQ3hwnsD2KYY";
const SHEET_NAME = "いいね集計";

// 作品ID（タイムスタンプなど）が日付型に自動変換されても一致させる正規化関数
function normalizeWorkId(val) {
  if (!val && val !== 0) return "";
  if (val instanceof Date) {
    return Utilities.formatDate(val, "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");
  }
  let s = String(val).trim();
  if (s.startsWith("'")) s = s.substring(1);
  return s;
}

// いいね送信（POSTリクエスト）を受け取ったときの処理
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ success: false, error: "No post data" });
    }

    const data = JSON.parse(e.postData.contents);
    const workId = String(data.workId || "").trim();
    const title = String(data.title || "無題の作品").trim();
    const author = String(data.author || "匿名").trim();
    const circle = String(data.circle || "一般").trim();
    // 1回の送信における拍手数の上限ガード（最大10回まで）
    const addCount = Math.min(Math.max(parseInt(data.count || 1, 10), 1), 10);
    const workUrl = String(data.url || "").trim();

    if (!workId) {
      return createJsonResponse({ success: false, error: "Missing workId" });
    }

    // 1. 「いいね集計」シートを取得（なければ自動作成）
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["作品ID", "作品タイトル", "作者名", "サークル名", "累計拍手（スキ）数", "最終更新日時"]);
      sheet.setFrozenRows(1);
      sheet.getRange("A1:F1").setBackground("#1e293b").setFontColor("#fcd34d").setFontWeight("bold");
    }

    // 2. 既存の行を検索してカウントを加算
    const values = sheet.getDataRange().getValues();
    let rowIndex = -1;
    let totalLikes = addCount;

    for (let i = 1; i < values.length; i++) {
      if (normalizeWorkId(values[i][0]) === workId) {
        rowIndex = i + 1; // 1-indexed
        const currentLikes = parseInt(values[i][4] || 0, 10);
        totalLikes = currentLikes + addCount;
        break;
      }
    }

    const nowStr = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");

    if (rowIndex > 0) {
      // 既存行を更新
      sheet.getRange(rowIndex, 2).setValue(title);
      sheet.getRange(rowIndex, 3).setValue(author);
      sheet.getRange(rowIndex, 4).setValue(circle);
      sheet.getRange(rowIndex, 5).setValue(totalLikes);
      sheet.getRange(rowIndex, 6).setValue(nowStr);
    } else {
      // 新規行を追加（workIdを文字列として保存）
      sheet.appendRow(["'" + workId, title, author, circle, totalLikes, nowStr]);
    }

    // 3. DiscordにWebhook通知を送信
    sendDiscordNotification({
      title: title,
      author: author,
      circle: circle,
      addCount: addCount,
      totalLikes: totalLikes,
      url: workUrl
    });

    return createJsonResponse({ success: true, workId: workId, totalLikes: totalLikes });

  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

// 全作品のいいね一覧を取得するAPI（GETリクエスト対応）
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const likesMap = {};

    if (sheet) {
      const values = sheet.getDataRange().getValues();
      for (let i = 1; i < values.length; i++) {
        const id = normalizeWorkId(values[i][0]);
        const count = parseInt(values[i][4] || 0, 10);
        if (id) {
          likesMap[id] = count;
        }
      }
    }

    return createJsonResponse({ success: true, likes: likesMap });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

// Discord Webhook送信関数
function sendDiscordNotification(item) {
  if (!DISCORD_WEBHOOK_URL || !DISCORD_WEBHOOK_URL.startsWith("http")) return;

  const countText = item.addCount > 1 
    ? `**+${item.addCount}** 回の拍手（連打スキ）` 
    : `**+1** 拍手`;

  const payload = {
    username: "駒洋市アーカイブ（komanadaBot）",
    embeds: [{
      title: "🌸 作品に「スキ・拍手」が届きました！",
      color: 0xf59e0b, // 駒洋ゴールド
      fields: [
        { name: "作品タイトル", value: `『${item.title}』`, inline: true },
        { name: "作者 / サークル", value: `${item.author} （${item.circle}）`, inline: true },
        { name: "届いた拍手", value: `${countText} 👏`, inline: false },
        { name: "累計拍手", value: `🌟 **${item.totalLikes}** 回`, inline: true }
      ],
      description: item.url ? `👉 [マップでこの作品を鑑賞する](${item.url})` : "",
      footer: { text: "架空都市「駒洋市」作品アーカイブマップ" },
      timestamp: new Date().toISOString()
    }]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, options);
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
