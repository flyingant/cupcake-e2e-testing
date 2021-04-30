import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-540
class TestCase extends MockableTestCase {

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep("Scroll down", async () => {
      let bannerBeforScroll = await this.tab.waitForSelector(this.dashboardPage.css_ciinic_banner);
      expect((await bannerBeforScroll.boundingBox()).y).toBeGreaterThan(0)
      await this.tab.evaluate("window.scrollTo(0, document.documentElement.clientHeight);");
      let bannerAfterSroll = await this.tab.waitForSelector(this.dashboardPage.css_ciinic_banner);
      expect((await bannerAfterSroll.boundingBox()).y).toBeLessThan(0)

    });
  }
}
new TestCase('CC-540', 'Verification: Top banner on dashboard can collapse on scroll');

