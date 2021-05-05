
import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2542
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
    this.addTestStep(`Click on 'Add' button on education section`, async () => {
      await this.patientDetailPage.waitForEducationLabel();
      await this.patientDetailPage.waitForEducationAddBtn();
      await this.patientDetailPage.clickEducationAddBtn();
      await this.patientDetailPage.clickEducationSetDateBtn();
      await this.patientDetailPage.waitForEducationDatePicker();
    });
    this.addTestStep(`Select any of date and click on 'Add' button`, async () => {
      await this.patientDetailPage.clickSetFromDatePicker();
      const education = await this.patientDetailPage.getValueOfEducation();
      const regex = new RegExp('^(1[0-2]|0[1-9])/(3[01]|[12][0-9]|0[1-9])/[0-9]{4}$')
      expect(regex.test(education)).toBe(true);
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
  }
}

new TestCase('CC-1018', `CupCake portal user is able to see and update the education info on Patient detail screen`);