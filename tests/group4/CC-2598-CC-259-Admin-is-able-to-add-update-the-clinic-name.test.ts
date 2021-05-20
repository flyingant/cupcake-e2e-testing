import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2598
class TestCase extends MockableTestCase {
  clinicName: string

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

    this.addTestStep(`In "Clinic Name" field try to enter text with more than 60 symbols and hit "ENTER" key`, async () => {
      let clinicName = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1";
      await this.settingsPage.setClinicName(clinicName);
      await this.loginPage.tab.keyboard.press("Enter");
    });

    this.addTestStep(`In "Clinic Name" field enter text with 60 symbols`, async () => {
      let clinicName = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      await this.settingsPage.setClinicName(clinicName);
      await this.settingsPage.clickSaveButton();
      expect(await this.settingsPage.getClinicName()).toBe(clinicName);
    });

    this.addTestStep(`Select "Update the clinic name" and try to enter text with 2 symbols`, async () => {
      let clinicName = "aa";
      await this.settingsPage.setClinicName(clinicName);
      await this.loginPage.tab.keyboard.press("Enter");
      await this.settingsPage.waitForToast("Min 3 characters are required")
    });
  }

}
new TestCase('CC-259', `Admin is able to add/update the clinic name.`);

