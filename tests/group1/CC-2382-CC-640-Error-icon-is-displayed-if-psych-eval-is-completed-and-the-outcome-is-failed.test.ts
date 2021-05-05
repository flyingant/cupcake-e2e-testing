import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2382
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
    this.addTestStep(`Verify if 'Error' icon is present, in case if psych eval is completed and the outcome is failed`, async () => {
      await this.dashboardPage.waitForPasychEvalFailedIcon();
    });
  }
}

new TestCase('CC-640', `Error icon is displayed if psych eval is completed and the outcome is failed`);
