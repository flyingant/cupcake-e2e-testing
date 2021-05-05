import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";

// https://teamsolace.atlassian.net/browse/CC-2333
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake portal as a clinic coordinator",
      async () => {
        await this.homePage.start();
        await this.loginPage.fillEmailAndPasswordWithoutDelay(
          AppConf.getStableAccountUsername(),
          AppConf.getStableAccountPassword()
        );
      }
    );
    this.addTestStep(`Go to Patient list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });
    this.addTestStep(
      `Click 'ADD PATIENT' button and Verify if Gender field is empty and not selected by default`,
      async () => {
        await this.dashboardPage.clickAddPatientButton();
        await this.addPatientPage.waitForMe();
        const gender = await this.addPatientPage.getGender();
        expect(gender).toBe(undefined);
      }
    );
  }
}

new TestCase(
  "CC-345",
  "None of the options in Gender should be selected by default"
);