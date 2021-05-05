
import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2556
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
    this.addTestStep(`Verify if Schedule date in Education section, is displayed as a blue calendar`, async () => {      
      await this.patientDetailPage.clickEducationSetDateBtn();
      await this.patientDetailPage.clickSetFromDatePicker();
      await this.patientDetailPage.waitForEducationCalendarIcon();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
  }
}

new TestCase('CC-1020', `Schedule date on Education section is displayed as a blue calendar on Patient detail screen`);