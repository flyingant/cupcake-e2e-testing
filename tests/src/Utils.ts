export default class Utils {
    static randomPhoneNumber(): string {
		const list = "0123456789"
		let str = "";
		for(let i=0; i<10; i++) {
			str += list.charAt(Math.floor(Math.random()*10))
		}
		return str;
	}

	static randomString(len: number): string {
		const list = "abcdefghijklmnopqrstuvwxyz"
		let str = "";
		for(let i=0; i<len; i++) {
			str += list.charAt(Math.floor(Math.random()*10))
		}
		return str;
	}

	static hhmmssOfNow(): string {
		const now = new Date();
		return `${now.getHours()<10 ? "0" : ""}${now.getHours()}${now.getMinutes()<10 ? "0" : ""}${now.getMinutes()}${now.getSeconds()<10 ? "0" : ""}${now.getSeconds()}`
	}

	static comparDateToday(len:string){//How many days from the current date
		const date  = new Date();
		const lenDate =  new Date(len);
		let days = date.getTime()-lenDate.getTime();
		days = days/(1000*60*60*24);
		return Math.floor(days);
	} 
	static comparDate(len:string,datet:string){
		const date  = new Date(datet);
		const lenDate =  new Date(len);
		let days = date.getTime()-lenDate.getTime();
		days = days/(1000*60*60*24);
		return Math.floor(days);
	} 
}
