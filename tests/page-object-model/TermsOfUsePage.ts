import TestComponent from './TestComponent';

export default class TermsOfUsePage extends TestComponent {
    async waitForMe() {
        await this.waitForText("Terms of Use")
    }

    async clickAgreeButton() {
        await this.tab.click('text="I Agree"')
    }

}
