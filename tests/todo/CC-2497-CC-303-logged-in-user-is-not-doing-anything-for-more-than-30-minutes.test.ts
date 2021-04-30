import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-303
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('login', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    })
    this.addTestStep('waitAndLogout', async () => {
      // fail this test for now. wait for a solution for short wait
      expect(false).toBe(true)

      await this.dashboardPage.sleep(1800000);
      await this.loginPage.waitForMe();
    })
  }
}

new TestCase('CC-303', 'Verification: If the logged in user is not doing anything for more than 30 minutes, he/she gets automatically logged out.');
