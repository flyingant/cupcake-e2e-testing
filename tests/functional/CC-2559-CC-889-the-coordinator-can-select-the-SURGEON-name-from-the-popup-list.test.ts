
import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2559
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
      await this.patientDetailPage.waitForSurgeonLabel();
      await this.patientDetailPage.waitForSurgeonAddBtn();
      await this.patientDetailPage.clickSurgeonAddBtn();  
      await this.patientDetailPage.waitForSurgeonListPopUp(); 
      await this.patientDetailPage.fillSurgeonPopUpInput('D');
      await this.patientDetailPage.waitForSurgeonList();
    });
    this.addTestStep(`Go to 'SURGEON' section click on the "ADD" button and select physician name from popup list (CLINIC and EXTERNAL
      PHYSICIANS)`, async () => {
      await this.patientDetailPage.clickFirstItemFromSurgeonList();
      const value = await this.patientDetailPage.getValueOfSurgeon();
      await expect(value.length > 0).toBe(true);
    });
  }
}

new TestCase('CC-889', 'The coordinator can select the SURGEON name from the popup list');