import { Page } from 'playwright';
import AppConf from '../src/AppConf';

export default abstract class TestComponent {
	tab: Page;

	abstract async waitForMe();

	constructor(tab: Page) {
		this.tab = tab;
	}

	getFullPath(path: string) : string {
		return AppConf.baseUrl() + path;
	}
	
	getFullAPIPath(path: string) : string {
		return AppConf.baseApiUrl() + path;
	}
	
	async goto(path: string) {
		this.log(`Go to page ${path}`)
		await this.tab.goto(this.getFullPath(path), {timeout: 60000});
	}

	dataTestId(id:string) : string {
		return `data-test-id=${id}`;
	}

	dataTestIdInput(id:string) : string {
		return `data-test-id=${id} >> css=input`;
	}

	async fillDataTestId(id : string, value : string) {
		await this.tab.fill(this.dataTestIdInput(id), value);
	}

	async waitForDataTestId(id : string) {
		this.log(`wait for data test id ${id}`)
        await this.tab.waitForSelector(this.dataTestId(id));
    }

	async getInputValue(selector: string) {
		return await this.tab.$eval(selector, el => el.textContent.trim())
	}

	async clickDataTestId(id : string) {
		this.log(`click data test id ${id}`)
		await this.tab.click(this.dataTestId(id));
	}

	async waitForNavigation(urlPath: string) {
		this.log(`Wait for navigation ${urlPath}`)
		await this.tab.waitForNavigation({"url":this.getFullPath(urlPath)})
	}

	log(msg: string) {
		process.stdout.write(`${new Date().toLocaleString()} ${msg}\n`)
	}

	async waitForText(text: string, timeout?: number) {
		this.log(`Wait for text "${text}" timeout: ${timeout}`)
		return await this.tab.waitForSelector("text=" + text, {state: 'attached', timeout});
	}

	async waitForTimeout(ms: number) {
		this.log(`Wait for timeout ${ms}`)
		await this.tab.waitForTimeout(ms)
	}

	async waitForToast(text: string, timeout?: number){
		await this.waitForText(text=text, timeout);
		// wait 3s for toast appear on screen
		this.sleep(3000)
	}

	async getBackGroundColor(css: string){
		let element = await this.tab.waitForSelector(css);
		let rgb = await element.evaluate(`window.getComputedStyle(document.querySelector('${css}')).backgroundColor;`)
		return rgb
	}

	async getColorOfToast(){
		return await this.getBackGroundColor(".Toastify__toast")
	}

  async getFontWeightOfSelector(selector:string) {
    let element = await this.tab.waitForSelector(selector);
    let fontWeight = await element.evaluate(`window.getComputedStyle(document.querySelector('${selector}')).fontWeight;`)
    return fontWeight
  }


	async clickToastX(){
		this.log(`clickToastX`)
		await this.tab.click(".Toastify button")
	}

	async clickHeaderX(){
		this.log(`clickHeaderX`)
		await this.tab.click('header [type="button"] .MuiIconButton-label')
	}

	async isExist(element_locate: string){
		return await this.tab.$(element_locate)
	}

	async sleep(ms: number){
		let start = new Date().getTime();
		while(true)  if(new Date().getTime()-start > ms) break;
	}
}