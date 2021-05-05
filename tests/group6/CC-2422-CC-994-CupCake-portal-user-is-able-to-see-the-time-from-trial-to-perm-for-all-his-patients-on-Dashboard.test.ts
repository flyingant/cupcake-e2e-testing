import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2422
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Verify if user is able to see the time from TRIAL to PERM for all his patients in the D2P column`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.searchByName(AppConf.getStablePatient('Test006'));
      await this.dashboardPage.waitForPatientD2P();
    });
  }
}

new TestCase('CC-994', `CupCake portal user is able to see the time from trial to perm for all his patients on Dashboard`);
