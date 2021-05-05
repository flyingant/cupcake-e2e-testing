import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2391
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep(`Login to Cupcake portal as a clinic coordinator and Navigate to 'All SCS patients' list`, async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Navigate to the patients' pipeline `, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.waitForPatient();
    });
    this.addTestStep(`Click on the "+" (blue circle) button`, async () => {
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
    });
  }
}

new TestCase('CC-680', `CupCake portal user is able to add new patients by clicking on the + (blue circle) button`);
