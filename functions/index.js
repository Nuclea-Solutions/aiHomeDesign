const { onRequest } = require("firebase-functions/v2/https");
const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();

exports.imageGeneratedWebhook = onRequest(async (req, res) => {
  // Ensure the request is a POST
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  
  try {
    const webhookData = req.body;
    // Validate the incoming data
    if (!webhookData.order_id || !webhookData.image) {
      res.status(400).send('Invalid webhook data');
      return;
    }
    
    // Store the webhook data in Firestore
    await firestore.collection('generatedImages').doc(webhookData.order_id).set(webhookData);
    
    // Process the webhook data (you can add more logic here)
    console.log(`Processed image generation for order: ${webhookData.order_id}`);
    console.log(`Generated image URL: ${webhookData.image.after_src}`);
    
    // Send a success response
    res.status(200).send('Webhook received and processed successfully');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});