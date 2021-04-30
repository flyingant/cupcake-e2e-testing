import TestComponent from './TestComponent';

export default class DashboardPage extends TestComponent {
    css_patientFullName =  "[class*=styles_tableRow] [class*=styles_fullName]";
    css_psy = "[class*=styles_tableRow] [class*=styles_psy]";
    css_auth = "[class*=styles_tableRow] [class*=styles_auth]";
    css_trial = '[class*=styles_tableRow] [class*=styles_trial] button';
    css_stage = "[class*=styles_stage-text]";
    css_ciinic_logo="[class*=styles_cupcakeLogo]";
    css_ciinic_name=".name-logo-holder";
    css_ciinic_banner="[class*=styles_bannerContainer]";
    css_needsAttention="input[name=needsAttentionSwitch]";
    css_trial_awaitingSurgery="//span[text()='- -']"
    css_edu="[class*=styles_tableRow_] [class*=styles_edu] button"
    
    async goto(){
        super.goto("/dashboard")
    }

    async waitForMe() {
        await this.tab.waitForSelector(".dashboard");
    }

    async hoverAvatarIcon(){
        await this.tab.hover('.title');
    }

    async logout() {
        await this.hoverAvatarIcon()
        await this.tab.waitForSelector('.dropdown-body');
        await this.tab.click('text="Sign out"')
    }

    async clickAddPatientButton() {
        await this.tab.click('[class*=addPatientBtn] > a');
    }

    async clickSettings() {
        await this.hoverAvatarIcon()
        await this.tab.waitForSelector('.dropdown-body');
        await this.tab.click('text="Settings"')
    }

    async getScsPatientsCount() {
        for (let index = 0; index < 10; index++) {
            let cscTitle = await this.tab.waitForSelector("h2[class*=styles_title]", {state: 'attached'});
            let text = await cscTitle.innerText();
            let pattern = /\d+/;
            if(pattern.test(text)){
                return text.match(pattern)[0]
            }else{
                this.sleep(1000)
            }
        }
    }

    async searchByName(name: string) {
        let searchBox = await this.tab.waitForSelector('[placeholder="Search by name"]');
        await searchBox.fill(name);
        await this.tab.keyboard.press("Enter");
        await this.tab.evaluate("window.scrollBy(0,500)")
    }

    async searchByStage(stage: string, theNextStage?: string) {
        await this.tab.click("[class*=styles_filter-button] button");
        if (theNextStage == undefined){
            await this.tab.click(`'${stage}'`);
        }else{
            await this.tab.hover(`'${stage}'`);
            await this.tab.click(`'${theNextStage}'`);
        }
    }

    async hoverPatientName(){
        for (let index = 0; index < 10; index++) {
            try {
                let fullName = await this.tab.waitForSelector(this.css_patientFullName, {state: "visible"})
                await fullName.hover({timeout:1000})
                }catch (error){
                    if (index < 9){
                        this.sleep(1000)
                    }else{
                        throw error;
                    }         
                }            
        }
    }

    async clickRandomPatient() {
      // usually be the first patient
      await this.tab.click('#stickyTableBody a[href]');
    }

    async clickPatientName(){
        let fullName = await this.tab.waitForSelector(this.css_patientFullName)
        let tagA = await fullName.waitForSelector("a", {state: 'visible'})
        await tagA.click()
    }

    async clickViewDetails(){
        // playwright click dose not work here, use js
        await this.tab.evaluate("document.querySelector('[class*=styles_tableRow] button[class*=styles_menu__button]').click()")
        let detail = await this.waitForText("View Details");
        await detail.click();
    }

    async getPsyStatus(){
        let psy = await this.tab.innerHTML(this.css_psy)
        if (psy.includes("styles_button--default")){
            if (psy.includes('d="M9')){
                return "calendar"
            }
            return "default"
        }else if (psy.includes("styles_button--success")){
            return "success"
        }else if (psy.includes("styles_button--failed")){
            return "failed"
        }else if (psy.includes("styles_ring")){
            this.getPsyStatus()
        }
    }

    async setPsyToCompleted(){
        await this.tab.click(this.css_psy);
        await this.tab.click("'Mark Completed'");
        // wait faile, use sleep
        // await this.tab.waitForSelector("[class*=success]", {timeout: 30000})
        this.sleep(3000)
    }

    async setPsyToFailed(){
        await this.tab.click(this.css_psy);
        await this.tab.click("'Mark Failed'")
        this.sleep(3000)
    }

    async clickPsySetDate(){
        await this.tab.click(this.css_psy);
        await this.tab.click(".MuiListItem-button")
    }

    async setAuthDate(date?: string){
        await this.tab.click(this.css_auth)
        await this.tab.click("'Set date'")
    }

    async clickTrial(){
        await this.tab.waitForSelector(this.css_trial, {state: 'visible'})
        await this.tab.evaluate(`document.querySelector('${this.css_trial}').click()`)
    }

    async clickNeedsAttention(){
        await this.tab.click(this.css_needsAttention);
    }

    async clickPiplineCandidates(){
        await this.tab.click("span:text('candidates')");
    }

    async clickPiplineAwaitingSurgery(){
        await this.tab.click("span:text('Awaiting Surgery')");
    }

    async clickPiplineAwaitingTrial(){
        await this.tab.click("span:text('Awaiting Trial')");
    }

    async clickPiplineInTrial(){
        await this.tab.click("span:text('In-trial')");
    }

    async selectFirstPatientFromList() {
      await this.tab.click(`#stickyTableBody a`, {force: true});
    }

    async waitForPatientList() {
      const element = await this.tab.waitForSelector("#stickyTableBody", {state: 'attached'})
      await element.scrollIntoViewIfNeeded();
    }

    async waitForSettingsAndLogoutOption() {
      await this.tab.waitForSelector('text=Settings');
      await this.tab.waitForSelector('text=Sign out');
    }
}
