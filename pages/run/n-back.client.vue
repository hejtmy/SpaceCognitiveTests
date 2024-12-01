<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();

import 'jspsych/css/jspsych.css';
import {initJsPsych} from 'jspsych';
import preload from '@jspsych/plugin-preload';
import callFuncion from '@jspsych/plugin-call-function';
import htmlButtonResponse from '@jspsych/plugin-html-button-response'
import { timeline_confirmOfficialAttempt, timeline_pcMouseWarning, timeline_hideFooter } from '~/utils/jsPsychUtils';

// Initialize jsPsych
jsPsych = initJsPsych({
  display_element: 'jspsych-target',
  on_finish: () => {
    const data = jsPsych.data.get().json()
  }
})

//CONSTANTS
const TEST_NAME = "n-back";
const NUMBER_OF_STIMULI = 42
const NUMBER_OF_TRIALS = 12
const TRIAL_DURATION = 2000
const IMAGE_WIDTH = 512
const IMAGE_HEIGHT = 512
const N_BACK = 2
const POST_TRIAL_GAP = 500
const N_REPEATED_TRIALS = 3
const NBACKSTIMULIURL = client.storage.from("test-stimuli").getPublicUrl('nback/')

onMounted(() => {
  jsPsych.run(timeline)
})
  
function selectAndDuplicateStrings(arr, n_back, n_stimuli) {
  console.log(`original array: ${arr}`);
  if (arr.length < n_back + 1) {
    throw new Error("Array must contain at least n + 1 elements.");
  }
  //create array of integers from 0 to length of arr
  let indices = Array.from({length: arr.length-1}, (_, i) => i);
  //select randomly n_stimuli from them
  let selected_indices = jsPsych.randomization.sampleWithoutReplacement(indices, n_stimuli);
  let newarr = [...arr];
  // add the elements of the selected indices to the newass immediately after the same elements
  let selected_elements = selected_indices.map(i => arr[i]);
  // add the elements of the selected indices to the newass immediately after the same elements
  selected_elements.forEach((element, index) => {
    //find the position of the element in the newarr
    let position = newarr.indexOf(element);
    //add the element to the newarr immediately after the same element
    newarr.splice(position + 1, 0, element);
  })
  // go through the elements of newarr and if the element is the same as the previous element, move the element one position to the right
  for (let i = 1; i < newarr.length; i++) {
    if (newarr[i] === newarr[i - 1]) {
      let element = newarr.splice(i, 1)[0];
      newarr.splice(i + 1, 0, element);
    }
  }

  console.log(`new array: ${newarr}`);
  return newarr;
}

function generate_stimuli_sequence (n_trials, n_stimuli, folder, prefix, n_repeated) {
  const randomNumbers = Array.from({length: n_trials}, 
    () => Math.floor(Math.random() * n_stimuli) + 1)
  const stimuli = randomNumbers.map(num => `${NBACKSTIMULIURL.data.publicUrl}${folder}/${prefix}${num}.png`);
  return stimuli;
}

function generate_timeline_sequence(stimuli, duration, width, height) {
  let sequence_trials = []
  stimuli.forEach((stimulus, index) => {
    const isTarget = index >= 2 && stimulus === stimuli[index - 2]
    const trial = {
      type: htmlButtonResponse,
      button_html: (choice, index) => `<img src=${choice} class="max-w-none" style="margin:auto;" width="${width}" height="${height}"/>`,
      stimulus: "",
      choices: [stimulus],
      stimulus_duration: duration,
      trial_duration: duration,
      data: {
        trial_index: index,
        stimulus: stimulus,
        is_target: isTarget,
      },
      on_finish: (data) => {
        data.correct = (isTarget && data.response === 1) || 
        (!isTarget && data.response === 0)
      },
      post_trial_gap: POST_TRIAL_GAP
    }
    sequence_trials.push(trial);
  })
  return sequence_trials;
}

let planetstimuli = generate_stimuli_sequence(NUMBER_OF_TRIALS, NUMBER_OF_STIMULI, 'planets', 'nback_planet_')
planetstimuli = selectAndDuplicateStrings(planetstimuli, N_BACK, N_REPEATED_TRIALS)
const planet_sequence = generate_timeline_sequence(planetstimuli, TRIAL_DURATION, IMAGE_WIDTH, IMAGE_HEIGHT);

let abstractstimuli = generate_stimuli_sequence(NUMBER_OF_TRIALS, NUMBER_OF_STIMULI, 'abstract', 'nback_abstract_')
abstractstimuli = selectAndDuplicateStrings(abstractstimuli, N_BACK, N_REPEATED_TRIALS)
const abstract_sequence = generate_timeline_sequence(abstractstimuli, TRIAL_DURATION, IMAGE_WIDTH, IMAGE_HEIGHT);

let fractalstimuli = generate_stimuli_sequence(NUMBER_OF_TRIALS, NUMBER_OF_STIMULI, 'fractals', 'nback_fractals_')
fractalstimuli = selectAndDuplicateStrings(fractalstimuli, N_BACK, N_REPEATED_TRIALS)
const fractal_sequence = generate_timeline_sequence(fractalstimuli, TRIAL_DURATION, IMAGE_WIDTH, IMAGE_HEIGHT);

