import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-2340
class TestCase extends MockableTestCase {
  patient: Map<string, string>;

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

    this.addTestStep(
      "Click 'ADD PATIENT' button and Verify all input fields on the page if they have a valid placeholder",
      async () => {
        await this.dashboardPage.clickAddPatientButton();
        await this.addPatientPage.waitForMe();
        const firstNamePlaceholder = await this.tab.innerText(
          "[data-test-id=first_name] .label"
        );
        const lastNamePlaceholder = await this.tab.innerText(
          "[data-test-id=last_name] .label"
        );
        const phonePlaceholder = await this.tab.innerText(
          "[data-test-id=phone] .label"
        );
        const emailPlaceholder = await this.tab.innerText(
          "[data-test-id=email] .label"
        );
        expect(firstNamePlaceholder).toBe("first name".toUpperCase());
        expect(lastNamePlaceholder).toBe("last name".toUpperCase());
        expect(phonePlaceholder).toBe("phone".toUpperCase());
        expect(emailPlaceholder).toBe("email (optional)".toUpperCase());
      }
    );
  }
}

new TestCase(
  "CC-340",
  "Whether all the fields such as First name, Last name, Phone and Email has a valid placeholder"
);
