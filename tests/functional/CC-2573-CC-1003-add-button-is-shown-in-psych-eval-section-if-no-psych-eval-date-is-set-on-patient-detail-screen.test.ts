import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

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
    this.addTestStep(`Verify if 'Add' button is present in Psych Eval section ,  if no psych eval date is set`, async () => {
      await this.patientDetailPage.waitForPsychEvalLabel();
      await this.patientDetailPage.waitForPsychEvalAddBtn();
    });
    this.addTestStep(`Click on 'Add' button`, async () => {
      await this.patientDetailPage.clickPsychEvalAddBtn();
      await this.patientDetailPage.waitForPsychEvalPopUp();
    });
  }
}

new TestCase('CC-1003', `'Add' button is shown in Psych Eval section, if no psych eval date is set on Patient detail screen`);
