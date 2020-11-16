import {Create} from "./modules/create.js";
import {localSt} from "./modules/ls.js";



class Game {
	constructor() {
		const _ = this;
		_.create = new Create();
		_.ls = new localSt();
		_.start = false;
		_.size = 4;
		_.img = ['img/1.jpg','img/2.jpg','img/3.jpg','img/4.jpg','img/5.jpg','img/6.jpg','img/7.jpg','img/8.jpg','img/9.jpg','img/10.jpg'];
		_.positions = {};
		_.record = [];

		_.init();
	}
	// очищает переданный тэг от разметки
	clearTpl(cont){
		cont.innerHTML = '';
	}
	// возвращает строку только из чисел
	inputNumberCheck(str){
		let last = str.length - 1;
		isNaN(str[last] * 1) ? str = str.substr(0,last) : '';
		return str;
	}

	btnsInactiveClassChanger(){
		const _ = this;
		let btns = [
				document.querySelector('.newGameBtn'),
				document.querySelector('.loadBtn'),
				document.querySelector('.autoBtn'),
				document.querySelector('.saveBtn')
		];
		btns.forEach(function (btn) {
			if(_.interactive) {
				btn.classList.remove('inactive');
				if(btn.classList.contains("loadBtn")) {
					if(!_.ls.check('15-save')) btn.classList.add('inactive')
				}
			} else {
				btn.classList.add('inactive');
			}
		})
	}



	// создает разметку первоначального экрана
	nameCheck(){
		const _ = this;
		if (_.ls.check('15-name')) {
			_.name = _.ls.get('15-name');
		}
	}
	startScreenTpl(){
		const _ = this;
		let title = _.create.el('H1','main-title',{'text' : '"Пятнашки"'});
		let sizeCount = _.create.el('DIV','choose',{'children' : [
			_.create.el('SPAN','choose-title',{'text' : 'Размеры поля: '})
		]});
		let sizeInput = _.create.el('INPUT','choose-input',{'text' : '4'});
		sizeCount.append(sizeInput);
		let check = _.create.el('DIV','checkbox',{'children' : [
			_.create.el('SPAN','choose-title', {'text' : 'Перемешивание фишек: '}),
			_.create.el('INPUT',null,{'type' : 'checkbox','id' : 'checkbox-input', 'checked':true}),
			_.create.el('LABEL','checkbox-label',{'for' : 'checkbox-input'})
		]});
		let img = _.create.el('DIV','checkbox',{'children' : [
			_.create.el('SPAN','choose-title', {'text' : 'Картинка: '}),
			_.create.el('INPUT',null,{'type' : 'checkbox','id' : 'img-input'}),
			_.create.el('LABEL','checkbox-label',{'for' : 'img-input'})
		]});
		let sound = _.create.el('DIV','sound',{'children' : [
			_.create.el('SPAN','choose-title', {'text' : 'Звук: '}),
			_.create.el('LABEL','checkbox-label',{'for' : 'sound-input'})
		]});
		let soundCheckbox = _.create.el('INPUT',null,{'type' : 'checkbox','id' : 'sound-input'});
		let name = _.create.el('INPUT','name',{'type' : 'text','placeholder' : 'Введите Ваше имя'});
		let button = _.create.el('BUTTON','btn first-screen-btn',{'text' : 'Начать игру'});

		if (_.name) name.value = _.name;
		sound.prepend(soundCheckbox);
		document.querySelector('body').append(title,sizeCount,check,img,sound,name,button);
		_.startScreenHandlers(sizeInput,button,name,soundCheckbox);
	}
	startScreenHandlers(sizeInput,button,name,soundCheckbox){
		const _ = this;
		sizeInput.addEventListener('input',function(){
			sizeInput.value = _.inputNumberCheck(sizeInput.value)
		});
		name.addEventListener('change',function(){_.ls.set('15-name',name.value)});
		soundCheckbox.addEventListener('change',function () {
			_.sound = soundCheckbox.checked;
		});
		button.addEventListener('click',function(){
			_.size = (sizeInput.value * 1) < 3 ? 3 : sizeInput.value * 1;
			_.size > 8 ? _.size = 8 : '';
			_.name !== name.value ? _.name = name.value : '';
			if(document.querySelector('#img-input').checked) _.imgSrc = _.img[ Math.floor(Math.random() * 10)];
			_.newGame(document.querySelector('#checkbox-input').checked)
		});
	}



