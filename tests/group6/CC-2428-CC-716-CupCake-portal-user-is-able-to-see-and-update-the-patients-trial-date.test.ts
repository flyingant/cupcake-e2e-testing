import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2428
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Navigate to 'All SCS patients' list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });
    this.addTestStep(`Verify if patients trial date is shown`, async () => {
      await this.dashboardPage.searchByName(AppConf.getStablePatient('Test007')); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.waitForPatientFullName();
    });

    this.addTestStep(`Select any user and click on 'date' or "SCHEDULE" button in the TRIAL column and set a date`, async () => {
      await this.dashboardPage.clickTrialDateScheduleBtn();
      await this.dashboardPage.waitForDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });

    this.addTestStep(`click on the '"Set Date" button`, async () => {
      await this.dashboardPage.clickSetFromDatePicker();
      await this.dashboardPage.clickScheduleBtnFromWanringPopup();
      await this.dashboardPage.waitForPatientFullName();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
  }
}

new TestCase('CC-716', `CupCake portal user is able to see and update the patients trial date`);
