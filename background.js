chrome.action.onClicked.addListener(function () {
	chrome.tabs.create({ url: "index.html" })
})
chrome.contextMenus.create({
	id: "index.html",
	type: 'normal',
	title: "Magic JSON"
})
chrome.contextMenus.onClicked.addListener((item, tab) => {
	chrome.tabs.create({ url: item.menuItemId, index: tab.index + 1 })
})