import MockableTestCase from "../src/MockableTestCase";
import * as path from 'path';
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2613
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

    this.addTestStep(`Verify that after choosing logo file clinic logo is updated`, async () => {
      await this.settingsPage.setUploadFile(path.resolve(`./tests/test-data/e2e-test-logo.png`));
      await this.settingsPage.clickUpload();
      await this.settingsPage.waitForToast("Logo uploaded successfully");
    });
  }

}
new TestCase('CC-240', 'User is able to select Logo from the computer');

