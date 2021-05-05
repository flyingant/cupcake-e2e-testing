import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2429
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Go to Patient list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.searchByName('Test002'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientFullName();
    });
    this.addTestStep(`Verify if Pending blue calendar icon is shown if pre auth is not complete`, async () => {
      await this.dashboardPage.waitForPreAuthPendingIcon();
    });
  }
}

new TestCase('CC-673', `Pending blue calendar icon is shown, if pre auth is not complete`);

