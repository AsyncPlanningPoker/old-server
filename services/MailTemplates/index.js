const urlBackResetPassword = `${process.env.URL_FRONT}/recovery-password/reset-password`

const resetPassword = ({ token, username }) => {
  return {
    text: `Abra no seu navegador a url: "${urlBackResetPassword}/${token}"`,
    html: `
    <div id="container" style="background-color: #fff; text-align: center;">
      <div id="header" style="width: 100%; background-color: #1a237e; color: #fff;">
          <h1>Async Planning Poker</h1>
      </div>
      <h2 style="color: #444;">Redifinir senha</h2>
      <div class="divider" style="background-color: #1a237e; width: 100%; height: 5px;"></div>
      <div id="content" style="background-color: #fff; text-align: justify; padding: 20px 40px;">
          <h3 style="color: #1a237e;">Olá ${username}, tudo bom?</h3>
          <p>
              Recebemos sua solicitação de alteração de senha da sua conta. Para realizá-la, clique no link abaixo e preencha os campos solicitados.
          </p>
          <a href="${urlBackResetPassword}/${token}">Nova senha</a>
          <p>
              Se o link não funcionar, copie o endereço abaixo e cole no seu navegador
          </p>
          <p>
              <strong>${urlBackResetPassword}/${token}</strong>
          </p>
      </div>
    </div>
    `,
  }
}

const genericMail = ({ message }) => {
  return {
    text: ``,
    html: `
    <p>
      ${message}
    </p>
    `,
  }
}

module.exports = {
  resetPassword,
  genericMail
};
