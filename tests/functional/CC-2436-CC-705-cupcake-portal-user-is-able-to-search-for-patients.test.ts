import AppConf from "../src/AppConf";
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-705
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      // get a new staff
      await this.homePage.start();
      await this.loginPage.waitForMe();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.clickSettings();
      let [, email, ] = await this.settingsPage.getOneActivedStaff();
      // logout
      await this.homePage.goto("/");
      await this.dashboardPage.logout();

      // login with new staff
      let password = AppConf.passwordForReset();
      await this.ccTestClient.setPoliciesAccept(email, password, true);
      await this.loginPage.waitForMe();
      await this.loginPage.setEmailPasswordAndThenSubmit(email, password);
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep('Enter any valid existing name and click on search glass icon', async () => {
      let fullname = await this.tab.innerText(this.dashboardPage.css_patientFullName)
      await this.dashboardPage.searchByName(fullname);
      let patients = await this.tab.$$(this.dashboardPage.css_patientFullName)
      expect(patients.length).toBe(1)
    });
  }
}

new TestCase('CC-705', "Verification: CupCake portal user is able to search for patients only");

