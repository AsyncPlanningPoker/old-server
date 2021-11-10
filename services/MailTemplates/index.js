const urlBackResetPassword = `${process.env.URL_FRONT}/recovery-password/reset-password`

const resetPassword = ({token, username}) => {
  return {
    text: `Abra no seu navegador a url: "${urlBackResetPassword}/${token}"`,
    html: `
        <style>
          body {
            background-color: #f2f2f5;
            padding: 20px;
          }
          #container {
            background-color: #fff;
            text-align: center;
          }
          #header {
            width: 100%;
            background-color: #1a237e;
            color: #fff;
          }
          #container h2 {
            color: #444;
          }
          .divider {
            background-color: #1a237e;
            width: 100%;
            height: 5px;
          }
          #content {
            background-color: #fff;
            text-align: justify;
            padding: 20px 40px;
          }
          #content h3 {
            color: #1a237e;
          }
        </style>

        <div id="container">
          <div id="header">
            <h1>Async Planning Poker</h1>
          </div>
          <h2>Redifinir senha</h2>
          <div class="divider"></div>
          <div id="content">
            <h3>Olá ${username}, tudo bom?</h3>
            <p>
              Recebemos sua solicitação de alteração de senha da sua conta. Para
              realizá-la, clique no link abaixo e preencha os campos solicitados.
            </p>
            <a href="${urlBackResetPassword}/${token}">Nova senha</a>
            <p>
              Se o link não funcionar, copie o endereço abaixo e cole no seu
              navegador
            </p>
            <p>
              <strong>${urlBackResetPassword}/${token}</strong>
            </p>
          </div>
        </div>
    `,
  }
}

module.exports = {
  resetPassword
};
