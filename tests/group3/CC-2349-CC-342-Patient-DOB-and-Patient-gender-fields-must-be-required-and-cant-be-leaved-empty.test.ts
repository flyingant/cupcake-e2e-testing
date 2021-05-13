import MockableTestCase from "../src/MockableTestCase";
import * as faker from "faker";

// https://teamsolace.atlassian.net/browse/CC-2349
class TestCase extends MockableTestCase {
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
      "Fill in 'First name' and 'Last name' fields and Leave 'Patient DOB' and 'Gender' fields as empty and try to submit form",
      async () => {
        const firstName = faker.name.firstName(1);
        const lastName = faker.name.lastName(1);
        await this.addPatientPage.setFirstName(firstName);
        await this.addPatientPage.setLastName(lastName);
        expect(
          await this.tab.getAttribute(
            "button[data-test-id='next-btn']",
            "class"
          )
        ).toContain("disabled");
      }
    );
  }
}

new TestCase(
  "CC-342",
  "'Patient DOB' and 'Patient gender' fields must be required and can't be leaved empty"
);
