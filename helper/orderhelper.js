const pdf = require("html-pdf");
const nodemailer = require("nodemailer");

const generatePdf = (htmlContent) => {
  return new Promise((resolve, reject) => {
    const options = { format: "Letter" };
    pdf.create(htmlContent, options).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
};

const sendEmailWithAttachment = (pdfBuffer, data) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      auth: {
        user: "apikey",
        pass: "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",
      },

      // host: "sg3plcpnl0089.prod.sin3.secureserver.net",
      // port: 465,
      // secure: true,
      // auth: {
      //   user: "yasir@smiksystems.com",
      //   pass: "yasir@123",
      // },
    });
    console.log('data.email,',data, '.....data.customer_email......',data.customer_email)

    const mailOptions = {

      from: "kaviraj.smiksystems@gmail.com",
      to: [data.email_id,data.customer_email],
      subject: "Order Details",
      text: "Please find attached order details.",
      attachments: [
        {
          filename: "order_details.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        console.log("mail sended");
        resolve(info);
      }
    });
  });
};

const generatePDFAndSendMail = async (data, orderDetails) => {
  try {
    const htmlContent = await generateHtmlContent(data, orderDetails);
    const pdfBuffer = await generatePdf(htmlContent);
    const info = await sendEmailWithAttachment(pdfBuffer, data);
    console.log("Email sent:", info);
  } catch (error) {
    console.error("Error generating PDF or sending email:", error);
  }
};

async function generateHtmlContent(data, orderDetails) {
  const template = `
  <html>
    <head>
      <title>Order Details</title>
      <style>
      /* Table Styles */
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }

      th, td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }

      th {
        background-color: #f2f2f2;
        color: #333;
        font-weight: bold;
      }

      tfoot td {
        font-weight: bold;
        text-align: left;
      }

      /* Heading Styles */
      h1 {
        text-align: center;
        margin-top: 20px;
        color: #333;
        font-size: 24px;
      }

      h2 {
        margin-top: 40px;
        margin-bottom: 10px;
        color: #555;
        font-size: 18px;
      }

      /* Customer Details Table Styles */
      .customer-details-table {
        margin-bottom: 40px;
      }

      .customer-details-table th {
        background-color: #f2f2f2;
        font-weight: normal;
        padding: 10px;
        color: #555;
      }

      .customer-details-table td {
        padding: 10px 16px;
        border: 1px solid #ddd;
        color: #333;
      }

      .customer-details-table td:first-child {
        font-weight: bold;
      }

      /* Additional Styles */

      /* Body */
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
      }

      /* Table Rows */
      tr:nth-child(even) {
        background-color: #f2f2f2;
      }

      /* Total Amount Row */
      tfoot td {
        background-color: #f2f2f2;
        font-weight: bold;
        text-align: right;
      }

      /* Product Details Table Header */
      thead th {
        background-color: #f9f9f9;
      }

      /* Heading Styles */
      h1, h2 {
        margin-top: 20px;
        margin-bottom: 10px;
      }

      /* Customer Details Table */
      .customer-details-table {
        width: 100%;
        border-collapse: collapse;
      }

      .customer-details-table td {
        border: 1px solid #ddd;
      }

      /* Customer Details Table Header */
      .customer-details-table th {
        background-color: #f9f9f9;
        font-weight: normal;
        text-align: left;
        padding: 10px;
      }

      /* Customer Details Table Cells */
      .customer-details-table td {
        padding: 10px;
      }
      </style>
    </head>
    <body>
      <h2>Order Details</h1>  

      <table>
        <tr>
          <th>Order ID:</th>
          <td>${data.order_id}</td>
        </tr>
        <tr>
          <th>Order Status:</th>
          <td>${data.order_status}</td>
        </tr>
        <tr>
          <th>Order Date:</th>
          <td>${data.order_date}</td>
        </tr>
      </table>
      <br>

      <h2>Product Details</h2>

       <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Measurement</th>
            <th>Actual Price</th>
            <th>Discount</th>
            <th>Price</th>
            <th>Tax</th>
            <th>Product Type</th>
          </tr>
        </thead>
        <tbody>
          {{ORDER_DETAILS}}
        </tbody>
      </table>
      
      <table>
        
          <tr>
            <td colspan="5">Total Amount</td>
            <td>${data.priceWithTax}</td>
          </tr>
        
      </table>

      <h2>Customer Details</h2>
      <table class="customer-details-table">
        <tr>
          <th>Customer Name</th>
          <th>Shipping Address</th>
          <th>Billing Address</th>
        </tr>
        <tr>
          <td>${data.customer_name}</td>
          <td>${formatShippingAddress(data.shipping_address)}</td>
          <td>${formatShippingAddress(data.shipping_address)}</td>
        </tr>
      </table>
    </body>
  </html>
`;

  let orderDetailsHtml = orderDetails
    .map((order) => {

      console.log('ore............................................................',order)
      return `
        <tr>
          <td>${order.product_name}</td>
          <td>${order.quantity}</td>
          <td>${order.variation.measurement}</td>
          <td>${order.Total_price}</td>
          <td>${order.Total_discounted_price}</td>
          <td>${order.final_amount}</td>
          <td>${order.tax}</td>
          <td>${order.product_type}</td>
         
        </tr>
      `;
    })
    .join("");

  const htmlContent = template.replace("{{ORDER_DETAILS}}", orderDetailsHtml);
  return htmlContent;
}

function formatShippingAddress(address) {
  const {
    first_name,
    last_name,
    address_1,
    address_2,
    city,
    country,
    phone,
    postcode,
    state,
  } = address;

  const formattedAddress = `

    first_name: ${first_name}<br>
    last_name: ${last_name}<br>
    address_1: ${address_1}<br>
    address_2: ${address_2}<br>
    city: ${city}<br>
    state: ${state}<br>
    Phone: ${phone}<br>
    postcode: ${postcode}<br>
    country:${country}
   
  `;

  return formattedAddress;
}

module.exports = {
  generatePDFAndSendMail,
};
