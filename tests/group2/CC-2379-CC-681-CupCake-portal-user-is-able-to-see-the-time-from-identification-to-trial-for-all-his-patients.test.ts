import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2379
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Navigate to 'All SCS patients' list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.searchByName(AppConf.getStablePatient('Test005')); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.waitForPatientFullName();
    });
    this.addTestStep(`Verify if user is able to see the time from IDENTIFIED to TRIAL for all his patients in the D2T column`, async () => {
      await this.dashboardPage.waitForPatientD2T();
      const value = await this.dashboardPage.getValueOfSelectedPatientD2T();
      expect(value.length > 0).toBe(true);
    });
  }
}

new TestCase('CC-681', `CupCake portal user is able to see the time from identification to trial for all his patients`);
