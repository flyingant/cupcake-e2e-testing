import TestComponent from './TestComponent';
import { BrowserContext, Page, Request } from 'playwright';

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
      const firstPatientHref = await this.tab.getAttribute('#stickyTableBody a', 'href');
      await super.goto(`${firstPatientHref}`);
    }

    async waitForPatientList() {
      const element = await this.tab.waitForSelector("#stickyTableBody", {state: 'attached'})
      await element.scrollIntoViewIfNeeded();
    }

    async waitForPatientListHeaderVisible() {
      const element = await this.tab.waitForSelector("#stickyTableBody", {state: 'visible'})
      await element.scrollIntoViewIfNeeded();
    }

    async waitForSettingsAndLogoutOption() {
      await this.tab.waitForSelector('text=Settings');
      await this.tab.waitForSelector('text=Sign out');
    }

    async waitForSettingsAndLogoutOptionVisible() {
      await this.tab.waitForSelector('text=Settings', { state: 'visible'});
      await this.tab.waitForSelector('text=Sign out', { state: 'visible'});
    }

    async waitForClinicMetrics() {
      await this.tab.waitForSelector('[class*=styles_SCSPipeline] [class*=styles_item] span:has-text("candidates")');
      await this.tab.waitForSelector('[class*=styles_SCSPipeline] [class*=styles_item] span:has-text("Awaiting Trial")');
      await this.tab.waitForSelector('[class*=styles_SCSPipeline] [class*=styles_item] span:has-text("In-trial")');
      await this.tab.waitForSelector('[class*=styles_SCSPipeline] [class*=styles_item] span:has-text("Awaiting Surgery")');
    }

    async hoverPatient() {
      await this.tab.hover('[class*=styles_tableRow] [class*=styles_fullName]');
    }

    async waitForPatient() {
      await this.tab.waitForSelector('[class*=styles_tableRow] [class*=styles_psy]');
      await this.tab.waitForSelector('[class*=styles_tableRow] [class*=styles_edu]');
      await this.tab.waitForSelector('[class*=styles_tableRow] [class*=styles_auth]');
    }

    async waitForPatientFullName() { 
      await this.tab.waitForSelector('[class*=styles_tableRow] [class*=styles_fullName]');
    }

    async waitForPatientStage() {
      await this.tab.waitForSelector('[class*=styles_tableRow] [class*=styles_stage]');
    }

    async waitForPatientD2P() { 
      await this.tab.waitForSelector('[class*=styles_tableRow] [class*=styles_d2p]');
    }

    async getValueOfSelectedPatientD2P():Promise<string> {
      return await this.tab.innerText('[class*=styles_tableRow] [class*=styles_d2p]')
    }

    async waitForPatientD2T() {
      await this.tab.waitForSelector(`[class*=styles_tableRow] [class*=styles_d2t]`);
    }

    async getValueOfSelectedPatientD2T():Promise<string> {
      return await this.tab.innerText('[class*=styles_tableRow] [class*=styles_d2t]')
    }

    async waitForPatientTooltip() {
      await this.tab.waitForSelector('text=IDENTIFIED');
      await this.tab.waitForSelector('text=STAGE');
      await this.tab.waitForSelector('text=D2T');
      await this.tab.waitForSelector('text=D2P');
      await this.tab.waitForSelector('text=NOTES');
    }

    async clickPSYIcon() {
      await this.tab.hover("[class*=styles_tableRow] [class*=styles_psy] button");// hover the button first to avoid the failes from firefox
      await this.tab.click("[class*=styles_tableRow] [class*=styles_psy] button");
    }

    async waitForPSYPopUp() {
      await this.tab.waitForSelector(`text=Mark Completed`);
      await this.tab.waitForSelector(`text=Mark Failed`)
      await this.tab.waitForSelector(`text=Clear Entry`)
    }

    async hoverPSYIcon() {
      await this.tab.hover("[class*=styles_tableRow] [class*=styles_psy]");
    }

    async waitForPSYTooltip() {
      await this.tab.waitForSelector('text=Psych Eval');
    }

    async waitForEDULabel() {
      await this.tab.waitForSelector("[class*=styles_tableRow] [class*=styles_edu]");
    }
    
    async clickEDUIcon() {
      await this.tab.hover("[class*=styles_tableRow] [class*=styles_edu] button"); // hover the button first to avoid the failes from firefox
      await this.tab.click("[class*=styles_tableRow] [class*=styles_edu] button");
    }

    async waitForEDUPopUp() {
      await this.tab.waitForSelector(`text=BSC Rep`);
      await this.tab.waitForSelector(`text=Office`)
    }

    async hoverEDUIcon() {
      await this.tab.hover("[class*=styles_tableRow] [class*=styles_edu]");
    }

    async waitForEDUTooltip() {
      await this.tab.waitForSelector('text=Education');
    }

    async clickAuthIcon() {
      await this.tab.hover("[class*=styles_tableRow] [class*=styles_auth] button"); // hover the button first to avoid the failes from firefox
      await this.tab.click("[class*=styles_tableRow] [class*=styles_auth] button");
    }

    async waitForAUTHPopUp() {
      await this.tab.waitForSelector(`text=Mark Completed`);
      await this.tab.waitForSelector(`text=Denied`)
      await this.tab.waitForSelector(`text=Clear Entry`)
    }

    async hoverAUTHIcon() {
      await this.tab.hover("[class*=styles_tableRow] [class*=styles_auth]");
    }

    async waitForAUTHTooltip() {
      await this.tab.waitForSelector('text=Pre-Auth');
    }

    async clickClearEntry() {
      await this.tab.click('text=Clear Entry')
    }

    async waitForEmptySearchResultsMessage() {
      await this.tab.waitForSelector(`text="Not seeing who you’re looking for?"`);
    }

    async waitForExpandSearchBtn() {
      await this.tab.waitForSelector(`button:has-text("Expand search")`);
    }

    async clickExpandSearchBtn() {
      await this.tab.click(`button:has-text("Expand search")`);
    }

    async waitForNoResultsMessage() {
      await this.tab.waitForSelector(`text=No results`);
    }

    async waitForImplantDateScheduleBtn() {
      await this.tab.waitForSelector(`[class*=styles_tableRow] [class*=styles_trial] span:has-text('Schedule')`);
    }

    async waitForTrialDateScheduleBtn() {
      await this.tab.waitForSelector(`[class*=styles_tableRow] [class*=styles_trial] span:has-text('Schedule')`);
    }

    async waitForPERMDateScheduleBtn() {
      await this.tab.waitForSelector(`[class*=styles_tableRow] [class*=styles_trial] span:has-text('Schedule')`);
    }

    async clickTrialDateScheduleBtn() {
      await this.tab.hover(`[class*=styles_tableRow] [class*=styles_trial] button.MuiButton-root`);
      await this.tab.dblclick(`[class*=styles_tableRow] [class*=styles_trial] button.MuiButton-root`, { force: true });
    }

    async clickPERMDateScheduleBtn() {
      await this.tab.hover(`[class*=styles_tableRow] [class*=styles_trial] button.MuiButton-root`);
      await this.tab.dblclick(`[class*=styles_tableRow] [class*=styles_trial] button.MuiButton-root`, { force: true });
    }

    async waitForDatePicker() {
      await (await this.tab.waitForSelector(".react-datepicker")).scrollIntoViewIfNeeded();
    }

    async clickCloseFromDatePicker() {
      await this.tab.click(`[class*=styles_date-popup__header] button`);
    }

    async clickSetFromDatePicker() {
      await this.tab.click('#setDate');
    }

    async clickClearFromDatePicker() {
      await this.tab.dblclick(`button:has-text("Clear")`);
    }

    async waitForPipeline() {
      await (await this.tab.waitForSelector("[class*=styles_SCSPipeline]")).scrollIntoViewIfNeeded();
    }

    async clickCandidatesFromPipeline() {
      await this.tab.click(`[class*=styles_SCSPipeline] [class*=styles_item] span:has-text("candidates")`);
    }

    async waitForCandidatesTitle() {
      await this.tab.waitForSelector(`text=/^candidate Patients/i`);
    }

    async clickScheduleBtnFromWanringPopup() {
      await this.tab.click(`[class*=styles_warning-card] button:has-text("Schedule")`)
    }

    async waitForEducationCheckIcon() {
      await this.tab.waitForSelector(`[class*=styles_tableRow] [class*=styles_edu] [class*=styles_button--success]`);
    }

    async waitForEducationPendingIcon() {
      await this.tab.waitForSelector(`[class*=styles_tableRow] [class*=styles_edu] [class*=styles_button--default]`);
    }

    async waitForPasychEvalCheckIcon() {
      await this.tab.waitForSelector(`[class*=styles_tableRow] [class*=styles_psy] [class*=styles_button--success]`);
    }

    async waitForPasychEvalFailedIcon() {
      await this.tab.waitForSelector(`[class*=styles_tableRow] [class*=styles_psy] [class*=styles_button--failed]`);
    }

    async waitForPasychEvalPendingIcon() {
      await this.tab.waitForSelector(`[class*=styles_tableRow] [class*=styles_psy] [class*=styles_button--default]`);
    }

    async waitForPreAuthCheckIcon() {
      await this.tab.waitForSelector(`[class*=styles_tableRow] [class*=styles_auth] [class*=styles_button--success]`);
    }

    async waitForPreAuthFailedIcon() {
      await this.tab.waitForSelector(`[class*=styles_tableRow] [class*=styles_auth] [class*=styles_button--failed]`);
    }

    async waitForPreAuthPendingIcon() {
      await this.tab.waitForSelector(`[class*=styles_tableRow] [class*=styles_auth] [class*=styles_button--default]`);
    }
    
    async waitForAverageTimeToImplant() {
      await this.tab.waitForSelector(`text="Avg. Days to Trial (D2T)"`);
    }

    async waitForAverageTimeToPERM() {
      await this.tab.waitForSelector(`text="Avg. Days to perm (D2P)"`);
    }

    async waitForTotalImplants() {
      await this.tab.waitForSelector(`text="TOTAL IMPLANTS TO DATE"`);
    }

    async clickCancelBtnFromWanringPopup() {
      await this.tab.click(`[class*=styles_warning-card] button:has-text("cancel")`)
    }

    async waitForScheduleBtnFromWanringPopup() {
      await this.tab.waitForSelector(`[class*=styles_warning-card] button:has-text("Schedule")`)
    }

    async waitForCancelBtnFromWanringPopup() {
      await this.tab.waitForSelector(`[class*=styles_warning-card] button:has-text("cancel")`)
    }
}
