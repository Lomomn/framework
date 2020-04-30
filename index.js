import './style.styl'

let key = 0

// Create the dom using vdom
function create(node){
	let el = document.createElement(node.name)
	node.domReference = el
	el.vdomRef = node
	
	if (node.props.external)
		node.props.external.forEach(v => register(v, node))
	
	if (node.props.classes)
		el.classList.add(...node.props.classes)
	
	if (node.props.text){
		el.appendChild(
			document.createTextNode(
				typeof node.props.text === 'function' ? node.props.text(node.props) : node.props.text))
	}
	
	if (node.props.events){
		Object.keys(node.props.events)
			.forEach(k =>
					el.addEventListener(k, node.props.events[k].bind(node)))
	}
	
	node.children.forEach(child => {
			el.appendChild(create(child))
	})
	return el
}

// Create vdom
function c(name, props, children=[]){
	key += 1
	return {name, props, children, key}
}

// Application state
let state = {
	value: 0,
	otherValue: 100
}
let watchers = {}
function register(key, ref){
	if (!watchers[key]){
		watchers[key] = {}
	}
	ref.props[key] = state[key]
	watchers[key][ref.key] = ref
}
function updateState(key, value){
	state[key] = value
	// update all watchers
	Object.keys(watchers[key]).forEach(i => {
		let watcher = watchers[key][i]
		let node = watcher
		let el = watcher.domReference
		node.props[key] = value
		el.parentNode.replaceChild(create(node), el)
	})
	
}

let vdom =
c('div', {classes: ['container']},
[
	
	c('div', {},
	[
		c('label', {
			external: ['value'],
			text: (props)=>'clicked: '+props.value}),
		c('button', {
			text: 'click me',
			events: {
				click: function(){updateState('value', state.value+1)}
			}})
	]),
	
	c('div', {},
	[
		c('label', {
			external: ['otherValue'],
			text: (props)=>'clicked: '+props.otherValue}),
		c('button', {
			text: 'click me',
			events: {
				click: function(){updateState('otherValue', state.otherValue+1)}
			}})
	])
])


window.addEventListener('DOMContentLoaded', e => {
	let root = document.getElementById('app')
	root.appendChild(create(vdom))
})