import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2536
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Go to Patient list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });
    this.addTestStep(`Select any patient and open Patient details page`, async () => {
      await this.dashboardPage.searchByName('Test008'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
    });
    this.addTestStep(`Click on 'Schedule' icon and verify that calendar where user can set date is displayed`, async () => {
      await this.patientDetailPage.waitForPreAuthLabel();
      await this.patientDetailPage.waitForPreAuthAddBtn()
      await this.patientDetailPage.clickPreAuthAddBtn();
      await this.patientDetailPage.waitForPreAuthPopUp();
    });
    this.addTestStep(`Set the pre-auth date for the patient. Click on 'Schedule' button`, async () => {
      await this.patientDetailPage.clickPreAuthSetDateBtn();
      await this.patientDetailPage.clickSetFromDatePicker();
      const pre_auth = await this.patientDetailPage.getValueOfPreAuth();
      expect(pre_auth.length > 0).toBe(true);
    });
  }
}

new TestCase('CC-1041', `Popup where the patient pre-auth date can be set is shown if click on 'Add' button on Patient detail screen`);
