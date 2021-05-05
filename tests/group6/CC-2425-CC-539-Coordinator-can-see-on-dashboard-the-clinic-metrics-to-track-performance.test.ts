import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2425
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Verify if clinic metrics are displayed`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForClinicMetrics();
      await this.dashboardPage.waitForPatientFullName();
    });
  }
}

new TestCase('CC-539', `Coordinator can see on dashboard the clinic metrics to track performance`);
