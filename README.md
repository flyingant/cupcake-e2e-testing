# Cupcake - E2E Testing

Cupcake - Web Portal for Physicians

## Technology

**Cupcake Website**
- Serverless
- AWS
- Typescript + React

**E2E Testing Framework**
- Jest
- Playwright
- NodeJS + Typescript

## Test Specs

Stable Paient Data to test the Web UI

| Account |Name  | Phone |D.O.B  |Gender  |Stage  |
| --- | --- | --- | --- | --- | --- |
| 103 | Test008 Test008 | 888 888 8888 | 01.01.2000 | Male | candidate |

## Installation
The project is based on NodeJS and test scripts are written with Playwright framework and run the by Jest.

**1. Clone the code**
```
git clone https://gitlab.com/boston-scientific/cupcake/e2eplaywright.git
```
**2. Checkout the master branch**
```
git checkout master
```
**3. Install the dependencies library**
```
npm install
```
or
```
yarn install
```
**4. Run the tests**

```
// run single test case
npm run test [PATH TO TEST CASE  

/* 
npm run test CC-458-set-the-SCS-surgeon-date-for-the-patient.test.ts
*/

// run all test case at once
npm test

// run the test with env params
[browsers=chromium,firefox] [headless=true] [MOCK_REQ=false] npm test [-- --runInBand] [PATH TO TEST CASE]
```

## Cupcake Team
**Product Manager**: Noopur Pandey (USA)
**Tech Lead**: Shadab (USA)
**QA Engineer**: Nataliya Stadnyk (Ukraine)
**QA Lead**: Oksana Didych (Ukraine)

## Shanghai Team
**Project Manager**: Xinyue He

## Environments

endpoints: https://stage.bsncloud.ai

Testing Accounts
```
shiiah1208+101@gmail.com 
shiiah1208+102@gmail.com 
shiiah1208+103@gmail.com 
shiiah1208+104@gmail.com 
shiiah1208+105@gmail.com

pwd: @gaoshin.COM
```

## Used tools

- [jest-playwright](https://github.com/playwright-community/jest-playwright) - integrates Jest and Playwright
- [expect-playwright](https://github.com/playwright-community/expect-playwright) - provides useful expect statements
- [Jest](https://jestjs.io) - provides the testing suite
- [ts-jest](https://github.com/kulshekhar/ts-jest) - provides support for TypeScript
