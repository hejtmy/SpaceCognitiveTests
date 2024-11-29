<script setup>

const user = useSupabaseUser();
const client = useSupabaseClient();

import 'jspsych/css/jspsych.css';
import {initJsPsych} from 'jspsych';
import preload from '@jspsych/plugin-preload';
import instructions from '@jspsych/plugin-instructions';
import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import imageButtonResponse from '@jspsych/plugin-image-button-response';

// CONSTANTS -------
const N_IMAGES = 40;
const EMOTIONS = ['Fear', 'Happiness', 'Surprise', 'Anger', 'Sadness', 'Neutral'];
const EMOTION_STIMULI_URL = client.storage.from("test-stimuli").getPublicUrl('emotions/');

jsPsych = initJsPsych({
  display_element: 'jspsych-target',
  on_finish: () => {
    const data = jsPsych.data.get().json()
  }
})

function create_stimuli(emotionurl, emotion, n_images){
  const possible_images = Array.from({length: N_IMAGES}, (_, i) => i + 1)
  const selected_images = jsPsych.randomization.sampleWithoutReplacement(possible_images, n_images);
  const stimuli = selected_images.map(num => `${emotionurl.data.publicUrl}/${emotion}/${emotion}_${num}.jpg`);
  return stimuli;
}

function extract_emotion(url){
  const emotion = url.split('/').slice(-2, -1)[0];
  return emotion;
} 

function create_emotion_trial(index, stimulus) { 
  const emotion = extract_emotion(stimulus);
  const trial = {
    type: imageButtonResponse,
    stimulus: jsPsych.timelineVariable('image'),
    stimulus_duration: null,
    trial_duration: null,
    margin_vertical: '10px',
    stimulus_height: 512,
    stimulus_width: 512,
    button_html: (choice) => `<button class="jspsych-btn">${choice}</button>`,
    choices: ['Fear', 'Happiness', 'Surprise', 'Anger', 'Sadness', 'Neutral'],
    post_trial_gap: 1000,
    data: {
      task: 'emotion_recognition',
      emotion: emotion,
    }
  }
  return trial;
};

let stimuli = [];
EMOTIONS.forEach((emotion, index) => {
  const emotion_stimuli = create_stimuli(EMOTION_STIMULI_URL, emotion, 3);
  stimuli = stimuli.concat(emotion_stimuli.map(image => ({image: image})));
});
const first_block = jsPsych.randomization.shuffle(stimuli);
console.log(first_block);
// TIMELINE -------

var timeline = [];
timeline.unshift({
    type: preload,
    images: stimuli,
});

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

timeline.push(testinstructions);

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