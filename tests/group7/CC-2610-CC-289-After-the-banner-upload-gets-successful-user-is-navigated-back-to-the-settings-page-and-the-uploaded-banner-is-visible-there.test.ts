import MockableTestCase from "../src/MockableTestCase";
import * as path from 'path';
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2610
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

    this.addTestStep(`Click on + Banner placeholder`, async () => {
      await this.settingsPage.clickBanner();
      await this.settingsPage.waitForBannerUploadScreen();
    });

    this.addTestStep(`Verify that after choosing banner file clinic logo is updated`, async () => {
      await this.settingsPage.setUploadFile(path.resolve(`./tests/test-data/e2e-test-banner.png`));
      await this.settingsPage.clickUpload();
      await this.settingsPage.waitForToast("Banner uploaded successfully");
    });

    this.addTestStep(`Check the settings page and the uploaded banner is visible`, async () => {
      await this.settingsPage.waitForBanner();
    });
  }

}
new TestCase('CC-289', 'After the banner upload gets successful, user is navigated back to the settings page and the uploaded banner is visible there');

