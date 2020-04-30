import './style.styl'

// realized that i should assign key automatically, probably using the constructor function
let keyCounter = 0

function create(node){
	console.log(node)
	let [name, props, children] = node
	console.log('des',name, props, children)
	props.key = keyCounter
	keyCounter += 1
	if (name==='text'){
		if (typeof props === 'function'){
			// monitor[]
			props = props()
		}
		return document.createTextNode(props)
	}else{
		
	}
		
	let el = document.createElement(name)
	if (children)
		children.forEach(c => el.appendChild(create(c)))
	return el
}

let state = {value: 100}
let monitor = []
function changeState(n, node, key, value){
	node.parentNode.replaceChild(create(n), node)
}
function getStateValue(key){
	
	return state[key]
}

let vdom = 
['div',
	{},
	[
		['p',
			{},
			[['text', 'hello']]
		],
		['p',
			{},
			[['text', ()=>getStateValue('value')]]
		]
	]
]
console.log('vdom',vdom)


// function create(n){
// 	let el = document.createElement(n.type)
// 	if (n.events)
// 		Object.keys(n.events).forEach(k => {
// 			switch (k) {
// 				case 'ready':
// 					n.events[k].bind(n)(n.data) // data as props
// 					break
// 				default:
// 					el.addEventListener(k, (e)=>{
// 						let parent = el.parentNode
// 						n.events[k].bind(n)(n.data)
// 						parent.replaceChild(create(n), el)
// 					})
// 					break
// 			}
// 		})
// 	if (n.data.classes)
// 		el.classList.add(...n.data.classes)
// 	if (n.children){
// 		n.children.forEach(c => {
// 			c.data = Object.assign({...n.data, classes: ''}, c.data)
// 			el.appendChild(create(c))
// 		})
// 	}
// 	if (n.data.value)
// 		el.appendChild(document.createTextNode(n.data.value))
// 	return el
// }

window.addEventListener('DOMContentLoaded', e => {
	let root = document.getElementById('app')
	root.appendChild(create(vdom))
})