import 'jspsych/css/jspsych.css';
import {initJsPsych} from 'jspsych';
import preload from '@jspsych/plugin-preload';
import callFuncion from '@jspsych/plugin-call-function';
import instructions from '@jspsych/plugin-instructions';
import htmlButtonResponse from '@jspsych/plugin-html-button-response'
import imageButtonResponse from '@jspsych/plugin-image-button-response'

export const timeline_hideFooter = () => {
  const trial = {
    type: callFuncion,
    func: () => {
     const element = document.getElementById("footer-div");
     if (element) {
       element.style.display = "none";
     } else {
       console.error("Footer (footer-div) not found");
     }
    }
  }
  return trial;
}

export const timeline_confirmOfficialAttempt = () => {
  const trial = {  
  type: htmlButtonResponse,
  stimulus: `<div class="max-w-2xl mx-auto text-center">
        <h1 class="text-2xl font-bold mb-4">2-Back Task</h1>
        <p class="mb-4">Neboť jste přihlášení, toto bude váš oficiální pokus. Oficální pokus můžete absolvovat pouze jednou.</p>
        <p class="mb-4">Pokud si chcete ještě test natrénovat, odhlašte se a můžete trénovat jak dlouho uznáte za vhodné</p>`,
      choices: ['Rozumím, chci pokračovat'],
}
  return trial;
}

// create a saving call function
export const save_test_data = async (jspsych) => {
  if (client == null) {
    console.error('Supabase client is not available');
    return
  }
  try {
    const test_data = jspsych.data.get().json();
    const updates = {
      test_name: 'Spatial Cognition',
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