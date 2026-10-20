/* Blog post content. Links use {r} as the relative-root placeholder, replaced at build time. */
import * as STRENGTH from './content/strength-guide.mjs';
import * as ONLINE from './content/online-coaching-guide.mjs';

export const POSTS = [
  {
    slug: 'how-to-start-strength-training-beginners',
    title: 'How to Start Strength Training: A Beginner Guide to Your First 4 Weeks',
    desc: 'New to strength training? Learn the five basic movements, how hard to train, and a simple four week plan to get started with confidence.',
    h1: 'How to start strength training: your <span class="hl">first 4 weeks</span>',
    cat: 'Strength',
    img: 'paul-welsh-barbell-curl-strength-training.jpg',
    pos: '50% 30%',
    alt: 'Paul Welsh performing a controlled barbell curl in a gym as part of beginner strength training',
    excerpt: 'Where to begin, what to train, and how hard to push in the first month. A simple plan for anyone who has never lifted, or has not for a long time.',
    answer: 'Start with two or three full-body sessions a week, built around five basic movements: squat, hinge, push, pull and carry. Pick weights you can control for 8 to 10 reps, finish each set with a couple of reps still in the tank, and add a little at a time. Learn the technique first. The weight comes later.',
    sections: STRENGTH.sections,
    faq: STRENGTH.faq,
    modified: '2026-10-20',
    related: ['beginner-calisthenics-where-to-start', 'getting-back-into-training-after-a-break'],
  },
  {
    slug: 'beginner-calisthenics-where-to-start',
    title: 'Beginner Calisthenics: Where to Start With Bodyweight Training',
    desc: 'A plain guide to beginner calisthenics: the basic movements, easier versions to start with, and how to progress without rushing.',
    h1: 'Beginner calisthenics: where to start with <span class="hl">bodyweight training</span>',
    cat: 'Calisthenics',
    img: 'l-sit-calisthenics-parallettes-training.jpg',
    pos: '50% 40%',
    alt: 'An athlete holding an L-sit on parallettes, an advanced calisthenics skill built from beginner basics',
    excerpt: 'Calisthenics starts much earlier than handstands and muscle-ups. Here are the basic movements, the easier versions, and how to move on when you are ready.',
    answer: 'Calisthenics is training with your own bodyweight. Beginners should start with the basic patterns of push, pull, squat and core, using easier versions such as incline push-ups, rows and box squats. Get comfortable with control first, then make each movement a little harder when you are ready.',
    sections: [
      ['What calisthenics actually is', `<p>Social media makes it look like handstands and muscle-ups. Underneath, it is simple: you train strength and body control using your own weight, with little or no equipment. Every advanced skill is a series of small, achievable steps, and you start at the first one.</p>`],
      ['What you need', `<p>Not much. A floor, a sturdy table or bench, a step or box to squat to, and a safe place to hang from or row under, such as a gym rig or a bar designed for it. Gymnastic rings and parallettes are useful later, not on day one.</p>`],
      ['Starter movements and where they lead', `<p>Each pattern has an easy entry point and a clear next step. This is why beginners can train alongside experienced people without feeling out of their depth.</p>
<ul>
<li><strong>Push.</strong> Incline push-up on a bench or wall, then lower the incline until you reach a full push-up.</li>
<li><strong>Pull.</strong> Supported hangs and bodyweight rows, then assisted pull-ups. Our <a href="{r}blog/first-pull-up-beginner-timeline/">first pull-up guide</a> covers this in detail.</li>
<li><strong>Squat.</strong> Box squat, then a bodyweight squat to full depth, then deeper or single-leg versions.</li>
<li><strong>Hinge.</strong> Glute bridge, then single-leg bridge and hip hinge variations.</li>
<li><strong>Core.</strong> Dead bug and plank holds, then harder leverage positions such as hollow holds.</li>
</ul>`],
      ['A simple week', `<p>Two or three sessions a week is a good start. Warm up for five to ten minutes, then choose one movement from each of push, pull, squat and core. Do two or three sets of a number of reps you can finish with control, with a couple of reps in reserve. Rest a day between sessions.</p>`],
      ['How to know when to progress', `<p>Move on when you can finish every set with clean form and still have a rep or two left. Then pick the next step on the ladder, such as a lower incline or a bit less assistance. If a new version wrecks your form, go back a step. Progress that feels small is still progress.</p>`],
      ['Calisthenics or weights?', `<p>You do not have to choose. Weights are easy to load in small steps, and bodyweight work teaches control and body awareness. Using both gives you a broader base, which is how I coach. See <a href="{r}coaching/">what coaching includes</a>.</p>`],
    ],
    faq: [
      ['Is calisthenics good for beginners?', 'Yes, when you start with scaled versions of the movements. Incline push-ups, supported hangs and box squats let you train at a level you can control.'],
      ['Can I build muscle with calisthenics?', 'Yes. Bodyweight exercises can build muscle when they challenge you enough. As you get stronger, you progress to harder versions so the work stays challenging.'],
      ['Do I need equipment for beginner calisthenics?', 'Not much. You can start with floor exercises and a bench or sturdy table. Access to a bar or rings helps with pulling movements, and that can be at a gym.'],
      ['How often should I train calisthenics?', 'Two or three sessions a week suits most beginners. That is enough to practise and improve, with rest between sessions to recover.'],
    ],
    related: ['how-to-start-strength-training-beginners', 'first-pull-up-beginner-timeline'],
  },
  {
    slug: 'getting-back-into-training-after-a-break',
    title: 'Getting Back Into Training After a Long Break, at Any Age',
    desc: 'Starting again after a break, or in your 40s, 50s and beyond? A calm, practical way to restart training without doing too much too soon.',
    h1: 'Getting back into training after a long break, <span class="hl">at any age</span>',
    cat: 'Starting again',
    img: 'paul-welsh-personal-trainer-portrait.jpg',
    pos: '50% 22%',
    alt: 'Paul Welsh, online personal trainer, smiling in a gym, representing a friendly approach to restarting training',
    excerpt: 'Life got in the way, and now you want to get going again. How to restart at a sensible level, whatever your age, and keep it going.',
    answer: 'Start well below where you left off. Two or three short sessions a week, easy for the first few weeks, is enough to rebuild the habit and let your body adapt. Focus on showing up and moving well before you worry about weights, speed or how you used to train.',
    sections: [
      ['It is not too late, and you are not starting from zero', `<p>Whether it has been six months or twenty years, you are not back at the start. You know what training feels like, and your body usually adapts faster than you fear. The risk is not that you are too old or too far behind. The risk is trying to pick up where you left off.</p>`],
      ['Start lighter than feels necessary', `<p>Your enthusiasm has come back faster than your tendons, joints and muscles have adapted. Sessions that feel too easy in week one are doing their job, because they leave you wanting to come back. If a session leaves you unable to walk down the stairs for three days, it was too much.</p>`],
      ['A simple restart plan', `<ol>
<li><strong>Weeks 1 and 2.</strong> Two sessions a week of 20 to 30 minutes. Walk, warm up, then a few simple movements such as squats to a box, rows and incline push-ups.</li>
<li><strong>Weeks 3 and 4.</strong> Keep two sessions, or add a third if you are recovering well. Add a set, or a little weight, to the movements that feel easy.</li>
<li><strong>Weeks 5 and 6.</strong> Settle into a routine of two or three sessions. Pick one thing to improve, such as a movement you find awkward.</li>
</ol>`],
      ['Starting later in life', `<p>Strength training is worthwhile at every age, and there is no age limit on beginning. What changes is how you start. You may need more rest between sessions, a longer warm-up and a gentler progression. If you have a health condition, joint pain or take regular medication, speak to your doctor before you begin. See the <a href="{r}health-disclaimer/">health disclaimer</a> for more.</p>`],
      ['Make it stick', `<ul>
<li><strong>Schedule it.</strong> Pick the same days and times, and treat them like appointments.</li>
<li><strong>Keep sessions short.</strong> A 25 minute session you do beats a 60 minute one you skip.</li>
<li><strong>Write it down.</strong> Seeing last week's numbers makes this week's progress easy to spot.</li>
<li><strong>Do not make up for missed weeks.</strong> Carry on from where you are.</li>
</ul>`],
      ['When it helps to have someone in your corner', `<p>Restarting alone is hard because there is nobody to say "that is enough for today" or "you are ready for more". That is what I do through online coaching: a plan that fits your life, check-ins, and advice by text when you need it. <a href="{r}coaching/">See how it works</a>.</p>`],
    ],
    faq: [
      ['How long does it take to get fit again?', 'It varies with your history, age, sleep and how consistently you train. Many people find sessions feel easier after a few weeks of regular training, but there is no fixed timeline.'],
      ['Is it too late to start training at 50?', 'No. There is no age limit on starting. Begin gently, progress gradually, and speak to your doctor first if you have a health condition or any concerns.'],
      ['Why am I so sore after restarting?', 'Delayed muscle soreness is common when you start again, especially after new or unfamiliar movements. Easing in with lighter sessions usually keeps it manageable. Sharp or worsening pain needs professional advice.'],
      ['Should I start with cardio or weights?', 'You can do both. A short walk and a few simple strength movements make a balanced start. Choose the one you are most likely to repeat.'],
    ],
    related: ['how-to-start-strength-training-beginners', 'is-online-personal-training-worth-it'],
  },
  {
    slug: 'is-online-personal-training-worth-it',
    title: 'Is Online Personal Training Worth It? What to Expect From an Online Coach',
    desc: 'Is online personal training worth it? What you get, who it suits, how it compares with in-person training, and what to ask before you sign up.',
    h1: 'Is online personal training <span class="hl">worth it?</span>',
    cat: 'Online coaching',
    img: 'online-coaching-video-call-check-in-laptop.jpg',
    pos: '50% 35%',
    alt: 'Overhead view of a person on a laptop video call with their online coach, taking notes in a notebook',
    excerpt: 'What online coaching includes, who it works well for, who it does not, and the questions to ask any coach before you commit.',
    answer: 'Online personal training is worth it if you want a plan built for you, regular feedback and accountability, and the flexibility to train when and where suits you. It is less suited to people who need a coach physically beside them for every rep. Choose a coach who is clear about what is included and how they support you.',
    sections: ONLINE.sections,
    faq: ONLINE.faq,
    modified: '2026-10-20',
    related: ['getting-back-into-training-after-a-break', 'how-to-start-strength-training-beginners'],
  },
];
