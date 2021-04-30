import TestComponent from './TestComponent';
import faker from "faker"

export default class SettingsPage extends TestComponent {
    css_clinicName = '[placeholder="Enter clinic name"]'
    css_click_here = 'input[type=file]'

    async waitForMe() {
        await this.tab.waitForSelector('.settings');
    }

    async getClinicName() {
        let elem = await this.tab.waitForSelector(this.css_clinicName)
        return await elem.getAttribute("value")
    }

    async setClinicName(newName: string) {
        let elem = await this.tab.waitForSelector(this.css_clinicName)
        return await elem.fill(newName)
    }

    async clickSaveButton() {
        await this.tab.click('text="SAVE"')
    }

    async clickChangeBannerIcon() {
        await this.tab.click('.back-picture >> css=a')
    }

    async clickAddStaffButton() {
        await this.tab.click('"ADD STAFF MEMBER"');
    }

    async backToDashboard() {
        await this.tab.click('.logo')
    }

    async clickLogo(){
        await this.tab.click("[class*=styles_logo_] svg")
    }

    async waitForLogo(){
        await this.tab.waitForSelector("[class*=styles_logo_] img[src]");
    }

    async waitForBanner(){
        await this.tab.waitForSelector("[class*=styles_backPicture_] img[src]");
    }

    async getStaffLineInfoByEmail(email:string,){
        let name=await this.tab.innerText("//td[text()='"+email+"']/../td[2]")
        let date=await this.tab.innerText("//td[text()='"+email+"']/../td[4]")
        let link=await this.tab.innerText("//td[text()='"+email+"']/../td[5]")
        let resendInviteBtn = await this.tab.waitForSelector("//td[text()='"+email+"']/../td[5]/button")
        let resendInviteBtnStatus= await resendInviteBtn.isEnabled();
        return [name,date,link,resendInviteBtnStatus]; 
    }

    private async getOneStaff(css_ResendInviteBtn:string):Promise<string[]>{
        await this.tab.waitForSelector(css_ResendInviteBtn, {state: 'attached'})
        let allStaffLine = await this.tab.$$(css_ResendInviteBtn)
        let index = faker.datatype.number({min:1, max:allStaffLine.length})
        let staffLine = await this.tab.$$(`(${css_ResendInviteBtn})[${index}]/td`);
        let name = await staffLine[1].innerText();
        let email = await staffLine[2].innerText();
        let date = await staffLine[3].innerText();
        if (css_ResendInviteBtn.includes("not(contains(@class, 'Mui-disabled'))")){
            let button = await staffLine[4].waitForSelector('[data-testid=resendInviteBtn]')
            await button.click()
            await this.waitForToast("Invitation link has been resent");
        }
        return [name, email, date]; 
    }

    async getOneActivedStaff():Promise<string[]>{
        let css_ResendInviteBtn = "//button[contains(@class, 'Mui-disabled')]/../.."
        return await this.getOneStaff(css_ResendInviteBtn); 
    }

    async getOneInactiveStaff():Promise<string[]>{
        let css_ResendInviteBtn = "//button[contains(@class, 'resendInviteBtn') and not(contains(@class, 'Mui-disabled'))]/../.."
        return await this.getOneStaff(css_ResendInviteBtn)
    }

    async clickBanner(){
        await this.tab.click("[class*=styles_backPicture] svg");
    }

    async clickUpload(){
        await this.tab.click(".MuiButton-label");
    }
	async clickResendInviteBtnByEmail(email:string,){
       await this.tab.click("//td[text()='"+email+"']/../td[5]/button") 
    }
}
