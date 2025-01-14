<template>
	<div :style="{ cursor, userSelect }" class="qiaen-spliter" @mousemove="onMouseMove">
		<div class="split-pane split-a" :class="split" :split="split" :style="{ [type]: percent + '%' }">
			<slot name="A"></slot>
		</div>

		<div class="split-resizer" :class="[split, { active }]" :style="{ [resizeType]: percent + '%' }" :split="split" @mousedown="onMouseDown" @mouseup="onMouseUp" />

		<div class="split-pane split-b" :class="split" :split="split" :style="{ [type]: 100 - percent + '%' }">
			<slot name="B"></slot>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { computed, ref, watch, defineProps, defineEmits } from 'vue'
const props = defineProps(["min", "value", "split"])

const emits = defineEmits()

const active = ref(false)

const percent = ref(props.value)

watch(
	() => props.value,
	value => {
		percent.value = value
	}
)

const isVertical = computed(() => props.split === 'vertical')

const type = computed(() => (isVertical.value ? 'width' : 'height'))

const resizeType = computed(() => (isVertical.value ? 'left' : 'top'))

const userSelect = computed(() => (active.value ? 'none' : undefined))

const cursor = computed(() => {
	return active.value ? (isVertical.value ? 'col-resize' : 'row-resize') : ''
})


/** 鼠标移动 */
function onMouseMove(e: MouseEvent) {
	if (e.buttons === 0 || e.which === 0) {
		active.value = false
	}
	e.preventDefault()
	if (active.value) {
		let offset = 0
		let target: any = e.currentTarget

		if (isVertical.value) {
			while (target) {
				offset += target.offsetLeft
				target = target.offsetParent
			}
		} else {
			while (target) {
				offset += target.offsetTop
				target = target.offsetParent
			}
		}
		let tg: any = e.currentTarget
		const currentPage = isVertical.value ? e.pageX : e.pageY
		const targetOffset = isVertical.value ? tg.offsetWidth : tg.offsetHeight
		const newPercent = Math.floor(((currentPage - offset) / targetOffset) * 10000) / 100
		let min = props.min || 10
		if (newPercent > min && newPercent < 100 - min) {
			percent.value = newPercent
		}

		emits('resize', percent.value)
	}
}

/** 鼠标按下 */
function onMouseDown() {
	active.value = true
}
/** 鼠标抬起 */
function onMouseUp() {
	active.value = false
	emits('resized', percent.value)
}

</script>
<style lang="scss">
.qiaen-spliter {
	height: 100%;
	position: relative;
	&:after {
		visibility: hidden;
		display: block;
		font-size: 0;
		content: ' ';
		clear: both;
		height: 0;
	}

	.vertical {
		&.split-pane {
			position: absolute;
			height: 100%;
			&.split-a {
				left: 0px;
			}
			&.split-b {
				right: 0px;
			}
		}
		&.split-resizer {
			width: 11px;
			height: 100%;
			margin-left: -5px;
			border-left: 5px solid rgba(0, 0, 0, 0);
			border-right: 5px solid rgba(0, 0, 0, 0);
			cursor: col-resize;
		}
	}
	.horizontal {
		&.split-pane {
			position: absolute;
			width: 100%;
			&.split-a {
				top: 0px;
			}
			&.split-b {
				bottom: 0px;
			}
		}
		&.split-resizer {
			height: 11px;
			margin: -5px 0;
			border-top: 5px solid rgba(0, 0, 0, 0);
			border-bottom: 5px solid rgba(0, 0, 0, 0);
			cursor: row-resize;
			width: 100%;
		}
	}
	.split-resizer {
		box-sizing: border-box;
		background: #999;
		position: absolute;
		z-index: 1;
		background-clip: padding-box;
	}
}
</style>./types
