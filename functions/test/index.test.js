const axios = require("axios");

// Get and adding all images from Home Design
test('Iterate 3 image variants when order_id is equals but image.id thats different, and response state 200 with a text', async () => {
    const requests = [];
    
    const response = await axios.post('http://127.0.0.1:5001/adpprenticeaihomedesign-stage/us-central1/imageGeneratedWebhook', {
        "order_id" : orderId
    });

    expect(response.status).toBe(200);
    const data = response.data;
    expect(Array.isArray(data.image_url)).toBe(true);
    expect(data.image_url.every(item => typeof item === 'string')).toBe(true);
})

// Unit test for docImage function
test('POST request will return a JSON object with the image_url', async () => {
    const orderId = '42f2e5f9-1888-48a0-aff4-b22308a82a34';
    
    const response = await axios.get('http://127.0.0.1:5001/adpprenticeaihomedesign-stage/us-central1/imageGeneratedWebhook', {
        "order_id" : orderId
    })

    expect(response.status).toBe(200);
    const data = response.data;
    expect(Array.isArray(data.image_url)).toBe(true);
    expect(data.image_url.every(item => typeof item === 'string')).toBe(true);
});
