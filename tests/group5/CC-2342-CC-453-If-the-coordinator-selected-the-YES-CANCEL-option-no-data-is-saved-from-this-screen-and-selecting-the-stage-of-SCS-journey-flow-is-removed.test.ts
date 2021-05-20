import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";

// https://teamsolace.atlassian.net/browse/CC-2342
class TestCase extends MockableTestCase {

  patient: Map<string, string>;

  patientName: string;

  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake portal as a clinic coordinator",
      async () => {
        await this.homePage.start();
        await this.loginPage.setEmailPasswordAndThenSubmit();
      }
    );
    this.addTestStep(`Go to Dashboard Page and Click 'ADD PATIENT' button`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
    });
    
    this.addTestStep(
      "Fill in all required fields with a valid data on Patient Details Page",
      async () => {
        await this.addPatientPage.waitForPatientDetailsPage();
        this.patient = this.addPatientPage.generatePatientData();
        this.patientName =
          this.patient.get("firstName") + " " + this.patient.get("lastName");
        await this.addPatientPage.setPatientDetail(this.patient);
        await this.addPatientPage.clickNextButton();
      }
    );

    this.addTestStep(
      `On 'What stage is the patient at in their SCS journey?" screen click on the "X" button`,
      async () => {
        await this.addPatientPage.waitForSCSJourneyPage();
        await this.addPatientPage.selectStage("Awaiting/Scheduled Trial");
        await this.addPatientPage.clickCloseButton();
        await this.addPatientPage.waitForExitWarningMessage();
      } 
    );

    this.addTestStep(
      `Select “YES, CANCEL“ option and verify the result`,
      async () => {
        await this.addPatientPage.clickYesCancel();
        await this.dashboardPage.waitForMe();
      } 
    );
  }
}

new TestCase(
  "CC-453",
  `If the coordinator selected the “YES, CANCEL“ option, no data is saved from this screen, and selecting the stage of SCS journey flow is removed`
);