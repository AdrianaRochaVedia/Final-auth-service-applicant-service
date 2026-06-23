const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const enviarInvitacion = async ({ email, nombre, apellido, tenant_nombre, token }) => {
  const link = `${process.env.FRONTEND_URL}/registro-empleado?token=${token}`;
  //console.log('USER:', process.env.GMAIL_USER);
  //console.log('PASS:', process.env.GMAIL_PASS);
  await transporter.sendMail({
    from: `"${tenant_nombre}" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Invitación para unirte a ${tenant_nombre}`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;background:#EEE9BF;padding:0;border-radius:4px;overflow:hidden;">

        <!-- Header -->
        <div style="background:#79864B;padding:48px 40px;text-align:center;border-bottom:4px solid #78793F;">
          <p style="color:#EEE9BF;margin:0 0 8px;font-size:12px;letter-spacing:4px;text-transform:uppercase;">Invitación oficial</p>
          <h1 style="color:#EEE9BF;margin:0;font-size:30px;font-weight:400;letter-spacing:1px;">${tenant_nombre}</h1>
          <div style="width:48px;height:2px;background:#BDB77C;margin:20px auto 0;"></div>
        </div>

        <!-- Body -->
        <div style="background:#ffffff;padding:48px 40px;">
          <p style="color:#78793F;font-size:13px;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;">Estimado/a</p>
          <h2 style="color:#79864B;font-size:26px;font-weight:400;margin:0 0 24px;border-bottom:1px solid #EEE9BF;padding-bottom:24px;">${nombre} ${apellido}</h2>
          
          <p style="color:#5a5a3a;font-size:15px;line-height:1.8;margin:0 0 16px;">
            Nos complace informarle que ha sido seleccionado para formar parte del equipo de <strong style="color:#78793F;">${tenant_nombre}</strong>.
          </p>
          <p style="color:#5a5a3a;font-size:15px;line-height:1.8;margin:0 0 32px;">
            Para completar su proceso de registro y establecer sus credenciales de acceso, le invitamos a hacer clic en el siguiente enlace.
          </p>

          <div style="text-align:center;margin:40px 0;">
            <a href="${link}" style="
              background:#79864B;
              color:#EEE9BF;
              padding:16px 40px;
              border-radius:2px;
              text-decoration:none;
              font-size:13px;
              font-weight:600;
              letter-spacing:2px;
              text-transform:uppercase;
              display:inline-block;
              border:1px solid #78793F;
            ">Completar registro</a>
          </div>

          <!-- Divider -->
          <div style="border-top:1px solid #EEE9BF;margin:40px 0;"></div>

          <!-- Warning -->
          <div style="border-left:3px solid #BDB77C;padding:16px 20px;background:#fafaf5;">
            <p style="color:#8A7D4C;margin:0;font-size:13px;line-height:1.7;">
              Este enlace de acceso tiene una validez de <strong>24 horas</strong> a partir de su recepción. 
              Si usted no solicitó esta invitación, por favor ignore este mensaje.
            </p>
          </div>

          <p style="color:#9CA3AF;font-size:12px;margin:24px 0 0;line-height:1.6;">
            Si el botón no funciona, copie y pegue el siguiente enlace en su navegador:
          </p>
          <p style="color:#79864B;font-size:12px;word-break:break-all;margin:4px 0 0;">
            ${link}
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#78793F;padding:28px 40px;text-align:center;">
          <p style="color:#EEE9BF;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">${tenant_nombre}</p>
          <p style="color:#BDB77C;font-size:11px;margin:0;">Este es un correo institucional generado automáticamente.</p>
        </div>

      </div>
    `
  });
};

module.exports = { enviarInvitacion };