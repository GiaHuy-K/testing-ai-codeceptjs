const { chromium } = require('playwright');


const testCases = require('./testsceneries');






const FACEBOOK_LOGIN_URL = "https://www.facebook.com/";




// AutoHealSelector with auto-detected expected attribute
async function autoHealSelector(page, baseSelector) {
    // Extract expected name from baseSelector (e.g., name="user-emaillll")
    const nameMatch = baseSelector.match(/@name=["']([^"']+)["']/);
    const expectedAttribute = nameMatch ? nameMatch[1] : null; // e.g., "user-emaillll" or "userpassword"

    const fallbackSelectors = [
        baseSelector,              // Your original XPath
        'input[type="text"]',      // Fallback 1
        'input[name="email"]', // Fallback 2 (email)
        'input[type="pass"]',  // Fallback 3 (password)
        '//button[@name="login"]'  // Fallback 4
    ];

    let matchedSelector = null;
    let element = null;

    for (const selector of fallbackSelectors) {
        console.log(`🔍 Trying selector: "${selector}"`);
        try {
            element = await page.$(selector);
            if (element) {
                matchedSelector = selector;
                const actualName = await element.evaluate(el => el.getAttribute('name'));
                console.log(`🎯 Found element with name="${actualName}" using "${selector}"`);
                break;
            }
        } catch (e) {
            console.log(`❌ Selector "${selector}" failed: ${e.message}`);
            continue;
        }
    }

    if (element) {
        const actualAttribute = await element.evaluate(el => el.getAttribute('name') || el.getAttribute('type'));
        if (expectedAttribute && actualAttribute === expectedAttribute) {
            console.log(`✅ Selector "${baseSelector}" matched with expected attribute "${expectedAttribute}"`);
        } else if (expectedAttribute && actualAttribute !== expectedAttribute) {
            const warning = `⚠️ AutoHeal Alert: Expected attribute "${expectedAttribute}", found "${actualAttribute}" with "${matchedSelector}"`;
            console.warn(warning);
            require('fs').appendFileSync('autoheal_log.txt', `${new Date().toISOString()} - ${warning}\n`);
        } else if (matchedSelector === baseSelector) {
            console.log(`✅ Selector "${baseSelector}" matched perfectly (no name in selector)`);
        } else {
            const warning = `⚠️ AutoHeal Alert: Expected "${baseSelector}", healed to "${matchedSelector}"`;
            console.warn(warning);
            require('fs').appendFileSync('autoheal_log.txt', `${new Date().toISOString()} - ${warning}\n`);
        }
    } else {
        throw new Error(`No element found for "${baseSelector}" or fallbacks`);
    }

    return element;
}

// Test function with your tweaks
async function runTest() {
    const FACEBOOK_LOGIN_URL = 'https://www.facebook.com/login';
    for (const testCase of testCases) {
        console.log(`🚀 Running Test: ${testCase.scenario}`);

        const browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(FACEBOOK_LOGIN_URL);
        console.log("🌐 Page Loaded:", FACEBOOK_LOGIN_URL);

        console.log(`✍️ Filling form - Email: ${testCase.email}`);
        const emailElement = await autoHealSelector(page, '//input[@type="text" or @name="email"]');
        await emailElement.fill(testCase.email);

        console.log(`✍️ Filling form - Password: ${testCase.password}`);
        const passwordElement = await autoHealSelector(page, '//input[@type="password" or @name="pass"]');
        await passwordElement.fill(testCase.password);

        console.log("🔐 Clicking login...");
        const loginButton = await autoHealSelector(page, '//button[@name="login"]');
        await loginButton.click();

        try {
            await page.waitForNavigation({ timeout: 10000 });
        } catch (e) {
            console.log("⏳ No navigation detected, proceeding anyway...");
        }

        await page.screenshot({ path: `result_${testCase.scenario.replace(/[^a-zA-Z]/g, "_")}.png` });
        console.log(`📸 Screenshot saved for: ${testCase.scenario}`);

        await browser.close();
    }
}

runTest().catch(err => console.error('❌ Test crashed:', err));