import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2367
class TestCase extends MockableTestCase {
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
    this.addTestStep(`Click on a "X" close button and verify the result`, async () => {
      await this.addPatientPage.clickCloseBtn();
      await this.dashboardPage.waitForMe();
    });
  }
}

new TestCase('CC-334', `Coordinator can close out of patient contact details page without filling in any data and should go back to dashboard.`);
