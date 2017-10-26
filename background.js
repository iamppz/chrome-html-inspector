var enabled = false;
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript(null, {
    file: "main.js"
  });

  enabled = !enabled;
  path = enabled ? 'enabled.png' : 'icon.png';
  chrome.browserAction.setIcon({
    path: path
  });

  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    console.log(tabs.length);
    tabs.forEach(function (tab) {
      chrome.tabs.sendMessage(tab.id, {
        enabled: enabled
      }, function (response) {
        // alert(response.status);
      });
    }, this);
  });
});