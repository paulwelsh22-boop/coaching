// Generates the static site into ../ . Run: node tools/build.mjs
// Change SITE and BOOKING_URL once your domain and booking link are known, then re-run.
import { mkdirSync, writeFileSync } from 'node:fs';
import { POSTS } from './posts.mjs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://paulwelshcoaching.com'; // TODO: confirm (with or without www)
const EMAIL = 'hello@paulwelshcoaching.com';
const GA_ID = 'G-GQMZ4PN6PZ'; // Google Analytics 4. Leave empty to switch analytics and the cookie banner off.
const BOOKING_URL = 'https://calendar.app.google/1KBg3BsF3Zg69i1c6'; // Google Calendar appointment page // kept for when coaching opens; /book-a-call/ is a waitlist for now
const KIT_FORM_URL = 'https://app.kit.com/forms/10067951/subscriptions'; // Kit (ConvertKit) form, posted to by the native waitlist form
const SPOTS_OPEN = 'in a few weeks'; // waitlist copy: "Coaching spots open ..."
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
const markImg = (r) => `<img src="${r}assets/paul-welsh-coaching-mark-dark.png" alt="" width="104" height="104" loading="lazy">`;

const favicon = 'assets/favicon.png';

/* ------------------------------ FAQ data ------------------------------ */
const FAQ = {
  cost: ['How much does online coaching cost?', SHOW_PRICES ? 'Plans start from £80 a month, or £100 a month with nutrition guidance. Your first call is free, with no obligation.' : 'Coaching is a monthly Membership, with or without nutrition guidance. You will hear the exact price on your free call, before you commit to anything.'],
  exp: ['Do I need any experience to start?', 'No. Paul Welsh Coaching is a great place to start, whether you have never trained, are coming back after a break, or already train and want more structure. No gym background, no calisthenics experience and no starting strength required. If you cannot yet do a push-up or a pull-up, that is the point.'],
  online: ['Is this in-person or online?', 'Fully online and remote. Coaching happens through your training app and WhatsApp, so it works wherever you are in the world.'],
  diff: ['How is this different from a normal personal trainer?', 'Most personal trainers and calisthenics accounts assume you already have a training base. Paul Welsh Coaching starts from where you are: learning how to move properly, a clear way to progress, and food guidance that does not assume you already know what you are doing.'],
  get: ['What do I get with coaching?', 'A personalised training plan in an app, a video demo for every exercise, regular check-ins and direct contact with me.'],
  involve: ['What does online coaching involve?', 'A personalised training plan in an app, with a video demo of every exercise, regular check-ins to review how it is going, and direct contact with me between check-ins. Your plan is adjusted as you get stronger.'],
  loss: ['Is this just for weight loss?', 'No. People start for lots of reasons: getting stronger, learning to move well, building confidence, or simply having a routine they can stick to. We set your goal on the first call and build the plan around it.'],
  busy: ['Will this work around a busy schedule?', 'Yes. The plan is built around the time you actually have, not an ideal week. Short, consistent sessions beat long ones you cannot keep up, so we start with what fits and build from there.'],
  social: ['What about social events and eating out?', 'Nutrition guidance is practical, not restrictive. You do not have to give up meals out or time with friends. We focus on simple habits you can keep up while still enjoying your life.'],
  call: ['What happens after I book a call?', 'You will have a 15 minute call to talk through your goals and where you are now. If it is a fit, you get a plan built around your starting point and a start date.'],
  kit: ['Do I need equipment?', 'No. The early stages are designed around bodyweight and a pull-up bar. Equipment recommendations come later, only if they are useful.'],
  often: ['How often will we be in touch?', 'You get regular check-ins plus messaging between them, so you are never guessing whether you are doing it right.'],
  cancel: ['Can I cancel anytime?', 'Cancellation terms are explained plainly on your free call, before you commit to anything.'],
  know: ['Do I need to know what I want before I book?', 'No. The call is there to work out the right starting point together, whether you are brand new or already training.'],
  oblig: ['Is there any obligation to sign up after the call?', 'No. It is a genuine conversation, not a sales call in disguise. If it is not a fit, I will tell you.'],
  wlWhat: ['What happens when I join?', 'Kit, my email provider, will send you an email asking you to confirm your address. Once you have, I will email you when coaching spots open, and now and then send training tips.'],
  wlFree: ['Is joining free, and is there any obligation?', 'It is free, and there is no obligation. Joining just means you hear about coaching spots first. You can unsubscribe at any time.'],
  wlWhen: ['When do coaching spots open?', `Coaching spots open ${SPOTS_OPEN}. I will email the waitlist first.`],
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
<meta property="og:type" content="${ogType}"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/assets/paul-welsh-handstand-calisthenics-coach.jpg"><meta name="twitter:card" content="summary_large_image">
${GA_ID ? `<meta name="ga-id" content="${GA_ID}">` : ''}
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
<a class="brand" href="${r || './'}" aria-label="Paul Welsh Coaching, home"><img src="${r}assets/paul-welsh-coaching-logo-light.png" alt="Paul Welsh Coaching" width="149" height="34"></a>
<button class="nav-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Menu"><span></span><span></span></button>
<ul class="nav-links" id="nav-links">${nav}<li><a class="btn sm" href="${r}book-a-call/">Book a free call</a></li></ul>
</div></header>
<main id="main">
${body(r)}
</main>
<footer class="footer"><div class="wrap">
<div class="brand"><img src="${r}assets/paul-welsh-coaching-logo-stacked-light.png" alt="Paul Welsh Coaching" width="139" height="96"><p>Movement for real life. Strength, calisthenics, movement and nutrition guidance, online.<br><a href="mailto:${EMAIL}">${EMAIL}</a></p></div>
<nav aria-label="Footer"><a href="${r}coaching/">Coaching</a><a href="${r}about/">About</a><a href="${r}blog/">Blog</a><a href="${r}faq/">FAQ</a><a href="${r}book-a-call/">Contact</a><a href="https://www.instagram.com/paulwelshcoaching" target="_blank" rel="noopener me">Instagram</a></nav>
<small><span>&copy; 2026 Paul Welsh Coaching. Online coaching, wherever you are.</span><span class="legal"><a href="${r}privacy/">Privacy</a><a href="${r}terms/">Terms</a><a href="${r}cookies/">Cookies</a><a href="${r}health-disclaimer/">Health disclaimer</a>${GA_ID ? '<button type="button" data-cookie-settings>Cookie settings</button>' : ''}</span></small>
</div></footer>
${path === 'book-a-call/' || path === 'thanks/' ? '' : `<a class="btn sticky-cta" href="${r}book-a-call/">Book a free call ${arrow}</a>`}
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

const org = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Paul Welsh Coaching', email: EMAIL, url: SITE + '/', logo: SITE + '/assets/paul-welsh-coaching-logo-dark.png', description: 'Online strength and calisthenics coaching, built for people starting out.', sameAs: ['https://www.instagram.com/paulwelshcoaching'] };

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
<div class="hero-photo"><img src="${r}assets/paul-welsh-handstand-calisthenics-coach.jpg" alt="Paul Welsh, online calisthenics coach, holding a handstand on parallettes in a busy gym" width="2000" height="1126" fetchpriority="high"></div>
<div class="wrap hero-inner">
<h1>${words("Your first rep ~starts ~here.")}</h1>
<p class="lede fade-in">Online coaching in strength, calisthenics and movement, with nutrition guidance that fits your life. Ideal if you are new to training or starting again: learn the technique, build the basics, and know exactly how to progress.</p>
<div class="hero-actions fade-in d2"><a class="btn" href="${r}book-a-call/">Book a free call ${arrow}</a></div>
<div class="hero-foot fade-in d2"><span>Online coaching</span><span>Strength fundamentals</span><span>Beginner calisthenics</span><span>Nutrition guidance</span></div>
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
<div class="bleed-bg" data-parallax><img src="${r}assets/l-sit-calisthenics-parallettes-training.jpg" alt="Paul Welsh holding an L-sit on parallettes during calisthenics training" width="2000" height="1126" loading="lazy"></div>
<div class="wrap">
<div class="bleed-head"><h2 data-reveal>What coaching actually <span class="hl">includes</span></h2>
<p data-reveal>Most people don't need more motivation. They need a plan that fits their week, and someone in their corner.</p>
<a class="btn" data-reveal href="${r}book-a-call/">Book a free call ${arrow}</a></div>
<div class="glass-grid">
<article class="glass" data-reveal><h3>A plan built around where you are</h3><p>The fundamentals, sequenced so the first few weeks are genuinely achievable.</p></article>
<article class="glass" data-reveal><h3>Technique you can trust</h3><p>Every movement taught step by step, with form feedback on your own videos.</p></article>
<article class="glass" data-reveal><h3>A clear way to progress</h3><p>An easier and a harder version of every exercise, so you always know what is next.</p></article>
<article class="glass" data-reveal><h3>Movement, built in</h3><p>Warm-ups, better positions and recovery routines, so you move well and bounce back.</p></article>
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
  desc: 'Online coaching in strength, calisthenics, movement and nutrition guidance, ideal if you are new to training or starting again. See what is included.',
  ld: [org, faqLd(['involve', 'cost', 'busy', 'social', 'call', 'kit', 'often', 'cancel'])],
  body: (r) => `
<section class="page-hero about-hero coaching-hero">${arcs('', 9)}
<div class="hero-photo coaching-photo-hero"><img src="${r}assets/paul-welsh-gymnastic-rings-l-sit-calisthenics.jpg" alt="Paul Welsh hanging from gymnastic rings with his legs held out in front, a calisthenics skill, in a busy gym" width="720" height="1280" fetchpriority="high"></div>
<div class="wrap"><h1>Coaching built for your <span class="hl">first rep</span>, not your fiftieth</h1>
<p class="lede">Strength, calisthenics, movement and nutrition guidance that fits a real schedule. Delivered remotely, with a coach who answers.</p>
<a class="btn" href="${r}book-a-call/">Book a free call ${arrow}</a></div></section>



<section class="parts pad" style="padding-bottom:clamp(40px,6vw,88px)">
<div class="wrap parts-head"><h2 data-reveal>Four parts, <span class="hl">one plan</span></h2>
<div class="car-ctrl" aria-label="Browse the four parts"><button type="button" data-car-prev aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button><button type="button" data-car-next aria-label="Next">${arrow}</button></div></div>
<div class="car" data-car tabindex="0" aria-label="Four parts of coaching, scroll sideways"><div class="car-track">
<article class="part p1"><div>${icoLg('dumb')}<h3>Strength fundamentals</h3><p>Regular gym training, taught from the start.</p></div><ul class="chips"><li>Squat and hinge</li><li>Push and pull</li><li>Gym confidence</li></ul></article>
<article class="part p2"><div>${icoLg('bar')}<h3>Beginner calisthenics</h3><p>Bodyweight skills, built step by step.</p></div><ul class="chips"><li>Push-ups and rows</li><li>Hangs and pull-ups</li><li>Body control</li></ul></article>
<article class="part p3"><div>${icoLg('flex')}<h3>Movement quality</h3><p>Built into your sessions, not a separate programme. You learn to move well as you train.</p></div><ul class="chips"><li>Warm-ups</li><li>Better positions</li><li>Recovery routines</li></ul></article>
<article class="part p4"><div>${icoLg('food')}<h3>Nutrition guidance</h3><p>Practical, not restrictive.</p></div><ul class="chips"><li>Easy meals</li><li>Eating to train</li><li>Nutrition plan</li></ul></article>
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
<div class="mid-cta" data-reveal><p>Not sure it is right for you? Talk it through with Paul first.</p><a class="btn" href="${r}book-a-call/">Book a free call ${arrow}</a></div>
</div></section>

<section class="pad"><div class="wrap">
<h2 data-reveal style="margin-bottom:clamp(32px,5vw,56px)">What's <span class="hl">included</span></h2>
<div class="inc-cards">
<article class="inc-card" data-reveal><div class="bg" style="--img:url(${r}assets/online-training-plan-in-coaching-app.jpg);--pos:30% 55%;--size:cover" role="img" aria-label="Person using a training app on their phone to follow an online workout plan"></div><h3>Your plan, in your app</h3><p>A personalised plan in your own branded training app, with a video demo of every exercise.</p></article>
<article class="inc-card" data-reveal><div class="bg" style="--img:url(${r}assets/online-coaching-video-call-check-in-laptop.jpg);--pos:50% 35%;--size:cover" role="img" aria-label="Overhead view of a person on a laptop video call with their online coach, taking notes in a notebook"></div><h3>Regular check-ins</h3><p>Regular online check-ups, alongside advice by text whenever you need it.</p></article>
<article class="inc-card" data-reveal><div class="bg" style="--img:url(${r}assets/healthy-chicken-rice-bowl-nutrition-guidance.jpg);--pos:50% 50%;--size:cover" role="img" aria-label="A healthy rice bowl with chicken and vegetables, an example of practical nutrition guidance"></div><h3>Nutrition guidance</h3><p>Simple, practical and non-restrictive. Add it to any plan.</p></article>
<article class="inc-card" data-reveal><div class="bg" style="--img:url(${r}assets/muscular-arm-close-up-progress-tracking.jpg);--pos:50% 38%;--size:cover" role="img" aria-label="Close-up of a muscular arm, representing strength progress tracking"></div><h3>Progress tracking</h3><p>Your training in one place, so your first rep is something you can point to.</p></article>
</div>
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
<section class="page-hero about-hero">${arcs('', 9)}
<div class="hero-photo about-photo-hero" role="img" aria-label="Paul Welsh, qualified online personal trainer, standing in front of a gym mirror" style="--img:url(${r}assets/paul-welsh-personal-trainer-portrait.jpg)"></div>
<div class="wrap"><h1>Hi, I'm Paul. I'll help you <span class="hl">start, and keep going.</span></h1>
<a class="btn" href="${r}book-a-call/">Let's talk ${arrow}</a></div></section>

<section class="bleed about-bleed">
<div class="bleed-bg" data-parallax><img src="${r}assets/paul-welsh-barbell-curl-strength-training.jpg" alt="Paul Welsh, online personal trainer, doing a barbell preacher curl in the gym" width="2000" height="1126" loading="eager"></div>
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
const readTime = (p) => Math.max(2, Math.round((p.answer + p.sections.map((x) => x[1]).join(' ')).replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200));
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
<div class="f-img"><img src="${r}assets/beginner-pull-up-progression-dark-gym.jpg" alt="Man doing a pull-up, seen from behind in a dark gym, for a beginner pull-up progression guide" width="1067" height="1600" loading="lazy" style="object-position:50% 40%"></div>
<div class="f-body"><p class="f-meta"><span>Beginner guide</span><span>3 min read</span><span>Updated ${UPDATED}</span></p>
<h2>${t}</h2>
<p class="f-ex">There is no single timeline for a first pull-up. Here is what affects it, the building blocks that get you there, and why smaller progress still counts.</p>
<span class="text-link">Read the guide ${arrow}</span></div></a>`).join('')}
</div></section>
<section class="pad" style="padding-top:clamp(56px,7vw,100px)"><div class="wrap">
<h2 data-reveal style="margin-bottom:clamp(32px,5vw,56px)">More guides</h2>
<div class="post-grid">
${POSTS.map((p) => `<a class="post-card" href="${r}blog/${p.slug}/" data-reveal>
<div class="f-img"><img src="${r}assets/${p.img}" alt="${p.alt}" width="1067" height="800" loading="lazy" style="object-position:${p.pos}"></div>
<p class="f-meta"><span>${p.cat}</span><span>${readTime(p)} min read</span></p>
<h3>${p.h1.replace(/<[^>]+>/g, '')}</h3>
<p class="f-ex">${p.excerpt}</p>
<span class="text-link">Read the guide ${arrow}</span></a>`).join('')}
</div>
<div class="mid-cta" data-reveal><p>Want a question answered? Ask it on a free call and it might become the next guide.</p><a class="btn" href="${r}book-a-call/">Book a free call ${arrow}</a></div>
</div></section>
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

