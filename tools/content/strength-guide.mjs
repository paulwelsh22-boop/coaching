/* Long-form content for the strength training guide. {r} is replaced with the relative root at build time. */
const link = (href, text) => `<a href="${href}" rel="noopener">${text}</a>`;

export const sections = [
  ['Before you start', `<p>Strength training suits most adults at most ages. The NHS says adults should do ${link('https://www.nhs.uk/live-well/exercise/exercise-guidelines/physical-activity-guidelines-for-adults-aged-19-to-64/', 'strengthening activities on at least two days a week')}, working all the major muscle groups. The World Health Organization says much the same in its ${link('https://www.who.int/publications/i/item/9789240015128', '2020 guidelines')}: muscle-strengthening at moderate or greater intensity, on two or more days a week. The UK Chief Medical Officers' ${link('https://www.gov.uk/government/publications/physical-activity-guidelines-uk-chief-medical-officers-report', 'physical activity guidelines')} set the standard for the UK.</p>
<p>If you have a medical condition, an injury or ongoing pain, are pregnant or have recently given birth, or are unsure whether it is right for you, speak to your doctor first. A short screening questionnaire such as the PAR-Q+ is a sensible way to check, and any coach worth hiring will ask you to complete one. You can read more in the <a href="{r}health-disclaimer/">health disclaimer</a>.</p>
<p>This guide is general, not a personal plan. Use it to understand the shape of a sensible first month, then adjust to where you are.</p>`],

  ['Why two or three sessions a week', `<p>Two sessions a week meets the guidelines. Three gives you a little more practice at each movement. For people who have never trained, the American College of Sports Medicine (ACSM) recommended <strong>two to three days a week</strong> in its ${link('https://doi.org/10.1249/MSS.0b013e3181915670', '2009 position stand on resistance training')}, and that is still a sensible starting point.</p>
<p>More is not better at the start. You are learning a skill as well as building strength, and the practice is what makes the later weeks easier. Leave a day between sessions so you arrive fresh enough to move well, and so the work has time to turn into progress.</p>`],

  ['The five movements that matter', `<p>You do not need dozens of exercises. Nearly every good beginner programme is built from five patterns. Each one has an easier version for week one and a harder version for later.</p>
<ul>
<li><strong>Squat.</strong> Sitting down and standing up under control. Start with a box squat, where you sit back to a bench or chair and stand up again, then move to a goblet squat holding one dumbbell at your chest.</li>
<li><strong>Hinge.</strong> Pushing your hips back with a flat back, as in a Romanian deadlift. Practise the movement with no weight first, then add light dumbbells. If you can feel it in the back of your legs, it is working.</li>
<li><strong>Push.</strong> Pressing away from you. An incline push-up with your hands on a bench or sturdy table is the friendliest start. A dumbbell press and, eventually, a full push-up come later.</li>
<li><strong>Pull.</strong> Drawing weight towards you, such as a seated row, a dumbbell row or a band pull. Pulling is often the weaker pattern for beginners, so give it the same attention as pushing.</li>
<li><strong>Carry.</strong> Walking while holding something heavy. A farmer's carry with a dumbbell in each hand builds grip, posture and trunk strength, and it is hard to get wrong.</li>
</ul>
<p>Pick one exercise for each pattern and stick with it for the whole month. Repetition is how a movement stops feeling awkward.</p>`],

  ['Your first 4 weeks', `<p>Two or three sessions a week, 30 to 50 minutes each, with a rest day between. Every session follows the same shape, so you always know what is coming.</p>
<ol>
<li><strong>Warm up for five to ten minutes.</strong> Start with an easy walk or a few minutes on a bike, then do a handful of bodyweight squats, hip hinges and wall push-ups.</li>
<li><strong>Squat.</strong> Box squat or goblet squat, two sets of 8 to 10 reps.</li>
<li><strong>Hinge.</strong> Romanian deadlift with light dumbbells, two sets of 8 to 10 reps.</li>
<li><strong>Push.</strong> Incline push-up, two sets of 8 to 10 reps.</li>
<li><strong>Pull.</strong> Seated or dumbbell row, two sets of 8 to 10 reps.</li>
<li><strong>Carry.</strong> Farmer's carry, two walks of about 20 to 30 metres.</li>
</ol>
<p>Then the month itself:</p>
<ol>
<li><strong>Week 1: learn.</strong> Use light weights and aim for smooth, repeatable reps. Two sessions is plenty. The aim is to finish feeling that you could have done more.</li>
<li><strong>Week 2: repeat.</strong> Same exercises, same weights. Add a third session if you are recovering well, and a third set if it still feels comfortable.</li>
<li><strong>Week 3: add a little.</strong> If every rep felt controlled with a couple to spare, add the smallest increase available, or one more rep per set.</li>
<li><strong>Week 4: review.</strong> Keep the weights steady, notice what feels easier than it did in week one, and pick one thing to improve next month.</li>
</ol>`],

  ['How heavy should it feel?', `<p>The ACSM recommended that novices train with loads they can lift for roughly <strong>8 to 12 repetitions</strong> and use <strong>one to three sets</strong> per exercise to begin with. It also noted that while you are learning form, moderate loads of around 50 to 60 percent of your one-rep maximum, or less, are appropriate because technique comes first.</p>
<p>In everyday terms, that means picking a weight you could lift more than 12 times if you had to, and stopping well before you hit your limit. A useful rule of thumb, based on the reps-in-reserve approach described by ${link('https://doi.org/10.1519/SSC.0000000000000218', 'Helms and colleagues')}, is to finish each set with <strong>two or three reps still in the tank</strong>. You are guessing how many more you could do, which is a skill that improves with practice.</p>
<p>The NHS gives a simpler cue for strengthening activity: work to the point where you need a short rest before repeating it. If your form breaks down, or you have to grit your teeth, the weight is too heavy for now. Muscle soreness a day or two after your first sessions is normal. Sharp pain is not, so stop and get advice if you have it.</p>`],

  ['How to progress without rushing', `<p>Progress comes from doing slightly more over time, not from a hard session once a week. The ACSM's guidance for increasing load is to go up by <strong>2 to 10 percent</strong> once you can complete the current weight for one or two reps more than your target.</p>
<p>In practice, with small dumbbells the smallest jump can be bigger than 10 percent. That is why adding a rep or a set first is often the smoother route: do 8 reps one week, 9 the next, then 10, then move up in weight and drop back to 8. Write your sessions down. A few lines in a notebook or a notes app turns vague feelings into evidence you can see.</p>`],

  ['What to expect', `<p>Beginners often get stronger quickly, and not all of it is muscle. In a classic review of the research, ${link('https://pubmed.ncbi.nlm.nih.gov/3057313/', 'Sale (1988)')} described how strength training changes the nervous system, so that your brain gets better at activating the muscles you already have. That is one reason you can feel noticeably stronger within weeks, before you look any different.</p>
<p>Visible changes take longer and vary from person to person, depending on your starting point, your sleep, how you eat and how consistently you train. Treat any promise of fast, guaranteed results as a red flag. The things you can count on are that exercises feel more familiar, weights feel lighter and you start the next session with more confidence.</p>`],

  ['Common beginner mistakes', `<ul>
<li><strong>Doing too much, too soon.</strong> Big first weeks lead to big sore weeks and quiet gyms.</li>
<li><strong>Changing the programme every session.</strong> You need repetition to get better at a movement. Keep the same exercises for at least a month.</li>
<li><strong>Skipping the warm-up.</strong> Five minutes of easy movement makes the first working set feel far better.</li>
<li><strong>Training to failure every set.</strong> You do not need to grind. Leaving a couple of reps in reserve lets you train again in two days.</li>
<li><strong>Skipping the pulling and the legs.</strong> Many beginners go straight to what they can see in the mirror. Balance the five movements.</li>
<li><strong>Judging progress by the scale alone.</strong> Track weights, reps and how movements feel. Those change first.</li>
<li><strong>Comparing yourself with the person next to you.</strong> They are not on your timeline.</li>
</ul>`],

  ['Do you need a gym?', `<p>A gym makes it easier to progress because you have a range of weights and machines, and the smallest increases are easy to find. But you can begin at home with a pair of dumbbells or resistance bands, a sturdy chair or bench, and bodyweight versions of the movements. If you start at home, you can move to a gym later with the technique already in place. The most important piece of equipment is a plan you will actually follow.</p>`],

  ['How Paul Welsh Coaching approaches this', `<p>I bring strength fundamentals and beginner calisthenics together, then build the plan around where you actually are. Your training lives in an app, with exercise demos and regular check-ins so you know what to do and someone notices when you do it. I hold the Active IQ Level 3 Diploma in Personal Training, and you can read more <a href="{r}about/">about me</a>. See <a href="{r}coaching/">how coaching works</a>, or read the <a href="{r}blog/beginner-calisthenics-where-to-start/">beginner calisthenics guide</a> if you would rather start with bodyweight.</p>`],

  ['Sources', `<ol class="sources">
<li>NHS. ${link('https://www.nhs.uk/live-well/exercise/exercise-guidelines/physical-activity-guidelines-for-adults-aged-19-to-64/', 'Physical activity guidelines for adults aged 19 to 64')}.</li>
<li>Department of Health and Social Care. ${link('https://www.gov.uk/government/publications/physical-activity-guidelines-uk-chief-medical-officers-report', 'Physical activity guidelines: UK Chief Medical Officers\' report')}. First published 7 September 2019.</li>
<li>Bull FC, Al-Ansari SS, et al. ${link('https://www.who.int/publications/i/item/9789240015128', 'World Health Organization 2020 guidelines on physical activity and sedentary behaviour')}. British Journal of Sports Medicine 2020;54(24):1451-1462.</li>
<li>Ratamess N, et al. ${link('https://doi.org/10.1249/MSS.0b013e3181915670', 'American College of Sports Medicine position stand: progression models in resistance training for healthy adults')}. Medicine &amp; Science in Sports &amp; Exercise 2009;41(3):687-708. The figures for novices in this guide (two to three days a week, 8 to 12 repetitions, one to three sets, 2 to 10 percent load increases) come from this stand. ACSM has since published an ${link('https://acsm.org/science-spotlight-acsm-releases-new-position-stand-on-resistance-training/', 'updated position stand (2026)')}.</li>
<li>Helms ER, Cronin J, Storey A, Zourdos MC. ${link('https://doi.org/10.1519/SSC.0000000000000218', 'Application of the repetitions in reserve-based rating of perceived exertion scale for resistance training')}. Strength and Conditioning Journal 2016;38(4):42-49.</li>
<li>Sale DG. ${link('https://pubmed.ncbi.nlm.nih.gov/3057313/', 'Neural adaptation to resistance training')}. Medicine &amp; Science in Sports &amp; Exercise 1988;20(5 Suppl):S135-45.</li>
</ol>`],
];

export const faq = [
  ['How many times a week should a beginner do strength training?', 'Two or three sessions a week, on non-consecutive days, is a sensible starting point for most beginners. UK and WHO guidelines ask for strengthening activity on at least two days a week, and the American College of Sports Medicine recommended two to three days for novices.'],
  ['How heavy should the weights be when I start?', 'Light enough that you can keep good form for 8 to 12 reps, and heavy enough that the last couple of reps feel like effort. Finish each set with two or three reps in reserve, and add weight in small steps once a weight starts to feel easy.'],
  ['Do I need to go to a gym?', 'A gym makes it easier to progress because you have a range of weights and machines. You can also begin with bodyweight and simple home equipment, then add a gym later.'],
  ['How long should a beginner strength session take?', 'Around 30 to 50 minutes, including a warm-up, is enough. Shorter sessions you repeat consistently beat long ones you dread.'],
  ['How long until I feel stronger?', 'Many beginners notice they can lift more or do more reps within a few weeks, partly because the nervous system adapts quickly. Visible changes take longer and vary between people.'],
  ['Will strength training make me bulky?', 'Not by accident. Building a lot of muscle takes years of focused training and eating for it. For most beginners the early changes are feeling stronger, moving better and having more confidence.'],
];
