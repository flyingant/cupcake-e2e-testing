import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-299
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe()
    });
    this.addTestStep('login', async () => {
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });
    this.addTestStep('logout', async () => {
      await this.dashboardPage.logout();
      await this.loginPage.waitForMe(); 
    });
  }
}

new TestCase('CC-299', 'Verification: After clicking "Sign out" user is redirected to login screen.');

