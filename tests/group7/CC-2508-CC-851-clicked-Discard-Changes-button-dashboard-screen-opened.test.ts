import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-851
class TestCase extends MockableTestCase {
  
  createTestSteps(): void {
    
    this.addTestStep('Login to Cupcake practice page as a clinic coordinator', async () => {
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

    this.addTestStep(`Enter first name, last name and click on 'Close' button`, async () => {
      await this.patientDetailPage.clickAndUpdatePatientName('Test851 Test851');
      await this.patientDetailPage.clickHeaderX();
      await this.patientDetailPage.waitForToast("You have changed or entered information on this page")
    });

    this.addTestStep(`Verify that clicking on 'Discard Changes' button, dashboard screen is displayed`, async () => {
      await this.patientDetailPage.clickDiscardChanges();
      await this.dashboardPage.waitForMe();
    });
  }
}

new TestCase('CC-851', `Once coordinator clicked on 'Discard Changes' button, dashboard screen is opened`);
