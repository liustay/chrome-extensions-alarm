chrome.alarms.onAlarm.addListener(function (info) {
  let name = info.name
  let iconUrl = `img/5.jpg`
  if (name && JSON.parse(name)) {
    let alarmInfo = JSON.parse(name)
    chrome.notifications.create({
      type: 'basic',
      iconUrl: iconUrl,
      title: '提醒',
      message: alarmInfo.content,
      priority: 0
    });
  }
});
