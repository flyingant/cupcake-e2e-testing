import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-2630
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake as a clinic admin add a staff and go to email",
      async () => {
        await this.homePage.start();
        await this.loginPage.setEmailPasswordAndThenSubmit();
        await this.dashboardPage.waitForMe();
        // enter to setting, click add staff
        await this.dashboardPage.clickSettings();
        await this.settingsPage.clickAddStaffButton();
        await this.addStaffPage.waitForMe();
        // add staff
        const [
          firstName,
          lastName,
          email,
        ] = this.addStaffPage.generateStaffData();
        await this.addStaffPage.setFirstName(firstName);
        await this.addStaffPage.setLastName(lastName);
        await this.addStaffPage.setEmail(email);
        await this.addStaffPage.clickAddButtonAndWaitForToast();
        // Go to received email and open it
        await this.emailPage.sleep(5000);
        let emailContent = await this.ccTestClient.platform_getEmailForAddress(
          email
        );
        const path = await this.emailPage.saveEmail(
          this.id,
          emailContent["content"]
        );
        await this.emailPage.goto(path);
      }
    );

    this.addTestStep("Click on Activate Cupcake link", async () => {
      await this.emailPage.clickAcceptInvitation();
    });

    this.addTestStep(
      "Verify that on entering invalid password (less than 8 characters) 'Submit' button does not active and error message present on the page",
      async () => {
        await this.activatePage.waitForMe();
        await this.activatePage.setPassword("1234567");
        await this.activatePage.clickNextButton();
        const error = await this.tab.innerText(".error-holder");
        expect(error).toBe("Minimum length of password is 8 characters");
      }
    );

    this.addTestStep(
      "Verify that on entering invalid password (8 or more characters without any number symbol) 'Submit' button does not active and error message present on the page",
      async () => {
        await this.activatePage.waitForMe();
        await this.activatePage.setPassword("qwe#tyu");
        await this.activatePage.clickNextButton();
        const error = await this.tab.innerText(".error-holder");
        expect(error).toBe(
          "Password must contain at least one number and one special character (e.g. $,#,@,&...)"
        );
      }
    );

    this.addTestStep(
      "Verify that on entering invalid password (8 or more characters without any special characters) 'Submit' button does not active and error message present on the page",
      async () => {
        await this.activatePage.waitForMe();
        await this.activatePage.setPassword("qaz1wsx");
        await this.activatePage.clickNextButton();
        const error = await this.tab.innerText(".error-holder");
        expect(error).toBe(
          "Password must contain at least one number and one special character (e.g. $,#,@,&...)"
        );
      }
    );
  }
}
new TestCase(
  "CC-126",
  "Verification: User cannot set invalid password on CupCake set password page"
);
