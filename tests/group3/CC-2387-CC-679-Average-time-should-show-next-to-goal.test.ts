import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2387
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep(`Login to Cupcake portal as a clinic coordinator and Navigate to 'All SCS patients' list`, async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Verify if average time to implant from trial is displayed  for all patients.`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.waitForPatient();
      await this.dashboardPage.waitForAverageTimeToImplant();
      await this.dashboardPage.waitForAverageTimeToPERM();
    });
  }
}

new TestCase('CC-679', `Average time should show next to goal`);
