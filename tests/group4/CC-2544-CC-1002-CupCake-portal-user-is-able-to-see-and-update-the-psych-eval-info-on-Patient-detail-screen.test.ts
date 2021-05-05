import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2544
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
    this.addTestStep(`Verify if the psych eval column is shown and there is possibility to update data`, async () => {
      await this.patientDetailPage.waitForPsychEvalLabel();
      await this.patientDetailPage.waitForPsychEvalAddBtn();
      await this.patientDetailPage.clickPsychEvalAddBtn();
      await this.patientDetailPage.waitForPsychEvalPopUp();
      await this.patientDetailPage.clickPsychEvalSetDateBtn();
      await this.patientDetailPage.clickSetFromDatePicker();
      const psychEval = await this.patientDetailPage.getValueOfPsychEval();
      expect(psychEval.length > 0).toBe(true);
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
  }
}

new TestCase('CC-1002', `CupCake portal user is able to see and update the psych eval info on Patient detail screen`);
