const bcrypt = require('bcryptjs');

async function testBcrypt() {
    console.log("Testing bcryptjs version 3.0.3...");
    const password = "password123";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    console.log("Password:", password);
    console.log("Salt:", salt);
    console.log("Generated Hash:", hash);

    const isMatch = await bcrypt.compare(password, hash);
    console.log("Match Result (Self):", isMatch);

    // Test with the hash from the screenshot
    const screenshotHash = "$2b$10$i/KGB5z6M1JCisZ4D0kEF050YkXTmsrbC.l7SPoPbCT9gTDN71VkC";
    const isScreenshotMatch = await bcrypt.compare("123456", screenshotHash); // Assuming 123456 as a guess
    console.log("Guess Match Result (Screenshot Hash with '123456'):", isScreenshotMatch);

    const isScreenshotMatch2 = await bcrypt.compare("password123", screenshotHash);
    console.log("Guess Match Result (Screenshot Hash with 'password123'):", isScreenshotMatch2);
}

testBcrypt().catch(console.error);
