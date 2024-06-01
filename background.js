chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.popupClosed) {
        console.log("Pop-up closed");
    }
});