/* ------------------------------ BLOG POSTS ------------------------------ */
const postTitles = { 'first-pull-up-beginner-timeline': 'How long does it take to get your first pull-up?', ...Object.fromEntries(POSTS.map((p) => [p.slug, p.title])) };
for (const p of POSTS) {
  write(`blog/${p.slug}`, page({
    path: `blog/${p.slug}/`, depth: 2, ogType: 'article',
    title: p.title, desc: p.desc,
    ld: [org,
      { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.desc, image: `${SITE}/assets/${p.img}`, author: { '@type': 'Person', name: 'Paul', worksFor: { '@type': 'Organization', name: 'Paul Welsh Coaching' } }, publisher: { '@type': 'Organization', name: 'Paul Welsh Coaching' }, datePublished: '2026-10-14', dateModified: '2026-10-14', mainEntityOfPage: `${SITE}/blog/${p.slug}/` },
      faqLd([], p.faq)],
    body: (r) => `
<section class="page-hero" style="padding-bottom:40px">${arcs('', 8)}
<div class="wrap"><div class="article"><h1 style="max-width:18ch;font-size:clamp(2.25rem,5vw,4.25rem)">${p.h1}</h1>
<p class="meta">By Paul, Paul Welsh Coaching &middot; ${readTime(p)} min read &middot; Last updated: ${UPDATED}</p></div></div></section>
<article class="pad" style="padding-top:24px"><div class="wrap"><div class="article">
<p class="answer">${p.answer}</p>
${p.sections.map(([h, html]) => `<h2>${h}</h2>\n${html.replaceAll('{r}', r)}`).join('\n')}
<h2>Common questions</h2>
${p.faq.map(([q, a]) => `<div class="qa"><h3>${q}</h3><p>${a}</p></div>`).join('')}
<h2>Keep reading</h2>
<ul class="read-more">${p.related.map((sl) => `<li><a href="${r}blog/${sl}/">${postTitles[sl]}</a></li>`).join('')}</ul>
<div class="article-end"><a class="btn" href="${r}book-a-call/">Book a free call ${arrow}</a></div>
</div></div></article>`,
  }));
}

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

