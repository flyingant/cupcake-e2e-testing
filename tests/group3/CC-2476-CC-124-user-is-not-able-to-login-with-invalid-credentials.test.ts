import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-124
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });

    this.addTestStep('Login with invalid Email and invalid Password', async () => {
      await this.loginPage.setEmailPasswordAndThenSubmit("123@gmail.com", "12345678");
      await this.loginPage.waitForToast("Invalid login ID or password");
    });
  }
}

new TestCase('CC-124', 'Verification: User is not able to Login with invalid credentials');

