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
    images: ["/images/stimuli/test/stimulusA.jpg", "/images/stimuli/test/stimulusB.jpg"]
};
timeline.unshift(testpreload);

var welcome = {
  type: htmlButtonResponse,
  stimulus: "Vítejte v testu rozpoznávání emocí. Stiskněte libovolnou klávesu pro pokračování.",
  choices: ["Pokračovat"]
};

/* Instructions */
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

/* Main trial */
var emotion_long_trial = {
    type: htmlButtonResponse,
    stimulus: function() {return `
      <div class="jspsych-image-button-response-stimulus div-emotion">
        <img src="${jsPsych.evaluateTimelineVariable('image')}" class="img-emotion"/>
      </div>`
    },
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