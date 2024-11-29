<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();

const TRIAL_DURATION = 1000; // 1 second
const FIXATION_DURATION = 500; // 0.5 seconds
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
  spaceship_stimuli.push(`${spatialurl.data.publicUrl}ships/UFO_trans_${i}.png`)
}
const all_stimuli = living_stimuli.concat(spaceship_stimuli).concat(fixation_cross);
const testpreload = {
  type: preload,
  images: all_stimuli,
};

function create_trial_astronautgo(index, go, go_stimulus) {
  const go_index = go_stimulus == "astronaut" ? 1 : 0;
  // if go and go_index is 1, then the astronaut is the go stimulus
  const img = go ? living_stimuli[go_index] : living_stimuli[1 - go_index];
  return {
    type: htmlButtonResponse,
    stimulus: "",
    button_html: (choice, index) => `<img src=${choice} class="max-w-none" width="512" height="512"/>`,
    choices: [img],
    stimulus_duration: TRIAL_DURATION, // Show until response
    trial_duration: TRIAL_DURATION, // No timeout
    margin_vertical: '10px',
    render_on_canvas: true, // Allows the image to be clickable
    data: {
      trial_index: index,
      image: img,
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

const timeline = [];
timeline.push(testpreload);
// add instructions
timeline.push({
  type: instructions,
  pages: [`
    <p>V úloze uvidíte obrázky s astronautem a mimozemšťanem. Vaším úkolem bude kliknout na obrázek, pokud uvidíte astronauta.</p>
  `],
  choices: ['Ano, budu klikat jen na astronauta'],
  show_clickable_nav: true
});

let first_block = Array(10).fill(true).concat(Array(10).fill(false)).map((value, index) => {
  var out = [create_trial_astronautgo(index, value, "astronaut"), create_fixation_cross()];
  return out;
});
first_block = jsPsych.randomization.shuffle(first_block);

// Flatten the array
timeline.push(...first_block.flat());

timeline.push({
  type: instructions,
  pages: [`
    <p>Nyní se situace trochu obrátí. Klikejte pouze na mimozemšťana a astronauta nechte být :)</p>
  `],
  choices: ['Ano, budu klikat jen na astronauta'],
  show_clickable_nav: true
});

let second_block = Array(10).fill(true).concat(Array(10).fill(false)).map((value, index) => {
  var out = [create_trial_astronautgo(index, value, "alien"), create_fixation_cross()];
  return out;
});
second_block = jsPsych.randomization.shuffle(second_block);

// Flatten the array
timeline.push(...second_block.flat());

timeline.push({
  type: instructions,
  pages: [`
    <p>A teď to ještě trochu zkomplikujeme. Klikejte pouze na raketu, kterou vidíte níže na obrázku a na nic jiného</p>
    <img src=${spaceship_stimuli[0]} class="max-w-none" width="512" height="512"/>
  `],
  choices: ['Ano, budu klikat jen na astronauta'],
  show_clickable_nav: true
});

timeline.push({
  type: instructions,
  pages: [`
    <p>A zase naopak. Klikejte na všechno KROMĚ rakety.</p>
    <img src=${spaceship_stimuli[0]} class="max-w-none" width="512" height="512"/>
  `],
  choices: ['Ano, budu klikat jen na astronauta'],
  show_clickable_nav: true
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