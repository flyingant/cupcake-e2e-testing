import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-120
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });

    this.addTestStep('set email and password then press enter', async () => {
      await this.loginPage.setEmailAndPassword();
      // too fast,enter key is invalid,wait 0.5s
      this.loginPage.sleep(500)
      await this.loginPage.tab.keyboard.press("Enter");
      await this.dashboardPage.waitForMe()
    });
  }
}

new TestCase('CC-120', 'Verification: Whether Enter/Tab key works as a substitute for the Sign in button');

