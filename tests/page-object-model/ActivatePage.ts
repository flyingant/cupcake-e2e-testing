import TestComponent from './TestComponent';

export default class ActivatePage extends TestComponent {
    css_nextButton = 'img[alt=next]'
    async waitForMe() {
        await this.waitForText("Set a password to protect your account.")
    }

    async setPassword(value: string) {
        let inputs = await this.tab.$$("input");
        await inputs[0].type(value, {delay:200});
    }

    async clickNextButton() {
        let input = await this.tab.waitForSelector(this.css_nextButton)
        await input.click();
    }

    async clickNextButtonByJs(){
        await this.tab.evaluate("document.querySelector('" + this.css_nextButton + "').click()")
    }

    async clickDecline(){
        await this.tab.click("'Decline'")
    }

    async clickAgree(){
        await this.tab.click("'I Agree'")
    }

    async clickYesExit(){
        await this.tab.click("'Yes, Exit'")
    }
}
