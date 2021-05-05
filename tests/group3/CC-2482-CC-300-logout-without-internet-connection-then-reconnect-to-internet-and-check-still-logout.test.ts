import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-300
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake practice page', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });
    
    this.addTestStep('Disable internet connection and then logout', async () => {
      // when ON/OFF internet, case is not stable,try sleep
      this.dashboardPage.sleep(3000)
      await this.context.setOffline(true);
      await this.dashboardPage.logout();
      await this.loginPage.waitForMe();
    });

    this.addTestStep('Enable internet connection and Navigate to dashboard', async () => {
      this.dashboardPage.sleep(3000)
      await this.context.setOffline(false);
      this.dashboardPage.sleep(3000)
      await this.dashboardPage.goto();
    });

    this.addTestStep('still login page', async () => {
      await this.loginPage.waitForMe();
    });
  }
}

new TestCase('CC-300', 'Verification: Logout without internet connection then reconnect to internet and check it’s properly logout or not.');

