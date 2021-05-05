import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2448
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Navigate to 'All SCS patients' list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.searchByName(AppConf.getStablePatient('Test001')); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.waitForPatientFullName();
    });
    this.addTestStep(`Verify if 'Check' icon is present, if pre auth is completed and the insurance has been approved.`, async () => {
      await this.dashboardPage.waitForPreAuthCheckIcon();
    });
  }
}

new TestCase('CC-674', `Check icon is displayed, if pre auth is completed and the insurance has been approved`);
