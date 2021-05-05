import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2450
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Go to Patient list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.searchByName('Test004'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientFullName();
    });
    this.addTestStep(`Verify if Error icon in the "AUTH." column is shown in case if insurance has been denied or other action is needed`, async () => {
      await this.dashboardPage.waitForPreAuthFailedIcon();
    });
  }
}

new TestCase('CC-675', `Error icon is shown if pre-auth is completed and the insurance has been denied or another action is needed`);
