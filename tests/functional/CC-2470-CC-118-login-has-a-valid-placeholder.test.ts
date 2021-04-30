import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-118
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    })
    this.addTestStep('check email and password placeholder', async () => {
    await this.loginPage.waitForText("email");
    await this.loginPage.waitForText("password");
  }) 
  } 
}

new TestCase('CC-118', 'Verification: Whether all the fields such as Email, Password has a valid placeholder');
