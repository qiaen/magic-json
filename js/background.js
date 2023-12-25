/*--------------右键菜单添加以及通知 开始--------------*/
chrome.contextMenus.create({
	title: 'JSON Formatter',
	onclick() {
		window.open('../json.html')
	}
}, function(e) {
})
// popup图标点击事件
chrome.browserAction.onClicked.addListener(function() {
	window.open('../json.html')
})