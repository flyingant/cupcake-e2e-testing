import TestComponent from './TestComponent';

export default class UploadBannerPage extends TestComponent {
    async waitForMe() {
        await this.tab.waitForSelector('text="Upload your banner"');
    }

    async getClinicName() {
        let elem = await this.tab.waitForSelector('.clinic-name >> css=input')
        return await elem.getAttribute("value")
    }

    async setClinicName(newName: string) {
        let elem = await this.tab.waitForSelector('.clinic-name >> css=input')
        return await elem.fill(newName)
    }

    async clickSaveButton() {
        await this.tab.click('text="SAVE"')
    }

    async clickChangeBannerIcon() {
        await this.tab.click('.back-picture > img')
    }

    async exit() {
        await this.tab.click('.logo')
    }

    async clickCloseButton() {
        await this.tab.click('css=button[aria-label="delete"]')
    }
}
