/** require dependencies */
const express = require("express")
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const path = require('path')
const puppeteer = require("puppeteer")

const app = express()

let port = process.env.PORT || 5000

/** set up middlewares */
app.use(cors())
app.use(bodyParser.json({limit: '50mb'}))
app.use(helmet())

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.use('/static',express.static(path.join(__dirname,'static')))
app.use('/assets',express.static(path.join(__dirname,'assets')))

app.post('/api/generatePDF', (req, res, next) => {
    const { data } = req.body

    getPdf(data).then(pdf => {
      res.send({result: pdf })
      next()
     })
    
})

async function getPdf(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();
    return pdf;
}

/** start server */
app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});