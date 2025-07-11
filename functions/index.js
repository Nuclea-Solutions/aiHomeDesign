const { onRequest } = require("firebase-functions/v2/https");
const { Firestore } = require('@google-cloud/firestore');
const { error } = require("firebase-functions/logger");

const firestore = new Firestore();

exports.imageGeneratedWebhook = onRequest(async (req, res) => {
  // Ensure the request is a POST
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {

    console.info(req.body);

    const {
      order_id,
      image
    } = req.body;

    // Validate the incoming data
    if (!order_id) {
      res.status(400).send('order_id param is required');
      return;
    }

    const docImage = await firestore.collection('generatedImages').doc(order_id).get();

    if (!docImage._fieldsProto) {
      console.info(`Inside to create a ${order_id} image document`)
      await firestore.collection('generatedImages').doc(order_id).set({
        metadataImage: {
          image_origin: image.before_src,
          image_variants: [
            image.after_src
          ],
          create_at: new Date().toISOString(),
          update_at: new Date().toISOString(),
          delivered: false
        }
      });

      res.status(201).send({
        'message': "Image saved successfully"
      });
      return;
    }

    const { metadataImage } = docImage.data();

    const { image_variants } = metadataImage;

    if (Array.isArray(image_variants)) {
      metadataImage['image_variants'].push(image.after_src)

      await firestore.collection('generatedImages').doc(order_id).update({
        'metadataImage.image_variants': image_variants
      });

      res.status(200).send({
        message: 'Image saved successfully'
      });
      return;
    }

    // Store the webhook data in Firestore, upload data && metadata image


  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

exports.getImages = onRequest(async (req, res) => {
  // Ensure the request is a POST
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  const { order_id } = req.query;

  if (!order_id) {
    res.send(400).send({
      error: `El parametro 'order_id' es requerido para esta acción`
    });
    return;
  }

  // Request to send user image
  try {
    const docImage = await firestore.collection('generatedImages').doc(order_id).get();

    const metadataImage = docImage.get('metadataImage');

    console.info(`Metadata image ${JSON.stringify(metadataImage)}`)

    if (!Array.isArray(metadataImage.image_variants)) {
      res.status(500).send({
        "error": "Not have images variants to Home Design"
      });
      return;
    }

    res.status(200).send({
      images_url: metadataImage.image_variants
    });
    return;

  } catch (error) {
    console.error(error)
    res.status(400).send({
      message: 'Ocurrio un error, intentalo de nuevo',
      error
    });
    return;
  }
});visu


exports.deleteImageDoc = onRequest(async (req, res) => {

  // Ensure the request is a POST
  if (req.method !== 'DELETE') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  console.info(` Query ${JSON.stringify(req.query)}`)

  const { order_id } = req.query;

  if (!order_id) {
    res.send(400).send({
      error: `El parametro 'order_id' es requerido para esta acción`
    });
    return;
  }

  // Request to send user image
  try {
    const docImage = await firestore.collection('generatedImages').doc(order_id);

    const metadataImage = docImage.delete();

    console.info(`Metadata image ${JSON.stringify(metadataImage)}`);

    res.status(200).send({
      images_url: 'Documento eliminado correctamente'
    });
    return;
  } catch (error) {
    console.error(error)
    res.status(400).send({
      message: 'Ocurrio un error, intentalo de nuevo',
      error
    })
  }

});