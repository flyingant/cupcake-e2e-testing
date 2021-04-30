import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2579
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
    this.addTestStep(`Go to 'SURGEON' section click on the "ADD" button or on the 'existing physician name`, async () => {
      await this.patientDetailPage.waitForSurgeonLabel();
      await this.patientDetailPage.waitForSurgeonAddBtn();
    });
    this.addTestStep(`Verify that the suggested names of the 'SURGEON' are displayed after entering 1 character on search field`, async () => {
      await this.patientDetailPage.clickSurgeonAddBtn();  
      await this.patientDetailPage.waitForSurgeonListPopUp(); 
      await this.patientDetailPage.fillSurgeonPopUpInput('D');
      await this.patientDetailPage.waitForSurgeonList();
    });
  }
}

new TestCase('CC-1550', 'The coordinator is gotten suggestions of SURGEON name after entering 1 character on the popup search field');

