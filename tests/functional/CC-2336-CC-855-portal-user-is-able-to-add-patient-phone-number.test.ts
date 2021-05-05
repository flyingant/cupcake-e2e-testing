import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";

// https://teamsolace.atlassian.net/browse/CC-2336
class TestCase extends MockableTestCase {
  patient: Map<string, string>;

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
      `Click 'ADD PATIENT' button and In Phone filed enter any valid number`,
      async () => {
        await this.dashboardPage.clickAddPatientButton();
        await this.addPatientPage.waitForMe();
        this.patient = this.addPatientPage.generatePatientData();
        await this.addPatientPage.setPatientDetail(this.patient);
      }
    );
    this.addTestStep("click next button go to next step", async () => {
      await this.addPatientPage.clickNextButton();
    });
  }
}

new TestCase("CC-855", "portal user is able to add patient phone number");
