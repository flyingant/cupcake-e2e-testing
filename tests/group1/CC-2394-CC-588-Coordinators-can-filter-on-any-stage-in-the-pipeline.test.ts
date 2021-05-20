import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2394
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Go to Patient list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPipeline();
    });
    this.addTestStep(`Click on any value in pipeline and verify if data was filtered`, async () => {
      await this.dashboardPage.searchByStage('Candidates');
      await this.tab.waitForTimeout(1000)
      await this.dashboardPage.waitForPatientList();
    });
    this.addTestStep(`Click on any value in pipeline and verify if data was filtered`, async () => {
      await this.dashboardPage.searchByStage('Implanted');
      await this.tab.waitForTimeout(1000)
      await this.dashboardPage.waitForPatientList();
    });
    this.addTestStep(`Click on any value in pipeline and verify if data was filtered`, async () => {
      await this.dashboardPage.searchByStage('In Trial');
      await this.tab.waitForTimeout(1000)
      await this.dashboardPage.waitForPatientList();
    });
  }
}

new TestCase('CC-588', `Coordinators can filter on any stage in the pipeline`);
