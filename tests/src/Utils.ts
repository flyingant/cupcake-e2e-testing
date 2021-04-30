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

}
