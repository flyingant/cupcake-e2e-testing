import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";

// https://teamsolace.atlassian.net/browse/CC-2362
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
      "Fill in all required fields with a valid data on SCS Journey Page",
      async () => {
        await this.addPatientPage.waitForSCSJourneyPage();
        await this.addPatientPage.selectStage("Awaiting/Scheduled Trial");
        await this.addPatientPage.clickNextButton();
      }
    );

    this.addTestStep(
      "Fill in all required fields with a valid data on Trail Date Page",
      async () => {
        await this.addPatientPage.waitForTrialDatePage();
        await this.addPatientPage.clickDoNotSetTrialDate();
        await this.addPatientPage.selectPhysician({ index: 0 });
      }
    );

    this.addTestStep(`Click on the "X" close button on patient’s referring page`, async () => {
      await this.addPatientPage.clickCloseButton();
      await this.addPatientPage.waitForExitWarningMessage();
    });
  }
}

new TestCase(
  "CC-380",
  `Message that the data will be lost is shown when coordinator closes the Patient SCS trial date screen`
);