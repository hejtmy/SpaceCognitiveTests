<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();

const TRIAL_DURATION = 1000; // 1 second
const FIXATION_DURATION = 500; // 0.5 seconds
const N_GOTRIALS = 5;
const N_NOGOTRIALS = 2;
const N_TOTALTRIALS = N_GOTRIALS + N_NOGOTRIALS;

const POST_TRIAL_GAP = 2000;

import 'jspsych/css/jspsych.css';
import {initJsPsych} from 'jspsych';
import callFuncion from '@jspsych/plugin-call-function';
import preload from '@jspsych/plugin-preload';
import htmlButtonResponse from '@jspsych/plugin-html-button-response'
import imageButtonResponse from '@jspsych/plugin-image-button-response'
import { timeline_hideFooter } from '~/utils/jsPsychUtils';
import { navigateTo } from 'nuxt/app';

// Initialize jsPsych
jsPsych = initJsPsych({
  display_element: 'jspsych-target',
  on_finish: () => {
    const data = jsPsych.data.get().json()
  }
})

const spatialurl = client.storage.from("test-stimuli").getPublicUrl('gonogo/');
const fixation_cross = client.storage.from("test-stimuli").
  getPublicUrl("fixation_cross.png").data.publicUrl;

const living_stimuli = [
  `${spatialurl.data.publicUrl}aliens/astronaut_trans_1.png`,
  `${spatialurl.data.publicUrl}aliens/alien_trans_1.png`,
]

const spaceship_stimuli = [
  `${spatialurl.data.publicUrl}ships/rocket_trans_1.png`
]
for (let i = 1; i <= 10; i++) {
  spaceship_stimuli.push(`${spatialurl.data.publicUrl}ships/UFO_trans_${i}.png`);
}
const all_stimuli = living_stimuli.concat(spaceship_stimuli).concat(fixation_cross);

const testpreload = {
  type: preload,
  images: all_stimuli,
};

function create_living_stimulus(go_stimulus, go) {
  const go_index = go_stimulus == "astronaut" ? 0 : 1;
  return go ? living_stimuli[go_index] : living_stimuli[1 - go_index];
}

function create_spaceship_stimulus(go_stimulus, go, index) {
  let i = -1;
  if (go_stimulus == "rocket") {
    i = go ? 0 : (index + 1);
  }
  if (go_stimulus == "alien") {
    i = go ? (index + 1) : 0;
  }
  console.log(spaceship_stimuli[i]);
  return spaceship_stimuli[i];
}

function create_trial_gonogo(index, block, go, type, go_stimulus, stimulus_index) {
  let stimulus = "";
  if(type == "living") {
    stimulus = create_living_stimulus(go_stimulus, go);
  } 
  if (type == "spaceship") {
    stimulus = create_spaceship_stimulus(go_stimulus, go, stimulus_index);
  }
  return {
    type: htmlButtonResponse,
    stimulus: "",
    button_html: (choice, index) => `<img src=${choice} class="max-w-none" style="margin:auto;" width="512" height="512"/>`,
    choices: [stimulus],
    stimulus_duration: TRIAL_DURATION, // Show until response
    trial_duration: TRIAL_DURATION, // No timeout
    margin_vertical: '10px',
    render_on_canvas: true, // Allows the image to be clickable
    data: {
      trial_index: index,
      block_number: block,
      image: stimulus,
    },
    on_finish: (data) => { },
    post_trial_gap: 0
  }
}

function create_fixation_cross() {
  return {
    type: imageButtonResponse,
    stimulus: fixation_cross,
    stimulus_height: 512,
    stimulus_width: 512,
    choices: [],
    trial_duration: FIXATION_DURATION,
    post_trial_gap: 0
  }
}

// FIRST BLOCK ------------
let first_block = Array(N_GOTRIALS).fill(true).concat(Array(N_NOGOTRIALS).fill(false)).map((value, index) => {
  var out = [create_trial_gonogo(index, 1, value, "living", "astronaut"), create_fixation_cross()];
  return out;
});
first_block = jsPsych.randomization.shuffle(first_block);

// SECOND BLOCK -----------
let second_block = Array(N_GOTRIALS).fill(true).concat(Array(N_NOGOTRIALS).fill(false)).map((value, index) => {
  var out = [create_trial_gonogo(index, 2, value, "living", "alien"), create_fixation_cross()];
  return out;
});
second_block = jsPsych.randomization.shuffle(second_block);

