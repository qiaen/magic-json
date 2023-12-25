let app = new Vue({
	el: '#app',
	data: {
		SA: '',
		config: {
			min: 0,
			default1: 100,
			default2: 100,
			default0: 100
		},
		show1: false,
		show2: false,
		show3: false,
		show4: false,
	},
	methods: {
		paste(e) {
			let clipboardData = e.clipboardData || window.clipboardData
			if (clipboardData) {
				e.target.innerHTML = ''
				let items = clipboardData.items
				if (items && items.length) {
					// 检索剪切板items
					for (let i = 0; i < items.length; i++) {
						let type = items[i].type
						if (type === 'text/plain') {
							this.setText(clipboardData, e)
							break
						}
					}
				}

			}
		},
		setText(clipboardData, e) {
			let txt = clipboardData.getData('Text')
			try {
				if (txt == "") {
					txt = '""';
				}
				let obj = eval("[" + txt + "]")
				window.requestAnimationFrame(() => {
					let label = e.target.tagName.toLowerCase()
					if (label === 'pre') {
						e.target.innerHTML = Process(obj[0])
					} else {
						e.target.parentNode.innerHTML = Process(obj[0])
					}
				})
			} catch (e) {}
		},
		add(type, value) {
			this['show' + value] = type
			switch (value) {
				case 2:
					this.config.default1 = 50
					break;
				case 3:
					this.config.default0 = 50
					break;
				case 4:
					this.config.default2 = 50
					break;
			}

		},
		clear(val) {
			document.querySelector('#pre' + val).innerHTML = ''
		},
		formatIt(val) {
			let txt = document.querySelector('#pre' + val).innerText
			txt = txt.replace(/\.\.\.\}/g, '}')
			try {
				if (txt == "") {
					txt = '""';
				}
				let obj = eval("[" + txt + "]")

				document.querySelector('#pre' + val).innerHTML = Process(obj[0])
			} catch (e) {
				console.log(e)
			}
		}
	},
	mounted() {
		let lbds = localStorage.TeemoDuiBis

		if (lbds) {
			try {
				let bds = JSON.parse(lbds)
				if (bds && bds.length) {
					bds.forEach((item, index) => {
						if (bds[index + 1]) {
							this.add(true, index + 2)
						}
						window.requestAnimationFrame(() => {
							document.querySelector(`#pre${index + 1}`).innerText = JSON.stringify(item)
							this.formatIt(index + 1)
						})
					})
					localStorage.TeemoDuiBis = ''
				}
			} catch (e) {
				console.log(e)
				localStorage.TeemoDuiBis = ''
			}
		}
	}
})
// 设定选中span，单词
function spanTap(e) {
	let ele = e.target
	let text = ele.innerText
	selectSpans(text)
	if (ele.classList.contains('sectionTagBefore')) {
		if (ele.classList.contains('hideRight')) {
			ele.classList.remove('hideRight')
		} else {
			ele.classList.add('hideRight')
		}

	}
}
// 设定选中
function selectSpans(text) {
	let spans = document.querySelectorAll('span:not(.sectionTag)')
	spans.forEach(span => {
		span.classList.remove('user-selected')
		if (span.textContent === text) {
			span.classList.add('user-selected')
		}
	})
}
// 键盘上下左右按键
function spanUp(e) {
	// 用于解决前次聚焦输入框，刷新后报警的问题
	try {
		let rang = window.getSelection().getRangeAt(0)
		if ([37, 38, 39, 40].includes(e.keyCode)) {
			let text = rang.commonAncestorContainer.nodeValue
			text && selectSpans(text)
		}
	} catch (e) {}
}
// 初始化
window.onload = function() {
	document.addEventListener("click", spanTap, true)
	document.addEventListener("keyup", spanUp, true)
}