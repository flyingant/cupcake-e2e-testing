import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2389
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
    this.addTestStep(`Navigate to 'Search' input field and enter any valid existing name and click on search glass icon`, async () => {
      await this.dashboardPage.searchByName(AppConf.getStablePatient('Test008'));
      await this.dashboardPage.waitForPatient();
    });
  }
}

new TestCase('CC-704', `CupCake portal user is able to search for patients (that were created on/after Jan 1, 2019 ) by patient name`);
