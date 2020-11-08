class Game {
	constructor() {
		const _ = this;


		_.init();
		_.start = false;
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
	// очищает переданный тэг от разметки
	clearTpl(cont){
		cont.innerHTML = '';
	}


	// создает разметку первоначального экрана
	firstScreenTpl(){
		const _ = this;
		let title = _.createEl('H1','main-title',{'text' : '"Пятнашки"'});
		let sizeCount = _.createEl('DIV','choose',{'children' : [
				_.createEl('SPAN','choose-title',{'text' : 'Размеры поля: '}),
				_.createEl('INPUT','choose-input',{'text' : '4'})
			]});
		let button = _.createEl('BUTTON','btn first-screen-btn',{'text' : 'Начать игру'});
		button.addEventListener('click',function () {
			_.size = sizeCount.querySelector('input').value * 1;
			if (_.size < 3) _.size = 3;
			else if (_.size > 8) _.size = 8;
			_.newGame(_.size)
		});
		document.querySelector('body').append(title,sizeCount,button);
	}


	// запускает постройку игровой страницы
	newGame(size){
		const _ = this;
		_.clearTpl(document.querySelector('body'));
		_.createPageTmp();
		_.createField(size);
	}
	// создает разметку игровой страницы
	createPageTmp(){
		const _ = this;
		let title = _.createEl('H1','main-title main-subtitle',{'text' : '"Пятнашки"'});
		let row = _.createEl('DIV','row',{'children' : [
				_.createEl('BUTTON','newGameBtn btn',{'text' : 'Начать заново'}),
				_.createEl('DIV','steps',{'children' : [
						_.createEl('SPAN','steps-title',{'text' : 'Ходы: '}),
						_.createEl('SPAN','steps-span',{'text' : 0})
					]}),
				_.createEl('DIV','time',{'children' : [
						_.createEl('SPAN','time-title',{'text' : 'Время: '}),
						_.createEl('DIV','time-row',{'children' : [
								_.createEl('SPAN','time-hour',{'text' : '00'}),
								_.createEl('SPAN','time-span',{'text' : ':'}),
								_.createEl('SPAN','time-minute',{'text' : '00'}),
								_.createEl('SPAN','time-span',{'text' : ':'}),
								_.createEl('SPAN','time-second',{'text' : '00'})
							]})
					]})
			]});
		row.querySelector('button').addEventListener('click',function () {
			_.newGame(_.size);
		});
		let body = _.createEl('DIV','gameBody');
		body.addEventListener('mousedown',function () {
			if (!_.start) _.gameStarted();
		});
		let bottomRow = _.createEl('DIV','row',{'children' : [
				_.createEl('BUTTON','loadBtn btn',{'text' : 'Загрузить'}),
				_.createEl('BUTTON','saveBtn btn',{'text' : 'Сохранить'})
			]});
		bottomRow.querySelector('.loadBtn').addEventListener('click',function () {
			_.finishScreenTpl();
		});
		document.querySelector('body').append(title,row,body,bottomRow);
	}
	// заполняет поле костями по порядку в количестве установленном игроком
	createField(size = 4){
		const _ = this;
		if (typeof size !== 'number') return;
		let int = (size * size) - 1,
				body = document.querySelector('.gameBody');
		for (let i = 0; i < int; i++){
			body.append(_.createEl('BUTTON',`bone pos${size}-${i + 1} pos${size}`,{'draggable':true,'children' : [
					_.createEl('SPAN',null,{'text' : i + 1})
				]}))
		}
	}


	// запускает методы отсчета времени и набора очков
	gameStarted(){
		const _ = this;
		_.start = true;
		setInterval(_.time,1000)
	}
	// показывает время во время игры))
	time(){
		let timeLabel = document.querySelector('.time-row');
		let hours = timeLabel.querySelector('.time-hour');
		let minutes = timeLabel.querySelector('.time-minute');
		let seconds = timeLabel.querySelector('.time-second');
		function lengthCheck(value){
			value += '';
			if (value.length < 2) value = '0' + value;
			return value;
		}

		let sec = (seconds.textContent * 1) + 1,
				min = minutes.textContent * 1,
				h = hours.textContent * 1;

		if (sec === 60) {
			sec = 0;
			min += 1;
			if (min === 60){
				min = 0;
				h += 1;
				hours.textContent = lengthCheck(h);
			}
			minutes.textContent = lengthCheck(min);
		}
		seconds.textContent = lengthCheck(sec);
	}


	// создает разметку финальной страницы
	finishScreenTpl(){
		const _ = this;
		let body = document.querySelector('body');
		_.clearTpl(body);
		let title = _.createEl('H1','main-title finish-title',{'text' : 'Поздравляем! Вы победили!'});
		let score = _.createEl('DIV','finish-score',{'children' : [
			_.createEl('SPAN','finish-score-title',{'text' : 'Количество ходов: '}),
			_.createEl('SPAN','finish-score-span',{'text' : '0'})
			]});
		let time = _.createEl('DIV','finish-time',{'children' : [
			_.createEl('SPAN','finish-time-title',{'text' : 'Затраченное время: '}),
			_.createEl('SPAN','finish-time-span',{'text' : '0'})
			]});
		let newGameBtn = _.createEl('BUTTON','btn',{'text' : 'Начать новую игру'});
		newGameBtn.addEventListener('click',function () {
			_.init();
		});
		body.append(title,score,time,newGameBtn)
	}

	init(){
		const _ = this;
		_.clearTpl(document.querySelector('body'));
		_.firstScreenTpl();
	}
}

let game = new Game();

/*let int = 8,
		j = 0,
		string = '';
for (let i = 0; i < int * int; i++){
	let x = 0, y = 0;
	if (i % int === 0 && i !== 0) j++;
	if (i >= int * j && i < int * (j + 1)){
		x = (i - (int * j)) * 100 + '%';
		y = j * 100 + '%';
	}
	let str = `.pos${int}-${i+1}{transform:translate(${x},${y})}`;
	string += str;
	string += `\n`;
}
console.log(string);*/