	// методы постройки игровой страницы
	newGame(rand){
		const _ = this;
		if(_.name) _.ls.set('15-name',_.name);
		_.start = false;
		_.record = [];

		_.clearTpl(document.querySelector('body'));
		_.gameScreenTpl(!!_.ls.check('15-save'));
		_.createFieldObject();
		_.createField();
		rand ? _.randomMoves() : '';
	}
	loadedGame(data){
		const _ = this;
		_.name = data.name;
		_.start = false;
		_.size = data.size;
		_.record = data.record;
		_.imgSrc = data.imgSrc;
		_.sound = data.sound;
		_.positions = data.positions;

		_.clearTpl(document.querySelector('body'));
		_.gameScreenTpl(true,data.time,data.steps);
		_.createField();
	}



	// создает разметку игровой страницы
	gameScreenTpl(save = null,time = null,steps = null){
		const _ = this;
		let sec = time ? time[2] : '00',
				min = time ? time[1] : '00',
				hours = time ? time[0] : '00';
		!steps ? steps = 0 : '';

		let title = _.create.el('H1','main-title main-subtitle',{'text' : '"Пятнашки"'});
		let row = _.create.el('DIV','row',{'children' : [
			_.create.el('DIV','steps',{'children' : [
				_.create.el('SPAN','steps-title',{'text' : 'Ходы: '}),
				_.create.el('SPAN','steps-span',{'text' : steps})
			]}),
			_.create.el('DIV','time',{'children' : [
				_.create.el('SPAN','time-title',{'text' : 'Время: '}),
				_.create.el('DIV','time-row',{'children' : [
					_.create.el('SPAN','time-hour',{'text' : hours}),
					_.create.el('SPAN','time-span',{'text' : ':'}),
					_.create.el('SPAN','time-minute',{'text' : min}),
					_.create.el('SPAN','time-span',{'text' : ':'}),
					_.create.el('SPAN','time-second',{'text' : sec})
				]})
			]})
		]});
		let newGameBtn = _.create.el('BUTTON','newGameBtn btn',{'text' : 'Начать заново'});
		let soundBtn = _.create.el('BUTTON','soundBtn btn');
		let body = _.create.el('DIV','gameBody');
		let bottomRow = _.create.el('DIV','row');
		let loadBtn = _.create.el('BUTTON','loadBtn btn',{'text' : 'Загрузить'});
		let autoWinBtn = _.create.el('BUTTON','autoBtn btn',{'text' : 'Авто'});
		let saveBtn = _.create.el('BUTTON','saveBtn btn',{'text' : 'Сохранить'});

		if (!save) loadBtn.classList.add('inactive');
		if (!_.sound) soundBtn.classList.add('inactive');
		soundBtn.innerHTML = `<svg viewBox="0 0 140 200"><path class="cls-1" d="M100,175.69a5,5,0,0,1-3.37-1.31L48.06,130H29.31a5,5,0,0,1-5-5V75a5,5,0,0,1,5-5H48.06L96.63,25.62A5,5,0,0,1,105,29.31V170.69a5,5,0,0,1-5,5ZM34.31,120H50a5,5,0,0,1,3.37,1.31l41.63,38V40.65l-41.63,38A5,5,0,0,1,50,80H34.31Z"/></svg>`;
		row.prepend(soundBtn);
		row.prepend(newGameBtn);
		bottomRow.append(loadBtn);
		bottomRow.append(autoWinBtn);
		bottomRow.append(saveBtn);
		document.querySelector('body').append(title,row,body,bottomRow);

		_.gameScreenHandlers({newGameBtn,soundBtn,body,loadBtn,autoWinBtn,saveBtn});
	}
	gameScreenHandlers(data){
		const _ = this;
		data.newGameBtn.addEventListener('click',function(){if(_.interactive)_.init()});
		data.soundBtn.addEventListener('click',function(){_.sound=!_.sound;data.soundBtn.classList.toggle('inactive')});
		data.body.addEventListener('mousedown',function(){if(!_.start){_.start = true;_.timeAndStepsCount()}});
		data.loadBtn.addEventListener('click',function(){if(_.interactive)_.loadGame()});
		data.autoWinBtn.addEventListener('click',function(){if(_.interactive)_.autoGame()});
		data.saveBtn.addEventListener('click',function(){if(_.interactive)_.saveGame()});
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
		let gameField = document.querySelector('.gameBody');

		for (let pos in _.positions){
			if (_.positions[pos]){
				let btn = _.create.el('BUTTON',`bone pos${_.size}`,{
					'id':`pos${_.size}-${pos}`,
					'draggable':true,
					'data-number':_.positions[pos]
				});

				if (_.imgSrc){
					btn.classList.add(`pos${_.size}-${pos}`);
					btn.setAttribute('style',`background-image:url(${_.imgSrc})`)
				} else {
					let span = _.create.el('SPAN',null,{'text' : _.positions[pos]});
					btn.append(span);
				}

				gameField.append(btn);


				let coordinates;
				btn.addEventListener('dragstart',function (e) {
					coordinates = _.dragStart(e)
				});
				btn.addEventListener('dragend',function (e) {
					_.dragEnd(e,coordinates)
				});
				btn.addEventListener('click',function () {
					let cond = _.possibleToMoveCheck(btn);
					if (cond){
						_.move(cond,btn);
						_.checkToWin();
					}
				})
			}
		}
	}
	// рандомно передвигает фишки
	randomMoves(){
		const _ = this;

		_.interactive = false;
		_.btnsInactiveClassChanger();

		let prevBtn = -500;
		let interval = setInterval(function () {
			let nl;
			for (let pos in _.positions){
				if (_.positions[pos] == null){
					nl = pos * 1;
				}
			}

			let countMoves = 0;
			let btns = [];
			if (_.positions[nl - _.size] && nl - _.size !== prevBtn) {
				countMoves += 1;
				btns.push(nl - _.size);
			}
			if (_.positions[nl + _.size] && nl + _.size !== prevBtn) {
				countMoves += 1;
				btns.push(nl + _.size);
			}
			if ((nl - 1) % _.size &&_.positions[nl - 1] && nl - 1 !== prevBtn) {
				countMoves += 1;
				btns.push(nl - 1);
			}
			if (nl % _.size && _.positions[nl + 1] && nl + 1 !== prevBtn) {
				countMoves += 1;
				btns.push(nl + 1);
			}


			let btnNumber = btns[Math.floor(Math.random() * countMoves)];
			prevBtn = btnNumber;
			_.move(nl,document.getElementById(`pos${_.size}-${btnNumber}`));
			prevBtn = nl;
		},100);
		setTimeout(function () {
			clearInterval(interval);
			_.interactive = true;
			_.btnsInactiveClassChanger();
		},_.size * 1000)
//
	}



