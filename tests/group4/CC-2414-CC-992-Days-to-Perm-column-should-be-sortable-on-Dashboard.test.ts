import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-992



class TestCase extends MockableTestCase {
	perm_1 :string;
	perm_2 :string;
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
      await this.dashboardPage.clickPermBtn();
      await this.dashboardPage.waitForPatientList();
      this.perm_1 = await this.dashboardPage.getFirstPerm();
    });
	
	this.addTestStep(`Click on the "PATIENT NAME" column on the dashboard screen one more time`, async () => {
      await this.dashboardPage.clickPermBtn();
      await this.dashboardPage.waitForPatientList();
      
    });
	
	this.addTestStep(`Verification: Sorting should be on entire patient list (not subset based on stage)`, async () => {
      await this.dashboardPage.clickPermBtn();
      await this.dashboardPage.waitForPatientList();

      await this.dashboardPage.clickPermBtn();
      await this.dashboardPage.waitForPatientList();
     
      this.perm_2 = await this.dashboardPage.getFirstPerm();
      expect(this.perm_1).toBe(this.perm_2);
    });

    
  }
}

new TestCase('CC-992', `Days to Perm column should be sortable on Dashboard`);
