export class localSt{
	constructor(){}
	get(title){
		if(!title) return null;
		let item = localStorage.getItem(title);
		if(item) item = JSON.parse(item);
		return item;
	}
	set(title,data = null){
		if(!data || !title) return;
		data = JSON.stringify(data);
		localStorage.setItem(title,data);
	}
	check(title){
		if(!title) return null;
		let item = localStorage.getItem(title);
		if(item) return true;
		else return false;
	}
}