/* ------------------------------ BOOK (waitlist) ------------------------------ */
// Native form that posts to Kit. With JS it submits via fetch (assets/main.js, [data-waitlist]); without JS it posts
// normally and Kit redirects to /thanks/ (set the form's success redirect in Kit to SITE + '/thanks/').
const waitlistKeys = ['wlWhat', 'wlFree', 'wlWhen', 'away'];
const goals = ['Get stronger', 'Learn calisthenics', 'Get back into training', 'Improve nutrition', 'Not sure yet'];
write('book-a-call', page({
  path: 'book-a-call/', depth: 1,
  title: 'Join the waitlist | Paul Welsh Coaching',
  desc: `Online coaching spots with Paul Welsh Coaching open ${SPOTS_OPEN}. Join the waitlist to hear first. Free, no obligation.`,
  ld: [org, faqLd(waitlistKeys)],
  body: (r) => `
<section class="page-hero" style="padding-bottom:clamp(32px,5vw,64px)">${arcs('', 9)}
<div class="wrap"><h1 style="max-width:16ch">Coaching opens soon. <span class="hl">Join the waitlist.</span></h1>
<p class="lede">Online coaching spots open ${SPOTS_OPEN}. Join the waitlist and I will email you first, with no pressure and no card details.</p></div></section>
<section class="pad" style="padding-top:clamp(40px,6vw,88px)"><div class="wrap book-grid">
<div class="book-main"><h2>Get on the list</h2><p class="lede">Tell me a little about you. Want to know what coaching includes first? <a href="${r}coaching/">See what is included</a>.</p>
<div class="wl-card">
<form class="wl-form" data-waitlist action="${KIT_FORM_URL}" method="post" accept-charset="utf-8" aria-describedby="wl-status">
<div class="wl-field"><label for="wl-name">First name</label><input id="wl-name" name="fields[first_name]" type="text" autocomplete="given-name" required></div>
<div class="wl-field"><label for="wl-email">Email</label><input id="wl-email" name="email_address" type="email" autocomplete="email" inputmode="email" required></div>
<div class="wl-field"><label for="wl-goal">What's your main goal? <span class="wl-opt">Optional</span></label><select id="wl-goal" name="fields[main_goal]"><option value="">Choose one</option>${goals.map((g) => `<option>${g}</option>`).join('')}</select></div>
<div class="wl-hp" aria-hidden="true"><label for="wl-website">Leave this field empty</label><input id="wl-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
<label class="wl-consent" for="wl-consent"><input id="wl-consent" type="checkbox" required><span>I'm happy for Paul Welsh Coaching to email me about coaching spots and training tips. I can unsubscribe at any time. <a href="${r}privacy/">Privacy policy</a></span></label>
<button class="btn wl-submit" type="submit"><span class="wl-label">Join the waitlist</span><span class="wl-spin" aria-hidden="true"></span>${arrow}</button>
<div class="wl-status" id="wl-status" role="status" aria-live="polite" data-wl-status></div>
</form>
</div>
<ul class="book-facts"><li>Free to join</li><li>No obligation</li><li>Unsubscribe any time</li></ul><p class="book-alt">Prefer to write? Email <a href="mailto:${EMAIL}">${EMAIL}</a>.</p></div>
<div><div class="faq-list" style="border-color:var(--line)">${faqHtml(waitlistKeys)}</div></div>
</div></section>`,
}));

