import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-147
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });

    this.addTestStep('Login', async () => {
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });
    
    this.addTestStep('Logout', async () => {
      await this.dashboardPage.logout();
      await this.loginPage.waitForMe();
    });
    this.addTestStep('goback', async () => {
      await this.tab.goBack();
      await this.loginPage.waitForMe();
    });
  }
}

new TestCase('CC-147', 'Verification:  Clicking on browser back button after successful logout should not take User to logged in mode');

