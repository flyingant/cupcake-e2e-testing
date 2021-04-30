import MockableTestCase from "../src/MockableTestCase";
import * as path from 'path';

// https://teamsolace.atlassian.net/browse/CC-208
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake practice page as a clinic admin', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep("Go to Setting on clinic profile page", async () => {
      await this.dashboardPage.clickSettings();
      await this.settingsPage.waitForMe();
    });

    this.addTestStep('Click on "Add clinic name" input field and change a name', async () => {
      await this.settingsPage.setClinicName("name set by CC-208");
      await this.settingsPage.clickSaveButton();
      let clinicName = await this.settingsPage.getClinicName();
      expect(clinicName).toBe("name set by CC-208")
    });

    this.addTestStep('Click on "Add clinic logo" button and change a logo', async () => {
      await this.settingsPage.clickLogo();
      let upload = await this.tab.$(this.settingsPage.css_click_here);
      await upload.setInputFiles(path.resolve(`./tests/test-data/logo.png`));
      await this.settingsPage.clickUpload();
      await this.settingsPage.waitForToast("Logo uploaded successfully");
      await this.settingsPage.waitForMe();
      await this.settingsPage.waitForLogo();
    });

    this.addTestStep('Click on "Add banner" button and change an image', async () => {
      await this.settingsPage.clickBanner();
      let upload = await this.tab.$(this.settingsPage.css_click_here);
      await upload.setInputFiles(path.resolve(`./tests/test-data/banner.jpg`));
      await this.settingsPage.clickUpload();
      await this.settingsPage.waitForToast("Banner uploaded successfully");
      await this.settingsPage.waitForMe();
      await this.settingsPage.waitForBanner();
    });
  }
}

new TestCase('CC-208', 'Verification: Admin user is able to update clinic logo, clinic banner and clinic name');

