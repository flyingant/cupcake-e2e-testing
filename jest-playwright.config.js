// https://github.com/playwright-community/jest-playwright/#configuration

module.exports = {
  browsers: process.env.browsers ? process.env.browsers.split(',') : ["chromium"/*, "firefox", "webkit"*/],
  launchOptions: {
    headless: process.env.headless === 'true'
  }
}
