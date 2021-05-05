import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2440
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
    this.addTestStep(`Find any users record which doesn't have setted implant date and verify if "SCHEDULE "button is displayed`, async () => {
      await this.dashboardPage.waitForPatient();
      await this.dashboardPage.waitForImplantDateScheduleBtn();
    });
  }
}

new TestCase('CC-545', `Dashboard: Schedule button is displayed if no implant date has been set.`);
