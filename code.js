/*
function myFunction() {
  Logger.log("helloWorld!");
}
*/

// 定義  
var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var sheet = spreadsheet.getActiveSheet();
var SPREADSHEET_ID = "1baNVW7BivTmgxtD0bs0nDLcbhU3rL-Xrr7OE73Cq-hU";
var ACCESS_TOKEN = "mkWF0P2f2pXQydpdR0sLz8NxFeg1QR4STQJnWwEJ9EBMXZXgvINCQJwh01/8WZ696P4HcPmQ9LbLfnkiRWLxhNfdKEOgp+rAUFwkgstDpbviT5wtk5z6ViZc6Im3mnfC3N2mTBB05Vh6/bF5c6w5GAdB04t89/1O/w1cDnyilFU=";

// 日付取得
function getNowYMD(){
  var dt = new Date();
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth()+1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var hh = ("00" + dt.getHours()).slice(-2);
  var mi = ("00" + dt.getMinutes()).slice(-2);
  var ss = ("00" + dt.getSeconds()).slice(-2);
  var result = y + "/" + m + "/" + d +  " " + hh +":"+ mi + ":" + ss;
  return result;
}


// スプレッドシートに情報を登録
function setData(userMessage, total, updateDate){
  // sheet.getRange(1, 1, 1, 3).setValues(values);
  console.log("set total is" + total) // 追記
  sheet.getRange("A1").setValue(userMessage);
  sheet.getRange("B1").setValue(total);
  sheet.getRange("C1").setValue(updateDate);
  
}

function doPost(e) {
  // WebHookで受信した応答用Token
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  // 応答メッセージ用のAPI URL
  var url = 'https://api.line.me/v2/bot/message/reply';

  var template_start = '文字数貯金です。 \n';
  var template_finish = 'またのご利用をお待ちしております。';
  // 更新日時
  var updateDate = getNowYMD();
  // ユーザーのメッセージを取得
  var userMessageJson = JSON.parse(e.postData.contents).events[0].message.text;
  var userMessage = Number(userMessageJson);
  console.log("userMessage is " + userMessage) // 追記

  // totalを取得
  var totalRange = sheet.getRange("B1");
  var total = Number(totalRange.getValue());
  console.log("get total is " + total) // 追記

  total += userMessage;
  console.log("usermessage + total = " + total) // 追記

  // 返信内容
  var botMessage = updateDate + " 現在、 \n 【" + userMessage + "】文字の入金を確認しました。 \n" + "現在の貯金額は " + total + " 円です。 \n";
  
  // データ登録
  // var values = [[userMessage, total, updateDate]];
  setData(userMessage, total, updateDate);
  var replyMessage = template_start + botMessage + template_finish;

  // 返信メッセージ送信
  try{
    UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'replyToken': replyToken,
        'messages': [{
          'type': 'text',
          'text': replyMessage,
        }],
      }),
      });
    return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    Logger.log('Error: ');
    Logger.log(e);
  }
}

