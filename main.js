class Game {
	constructor() {
		const _ = this;


		_.init();
		_.start = false;
		_.size = 4;
		_.positions = {};
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

		document.querySelector('body').append(title,sizeCount,button);

		sizeCount.querySelector('input').addEventListener('input',function () {
			_.startSizeInputCheck(this)
		});
		button.addEventListener('click',function () {
			_.size = sizeCount.querySelector('input').value * 1;
			if (_.size < 3) _.size = 3;
			else if (_.size > 8) _.size = 8;
			_.newGame()
		});

	}
	startSizeInputCheck(input){
		if (isNaN(input.value[input.value.length - 1] * 1)) input.value = input.value.substr(0,input.value.length - 1);
	}





	// запускает постройку игровой страницы
	newGame(){
		const _ = this;
		_.start = false;
		_.clearTpl(document.querySelector('body'));
		let load = false;
		if (localStorage.getItem('15')) load = true;
		_.createPageTmp(null,null,load);
		_.createFieldObject();
		_.createField();
	}
	loadedGame(data){
		const _ = this;
		_.start = false;
		_.clearTpl(document.querySelector('body'));
		_.positions = data.positions;
		let time = data.time;
		let steps = data.steps;
		_.createPageTmp(time,steps);
		_.createField();
	}


	// создает разметку игровой страницы
	createPageTmp(time = null,steps = null,save = null){
		const _ = this;
		let sec = time ? time[2] : '00',
				min = time ? time[1] : '00',
				hours = time ? time[0] : '00';

		!steps ? steps = 0 : '';

		let title = _.createEl('H1','main-title main-subtitle',{'text' : '"Пятнашки"'});
		let row = _.createEl('DIV','row',{'children' : [
				_.createEl('BUTTON','newGameBtn btn',{'text' : 'Начать заново'}),
				_.createEl('DIV','steps',{'children' : [
						_.createEl('SPAN','steps-title',{'text' : 'Ходы: '}),
						_.createEl('SPAN','steps-span',{'text' : steps})
					]}),
				_.createEl('DIV','time',{'children' : [
						_.createEl('SPAN','time-title',{'text' : 'Время: '}),
						_.createEl('DIV','time-row',{'children' : [
								_.createEl('SPAN','time-hour',{'text' : hours}),
								_.createEl('SPAN','time-span',{'text' : ':'}),
								_.createEl('SPAN','time-minute',{'text' : min}),
								_.createEl('SPAN','time-span',{'text' : ':'}),
								_.createEl('SPAN','time-second',{'text' : sec})
							]})
					]})
			]});
		let body = _.createEl('DIV','gameBody');
		let bottomRow = _.createEl('DIV','row');
		let loadBtn = _.createEl('BUTTON','loadBtn btn',{'text' : 'Загрузить'});
		let saveBtn = _.createEl('BUTTON','saveBtn btn',{'text' : 'Сохранить'});
		if (!save) loadBtn.classList.add('inactive');
		bottomRow.append(loadBtn);
		bottomRow.append(saveBtn);
		document.querySelector('body').append(title,row,body,bottomRow);


		row.querySelector('button').addEventListener('click',function () {_.newGame(_.size);});
		body.addEventListener('mouseup',function () {
			if (!_.start) {
				_.start = true;
				_.gameStarted()
			}
		});
		loadBtn.addEventListener('click',function () {
			_.loadGame();
		});
		saveBtn.addEventListener('click',function () {
			_.saveGame();
		});
	}
	// создает объект расположение костяшек
	createFieldObject(){
		const _ = this;
		let int = (_.size * _.size);
		for (let i = 0; i < int; i++){
			i < int - 1 ? _.positions[i + 1] = i + 1 : _.positions[i + 1] = null;
		}
	}
	// заполняет поле костями по порядку в количестве установленном игроком
	createField(){
		const _ = this;
		let body = document.querySelector('.gameBody');
		for (let pos in _.positions){
			if (_.positions[pos]){
				let btn = _.createEl('BUTTON',`bone pos${_.size}`,{'id':`pos${_.size}-${pos}`,'draggable':true,'children' : [
						_.createEl('SPAN',null,{'text' : _.positions[pos]})
					]});
				body.append(btn);

				btn.addEventListener('click',function () {
					_.possibleMoveCheck(btn)
				})
			}
		}
	}



	// запускает методы отсчета времени и набора очков
	gameStarted(){
		const _ = this;
		function startCheck () {
			setTimeout(function () {
				if (_.start) startCheck();
				_.time();
			},1000)
		}
		startCheck();
	}
	// показывает время во время игры))
	time(){
		const _ = this;
		if (document.querySelector('.time-row')){
			let timeLabel = document.querySelector('.time-row');
			let hours = timeLabel.querySelector('.time-hour');
			let minutes = timeLabel.querySelector('.time-minute');
			let seconds = timeLabel.querySelector('.time-second');

			let sec = (seconds.textContent * 1) + 1,
					min = minutes.textContent * 1,
					h = hours.textContent * 1;

			function lengthCheck(value){
				value += '';
				if (value.length < 2) value = '0' + value;
				return value;
			}

			if (sec === 60) {
				sec = 0;
				min += 1;
				if (min === 60){
					min = 0;
					h += 1;
					if (_.start) hours.textContent = lengthCheck(h);
				}
				if (_.start) minutes.textContent = lengthCheck(min);
			}
			if (_.start) seconds.textContent = lengthCheck(sec);
		}
	}


	// методы игры
	possibleMoveCheck(button){
		const _ = this;
		let id = button.id;
		let pos = id.split('-')[1] * 1;
		if (_.positions[pos + _.size] === null){
			_.move(pos + _.size,button)
		} else if (_.positions[pos + 1] === null){
			_.move(pos + 1,button)
		} else if (_.positions[pos - 1] === null){
			_.move(pos - 1,button)
		} else if (_.positions[pos - _.size] === null){
			_.move(pos - _.size,button)
		}
	}
	move(condition,button){
		const _ = this;
		let btnNumber = button.firstChild.textContent * 1;
		let id = button.id;
		let pos = id.split('-')[1] * 1;
		_.positions[pos] = null;
		_.positions[condition] = btnNumber;
		button.id = `pos${_.size}-${condition}`;

		let stepsCont = document.querySelector('.steps-span');
		stepsCont.textContent = (stepsCont.textContent * 1) + 1;

		_.checkToWin();
	}
	checkToWin(){
		let gameBody = document.querySelector('.gameBody');
		let check = true;
		for (let i = 0; i < gameBody.children.length; i++){
			if (gameBody.children[i].firstChild.textContent != gameBody.children[i].id.split('-')[1]) {
				check = false;
			}
		}
		if (check) {
			let time = document.querySelector('.time-row').textContent,
					steps = document.querySelector('.steps-span').textContent;
			this.finishScreenTpl(time,steps);
			this.start = false;
		}
	}


	// сохранение игры
	saveGame(){
		const _ = this;
		let time = document.querySelector('.time-row').textContent.split(':');
		let steps = document.querySelector('.steps-span').textContent;
		let saveData = {};
		saveData.time = time;
		saveData.steps = steps;
		saveData.positions = _.positions;
		saveData = JSON.stringify(saveData);
		localStorage.setItem('15',saveData);
		if (document.querySelector('.loadBtn').classList.contains('inactive')) document.querySelector('.loadBtn').classList.remove('inactive');
	}
	loadGame(){
		const _ = this;
		let loadData = localStorage.getItem('15');
		if (loadData){
			loadData = JSON.parse(loadData);
			_.loadedGame(loadData);
		}
	}


	// создает разметку финальной страницы
	finishScreenTpl(time,steps){
		const _ = this;
		let body = document.querySelector('body');
		_.clearTpl(body);
		let title = _.createEl('H1','main-title finish-title',{'text' : 'Поздравляем! Вы победили!'});
		let score = _.createEl('DIV','finish-score',{'children' : [
			_.createEl('SPAN','finish-score-title',{'text' : 'Количество ходов: '}),
			_.createEl('SPAN','finish-score-span',{'text' : steps})
			]});
		let timeCont = _.createEl('DIV','finish-time',{'children' : [
			_.createEl('SPAN','finish-time-title',{'text' : 'Затраченное время: '}),
			_.createEl('SPAN','finish-time-span',{'text' : time})
			]});
		let newGameBtn = _.createEl('BUTTON','btn',{'text' : 'Начать новую игру'});
		newGameBtn.addEventListener('click',function () {
			_.init();
		});
		body.append(title,score,timeCont,newGameBtn)
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
