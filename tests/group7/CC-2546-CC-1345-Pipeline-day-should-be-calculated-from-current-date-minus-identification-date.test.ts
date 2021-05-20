import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';
import Utils from '../src/Utils';


// https://teamsolace.atlassian.net/browse/CC-1345
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

    this.addTestStep(`Verify Pipeline day count`, async () => {
      let createdDate = await this.patientDetailPage.getCreatedDate();
      let date =  await this.patientDetailPage.getValueOfSurgeryDate();
      let pipelineday =  await this.patientDetailPage.getValueOfPipelineday();
      let days =  await this.patientDetailPage.CheckIsDate(createdDate,date);
      expect(days).toBe(parseInt(pipelineday));
    });



  }
}

new TestCase('CC-1345', `Pipeline day should be calculated from current date minus identification date`);
