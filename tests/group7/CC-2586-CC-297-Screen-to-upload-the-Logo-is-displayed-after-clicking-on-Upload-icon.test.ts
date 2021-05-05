import MockableTestCase from "../src/MockableTestCase";
import * as path from 'path';
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2586
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

    this.addTestStep(`Verify that 'Upload'' icon on bottom right side is present`, async () => {
      await this.settingsPage.clickLogo();
      await this.settingsPage.waitForLogoUploadScreen();
      await this.settingsPage.waitForLogoUploadIcon();
    });

    this.addTestStep(`Verify that on clicking on 'Upload'' icon device window is display`, async () => {
      await this.settingsPage.setUploadFile(path.resolve(`./tests/test-data/e2e-test-logo.png`));
      await this.settingsPage.clickUpload();
      await this.settingsPage.waitForLogoUploading();
    });
  }

}
new TestCase('CC-297', `Screen to upload the Logo is displayed after clicking on 'Upload'' icon`);

