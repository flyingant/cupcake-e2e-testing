import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-298
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake practice page as a clinic admin', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });
    this.addTestStep('Click on top menu avatar icon', async () => {
      await this.dashboardPage.hoverAvatarIcon()
      await this.dashboardPage.tab.hover('"Sign out"')
    });
  }
}

new TestCase('CC-298', 'Verification: "Logout" option is available when clicking on top menu avatar icon/caret.');

