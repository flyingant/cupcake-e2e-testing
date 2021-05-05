
import MockableTestCase from "../src/MockableTestCase";
import * as path from 'path';
// https://teamsolace.atlassian.net/browse/CC-316
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });
    this.addTestStep("Go to Setting on clinic profile page", async () => {
      await this.dashboardPage.clickSettings();
      await this.settingsPage.waitForMe();
    });
    this.addTestStep("upload a banner", async () => {
      await this.settingsPage.clickBanner();
      let upload = await this.tab.$(this.settingsPage.css_click_here);
      await upload.setInputFiles(path.resolve(`./tests/test-data/banner.jpg`));
     // await this.settingsPage.tab.setInputFiles("#myInput","D:/banner.jpg");
      await this.settingsPage.clickUpload();
      await this.settingsPage.waitForToast("Banner uploaded successfully");
    });
  }
}
new TestCase('CC-311', 'Verification: Coordinator is able to access the clinic profile page and upload clinic banner.');

