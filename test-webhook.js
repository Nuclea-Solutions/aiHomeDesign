const axios = require('axios');

const webhookUrl = 'http://127.0.0.1:5001/AdpprenticeAIHomeDesign-stage/us-central1/imageGeneratedWebhook';

const testData = {
  "order_id": "test123",
  "image": {
    "id": "img123",
    "before_src": "https://example.com/before.jpg",
    "after_src": "https://example.com/after.jpg",
    "regenerated": false,
    "style": "modern",
    "color": "blue",
    "space": "living room",
    "sky_style": "clear",
    "shadow_removal": true,
    "material": "wood",
    "created_at": new Date().toISOString()
  },
  "service_name": "image_generation",
  "user_id": "user123"
};

async function testWebhook() {
  try {
    console.log('Sending request to:', webhookUrl);
    const response = await axios.post(webhookUrl, testData, {
      timeout: 5000, // 5 seconds timeout
    });
    console.log('Response:', response.data);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Make sure the emulator is running and the port is correct.');
    } else {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  }
}

// Wait for 5 seconds before sending the request to ensure the emulator is fully started
setTimeout(() => {
  console.log('Starting webhook test...');
  testWebhook();
}, 5000);