write('thanks', page({
  path: 'thanks/', depth: 1, noindex: true,
  title: 'You are on the list | Paul Welsh Coaching',
  desc: 'Thanks for joining the Paul Welsh Coaching waitlist.',
  body: (r) => `
<section class="page-hero" style="min-height:70svh;display:grid;align-items:center">${arcs('', 9)}
<div class="wrap"><h1 style="max-width:14ch">You're on the <span class="hl">list.</span></h1>
<p class="lede">Check your inbox and confirm your email, so I can add you properly. If it has not arrived in a few minutes, look in your spam folder. Coaching spots open ${SPOTS_OPEN}.</p>
<div class="hero-actions"><a class="btn" href="${r}blog/">Read the blog ${arrow}</a><a class="btn ghost" href="${r}coaching/">See what coaching includes</a></div></div></section>`,
}));

/* ------------------------------ LEGAL + 404 ------------------------------ */
// Drafts for a UK sole trader / small business. Highlighted [ ] items are facts only you know.
const T = (t) => `<mark class="todo">[${t}]</mark>`;
const BIZ = 'Paul Welsh', ADDR = '43 Northmead Road, L19 5NN', MAIL = `<a href="mailto:${EMAIL}">${EMAIL}</a>`;
const legalPage = (path, title, desc, inner) => write(path, page({
  path: path + '/', depth: 1, title: title + ' | Paul Welsh Coaching', desc, ld: [],
  body: () => `<section class="page-hero" style="padding-bottom:40px">${arcs('', 8)}
<div class="wrap"><div class="article"><h1 style="font-size:clamp(2.25rem,5vw,4rem)">${title}</h1><p class="meta">Last updated: ${UPDATED}</p></div></div></section>
<article class="pad" style="padding-top:24px"><div class="wrap"><div class="article legal-doc">${inner}</div></div></article>`,
}));

