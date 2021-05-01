import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";

// https://teamsolace.atlassian.net/browse/CC-2332
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
      "choose the physician from the drop-down list and Verify Don't set a trial date checkbox",
      async () => {
        await this.addPatientPage.clickDoNotSetTrialDate();
        await this.addPatientPage.selectPhysician({ index: 0 });
        await this.addPatientPage.clickNextButton();

        await this.addPatientPage.waitForSummaryPage();
        await this.addPatientPage.clickAddPatientButton();
        await this.dashboardPage.waitForMe();
      }
    );
    this.addTestStep("Patient created successfully", async () => {
      await this.dashboardPage.searchByName(this.patientName);
      await this.dashboardPage.hoverPatientName();
      await this.dashboardPage.clickViewDetails();
      await this.patientDetailPage.waitForMe();
      // meaning the patient created successfully
      expect(await this.patientDetailPage.getPatientName()).toBe(
        this.patientName
      );
    });
  }
}

new TestCase(
  "CC-356",
  `The trial date field is optional and can be skipped by clicking on the "Don't set a trial date" checkbox`
);
