const axios = require('axios');

const webhookUrl = 'https://us-central1-adpprenticeaihomedesign-stage.cloudfunctions.net/imageGeneratedWebhook';

const testData = {
  "order_id": "live_test_123",
  "image": {
    "id": "img456",
    "before_src": "https://example.com/before_live.jpg",
    "after_src": "https://example.com/after_live.jpg",
    "regenerated": false,
    "style": "contemporary",
    "color": "green",
    "space": "kitchen",
    "sky_style": "sunset",
    "shadow_removal": true,
    "material": "marble",
    "created_at": new Date().toISOString()
  },
  "service_name": "image_generation_live",
  "user_id": "user_live_456"
};

async function testWebhook() {
  try {
    console.log('Sending request to:', webhookUrl);
    const response = await axios.post(webhookUrl, testData, {
      timeout: 10000, // 10 seconds timeout
    });
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? `${error.response.status} - ${error.response.data}` : error.message);
  }
}

console.log('Starting live webhook test...');
testWebhook();