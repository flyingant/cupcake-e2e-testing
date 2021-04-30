
import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2393
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Go to Dashboard`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });
    this.addTestStep(`Verify if on Home page is present settings and logout options`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.hoverAvatarIcon();
      await this.dashboardPage.waitForSettingsAndLogoutOption();
    });
  }
}

new TestCase('CC-592', 'Clinic coordinator account should have settings and log out options');