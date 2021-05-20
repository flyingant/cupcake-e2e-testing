import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-857
class TestCase extends MockableTestCase {
  patient: Map<string, string>;
  patientName: string;
  createTestSteps(): void {

    this.addTestStep('Login to Cupcake portal as a clinic coordinator ', async () => {
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

    this.addTestStep(`Fill in all required fields with a valid data and the "->" button is able to click `, async () => {
      this.patient = this.addPatientPage.generatePatientData();
      this.patientName = this.patient.get("firstName") + " " + this.patient.get("lastName");
      await this.addPatientPage.setPatientDetail(this.patient);
      await this.addPatientPage.waitForBtnLight();
    });

    this.addTestStep(`Click on the "X" button `, async () => {
      await this.addPatientPage.clickCloseButton();
      await this.patientDetailPage.waitForToast("Are you sure you want to cancel? Any information you have entered will be lost.");
    });

    this.addTestStep(`Click on the "YES, CANCEL" option `, async () => {
      await this.addPatientPage.clickYesCancel();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep(`Repeat step 2 to verify that last data wasn't saved`, async () => {
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
      expect(await this.addPatientPage.getFirstName()).toBe('');
      expect(await this.addPatientPage.getLastName()).toBe('');
      expect(await this.addPatientPage.getPhone()).toBe('');
      expect(await this.addPatientPage.getEmail()).toBe('');
      expect(await this.addPatientPage.getDateOfBirth()).toBe(''); //dob 
      expect(await this.addPatientPage.getZipCode()).toBe('');
      expect(await this.tab.isChecked("input[value='Female']")).toBeFalsy();
    });

  }
}

new TestCase('CC-857', `X button will cancel all entered data and will take the user back to the dashboard`);
