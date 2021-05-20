import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-1621
class TestCase extends MockableTestCase {
	firstName_1 :string;
	firstName_2 :string;
  createTestSteps(): void {

    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });

    this.addTestStep(`Go to Patient list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.waitForTimeout(6000);//Wait for sort to take effect
    });

    this.addTestStep(`Click on the "PATIENT NAME" column on the dashboard screen`, async () => {
      await this.dashboardPage.clickPatientNameBtn();
      await this.dashboardPage.waitForPatientList();
      this.firstName_1 = await this.dashboardPage.getFirstPatientFromListName();
    });
	
	this.addTestStep(`Click on the "PATIENT NAME" column on the dashboard screen one more time`, async () => {
      await this.dashboardPage.clickPatientNameBtn();
      await this.dashboardPage.waitForPatientList();
      
    });
	
	this.addTestStep(`Verification: Sorting should be on entire patient list (not subset based on stage)`, async () => {
      await this.dashboardPage.clickPatientNameBtn();
      await this.dashboardPage.waitForPatientList();

      await this.dashboardPage.clickPatientNameBtn();
      await this.dashboardPage.waitForPatientList();
     
      this.firstName_2 = await this.dashboardPage.getFirstPatientFromListName();
      expect(this.firstName_1).toBe(this.firstName_2);
    });

    
  }
}

new TestCase('CC-1621', `Sorting should be on entire patient list (not subset based on stage)`);
