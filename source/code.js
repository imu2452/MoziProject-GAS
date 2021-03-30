var ACCESS_TOKEN = "Rj/F0ha0SPn8fH0RxddSuWaG10+6GYawtcKJnDtilIaNdJJmCrS13dlvtIpodjGA6P4HcPmQ9LbLfnkiRWLxhNfdKEOgp+rAUFwkgstDpbvFGhaGSmPEJJlEWW7q19cJFetVLvudsVF7VgOOGarNuAdB04t89/1O/w1cDnyilFU=";

function doPost(e) {
  // WebHookで受信した応答用Token
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  console.log('DEBUG replyToken: ' + replyToken)

  // ユーザーのメッセージを取得
  var userMessage = JSON.parse(e.postData.contents).events[0].message.text;
  // 応答メッセージ用のAPI URL
  var url = 'https://api.line.me/v2/bot/message/reply';

  var template_start = '文字数貯金です。 \n';
  var template_finish = 'またのご利用をお待ちしております。';
  var botMessage = userMessage + ' 文字の入金を確認しました。\n';
  var replyMessage = template_start + botMessage + template_finish;
  console.log('DEBUG replyMessage: ' + replyMessage)

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
}
