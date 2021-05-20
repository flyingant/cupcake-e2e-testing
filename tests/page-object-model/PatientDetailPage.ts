import { el } from 'date-fns/locale';
import TestComponent from './TestComponent';
import Utils from '../src/Utils';

export default class PatientDetailPage extends TestComponent {
    css_patientName = "#patientName";
    css_zip = "#zip";
    css_email = "#email";
    css_psychEval = "#psych";
    css_preAuth = "#preauth";
    css_stage = "#stage";
    css_surgon = "#surgeon button span";
    css_notes = "textarea#notes";
    css_DataSharing = "input[name=consent]";

    async waitForMe() {
        await this.tab.waitForSelector(`h2:has-text('SCS Journey')`);
        await this.tab.waitForSelector(`h2:has-text('Patient Info')`);
        await this.tab.waitForSelector(`h2:has-text('Care Team')`);
        await this.tab.waitForSelector(`h2:has-text('Notes')`);
    }

    async waitForDatePicker() {
      await (await this.tab.waitForSelector(".react-datepicker")).scrollIntoViewIfNeeded();
    }

    async clickSetFromDatePicker() {
      await this.tab.click('#setDate');
    }

    async clickClearFromDatePicker() {
      await this.tab.click(`button:has-text('Clear')`);
    }

    async getPatientName() {
        let name = await this.tab.getAttribute(this.css_patientName, "value");
        return name
    }

    async getStage() {
        let stage = await this.tab.getAttribute(this.css_stage, "value");
        return stage.toLowerCase()
    }

    async getSelectedGender(){
        let gender = await this.tab.innerText("[aria-label=gender] span.Mui-checked ~ span")
        return gender.toLowerCase()
    }

    async getZipCode(){
        let gender = await this.tab.getAttribute(this.css_zip, "value")
        return gender.toLowerCase()
    }

    async getEmail(){
        let email = await this.tab.getAttribute(this.css_email, "value")
        return email
    }

    async setGenderFemale() {
        let input = await this.tab.waitForSelector('input[value="Female"]')
        await input.click();
    }

    async setGenderMale() {
        let input = await this.tab.waitForSelector('input[value="Male"]')
        await input.click();
    }

    async setGenderOther() {
        let input = await this.tab.waitForSelector('input[value="Other"]')
        await input.click();
    }

    async clickSaveChange(){
        await this.tab.click('"Save Changes"')
    }

    async clickClose() {
      await this.tab.click(`button:right-of(button:has-text("Save Changes"))`)
    }

    async clickCloseBtn() {
      await this.tab.click(`[class*=styles_details-header__buttons] button`)
    }

    async clickClearEntry(){
        await this.tab.click("'Clear Entry'")
    }

    async clickDiscardChanges(){
        await this.tab.click("'discard changes'");
    }

    async clickPreAuth(){
        await this.tab.click(this.css_preAuth)
    }

    async clickPsychEval(){
        await this.tab.click(this.css_psychEval)
    }

    async setImplantConsult(date?: string){
        await this.tab.click('"implant consult"')
        if (date != undefined){
            // todo need calender method 
        }
        await this.tab.click("Set")
    }
    
    async clickSurgon(){
        await this.tab.click(this.css_surgon);
        // or await this.tab.click('button:below(label:has-text("surgeon"))');
    }

    async waitForD2P() {
      await this.tab.waitForSelector("#d2p");
      await this.tab.click("#d2t");
    }

    async getFontWeightOfD2P() {
      return await this.getFontWeightOfSelector("#d2p")
    }

    async waitForD2T() {
      await this.tab.waitForSelector("#d2t");
      await this.tab.click("#d2t");
    }

    async getFontWeightOfD2T() {
      return await this.getFontWeightOfSelector("#d2t")
    }

    async waitForDOB() {
      await this.tab.waitForSelector("#dob");
      await this.tab.click("#dob");
    }

    async fillDOB(date: string) {
      await this.tab.fill('input[id="dob"]', date);
    }

    async getValueOfDOB() {
      const input = await this.tab.waitForSelector("#dob");
      return input.getAttribute('value')
    }

    // Insurance Section - Patient Details ---------------------------------------
    async waitForInsuranceLabel() {
      await (await this.tab.waitForSelector(`label:has-text("insurance")`)).scrollIntoViewIfNeeded();
    }

