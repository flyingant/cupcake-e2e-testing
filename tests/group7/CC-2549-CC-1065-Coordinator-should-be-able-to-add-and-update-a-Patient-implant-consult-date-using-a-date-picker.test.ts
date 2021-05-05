
import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2549
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
    this.addTestStep(`Click on "Add button"`, async () => {
      await this.patientDetailPage.waitForImplantConsultLabel();
      await this.patientDetailPage.waitForImplantConsultScheduleBtn();
      await this.patientDetailPage.clickImplantConsultScheduleBtn();
      await this.patientDetailPage.waitForImplantConsultDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`Set a date`, async () => {
      await this.patientDetailPage.clickSetFromDatePicker();
      const value = await this.patientDetailPage.getValueOfImplantConsult();
      const regex = new RegExp('^(1[0-2]|0[1-9])/(3[01]|[12][0-9]|0[1-9])/[0-9]{4}$')
      expect(regex.test(value)).toBe(true);
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`Verify if Coordinator can cancel out the of the picker by clicking 'Cancel' button`, async () => {
      await this.patientDetailPage.waitForImplantConsultLabel();
      await this.patientDetailPage.waitForImplantConsultScheduleBtn();
      await this.patientDetailPage.clickImplantConsultScheduleBtn();
      await this.patientDetailPage.waitForImplantConsultDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`If date already added click on this field and try to update the date`, async () => {
      await this.patientDetailPage.clickClearFromDatePicker();
      await this.patientDetailPage.waitForImplantConsultLabel();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
  }
}

new TestCase('CC-1065', `Coordinator should be able to add and update a Patient implant consult date using a date picker`);