import MockableTestCase from "../src/MockableTestCase";
import * as path from 'path';

// https://teamsolace.atlassian.net/browse/CC-296
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep("Go to Settings on clinic profile page", async () => {
      await this.dashboardPage.clickSettings();
      await this.settingsPage.waitForMe();
    });

    this.addTestStep("Click on 'Edit' icon and select another logo", async () => {
      await this.settingsPage.clickLogo();
      let upload = await this.tab.$(this.settingsPage.css_click_here);
      await upload.setInputFiles(path.resolve(`./tests/test-data/logo.png`));
      await this.settingsPage.clickUpload();
      await this.settingsPage.waitForToast("Logo uploaded successfully");
    });

    this.addTestStep("Verify that on updating Logo, new Logo is present on Settings page", async () => {
      await this.settingsPage.waitForMe();
      await this.settingsPage.waitForLogo();
    });
  }
}

new TestCase('CC-296', 'Verification: User is able to edit Logo');
