const express = require('express');
const handlebars = require('handlebars');
const cors = require('cors');
const fs = require('fs');
const pdf = require('html-pdf');
const app = express();
app.use(cors());
const port = 8080; // Adjust the port as needed

app.use(express.json());

app.post('/generate-pdf', async (req, res) => {
  const { data } = req.body;
  console.log(data);

  // Read the Handlebars template file
  const templateSource = fs.readFileSync('template.hbs', 'utf8');

  // Compile the Handlebars template
  const template = handlebars.compile(templateSource);

  // Render the HTML content with the data
  const html = template(data);

  // Define PDF options
  const pdfOptions = { format: 'Letter' }; // You can adjust the format

  // Generate the PDF from HTML using html-pdf
  pdf.create(html, pdfOptions).toStream((err, pdfStream) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error generating PDF');
    }

    // Set response headers to indicate a PDF file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

    // Send the generated PDF stream as the response
    pdfStream.pipe(res);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