	// запускает методы отсчета времени и набора очков
	timeAndStepsCount(){
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

			if (sec === 60) {
				sec = 0;
				min += 1;
				if (min === 60){
					min = 0;
					h += 1;
					if (_.start) hours.textContent = _.lengthCheck(h);
				}
				if (_.start) minutes.textContent = _.lengthCheck(min);
			}
			if (_.start) seconds.textContent = _.lengthCheck(sec);
		}
	}
	lengthCheck(value){
		value += '';
		if (value.length < 2) value = '0' + value;
		return value;
	}
	// считает количество ходов
	stepsCount(){
		let stepsCont = document.querySelector('.steps-span');
		stepsCont.textContent = (stepsCont.textContent * 1) + 1 + '';
	}
	// проверка на победу
	checkToWin(auto = false){
		const _ = this;
		let gameBody = document.querySelector('.gameBody');
		let check = true;
		for (let i = 0; i < gameBody.children.length; i++){
			if (gameBody.children[i].getAttribute('data-number') != gameBody.children[i].id.split('-')[1]) {
				check = false;
			}
		}
		if (check) {
			let time = document.querySelector('.time-row').textContent,
					steps = document.querySelector('.steps-span').textContent;

			_.start = false;
			if (auto) {
				time = '00:00:00';
				steps = 0;
			}
			_.calcScore(time,steps);
		}
	}
	// расчет количества очков
	calcScore(time,steps){
		const _ = this;
		time = time.split(':');
		time = ((((time[0] * 1) * 60) + (time[1] * 1)) * 60) + (time[2] * 1);
		steps = steps * 1;
		let score = Math.ceil(((_.size * _.size * 1000) - time) / steps);

		if (score === Infinity) score = 0;

		_.leadersListRefresh(score);
		_.finishScreenTpl(time,steps,score);
	}



	// методы игры
	// проверяет возможность хода данной костяшки
	possibleToMoveCheck(button,direction = null){
		const _ = this;

		if (!_.interactive) return;

		let
			pos = button.id.split('-')[1] * 1,
			condition = 0;

		if (_.positions[pos + _.size] === null){
			if (!direction || direction === 'toBottom') condition = pos + _.size;
		} else if (_.positions[pos + 1] === null && (pos % _.size) !== 0) {
			if (!direction || direction === 'toRight') condition = pos + 1;
		}	else if (_.positions[pos - 1] === null && ((pos - 1) % _.size) !== 0) {
			if (!direction || direction === 'toLeft') condition = pos - 1;
		}	else if (_.positions[pos - _.size] === null) {
			if (!direction || direction === 'toTop') condition = pos - _.size;
		}


		if (_.start && condition) _.stepsCount();
		return condition;
	}
	// метод хода
	move(condition,button){
		const _ = this;
		let
			btnNumber = button.getAttribute('data-number') * 1,
			id = button.id,
			pos = id.split('-')[1] * 1;

		_.positions[pos] = null;
		_.positions[condition] = btnNumber;
		button.id = `pos${_.size}-${condition}`;

		let moveInfo = {pos,button,btnNumber};
		if (_.record.length){
			if (moveInfo['btnNumber'] !== _.record[_.record.length - 1].btnNumber) _.record.push(moveInfo);
			else _.record.pop();
		} else _.record.push(moveInfo);

		if (_.sound) {
			let audio = new Audio('sound.mp3');
			audio.play();
		}
	}
	// метод автоматического завершения игры
	autoGame(){
		const _ = this;
		_.interactive = false;
		_.btnsInactiveClassChanger();

		let i = _.record.length - 1;
		let interval = setInterval(function () {
			_.move(_.record[i]['pos'],_.record[i]['button']);
			i--;
		},100);
		setTimeout(function () {
			clearInterval(interval);
			_.interactive = true;
			_.btnsInactiveClassChanger();
			setTimeout(function () {
				_.checkToWin(true);
			},100)
		},(i + 1) * 100);

	}



	dragStart(e) {
		const _ = this;

		let data = e.dataTransfer;
		let img = _.create.el('IMG');
		data.setDragImage(img, 0, 0);

		return {'x':e.x,'y':e.y}
	}
	dragEnd(e,coordinates){
		const _ = this;
		let btn = e.target;

		let direction = '',
				x = e.x - coordinates.x,
				y = e.y - coordinates.y;

		let difX = x > 0 ? x : x * (-1);
		let difY = y > 0 ? y : y * (-1);

		direction = difX - difY > 0 ? 'horizontal' : 'vertical';
		if (direction === 'horizontal') direction = x > 0 ? 'toRight' : 'toLeft';
		if (direction === 'vertical') direction = y > 0 ? 'toBottom' : 'toTop';


		let cond = _.possibleToMoveCheck(btn,direction);
		if (cond){
			_.move(cond,btn);
			_.checkToWin();
		}
	}



	leadersListRefresh(score){
		const _ = this;
		let leadersList = {};
		if (_.ls.check('leadersList')) {
			leadersList = _.ls.get('leadersList');
		} else {
			for (let i = 0; i < 10; i++){
				leadersList[i + 1] = {
					'score' : 0,
					'name' : ' '
				};
			}
		}

		for (let pos in leadersList){
			if (leadersList[pos]['score'] < score){
				leadersList[pos]['score'] = score;
				leadersList[pos]['name'] = _.name;
				break;
			}
		}

		_.ls.set('leadersList',leadersList);
	}
	clearScores(time,steps,score){
		const _ = this;
		let lead = {
			1: {score: 0, name: " "},
			2: {score: 0, name: " "},
			3: {score: 0, name: " "},
			4: {score: 0, name: " "},
			5: {score: 0, name: " "},
			6: {score: 0, name: " "},
			7: {score: 0, name: " "},
			8: {score: 0, name: " "},
			9: {score: 0, name: " "},
			10: {score: 0, name: " "}
		};
		_.ls.set('leadersList',lead);
		_.finishScreenTpl(time,steps,score)
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
		saveData.size = _.size;
		saveData.name = _.name;
		saveData.record = _.record;
		saveData.imgSrc = _.imgSrc;
		saveData.sound = _.sound;
		_.ls.set('15-save',saveData);
		if (document.querySelector('.loadBtn').classList.contains('inactive')) document.querySelector('.loadBtn').classList.remove('inactive');
	}
	// загрузка игры
	loadGame(){
		const _ = this;
		if(_.ls.check('15-save')) {
			let loadedData = _.ls.get('15-save');
			_.loadedGame(loadedData)
		}
	}



	// создает разметку финальной страницы
	finishScreenTpl(time,steps,score){
		const _ = this;
		let body = document.querySelector('body');
		_.clearTpl(body);
		let title = _.create.el('H1','main-title finish-title',{'text' : 'Поздравляем! Вы победили!'});
		let stepsCont = _.create.el('DIV','finish-steps',{'children' : [
			_.create.el('SPAN','finish-score-title',{'text' : 'Количество ходов: '}),
			_.create.el('SPAN','finish-score-span',{'text' : steps})
			]});
		let curTime;
		if (time){
			let min = Math.floor(time / 60);
			let hr = Math.floor(min / 60);
			min = min % 60;
			let sec = time % 60;
			if (min < 10) min = '0' + min;
			if (hr < 10) hr = '0' + hr;
			if (sec < 10) sec = '0' + sec;
			curTime = hr + ':' + min + ':' + sec;
		}
		let timeCont = _.create.el('DIV','finish-time',{'children' : [
			_.create.el('SPAN','finish-time-title',{'text' : 'Затраченное время: '}),
			_.create.el('SPAN','finish-time-span',{'text' : curTime})
			]});
		let size = _.create.el('DIV','finish-size',{'children' : [
			_.create.el('SPAN','finish-time-title',{'text' : 'Размеры поля: '}),
			_.create.el('SPAN','finish-time-span',{'text' : _.size})
			]});
		let scoreCont = _.create.el('DIV','finish-score',{'children' : [
			_.create.el('SPAN','finish-time-title',{'text' : 'Счет: '}),
			_.create.el('SPAN','finish-time-span',{'text' : score})
			]});

		let scoreListTitle = _.create.el('DIV','finish-scorelist-title',{'children' : [
				_.create.el('SPAN',null,{'text' : ''}),
				_.create.el('SPAN',null,{'text' : 'Имя'}),
				_.create.el('SPAN',null,{'text' : 'Счет'})
			]});
		let scoreList = _.create.el('UL','finish-scorelist');
		let scoreListInfo = _.ls.get('leadersList');
		for (let scr in scoreListInfo) {
			let li = _.create.el('LI','finish-scoreitem',{'children' : [
					_.create.el('SPAN',null,{'text' : `${scr}: `}),
					_.create.el('SPAN',null,{'text' : scoreListInfo[scr]['name']}),
					_.create.el('SPAN',null,{'text' : scoreListInfo[scr]['score']})
				]});
			scoreList.append(li)
		}

		let clearScoresBtn = _.create.el('BUTTON','btn',{'text' : 'Очистить результаты'});
		let newGameBtn = _.create.el('BUTTON','btn',{'text' : 'Начать новую игру','style':'margin-top:10px'});
		clearScoresBtn.addEventListener('click',function () {
			_.clearScores(time,steps,score);
		});
		newGameBtn.addEventListener('click',function () {
			_.init();
		});
		body.append(title,stepsCont,timeCont,size,scoreCont,scoreListTitle,scoreList,clearScoresBtn,newGameBtn)
	}
	init(){
		const _ = this;
		_.nameCheck();
		_.clearTpl(document.querySelector('body'));
		_.startScreenTpl();
		_.imgSrc = '';
		_.sound = false;
		_.positions = {};
		_.interactive = true;
	}
}
let game = new Game();