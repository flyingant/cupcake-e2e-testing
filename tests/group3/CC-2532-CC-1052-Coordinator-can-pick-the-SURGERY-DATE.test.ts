import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2532
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    const randomString = Math.random().toString(36).substring(7);
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Go to Patient list and select a patient`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.searchByName('Test004'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
    });
    this.addTestStep(`Go to "SURGERY DATE" and click on 'Schedule' button`, async () => {
      await this.patientDetailPage.waitForSurgeryDateLabel();
      await this.patientDetailPage.waitForSurgeryDateScheduleBtn();
      await this.patientDetailPage.clickSurgeryDateScheduleBtn();
      await this.patientDetailPage.waitForSurgeryDateDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`click on 'Schedule'button/existed date`, async () => {
      await this.patientDetailPage.clickSetFromDatePicker();
      await this.patientDetailPage.waitForSurgeryDateLabel();
      await this.patientDetailPage.waitForSurgeryDateScheduleBtn();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    
    this.addTestStep(`Verify that date is picked if coordinator selects the date`, async () => {
      await this.patientDetailPage.clickScheduleBtnFromWanringPopup();
      const value =  await this.patientDetailPage.getValueOfSurgeryDate();
      const regex = new RegExp('^(1[0-2]|0[1-9])/(3[01]|[12][0-9]|0[1-9])/[0-9]{4}$')
      expect(regex.test(value)).toBe(true);
    });
  }
}

new TestCase('CC-1052', `Coordinator can pick the SURGERY DATE`);
