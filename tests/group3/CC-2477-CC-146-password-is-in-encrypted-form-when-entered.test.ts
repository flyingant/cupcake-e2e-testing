import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-146
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });
    this.addTestStep('Set password', async () => {
      await this.loginPage.setPassword("12345678");
      // When the input tag type is password, the input content is displayed encrypted
      let type = await this.loginPage.tab.getAttribute(this.loginPage.css_password, "type")
      expect(type).toBe("password")
    });
  }
}

new TestCase('CC-146', 'Verification: Password is in encrypted form when entered');

