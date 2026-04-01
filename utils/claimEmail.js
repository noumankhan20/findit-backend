import { sendEmail } from "./sendEmail.js";

// ─── Shared Design Tokens ────────────────────────────────────────────────────
const RED = "#C0001A";
const RED_DARK = "#8B0013";
const GRAY_50 = "#FAFAFA";
const GRAY_100 = "#F3F3F3";
const GRAY_400 = "#9CA3AF";
const GRAY_700 = "#374151";
const GRAY_900 = "#111111";

const base = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>FindIt — Notification</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: ${GRAY_100};
  font-family: 'Georgia', 'Times New Roman', serif;
  -webkit-font-smoothing: antialiased;
">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
    style="background-color: ${GRAY_100}; padding: 48px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0"
          style="max-width: 560px; width: 100%; background-color: #FFFFFF;
                 border-radius: 2px;
                 box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05);
                 overflow: hidden;">

          <!-- Red accent bar -->
          <tr>
            <td style="background-color: ${RED}; height: 4px; line-height: 4px; font-size: 0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 36px 48px 28px; border-bottom: 1px solid ${GRAY_100};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="
                      font-family: 'Georgia', serif;
                      font-size: 22px;
                      font-weight: normal;
                      letter-spacing: 0.08em;
                      color: ${GRAY_900};
                      text-transform: uppercase;
                    ">Find<span style="color: ${RED};">It</span></span>
                  </td>
                  <td align="right">
                    <span style="
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      font-size: 11px;
                      letter-spacing: 0.12em;
                      text-transform: uppercase;
                      color: ${GRAY_400};
                    ">Lost &amp; Found Platform</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body content injected here -->
          ${content}

          <!-- Footer -->
          <tr>
            <td style="
              background-color: ${GRAY_50};
              border-top: 1px solid ${GRAY_100};
              padding: 24px 48px;
            ">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <p style="
                      margin: 0 0 6px;
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      font-size: 11px;
                      letter-spacing: 0.08em;
                      text-transform: uppercase;
                      color: ${GRAY_400};
                    ">FindIt &mdash; Lost &amp; Found</p>
                    <p style="
                      margin: 0;
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      font-size: 11px;
                      color: ${GRAY_400};
                      line-height: 1.6;
                    ">
                      This is an automated message. Please do not reply directly to this email.<br/>
                      If you need assistance, visit your <a href="#" style="color: ${RED}; text-decoration: none;">dashboard</a>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>
`;

// ─── Tag component (for metadata rows) ───────────────────────────────────────
const metaRow = (label, value, valueStyle = "") => `
  <tr>
    <td style="padding: 10px 0; border-bottom: 1px solid ${GRAY_100};">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 11px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: ${GRAY_400};
            width: 40%;
          ">${label}</td>
          <td style="
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 13px;
            color: ${GRAY_700};
            font-weight: 500;
            ${valueStyle}
          ">${value}</td>
        </tr>
      </table>
    </td>
  </tr>
`;

// ─── CTA Button ───────────────────────────────────────────────────────────────
const ctaButton = (label, href = "#") => `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top: 32px;">
    <tr>
      <td style="background-color: ${RED}; border-radius: 2px;">
        <a href="${href}" style="
          display: inline-block;
          padding: 14px 36px;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #FFFFFF;
          text-decoration: none;
          font-weight: 600;
        ">${label}</a>
      </td>
    </tr>
  </table>
`;

// ─── Status Badge ─────────────────────────────────────────────────────────────
const badge = (text, color = RED) => `
  <span style="
    display: inline-block;
    background-color: ${color}15;
    border: 1px solid ${color}40;
    color: ${color};
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 2px;
  ">${text}</span>
`;

// ─── Score bar ────────────────────────────────────────────────────────────────
const scoreBar = (score) => `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; margin-top: 4px;">
    <tr>
      <td style="
        background-color: ${GRAY_100};
        border-radius: 1px;
        height: 5px;
        width: 100%;
      ">
        <div style="
          background-color: ${RED};
          height: 5px;
          width: ${score}%;
          border-radius: 1px;
        "></div>
      </td>
    </tr>
  </table>
