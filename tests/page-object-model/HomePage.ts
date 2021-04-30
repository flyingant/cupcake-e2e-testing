import TestComponent from './TestComponent';

export default class HomePage extends TestComponent {

  async waitForMe() {
  }

  async start() {
    await this.goto("/");
  }
  
}