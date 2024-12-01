import 'jspsych/css/jspsych.css';
import callFuncion from '@jspsych/plugin-call-function';
import htmlButtonResponse from '@jspsych/plugin-html-button-response'

export const timeline_hideFooter = () => {
  const trial = {
    type: callFuncion,
    func: () => {
     const footer = document.getElementById("footer-div");
     const header = document.getElementById("test-name-header");
     if (footer != null && header != null) {
       footer.style.display = "none";
       header.style.display = "none";
     } else {
       console.error("Footer (footer-div) or header (test-name-header) not found");
     }
    }
  }
  return trial;
}

export const timeline_confirmOfficialAttempt = () => {
  const trial = {  
  type: htmlButtonResponse,
  stimulus: `
    <div class="max-w-2xl mx-auto text-center">
      <h2 class="mb-4">Oficiální pokus</h2>
      <p class="mb-4">Neboť jsi přihlášená/ý, toto jhe tvůj oficiální pokus. Oficální pokus můžeš absolvovat pouze jednou.</p>
      <p class="mb-4">Pokud si chceš ještě test natrénovat, klidně se odhlaš se a mužeš trénovat jak dlouho je potřeba.</p>
      <h2 class="mb-4"> Ticho a klid</h2>
      <p> Měl bys taky být v klidném a tichém prostředí. Úlohy vyžadují koncentraci když tě v průběhu někdo vyruší, může ti pokus pokazit.</p>
    </div>`,
    choices: ['Rozumím, jdeme na to'],
  }
  return trial;
}

export const timeline_pcMouseWarning = () => {
  const trial = {
  type: htmlButtonResponse,
  // napiš krátké upozornění, že test byl připraven tak, aby byl dělaný na počítači na monitoru s myší
  // dá se udělat na tabletu či pomocí touchpadu, ale myš by měla být nejlepší
  stimulus: `
  <div class="max-w-2xl mx-auto text-center">
    <h1 class="mb-4"> Upozornění </h1>
    <p> Úloha byly zamýšlena pro použití na počítači/notebooku s myší. </p>
    <p> Pokud máš tablet či mobilní telefon, nemusí se vše zobrazovat správně. Touchpad ti může komplikovat rychlé klikání u úloh, kde hodnitíme čas, ti tak můžou přihoršit.</p>
    <p> Obrázky i všechna tlačítka by měla být vždy viditelná na obrazovce. Pokud se ti něco nezobrazuje a musíš scrollovat, zkus ve webovém prohlížeči lehce změnšit zoom na 90% či méně.</p>
    <p> Pokud jsi připraven/a, jdeme na to! </p>
  </div>`,
  choices: ['Beru na vědomí']
  }
  return trial;
}

// create a saving call function
export const confirm_attempt = async (client, test_name) => {
  if (client == null) {
    console.error('Supabase client is not available');
    return
  }
  try {
    const updates = {
      test_name: test_name,
      test_results: test_data,
    }
    const { error } = await client.from('TestResults').insert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    })
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {

  }
}

// create a saving call function
export const save_test_data = async (jspsych, test_name, client) => {
  if (client == null) {
    console.error('Supabase client is not available');
    return
  }
  try {
    const test_data = jspsych.data.get().json();
    const updates = {
      test_name: test_name,
      test_results: test_data,
    }
    const { error } = await client.from('TestResults').insert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    })
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {

  }
}