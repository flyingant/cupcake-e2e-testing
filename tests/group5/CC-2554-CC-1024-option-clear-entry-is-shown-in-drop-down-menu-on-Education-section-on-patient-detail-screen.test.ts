
import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2554
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
    this.addTestStep(`Navigate to Education section, verify if drop down menu is available on click`, async () => {      
      await this.patientDetailPage.waitForEducationLabel();
      await this.patientDetailPage.waitForEducationAddBtn();
      await this.patientDetailPage.clickEducationAddBtn();
      await this.patientDetailPage.waitForEducationPopUp();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`Click on icon and verify the option in drop down`, async () => {      
      await this.patientDetailPage.clickClearEntry();
      await this.patientDetailPage.waitForMe();
    });
  }
}

new TestCase('CC-1024', `Option 'Clear Entry' is shown in drop down menu on Education section on Patient detail screen`);