/* Long-form content for the online personal training guide. {r} is replaced with the relative root at build time. */
const link = (href, text) => `<a href="${href}" rel="noopener">${text}</a>`;

export const sections = [
  ['What online coaching actually involves', `<p>The details vary between coaches, but a good online service usually includes:</p>
<ul>
<li>A personalised training plan in an app, with demos for each exercise.</li>
<li>Regular check-ins by video call or message, so the plan changes as you do.</li>
<li>Feedback on your technique from videos you send.</li>
<li>Support between check-ins when you have a question or a rough week.</li>
<li>A way to log your sessions, so progress is something you can see.</li>
</ul>
<p>A typical week looks like this. You open your plan and train two to four times, at a gym or at home. You log your weights and reps. If an exercise feels off, you film a set and send it over. Once a week or once a fortnight you check in, say what went well and what did not, and your coach adjusts the plan. Between those points you can ask a question without waiting for the next session.</p>`],

  ['What the research says, and what it does not', `<p>Be wary of anyone who says online coaching is proven to be better than in-person training, or worse. For everyday adults, the question has not been settled. What the research does suggest is that the format matters less than what you get inside it.</p>
<p><strong>Feedback seems to help.</strong> A ${link('https://pubmed.ncbi.nlm.nih.gov/28573401/', '2017 meta-analysis by Lacroix and colleagues')} looked at 11 studies of adults aged 65 and over, 621 people in total, and found that supervised training programmes produced larger gains in strength and power than unsupervised ones. Adherence did not differ between the two. The studies were not about online coaching, and they involved older adults, so treat the result as a pointer. It fits what most coaches see: having someone check your technique and adjust your plan tends to help.</p>
<p><strong>Online delivery can work.</strong> When ${link('https://doi.org/10.1007/s00520-021-06669-w', 'Winters-Stone and colleagues')} moved two trials of supervised group strength training from in-person to live video during COVID-19 restrictions, attendance was higher online, at 86 to 91 percent of sessions against about 81 to 82 percent in person. Strength improvements on a chair-stand test were similar in some groups, and smaller online in breast cancer survivors (7 percent against 14 percent). This was a small, non-randomised study of cancer survivors, and the authors say that how well online training works compared with in-person training still needs to be established.</p>
<p>What can be said fairly is this. A plan that fits you, that you can follow, with someone giving you feedback, is what matters. The coach, the plan and your consistency decide results far more than whether you are in the same room.</p>`],

  ['How it compares with in-person training', `<p>In-person sessions put a coach next to you, which helps with hands-on cueing. They also mean fixed times and a set location, and you often train with the coach for an hour or less a week. Online coaching trades that for flexibility and support throughout the week. You do the training on your own schedule, then use check-ins and video feedback to stay on track.</p>
<p>Neither is the right answer for everyone. The better question is which one you will keep doing for six months.</p>`],

  ['Who it suits', `<ul>
<li>People with busy or unpredictable schedules, including shift workers and parents.</li>
<li>Anyone training at a gym, at home, or both.</li>
<li>Beginners who want a clear plan and someone to ask when they are unsure.</li>
<li>People starting again after a break who want a steady restart rather than guesswork.</li>
<li>People who do not live near a coach they like.</li>
</ul>`],

  ['Who might prefer something else', `<p>If you need hands-on guidance for every rep, or you find it very hard to train unless someone is there in person, in-person sessions may suit you better. The same goes if you have a complex injury or health condition that needs a clinician or physiotherapist in the room. Some people start in person and move to online coaching once they feel confident.</p>`],

  ['What a good first month looks like', `<p>A good start does not look like a PDF and a pat on the back. It usually looks like this:</p>
<ol>
<li><strong>A health questionnaire and a conversation.</strong> Your coach asks about injuries, medical history, your week, your equipment and what you want from training.</li>
<li><strong>A movement check.</strong> You film a few basic movements, such as a squat, a hinge and a push-up variation, so your coach can see where you are starting from.</li>
<li><strong>A first plan that is deliberately easy.</strong> Week one is about learning the exercises and building a routine, not testing your limits.</li>
<li><strong>An early check-in.</strong> After the first week or two you talk through what felt fine, what felt confusing and what needs changing.</li>
<li><strong>Small adjustments, not a new plan every week.</strong> Weights and reps go up gradually, and exercises stay familiar long enough to improve.</li>
</ol>
<p>If your first month feels rushed, vague or identical to what a friend received, ask questions early.</p>`],

  ['How to think about the price', `<p>Prices for online personal training vary widely, and the headline figure rarely tells you much on its own. Compare what sits behind it:</p>
<ul>
<li><strong>How personal the plan is.</strong> A plan written for you is different from a template with your name on it.</li>
<li><strong>How much contact you get.</strong> Check-in frequency, video feedback and how quickly your coach replies all take the coach's time.</li>
<li><strong>What else is included.</strong> Some services add nutrition guidance, habit coaching or an app. Others charge separately.</li>
<li><strong>The terms.</strong> Rolling monthly arrangements are easier to leave than long fixed terms. Make sure you know the notice period before you pay.</li>
</ul>
<p>Be careful with both ends of the market. Very cheap can mean a generic plan and little feedback, and very expensive does not guarantee more of your coach's attention. Ask for the inclusions and terms in writing, then decide what fits your budget and your goals.</p>`],

  ['How to check an online coach is qualified', `<p>Anyone can call themselves a personal trainer, so it is worth checking. In England, personal training qualifications are awarded by organisations and regulated by Ofqual. The government's ${link('https://www.gov.uk/find-a-regulated-qualification', 'Find a regulated qualification')} service lets you check whether a qualification is officially recognised, and it links to a search for regulated awarding organisations. Ask your coach for the exact name of their qualification and who awarded it.</p>
<p>Many coaches also register with a professional body such as ${link('https://www.cimspa.co.uk/', 'CIMSPA')}, the Chartered Institute for the Management of Sport and Physical Activity. Registration is not a legal requirement, so its absence is not a red flag on its own, but a coach who can show their qualification, insurance and first-aid training is giving you useful information. A good coach will also ask about your health and any injuries before they write a plan.</p>
<p>For transparency, my own qualification, the Active IQ Level 3 Diploma in Personal Training, is regulated by Ofqual and endorsed by CIMSPA.</p>`],

  ['What to ask before you sign up', `<ol>
<li><strong>What exactly is included?</strong> Plans, check-ins, feedback and messaging should be clear in writing.</li>
<li><strong>How often do we speak, and how quickly do you reply?</strong></li>
<li><strong>How is the plan adapted to me?</strong> Be wary of generic PDFs.</li>
<li><strong>How will we know it is working?</strong> Good answers mention weights, reps, movement quality and how you feel, not only the scale.</li>
<li><strong>What happens if it is not working?</strong> A good coach changes the plan.</li>
<li><strong>What are the minimum term and cancellation terms?</strong></li>
<li><strong>What are your qualifications, insurance and experience?</strong> Good coaches are happy to say.</li>
<li><strong>Do you ask about my health before we start?</strong> They should.</li>
</ol>`],

  ['Red flags to watch for', `<ul>
<li>Guaranteed results, or a promise to change your body in a fixed number of days. Progress depends on you, your starting point and your consistency.</li>
<li>The same plan for everyone, or a plan that never changes.</li>
<li>No questions about your health, injuries or experience.</li>
<li>Pressure to sign up on the spot, or unclear terms.</li>
<li>Extreme diets, or advice that goes beyond what a personal trainer should give. Anyone with a medical condition should speak to a doctor or registered dietitian.</li>
</ul>`],

  ['How to get the most out of it', `<ul>
<li><strong>Film your sets.</strong> Set your phone at hip height, side-on, with your whole body in frame. Video feedback is the closest thing to a coach standing beside you.</li>
<li><strong>Be honest at check-ins.</strong> A missed week is useful information, not a failure.</li>
<li><strong>Log your training.</strong> It takes a minute, and it gives your coach something real to work from.</li>
<li><strong>Tell your coach about injuries and changes.</strong> New aches, a bad night's sleep or a stressful month all affect the plan.</li>
<li><strong>Ask questions early.</strong> If an exercise confuses you, send a message before the next session, not after it.</li>
</ul>`],

  ['How Paul Welsh Coaching works', `<p>Coaching combines strength fundamentals and beginner calisthenics, with nutrition guidance if you want it. You get a plan in your app, regular online check-ins and advice by text when you need it. Everything included is confirmed in writing before you start. I hold the Active IQ Level 3 Diploma in Personal Training, which is endorsed by CIMSPA, and you can read more <a href="{r}about/">about me</a>. <a href="{r}coaching/">See what is included</a>, or <a href="{r}book-a-call/">book a free call</a> and ask me anything.</p>`],

  ['Sources', `<ol class="sources">
<li>Lacroix A, Hortobagyi T, Beurskens R, Granacher U. ${link('https://pubmed.ncbi.nlm.nih.gov/28573401/', 'Effects of supervised vs. unsupervised training programs on balance and muscle strength in older adults: a systematic review and meta-analysis')}. Sports Medicine 2017;47(11):2341-2361.</li>
<li>Winters-Stone KM, et al. ${link('https://doi.org/10.1007/s00520-021-06669-w', 'Delivering exercise medicine to cancer survivors: has COVID-19 shifted the landscape for how and who can be reached with supervised group exercise?')} Supportive Care in Cancer 2022;30(3):1903-1906.</li>
<li>GOV.UK. ${link('https://www.gov.uk/find-a-regulated-qualification', 'Find a regulated qualification')} (Register of Regulated Qualifications).</li>
<li>${link('https://www.cimspa.co.uk/', 'CIMSPA, the Chartered Institute for the Management of Sport and Physical Activity')}.</li>
</ol>`],
];

