import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-237
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });

    this.addTestStep('set email and password then close network connection to submit', async () => {
      await this.loginPage.setEmailAndPassword();
      await this.context.setOffline(true)
      await this.loginPage.tab.keyboard.press("Enter");
      await this.loginPage.waitForToast("Network Error: Please make sure you are connected to internet.")
    });
  }
}

new TestCase('CC-237', 'Verification: Error message is displayed in case of network issues');

