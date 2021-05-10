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
      "Click 'ADD PATIENT' button and Verify if Zip code fields is optional",
      async () => {
        await this.dashboardPage.clickAddPatientButton();
        await this.addPatientPage.waitForMe();
        this.patient = this.addPatientPage.generatePatientData();
        await this.addPatientPage.setPatientDetail(this.patient);
        await this.addPatientPage.setZipcode("");
        expect(
          await this.tab.getAttribute(
            "button[data-test-id='next-btn']",
            "class"
          )
        ).not.toContain("disabled");
      }
    );

    this.addTestStep(`Enter in Zip code field data with 4 digits`, async () => {
      await this.addPatientPage.setZipcode("2000");
      const error = await this.tab.innerText(".error-holder:visible");
      expect(error).toBe("Please enter a valid zip code");
    });

    this.addTestStep(`Enter in Zip code field data with 6 digits`, async () => {
      await this.addPatientPage.setZipcode("200000");
      const error = await this.tab.innerText(".error-holder:visible");
      expect(error).toBe("Please enter a valid zip code");
    });

    this.addTestStep(`Enter in Zip code field data with 9 digits`, async () => {
      // Allowed formats xxxxx, xxxxx-xxxx
      await this.addPatientPage.setZipcode("20000-0000");
      expect(
        await this.tab.getAttribute("button[data-test-id='next-btn']", "class")
      ).not.toContain("disabled");
    });

    this.addTestStep(
      `Erase Zip and verify that 'Next' button is in active state`,
      async () => {
        await this.addPatientPage.setZipcode("");
        expect(
          await this.tab.getAttribute(
            "button[data-test-id='next-btn']",
            "class"
          )
        ).not.toContain("disabled");
      }
    );
  }
}

new TestCase(
  "CC-339",
  "Zip code is an optional field and accepts up to 9 digits in formats xxxxx, xxxxx-xxx"
);
