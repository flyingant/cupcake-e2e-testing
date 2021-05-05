
import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2551
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
    this.addTestStep(`Go to Implant date section and click on 'Schedule' button' `, async () => {
      await this.patientDetailPage.waitForImplantConsultLabel();
      await this.patientDetailPage.waitForImplantConsultScheduleBtn();
    });
    this.addTestStep(`Verify that 2 months shown on date picker`, async () => {
      await this.patientDetailPage.clickImplantConsultScheduleBtn();
      await this.patientDetailPage.waitForImplantConsultDatePicker();
    });
  }
}

new TestCase('CC-1051', '2 months out date picker is shown');