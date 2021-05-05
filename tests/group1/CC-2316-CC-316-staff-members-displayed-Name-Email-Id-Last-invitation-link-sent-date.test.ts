import format from 'date-fns/format';
import MockableTestCase from "../src/MockableTestCase";
// https://teamsolace.atlassian.net/browse/CC-316
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });
    this.addTestStep("Go to Setting on clinic profile page", async () => {
      await this.dashboardPage.clickSettings();
      await this.settingsPage.waitForMe();
    });
    this.addTestStep("Add few Staff members and check", async () => {
      await this.settingsPage.clickAddStaffButton();
      let [firstName,lastName,email]=this.addStaffPage.generateStaffData();
      await this.addStaffPage.setFirstName(firstName);
      await this.addStaffPage.setLastName(lastName);
      await this.addStaffPage.setEmail(email);
      await this.addStaffPage.clickAddButtonAndWaitForToast();
      let [name,date,link,status]=await this.settingsPage.getStaffLineInfoByEmail(email);
      const newdate = new Date();
      let systemDate=format(newdate,'MM/dd/yyyy');
      expect(name).toContain(firstName+" "+lastName);
      expect(date).toContain(systemDate);
      expect(link).toContain("RE-SEND INVITE");
      expect(status).toEqual(true);
    });
  }
}
new TestCase('CC-316', 'Verification: In list of added staff members is displayed data about Name, Email Id and Last invitation link sent date');

