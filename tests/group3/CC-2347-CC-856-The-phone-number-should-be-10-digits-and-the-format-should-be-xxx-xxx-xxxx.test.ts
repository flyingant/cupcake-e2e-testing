import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-2347
class TestCase extends MockableTestCase {
  patient: Map<string, string>;
  patientName: string;
  phone: string;

  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake portal as a clinic coordinator",
      async () => {
        await this.homePage.start();
        await this.loginPage.setEmailPasswordAndThenSubmit();
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
      "In Phone field enter 9 digits and verify that validation message is shown",
      async () => {
        this.patient = this.addPatientPage.generatePatientData();
        this.patientName =
          this.patient.get("firstName") + " " + this.patient.get("lastName");
        await this.addPatientPage.setPatientDetail(this.patient);
        await this.addPatientPage.setPhone("123456789");
        const error = await this.tab.innerText(".error-holder:visible");
        expect(error).toBe("Please enter a valid phone number");
      }
    );
    this.addTestStep(
      "In Phone filed enter 10 digits and verify that format is (xxx)-xxx-xxxx",
      async () => {
        this.phone = "(123)456-7890";
        await this.addPatientPage.setPhone("1234567890");
        expect(
          await this.tab.getAttribute(
            "button[data-test-id='next-btn']",
            "class"
          )
        ).not.toContain("disabled");
      }
    );
    this.addTestStep(
      "Fill in all required fields on all pages and save this patient detail",
      async () => {
        await this.addPatientPage.clickNextButton();
        await this.addPatientPage.selectStage("Awaiting/Scheduled Trial");
        await this.addPatientPage.clickNextButton();

        await this.addPatientPage.clickDoNotSetTrialDate();
        await this.addPatientPage.selectPhysician({ index: 0 });
        await this.addPatientPage.clickNextButton();

        // summaryPage click add button
        await this.addPatientPage.waitForSummaryPage();
        await this.addPatientPage.clickAddPatientButton();
        await this.dashboardPage.waitForMe();
      }
    );
    this.addTestStep(
      "Go to Search field choose last added patient and verify that patient has phone number that was specified during adding",
      async () => {
        await this.dashboardPage.searchByName(this.patientName);
        await this.dashboardPage.hoverPatientName();
        await this.dashboardPage.clickPatientName();
        await this.patientDetailPage.waitForMe();
        const currentPhone = await this.patientDetailPage.getPhone();
        expect(currentPhone).toBe(this.phone);
      }
    );
  }
}

new TestCase(
  "CC-856",
  "The phone number should be 10 digits and the format should be (xxx)- xxx- xxxx"
);