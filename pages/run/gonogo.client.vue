<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();

const TRIAL_DURATION = 1000; // 1 second
const FIXATION_DURATION = 500; // 0.5 seconds
const N_GOTRIALS = 5;
const N_NOGOTRIALS = 2;
const N_TOTALTRIALS = N_GOTRIALS + N_NOGOTRIALS;

import 'jspsych/css/jspsych.css';
import {initJsPsych} from 'jspsych';
import callFuncion from '@jspsych/plugin-call-function';
import preload from '@jspsych/plugin-preload';
import instructions from '@jspsych/plugin-instructions';
import htmlButtonResponse from '@jspsych/plugin-html-button-response'
import imageButtonResponse from '@jspsych/plugin-image-button-response'

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

console.log(fixation_cross);
const living_stimuli = [
  `${spatialurl.data.publicUrl}aliens/alien_trans_1.png`,
  `${spatialurl.data.publicUrl}aliens/astronaut_trans_1.png`,
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
  const go_index = go_stimulus == "astronaut" ? 1 : 0;
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
timeline.push(testpreload);
timeline.push({
  type: instructions,
  pages: [`
    <p>V úloze uvidíte obrázky s astronautem a mimozemšťanem. Vaším úkolem bude kliknout na obrázek, pokud uvidíte astronauta.</p>
  `],
  choices: ['Ano, budu klikat jen na astronauta'],
  show_clickable_nav: true
});

timeline.push(...first_block.flat());
timeline.push({
  type: instructions,
  pages: [`
    <p>Nyní se situace trochu obrátí. Klikejte pouze na mimozemšťana a astronauta nechte být :)</p>
  `],
  choices: ['Ano, budu klikat jen na astronauta'],
  show_clickable_nav: true
});

timeline.push(...second_block.flat());
timeline.push({
  type: instructions,
  pages: [`
    <p>A teď to ještě trochu zkomplikujeme. Klikejte pouze na raketu, kterou vidíte níže na obrázku a na nic jiného.</p>
    <img src=${spaceship_stimuli[0]} class="max-w-none" style="margin:auto" width="512" height="512"/>
  `],
  choices: ['Ano, budu klikat jen na raketu'],
  show_clickable_nav: true
});
timeline.push(...third_block.flat());

timeline.push({
  type: instructions,
  pages: [`
    <p>A zase naopak. Klikejte na všechno KROMĚ rakety.</p>
    <img src=${spaceship_stimuli[0]} class="max-w-none" style="margin:auto" width="512" height="512"/>
  `],
  choices: ['Ano, budu klikat na všechna UFO a ne na raketu'],
  show_clickable_nav: true
});

timeline.push(...fourth_block.flat());


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