import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2615
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
    })
  }

}
new TestCase('CC-268', 'Message Clinic name saved successfully is displayed if a clinic name is saved successfully');

