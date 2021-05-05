import TestComponent from './TestComponent';
import * as faker from "faker"

export default class AddPatientPage extends TestComponent {
    async waitForMe() {
        await this.waitForText("Patient details")
    }

    async setFirstName(value: string) {
        await this.tab.fill("[data-test-id=first_name] > div input", value);
    }

    async setLastName(value: string) {
        await this.tab.fill("[data-test-id=last_name] > div input", value);
    }

    async setPhone(value: string) {
        await this.tab.fill("[data-test-id=phone] > div input", value)
    }

    async getPhone(){
        let input = await this.tab.$("[data-test-id=phone] > div input");
        return await input.getAttribute("value");
    }

    async setEmail(value: string) {
        await this.tab.fill("[data-test-id=email] > div input", value)
    }

    async setDateOfBirth(value: string) {
        await this.tab.fill("[data-test-id=dob] > div input", value)
    }

    async getDateOfBirth(){
        let input = await this.tab.$("[data-test-id=dob] > div input");
        return await input.getAttribute("value");
    }

    async setZipcode(value: string) {
        await this.tab.fill("[data-test-id=zip] > div input", value)
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

    async clickCloseButton() {
        await this.tab.click('css=button[aria-label="delete"]')
    }

    async clickYesCancel() {
        await this.tab.click("text='YES, CANCEL'");
    }

    async clickNextButton() {
        let input = await this.tab.waitForSelector('data-test-id=next-btn')
        await input.click();
    }

    async clickDoNotSetTrialDate(){
        await this.tab.click("input[type=checkBox]")
    }

    async selectStage(stage: string) {
        let input = await this.tab.waitForSelector('.MuiSelect-select[role=button]');
        await input.click();
        input = await this.waitForText(stage)
        await input.click();
    }

    // physician varies from env to env,modify the method to fit the index selection
    async selectSurgon(options:{physician?: string, index?: number}) {
        let input = await this.tab.waitForSelector('.phys-dropdown[role=combobox]');
        await input.click();
        if (options.physician != undefined){
            let physician = await this.waitForText(options.physician)
            await physician.click()
        }else if (options.index != undefined){
            let list = await this.tab.$$('ul[role=listbox] > li > ul')
            await list[options.index].click();
        }
    }

    // physician varies from env to env,modify the method to fit the index selection
    async selectPhysician(options:{physician?: string, index?: number}) {
        let input = await this.tab.waitForSelector('.MuiSelect-select[role=button]');
        await input.click();
        if (options.physician != undefined){
            let physician = await this.waitForText(options.physician)
            await physician.click()
        }else if (options.index != undefined){
            let list = await this.tab.$$('ul[role=listbox] > li')
            await list[options.index].click();
        }
        // physician name
        return (await this.tab.innerText(".MuiSelect-select[role=button]")).substr(2)
    }

    async setIdentificationDate(value: string) {
        let inputs = await this.tab.$$("input");
        await inputs[0].fill(value);
    }

    async getIdentificationDate(){
        let inputs = await this.tab.$$("input");
        return await inputs[0].getAttribute("value");
    }

    async setTrialDate(value: string) {
        let inputs = await this.tab.$$("input");
        await inputs[0].fill(value);
    }

    async getTrialDate(){
        let inputs = await this.tab.$$("input");
        return await inputs[0].getAttribute("value");
    }

    async setSurgeryDate(value: string){
        let inputs = await this.tab.$$("input");
        await inputs[0].fill(value);
    }

    async getSurgeryDate(){
        let inputs = await this.tab.$$("input");
        return await inputs[0].getAttribute("value");
    }

	async waitForSummaryPage() {
		await this.waitForText("Summary");
	}

    async getSummaryName(){
        return this.tab.innerText("//label[text()='Name']/following::p")
    }

    async getSummaryTrialDate(){
        return this.tab.innerText("//label[text()='Target trial date']/following::p")
    }

    async getSummarySurgeryDate(){
        return this.tab.innerText("//label[text()='Target surgery date']/following::p")
    }

    async getSummaryDateOfBirth(){
        return this.tab.innerText("//label[text()='D.O.B.']/following::p")
    }

    async getSummaryGender(){
        return this.tab.innerText("//label[text()='Gender']/following::p")
    }

    async getSummaryStage(){
        return this.tab.innerText("//label[text()='Stage']/following::p")
    }

	async clickAddPatientButton() {
		await this.tab.click('text="Add Patient"')
	}

    async setPatientDetail(patient: Map<string, string>){
        for (let k of patient.keys()){
            switch (k){
                case "firstName":{
                    await this.setFirstName(patient.get(k));
                    break;
                }
                case "lastName":{
                    await this.setLastName(patient.get(k))
                    break;
                }
                case "phone":{
                    await this.setPhone(patient.get(k));
                    break;
                }
                case "email":{
                    await this.setEmail(patient.get(k));
                    break;
                }
                case "dob":{
                    await this.setDateOfBirth(patient.get(k));
                    break;
                }
                case "zipCode":{
                    await this.setZipcode(patient.get(k));
                    break;
                }
                case "gender":{
                    switch (patient.get(k)){
                        case "female":{
                            await this.setGenderFemale();
                            break;
                        }
                        case "male":{
                            await this.setGenderMale();
                            break;
                        }
                        case "other":{
                            await this.setGenderOther()
                        }
                    }
                }
            }
        }
    }

    generatePatientData(){
        let first_name = faker.name.firstName(1);
        if (first_name.length <3){
            first_name = first_name + "o"
        }
        let last_name = faker.name.lastName(1);
        let phone = faker.phone.phoneNumberFormat();
        let zipCode = faker.address.zipCode();
        let email = faker.internet.email(first_name, last_name); 

        let patient = new Map([
            ["firstName", first_name],
            ["lastName", last_name],
            ["phone", phone],
            ["email", email],
            ["dob", "12012004"],
            ["zipCode", zipCode],
            ["gender", "female"]

        ]);
        return patient
    }

    async getGender() {
      await page.getAttribute("input[name=gender]", "value")
    }

}
