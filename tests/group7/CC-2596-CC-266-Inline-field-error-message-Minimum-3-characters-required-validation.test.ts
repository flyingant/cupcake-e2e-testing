import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2596
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

    this.addTestStep(`In "Clinic Name" field try to enter text with less than 3 symbols and hit "ENTER" key and verify the error message`, async () => {
      await this.settingsPage.setClinicName('te');
      await this.settingsPage.waitForValidationError();
    });
  }

}
new TestCase('CC-266', 'Inline field error message Minimum 3 characters required validation');

