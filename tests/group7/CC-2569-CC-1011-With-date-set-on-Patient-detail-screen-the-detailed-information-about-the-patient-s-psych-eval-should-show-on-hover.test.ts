import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2569
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
    this.addTestStep(`Set some data for psych eval section`, async () => {
      await this.patientDetailPage.waitForPsychEvalLabel();
      await this.patientDetailPage.waitForPsychEvalAddBtn();
      await this.patientDetailPage.clickPsychEvalAddBtn();
      await this.patientDetailPage.waitForPsychEvalPopUp();
      await this.patientDetailPage.clickClearEntry(); // clear the previous date
      await this.patientDetailPage.waitForPsychEvalAddBtn();
      await this.patientDetailPage.clickPsychEvalAddBtn();
      await this.patientDetailPage.waitForPsychEvalPopUp();
      await this.patientDetailPage.clickPsychEvalSetDateBtn();
      await this.patientDetailPage.clickSetFromDatePicker();
      const psychEval = await this.patientDetailPage.getValueOfPsychEval();
      expect(psychEval.length > 0).toBe(true);
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`Go to Dashboard and verify if psych eval data is displayed on hover`, async () => {
      await this.patientDetailPage.clickSaveChange();
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.searchByName(AppConf.getStablePatient('Test006')); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.hoverPSYIcon();
      await this.dashboardPage.waitForPSYTooltip();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
  }
}

new TestCase('CC-1011', `With date set on Patient detail screen, the detailed information about the patient’s psych eval should show on hover.`);