let thirdfractalstimuli = generate_stimuli_sequence(NUMBER_OF_TRIALS, NUMBER_OF_STIMULI, '3d', 'nback_3d_')
thirdfractalstimuli = selectAndDuplicateStrings(thirdfractalstimuli, N_BACK, N_REPEATED_TRIALS)
const thirdfractal_sequence = generate_timeline_sequence(thirdfractalstimuli, TRIAL_DURATION, IMAGE_WIDTH, IMAGE_HEIGHT);

// Timeline generation ------------------
let timeline = [];
timeline.push(timeline_hideFooter());
timeline.push(timeline_pcMouseWarning());
timeline.unshift({
  type: preload,
  images: planetstimuli.concat(abstractstimuli).concat(fractalstimuli).concat(thirdfractalstimuli),
})

if(user.value) {
  timeline.push(timeline_confirmOfficialAttempt());
  // record official attempt in a database
}
  
// Instructions
timeline.push({
  type: htmlButtonResponse,
  stimulus: `
    <div class="max-w-2xl mx-auto text-center">
      <h1 class="text-2xl font-bold mb-4">2-Back Task</h1>
      <p class="mb-2">Postupně uvidíš sérii několika obrázků</p>
      <p class="mb-2">Tvým úkolem je kliknout na obrázek pokaždé, pokud jsi jej viděl/a předminule. Jinak neklikej! Hodnotíme pouze správnost, nikoli rychlost, ale obrázky rychle mizí, takže musíš stihnout kliknout včas.</p>
      <img src="/images/tutorials/n-back/n-back-abstract.png" class="max-w-none" style="margin:auto;" width="512" height="512"/>
      <p class="mb-2">Tady je příklad. Neboť třetí obrázek je stejný, jako byl ten první (předminulý), tak máš za úkol na něj rychle kliknout.</p>
    </div>
  `,
  choices: ['Začít'],
  post_trial_gap: 1000
})

timeline.push(...abstract_sequence)

timeline.push({
  // button response with a pause screen 
  type: htmlButtonResponse,
  stimulus: `
    <div class="text-center">
      <h2 class="text-xl font-bold mb-4">Výborně! První kus jsi zvládnul/a!</h2>
      <p>V druhé fázi tě čekají fraktálové tvary a vzory, jako vidíš dole. Úloha zústává stejná, klikni na obrázek pokaždé, pokud se shoduje s tím, který jsi viděl/a předminule.</p>
      <img src="/images/tutorials/n-back/n-back-fractals.png" class="max-w-none" style="margin:auto;" width="512"/>
      <p> Až budeš připravený/á, pokračuj dál.</p>
    </div>
  `,
  choices: ['Pokračovat'],
  post_trial_gap: 2000
})
timeline.push(...fractal_sequence)

timeline.push({
  // button response with a pause screen 
  type: htmlButtonResponse,
  stimulus: `
    <div class="text-center">
      <h2 class="text-xl font-bold mb-4">A jsi v polovině!</h2>
      <p>V téhle fázi tě čekají 3D fraktálové tvary a vzory, jako vidíš na obrázku. Úloha zústává stejná, klikni na obrázek pokaždé, pokud se shoduje s tím, který jsi viděl/a předminule.</p>
      <img src="/images/tutorials/n-back/n-back-3d.png" class="max-w-none" style="margin:auto;" width="512"/>
      <p> Až budeš připravený/á, pokračuj dál.</p>
    </div>
  `,
  choices: ['Pokračovat'],
  post_trial_gap: 2000
})
timeline.push(...thirdfractal_sequence)

timeline.push({
  // button response with a pause screen 
  type: htmlButtonResponse,
  stimulus: `
    <div class="text-center">
      <h2 class="text-xl font-bold mb-4">A jedeme do finále!</h2>
      <p>V poslední fázi tě čekají planetky. Ty budou asi nejzapeklitější, všechny vypadají tak trochu stejně. Úloha je stejná, klikni na obrázek pokaždé, pokud se shoduje s tím, který jsi viděl/a předminule.</p>
      <img src="/images/tutorials/n-back/n-back-abstract.png" class="max-w-none" style="margin:auto;" width="512"/>
      <p> Až budeš připravený/á, pokračuj dál.</p>
    </div>
  `,
  choices: ['Pokračovat'],
  post_trial_gap: 2000
})
timeline.push(...planet_sequence)

// push a timeline event which simply saves the data and on finish goes further
timeline.push({
  type: callFuncion,
  async: true,
  func: async (done) => {
    await save_test_data(jsPsych, TEST_NAME, client);
    done();
  }
})

// End message
timeline.push({
  type: htmlButtonResponse,
  stimulus: `
    <div class="text-center">
      <h2 class="text-xl font-bold mb-4">Gratulujeme, hotovo!</h2>
    </div>`,
  choices: ['Zpět k testům'],
  on_finish: () => {
    navigateTo('/tests')
  }
})

</script>
<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
    <CestaHeader />
    <main class="grow">
      <CestaTestFrame testName="N-Back paměťová úloha"/>
    </main>
    <CestaFooter />
  </div>
</template>
