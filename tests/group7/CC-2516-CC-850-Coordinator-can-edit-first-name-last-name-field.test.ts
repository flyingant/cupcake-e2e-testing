import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-850
class TestCase extends MockableTestCase {

  createTestSteps(): void {

    this.addTestStep('Login to Cupcake practice page as a clinic coordinator and Go to Patient list', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });

    this.addTestStep(`Click on 'Add patient' button`, async () => {
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
    });

    this.addTestStep(`Enter first and last name`, async () => {
      await this.addPatientPage.setFirstName("Test030");
      await this.addPatientPage.setLastName("Test033");
    });

    this.addTestStep(`Verify that after editing first or last name fields changes are saved`, async () => {
      expect(await this.addPatientPage.getFirstName()).toBe("Test030");
      expect(await this.addPatientPage.getLastName()).toBe("Test033");
    });

  }
}

new TestCase('CC-850', `Coordinator can edit first name, last name field`);
