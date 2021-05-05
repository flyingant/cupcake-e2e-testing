import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2413
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Navigate to the TRIAL column, select patient which hasn't trial date setted up`, async () => {
      await this.dashboardPage.searchByName(AppConf.getStablePatient('Tina Abshire')); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });
    this.addTestStep(`Verify if "SCHEDULE" button is displayed`, async () => {
      await this.dashboardPage.waitForPatient();
      await this.dashboardPage.waitForTrialDateScheduleBtn();
    });
  }
}

new TestCase('CC-1055', `SCHEDULE button is displayed on the dashboard if no trial date has been set.`);
