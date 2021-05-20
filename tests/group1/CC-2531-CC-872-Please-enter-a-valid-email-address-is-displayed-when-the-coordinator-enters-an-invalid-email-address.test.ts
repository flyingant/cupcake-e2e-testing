import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2531
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Go to search field input the existed patient and click enter `, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.searchByName('Test007'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
    });
    this.addTestStep(`Enter the invalid email address`, async () => {
      await this.patientDetailPage.waitForEmailLabel();
      await this.patientDetailPage.clickEmailAddBtn();
      await this.patientDetailPage.waitForEmailInput();
      await this.patientDetailPage.fillEmail('ddddd@');
      await this.patientDetailPage.clickEmaillabel();
      await this.patientDetailPage.waitForEmailInputErrorMessage();
    });
  }
}

new TestCase('CC-872', `'Please enter a valid email address' is displayed when the coordinator enters an invalid email address`);
