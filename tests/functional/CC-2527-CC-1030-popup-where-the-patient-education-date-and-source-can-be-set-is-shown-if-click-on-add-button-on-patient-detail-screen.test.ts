import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2527
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
    this.addTestStep(`Click on 'Add' button on Education section and verify the popup`, async () => {
      await this.patientDetailPage.clickEducationAddBtn()
      await this.patientDetailPage.waitForEducationPopUp()
    });
    this.addTestStep(`Click on 'Schedule' icon and verify that popup where user can set date is displayed`, async () => {
      await this.patientDetailPage.clickEducationSetDateBtn();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`Click 'Cancel' on Schedule popup`, async () => {
      await this.patientDetailPage.clickEducationClearBtn();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`Click on 'Add' button on Education section again and select 'BSC Rep' or 'Office' option`, async () => {
      await this.patientDetailPage.clickEducationAddBtn();
      await this.patientDetailPage.waitForEducationPopUp()
      await this.patientDetailPage.clickEducationBSCRepBtn();
      const education = await this.patientDetailPage.getValueOfEducation();
      expect(education.length > 0).toBe(true);
    });
  }
}

new TestCase('CC-1030', `Popup where the patient education date and source can be set is shown if click on 'Add' button on Patient detail screen`);
