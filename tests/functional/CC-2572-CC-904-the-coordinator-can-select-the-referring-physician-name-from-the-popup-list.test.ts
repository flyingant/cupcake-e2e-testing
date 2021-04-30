
import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2572
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
      await this.patientDetailPage.waitForReferringPhysicianLabel();  
      await this.patientDetailPage.waitForReferringPhysicianAddBtn(); 
    });
    this.addTestStep(`Go to 'REFERRING PHYSICIAN' section click on the "ADD" button or on the 'existing physician name' and select physician name from popup list`, async () => {      
      await this.patientDetailPage.clickReferringPhysicianAddBtn();
      await this.patientDetailPage.fillReferringPhysicianPopUpInput('D');
      await this.patientDetailPage.waitForReferringPhysicianList();
    });
  }
}

new TestCase('CC-904', 'The coordinator can select the referring physician name from the popup list');