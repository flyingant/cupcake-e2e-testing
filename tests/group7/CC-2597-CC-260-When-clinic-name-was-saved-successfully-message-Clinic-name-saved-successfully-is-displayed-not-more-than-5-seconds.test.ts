import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2597
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

    this.addTestStep(`In "Clinic Name" field enter  any data with not more than 60 symbols and press "Enter" button`, async () => {
      const randomString = Math.random().toString(36).substring(7);
      this.clinicName = `Clinic Test Name (e2e) - ${randomString}`;
      await this.settingsPage.setClinicName(this.clinicName);
      await this.settingsPage.clickSaveButton();
    });

    this.addTestStep(`Display the Update the successfully message`, async () => {
      await this.settingsPage.waitForSaveSuccessfullyMessage();
      expect(await this.settingsPage.getClinicName()).toBe(this.clinicName);
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });

    this.addTestStep(`Wait for 5 seconds that the message will be gone`, async () => {
      await this.tab.waitForTimeout(5000); // waiting for Message to be gone
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
      await this.settingsPage.waitForSaveSuccessfullyMessageGone();
    });
  }

}
new TestCase('CC-260', `When clinic name was saved successfully, message Clinic name saved successfully is displayed not more than 5 seconds`);

