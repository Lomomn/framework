import './style.styl'

function b(type, data, events, children=[]){
	return {
		type: type,
		data: data, // "value" prop is shown as text
		events: events,
		children: children
	}
}

let vdom = b('div',
	{
		classes: ['test'],
		parentValue: 1999,
	},
	{
		modify: function(){console.log(this);this.data.parentValue += 100}
	},
	[
		b(
			'p',
			{value: 0,
			current: 200},
			{click: function(){
				console.log(this.data)
				this.data.current += 1
			},
			ready: function(props){
				console.log(props)
				this.data.value = props.parentValue + props.current
			}
		}),
		b(
			'p',
			{value: 100},
			{click: function(){
				this.data.value += 1
			}
		}),
		b(
			'button',
			{value: 'increment parent value'},
			{click: function(props){
				props.modify()
			}}
		)
	])

function create(n){
	let el = document.createElement(n.type)
	if (n.events)
		Object.keys(n.events).forEach(k => {
			switch (k) {
				case 'ready':
					n.events[k].bind(n)(n.data) // data as props
					break
				case 'modify':
					
					break
				default:
					el.addEventListener(k, (e)=>{
						let parent = el.parentNode
						n.events[k].bind(n)(n.data)
						parent.replaceChild(create(n), el)
					})
					break
			}
		})
	if (n.data.classes)
		el.classList.add(...n.data.classes)
	if (n.children){
		n.children.forEach(c => {
			c.data = Object.assign({...n.data, classes: ''}, c.data)
			el.appendChild(create(c))
		})
	}
	if (n.data.value)
		el.appendChild(document.createTextNode(n.data.value))
	return el
}

window.addEventListener('DOMContentLoaded', e => {
	let root = document.getElementById('app')
	root.appendChild(create(vdom))
})