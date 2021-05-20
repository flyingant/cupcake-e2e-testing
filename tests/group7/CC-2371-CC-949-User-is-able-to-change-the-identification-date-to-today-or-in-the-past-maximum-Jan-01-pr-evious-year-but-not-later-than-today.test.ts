import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';
import { strict } from "node:assert";

// https://teamsolace.atlassian.net/browse/CC-2371
class TestCase extends MockableTestCase {
  d2t: string;
  patient: Map<string, string>;

  createTestSteps(): void {

    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });

    this.addTestStep(`Go to Patient list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });

    this.addTestStep(`Click on the "ADD PATIENT" button`, async () => {
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
    });

    this.addTestStep(`Fill in all required fields  `, async () => {
      this.patient = this.addPatientPage.generatePatientData();
      await this.addPatientPage.setPatientDetail(this.patient);
    });

    this.addTestStep(`and navigate to SCS Stage page`, async () => {
      await this.addPatientPage.waitForBtnLight();
      await this.addPatientPage.clickNextButton();
    });

    this.addTestStep(`Go to Identification date field and try to change the identification date back to maximum Jan 01 previous year`, async () => {
      let date = await this.addPatientPage.getPreviousYear();
      await this.addPatientPage.setIdentificationDate(date);
      await this.addPatientPage.waitForDates();
    });

    this.addTestStep(`Go to Identification date field and try to change the identification date back to more than Jan 01 previous year.`, async () => {
      await this.addPatientPage.setIdentificationDate("02022010");
      await this.addPatientPage.waitForTimeout(1000);//Wait for the input action to complete
      await this.addPatientPage.waitForDatesError();
    });
  }
}

new TestCase('CC-949', `User is able to change the identification date to today or in the past (maximum Jan 01 previous year) but not later than today.`);
