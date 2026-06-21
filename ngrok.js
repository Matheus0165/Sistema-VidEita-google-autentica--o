require('dotenv').config({ path: '.env.ngrok' });

const ngrok = require('@ngrok/ngrok');

(async function () {
  try {
    const listener = await ngrok.forward({
      addr: 8080,
      authtoken: process.env.NGROK_AUTHTOKEN
    });

    console.log('VidEita online em:');
    console.log(listener.url());

    process.stdin.resume();
  } catch (error) {
    console.error('Erro ao iniciar ngrok:');
    console.error(error);
  }
})();