export const faq = [
  ['How does online personal training work?', 'You get a training plan in an app, regular check-ins with your coach, and feedback on your technique from videos you send. You train at the gym or at home, whenever suits you.'],
  ['Is online coaching as effective as in-person training?', 'It can be, if the plan fits you, you follow it consistently, and your coach gives good feedback. The research does not show that either format is better for everyday adults. The quality of the coaching and your commitment matter more than the format.'],
  ['How do I know if an online coach is qualified?', 'Ask for the exact name of their qualification and who awarded it, then check it on the government\'s Find a regulated qualification service. Many coaches also register with a professional body such as CIMSPA, and a good coach will ask about your health before they start.'],
  ['Do I need a gym for online coaching?', 'No. A coach can build a plan for a gym, for home with simple equipment, or a mix. Tell them what you have access to.'],
  ['Do I need to be experienced to get an online coach?', 'No. Beginners are often the people who benefit most from a clear plan, regular feedback and someone to ask when they are unsure.'],
  ['Can I get an online coach if I have an injury?', 'Speak to your doctor or physiotherapist first, then tell your coach about it. A good coach will adapt the plan around it, or tell you honestly if you need in-person or clinical support instead.'],
  ['How much does online personal training cost?', 'It varies widely between coaches, so compare what is included rather than the headline price. Ask for a clear list of plans, check-ins, feedback and support in writing. For my own coaching, you will hear the exact price on a free call, before you commit to anything.'],
];
