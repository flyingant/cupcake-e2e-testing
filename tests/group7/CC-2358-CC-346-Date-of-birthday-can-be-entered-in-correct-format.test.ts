import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-346
class TestCase extends MockableTestCase {

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

    this.addTestStep(`In "Patient DOB" field try to enter date in format DD/MM/YYYY `, async () => {
      await this.addPatientPage.setDateOfBirth('22022021');
      await this.addPatientPage.waitForDatesError();
    });

    this.addTestStep(`In "Patient DOB" field enter date in format MM/DD/YYYY `, async () => {
      await this.addPatientPage.setDateOfBirth('05052021');
      await this.tab.waitForTimeout(500);
      await this.addPatientPage.waitForDates();
    });




  }
}

new TestCase('CC-346', `Date of birthday can be entered only in mm/dd/yyyy format`);