legalPage('privacy', 'Privacy Policy', 'How Paul Welsh Coaching collects, uses and protects your personal information.', `
<p>This policy explains how ${BIZ}, trading as Paul Welsh Coaching ("I", "me"), looks after your personal information. I am the data controller. You can contact me at ${MAIL} or at ${ADDR}.</p>
<p>I am based in Spain and provide coaching to people in the UK and elsewhere. I follow UK data protection law (the UK GDPR and the Data Protection Act 2018) and, where it applies, the EU GDPR.</p>
<h2>What I collect</h2>
<ul>
<li><strong>When you join the waitlist:</strong> your first name, email address and, if you choose to tell me, your main goal. This goes to Kit, my email provider, when you submit the form.</li>
<li><strong>When you get in touch or book a call:</strong> your name, email address and any notes you add, by email or through Google Calendar's appointment booking if I have it switched on.</li>
<li><strong>When you become a client:</strong> your contact details, goals and training history; your answers to the PAR-Q health questionnaire and any other health or injury information you choose to share; your training and progress data in the coaching app (Trainerize); our messages; and any photos or videos you send for form checks.</li>
<li><strong>Payments:</strong> paid by bank transfer to my Monzo business account or through PayPal. I see the name and payment details your bank or PayPal shares with me. I do not store card details.</li>
<li><strong>When you use this website:</strong> basic technical data your browser sends when pages load. If you choose to accept analytics cookies, Google Analytics also records how you use the site, such as pages visited, device type and approximate location. See the <a href="../cookies/">cookie notice</a>.</li>
</ul>
<h2>Why I use it, and my legal basis</h2>
<ul>
<li>To email you about coaching spots and training tips if you join the waitlist: your consent, which you can withdraw at any time by unsubscribing.</li>
<li>To answer your enquiry and book a call: legitimate interests, and steps you ask me to take before a contract.</li>
<li>To provide coaching: performance of our contract.</li>
<li>Health information, including your PAR-Q answers: this is special category data. I process it only with your explicit consent, which you can withdraw at any time, although I may then be unable to coach you safely.</li>
<li>To keep payment and accounting records: legal obligation.</li>
<li>Website analytics: your consent, through the cookie banner.</li>
</ul>
<h2>Who I share it with</h2>
<p>Only the providers I need to run the service. They process data on my instructions or under their own terms. I do not sell your data.</p>
<ul>
<li><strong>Google:</strong> Google Workspace (my email), Google Calendar (booking), Google Meet (video check-ins), Google Drive (photos and videos you send) and, if you accept, Google Analytics.</li>
<li><strong>Kit:</strong> the email service that holds the waitlist and sends my emails.</li>
<li><strong>Trainerize:</strong> the coaching app that holds your plan and training data.</li>
<li><strong>Monzo and PayPal:</strong> payments.</li>
<li><strong>Cloudflare and GoDaddy:</strong> hosting my website and my domain name.</li>
</ul>
<p>Some of these providers are based outside the UK and the European Economic Area. Where that happens, I rely on approved safeguards such as the UK International Data Transfer Agreement, standard contractual clauses or an adequacy decision.</p>
<h2>How long I keep it</h2>
<ul>
<li>Coaching records, including health questionnaires, messages, photos and videos: up to 24 months after our work ends, then deleted.</li>
<li>Payment and accounting records: for as long as the law requires, which is usually 6 years.</li>
<li>Enquiries that do not become coaching: 12 months, then deleted.</li>
</ul>
<h2>Your rights</h2>
<p>You can ask to see, correct, delete or export your data, to restrict or object to how I use it, and to withdraw consent. Email ${MAIL} and I will reply within one month. If you are unhappy, you can complain to the Information Commissioner's Office (ICO) at <a href="https://ico.org.uk">ico.org.uk</a>, or to the Spanish data protection authority, the AEPD, at <a href="https://www.aepd.es">aepd.es</a>.</p>
<h2>Age</h2>
<p>Coaching is for adults aged 18 and over.</p>
<h2>Changes</h2>
<p>If I change this policy I will update the date above.</p>`);

