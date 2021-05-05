import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2582
class TestCase extends MockableTestCase {

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });

    this.addTestStep("Go to Setting on clinic profile page", async () => {
      await this.dashboardPage.clickSettings();
      await this.settingsPage.waitForMe();
    });

    this.addTestStep(`Verify if "X' icon is displayed on the top right section of the Settings page`, async () => {
      await this.settingsPage.waitForCloseIcon();
    });

    this.addTestStep(`Click on "X" icon and verify the result`, async () => {
      await this.settingsPage.clickCloseIcon();
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });
  }

}
new TestCase('CC-207', 'User’s name and profile pic placeholder are displayed on the top right section of the Cupcake clinic page');

