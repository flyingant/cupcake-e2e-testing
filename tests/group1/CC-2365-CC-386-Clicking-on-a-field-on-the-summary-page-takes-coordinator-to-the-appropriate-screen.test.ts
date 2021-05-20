import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-2365
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

    this.addTestStep('Click on the "ADD PATIENT" button', async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
    });

    this.addTestStep(
      "Fill in all required fields on every page and Navigate to Summary page",
      async () => {
        this.patient = this.addPatientPage.generatePatientData();
        this.patientName =
          this.patient.get("firstName") + " " + this.patient.get("lastName");

        await this.addPatientPage.setPatientDetail(this.patient);
        await this.addPatientPage.clickNextButton();

        await this.addPatientPage.selectStage("In Trial");
        await this.addPatientPage.clickNextButton();

        await this.addPatientPage.selectPhysician({
          index: 0,
        });

        await this.addPatientPage.clickNextButton();
        await this.addPatientPage.waitForSummaryPage();
      }
    );

    this.addTestStep(
      "Navigate to Summary page and verify if all previously entered data is displayed",
      async () => {
        const firstName = await this.patient.get("firstName");
        await this.addPatientPage.getSummaryName();
        // Go to step 1
        await this.tab.click(`text=${this.patientName}`);
        expect(await this.tab.innerText("h2")).toBe(`Patient details`);

        await this.addPatientPage.clickNextButton();
        await this.addPatientPage.clickNextButton();
        await this.addPatientPage.clickNextButton();
        await this.addPatientPage.waitForSummaryPage();

        // Go to step 2
        await this.tab.click("text='in Trial'");
        expect(await this.tab.innerText("h2")).toBe(
          `What stage is ${firstName} at in their SCS journey?`
        );
        await this.addPatientPage.clickNextButton();
        await this.addPatientPage.clickNextButton();
        await this.addPatientPage.waitForSummaryPage();

        // Go to step 3
        await this.tab.click("text='Target trial date'");
        expect(await this.tab.innerText("h2")).toBe(
          `When is ${firstName}'s SCS trial date?`
        );

        await this.addPatientPage.clickNextButton();
        await this.addPatientPage.waitForSummaryPage();
      }
    );
  }
}
new TestCase(
  "CC-386",
  "Verification: Clicking on a field on the summary page takes coordinator to the appropriate screen"
);