`;

const reviewUrl = `${process.env.FRONTEND_URL}/login`;

// ─── 1. Claim Submitted → Notify Owner ───────────────────────────────────────
export const sendClaimNotificationToOwner = async ({ ownerEmail, itemName, score, status }) => {
  const html = base(`
    <!-- Eyebrow label -->
    <tr>
      <td style="padding: 36px 48px 0;">
        <p style="
          margin: 0 0 16px;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${RED};
          font-weight: 600;
        ">Action Required</p>

        <h1 style="
          margin: 0 0 12px;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 28px;
          font-weight: normal;
          line-height: 1.3;
          color: ${GRAY_900};
          letter-spacing: -0.01em;
        ">A new claim has<br/>been submitted.</h1>

        <p style="
          margin: 0;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: ${GRAY_700};
        ">
          Someone has submitted a claim for one of your found items.
          Review the details below and approve or reject from your dashboard.
        </p>
      </td>
    </tr>

    <!-- Divider line -->
    <tr><td style="padding: 28px 48px 0;"><hr style="border: none; border-top: 1px solid ${GRAY_100}; margin: 0;" /></td></tr>

    <!-- Item detail block -->
    <tr>
      <td style="padding: 24px 48px 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">

          ${metaRow("Item", `<strong style="color:${GRAY_900}">${itemName}</strong>`)}

          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid ${GRAY_100};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    font-size: 11px;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: ${GRAY_400};
                    width: 40%;
                    vertical-align: top;
                    padding-top: 2px;
                  ">Match Score</td>
                  <td>
                    <span style="
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      font-size: 20px;
                      font-weight: 700;
                      color: ${score >= 75 ? RED : GRAY_700};
                      letter-spacing: -0.02em;
                    ">${score}%</span>
                    ${scoreBar(score)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 10px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    font-size: 11px;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: ${GRAY_400};
                    width: 40%;
                  ">Status</td>
                  <td>${badge(status)}</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding: 8px 48px 44px;">
        ${ctaButton("Review This Claim", reviewUrl)}
      </td>
    </tr>
  `);

  await sendEmail({
    to: ownerEmail,
    subject: `Claim Submitted — ${itemName}`,
    html,
    text: `A user has claimed your item "${itemName}". Match Score: ${score}%. Status: ${status}. Please log in to review the claim.`,
  });
};


// ─── 2. Claim Approved → Notify Claimer ──────────────────────────────────────
export const sendApprovalToClaimer = async ({ email, itemName }) => {
  const html = base(`
    <!-- Eyebrow label -->
    <tr>
      <td style="padding: 36px 48px 0;">
        <p style="
          margin: 0 0 16px;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${RED};
          font-weight: 600;
        ">Claim Approved</p>

        <h1 style="
          margin: 0 0 12px;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 28px;
          font-weight: normal;
          line-height: 1.3;
          color: ${GRAY_900};
          letter-spacing: -0.01em;
        ">Your item has<br/>been confirmed.</h1>

        <p style="
          margin: 0;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: ${GRAY_700};
        ">
          Great news. The finder has reviewed and approved your claim for
          <strong style="color:${GRAY_900}">${itemName}</strong>.
          You can now connect with them directly through your dashboard to arrange retrieval.
        </p>
      </td>
    </tr>

    <!-- Divider -->
    <tr><td style="padding: 28px 48px 0;"><hr style="border: none; border-top: 1px solid ${GRAY_100}; margin: 0;" /></td></tr>

    <!-- What's next block -->
    <tr>
      <td style="padding: 24px 48px 0;">
        <p style="
          margin: 0 0 16px;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${GRAY_400};
        ">What happens next</p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="vertical-align: top; width: 24px; padding-top: 1px;">
              <div style="
                width: 20px; height: 20px; border-radius: 50%;
                background-color: ${RED};
                text-align: center; line-height: 20px;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 11px; font-weight: 700; color: #fff;
              ">1</div>
            </td>
            <td style="
              padding-left: 12px; padding-bottom: 16px;
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              font-size: 13px; color: ${GRAY_700}; line-height: 1.6;
            ">Log in to your dashboard and open the approved claim.</td>
          </tr>
          <tr>
            <td style="vertical-align: top; width: 24px; padding-top: 1px;">
              <div style="
                width: 20px; height: 20px; border-radius: 50%;
                background-color: ${RED};
                text-align: center; line-height: 20px;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 11px; font-weight: 700; color: #fff;
              ">2</div>
            </td>
            <td style="
              padding-left: 12px; padding-bottom: 16px;
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              font-size: 13px; color: ${GRAY_700}; line-height: 1.6;
            ">Use the in-platform messaging to contact the finder.</td>
          </tr>
          <tr>
            <td style="vertical-align: top; width: 24px; padding-top: 1px;">
              <div style="
                width: 20px; height: 20px; border-radius: 50%;
                background-color: ${RED};
                text-align: center; line-height: 20px;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 11px; font-weight: 700; color: #fff;
              ">3</div>
            </td>
            <td style="
              padding-left: 12px;
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              font-size: 13px; color: ${GRAY_700}; line-height: 1.6;
            ">Arrange a time and place to collect your item.</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding: 32px 48px 44px;">
        ${ctaButton("Go to My Dashboard", "#")}
      </td>
    </tr>
  `);

  await sendEmail({
    to: email,
    subject: `Claim Approved — ${itemName}`,
    html,
    text: `Your claim for "${itemName}" has been approved. Log in to your dashboard to contact the finder.`,
  });
};


// ─── 3. Claim Rejected → Notify Claimer ──────────────────────────────────────
export const sendRejectionToClaimer = async ({ email, itemName }) => {
  const html = base(`
    <!-- Eyebrow label -->
    <tr>
      <td style="padding: 36px 48px 0;">
        <p style="
          margin: 0 0 16px;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${GRAY_700};
          font-weight: 600;
        ">Claim Update</p>

        <h1 style="
          margin: 0 0 12px;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 28px;
          font-weight: normal;
          line-height: 1.3;
          color: ${GRAY_900};
          letter-spacing: -0.01em;
        ">Your claim was<br/>not approved.</h1>

        <p style="
          margin: 0;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: ${GRAY_700};
        ">
          Unfortunately, the finder was unable to verify your claim for
          <strong style="color:${GRAY_900}">${itemName}</strong> at this time.
          This may be due to insufficient details or a mismatch in the item description.
        </p>
      </td>
    </tr>

    <!-- Divider -->
    <tr><td style="padding: 28px 48px 0;"><hr style="border: none; border-top: 1px solid ${GRAY_100}; margin: 0;" /></td></tr>

    <!-- Suggestion block -->
    <tr>
      <td style="padding: 24px 48px 0;">
        <!-- Bordered callout -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
          style="border-left: 3px solid ${RED}; background-color: ${GRAY_50};">
          <tr>
            <td style="padding: 20px 24px;">
              <p style="
                margin: 0 0 8px;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 11px;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: ${RED};
                font-weight: 700;
              ">You may resubmit</p>
              <p style="
                margin: 0;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 13px;
                line-height: 1.7;
                color: ${GRAY_700};
              ">
                Provide additional identifying details — such as a unique marking, serial number,
                or a photo of the item — to strengthen your next claim.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding: 32px 48px 44px;">
        ${ctaButton("Resubmit My Claim", "#")}
      </td>
    </tr>
  `);

  await sendEmail({
    to: email,
    subject: `Claim Not Approved — ${itemName}`,
    html,
    text: `Your claim for "${itemName}" was not approved. Please resubmit with additional identifying details.`,
  });
};

export const sendOtpEmail = async ({ email, otp }) => {
  const html = base(`
    
    <!-- Eyebrow -->
    <tr>
      <td style="padding: 36px 48px 0;">
        <p style="
          margin: 0 0 16px;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${RED};
          font-weight: 600;
        ">Password Reset</p>

        <h1 style="
          margin: 0 0 12px;
          font-family: 'Georgia', serif;
          font-size: 28px;
          font-weight: normal;
          line-height: 1.3;
          color: ${GRAY_900};
          letter-spacing: -0.01em;
        ">
          Your verification<br/>code
        </h1>

        <p style="
          margin: 0;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: ${GRAY_700};
        ">
          Use the following OTP to reset your password. This code is valid for 10 minutes.
        </p>
      </td>
    </tr>

    <!-- Divider -->
    <tr>
      <td style="padding: 28px 48px 0;">
        <hr style="border: none; border-top: 1px solid ${GRAY_100}; margin: 0;" />
      </td>
    </tr>

    <!-- OTP BOX -->
    <tr>
      <td style="padding: 32px 48px 0; text-align: center;">
        <div style="
          display: inline-block;
          padding: 18px 36px;
          background: ${GRAY_50};
          border: 1px solid ${GRAY_100};
          border-radius: 4px;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: ${RED};
        ">
          ${otp}
        </div>
      </td>
    </tr>

    <!-- Info -->
    <tr>
      <td style="padding: 28px 48px 44px;">
        <p style="
          margin: 0;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 13px;
          line-height: 1.7;
          color: ${GRAY_400};
        ">
          If you did not request this, you can safely ignore this email.
        </p>
      </td>
    </tr>
  `);

  await sendEmail({
    to: email,
    subject: "Your OTP Code — FindIt",
    html,
    text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
  });
};