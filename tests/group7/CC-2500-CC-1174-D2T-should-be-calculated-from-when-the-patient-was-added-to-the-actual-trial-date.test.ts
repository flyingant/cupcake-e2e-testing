import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';
import Utils from '../src/Utils';


// https://teamsolace.atlassian.net/browse/CC-1174
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

    this.addTestStep(`Click 'Schedule' button under trial date option and set a trial date`, async () => {
      await this.patientDetailPage.waitForTrailDateLabel();
      await this.patientDetailPage.waitForTrailDateScheduleBtn();
      await this.patientDetailPage.clickTrailDateScheduleBtn();
      await this.patientDetailPage.waitForTrailDateDatePicker();
      await this.patientDetailPage.clickSetFromDatePicker();
      await this.patientDetailPage.waitForScheduleBtnFromWanringPopup();
      await this.patientDetailPage.waitForCancelBtnFromWanringPopup();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });

    this.addTestStep(`Click on the "SAVE" button,Enter the patient details page again`, async () => {
      await this.patientDetailPage.clickScheduleBtnFromWanringPopup();
      await this.patientDetailPage.clickSaveChange();
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.searchByName('Test008'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
      
    });

    this.addTestStep(`Verify if D2T is calculated from when the “date the patient was added” to the 'actual trial date”`, async () => {
      let createdDate = await this.patientDetailPage.getCreatedDate();
      let date =  await this.patientDetailPage.getValueOfTrailDate();
      let d2t =  await this.patientDetailPage.getValueOfD2T();
      let days =  await this.patientDetailPage.CheckIsDate(createdDate,date);
      expect(days).toBe(parseInt(d2t));
    });
      //Repeat the steps to verify no trial date
    this.addTestStep(`Click 'Schedule' button under trial date option and set clear`, async () => {
      await this.patientDetailPage.waitForTrailDateLabel();
      await this.patientDetailPage.waitForTrailDateScheduleBtn();
      await this.patientDetailPage.clickTrailDateScheduleBtn();
      await this.patientDetailPage.waitForTrailDateDatePicker();
      await this.patientDetailPage.clickClearFromDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });

    this.addTestStep(`Click on the "SAVE" button,Enter the patient details page again`, async () => {
      await this.patientDetailPage.clickSaveChange();
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.searchByName('Test008'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
    });

    this.addTestStep(`Verify if D2T is calculated from when the “date the patient was added” to the 'actual trial date”`, async () => {
      let createdDate = await this.patientDetailPage.getCreatedDate();
      let date =  await this.patientDetailPage.getValueOfTrailDate();
      let d2t =  await this.patientDetailPage.getValueOfD2T();
      let days =  await this.patientDetailPage.CheckIsDate(createdDate,date);
      expect(days).toBe(parseInt(d2t));
    });
	
  }
}

new TestCase('CC-1174', `For patients added using CupCake, D2T should be calculated from when the “date the patient was added” to the 'actual trial date”`);
