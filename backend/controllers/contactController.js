// backend/controllers/contactController.js
exports.handleContact = (req, res) => {
    // Here, add your validation and processing logic
    console.log('Contact submission:', req.body);
    res.json({ success: true, message: 'Contact form submitted successfully' });
  };