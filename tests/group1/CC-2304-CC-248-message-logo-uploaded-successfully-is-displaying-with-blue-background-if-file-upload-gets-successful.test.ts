import MockableTestCase from "../src/MockableTestCase";
import * as path from 'path';

// https://teamsolace.atlassian.net/browse/CC-248
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake practice page as a clinic admin', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep("Go to Settings on clinic profile page", async () => {
      await this.dashboardPage.clickSettings();
      await this.settingsPage.waitForMe();
    });

    this.addTestStep("Select 'Click here' link and upload a logo", async () => {
      await this.settingsPage.clickLogo();
      let upload = await this.tab.$(this.settingsPage.css_click_here);
      await upload.setInputFiles(path.resolve(`./tests/test-data/logo.png`));
      await this.settingsPage.clickUpload();
    });

    this.addTestStep("Verify that message 'Logo uploaded successfully' is display and background is 'Blue' when upload gets successful", async () => {
      await this.settingsPage.waitForToast("'Logo uploaded successfully'");
      let c = await this.settingsPage.getColorOfToast()
      expect(c).toBe(this.color.buleToastInfo)
    });
  }
}

new TestCase('CC-248', "Verification: Message 'Logo uploaded successfully' is displaying with 'Blue' background if file upload gets successful");

