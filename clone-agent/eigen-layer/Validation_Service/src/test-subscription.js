const { subscribeToChat } = require('./ai.service');

async function testSubscription() {
    console.log('🟡 Starting subscription test...');
    try {
        const response = await subscribeToChat();
        console.log('🟢 Test successful:', response);
    } catch (error) {
        console.error('🔴 Test failed:', error.message);
    }
}

testSubscription(); 