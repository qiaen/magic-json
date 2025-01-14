<template>
	<split-pane :min="config.min" :value="config.default0" split="vertical">
		<template #A>
			<split-pane :min="config.min" :value="config.default1" split="vertical">
				<template #A>
					<div class="topbar">
						<a class="iconfont icon-zifuchuan" v-if="stringNums[0]">
							<i class="span-number">x{{ stringNums[0] }}</i>
						</a>
						<a @click="clear(1)" class="iconfont icon-qingli"></a> <a @click="formatIt(1)" class="iconfont icon-geshihua"></a> <a v-if="!show2" @click="add(true, 2)" class="iconfont icon-separatecell"></a>
					</div>
					<pre id="pre1" contenteditable="true" rows="20" @paste="e => paste(e, 1)"></pre>
				</template>
				<template #B v-if="show2">
					<div class="topbar">
						<a class="iconfont icon-zifuchuan" v-if="stringNums[1]">
							<i class="span-number">x{{ stringNums[1] }}</i> </a
						><a @click="clear(2)" class="iconfont icon-qingli"></a> <a @click="formatIt(2)" class="iconfont icon-geshihua"></a> <a v-if="!show3" @click="add(true, 3)" class="iconfont icon-separatecell"></a>
					</div>
					<pre id="pre2" contenteditable="true" rows="20" @paste="e => paste(e, 2)"></pre>
				</template>
			</split-pane>
		</template>
		<template #B v-if="show3">
			<split-pane :min="config.min" :value="config.default2" split="vertical">
				<template #A>
					<div class="topbar">
						<a class="iconfont icon-zifuchuan" v-if="stringNums[2]">
							<i class="span-number">x{{ stringNums[2] }}</i> </a
						><a @click="clear(3)" class="iconfont icon-qingli"></a> <a @click="formatIt(3)" class="iconfont icon-geshihua"></a> <a v-if="!show4" @click="add(true, 4)" class="iconfont icon-separatecell"></a>
					</div>
					<pre id="pre3" contenteditable="true" rows="20" @paste="e => paste(e, 3)"></pre>
				</template>
				<template #B v-if="show4">
					<div class="topbar">
						<a class="iconfont icon-zifuchuan" v-if="stringNums[3]">
							<i class="span-number">x{{ stringNums[3] }}</i> </a
						><a @click="clear(4)" class="iconfont icon-qingli"></a> <a @click="formatIt(4)" class="iconfont icon-geshihua"></a>
					</div>
					<pre id="pre4" contenteditable="true" rows="20" @paste="e => paste(e, 4)"></pre>
				</template>
			</split-pane>
		</template>
	</split-pane>
</template>
<script setup>
// chrome-extension://iflimgkliokgongdaccoaionejldaomp/index.html#/home
import { ref, reactive } from 'vue'
import splitPane from './split-pane.vue'
let config = reactive({
	min: 0,
	default1: 100,
	default2: 100,
	default0: 100
})
let show1 = ref(false)
let show2 = ref(false)
let show3 = ref(false)
let show4 = ref(false)

let stringNums = reactive({
	0: 0,
	1: 0,
	2: 0,
	3: 0
})
function paste(e, id) {
	let clipboardData = e.clipboardData || window.clipboardData
	let dom = document.querySelector('#pre' + id)
	if (dom.innerText == '' || dom.innerText == '\n') {
		dom.innerHTML = ''
	}
	if (clipboardData && ['PRE', 'pre', 'BR', 'br'].includes(e.target.tagName)) {
		let txt = clipboardData.getData('Text')
		if (txt == '') {
			return console.log('粘贴板为空')
		}
		try {
			// let obj = eval('[' + txt + ']');
			// alert(typeof(txt))
			let obj = JSON.parse('[' + txt + ']')
			window.requestAnimationFrame(() => {
				dom.innerHTML = Process(obj[0])
			})
		} catch (err) {
			let obj = {}
			let arr = txt.split('\r\n')
			arr.forEach(a => {
				let splitKey = a.includes(': ') ? ': ' : ':'
				let temp = a.split(splitKey)
				obj[temp[0]] = temp[1]
			})
			let key = Object.keys(obj)[0]
			if (key && obj[key]) {
				window.requestAnimationFrame(() => {
					let label = e.target.tagName.toLowerCase()
					if (label === 'pre') {
						e.target.innerHTML = Process(obj)
					} else {
						e.target.parentNode.innerHTML = Process(obj)
					}
				})
			}
		}
	}
}
function add(type, value) {
	switch (value) {
		case 2:
			show2.value = true
			config.default1 = 50
			break
		case 3:
			show3.value = true
			config.default0 = 50
			break
		case 4:
			show4.value = true
			config.default2 = 50
			break
	}
}
function clear(val) {
	document.querySelector('#pre' + val).innerHTML = ''
}
function formatIt(val) {
	let txt = document.querySelector('#pre' + val).innerText
	txt = txt.replace(/\.\.\.\}/g, '}')
	try {
		if (txt == '') {
			return
		}
		// let obj = eval('(' + txt + ')');
		let obj = JSON.parse(txt)
		// let obj = new Function('return ' + txt)()

		document.querySelector('#pre' + val).innerHTML = Process(obj)
	} catch (e) {
		pub.alert('Not a standard JSON')
		console.log(e)
	}
}
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
	countSelectNum()
}
/** 计数 多少个个选中的 */
function countSelectNum() {
	window.requestAnimationFrame(() => {
		// console.log(document.querySelectorAll('.user-selected').length)
		let boxs = document.querySelectorAll('.splitter-pane .splitter-pane')
		boxs.forEach((box, index) => {
			let usc = box.querySelectorAll('.user-selected').length
			// console.log(usc)
			app.stringNums[index] = usc
		})
		// console.log(app.stringNums)
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
function dbclickSpan(e) {
	let ele = e.target
	if (ele.classList.contains('String')) {
		let range = document.createRange()
		let selection = window.getSelection()
		if (selection.rangeCount > 0) {
			selection.removeAllRanges()
		}
		range.selectNode(ele)
		let textNode = ele.firstChild
		let tx = ele.textContent
		let cl = tx.length
		range.setStart(textNode, 1)
		let isDouhao = tx.lastIndexOf(',') === cl - 1
		range.setEnd(textNode, isDouhao ? cl - 2 : cl - 1)
		selection.addRange(range)
	}

	ele = range = selection = null
}
// 初始化
window.onload = function () {
	document.addEventListener('click', spanTap, true)
	document.addEventListener('keyup', spanUp, true)
	document.addEventListener('dblclick', dbclickSpan, true)
}
var pub = {
	alert: function (c) {
		var c = c || '操作成功！'
		var alt = document.querySelector('.alert')
		if (alt) {
			alt.innerHTML = '<a>' + c + '</a>'
			return
		}
		var h = document.createElement('div')
		h.innerHTML = '<a>' + c + '</a>'
		h.setAttribute('class', 'alert')
		document.querySelector('body').appendChild(h)
		pub.fire(h)
	},
	fire: function (obj) {
		var evt = ['webkitAnimationEnd', 'mozAnimationEnd', 'msAnimationEnd', 'oAnimationEnd', 'animationend']
		for (var i = 0; i < evt.length; i++) {
			obj.addEventListener(evt[i], function () {
				this.parentNode.removeChild(this)
			})
		}
	}
}
</script>

<style></style>