legalPage('terms', 'Terms of Service', 'The terms that apply when you book a call or sign up for coaching with Paul Welsh Coaching.', `
<p>These terms apply to coaching provided by ${BIZ}, trading as Paul Welsh Coaching, of ${ADDR}. By starting coaching you agree to them. They do not affect your statutory rights as a consumer.</p>
<h2>The service</h2>
<p>Online coaching includes a personalised training plan in a coaching app, exercise demos, regular online check-ins by video call, and advice by text when you need it. If you choose the nutrition option, it also includes practical food guidance. Exactly what is included is confirmed in writing before you start.</p>
<h2>Before you start</h2>
<p>You confirm you are 18 or over. You will complete a PAR-Q health questionnaire before we begin and answer it honestly. If you have a medical condition, are pregnant or have been injured, speak to your doctor first. See the <a href="../health-disclaimer/">health disclaimer</a>.</p>
<h2>Free call</h2>
<p>The introductory call is free, with no obligation to sign up.</p>
<h2>Price and payment</h2>
<p>Coaching is charged monthly at the price agreed with you in writing before you start. Payment is by bank transfer to my Monzo business account or through PayPal, taken on the date we agree. I will give you 30 days' notice of any price change.</p>
<h2>Cancelling</h2>
<p>You can cancel by giving me notice in writing, by text or email. The minimum notice period is 30 days from the date you give notice, and any unpaid amounts, including those that fall due during the notice period, remain payable in full.</p>
<p>Because the service is supplied at a distance, you have a 14-day right to cancel from the date you sign up. If you ask me to start coaching within those 14 days and then cancel, you will pay for the service already provided.</p>
<h2>Results</h2>
<p>I will coach you with reasonable care and skill. I cannot guarantee particular results, because they depend on many things including your effort, consistency, health and circumstances.</p>
<h2>Your responsibilities</h2>
<p>Train within your limits, follow safety guidance, stop and seek advice if something hurts or feels wrong, and tell me about changes to your health. Check any equipment you use is suitable and safe.</p>
<h2>Content and intellectual property</h2>
<p>Plans, videos and guides are for your personal use. Please do not copy, share or sell them. If you send me photos or videos, you give me permission to use them to coach you; I will not publish them without your separate written consent.</p>
<h2>Insurance</h2>
<p>I hold professional insurance for my coaching.</p>
<h2>Liability</h2>
<p>Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or for anything else the law does not allow me to limit. Otherwise, my liability to you is limited to the fees you paid in the previous 3 months, and I am not liable for indirect or unforeseeable losses.</p>
<h2>Complaints and law</h2>
<p>If something is wrong, please tell me at ${MAIL} and I will try to put it right. These terms are governed by the laws of England and Wales, and the courts of England and Wales can hear any dispute.</p>`);

