import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2366
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    const randomString = Math.random().toString(36).substring(7);
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Go to Patient list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });
    this.addTestStep(`Select any patient and go to patient details page`, async () => {
      await this.dashboardPage.searchByName('Test007'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
    });
    this.addTestStep(`try to enter in zip code field any 9 digits `, async () => {
      await this.patientDetailPage.waitForZipLabel();
      await this.patientDetailPage.clickZipAddBtn();
      await this.patientDetailPage.waitForZipInput();
      await this.patientDetailPage.fillZip('123456789');
      await this.patientDetailPage.clickZiplabel();
      await this.patientDetailPage.waitForZipInputErrorMessage();
    });
    this.addTestStep(`try to enter in zip code field any 5 digits `, async () => {
      await this.patientDetailPage.waitForZipLabel();
      await this.patientDetailPage.waitForZipInput();
      await this.patientDetailPage.fillZip('12345');
      await this.patientDetailPage.clickZiplabel();
    });
    this.addTestStep(`try to enter 00000`, async () => {
      await this.patientDetailPage.waitForZipLabel();
      await this.patientDetailPage.waitForZipInput();
      await this.patientDetailPage.fillZip('00000');
      await this.patientDetailPage.clickZiplabel();
      await this.patientDetailPage.waitForZipInputErrorMessage();
    });
  }
}

new TestCase('CC-888', `Only US zip code on Patients Details can be entered and only 9 digits and 5 digits are accepted`);
