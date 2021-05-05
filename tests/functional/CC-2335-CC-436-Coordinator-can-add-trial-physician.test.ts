import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";

// https://teamsolace.atlassian.net/browse/CC-2335
class TestCase extends MockableTestCase {
  patient: Map<string, string>;
  patientName: string;

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
      "Fill in all required fields with a valid data and Navigate to SCS trial date screen",
      async () => {
        this.patient = this.addPatientPage.generatePatientData();
        this.patientName =
          this.patient.get("firstName") + " " + this.patient.get("lastName");
        await this.addPatientPage.setPatientDetail(this.patient);
        await this.addPatientPage.clickNextButton();

        await this.addPatientPage.selectStage("Awaiting/Scheduled Trial");
        await this.addPatientPage.clickNextButton();
      }
    );
    this.addTestStep(
      "Select 'Don't set a trial date now' and select the physician from the drop-down list",
      async () => {
        await this.addPatientPage.clickDoNotSetTrialDate();
        await this.addPatientPage.selectPhysician({ index: 0 });
        await this.addPatientPage.clickNextButton();
        await this.addPatientPage.waitForSummaryPage();
      }
    );
  }
}

new TestCase("CC-436", "Coordinator can add trial physician");
