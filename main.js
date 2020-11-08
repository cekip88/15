class Game {
	constructor() {
		const _ = this;
		_.init();
	}

	// создает тэги
	createEl(tag,cls,data={}){
		let tmp = document.createElement(tag);
		if (cls) tmp.className = cls;
		for(let attr in data){
			if (attr === 'text') {
				if (tag === 'INPUT' || tag === 'TEXTAREA') tmp.value = data[attr];
				else tmp.textContent = data[attr];
			} else if (attr === 'children'){
				data[attr].forEach(function (elem) {
					tmp.append(elem);
				})
			} else tmp.setAttribute(attr,data[attr]);
		}
		return tmp;
	}

	createPageTmp(){
		const _ = this;
		let row = _.createEl('DIV','row',{'children' : [
				_.createEl('BUTTON','newGameBtn btn',{'text' : 'Start new game'}),
				_.createEl('DIV','steps',{'children' : [
						_.createEl('SPAN','steps-title',{'text' : 'Your steps: '}),
						_.createEl('SPAN','steps-span',{'text' : 0})
					]}),
				_.createEl('DIV','time',{'children' : [
						_.createEl('SPAN','time-title',{'text' : 'Time passed: '}),
						_.createEl('SPAN','time-span',{'text' : 0})
					]})
			]});
		row.querySelector('button').addEventListener('click',function () {
			_.startNewGame();
		});
		let body = _.createEl('DIV','gameBody');
		let bottomRow = _.createEl('DIV','row',{'children' : [
				_.createEl('BUTTON','loadBtn btn',{'text' : 'Load Game'}),
				_.createEl('BUTTON','saveBtn btn',{'text' : 'Save Game'})
			]});
		document.querySelector('body').append(row,body,bottomRow);
	}

	createField(size = 4){
		const _ = this;
		if (typeof size !== 'number') return;
		let int = (size * size) - 1,
				body = document.querySelector('.gameBody'),
				wh = `calc(100% / ${size})`;
		for (let i = 0; i < int; i++){
			body.append(_.createEl('BUTTON',`bone pos${i + 1}`,{'style' : `height:${wh};width:${wh}`,'children' : [
					_.createEl('SPAN',null,{'text' : i + 1})
				]}))
		}
	}

	startNewGame(){
		const _ = this;

	}

	async init(){
		const _ = this;
		_.createPageTmp();
		_.createField();
	}
}

let game = new Game();