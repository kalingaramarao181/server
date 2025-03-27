const getEmailTemplate = (filePath) => {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EzySign - Document Signing Request</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f7f7f7; margin: 0; padding: 0;">

    <div style="max-width: 500px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); margin: 20px auto; padding: 20px; text-align: center;">
        
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #2a2a72, #009ffd); padding: 20px; text-align: center; color: white;">
            <img src="http://localhost:3000/images/applogo.png" alt="EzySign Logo" style="width: 160px; margin-bottom: 10px;">
            <div style="font-size: 18px; font-weight: bold;">📌 Document Signing Request</div>
        </div>

        <!-- Email Body -->
        <div style="padding: 20px; text-align: center; color: #555;">
            <div style="font-size: 14px; color: #777; margin-bottom: 15px;">
                From: <strong>Ramarao Kalinga</strong> (no-reply@ezysign.com)<br>
                To: <strong>kris@bedatatech.com</strong>
            </div>

            <div style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                Hi <strong>Bharathi Mamidi</strong>,<br><br>
                <strong>Ramarao Kalinga</strong> has assigned documents for you to sign.  
                Please review them and complete the signing process at your earliest convenience.
            </div>

            <!-- CTA Button -->
            <a href="${filePath}" style="display: inline-block; background: #2a2a72; color: white; text-decoration: none; padding: 12px 18px; font-size: 16px; border-radius: 6px; transition: all 0.3s ease-in-out;">
                Review & Sign Now
            </a>
        </div>

        <!-- Footer -->
        <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 14px; color: #777;">
            If you have any questions, contact us at <strong>support@ezysign.com</strong>.
        </div>

    </div>

</body>
</html>
    `;
};

module.exports = getEmailTemplate;
