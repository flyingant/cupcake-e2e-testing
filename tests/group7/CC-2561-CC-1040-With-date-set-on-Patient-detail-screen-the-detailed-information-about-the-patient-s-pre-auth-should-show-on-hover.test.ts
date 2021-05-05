import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2561
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
      await this.dashboardPage.searchByName(AppConf.getStablePatient('Test006')); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
    });
    this.addTestStep(`Set some data for pre-auth section`, async () => {
      await this.patientDetailPage.waitForPreAuthLabel();
      await this.patientDetailPage.waitForPreAuthAddBtn();
      await this.patientDetailPage.clickPreAuthAddBtn();
      await this.patientDetailPage.waitForPreAuthPopUp();
      await this.patientDetailPage.clickClearEntry(); // clear the previous date
      await this.patientDetailPage.waitForPreAuthAddBtn();
      await this.patientDetailPage.clickPreAuthAddBtn();
      await this.patientDetailPage.waitForPreAuthPopUp();
      await this.patientDetailPage.clickPreAuthSetDateBtn();
      await this.patientDetailPage.clickSetFromDatePicker();
      const value = await this.patientDetailPage.getValueOfPreAuth();
      expect(value.length > 0).toBe(true);
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`Go to Dashboard and verify if pre-auth data is displayed on hover`, async () => {
      await this.patientDetailPage.clickSaveChange();
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.searchByName(AppConf.getStablePatient('Test006')); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.hoverAUTHIcon();
      await this.dashboardPage.waitForAUTHTooltip();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
  }
}

new TestCase('CC-1040', `With date set on Patient detail screen, the detailed information about the patient’s pre-auth should show on hover`);
