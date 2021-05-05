import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2595
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

    this.addTestStep(`Click on + Logo placeholder`, async () => {
      await this.settingsPage.clickLogo();
      await this.settingsPage.waitForLogoUploadScreen();
    });
  }

}
new TestCase('CC-241', 'Screen to upload logo is appearing after clicking on clinic logo placeholder');

