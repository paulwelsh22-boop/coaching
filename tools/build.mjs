// Generates the static site into ../ . Run: node tools/build.mjs
// Change SITE and CALENDLY once your domain and booking link are known, then re-run.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.example.com'; // TODO: your real domain
const CALENDLY = 'https://calendly.com/YOUR-CALENDLY-LINK'; // TODO: your Calendly link
const UPDATED = 'October 2026';
const SHOW_PRICES = false; // set true to show "From £80 / £100" again

const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

// Organic, hand-drawn feeling rings: seeded noise on radius, centre drift, Catmull-Rom smoothed.
let arcSeed = 7;
const rnd = () => { arcSeed = (arcSeed * 16807) % 2147483647; return arcSeed / 2147483647; };
function ring(r, k, n) {
  const cx = 1000 + (rnd() - 0.5) * 40, cy = 1000 + (rnd() - 0.5) * 40;
  const f1 = 1.4 + rnd() * 1.6, f2 = 3 + rnd() * 3, p1 = rnd() * 6.28, p2 = rnd() * 6.28;
  const a1 = 0.035 + rnd() * 0.05 + k * 0.004, a2 = 0.012 + rnd() * 0.02;
  const pts = [];
  const steps = 16, from = Math.PI * (0.88 + rnd() * 0.06), to = Math.PI * (1.62 + rnd() * 0.08);
  for (let i = 0; i <= steps; i++) {
    const t = from + ((to - from) * i) / steps;
    const rr = r * (1 + a1 * Math.sin(t * f1 + p1) + a2 * Math.sin(t * f2 + p2));
    pts.push([cx + rr * Math.cos(t), cy + rr * Math.sin(t)]);
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1_ = pts[i], p2_ = pts[i + 1], p3 = pts[i + 2] || p2_;
    const c1 = [p1_[0] + (p2_[0] - p0[0]) / 6, p1_[1] + (p2_[1] - p0[1]) / 6];
    const c2 = [p2_[0] - (p3[0] - p1_[0]) / 6, p2_[1] - (p3[1] - p1_[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2_[0].toFixed(1)} ${p2_[1].toFixed(1)}`;
  }
  return d;
}
const arcs = (cls = '', n = 9, pos = 'xMaxYMax') => `<svg class="arcs ${cls}" viewBox="0 0 1000 1000" preserveAspectRatio="${pos} slice" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<path d="${ring(170 + i * 92 + rnd() * 30, i, n)}" pathLength="1" style="--i:${i}"/>`).join('')}</svg>`;

const words = (t) => t.split(' ').map((w, i) => `<span class="w${w.startsWith('~') ? ' hl' : ''}"><span style="--i:${i}">${w.replace('~', '')}</span></span>`).join(' ');

const ICONS = {
  dumb: `<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>`,
  bar: `<path d="M3 4h18M7 4v5M17 4v5"/><circle cx="12" cy="11" r="2"/><path d="M12 13v4m0 0-2.5 4M12 17l2.5 4"/>`,
  flex: `<path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>`,plan: `<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>`, tech: `<circle cx="12" cy="5" r="2"/><path d="M12 8v6m0 0-3 6m3-6 3 6M7 11l5-2 5 2"/>`, prog: `<path d="M3 20h4v-4h4v-4h4V8h4V4"/>`, video: `<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>`, food: `<path d="M4 12h16a8 8 0 0 1-16 0z"/><path d="M9 8c0-2 1.5-2 1.5-4M14 8c0-2 1.5-2 1.5-4"/>`, msg: `<path d="M4 5h16v11H9l-5 4z"/>`, chart: `<path d="M4 4v16h16M8 15l4-4 3 3 5-6"/>`};
const ico = (k) => `<span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg></span>`;
const icoLg = (k) => ico(k).replace('class="ico"', 'class="ico lg"');
const markImg = (r) => `<img src="${r}assets/mark-dark.png" alt="" width="104" height="104" loading="lazy">`;

const favicon = 'assets/favicon.png';

/* ------------------------------ FAQ data ------------------------------ */
const FAQ = {
  cost: ['How much does online coaching with Paul Welsh Coaching cost?', SHOW_PRICES ? 'Plans start from £80 a month, or £100 a month with nutrition guidance. Your first call is free, with no obligation.' : 'Coaching is a monthly Membership, with or without nutrition guidance. You will hear the exact price on your free call, before you commit to anything.'],
  exp: ['Do I need any experience to start?', 'No. Paul Welsh Coaching is a great place to start, whether you have never trained, are coming back after a break, or already train and want more structure. No gym background, no calisthenics experience and no starting strength required. If you cannot yet do a push-up or a pull-up, that is the point.'],
  online: ['Is this in-person or online?', 'Fully online and remote. Coaching happens through your training app and WhatsApp, so it works wherever you are in the world.'],
  diff: ['How is this different from a normal personal trainer?', 'Most personal trainers and calisthenics accounts assume you already have a training base. Paul Welsh Coaching starts from where you are: learning how to move properly, a clear way to progress, and food guidance that does not assume you already know what you are doing.'],
  get: ['What do I get with coaching?', 'A personalised training plan in an app, a video demo for every exercise, regular check-ins and direct contact with me.'],
  involve: ['What does online coaching involve?', 'A personalised training plan in an app, with a video demo of every exercise, regular check-ins to review how it is going, and direct contact with me between check-ins. Your plan is adjusted as you get stronger.'],
  loss: ['Is this just for weight loss?', 'No. People start for lots of reasons: getting stronger, learning to move well, building confidence, or simply having a routine they can stick to. We set your goal on the first call and build the plan around it.'],
  busy: ['Will this work around a busy schedule?', 'Yes. The plan is built around the time you actually have, not an ideal week. Short, consistent sessions beat long ones you cannot keep up, so we start with what fits and build from there.'],
  social: ['What about social events and eating out?', 'Food guidance is practical, not restrictive. You do not have to give up meals out or time with friends. We focus on simple habits you can keep up while still enjoying your life.'],
  call: ['What happens after I book a call?', 'You will have a 15 minute call to talk through your goals and where you are now. If it is a fit, you get a plan built around your starting point and a start date.'],
  kit: ['Do I need equipment?', 'No. The early stages are designed around bodyweight and a pull-up bar. Equipment recommendations come later, only if they are useful.'],
  often: ['How often will we be in touch?', 'You get regular check-ins plus messaging between them, so you are never guessing whether you are doing it right.'],
  cancel: ['Can I cancel anytime?', 'Cancellation terms are explained plainly on your free call, before you commit to anything.'],
  know: ['Do I need to know what I want before I book?', 'No. The call is there to work out the right starting point together, whether you are brand new or already training.'],
  oblig: ['Is there any obligation to sign up after the call?', 'No. It is a genuine conversation, not a sales call in disguise. If it is not a fit, I will tell you.'],
  away: ['Where do I need to be based?', 'Anywhere. Coaching is fully remote, so location is not a barrier.'],
};
const faqHtml = (keys) => keys.map((k, i) => `<div class="q"><h3><button type="button" aria-expanded="false" aria-controls="a-${k}" id="q-${k}"><span>${FAQ[k][0]}</span><span class="pm" aria-hidden="true"></span></button></h3><div class="a" id="a-${k}" role="region" aria-labelledby="q-${k}"><div><p>${FAQ[k][1]}</p></div></div></div>`).join('');
const faqLd = (keys, extra = []) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [...keys.map((k) => FAQ[k]), ...extra].map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });

/* ------------------------------ Page shell ------------------------------ */
const NAV = [['Home', ''], ['Coaching', 'coaching/'], ['About', 'about/'], ['Blog', 'blog/']];
function page({ path, depth, title, desc, body, ld = [], hero = false, ogType = 'website', root, noindex = false }) {
  const r = root ?? '../'.repeat(depth);
  const url = SITE + '/' + path;
  const nav = NAV.map(([l, h]) => `<li><a href="${h === '' ? (r || './') : r + h}"${(h === '' ? path === '' : path.startsWith(h)) ? ' aria-current="page"' : ''}>${l}</a></li>`).join('');
  return `<!doctype html>
<html lang="en-GB" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta name="theme-color" content="#152531">
<meta property="og:type" content="${ogType}"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/assets/hero-handstand.jpg"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="${r}${favicon}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r}assets/styles.css">
<script>document.documentElement.className='js'</script>
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head>
<body>
${path === '' ? `<!--
THESIS: A beginner site that opens on the person at their first rep, not the performance; refuses the gym-bro hero and the icon-card grid.
OWN-WORLD: Blue Black studio dark, Ice Blue and Off White type, Poppins at heavy display weights, concentric arc lines from the r1 mark, dark moody training photography, one light Off White section as the "first rep" page.
STORY: Visitor sees "this is for me", feels the path from day one to their first skills is small and steady, books a free call.
FIRST VIEWPORT: Left, 5.5rem headline and a Book a free call button; right, the athlete photo fading into the ground with arcs drawing in behind.
FORM: Dark athletic brand site, brand-pinned, seed key n/a (palette/type pinned by brief). FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->` : ''}
<a class="skip" href="#main">Skip to content</a>
<header class="nav"><div class="wrap">
<a class="brand" href="${r || './'}" aria-label="Paul Welsh Coaching, home"><img src="${r}assets/logo-light.png" alt="Paul Welsh Coaching" width="149" height="34"></a>
<button class="nav-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Menu"><span></span><span></span></button>
<ul class="nav-links" id="nav-links">${nav}<li><a class="btn sm" href="${r}book-a-call/">Book a free call</a></li></ul>
</div></header>
<main id="main">
${body(r)}
</main>
<footer class="footer"><div class="wrap">
<div class="brand"><img src="${r}assets/logo-stacked-light.png" alt="Paul Welsh Coaching" width="139" height="96"><p>Movement for real life. Strength, calisthenics, mobility and practical nutrition, online.</p></div>
<nav aria-label="Footer"><a href="${r}coaching/">Coaching</a><a href="${r}about/">About</a><a href="${r}blog/">Blog</a><a href="${r}faq/">FAQ</a><a href="${r}book-a-call/">Contact</a></nav>
<small><span>&copy; 2026 Paul Welsh Coaching. Online coaching, wherever you are.</span><span class="legal"><a href="${r}privacy/">Privacy</a><a href="${r}terms/">Terms</a><a href="${r}cookies/">Cookies</a><a href="${r}health-disclaimer/">Health disclaimer</a></span></small>
</div></footer>
${path === 'book-a-call/' ? '' : `<a class="btn sticky-cta" href="${r}book-a-call/">Book a free call ${arrow}</a>`}
<script src="${r}assets/main.js" defer></script>
</body>
</html>`;
}

function write(path, html) {
  const file = join(ROOT, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

const cta = (r, headline = 'Start with a free call, not a <span class="hl">sales pitch</span>', sub = 'Fifteen minutes to talk through where you are and whether this is the right fit. No obligation.', btn = 'Book a free call') => `
<section class="final pad">${arcs('', 9)}
<div class="wrap"><h2 data-reveal>${headline}</h2><p data-reveal>${sub}</p><a class="btn" href="${r}book-a-call/" data-reveal>${btn} ${arrow}</a></div></section>`;

const org = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Paul Welsh Coaching', url: SITE + '/', logo: SITE + '/assets/logo-dark.png', description: 'Online strength and calisthenics coaching, built for people starting out.' };

/* ------------------------------ HOME ------------------------------ */
const stages = [
  { title: 'Get started', when: 'Where everyone begins', body: 'Show up and keep the first sessions easy. We set a routine you can actually repeat and a starting point based on where you are today, not where a video says you should be.' },
  { title: 'Learn the technique', when: 'Movement before load', body: 'Push, pull, squat, hinge, carry. You learn each pattern with simple versions first, with form feedback on your own video, so it feels right before it gets harder.' },
  { title: 'Build the basics', when: 'Consistency does the work', body: 'Two to three short sessions a week of bodyweight and strength work. Reps, tempo and rest are set for you, and the food side stays simple.' },
  { title: 'Progress', when: 'A little harder, on purpose', body: 'Every movement has a clear next step: knees to full push-ups, assisted to bodyweight pull-ups, box squats to deeper squats. You move on when you are ready, not when a calendar says so.' },
  { title: 'Your firsts', when: 'Skills you own', body: 'Your first full push-up. Your first pull-up. The moment a movement that felt impossible becomes yours. Then we pick the next one.' },
];

write('', page({
  path: '', depth: 0,
  title: 'Online Strength & Calisthenics Coaching | Paul Welsh Coaching',
  desc: 'Online strength and calisthenics coaching, ideal if you are new to training or starting again. Learn the technique, build the basics, progress at your pace.',
  ld: [org, faqLd(['cost', 'exp', 'online', 'diff'])],
  body: (r) => `
<section class="hero">
${arcs('', 10)}
<div class="hero-photo"><img src="${r}assets/hero-handstand.jpg" alt="Paul holding a handstand on parallettes in a busy gym" width="2000" height="1126" fetchpriority="high"></div>
<div class="wrap hero-inner">
<h1>${words("Your first rep ~starts ~here.")}</h1>
<p class="lede fade-in">Online coaching in strength, calisthenics and mobility, with food that fits your life. Ideal if you are new to training or starting again: learn the technique, build the basics, and know exactly how to progress.</p>
<div class="hero-actions fade-in d2"><a class="btn" href="${r}book-a-call/">Book a free call ${arrow}</a><a class="btn ghost" href="#path">Build Skills</a></div>
<div class="hero-foot fade-in d2"><span>Online coaching</span><span>Strength fundamentals</span><span>Beginner calisthenics</span><span>Practical nutrition</span></div>
</div>
</section>

<section class="manifesto pad">
<div class="wrap mf-grid">
<div class="mf-left"><h2 class="sr">Show up. Start small. Build strength.</h2>
<p class="mf-big" aria-hidden="true">
<span class="ln">${'Show up.'.split(' ').map((w) => `<span class="sw">${w}</span>`).join(' ')}</span>
<span class="ln">${'Start small.'.split(' ').map((w) => `<span class="sw">${w}</span>`).join(' ')}</span>
<span class="ln">${'Build strength.'.split(' ').map((w) => `<span class="sw">${w}</span>`).join(' ')}</span>
</p></div>
<div class="mf-copy">
<h2 data-reveal>Most fitness content isn't made for <span class="hl">you yet</span></h2>
<p data-reveal>If you've watched a hundred "calisthenics for beginners" videos and still don't know where to start, you're not the problem. Most fitness and calisthenics content is made by people who have trained for years, for people who already know the basics. Most personal trainers assume you already know your way around a gym.</p>
<p data-reveal class="mf-strong">Paul Welsh Coaching starts before all of that: how to move well, how to set up a session, how to eat without overthinking it, and how to get a little better every week.</p>
</div>
</div>
</section>

<section class="path pad" id="path">${arcs('', 8)}
<div class="wrap">
<div class="path-head"><h2 data-reveal>From day one to your <span class="hl">first skills</span></h2><p data-reveal>Starting is the hard part, and the path after it is simpler than it looks. Drag through the five stages.</p></div>
<div class="path-ui" data-path>
<div class="rail-wrap"><div class="rail-holder">
<ol class="stops">${stages.map((s, i) => `<li><button type="button" class="stop" style="--p:${i / 4}" aria-label="Stage ${i + 1}: ${s.title}"><span>${s.title}</span></button></li>`).join('')}</ol>
<div class="rail"><div class="rail-fill"></div><div class="knob" role="slider" tabindex="0" aria-label="Progression stage" aria-valuemin="1" aria-valuemax="5" aria-valuenow="1">1</div></div>
</div></div>
<div class="path-detail" aria-live="polite">
<div class="detail-text"><p class="step-label swap" data-step></p><h3 class="swap" data-title></h3><p class="when swap" data-when></p><p class="swap" data-body></p></div>
</div>
</div>
<p class="path-note" data-reveal>Everyone moves at their own pace. In coaching, every stage is adjusted week to week from your check-ins, so you progress when you are ready.</p>
</div>
<script type="application/json" id="stages-data">${JSON.stringify(stages)}</script>
</section>

<section class="bleed includes">
<div class="bleed-bg" data-parallax aria-hidden="true"><img src="${r}assets/lsit.jpg" alt="" width="2000" height="1126" loading="lazy"></div>
<div class="wrap">
<div class="bleed-head"><h2 data-reveal>What coaching actually <span class="hl">includes</span></h2>
<p data-reveal>Most people don't need more motivation. They need a plan that fits their week, and someone in their corner.</p>
<a class="btn" data-reveal href="${r}book-a-call/">Book a free call ${arrow}</a></div>
<div class="glass-grid">
<article class="glass" data-reveal><h3>A plan built around where you are</h3><p>The fundamentals, sequenced so the first few weeks are genuinely achievable.</p></article>
<article class="glass" data-reveal><h3>Technique you can trust</h3><p>Every movement taught step by step, with form feedback on your own videos.</p></article>
<article class="glass" data-reveal><h3>A clear way to progress</h3><p>An easier and a harder version of every exercise, so you always know what is next.</p></article>
<article class="glass" data-reveal><h3>Mobility, built in</h3><p>Warm-ups, better positions and recovery routines, so you move well and bounce back.</p></article>
<article class="glass" data-reveal><h3>Food that fits real life</h3><p>Practical, no-fuss nutrition guidance. Not a meal plan you will abandon by Thursday.</p></article>
<article class="glass" data-reveal><h3>Someone who answers</h3><p>Regular check-ins and direct messaging on WhatsApp, and I'm available when you need me.</p></article>
</div>
</div>
</section>

<section class="steps pad">
<div class="wrap">
<h2 class="steps-head" data-reveal>How coaching <span class="hl">works</span></h2>
<ol class="step-list">
<li data-reveal><span class="n">Step 1</span><h3>Book a free call</h3><p>Fifteen minutes, no pressure, no card details. Just working out if this is a fit.</p></li>
<li data-reveal><span class="n">Step 2</span><h3>Get a plan built around where you actually are</h3><p>A starting assessment, a clear first goal, and your first week of training.</p></li>
<li data-reveal><span class="n">Step 3</span><h3>Train with check-ins, not just a programme</h3><p>Regular check-ins keep the plan moving with you, week by week.</p></li>
</ol>
</div>
</section>

<section class="light pad" style="padding-top:clamp(80px,12vw,168px)">
<div class="wrap faq-wrap">
<h2 data-reveal>Questions people <span class="hl">ask first</span></h2>
<div class="faq-col" data-reveal><div class="faq-list">${faqHtml(['cost', 'exp', 'online', 'diff'])}</div><p class="faq-more"><a class="text-link" href="${r}faq/">View all FAQs ${arrow}</a></p></div>
</div>
</section>
${cta(r)}`,
}));

/* ------------------------------ COACHING ------------------------------ */
write('coaching', page({
  path: 'coaching/', depth: 1,
  title: 'Online Strength & Calisthenics Coaching | Paul Welsh Coaching',
  desc: 'Online coaching in strength, calisthenics, mobility and nutrition, ideal if you are new to training or starting again. See what is included.',
  ld: [org, faqLd(['involve', 'cost', 'busy', 'social', 'call', 'kit', 'often', 'cancel'])],
  body: (r) => `
<section class="page-hero">${arcs('', 9)}
<div class="wrap"><h1>Coaching built for your <span class="hl">first rep</span>, not your fiftieth</h1>
<p class="lede">Strength, calisthenics, mobility and food guidance that fits a real schedule. Delivered remotely, with a coach who answers.</p>
<a class="btn" href="${r}book-a-call/">Book a free call ${arrow}</a></div></section>



<section class="parts pad" style="padding-bottom:clamp(40px,6vw,88px)">
<div class="wrap parts-head"><h2 data-reveal>Four parts, <span class="hl">one plan</span></h2>
<div class="car-ctrl" aria-label="Browse the four parts"><button type="button" data-car-prev aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button><button type="button" data-car-next aria-label="Next">${arrow}</button></div></div>
<div class="car" data-car tabindex="0" aria-label="Four parts of coaching, scroll sideways"><div class="car-track">
<article class="part p1"><div>${icoLg('dumb')}<h3>Strength fundamentals</h3><p>Regular gym training, taught from the start.</p></div><ul class="chips"><li>Squat and hinge</li><li>Push and pull</li><li>Gym confidence</li></ul></article>
<article class="part p2"><div>${icoLg('bar')}<h3>Beginner calisthenics</h3><p>Bodyweight skills, built step by step.</p></div><ul class="chips"><li>Push-ups and rows</li><li>Hangs and pull-ups</li><li>Body control</li></ul></article>
<article class="part p3"><div>${icoLg('flex')}<h3>Mobility</h3><p>Move better for training, and recover well after it.</p></div><ul class="chips"><li>Warm-ups</li><li>Better positions</li><li>Recovery routines</li></ul></article>
<article class="part p4"><div>${icoLg('food')}<h3>Food guidance</h3><p>Practical, not restrictive.</p></div><ul class="chips"><li>Easy meals</li><li>Eating to train</li><li>Nutrition plan</li></ul></article>
</div></div>
<div class="wrap"><div class="car-bar" aria-hidden="true"><span></span></div></div>
</section>

<section class="pad" style="padding-top:clamp(56px,7vw,100px)"><div class="wrap">
<h2 class="pillars-head" style="max-width:16ch" data-reveal>Progress, <span class="hl">not hype</span></h2>
<ul class="pillars short">
<li data-reveal><h3>Structure</h3><p>An easier and a harder version of every exercise, so you always know what is next.</p></li>
<li data-reveal><h3>Tracking</h3><p>Your training lives in the app, so progress is something you can see.</p></li>
<li data-reveal><h3>Accountability</h3><p>Check-ins and direct contact mean someone notices when you show up.</p></li>
</ul>
</div></section>

<section class="pad"><div class="wrap">
<h2 data-reveal style="margin-bottom:clamp(32px,5vw,56px)">What's <span class="hl">included</span></h2>
<div class="inc-cards">
<article class="inc-card" data-reveal><div class="bg" style="--img:url(${r}assets/inc-app.jpg);--pos:30% 55%;--size:cover" aria-hidden="true"></div><h3>Your plan, in your app</h3><p>A personalised plan in your own branded training app, with a video demo of every exercise.</p></article>
<article class="inc-card" data-reveal><div class="bg" style="--img:url(${r}assets/inc-call.jpg);--pos:50% 50%;--size:cover" aria-hidden="true"></div><h3>Regular check-ins</h3><p>Regular online check-ups, alongside advice by text whenever you need it.</p></article>
<article class="inc-card" data-reveal><div class="bg" style="--img:url(${r}assets/inc-meal.jpg);--pos:50% 50%;--size:cover" aria-hidden="true"></div><h3>Food guidance</h3><p>Simple, practical and non-restrictive. Add it to any plan.</p></article>
<article class="inc-card" data-reveal><div class="bg" style="--img:url(${r}assets/inc-muscle.jpg);--pos:50% 38%;--size:cover" aria-hidden="true"></div><h3>Progress tracking</h3><p>Your training in one place, so your first rep is something you can point to.</p></article>
</div>
</div></section>

<section class="pad"><div class="wrap">
<h2 data-reveal style="margin-bottom:12px">Is this <span class="hl">for you?</span></h2>
<p class="lede" data-reveal style="margin-bottom:clamp(28px,4vw,48px)">Tap anything that sounds like you.</p>
<div class="ticks" data-ticks>
<button type="button" aria-pressed="false"><i></i>I'm new to training, starting again, or coming back after a long break</button>
<button type="button" aria-pressed="false"><i></i>I want to learn proper technique and progress, at any age</button>
<button type="button" aria-pressed="false"><i></i>I already train, but need more structure or accountability</button>
<button type="button" aria-pressed="false"><i></i>I want structure without a gym-bro aesthetic</button>
<button type="button" aria-pressed="false"><i></i>I want strength training and calisthenics, not one or the other</button>
<button type="button" aria-pressed="false"><i></i>I want to train online, from anywhere</button>
</div>
<div class="tick-result" aria-live="polite"><p data-tick-msg>Pick as many as you like.</p><a class="btn" href="${r}book-a-call/">Book a free call ${arrow}</a></div>
</div></section>



<section class="light pad"><div class="wrap faq-wrap"><h2 data-reveal>Coaching questions</h2><div class="faq-col" data-reveal><div class="faq-list">${faqHtml(['involve', 'cost', 'busy', 'social', 'call', 'kit', 'often', 'cancel'])}</div><p class="faq-more"><a class="text-link" href="${r}faq/">View all FAQs ${arrow}</a></p></div></div></section>
${cta(r, SHOW_PRICES ? 'Plans from £80. First call free.' : 'Find your plan. First call free.', 'Fifteen minutes to talk through where you are and which plan fits. No obligation.', 'Book a free call')}`,
}));

/* ------------------------------ ABOUT ------------------------------ */
write('about', page({
  path: 'about/', depth: 1,
  title: 'About Paul | Paul Welsh Coaching',
  desc: 'Meet Paul, a Level 2 and 3 qualified personal trainer with over 10 years of training experience, coaching strength and calisthenics online.',
  ld: [org],
  body: (r) => `
<section class="page-hero">${arcs('', 9)}
<div class="wrap"><h1>Hi, I'm Paul. I'll help you <span class="hl">start, and keep going.</span></h1>
<a class="btn" href="${r}book-a-call/">Let's talk ${arrow}</a></div></section>

<section class="bleed about-bleed">
<div class="bleed-bg" data-parallax aria-hidden="true"><img src="${r}assets/curl.jpg" alt="" width="2000" height="1126" loading="eager"></div>
<div class="wrap about-grid">
<div class="about-copy">
<p class="lede" data-reveal>I've trained for over ten years, but three years ago I was introduced to calisthenics.</p>
<p data-reveal>Calisthenics opened my eyes to new ways of training, skills I never knew I could learn, and gave me a better understanding of my body and movement.</p>
<p data-reveal>Now, in my mid 30s, I care as much about moving well and recovering properly as I do about getting stronger. Still playing, still progressing, and proof that you can start strength training and calisthenics at any age.</p>
<p data-reveal>That's why I do this. Starting, or starting again, is the hardest part. I want to make it feel possible, and fun.</p>
</div>
<aside class="quals glass" data-reveal aria-label="Paul at a glance">
<dl>
<div><dt>Qualified</dt><dd>Level 2 and 3 Personal Training</dd></div>
<div><dt>Training for</dt><dd>10+ years</dd></div>
<div><dt>Calisthenics</dt><dd>3 years and counting</dd></div>
<div><dt>Coaching</dt><dd>Online</dd></div>
</dl>
</aside>
</div>
</section>

<section class="pad" style="padding-top:clamp(56px,7vw,100px)"><div class="wrap">
<h2 data-reveal style="margin-bottom:clamp(32px,5vw,56px)">Patient. Fun. <span class="hl">Built around you.</span></h2>
<div class="principles">
<div data-reveal><h3>Know you first.</h3><p>Everyone is different. I want to know what you want to achieve and why, so your plan isn't one size fits all.</p></div>
<div data-reveal><h3>Keep it fun.</h3><p>Training should fit your life, not feel like a chore. If it's a slog, we change it.</p></div>
<div data-reveal><h3>Count every win.</h3><p>Your first banded pull-up. Ten press-ups on your knees. Any progress is good progress, because every person starts somewhere different.</p></div>
</div></div></section>

${cta(r, 'Curious if this is a fit?', 'Book a free call and ask me anything.', 'Book a free call')}`,
}));

/* ------------------------------ BLOG ------------------------------ */
const posts = [
  ['How Long Does It Take to Get Your First Pull-Up? A Beginner\'s Timeline', 'first-pull-up-beginner-timeline'],
];
write('blog', page({
  path: 'blog/', depth: 1,
  title: 'Training Blog | Paul Welsh Coaching',
  desc: 'Straight answers for anyone starting out: technique, progression, calisthenics vs weights and simple food.',
  ld: [org],
  body: (r) => `
<section class="page-hero">${arcs('', 9)}
<div class="wrap"><h1>Less guesswork. <span class="hl">More getting started.</span></h1><p class="lede">Straightforward guides to strength, calisthenics and the questions everyone has at the beginning.</p></div></section>
<section class="pad" style="padding-top:clamp(40px,6vw,88px)"><div class="wrap">
${posts.map(([t, sl]) => `<a class="featured" href="${r}blog/${sl}/" data-reveal>
<div class="f-img"><img src="${r}assets/blog-pullup.jpg" alt="A man seen from behind doing a pull-up in a dark gym" width="1067" height="1600" loading="lazy" style="object-position:50% 40%"></div>
<div class="f-body"><p class="f-meta"><span>Beginner guide</span><span>3 min read</span><span>Updated ${UPDATED}</span></p>
<h2>${t}</h2>
<p class="f-ex">There is no single timeline for a first pull-up. Here is what affects it, the building blocks that get you there, and why smaller progress still counts.</p>
<span class="text-link">Read the guide ${arrow}</span></div></a>`).join('')}
</div></section>
<section class="pad" style="padding-top:clamp(56px,7vw,100px)"><div class="wrap">
<h2 data-reveal style="margin-bottom:clamp(32px,5vw,56px)">New guides are on the way</h2>
<div class="cols-2" data-reveal>
<div class="fit yes"><h3>What we will cover</h3><ul><li>Learning the basic movements properly</li><li>How to progress without rushing</li><li>Simple food for people who train</li></ul></div>
<div class="fit no"><h3>Want a question answered?</h3><p style="color:var(--ice-dim)">Ask it on a free call and it might become the next guide.</p><a class="btn" href="${r}book-a-call/">Book a free call ${arrow}</a></div>
</div></div></section>
<section class="light pad"><div class="wrap faq-wrap"><h2 data-reveal>Quick answers while you read</h2><div class="faq-list" data-reveal>${faqHtml(['exp', 'online', 'cost'])}</div></div></section>`,
}));

const art = FAQ; // eslint
const articleFaq = [
  ['Can I get a pull-up in 30 days?', 'Some people with existing upper-body strength may progress quickly. If you are new to this, avoid making a fixed deadline the goal. Your starting point and consistency matter more.'],
  ['Do I need a pull-up bar at home?', 'You need access to suitable, securely installed equipment for hanging and assisted pull-up practice. That can be at a gym; it does not have to be in your home.'],
  ['Why can I do push-ups but not a pull-up?', 'Push-ups and pull-ups use different strength patterns, pushing and pulling. Being confident with push-ups does not automatically mean you can lift your bodyweight in a pull-up.'],
];
write('blog/first-pull-up-beginner-timeline', page({
  path: 'blog/first-pull-up-beginner-timeline/', depth: 2, ogType: 'article',
  title: 'How Long Does a First Pull-Up Take? A Beginner Guide',
  desc: 'There is no single timeline for a first pull-up. Here is what affects it, and the progression that gets you there.',
  ld: [org,
    { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: 'How Long Does It Take to Get Your First Pull-Up? A Beginner\'s Timeline', author: { '@type': 'Person', name: 'Paul', worksFor: { '@type': 'Organization', name: 'Paul Welsh Coaching' } }, publisher: { '@type': 'Organization', name: 'Paul Welsh Coaching' }, datePublished: '2026-10-01', dateModified: '2026-10-01', mainEntityOfPage: SITE + '/blog/first-pull-up-beginner-timeline/' },
    faqLd([], articleFaq)],
  body: (r) => `
<section class="page-hero" style="padding-bottom:40px">${arcs('', 8)}
<div class="wrap"><div class="article"><h1 style="max-width:16ch;font-size:clamp(2.25rem,5vw,4.25rem)">How long does it take to get your <span class="hl">first pull-up?</span></h1>
<p class="meta">By Paul, Paul Welsh Coaching &middot; Last updated: ${UPDATED}</p></div></div></section>
<article class="pad" style="padding-top:24px"><div class="wrap"><div class="article">
<p class="answer">There is no single reliable timeline for every beginner. Your starting strength, the amount of bodyweight you are moving, consistency and recovery all affect how long your first strict pull-up takes. Think in terms of gradual progress, rather than a deadline.</p>
<h2>Why "just try harder" isn't a plan</h2>
<p>A pull-up asks you to lift your bodyweight using pulling strength. Repeatedly attempting a movement you cannot yet complete gives you little room to control the difficulty. Assisted variations let you practise the movement at a manageable level.</p>
<h2>The building blocks</h2>
<p>These are useful ingredients, not a fixed sequence or a prescription for everyone. Choose a level you can control and adapt the work to your starting point.</p>
<ol>
<li><strong>Supported hangs.</strong> Build confidence and grip tolerance with as much support as you need.</li>
<li><strong>Scapular pulls.</strong> Practise controlled movement through the shoulder blades.</li>
<li><strong>Assisted pull-ups.</strong> Use an appropriate machine or band to reduce the load.</li>
<li><strong>Controlled negatives.</strong> Practise the lowering phase when you can manage it safely and with control.</li>
<li><strong>Your first strict pull-up.</strong> Gradually reduce assistance as your ability develops.</li>
</ol>
<h2>Progress can look smaller than you expect</h2>
<p>Using a little less assistance, moving with more control or feeling more confident are all useful signs of progress. You do not need to test a maximum attempt every time you train.</p>
<h2>How Paul Welsh Coaching approaches this</h2>
<p>My coaching brings strength fundamentals and beginner calisthenics together. The aim is a plan built around where you actually are, adjusted from your check-ins. See <a href="${r}coaching/">how coaching works</a>.</p>
<h2>Your pull-up questions</h2>
${articleFaq.map(([q, a]) => `<div class="qa"><h3>${q}</h3><p>${a}</p></div>`).join('')}
<div class="article-end"><a class="btn" href="${r}book-a-call/">Book a free call ${arrow}</a></div>
</div></div></article>`,
}));

/* ------------------------------ FAQ ------------------------------ */
const groups = [['Getting started', ['exp', 'loss', 'call', 'know', 'oblig']], ['Pricing and logistics', ['cost', 'involve', 'busy', 'online', 'away', 'cancel', 'often']], ['Training and food', ['diff', 'kit', 'social']]];
write('faq', page({
  path: 'faq/', depth: 1,
  title: 'FAQ | Paul Welsh Coaching',
  desc: 'Answers to the questions people ask before starting online coaching: cost, experience, equipment, format and booking.',
  ld: [org, faqLd(groups.flatMap((g) => g[1]))],
  body: (r) => `
<section class="page-hero">${arcs('', 9)}
<div class="wrap"><h1>Questions, <span class="hl">answered straight</span></h1><p class="lede">Everything people ask before they book.</p></div></section>
${groups.map(([g, keys]) => `<section class="pad" style="padding-block:clamp(40px,6vw,80px)"><div class="wrap faq-wrap"><h2 data-reveal>${g}</h2><div class="faq-list" data-reveal>${faqHtml(keys)}</div></div></section>`).join('')}
${cta(r, 'Still wondering?', 'Fifteen minutes, no pressure. Bring your questions.', 'Book a free call')}`,
}));

/* ------------------------------ BOOK ------------------------------ */
write('book-a-call', page({
  path: 'book-a-call/', depth: 1,
  title: 'Book a free call | Paul Welsh Coaching',
  desc: 'Book a free, no-obligation 15 minute call with Paul Welsh Coaching to see if online coaching is right for you.',
  ld: [org, faqLd(['know', 'oblig', 'away'])],
  body: (r) => `
<section class="page-hero" style="padding-bottom:clamp(32px,5vw,64px)">${arcs('', 9)}
<div class="wrap"><h1 style="max-width:16ch">Let's talk it through. <span class="hl">No pressure, no pitch.</span></h1>
<p class="lede">Fifteen minutes to talk about where you are now, what you want, and whether Paul Welsh Coaching is a fit. If it's not, I'll tell you.</p></div></section>
<section class="pad" style="padding-top:clamp(40px,6vw,88px)"><div class="wrap book-grid">
<div class="cal" data-calendly="${CALENDLY}"><div><h3>Booking calendar</h3><p>Your Calendly calendar appears here once your link is added. Set <code>CALENDLY</code> in <code>tools/build.mjs</code> and re-run the build.</p></div></div>
<div><div class="faq-list" style="border-color:var(--line)">${faqHtml(['know', 'oblig', 'away'])}</div></div>
</div></section>`,
}));

/* ------------------------------ LEGAL + 404 ------------------------------ */
// Drafts for a UK sole trader / small business. Highlighted [ ] items are facts only you know.
const T = (t) => `<mark class="todo">[${t}]</mark>`;
const BIZ = T('Your legal or trading name'), ADDR = T('Business address'), MAIL = T('Contact email');
const legalPage = (path, title, desc, inner) => write(path, page({
  path: path + '/', depth: 1, title: title + ' | Paul Welsh Coaching', desc, ld: [],
  body: () => `<section class="page-hero" style="padding-bottom:40px">${arcs('', 8)}
<div class="wrap"><div class="article"><h1 style="font-size:clamp(2.25rem,5vw,4rem)">${title}</h1><p class="meta">Last updated: ${UPDATED}</p></div></div></section>
<article class="pad" style="padding-top:24px"><div class="wrap"><div class="article legal-doc">${inner}</div></div></article>`,
}));

legalPage('privacy', 'Privacy Policy', 'How Paul Welsh Coaching collects, uses and protects your personal information.', `
<p>This policy explains how ${BIZ} (trading as Paul Welsh Coaching, "I", "me") looks after your personal information under UK data protection law. I am the data controller. You can contact me at ${MAIL} or at ${ADDR}.</p>
<h2>What I collect</h2>
<ul>
<li><strong>When you book a call:</strong> your name, email address and any notes you add, collected through Calendly.</li>
<li><strong>When you become a client:</strong> contact details, your goals, training history, and health and injury information you choose to share, your training and progress data in the coaching app, messages, and any photos or videos you send for form checks.</li>
<li><strong>Payments:</strong> processed by ${T('payment provider, e.g. Stripe, GoCardless')}. I do not store your card details.</li>
<li><strong>When you use this website:</strong> basic technical data your browser sends (such as IP address and device type) when pages and fonts load. This site does not use advertising or analytics cookies. See the <a href="../cookies/">cookie notice</a>.</li>
${T('If you add an email list: "your email address if you sign up for guides or updates"')}
</ul>
<h2>Why I use it, and my legal basis</h2>
<ul>
<li>To answer your enquiry and book a call: legitimate interests, and steps you ask me to take before a contract.</li>
<li>To provide coaching: performance of our contract.</li>
<li>Health information: this is special category data. I process it only with your explicit consent, which you can withdraw at any time, although I may then be unable to coach you safely.</li>
<li>To keep records for tax and accounting: legal obligation.</li>
<li>To send updates or guides: your consent, and you can unsubscribe at any time.</li>
</ul>
<h2>Who I share it with</h2>
<p>Only the providers I need to run the service: Calendly (booking), WhatsApp (messaging), ${T('coaching app provider')}, ${T('payment provider')}, ${T('email provider, if used')} and my website host ${T('host')}. They process data on my instructions or under their own terms. I do not sell your data. Some providers are based outside the UK; where that happens, I rely on approved safeguards such as the UK International Data Transfer Agreement or an adequacy decision.</p>
<h2>How long I keep it</h2>
<p>Coaching records are kept for ${T('e.g. 2 years')} after our work ends, and accounting records for ${T('6 years, as required by HMRC')}. Enquiries that do not become coaching are deleted after ${T('e.g. 12 months')}.</p>
<h2>Your rights</h2>
<p>You can ask to see, correct, delete or export your data, to restrict or object to how I use it, and to withdraw consent. Email ${MAIL} and I will reply within one month. If you are unhappy, you can complain to the Information Commissioner's Office at <a href="https://ico.org.uk">ico.org.uk</a> or on 0303 123 1113.</p>
<h2>Age</h2>
<p>Coaching is for adults aged 18 and over ${T('confirm')}.</p>
<h2>Changes</h2>
<p>If I change this policy I will update the date above.</p>`);

legalPage('terms', 'Terms of Service', 'The terms that apply when you book a call or sign up for coaching with Paul Welsh Coaching.', `
<p>These terms apply to coaching provided by ${BIZ} (trading as Paul Welsh Coaching). By starting coaching you agree to them. They do not affect your statutory rights as a consumer.</p>
<h2>The service</h2>
<p>Online coaching includes a personalised training plan in an app, exercise demos, regular check-ins and contact with me, and, if you choose the nutrition plan, practical food guidance. Exactly what is included is confirmed before you start.</p>
<h2>Before you start</h2>
<p>You confirm you are 18 or over and will complete a health questionnaire honestly. If you have a medical condition, are pregnant or have been injured, speak to your doctor first. See the <a href="../health-disclaimer/">health disclaimer</a>.</p>
<h2>Free call</h2>
<p>The introductory call is free, with no obligation to sign up.</p>
<h2>Price and payment</h2>
<p>Coaching is charged monthly at the price agreed with you before you start. Payment is taken ${T('how and when, e.g. by Direct Debit or card on the same date each month')}. Prices may change with ${T('e.g. 30 days')} notice.</p>
<h2>Cancelling</h2>
<p>You can cancel by ${T('how, e.g. emailing me')} with ${T('notice period, e.g. 14 days')} notice. ${T('State clearly whether there is a minimum term and whether any part-month is refundable.')}</p>
<p>Because the service is supplied at a distance, you have a 14-day right to cancel from the date you sign up. If you ask me to start coaching within those 14 days and then cancel, you will pay for the service already provided.</p>
<h2>Results</h2>
<p>I will coach you with reasonable care and skill. I cannot guarantee particular results, because they depend on many things including your effort, consistency, health and circumstances.</p>
<h2>Your responsibilities</h2>
<p>Train within your limits, follow safety guidance, stop and seek advice if something hurts or feels wrong, and tell me about changes to your health. Check any equipment you use is suitable and safe.</p>
<h2>Content and intellectual property</h2>
<p>Plans, videos and guides are for your personal use. Please do not copy, share or sell them. If you send me photos or videos, you give me permission to use them to coach you; I will not publish them without your separate written consent.</p>
<h2>Liability</h2>
<p>Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or for anything else the law does not allow me to limit. Otherwise, my liability to you is limited to the fees you paid in the previous ${T('e.g. 3 months')}, and I am not liable for indirect or unforeseeable losses.</p>
<h2>Complaints and law</h2>
<p>If something is wrong, please tell me at ${MAIL} and I will try to put it right. These terms are governed by the laws of ${T('England and Wales')}, and the courts of ${T('England and Wales')} can hear any dispute.</p>`);

legalPage('cookies', 'Cookie Notice', 'What cookies and third-party services the Paul Welsh Coaching website uses.', `
<p>This website does not use advertising, tracking or analytics cookies, and it does not set cookies of its own. A few third-party services are involved, described below.</p>
<h2>Fonts</h2>
<p>The site loads its typeface (Poppins) from Google Fonts. When a page loads, your browser contacts Google, which receives your IP address. Google Fonts does not set cookies for this.</p>
<h2>Booking calendar</h2>
<p>On the Book a Call page, the calendar is provided by Calendly. It only loads after you choose to show it. Once loaded, Calendly may set its own cookies and collect data as described in its <a href="https://calendly.com/privacy">privacy notice</a>. If you prefer not to load it, you can contact me directly at ${MAIL}.</p>
<h2>Changing your mind</h2>
<p>You can delete or block cookies in your browser settings at any time.</p>
${T('If you later add analytics, an email form or social embeds, update this notice and add a cookie consent banner first.')}`);

legalPage('health-disclaimer', 'Health Disclaimer', 'Important health and safety information before you start exercising or changing how you eat.', `
<p>Exercise and changes to how you eat carry some risk. Please read this before you start coaching or follow any guidance on this website.</p>
<h2>Not medical advice</h2>
<p>Coaching and everything on this site is general fitness and lifestyle guidance. It is not medical advice and does not replace advice from your doctor or another qualified health professional.</p>
<h2>Check with your doctor first</h2>
<p>Speak to your doctor before you start if you have a medical condition, injury or ongoing pain, are pregnant or have recently given birth, take regular medication, have not exercised for a long time, or have any doubt about whether exercise is right for you.</p>
<h2>While you train</h2>
<ul><li>Stop straight away and seek advice if you feel pain, dizziness, chest discomfort, unusual breathlessness or faintness.</li><li>Move at a level you can control, and use equipment that is in good condition and suitably installed.</li><li>Tell me about any change to your health so your plan can change with it.</li></ul>
<h2>Food guidance</h2>
<p>Nutrition guidance is general and practical. It is not suitable as treatment for a medical condition, and it is not for anyone with, or recovering from, an eating disorder. If that applies to you, please speak to your doctor first.</p>
<h2>Your responsibility</h2>
<p>You take part at your own risk and are responsible for training within your limits. This does not affect any rights you have that the law does not allow to be limited.</p>`);

// 404 lives at the root; it uses root-relative links so it works from any URL.
{
  const html = page({ path: '404', depth: 0, root: '/', noindex: true, title: 'Page not found | Paul Welsh Coaching', desc: 'This page could not be found.', body: (r) => `
<section class="page-hero nf" style="min-height:100svh;display:grid;align-items:center">${arcs('', 10)}
<div class="wrap"><p class="nf-code" aria-hidden="true">404</p><h1 style="max-width:14ch">That page has gone for a walk.</h1>
<p class="lede">The link may be old or mistyped. Here is a good place to start again.</p>
<div class="hero-actions"><a class="btn" href="${r}">Back to home ${arrow}</a><a class="btn ghost" href="${r}coaching/">See coaching</a><a class="btn ghost" href="${r}book-a-call/">Book a free call</a></div></div></section>` });
  writeFileSync(join(ROOT, '404.html'), html);
}

/* ------------------------------ robots + sitemap ------------------------------ */
const bots = ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai', 'Google-Extended', 'Bingbot'];
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\n${bots.map((b) => `User-agent: ${b}\nAllow: /\n`).join('\n')}\nSitemap: ${SITE}/sitemap.xml\n`);
const urls = ['', 'coaching/', 'about/', 'blog/', 'blog/first-pull-up-beginner-timeline/', 'faq/', 'book-a-call/', 'privacy/', 'terms/', 'cookies/', 'health-disclaimer/'];
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${SITE}/${u}</loc><lastmod>2026-10-01</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log('built', urls.length, 'pages');
