const express = require('express');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const cors = require("cors")
const fs = require('fs');
const app = express();
app.use(cors())
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

  // Create a new Puppeteer browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the HTML content of the page
  await page.setContent(html);

  // Generate PDF from the HTML content
  const pdfBuffer = await page.pdf();

  // Close the browser
  await browser.close();

  // Set response headers to indicate a PDF file
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

  // Send the generated PDF as the response
  res.send(pdfBuffer);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
