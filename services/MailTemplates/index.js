const urlBackResetPassword = `${process.env.URL_FRONT}/recovery-password/reset-password`
const urlAcessRound = `${process.env.URL_FRONT}/game`

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
              Se o link não funcionar, copie o endereço abaixo e cole no seu navegador.
          </p>
          <p>
              <strong>${urlBackResetPassword}/${token}</strong>
          </p>
      </div>
    </div>
    `,
  }
}

const newRound = ({ username, pokerId, pokerName, storyId, storyName, roundNumber }) => {
  return {
    text: `Abra no seu navegador a url: "${urlAcessRound}/${pokerId}/${storyId}"`,
    html: `
    <div id="container" style="background-color: #fff; text-align: center;">
      <div id="header" style="width: 100%; background-color: #1a237e; color: #fff;">
          <h1>Async Planning Poker</h1>
      </div>
      <h2 style="color: #444;">Novo round esperando seu voto</h2>
      <div class="divider" style="background-color: #1a237e; width: 100%; height: 5px;"></div>
      <div id="content" style="background-color: #fff; text-align: justify; padding: 20px 40px;">
          <h3 style="color: #1a237e;">Olá ${username}, tudo bom?</h3>
          <p>
              Parece que um novo round de número ${roundNumber} foi iniciado no poker ${pokerName} para a história ${storyName}. Para votar, logue-se e clique no link abaixo.
          </p>
          <a href="${urlAcessRound}/${pokerId}/${storyId}">NovoRound</a>
          <p>
              Se o link não funcionar, copie o endereço abaixo e cole no seu navegador.
          </p>
          <p>
              <strong>${urlAcessRound}/${pokerId}/${storyId}</strong>
          </p>
      </div>
    </div>
    `,
  }
}

const roundFinished = ({ username, pokerId, pokerName, storyId, storyName, roundNumber }) => {
  return {
    text: `Abra no seu navegador a url: "${urlAcessRound}/${pokerId}/${storyId}"`,
    html: `
    <div id="container" style="background-color: #fff; text-align: center;">
      <div id="header" style="width: 100%; background-color: #1a237e; color: #fff;">
          <h1>Async Planning Poker</h1>
      </div>
      <h2 style="color: #444;">Round finalizado</h2>
      <div class="divider" style="background-color: #1a237e; width: 100%; height: 5px;"></div>
      <div id="content" style="background-color: #fff; text-align: justify; padding: 20px 40px;">
          <h3 style="color: #1a237e;">Olá ${username}, tudo bom?</h3>
          <p>
              O round ${roundNumber} criado para a história ${storyName} no poker ${pokerName} foi finalizado. Acesse o link abaixo caso seja necessário iniciar um novo round.
          </p>
          <a href="${urlAcessRound}/${pokerId}/${storyId}">Nova senha</a>
          <p>
              Se o link não funcionar, copie o endereço abaixo e cole no seu navegador.
          </p>
          <p>
              <strong>${urlAcessRound}/${pokerId}/${storyId}</strong>
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
  newRound,
  roundFinished,
  genericMail
};
