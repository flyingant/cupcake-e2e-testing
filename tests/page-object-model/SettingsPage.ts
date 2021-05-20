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
        await this.tab.click('text="ADD STAFF MEMBER"');
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

    async clickDismissBtnFromSuccessfullyMessage() {
      await this.tab.click(`.Toastify button[aria-label="delete"]`);
    }

    async waitForSaveSuccessfullyMessage() {
      await this.tab.waitForSelector("text=Clinic name successfully updated", { state: 'visible' });
    }

    async waitForSaveSuccessfullyMessageGone() {
      await this.tab.waitForSelector("text=Clinic name successfully updated", { state: 'hidden' });
    }
    
    async waitForValidationError() {
      await this.tab.waitForSelector("text=Min 3 characters are required", { state: 'visible' });
    }

    async waitForCloseIcon() {
      await this.tab.waitForSelector(`button[aria-label="delete"]`, { state: 'visible' });
    }

    async clickCloseIcon() {
      await this.tab.click(`button[aria-label="delete"]`);
    }

    async waitForLogoUploadScreen() {
      await this.tab.waitForSelector(`.upload-logo`, { state: 'visible' });
      await this.tab.waitForSelector(`text=Upload your logo`, { state: 'visible' });
    }

    async waitForBannerUploadScreen() {
      await this.tab.waitForSelector(`.upload-logo`, { state: 'visible' });
      await this.tab.waitForSelector(`text=Upload your banner`, { state: 'visible' });
    }

    async waitForLogoUploadIcon() {
      await this.tab.waitForSelector(`img[alt="upload-icon"]`, { state: 'visible' });
    }

    async setUploadFile(filePath: string) {
      let upload = await this.tab.$("input[type=file]");
      await upload.setInputFiles(filePath);
    }

    async waitForLogoUploading() {
      await this.tab.waitForSelector(`text=Uploading`, { state: 'visible' });
    }

    async waitForLogoUploadSuccessfullyMessageGone() {
      await this.tab.waitForSelector("text=Logo uploaded successfully", { state: 'hidden' });
    }
}
