import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";

// https://teamsolace.atlassian.net/browse/CC-2337
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
    this.addTestStep(`Click 'ADD PATIENT' button`, async () => {
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
    });
    this.addTestStep(
      "Fill in all required fields on every step and Navigate to Summary page",
      async () => {
        this.patient = this.addPatientPage.generatePatientData();
        await this.addPatientPage.setPatientDetail(this.patient);
        await this.addPatientPage.clickNextButton();

        await this.addPatientPage.selectStage("Awaiting/Scheduled Trial");
        await this.addPatientPage.clickNextButton();

        await this.addPatientPage.clickDoNotSetTrialDate();
        await this.addPatientPage.selectPhysician({ index: 0 });
        await this.addPatientPage.clickNextButton();
        await this.addPatientPage.waitForSummaryPage();
      }
    );
    this.addTestStep("click on 'X'", async () => {
      await this.addPatientPage.clickCloseButton();
      await this.tab.waitForSelector("text='Yes, cancel'");
    });
    this.addTestStep(
      "Click 'Yes, cancel' and back to dashboard page",
      async () => {
        await this.addPatientPage.clickYesCancel();
        await this.dashboardPage.waitForMe();
      }
    );
  }
}

new TestCase(
  "CC-385",
  "Coordinator can close the Summary screen at any time by hitting the 'X' and go back to the dashboard"
);
