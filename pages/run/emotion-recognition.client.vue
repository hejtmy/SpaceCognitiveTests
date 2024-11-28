<script setup>

const user = useSupabaseUser();
const client = useSupabaseClient();

import 'jspsych/css/jspsych.css';
import {initJsPsych} from 'jspsych';
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

/* Create timeline */
var timeline = [];

var testpreload = {
    type: preload,
    images: stimuli,
};
timeline.unshift(testpreload);

const emotionstimuliurl = client.storage.from("test-stimuli").getPublicUrl('nback/')
// select random 3 from each category
anger_images = Array.from({length: 3}, () => Math.floor(Math.random() * 42) + 1)

var welcome = {
  type: htmlButtonResponse,
  stimulus: "Vítejte v testu rozpoznávání emocí. Stiskněte libovolnou klávesu pro pokračování.",
  choices: ["Pokračovat"]
};

var testinstructions = {
  type: instructions,
  pages: [`
      <p>In this experiment, you will see faces displaying different emotions.</p>
      <p>Select the emotion you think is being displayed by clicking one of the buttons.</p>
      <p>Press any key to begin.</p>
  `],
   choices: ['Souhlasím, pokračovat'],
    show_clickable_nav: true
};

var test_stimuli = [
  "/images/stimuli/test/stimulusA.jpg",
  "/images/stimuli/test/stimulusB.jpg"
];

 // Create long trials
sequence.forEach((stimulus, index) => {
  timeline.push({
    type: imageButtonResponse,
    stimulus: stimulus,
    choices: ['match'],
    stimulus_duration: null, // Show until response
    trial_duration: null, // No timeout
    margin_vertical: '10px',
    stimulus_height: 512,
    stimulus_width: 512,
    render_on_canvas: false, // Allows the image to be clickable
    button_class: 'jspsych-btn',
    data: {
      trial_type: 'long',
      trial_index: index,
      stimulus: stimulus,
    },
    on_finish: (data) => {
      // Score the response (1 = Match button clicked)
      data.correct = (isTarget && data.response === 1) || 
      (!isTarget && data.response === 0)
  },
  post_trial_gap: 500
  })
})


/* Main trial */
var emotion_long_trial = {
    type: htmlButtonResponse,
    stimulus: image,
    stimulus_duration: null, // Show until response
    trial_duration: null, // No timeout
    margin_vertical: '10px',
    button_html: (choice) => `<button class="jspsych-btn btn-emotion">${choice}</button>`,
    choices: ['Fear', 'Happiness', 'Surprise', 'Anger', 'Sadness', 'Neutral'],
    post_trial_gap: 1000,
    data: {
      task: 'emotion_recognition',
      image: jsPsych.timelineVariable('image')
    }
};

var emotion_long_trial2 = {
    type: imageButtonResponse,
    stimulus: jsPsych.timelineVariable('image'),
    stimulus_duration: null, // Show until response
    trial_duration: null, // No timeout
    margin_vertical: '10px',
    stimulus_height: 512,
    stimulus_width: 512,
    button_html: (choice) => `<button class="jspsych-btn">${choice}</button>`,
    choices: ['Fear', 'Happiness', 'Surprise', 'Anger', 'Sadness', 'Neutral'],
    post_trial_gap: 1000,
    data: {
      task: 'emotion_recognition',
      image: jsPsych.timelineVariable('image')
    }
};

timeline.push(welcome);
timeline.push(testinstructions);
timeline.push(test_procedure);

onMounted(() => {
  jsPsych.run(timeline)
})

</script>
<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
    <CestaHeader />
    <main class="grow">
      <CestaTestFrame testName="Rozpoznávání emocí"/>
    </main>
    <CestaFooter />
  </div>
</template>

<style>
.btn-emotion{
  flex-wrap: wrap!important;
  max-width: 100%;
}

.div-emotion{
  margin: auto;
  justify-content: center;
  width: 512px;
  height: 512px;
}

.img-emotion{
  width: 100%;
  height: 100%;
}
</style>