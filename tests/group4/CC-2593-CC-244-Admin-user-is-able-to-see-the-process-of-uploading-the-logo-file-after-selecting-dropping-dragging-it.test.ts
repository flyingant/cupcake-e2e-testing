import MockableTestCase from "../src/MockableTestCase";
import * as path from 'path';
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2593
class TestCase extends MockableTestCase {

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake practice page as a clinic admin', async () => {
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

    this.addTestStep(`Verify that on selecting/dropping/dragging logo user can see the process of uploading`, async () => {
      await this.settingsPage.setUploadFile(path.resolve(`./tests/test-data/e2e-test-logo.png`));
      await this.settingsPage.clickUpload();
      await this.settingsPage.waitForLogoUploading();
    });
  }

}
new TestCase('CC-244', `Admin user is able to see the process of uploading the logo file after selecting/dropping/ dragging it`);