    async waitForInsuranceAddBtn() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("insurance"))`)).scrollIntoViewIfNeeded();
    }

    async clickInsuranceAddBtn() {
      await this.tab.click('button:below(label:has-text("insurance"))');
    }

    async waitForInsuranceListPopUp() {
      await (await this.tab.waitForSelector("#insurance-popup")).scrollIntoViewIfNeeded();
    }

    async fillInsurancePopUpInput(keyword:string) {
      await this.tab.fill(`input[aria-controls="insurance-popup"]`, keyword);
    }

    async waitForInsuranceList() {
      await this.tab.waitForSelector(`ul[role=listbox]:below(label:has-text("insurance"))`);
    }

    async clickFirstItemFromInsuranceList() {
      const element = await this.tab.waitForSelector(`ul[role=listbox] li:below(label:has-text("insurance"))`);
      await element.click();
    }

    async getValueOfInsurance() {
      const input = await this.tab.waitForSelector(`button:below(label:has-text("insurance"))`);
      return input.innerText()
    }
    // Insurance Section - Patient Details ---------------------------------------

    // Surgeon Section - Patient Details ---------------------------------------
    async waitForSurgeonLabel() {
      await (await this.tab.waitForSelector(`label:has-text("surgeon")`)).scrollIntoViewIfNeeded();
    }

    async waitForSurgeonAddBtn() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("surgeon"))`)).scrollIntoViewIfNeeded();
    }

    async clickSurgeonAddBtn() {
      await this.tab.click('button:below(label:has-text("surgeon"))');
    }

    async waitForSurgeonListPopUp() {
      await (await this.tab.waitForSelector(`div[role="combobox"]:below(label:has-text("surgeon"))`)).scrollIntoViewIfNeeded();
    }

    async fillSurgeonPopUpInput(keyword:string) {
      await this.tab.fill(`input:below(label:has-text("surgeon"))`, keyword);
    }

    async waitForSurgeonList() {
      await this.tab.waitForSelector(`ul[role=listbox]:below(label:has-text("surgeon"))`);
    }

    async clickFirstItemFromSurgeonList() {
      const element = await this.tab.waitForSelector(`ul[role=listbox] li:below(label:has-text("surgeon"))`);
      await element.click();
    }

    async getValueOfSurgeon() {
      const input = await this.tab.waitForSelector(`button:below(label:has-text("surgeon"))`);
      return input.innerText()
    }
    // Surgeon Section - Patient Details ---------------------------------------

    // Referring Physician Section - Patient Details ---------------------------------------
    async waitForReferringPhysicianLabel() {
      await (await this.tab.waitForSelector(`label:has-text("referring physician")`)).scrollIntoViewIfNeeded();
    }

    async waitForReferringPhysicianAddBtn() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("referring physician"))`)).scrollIntoViewIfNeeded();
    }

    async clickReferringPhysicianAddBtn() {
      await this.tab.click('button:below(label:has-text("referring physician"))');
    }

    async waitForReferringPhysicianListPopUp() {
      await (await this.tab.waitForSelector(`div[role="combobox"]:below(label:has-text("referring physician"))`)).scrollIntoViewIfNeeded();
    }

    async fillReferringPhysicianPopUpInput(keyword:string) {
      await this.tab.fill(`input:below(label:has-text("referring physician"))`, keyword);
    }

    async waitForReferringPhysicianList() {
      await this.tab.waitForSelector(`ul[role=listbox]:below(label:has-text("referring physician"))`);
    }

    async clickFirstItemFromReferringPhysicianList() {
      const element = await this.tab.waitForSelector(`ul[role=listbox] li:below(label:has-text("referring physician"))`);
      await element.click();
    }

    async getValueOfReferringPhysician() {
      const input = await this.tab.waitForSelector(`button:below(label:has-text("referring physician"))`);
      return input.innerText()
    }
    // Referring Physician Section - Patient Details ---------------------------------------

    // Trialing Physician Section - Patient Details ---------------------------------------
    async waitForTrialingPhysicianLabel() {
      await (await this.tab.waitForSelector(`label:has-text("trialing physician")`)).scrollIntoViewIfNeeded();
    }

    async waitForTrialingPhysicianAddBtn() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("trialing physician"))`)).scrollIntoViewIfNeeded();
    }

    async clickTrialingPhysicianAddBtn() {
      await this.tab.click('button:below(label:has-text("trialing physician"))');
    }

    async waitForTrialingPhysicianListPopUp() {
      await (await this.tab.waitForSelector(`div[role="combobox"]:below(label:has-text("trialing physician"))`)).scrollIntoViewIfNeeded();
    }

    async fillTrialingPhysicianPopUpInput(keyword:string) {
      await this.tab.fill(`input:below(label:has-text("trialing physician"))`, keyword);
    }

    async waitForTrialingPhysicianList() {
      await this.tab.waitForSelector(`ul[role=listbox]:below(label:has-text("trialing physician"))`);
    }

    async clickFirstItemFromTrialingPhysicianList() {
      const element = await this.tab.waitForSelector(`ul[role=listbox] li:below(label:has-text("trialing physician"))`);
      await element.click();
    }

    async getValueOfTrialingPhysician() {
      const input = await this.tab.waitForSelector(`button:below(label:has-text("trialing physician"))`);
      return input.innerText()
    }
    // Trialing Physician Section - Patient Details ---------------------------------------

    // BSC Rep Section - Patient Details ---------------------------------------
    async waitForBSCRepLabel() {
      await (await this.tab.waitForSelector(`label:has-text("BSC rep")`)).scrollIntoViewIfNeeded();
    }

    async waitForBSCRepAddBtn() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("BSC rep"))`)).scrollIntoViewIfNeeded();
    }

    async clickBSCRepAddBtn() {
      await this.tab.click('button:below(label:has-text("BSC rep"))');
    }

    async waitForBSCRepListPopUp() {
      await (await this.tab.waitForSelector(`div[role="combobox"]:below(label:has-text("BSC rep"))`)).scrollIntoViewIfNeeded();
    }

    async fillBSCRepPopUpInput(keyword:string) {
      await this.tab.fill(`input:below(label:has-text("BSC rep"))`, keyword);
    }

    async waitForBSCRepList() {
      await this.tab.waitForSelector(`ul[role=listbox]:below(label:has-text("BSC rep"))`);
    }

    async clickFirstItemFromBSCRepList() {
      const element = await this.tab.waitForSelector(`ul[role=listbox] li:below(label:has-text("BSC rep"))`);
      await element.click();
    }

    async getValueOfBSCRep() {
      const input = await this.tab.waitForSelector(`button:below(label:has-text("BSC rep"))`);
      return input.innerText()
    }
    // BSC Rep Section - Patient Details ---------------------------------------

    // Implant Consult Section - Patient Details ---------------------------------------
    async waitForImplantConsultLabel() {
      await (await this.tab.waitForSelector(`label:has-text("implant consult")`)).scrollIntoViewIfNeeded();
    }

    async waitForImplantConsultScheduleBtn() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("implant consult"))`)).scrollIntoViewIfNeeded();
    }

    async clickImplantConsultScheduleBtn() {
      await this.tab.click('button:below(label:has-text("implant consult"))');
    }

    async waitForImplantConsultDatePicker() {
      await (await this.tab.waitForSelector(".react-datepicker")).scrollIntoViewIfNeeded();
    }

    async getValueOfImplantConsult() :Promise<string> {
      const implant_consult = await this.tab.innerText('button:below(label:has-text("implant consult"))');
      return implant_consult
   }

    // Implant Consult Section - Patient Details ---------------------------------------

    // Trial Date Section - Patient Details ---------------------------------------
    async waitForTrailDateLabel() {
      await (await this.tab.waitForSelector(`label:has-text("trial date")`)).scrollIntoViewIfNeeded();
    }

    async waitForTrailDateScheduleBtn() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("trial date"))`)).scrollIntoViewIfNeeded();
    }

    async clickTrailDateScheduleBtn() {
      await this.tab.click('button:below(label:has-text("trial date"))');
    }

    async waitForTrailDateDatePicker() {
      await (await this.tab.waitForSelector(".react-datepicker")).scrollIntoViewIfNeeded();
    }

    async getValueOfTrailDate() :Promise<string> {
      const value = await this.tab.innerText('button:below(label:has-text("trial date"))');
      return value
   }
    // Trial Date Section - Patient Details ---------------------------------------

    // Surgery Date Section - Patient Details ---------------------------------------
    async waitForSurgeryDateLabel() {
      await (await this.tab.waitForSelector(`label:has-text("surgery date")`)).scrollIntoViewIfNeeded();
    }

    async waitForSurgeryDateScheduleBtn() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("surgery date"))`)).scrollIntoViewIfNeeded();
    }

    async clickSurgeryDateScheduleBtn() {
      await this.tab.click('button:below(label:has-text("surgery date"))');
    }

    async waitForSurgeryDateDatePicker() {
      await (await this.tab.waitForSelector(".react-datepicker")).scrollIntoViewIfNeeded();
    }

    async getValueOfSurgeryDate() :Promise<string> {
      const value = await this.tab.innerText('button:below(label:has-text("surgery date"))');
      return value
   }
    // Trial Date Section - Patient Details ---------------------------------------

    // Medical Clearance Section - Patient Details ---------------------------------------
    async waitForMedicalClearanceLabel() {
      await (await this.tab.waitForSelector(`label:has-text("medical clearance")`)).scrollIntoViewIfNeeded();
    }

    async waitForMedicalClearanceAddBtn() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("medical clearance"))`)).scrollIntoViewIfNeeded();
    }

    async clickMedicalClearanceAddBtn() {
      await this.tab.click('button:below(label:has-text("medical clearance"))');
    }

    async waitForMedicalClearanceDatePicker() {
      await (await this.tab.waitForSelector(".react-datepicker")).scrollIntoViewIfNeeded();
    }

    async getValueOfMedicalClearance() :Promise<string> {
      const medical_clearance = await this.tab.innerText('button:below(label:has-text("medical clearance"))');
      return medical_clearance
   }
    // Medical Clearance Section - Patient Details ---------------------------------------

    // Education Section - Patient Details ---------------------------------------
    async waitForEducationLabel() {
      await (await this.tab.waitForSelector(`label:has-text("education")`)).scrollIntoViewIfNeeded();
    }

    async waitForEducationAddBtn() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("education"))`)).scrollIntoViewIfNeeded();
    }

    async waitForEducationCheckIcon() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("education")) [class*=styles_button--success]`)).scrollIntoViewIfNeeded();
    }

    async clickEducationAddBtn() {
      await this.tab.click('button:below(label:has-text("education"))');
    }

    async waitForEducationPopUp() {
      await this.tab.waitForSelector(`text=BSC Rep`);
      await this.tab.waitForSelector(`text=Office`)
    }

    async waitForEducationPendingIcon() {
      await this.tab.waitForSelector(`button:below(label:has-text("education")) [class*=styles_button--default]`);
    }

    async clickEducationSetDateBtn() {
      await this.tab.click('span:has-text("Set date")');
    }

    async clickEducationClearBtn() {
      await this.tab.click('button:has-text("Clear")');
    }

    async clickEducationBSCRepBtn() {
      await this.tab.click('span:has-text("BSC Rep")');
    }

    async getValueOfEducation() {
      const input = await this.tab.waitForSelector(`button:below(label:has-text("education"))`);
      return input.innerText()
    }

    async waitForEducationDatePicker() {
      await (await this.tab.waitForSelector(".react-datepicker")).scrollIntoViewIfNeeded();
    }

    async waitForEducationCalendarIcon() {
      await this.tab.waitForSelector(`button:below(label:has-text("education")) svg`);
    }

    async checkTheColorOfEducationCalendar() {
      const element = await this.tab.waitForSelector(`button:below(label:has-text("education")) svg`);
		  let rgb = await element.evaluate(`window.getComputedStyle(document.querySelector('svg')).backgroundColor;`)
    }
    // Education Section Section - Patient Details ---------------------------------------

    // MRI Section - Patient Details ---------------------------------------
    async waitForMRILabel() {
      await (await this.tab.waitForSelector(`label:has-text("MRI")`)).scrollIntoViewIfNeeded();
    }

    async waitForMRIAddBtn() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("MRI"))`)).scrollIntoViewIfNeeded();
    }

    async clickMRIAddBtn() {
      await this.tab.click('button:below(label:has-text("MRI"))');
    }

    async waitForMRIDatePicker() {
      await (await this.tab.waitForSelector(".react-datepicker")).scrollIntoViewIfNeeded();
    }

    async getValueOfMRI() :Promise<string> {
      const mri = await this.tab.innerText('button:below(label:has-text("MRI"))');
      return mri
   }
    // MRI Section Section - Patient Details ---------------------------------------

    // Psych Eval Section - Patient Details ---------------------------------------
    async waitForPsychEvalLabel() {
      await (await this.tab.waitForSelector(`label:has-text("psych eval")`)).scrollIntoViewIfNeeded();
    }

    async waitForPsychEvalAddBtn() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("psych eval"))`)).scrollIntoViewIfNeeded();
    }

    async waitForPsychEvalCheckIcon() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("psych eval")) [class*=styles_button--success]`)).scrollIntoViewIfNeeded();
    }

    async waitForPsychEvalFailedIcon() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("psych eval")) [class*=styles_button--failed]`)).scrollIntoViewIfNeeded();
    }

    async clickPsychEvalAddBtn() {
      await this.tab.click('button:below(label:has-text("psych eval"))');
    }

    async waitForPsychEvalPopUp() {
      await this.tab.waitForSelector(`text=Mark Completed`);
      await this.tab.waitForSelector(`text=Mark Failed`)
    }

    async waitForPsychEvalClearEntry() {
      await this.tab.waitForSelector(`text=Clear Entry`)
    }

    async clickPsychEvalSetDateBtn() {
      await this.tab.click('span:has-text("Set date")');
    }

    async getValueOfPsychEval() :Promise<string> {
      const psych_eval = await this.tab.innerText('button:below(label:has-text("psych eval"))');
      return psych_eval
   }
    // Psych Eval Section Section - Patient Details ---------------------------------------

    // Pre Auth Section - Patient Details ---------------------------------------
    async waitForPreAuthLabel() {
      await (await this.tab.waitForSelector(`label:has-text("pre-auth")`)).scrollIntoViewIfNeeded();
    }

    async waitForPreAuthAddBtn() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("pre-auth"))`)).scrollIntoViewIfNeeded();
    }

    async waitForPreAuthCheckIcon() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("pre-auth")) [class*=styles_button--success]`)).scrollIntoViewIfNeeded();
    }

    async waitForPreAuthFailedIcon() {
      await (await this.tab.waitForSelector(`button:below(label:has-text("pre-auth")) [class*=styles_button--failed]`)).scrollIntoViewIfNeeded();
    }

    async waitForPreAuthPendingIcon() {
      await this.tab.waitForSelector(`button:has-text("Pending")`);
    }

    async clickPreAuthAddBtn() {
      await this.tab.click('#preauth');
    }

    async waitForPreAuthPopUp() {
      await this.tab.waitForSelector(`text=Mark Completed`);
      await this.tab.waitForSelector(`text=Denied`)
    }

    async waitForPreAuthClearEntry() {
      await this.tab.waitForSelector(`text=Clear Entry`)
    }

    async clickPreAuthSetDateBtn() {
      await this.tab.click('span:has-text("Set date")');
    }

    async getValueOfPreAuth() :Promise<string> {
      const pre_auth = await this.tab.innerText('button:below(label:has-text("pre-auth"))');
      return pre_auth
   }
    // Pre Auth Section Section - Patient Details ---------------------------------------

    async getPhysicianInSurgonList() {
        let physician: string[] = []
        let css_list = 'ul[role=listbox] li article'
        await this.tab.waitForSelector(css_list, {state: "attached"})
        let list = await this.tab.$$(css_list)
        for (let index = 0; index < list.length; index++) {
            // contains abbreviations name,remove it 
            let name = (await list[index].textContent()).substr(2)
            physician.push(name) 
        }
        return physician
    }

    async searchSurgon(physician: string) {
        await this.tab.fill("[placeholder=search]", physician);
    }

    // physician varies from env to env,modify the method to fit the index selection
    async selectSurgon(options:{physician?: string, index?: number}) {
        if (options.physician != undefined){
            let physician = await this.waitForText(options.physician)
            await physician.click()
        }else if (options.index != undefined){
            let list = await this.tab.$$('ul[role=listbox] li article')
            await list[options.index].click();
        }
    }

    // physician varies from env to env,modify the method to fit the index selection
    async selectPhysician(options:{physician?: string, index?: number}) {
        let input = await this.tab.waitForSelector("//label[text()='trialing physician']/../div");
        await input.click();
        if (options.physician != undefined){
            let physician = await this.waitForText(options.physician)
            await physician.click()
        }else if (options.index != undefined){
            let list = await this.tab.$$('.styles_group__3ZO0i>li') 
            await list[options.index].click();
        }
    }
    
    async setNotes(text: string){
        await this.tab.fill(this.css_notes, text)
    }

    async getNotes(){
        return await this.tab.$eval(this.css_notes, el => el.value)
    }

    async clickMedicalClearance() {
      await this.tab.click('button:below(label:has-text("medical clearance"))');
    }

    async waitForClearEntry() {
      await this.tab.waitForSelector('text=Clear Entry')
    }

    async clickClosePatient() {
      await this.tab.click('button:left(button:has-text("Save Changes"))')
    }

    async waitForUnsaveWarningMessage() {
      await this.tab.waitForSelector('text=You have changed or entered information on this page')
    }
    
    async waitForWarningCard() {
      await (
        await this.tab.waitForSelector('[class*=styles_warning-card]')
      ).scrollIntoViewIfNeeded();
    }

    async waitForScheduleBtnFromWanringPopup() {
      await this.tab.waitForSelector(`[class*=styles_warning-card] button:has-text("Schedule")`)
    }

    async waitForCancelBtnFromWanringPopup() {
      await this.tab.waitForSelector(`[class*=styles_warning-card] button:has-text("cancel")`)
    }

    async clickScheduleBtnFromWanringPopup() {
      await this.tab.click(`[class*=styles_warning-card] button:has-text("Schedule")`)
    }

    async clickCancelBtnFromWanringPopup() {
      await this.tab.click(`[class*=styles_warning-card] button:has-text("cancel")`)
    }

    async clickCloseFromDatePicker() {
      await this.tab.click(`[class*=styles_date-popup__header] button`);
    }

    async waitForPatientStage() {
      await (
        await this.tab.waitForSelector(this.css_stage)
      ).scrollIntoViewIfNeeded();
    }
    
    async getCreatedDate() {
      let date = await this.tab.getAttribute("#patientCreatedDate", "value");
      return date;
    }

    async setCreatedDate(date: string) {
      await this.tab.fill('input[id="patientCreatedDate"]', date);
    }

    async fillPatentName(keyword: string) {
      await this.tab.fill('input[id="patientName"]', keyword);
    }

    async clickAndUpdatePatientName(patientName: string){
      await this.tab.click('#patientName')
      await this.fillPatentName(patientName)// Press T on the keyboard just for Test， Change existing name， It won't save
    }

    async waitForZipLabel() {
      await (
        await this.tab.waitForSelector(`label:has-text("zip")`)
      ).scrollIntoViewIfNeeded();
    }

    async waitForZipInput() {
      await (
        await this.tab.waitForSelector(`input[id="zip"]`)
      ).scrollIntoViewIfNeeded();
    }

    async waitForZipInputErrorMessage() {
      await (
        await this.tab.waitForSelector(`text="please enter a valid zip"`)
      ).scrollIntoViewIfNeeded();
    }

    async clickZiplabel() {
      await this.tab.dblclick('label:has-text("zip")');
    }

    async clickZipAddBtn() {
      await this.tab.click('button:below(label:has-text("zip"))');
    }

    async fillZip(keyword: string) {
      await this.tab.fill('input[id="zip"]', keyword);
    }

    async waitForEmailLabel() {
      await (
        await this.tab.waitForSelector(`label:has-text("email")`)
      ).scrollIntoViewIfNeeded();
    }

    async waitForEmailInput() {
      await (
        await this.tab.waitForSelector(`input[id="email"]`)
      ).scrollIntoViewIfNeeded();
    }

    async waitForEmailInputErrorMessage() {
      await (
        await this.tab.waitForSelector(`text="please enter a valid email"`)
      ).scrollIntoViewIfNeeded();
    }

    async clickEmaillabel() {
      await this.tab.dblclick('label:has-text("email")');
    }

    async clickEmailAddBtn() {
      await this.tab.click('button:below(label:has-text("email"))');
    }

    async fillEmail(keyword: string) {
      await this.tab.fill('input[id="email"]', keyword);
    }

    async getPhone() {
      let phone = await this.tab.getAttribute("input[id=phone]", "value");
      return phone;
    }

    async getValueOfD2T() {
      const input = await this.tab.innerText("#d2t");
      return input;
    }
  
    async CheckIsDate(createdDate: string,date:string) {
      let days :number;
      if(date != 'SCHEDULE'){
        days = Utils.comparDate(createdDate,date);
      }else{
        days = Utils.comparDateToday(createdDate);
      }
      return days;
    }

    async getValueOfPipelineday () {
      const input = await this.tab.innerText("h3");
      const array =input.split(" ");
      return array[1];
    }

    

   
    
}