// THIRD BLOCK -----------
let nogotrials = Array.from({length: N_TOTALTRIALS}, () => Math.floor(Math.random() * 10));
let third_block = Array(N_GOTRIALS).fill(true).concat(Array(N_NOGOTRIALS).fill(false)).map((value, index) => {
  var out = [create_trial_gonogo(index, 3, value, "spaceship", "rocket", nogotrials[index]), create_fixation_cross()];
  return out;
});
third_block = jsPsych.randomization.shuffle(third_block);

// FOURTH BLOCK ----------
nogotrials = Array.from({length: N_TOTALTRIALS}, () => Math.floor(Math.random() * 10));
let fourth_block = Array(N_GOTRIALS).fill(true).concat(Array(N_NOGOTRIALS).fill(false)).map((value, index) => {
  var out = [create_trial_gonogo(index, 4, value, "spaceship", "alien", nogotrials[index]), create_fixation_cross()];
  return out;
});
fourth_block = jsPsych.randomization.shuffle(fourth_block);

// TIMELINE CREATION
const timeline = [];
timeline.push(timeline_hideFooter());
timeline.push(testpreload);

timeline.push({
  type: htmlButtonResponse,
  stimulus: `
    <p>Vítejte v testu reakčního času a pozornosti!</p>
    <p>V úloze uvidíte obrázky s astronautem a mimozemšťanem. Vaším úkolem je kliknout co nejrychleji na obrázek astronauta a neklikat na mimozemšťana.</p>
    <img src="/images/tutorials/gonogo/gonogo-astronaut-go-tutorial.png" class="max-w-none" style="margin:auto" width="512" height="512"/>`,
  choices: ['Budu klikat jen na astronauta'],
  post_trial_gap: POST_TRIAL_GAP,
});

timeline.push(...first_block.flat());
timeline.push({
  type: htmlButtonResponse,
  stimulus: `
    <p>Výborně, první fáze hotová!</p>
    <p>V další fázi se situace obrátí. Klikejte pouze na mimozemšťana a astronauta nechte být!</p>
    <img src="/images/tutorials/gonogo/gonogo-alien-go-tutorial.png" class="max-w-none" style="margin:auto" width="512" height="512"/>`,
  choices: ['Budu klikat jen na mimozemšťana'],
  post_trial_gap: POST_TRIAL_GAP,
});

timeline.push(...second_block.flat());
timeline.push({
  type: htmlButtonResponse,
  stimulus: `
    <p>Výborně, druhá fáze hotová!</p>
    <p>A teď to trochu zkomplikujeme. Budou se zobrazovat obrázky rakety a UFO, ale vaším úkolem je kliknout pouze na raketu, kterou vidíte na obrázku níže, a neklikat na žádné UFO.</p>
    <img src="/images/tutorials/gonogo/gonogo-rocket-go-tutorial.png" class="max-w-none" style="margin:auto" width="512" height="512"/>`,
  choices: ['Budu klikat jen na raketu'],
  post_trial_gap: POST_TRIAL_GAP
});
timeline.push(...third_block.flat());

timeline.push({
  type: htmlButtonResponse,
  stimulus: `
    <p>Výborně. A teď už poslední fáze!</p>
    <p>Budou se opět ukazovat obrázky rakety a různých UFO. Vaším úkolem je klikat na všechny obrázky, ale NEKLIKAT na raketu.</p>
    <img src="/images/tutorials/gonogo/gonogo-ufo-go-tutorial.png" class="max-w-none" style="margin:auto" width="512" height="512"/>`,
  choices: ['Budu klikat na všechna UFO, ne na raketu'],
  post_trial_gap: POST_TRIAL_GAP
});
timeline.push(...fourth_block.flat());

timeline.push({
  type: callFuncion,
  async: true,
  func: async (done) => {
    await save_test_data(jsPsych, client);
    done();
  }
})

timeline.push({
  type: htmlButtonResponse,
  stimulus: `<p>Gratulujeme, test je hotový!</p>`,
  choices: ['Zpět k testům'],
  on_finish: () => {
    navigateTo("/tests");
  }
});

onMounted(() => {
  jsPsych.run(timeline)
})

</script>

<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
  <CestaHeader />
  <main class="grow">
    <CestaTestFrame testName="Reakční čas a pozornost"/>
  </main>
  <CestaFooter />
  </div>
</template>