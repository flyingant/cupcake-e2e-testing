import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2412
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
    this.addTestStep(`Verify if pending icon is present in 'PSY.' column, if psych eval is not done yet`, async () => {
      await this.dashboardPage.waitForPasychEvalPendingIcon();
    });
  }
}

new TestCase('CC-637', `Pending icon is displayed in Psych column if psych eval is not done yet`);
