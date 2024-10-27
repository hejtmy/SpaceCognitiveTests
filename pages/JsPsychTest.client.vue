<script setup>

import 'jspsych/css/jspsych.css';
import {initJsPsych} from 'jspsych';
import preload from '@jspsych/plugin-preload';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import imageKeyboardResponse from '@jspsych/plugin-image-keyboard-response';

const jsPsych = initJsPsych({display_element: 'jspsych-target'});

const trial = {
  type: htmlKeyboardResponse,
  stimulus: 'Hello world!',
}

/* create timeline */
var timeline = [];

  /* preload images */
  var preloadedImages = {
    type: preload,
    images: [
      '/images/tests/test/stimulusA.jpg', 
      '/images/tests/test/stimulusB.jpg'
  ]};

  timeline.push(preloadedImages);

  /* define welcome message trial */
  var welcome = {
    type: htmlKeyboardResponse,
    stimulus: "Welcome to the experiment. Press any key to begin."
  };

  timeline.push(welcome);

  /* define instructions trial */
  var instructions = {
    type: htmlKeyboardResponse,
    stimulus: `
      <p>In this experiment, a circle will appear in the center 
      of the screen.</p><p>If the circle is <strong>blue</strong>, 
      press the letter F on the keyboard as fast as you can.</p>
      <p>If the circle is <strong>orange</strong>, press the letter J 
      as fast as you can.</p>
      <div style='width: 700px;'>
      <div style='float: left;'><img src='/images/tests/test/stimulusA.jpg'></img>
      <p class='small'><strong>Press the F key</strong></p></div>
      <div style='float: right;'><img src='images/tests/test/stimulusB.jpg'></img>
      <p class='small'><strong>Press the J key</strong></p></div>
      </div>
      <p>Press any key to begin.</p>
    `,
    post_trial_gap: 2000
  };
  timeline.push(instructions);

  /* define trial stimuli array for timeline variables */
  var test_stimuli = [
    { stimulus: "/images/tests/test/stimulusA.jpg",  correct_response: 'f'},
    { stimulus: "/images/tests/test/stimulusB.jpg",  correct_response: 'j'}
  ];

  /* define fixation and test trials */
  var fixation = {
    type: htmlKeyboardResponse,
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: "NO_KEYS",
    trial_duration: function(){
      return jsPsych.randomization.sampleWithoutReplacement([250, 500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
    },
    data: {
      task: 'fixation'
    }
  };

  var test = {
    type: imageKeyboardResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: ['f', 'j'],
    data: {
      task: 'response',
      correct_response: jsPsych.timelineVariable('correct_response')
    },
    on_finish: function(data){
      data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
    }
  };

  /* define test procedure */
  var test_procedure = {
    timeline: [fixation, test],
    timeline_variables: test_stimuli,
    repetitions: 5,
    randomize_order: true
  };
  timeline.push(test_procedure);

  /* define debrief */
  var debrief_block = {
    type: htmlKeyboardResponse,
    stimulus: function() {
      var trials = jsPsych.data.get().filter({task: 'response'});
      var correct_trials = trials.filter({correct: true});
      var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
      var rt = Math.round(correct_trials.select('rt').mean());

      return `<p>You responded correctly on ${accuracy}% of the trials.</p>
        <p>Your average response time was ${rt}ms.</p>
        <p>Press any key to complete the experiment. Thank you!</p>`;

    }
  };
  timeline.push(debrief_block);

// run jsPsych run on load
onMounted(() => {
  jsPsych.run([timeline]);
})


</script>

<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
    <CestaHeader />
    <main class="grow">
      <CestaTestFrame testName="Testujeme jspsych"/>
    </main>
    <Footer />    
  </div>
</template>