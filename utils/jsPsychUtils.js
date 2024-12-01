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
      <p class="mb-4">Neboť jsi přihlášená/ý, toto bude tvůj oficiální pokus. Oficální pokus můžeš absolvovat pouze jednou. Jakmile začneš, musíš jej dokončit. Pokud pokus přerušíš, vypneš počítač či prohlížeč, již ti nepůjde test začít znovu.</p>
      <p class="mb-4">Pokud si chceš test ještě ozkoušet či natrénovat, tak se odhlaš se a mužeš trénovat anonymně jak dlouho budeš chtít.</p>
      <h2 class="mb-4">Pro tvůj oficiální pokus doporučujeme být v klidném, tichém prostředí. Úlohy vyžadují koncentraci, a když tě v průběhu někdo vyruší, může ti to pokus pokazit.</p>
    </div>`,
    choices: ['Rozumím a jsem připraven/a'],
  }
  return trial;
}

export const timeline_pcMouseWarning = () => {
  const trial = {
  type: htmlButtonResponse,
  // napiš krátké upozornění, že test byl připraven tak, aby byl dělaný na počítači na monitoru s myší
  // dá se udělat na tabletu či pomocí touchpadu, ale myš by měla být nejlepší
  stimulus: `
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="mb-4"> Upozornění </h1>
    <p> Úlohy byly zamýšleny pro použití na počítači/notebooku s myší.</p>
    <p> Pokud máš tablet či mobilní telefon, nemusí se ti vše zobrazovat správně. Pokud nemáš myš, ale touchpad, tak tě to může zpomalit a u mnohých úloh hodnotíme čas.</p>
    <p> Obrázky i všechna tlačítka s odpověďmi by měla u všech úloh snadno dostupná a viditelná na obrazovce. Pokud se ti něco nezobrazuje a musíš třeba scrollovat, aby ses k tlačítku dostal, zkus ve svém prohlížeči lehce změnšit zoom na 90% či méně.</p>
    <p> Pokud nejsi přihlášen/a, můžeš testovat úlohy jak dlouho chceš a najít si tak ideální podmínky pro svůj oficiální pokus :) </p>
    <p> Pokud jsi připraven/a, jdeme na to! </p>
  </div>`,
  choices: ['Beru na vědomí']
  }
  return trial;
}

export const timeline_checkValidAttempt = (client, user, test_name, jsPsych) => {
  const trial = {
    type: callFuncion,
    async: true,
    func: async (done) => {
      const has_attempt = await has_valid_attempt(client, user, test_name);
      jsPsych.data.addProperties({ attempted: has_attempt });
      done();
    }
  }
  return trial;
}

export const timeline_abortOrCreateAttempt = (client, user, test_name, jsPsych) => {
  const trial = { 
    type: callFuncion,
    async: true,
    func: async (done) => {
      if (jsPsych.data.get().values()[0].attempted) {
        jsPsych.abortExperiment(`<p>V tomto testu již evidujeme tvůj oficiální pokus.</p> 
        <p>Pokud si chceš test zopakovat pro zábavu, můžete se odhlásit a zkoušet si jej i dál anonymně.</p>
        </>Pokud se jedná o omyl a o pokus jsi se oficiálně ještě nepokusil/a, prosím ozvi se na hejtmanek@praha.psu.cas.cz</p>`);
      } else {
        await save_attempt(client, user, test_name);
        done()
      }
    }
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
export const save_test_data = async (client, test_name, jsPsych) => {
  if (client == null) {
    console.error('Supabase client is not available');
    return
  }
  try {
    const test_data = jsPsych.data.get().json();
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

export async function save_attempt(client, user, test_name) {
  try {
    const updates = {
      test_name: test_name,
      user_id: user.id,
    }
    const { error } = await client.from('OfficialResults').insert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    })
    if (error) throw error
  } catch (error) {
    alert(error.message);
  } finally {
  }
}

export async function has_valid_attempt(client, user, test_name){
  if(user == null) return false;
  try {
    const { data: attempts, error } = await client.from('OfficialResults').
      select('id').
      eq('test_name', test_name).
      eq('user_id', user.id)
    if (error) throw error
    return attempts.length > 0
  } catch (error) {
    alert(error.message)
  }
}

export async function save_attempt_data(client, user, test_name, jsPsych) {
  try {
    const updates = {
      results: jsPsych.data.get().json(),
    }
    // find record with the same test_name and user_id
    const { data: attempts, searchError } = await client.from('OfficialResults').
      select('id').
      eq('test_name', test_name).
      eq('user_id', user.id)
    if (searchError) throw error
    if (attempts.length == 1) {
      // update the record
      const { updateError } = await client.from('OfficialResults').
        update(updates).
        eq('id', attempts[0].id)
      if (updateError) throw updateError
    } 
    if (attempts.length > 1){
      throw new Error("Multiple attempts found")
    }
    if (attempts.length == 0) {
      // insert a new record
      const updates = {
        test_name: test_name,
        user_id: user.id,
        data: data
      }
      const { insertError } = await client.from('OfficialResults').insert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })
      if (insertError) throw insertError;
    }
  }
  catch (error) {
    alert(error.message)
  }
}

export const timeline_finalMessage = () => {
  const trial = {
    type: htmlButtonResponse,
    stimulus: `<div class="text-center">
        <h2 class="text-xl font-bold mb-4">Perketní!</h2>
        <p>Gratulujeme k úspěšnému zakončení.</p>
      </div>`,
    choices: ['Zpět k testům'],
    on_finish: () => {
      navigateTo('/tests');
    }
  }
  return trial;
}

export const timeline_saveAttemptData = (client, user, test_name, jsPsych) => {
  let trial = {}
  if(user) {
    trial = {
      type: callFuncion,
      async: true,
      func: async (done) => {
        await save_attempt_data(client, user, test_name, jsPsych)
        done();
      }
    }
  } else {
    trial = { 
      type: callFuncion,
      async: true,
      func: async (done) => {
        await save_test_data(client, test_name, jsPsych);
        done();
      }
    }
  }
  return trial;
}