legalPage('cookies', 'Cookie Notice', 'What cookies and third-party services the Paul Welsh Coaching website uses.', `
<p>This website sets no cookies of its own for advertising. It uses one optional analytics tool, which only runs if you say yes, and a few services that load from other companies.</p>
<h2>Analytics (optional)</h2>
<p>If you click Accept on the cookie banner, I use Google Analytics to see how people use the site, such as which pages are read and on what kind of device. It sets cookies called <code>_ga</code> and <code>_ga_</code> followed by an ID, which last up to two years. If you click Decline, or ignore the banner, Google Analytics does not load and no analytics cookies are set. You can change your mind at any time with <strong>Cookie settings</strong> in the footer.</p>
<h2>Search Console</h2>
<p>I use Google Search Console to see how the site appears in Google search. It works on Google's side and sets no cookies on your device.</p>
<h2>Fonts</h2>
<p>The site loads its typeface (Poppins) from Google Fonts. When a page loads, your browser contacts Google, which receives your IP address. Google Fonts does not set cookies for this.</p>
<h2>Hosting</h2>
<p>The site is delivered by Cloudflare, which may use strictly necessary cookies for security and performance.</p>
<h2>Waitlist</h2>
<p>The waitlist form on the Join the waitlist page sends your details to Kit when you press the button. This website does not load Kit's scripts and sets no cookies for it. Kit's own privacy policy applies to the data it holds. If you prefer not to use the form, you can email me at ${MAIL}.</p>
<h2>Changing your mind</h2>
<p>You can delete or block cookies in your browser settings at any time.</p>`);

legalPage('health-disclaimer', 'Health Disclaimer', 'Important health and safety information before you start exercising or changing how you eat.', `
<p>Exercise and changes to how you eat carry some risk. Please read this before you start coaching or follow any guidance on this website.</p>
<h2>Not medical advice</h2>
<p>Coaching and everything on this site is general fitness and lifestyle guidance. It is not medical advice and does not replace advice from your doctor or another qualified health professional.</p>
<h2>Health questionnaire and your doctor</h2>
<p>Before we start you will complete a PAR-Q health questionnaire. Speak to your doctor first if you have a medical condition, injury or ongoing pain, are pregnant or have recently given birth, take regular medication, have not exercised for a long time, or have any doubt about whether exercise is right for you.</p>
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
const urls = ['', 'coaching/', 'about/', 'blog/', 'blog/first-pull-up-beginner-timeline/', ...POSTS.map((p) => `blog/${p.slug}/`), 'faq/', 'book-a-call/', 'privacy/', 'terms/', 'cookies/', 'health-disclaimer/'];
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${SITE}/${u}</loc><lastmod>2026-10-09</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log('built', urls.length, 'pages');
