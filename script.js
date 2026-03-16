
/* ── LOCAL AUTH SYSTEM ── */
const _AUTH = {
  getUsers()  { try { return JSON.parse(localStorage.getItem('fra_users') || '{}'); } catch(e) { return {}; } },
  saveUsers(u){ localStorage.setItem('fra_users', JSON.stringify(u)); },
  getSession(){ try { return JSON.parse(localStorage.getItem('fra_session') || 'null'); } catch(e) { return null; } },
  saveSession(u){ localStorage.setItem('fra_session', JSON.stringify(u)); },
  clearSession(){ localStorage.removeItem('fra_session'); },

  register(first, last, email, org, country, pass) {
    const users = this.getUsers();
    const key = email.toLowerCase();
    if (users[key]) return { error: 'An account with that email already exists. Try signing in.' };
    const user = { first, last, email: key, org, country, pass, createdAt: new Date().toISOString() };
    users[key] = user;
    this.saveUsers(users);
    const session = { first, last, email: key, org, country };
    this.saveSession(session);
    window._currentUser = session;
    return { user: session };
  },

  signIn(email, pass) {
    const users = this.getUsers();
    const key = email.toLowerCase();
    const user = users[key];
    if (!user) return { error: 'No account found with that email.' };
    if (user.pass !== pass) return { error: 'Incorrect password. Try again.' };
    const session = { first: user.first, last: user.last, email: key, org: user.org, country: user.country };
    this.saveSession(session);
    window._currentUser = session;
    return { user: session };
  },

  signOut() {
    this.clearSession();
    window._currentUser = null;
    _updateNavForAuth(null);
  },

  init() {
    const session = this.getSession();
    window._currentUser = session || null;
    _updateNavForAuth(session);
  }
};

function _updateNavForAuth(user) {
  document.querySelectorAll('.nav-signin-btn').forEach(el => {
    if (user) {
      el.textContent = user.first || user.email.split('@')[0];
      el.style.background = 'var(--emerald)';
      el.style.color = '#fff';
      el.style.borderColor = 'var(--emerald)';
      el.onclick = () => { if (confirm('Sign out of FundReady Academy?')) { _AUTH.signOut(); showToast('Signed out. See you soon!'); } };
    } else {
      el.textContent = 'Sign In';
      el.style.background = '';
      el.style.color = '';
      el.style.borderColor = '';
      el.onclick = () => navigate('sign-in');
    }
  });
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => _AUTH.init());


/* ═══ BLOCK SEPARATOR ═══ */


// VERSION CHECK - remove after debug
setTimeout(function(){
  var pg = document.querySelector('.page.active');
  if(pg && pg.id === 'page-track-learn'){
    var body = document.getElementById('trackLearnBody');
    if(body && !body.innerHTML.trim()){
      body.innerHTML = '<div style="padding:30px;background:orange;color:#000;font-size:16px;font-weight:bold;border-radius:8px;margin:20px">DEBUG: page-track-learn is active but trackLearnBody is empty after 2 seconds. renderTrackLearnPage did not write to it.</div>';
    }
    var hero = document.getElementById('trackLearnHeroContent');
    if(hero && !hero.innerHTML.trim()){
      hero.innerHTML = '<h2 style="color:#fff">DEBUG: Hero content is empty</h2>';
    }
  }
}, 2000);


/* ═══ BLOCK SEPARATOR ═══ */


/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */
const LESSONS = [
  {id:1,cat:'Readiness',title:'Fundraising Readiness & Direction',level:'Beginner',duration:'5 min',count:5,desc:'Build the minimum foundation to fundraise with clarity and focus — goals, channels, governance, team roles, and your 90-day plan.',subcaps:['Clear fundraising goals and targets','Priority funding channels (2–3)','Simple governance and ethical safeguards','Team roles and weekly fundraising routines','90-day readiness plan'],assets:['Readiness checklist','90-day plan','Targets by channel']},
  {id:2,cat:'Messaging',title:'Value Proposition, Messaging & Case for Support',level:'Beginner',duration:'6 min',count:5,desc:'Clearly explain why your NGO matters, what it achieves, and what support will do. Build a one-pager that converts in 60 seconds.',subcaps:['One-page case for support','Core messaging (3 audience versions: grants/corporates/individuals)','Problem–solution–proof–ask storyline','Credibility proof points (numbers + testimonials)','Pitch scripts (30 sec / 60 sec)'],assets:['One-pager','Key messages','Pitch scripts']},
  {id:3,cat:'Packaging',title:'Program Packaging into Fundable Offers',level:'Intermediate',duration:'5 min',count:5,desc:'Present your programs as fundable "offers" with outcomes, costs, and tiers. Turn activities into structured packages donors can actually fund.',subcaps:['One-line promise (who/what/how long/how)','Outputs vs outcomes mapped clearly','Unit cost (cost per beneficiary/unit)','Funding tiers (Bronze/Silver/Gold)','One-page program pack card'],assets:['Funding pack card','Unit cost sheet','Tier menu']},
  {id:4,cat:'Prospecting',title:'Prospecting & Donor Research',level:'Intermediate',duration:'5 min',count:5,desc:'Consistently find and qualify the right donors. Build a prospect list, score for fit, and create warm introduction strategies.',subcaps:['Ideal donor profiles by channel','Prospect list-building process (network + "who funded who" + CSR pages)','Fit scoring (go/no-go)','Warm introduction strategy','Monthly list-building habit'],assets:['Prospect list','Scoring sheet','Outreach list']},
  {id:5,cat:'Pipeline',title:'Relationship Management & Pipeline Discipline',level:'Intermediate',duration:'5 min',count:5,desc:'Manage donor relationships through stages with consistent follow-up. From Lead to Won — a real system for small teams.',subcaps:['Pipeline stages defined (Lead → Outreach → Meeting → Proposal → Decision → Won/Lost)','Simple CRM/Sheet with data hygiene','Next step + date always set','Weekly pipeline review routine','Follow-up cadence templates'],assets:['Donor pipeline sheet','Follow-up templates','Weekly routine']},
  {id:6,cat:'Closing',title:'Asking & Closing',level:'Advanced',duration:'6 min',count:5,desc:'Ask clearly and close commitments respectfully. Prepare for meetings, use clear ask language, and handle objections without awkwardness.',subcaps:['Ask preparation (call plan, amount, objective)','Clear ask language (impact + amount + options)','Objection handling scripts','Closing and confirmation steps','Post-meeting follow-up process'],assets:['Ask scripts','Objection sheet','Follow-up plan']},
  {id:7,cat:'Grants',title:'Proposal & Grant Capability',level:'Advanced',duration:'6 min',count:6,desc:'Create strong proposals and win institutional funding. Covers go/no-go decisions, 2-page and 10-page proposals, budget logic, and compliance.',subcaps:['2-page proposal template competency','Full proposal structure (10 sections)','Budget logic + unit cost','M&E basics (3 indicators + baseline)','Compliance and reporting readiness','Go/No-Go grants decision tool'],assets:['Proposal templates','Go/No-Go matrix','Compliance checklist']},
  {id:8,cat:'Corporate',title:'Corporate Partnerships',level:'Advanced',duration:'5 min',count:5,desc:'Build corporate partnerships with clear value and a renewal cycle. Target the right companies, build a partnership menu, and move from sponsorship to strategy.',subcaps:['Corporate partner targeting map','Partnership menu (benefits + deliverables)','Sponsorship tiers','Corporate pitch and meeting plan','Reporting and renewal cycle'],assets:['Partnership menu','Tiers document','Renewal plan']},
  {id:9,cat:'Digital',title:'Digital Fundraising & Campaign Execution',level:'Intermediate',duration:'5 min',count:5,desc:'Launch a short campaign that converts attention into donations. Build the hook, optimize the donation page, plan 14 days of content, and track results.',subcaps:['Campaign hook + goal + unit cost','Donation page optimization checklist','14-day content plan (pre/launch/close)','WhatsApp donor mobilization scripts','Simple performance tracking'],assets:['Campaign plan','Donation page checklist','14-day content calendar']},
  {id:10,cat:'Retention',title:'Donor Retention & Stewardship',level:'Intermediate',duration:'5 min',count:5,desc:'Retain donors and increase repeat giving with a clear, systematic stewardship plan. 48-hour thank-you, 30/60/90 journey, and renewal scripts.',subcaps:['48-hour thank-you system','30/60/90 donor journey','Impact updates (one-page format)','Monthly giving program basics','Renewal ask timing and scripts'],assets:['Thank-you templates','30/60/90 plan','Impact report template']},
  // Additional lessons from existing 20-category structure
  {id:11,cat:'Strategy',title:'Fundraising Strategy & Annual Plan',level:'Intermediate',duration:'6 min',count:7,desc:'Build a 12-month fundraising plan that fits your NGO\'s size, channels, and team capacity.',subcaps:['Setting realistic goals','Choosing the right funding mix','Quarterly planning calendar','Board communication','Mid-year adjustment process','Annual reporting','Next year planning'],assets:['12-month plan template','Quarterly targets sheet']},
  {id:12,cat:'CRM',title:'CRM & Donor Data',level:'Beginner',duration:'4 min',count:4,desc:'Set up simple systems to track donor conversations without expensive software.',subcaps:['Choosing the right tool (free options)','Data fields that matter','Keeping data clean','Building reporting habits'],assets:['CRM setup guide','Data hygiene checklist']},
  {id:13,cat:'Psychology',title:'Donor Psychology & Giving Motivations',level:'Beginner',duration:'4 min',count:4,desc:'Understand why donors give and how to align your communication with their values and motivations.',subcaps:['Why people give','Emotional vs rational motivations','Donor identity and values','Building trust over time'],assets:['Donor motivation worksheet']},
  {id:14,cat:'Storytelling',title:'Fundraising Storytelling',level:'Intermediate',duration:'5 min',count:5,desc:'Tell stories that inspire action and raise funds — ethically, authentically, and effectively.',subcaps:['Story structure for fundraising','Finding your best stories','Ethical storytelling with beneficiaries','Multi-channel story adaptation','Story bank setup'],assets:['Story bank template','Ethics checklist']},
  {id:15,cat:'Community',title:'Community & Monthly Giving',level:'Intermediate',duration:'4 min',count:5,desc:'Grow a base of recurring committed donors who give monthly with consistency.',subcaps:['Monthly giving program basics','Upgrade ask strategy','Community building online','Donor loyalty programs','Cancellation recovery'],assets:['Monthly giving setup guide','Upgrade scripts']},
  {id:16,cat:'Events',title:'Fundraising Events & Campaigns',level:'Intermediate',duration:'5 min',count:5,desc:'Plan and run fundraising events that raise real money — from small dinners to public campaigns.',subcaps:['Event concept and goal','Sponsorship for events','Registration and promotion','Day-of fundraising tactics','Post-event follow-up'],assets:['Event planning checklist','Post-event report template']},
  {id:17,cat:'HNWI',title:'HNWI & Family Offices',level:'Advanced',duration:'6 min',count:4,desc:'Approach high-net-worth individuals and family offices with the right strategy and materials.',subcaps:['Identifying HNWI prospects','HNWI relationship building','Family office approach','Major gift ask conversation'],assets:['HNWI prospect profile','Major gift ask guide']},
  {id:18,cat:'Crowdfunding',title:'Crowdfunding & Peer-to-Peer',level:'Beginner',duration:'5 min',count:5,desc:'Launch effective crowdfunding and peer-to-peer campaigns that engage your community.',subcaps:['Platform selection','Campaign page optimization','Peer fundraiser recruitment','Momentum tactics','Post-campaign conversion'],assets:['Campaign page checklist','P2P fundraiser guide']},
  {id:19,cat:'Content',title:'Fundraising Communications & Content',level:'Intermediate',duration:'4 min',count:5,desc:'Create content toolkits your team can use across all fundraising channels and audiences.',subcaps:['Content calendar basics','Email fundraising','Social media for fundraising','Impact report writing','Content repurposing'],assets:['Content calendar template','Impact report template']},
  {id:20,cat:'Masterclass',title:'Fundraising Types Masterclass',level:'Advanced',duration:'6 min',count:8,desc:'One lesson per fundraising type — the complete map of channels and how to prioritize them for your NGO.',subcaps:['Individual donors','Institutional grants','Corporate partnerships','Digital and crowdfunding','Events and campaigns','Monthly/recurring giving','Major gifts','Choosing your mix'],assets:['Channel comparison matrix','Priority framework']},
];

const PATHS = [
  {id:1,tag:'30 Days',tagColor:'rgba(30,107,80,.2)',tagText:'#6ee0b0',title:'Fundraising Readiness in 30 Days',desc:'Build the essentials quickly — foundations, messaging, and your first plan.',lessons:12,templates:4},
  {id:2,tag:'Planning',tagColor:'rgba(196,135,42,.2)',tagText:'#e9a43a',title:'Build a 12-Month Fundraising Plan',desc:'Set goals, allocate channels, plan by quarter, and communicate with your board.',lessons:10,templates:3},
  {id:3,tag:'Packaging',tagColor:'rgba(42,107,155,.2)',tagText:'#7cc4f4',title:'Package Programs into Fundable Offers',desc:'Turn activities into clear funding packs with unit costs and outcomes donors love.',lessons:8,templates:2},
  {id:4,tag:'Grants',tagColor:'rgba(192,80,80,.2)',tagText:'#f4a0a0',title:'Win Grants Step by Step',desc:'Choose the right grants, write stronger proposals, stay compliant after the award.',lessons:15,templates:5},
  {id:5,tag:'Pipeline',tagColor:'rgba(30,107,80,.2)',tagText:'#6ee0b0',title:'Build a Donor Pipeline & Close Gifts',desc:'From prospecting to follow-up to asking — a full system for your team.',lessons:14,templates:4},
  {id:6,tag:'Digital',tagColor:'rgba(196,135,42,.2)',tagText:'#e9a43a',title:'Run a 14-Day Digital Campaign',desc:'Plan, produce, and launch a digital fundraising campaign that converts.',lessons:10,templates:3},
  {id:7,tag:'Corporate',tagColor:'rgba(42,107,155,.2)',tagText:'#7cc4f4',title:'Build Corporate Partnerships',desc:'Identify the right companies, make the pitch, and build partnerships that renew.',lessons:9,templates:2},
  {id:8,tag:'Retention',tagColor:'rgba(192,80,80,.2)',tagText:'#f4a0a0',title:'Donor Retention 30/60/90 Plan',desc:'Improve repeat giving through thanks, updates, and transparent impact reporting.',lessons:11,templates:3},
];

/* ─────────────────────────────────────────────────────
   PATH DETAIL DATA  — modules, outcomes, tools per path
───────────────────────────────────────────────────── */
const PATH_DETAILS = {
  1: { // Fundraising Readiness in 30 Days
    accent: '#1e6b50', accentPale: 'var(--emerald-pale)', accentTag: '#6ee0b0',
    tagBg: 'rgba(30,107,80,.18)',
    outcome: 'Complete your Fundraising Readiness Score, write your 90-day plan, and launch your first fundraising conversation — all within 30 days.',
    time: '~4 hours total', level: 'Beginner', cert: true,
    modules: [
      { title: 'Module 1: Know Where You Stand', icon: '', lessonIds: [1,12],
        summary: 'Score yourself across 6 readiness dimensions. Identify your strongest gaps and set your 90-day target.' },
      { title: 'Module 2: Build Your Foundation', icon: '🏗', lessonIds: [2,13],
        summary: 'Write your case for support, define your one-liner, and get your messaging clear before you reach out to anyone.' },
      { title: 'Module 3: Package What You Offer', icon: '📦', lessonIds: [3],
        summary: 'Turn your programs into fundable offers with unit costs and clear outcomes.' },
      { title: 'Module 4: Choose Your Channels', icon: '', lessonIds: [20],
        summary: 'Select your top 2–3 funding channels based on your context, connections, and capacity.' },
      { title: 'Module 5: Write Your 90-Day Plan', icon: '🗺️', lessonIds: [11],
        summary: 'Draft a realistic, week-by-week action plan that your whole team can follow.' },
    ],
    outcomes: [
      'A completed Fundraising Readiness Score with a clear improvement plan',
      'A written one-page Case for Support ready to share with funders',
      'At least 1 program packaged as a fundable offer with a unit cost',
      'A documented 90-day action plan with weekly milestones',
      'Confidence to start your first donor or funder conversation',
    ],
    tools: [
      { name: 'Readiness Checklist', type: 'PDF + Word', icon: '' },
      { name: '90-Day Plan Template', type: 'Word', icon: '🗺️' },
      { name: 'One-Pager Case for Support', type: 'Word + PDF', icon: '' },
      { name: 'Funding Channel Priority Matrix', type: 'Excel', icon: '' },
    ],
    relatedWebinar: 1,
  },
  2: { // Build a 12-Month Fundraising Plan
    accent: '#c4872a', accentPale: 'var(--gold-pale)', accentTag: '#e9a43a',
    tagBg: 'rgba(196,135,42,.18)',
    outcome: 'Produce a board-ready 12-month fundraising plan with revenue targets by channel, a quarterly calendar, and your team\'s roles defined.',
    time: '~3.5 hours total', level: 'Intermediate', cert: true,
    modules: [
      { title: 'Module 1: Set Your Annual Revenue Goal', icon: '', lessonIds: [11],
        summary: 'Break your funding target into channels, quarters, and team responsibilities.' },
      { title: 'Module 2: Choose Your Funding Mix', icon: '', lessonIds: [20],
        summary: 'Balance grants, corporates, individuals, and digital with a mix suited to your NGO\'s strengths.' },
      { title: 'Module 3: Build a Quarterly Calendar', icon: '📅', lessonIds: [16],
        summary: 'Map campaigns, events, proposal deadlines, and stewardship moments across all 12 months.' },
      { title: 'Module 4: Board & Leadership Alignment', icon: '🤝', lessonIds: [13],
        summary: 'Prepare your board communication, get buy-in on targets, and clarify their fundraising role.' },
      { title: 'Module 5: Mid-Year Review & Adjustment', icon: '🔄', lessonIds: [12],
        summary: 'Set up your tracking system and a structured mid-year review process.' },
    ],
    outcomes: [
      'A written 12-month fundraising plan with realistic revenue targets',
      'A quarterly calendar of campaigns, proposals, and donor touchpoints',
      'Clear team roles and board expectations documented',
      'A simple tracking sheet to monitor progress every month',
      'A mid-year review framework to adjust targets and tactics',
    ],
    tools: [
      { name: '12-Month Fundraising Plan Template', type: 'Word + Excel', icon: '📅' },
      { name: 'Quarterly Targets Tracker', type: 'Excel', icon: '' },
      { name: 'Channel Priority Matrix', type: 'Excel', icon: '' },
    ],
    relatedWebinar: 2,
  },
  3: { // Package Programs into Fundable Offers
    accent: '#2a6b9b', accentPale: 'var(--sky-pale)', accentTag: '#7cc4f4',
    tagBg: 'rgba(42,107,155,.18)',
    outcome: 'Transform your top 2 programs into clear, funder-ready packages with outcomes, unit costs, and Bronze/Silver/Gold tiers.',
    time: '~3 hours total', level: 'Intermediate', cert: false,
    modules: [
      { title: 'Module 1: Outputs vs Outcomes', icon: '📈', lessonIds: [3],
        summary: 'Understand the critical difference and rewrite your program in outcome language funders respond to.' },
      { title: 'Module 2: Calculate Your Unit Cost', icon: '🧮', lessonIds: [3],
        summary: 'Compute a credible cost-per-beneficiary that justifies your ask and builds funder confidence.' },
      { title: 'Module 3: Build the Funding Pack Card', icon: '📦', lessonIds: [3,2],
        summary: 'Produce a one-page program card with your promise, proof, tiers, and ask.' },
      { title: 'Module 4: Bronze / Silver / Gold Tiers', icon: '🥇', lessonIds: [8],
        summary: 'Create three funding levels so donors can choose what they can afford.' },
      { title: 'Module 5: Communicating Your Package', icon: '💬', lessonIds: [2,14],
        summary: 'Adapt your funding pack for grants, corporates, and individual donors.' },
    ],
    outcomes: [
      'At least 2 programs packaged with clear outcomes and unit costs',
      'A one-page Funding Pack Card for each program',
      'Bronze/Silver/Gold tiers defined for each package',
      'Versions adapted for grants, corporates, and individuals',
      'Confidence to present your programs to any funder',
    ],
    tools: [
      { name: 'Program Packaging Kit', type: 'Word Template', icon: '📦' },
      { name: 'Unit Cost Calculator', type: 'Excel', icon: '🧮' },
      { name: 'Funding Tier Menu', type: 'Word + PDF', icon: '🥇' },
    ],
    relatedWebinar: 4,
  },
  4: { // Win Grants Step by Step
    accent: '#c05050', accentPale: '#fef2f2', accentTag: '#f4a0a0',
    tagBg: 'rgba(192,80,80,.15)',
    outcome: 'Submit at least 2 well-targeted grant proposals using the right templates, a go/no-go decision framework, and a compliance checklist.',
    time: '~5 hours total', level: 'Advanced', cert: true,
    modules: [
      { title: 'Module 1: Find the Right Grants', icon: '🔍', lessonIds: [4,7],
        summary: 'Use a go/no-go matrix to filter opportunities before you invest time in any application.' },
      { title: 'Module 2: Write a 2-Page Concept Note', icon: '', lessonIds: [7],
        summary: 'Master the short-form proposal: problem, approach, team, budget, and ask in 2 pages.' },
      { title: 'Module 3: Write a Full 10-Page Proposal', icon: '📋', lessonIds: [7],
        summary: 'Build a complete institutional proposal with all 10 sections funders expect.' },
      { title: 'Module 4: Budget Logic & M&E Basics', icon: '', lessonIds: [7,3],
        summary: 'Write a defensible budget and include the minimum M&E framework to satisfy institutional funders.' },
      { title: 'Module 5: Compliance After Winning', icon: '✅', lessonIds: [7,12],
        summary: 'Set up your compliance folder, reporting calendar, and narrative report process from Day 1.' },
    ],
    outcomes: [
      'A go/no-go scoring matrix to pre-screen all grant opportunities',
      'A complete 2-page concept note written and ready to send',
      'A full 10-page proposal draft for your strongest opportunity',
      'A defensible budget with unit costs and overhead explanation',
      'A compliance folder structure and reporting calendar',
    ],
    tools: [
      { name: 'Grant Go/No-Go Matrix', type: 'Excel', icon: '✅' },
      { name: '2-Page Concept Note Template', type: 'Word', icon: '' },
      { name: '10-Page Proposal Template', type: 'Word', icon: '📋' },
      { name: 'Budget Template with Unit Costs', type: 'Excel', icon: '💰' },
      { name: 'Compliance Checklist + Reporting Calendar', type: 'PDF + Excel', icon: '📅' },
    ],
    relatedWebinar: 9,
  },
  5: { // Build a Donor Pipeline & Close Gifts
    accent: '#1e6b50', accentPale: 'var(--emerald-pale)', accentTag: '#6ee0b0',
    tagBg: 'rgba(30,107,80,.18)',
    outcome: 'Build a working donor pipeline, make first contact with at least 5 warm prospects, and close your first gift using a clear ask script.',
    time: '~4.5 hours total', level: 'Intermediate', cert: true,
    modules: [
      { title: 'Module 1: Build Your Prospect List', icon: '🔍', lessonIds: [4],
        summary: 'Research and qualify 20+ prospects using the "who funded who" method and your existing network.' },
      { title: 'Module 2: Set Up Your Pipeline Tracker', icon: '📈', lessonIds: [5,12],
        summary: 'Configure your donor pipeline with the right stages, fields, and a weekly review routine.' },
      { title: 'Module 3: Warm Outreach & First Contact', icon: '📞', lessonIds: [6,13],
        summary: 'Script and send your first outreach messages using warm, relationship-first language.' },
      { title: 'Module 4: The Ask Conversation', icon: '🤝', lessonIds: [6],
        summary: 'Prepare for donor meetings, use clear ask language, and close the gift without awkwardness.' },
      { title: 'Module 5: Objection Handling & Follow-Up', icon: '🔄', lessonIds: [6,5],
        summary: 'Handle the 10 most common objections and build a follow-up cadence that keeps relationships warm.' },
    ],
    outcomes: [
      'A prospect list of 20+ qualified donors/funders',
      'A working donor pipeline with stages and weekly review habit',
      'First outreach messages sent to at least 5 warm prospects',
      'A prepared ask script for your top opportunity',
      'Objection-handling responses for the 10 most common situations',
    ],
    tools: [
      { name: 'Donor Pipeline Tracker', type: 'Google Sheet', icon: '📈' },
      { name: 'Prospect Research Worksheet', type: 'Excel', icon: '🔍' },
      { name: 'Ask Script + Objection Sheet', type: 'Word + PDF', icon: '💬' },
      { name: 'Follow-Up Cadence Templates', type: 'Word', icon: '📩' },
    ],
    relatedWebinar: 6,
  },
  6: { // Run a 14-Day Digital Campaign
    accent: '#c4872a', accentPale: 'var(--gold-pale)', accentTag: '#e9a43a',
    tagBg: 'rgba(196,135,42,.18)',
    outcome: 'Plan and launch a 14-day digital fundraising campaign — with a clear goal, compelling hook, donation page, and day-by-day content plan.',
    time: '~3.5 hours total', level: 'Intermediate', cert: false,
    modules: [
      { title: 'Module 1: Campaign Goal & Hook', icon: '', lessonIds: [9,3],
        summary: 'Define your campaign goal with a unit cost that makes small donations feel powerful.' },
      { title: 'Module 2: Donation Page Optimization', icon: '💳', lessonIds: [9,18],
        summary: 'Build a donation page that converts with a strong story, photos, and a clear ask.' },
      { title: 'Module 3: 14-Day Content Calendar', icon: '📅', lessonIds: [9,19],
        summary: 'Plan your pre-launch, launch, and closing content across all channels.' },
      { title: 'Module 4: WhatsApp & Community Mobilization', icon: '📱', lessonIds: [9,15],
        summary: 'Use WhatsApp and close networks to seed your campaign with early donations and shares.' },
      { title: 'Module 5: Track, Optimize & Convert', icon: '', lessonIds: [9,12],
        summary: 'Monitor your campaign daily, adjust messaging mid-run, and convert one-time donors to monthly.' },
    ],
    outcomes: [
      'A campaign brief with goal, unit cost, and hook statement',
      'An optimized donation page ready to receive gifts',
      'A 14-day content calendar across all your channels',
      'WhatsApp mobilization scripts ready to send to supporters',
      'A simple dashboard to track performance during the campaign',
    ],
    tools: [
      { name: 'Digital Campaign Kit (14-Day Calendar)', type: 'Excel + Word', icon: '📅' },
      { name: 'Donation Page Checklist', type: 'PDF', icon: '💳' },
      { name: 'WhatsApp Scripts', type: 'Word', icon: '📱' },
      { name: 'Campaign Tracker Dashboard', type: 'Excel', icon: '' },
    ],
    relatedWebinar: 11,
  },
  7: { // Build Corporate Partnerships
    accent: '#2a6b9b', accentPale: 'var(--sky-pale)', accentTag: '#7cc4f4',
    tagBg: 'rgba(42,107,155,.18)',
    outcome: 'Identify your top 5 corporate prospects, build a partnership menu, and pitch at least one company with a tailored proposal.',
    time: '~4 hours total', level: 'Advanced', cert: false,
    modules: [
      { title: 'Module 1: Map Corporate Prospects', icon: '🗺️', lessonIds: [4,8],
        summary: 'Build a prospect list using CSR reports, sector alignment, and your network connections.' },
      { title: 'Module 2: Build a Partnership Menu', icon: '🍽', lessonIds: [8],
        summary: 'Create a tiered menu of partnership options — from event sponsorship to strategic co-branding.' },
      { title: 'Module 3: The Corporate Pitch', icon: '💼', lessonIds: [8,6],
        summary: 'Prepare a 5-minute pitch deck and a one-page partnership overview for each prospect.' },
      { title: 'Module 4: The Partnership Agreement', icon: '🤝', lessonIds: [8],
        summary: 'Structure clear deliverables, timelines, and reporting to make renewal easy.' },
      { title: 'Module 5: Renewal & Upsell', icon: '🔄', lessonIds: [8,10],
        summary: 'Build a renewal cycle with mid-year reviews, impact updates, and an upsell conversation.' },
    ],
    outcomes: [
      'A corporate prospect list of at least 10 companies with CSR alignment',
      'A tiered partnership menu with clear benefits and deliverables',
      'A corporate pitch deck of 5–8 slides',
      'A partnership agreement template with KPIs and deliverables',
      'A renewal process with impact reporting and an upsell ask',
    ],
    tools: [
      { name: 'Corporate Partnership Menu Template', type: 'PowerPoint + PDF', icon: '🍽' },
      { name: 'Corporate Prospect Research Worksheet', type: 'Excel', icon: '🔍' },
      { name: 'Partnership Agreement Template', type: 'Word', icon: '🤝' },
      { name: 'Pitch Deck Template (5 slides)', type: 'PowerPoint', icon: '💼' },
    ],
    relatedWebinar: 10,
  },
  8: { // Donor Retention 30/60/90 Plan
    accent: '#c05050', accentPale: '#fef2f2', accentTag: '#f4a0a0',
    tagBg: 'rgba(192,80,80,.15)',
    outcome: 'Set up a complete donor retention system — 48-hour thank-you, 30/60/90 journey, monthly giving program, and annual renewal ask.',
    time: '~3.5 hours total', level: 'Intermediate', cert: true,
    modules: [
      { title: 'Module 1: The 48-Hour Thank-You System', icon: '💌', lessonIds: [10],
        summary: 'Set up an immediate, warm, and personal thank-you process for every gift — big or small.' },
      { title: 'Module 2: The 30/60/90 Donor Journey', icon: '🗓', lessonIds: [10,5],
        summary: 'Plan your touchpoints at 30, 60, and 90 days post-gift to keep donors warm and engaged.' },
      { title: 'Module 3: Impact Updates That Inspire', icon: '', lessonIds: [10,14,19],
        summary: 'Write a one-page impact update using real numbers and a human story.' },
      { title: 'Module 4: Build a Monthly Giving Programme', icon: '🔁', lessonIds: [15,10],
        summary: 'Convert one-time donors to monthly supporters with a clear upgrade ask and program identity.' },
      { title: 'Module 5: The Annual Renewal Ask', icon: '🔄', lessonIds: [10,6],
        summary: 'Time and script your annual renewal ask to maximize repeat giving and upgrade rates.' },
    ],
    outcomes: [
      'A 48-hour thank-you process template and workflow',
      'A 30/60/90 donor journey plan with touchpoint scripts',
      'A one-page impact update ready to send to existing donors',
      'A monthly giving programme with an upgrade ask script',
      'An annual renewal ask script and timing plan',
    ],
    tools: [
      { name: 'Donor Retention 30/60/90 Kit', type: 'Word + PDF', icon: '🗓' },
      { name: '48-Hour Thank-You Templates', type: 'Word', icon: '💌' },
      { name: 'Impact Report Template (1-page)', type: 'Word + PDF', icon: '' },
      { name: 'Monthly Giving Setup Guide', type: 'PDF', icon: '🔁' },
    ],
    relatedWebinar: 12,
  },
};


const WEBINARS = [
  {id:1,num:'01',status:'on-demand',title:'How to Build Fundraising Readiness for Your NGO in 90 Days',desc:'The foundational session. Understand your readiness level and leave with a concrete starting plan.',includes:['Recording','Slides','Template Pack','Checklist']},
  {id:2,num:'02',status:'on-demand',title:'How to Build a 12-Month Fundraising Strategy',desc:'Create a strategy that fits your NGO\'s size, channels, and team capacity.',includes:['Recording','Slides','Strategy Template','Checklist']},
  {id:3,num:'03',status:'on-demand',title:'How to Write a One-Page Case for Support',desc:'Draft a compelling one-pager that convinces funders in 60 seconds.',includes:['Recording','Slides','One-Pager Template','Checklist']},
  {id:4,num:'04',status:'on-demand',title:'How to Package Programs into Fundable Offers',desc:'Turn your activities into clear funding packages with unit costs and outcomes.',includes:['Recording','Slides','Funding Pack Template','Checklist']},
  {id:5,num:'05',status:'on-demand',title:'How to Build a Prospect List in 2 Weeks',desc:'Research and qualify 20+ prospects without getting overwhelmed.',includes:['Recording','Slides','Prospect Matrix','Checklist']},
  {id:6,num:'06',status:'on-demand',title:'How to Manage Donor Relationships with a Simple Pipeline',desc:'Set up and use a donor pipeline that improves follow-up and closes rates.',includes:['Recording','Slides','Pipeline Template','Checklist']},
  {id:7,num:'07',status:'on-demand',title:'How to Ask for Donations & Close Without Awkwardness',desc:'Ask scripts, objection handling, and how to make asking feel natural.',includes:['Recording','Slides','Ask Scripts','Objection Sheet']},
  {id:8,num:'08',status:'on-demand',title:'How to Write a Proposal: 2-Page & 10-Page Formats',desc:'The exact structure, language, and flow that institutional funders want to see.',includes:['Recording','Slides','2-Page Template','10-Page Template']},
  {id:9,num:'09',status:'on-demand',title:'How to Win Grants: From Selection to Compliance',desc:'Choose the right opportunities, write stronger proposals, and manage compliance.',includes:['Recording','Slides','Go/No-Go Matrix','Compliance Checklist']},
  {id:10,num:'10',status:'on-demand',title:'How to Build Corporate Partnerships That Renew',desc:'From sponsorship to strategic partnership — how to build long-term corporate relationships.',includes:['Recording','Slides','Partnership Menu','Checklist']},
  {id:11,num:'11',status:'upcoming',title:'How to Succeed at Digital Fundraising in 14 Days',desc:'Plan, create, and run a digital fundraising campaign from start to finish.',includes:['Recording (post-event)','Slides','14-Day Calendar','WhatsApp Scripts']},
  {id:12,num:'12',status:'upcoming',title:'How to Retain Donors Through Thanks & Transparency',desc:'The 48-hour thank-you system and 30/60/90 donor journey that increases retention.',includes:['Recording (post-event)','Slides','Thank-You Templates','Retention Kit']},
];


/* ─── Per-webinar detail data ─────────────────────────── */
const WEBINAR_DETAILS = {
  1: {
    speaker: 'Farouk Al-Rashid', speakerRole: 'Founder, FundReady Academy',
    keyTopic: 'Build your 90-day readiness plan from scratch',
    agenda: [
      'Why most NGOs fundraise reactively — and how to stop',
      'The 6 fundraising readiness dimensions explained',
      'Taking the Readiness Assessment live',
      'Building your personalised 90-day plan',
      'Q&A: Your biggest obstacles, answered'
    ],
    takeaways: ['Completed Readiness Score','90-Day Action Plan Template','Fundraising Channel Priority Matrix'],
    relatedPath: 1,
  },
  2: {
    speaker: 'Farouk Al-Rashid', speakerRole: 'Founder, FundReady Academy',
    keyTopic: 'From scattered effort to a disciplined annual strategy',
    agenda: [
      'The anatomy of a 12-month fundraising plan',
      'Setting realistic revenue targets by channel',
      'Quarterly planning: campaigns, deadlines, and reviews',
      'How to get your board aligned on targets',
      'Q&A + live plan-building exercise'
    ],
    takeaways: ['12-Month Plan Template','Quarterly Targets Sheet','Board Communication Guide'],
    relatedPath: 2,
  },
  3: {
    speaker: 'Lina Khoury', speakerRole: 'Lead Trainer, FundReady Academy',
    keyTopic: 'Write a one-pager that convinces funders in 60 seconds',
    agenda: [
      'What funders read first — and what they skip',
      'The 5-part case for support structure',
      'Writing in donor language, not organizational language',
      'Live workshop: rewriting a weak NGO one-pager',
      'Q&A + feedback on participant drafts'
    ],
    takeaways: ['One-Pager Template (3 versions)','Key Messages Worksheet','Pitch Script (30-sec & 60-sec)'],
    relatedPath: 1,
  },
  4: {
    speaker: 'Lina Khoury', speakerRole: 'Lead Trainer, FundReady Academy',
    keyTopic: 'Turn activities into offers that funders can actually fund',
    agenda: [
      'The difference between activities, outputs, and outcomes',
      'How to calculate a credible unit cost',
      'Building Bronze/Silver/Gold funding tiers',
      'Live example: packaging a health education program',
      'Q&A + template walkthrough'
    ],
    takeaways: ['Funding Pack Card Template','Unit Cost Calculator','Tier Menu Template'],
    relatedPath: 3,
  },
  5: {
    speaker: 'Mahmoud Saleh', speakerRole: 'Senior Fundraising Advisor',
    keyTopic: 'Go from zero to 20+ qualified prospects in 2 weeks',
    agenda: [
      'The "who funded who" research method explained',
      'Building your ideal donor profile by channel',
      'Fit scoring: the go/no-go framework',
      'Warm introduction strategies that work',
      'Q&A: your hardest prospecting challenges'
    ],
    takeaways: ['Prospect Research Worksheet','Fit Scoring Matrix','Outreach Message Templates'],
    relatedPath: 5,
  },
  6: {
    speaker: 'Mahmoud Saleh', speakerRole: 'Senior Fundraising Advisor',
    keyTopic: 'Set up a pipeline your whole team will actually use',
    agenda: [
      'Pipeline stages: Lead → Won — what each means',
      'Setting up your sheet/CRM the right way',
      'The weekly pipeline review ritual (30 minutes)',
      'Follow-up cadences that feel human, not pushy',
      'Live demo: setting up a donor pipeline from scratch'
    ],
    takeaways: ['Donor Pipeline Tracker (Google Sheet)','Weekly Review Agenda','Follow-Up Templates'],
    relatedPath: 5,
  },
  7: {
    speaker: 'Farouk Al-Rashid', speakerRole: 'Founder, FundReady Academy',
    keyTopic: 'Make asking feel natural and close without pressure',
    agenda: [
      'Why most fundraisers avoid asking — and how to fix it',
      'The anatomy of a clear, confident ask',
      'Handling the 10 most common objections',
      'Role-play: live ask conversations with feedback',
      'Q&A + ask script templates shared live'
    ],
    takeaways: ['Ask Script Templates','Objection Handling Sheet','Call Preparation Checklist'],
    relatedPath: 5,
  },
  8: {
    speaker: 'Lina Khoury', speakerRole: 'Lead Trainer, FundReady Academy',
    keyTopic: 'Write proposals that institutional funders actually want to read',
    agenda: [
      'What the 2-page concept note must contain',
      'The 10-section full proposal: section-by-section walkthrough',
      'Budget logic: justifying every line item',
      'Common proposal mistakes that kill applications',
      'Q&A: live review of participant proposal sections'
    ],
    takeaways: ['2-Page Concept Note Template','10-Page Proposal Template','Budget Template with Instructions'],
    relatedPath: 4,
  },
  9: {
    speaker: 'Mahmoud Saleh', speakerRole: 'Senior Fundraising Advisor',
    keyTopic: 'Win the right grants and stay compliant after winning',
    agenda: [
      'Using the go/no-go matrix before applying',
      'What strong grant proposals have in common',
      'M&E basics: the minimum framework funders want',
      'Building your compliance folder from Day 1',
      'Q&A: your grant challenges, answered live'
    ],
    takeaways: ['Grant Go/No-Go Matrix','Compliance Checklist','Reporting Calendar Template'],
    relatedPath: 4,
  },
  10: {
    speaker: 'Farouk Al-Rashid', speakerRole: 'Founder, FundReady Academy',
    keyTopic: 'Build corporate partnerships that renew year after year',
    agenda: [
      'Mapping corporate prospects using CSR alignment',
      'Building a tiered partnership menu',
      'The corporate pitch: structure and delivery',
      'Reporting and renewal: keeping the relationship alive',
      'Q&A: your corporate fundraising questions answered'
    ],
    takeaways: ['Corporate Partnership Menu','Pitch Deck Template (5 slides)','Renewal Conversation Guide'],
    relatedPath: 7,
  },
  11: {
    speaker: 'Lina Khoury', speakerRole: 'Lead Trainer, FundReady Academy',
    keyTopic: 'Plan and launch a digital campaign in 14 days',
    agenda: [
      'Campaign goal-setting with a compelling unit cost',
      'Donation page optimization: what converts and what kills conversions',
      'Building your 14-day content calendar',
      'WhatsApp mobilization: scripts and tactics',
      'Live Q&A + campaign plan review'
    ],
    takeaways: ['14-Day Campaign Calendar','Donation Page Checklist','WhatsApp Script Templates'],
    relatedPath: 6,
  },
  12: {
    speaker: 'Mahmoud Saleh', speakerRole: 'Senior Fundraising Advisor',
    keyTopic: 'Turn first-time donors into loyal repeat supporters',
    agenda: [
      'Why most NGOs lose 80% of donors after the first gift',
      'The 48-hour thank-you system: setup and scripts',
      'Your 30/60/90 donor journey: touchpoints and messages',
      'Building a monthly giving programme from scratch',
      'Q&A: your retention questions answered'
    ],
    takeaways: ['48-Hour Thank-You Templates','30/60/90 Journey Plan','Monthly Giving Setup Guide'],
    relatedPath: 8,
  },
};

const WEBINAR_COLORS = [
  '#1e6b50','#c4872a','#2a6b9b','#c05050',
  '#1e6b50','#c4872a','#2a6b9b','#c05050',
  '#1e6b50','#c4872a','#2a6b9b','#c05050',
];

const TOOLS = [
  {id:1,icon:'',category:'planning',title:'Readiness Checklist + 90-Day Plan',desc:'Assess your current state across 6 fundraising dimensions and map the first 90 days with this planning kit.',type:'PDF + Word',
   preview:{tagline:'Know where you stand. Plan your next 90 days.',sections:[
     {label:'SECTION 1 — Readiness Assessment',fields:['Messaging & Case for Support (Score 1–4)','Donor Pipeline & Prospecting (Score 1–4)','Ask & Relationship Skills (Score 1–4)','Grants & Proposals (Score 1–4)','Digital Fundraising (Score 1–4)','Team & Systems Readiness (Score 1–4)']},
     {label:'SECTION 2 — 90-Day Priority Focus',fields:['Top 3 gaps to close this quarter:','Quick wins (achievable in 2 weeks):','Key milestones: Month 1 / Month 2 / Month 3']},
     {label:'SECTION 3 — Weekly Review Habit',fields:['Weekly review day & time:','One metric to track weekly:','Accountability partner:']}
   ]}},
  {id:2,icon:'',category:'messaging',title:'One-Pager & Case for Support Kit',desc:'Templates to write a compelling one-page summary your funders will actually read — with 3 audience versions.',type:'Word + PDF',
   preview:{tagline:'One page. One clear ask. Three funder audiences.',sections:[
     {label:'HEADER BLOCK',fields:['NGO Name + Logo','One-line program promise: "[Who] will [outcome] in [timeframe] through [approach]"','Contact name | Email | Phone | Website']},
     {label:'BODY — 4 COLUMNS',fields:['THE PROBLEM: 2 sentences. Use 1 statistic.','WHAT WE DO: 1 sentence per activity. No jargon.','WHAT CHANGES: List 2–3 measurable outcomes.','YOUR IMPACT: Funding tiers with exact amounts']},
     {label:'PROOF STRIP (bottom band)',fields:['Key number 1 (e.g. "1,200 beneficiaries served")','Key number 2 (e.g. "4 years operating")','1 testimonial quote (max 20 words)']}
   ]}},
  {id:3,icon:'📦',category:'messaging',title:'Program Packaging "Funding Pack" Kit',desc:'Turn your programs into clear, funder-ready packages with unit costs, outcomes, and Bronze/Silver/Gold tiers.',type:'Word Template',
   preview:{tagline:'Turn your program into a clear funder offer.',sections:[
     {label:'PROGRAM IDENTITY',fields:['Program name:','One-line promise (who / what / how long / how):','Target beneficiaries (count + description):','Geographic reach:']},
     {label:'OUTCOMES & UNIT COST',fields:['Primary output (what you deliver):','Primary outcome (what changes):','Unit cost: $ _____ per _____','How calculated (show your working):']},
     {label:'FUNDING TIERS',fields:['🥉 Bronze — $_____ : supports _____ beneficiaries','🥈 Silver — $_____ : supports _____ beneficiaries','🥇 Gold  — $_____ : supports _____ beneficiaries','Naming rights / recognition included:']}
   ]}},
  {id:4,icon:'📈',category:'pipeline',title:'Donor Pipeline Tracker (Google Sheet)',desc:'Track prospects, conversations, asks, and follow-up dates with built-in stage indicators and weekly review view.',type:'Google Sheet',
   preview:{tagline:'Every donor. Every conversation. One sheet.',sections:[
     {label:'COLUMNS (one row per prospect)',fields:['Donor Name | Organization | Type (Individual/Corp/Foundation)','Stage: Research → Qualify → Cultivate → Ask → Steward','Last Contact Date | Next Action | Owner','Potential Ask Amount | Notes']},
     {label:'WEEKLY REVIEW VIEW',fields:['Overdue follow-ups (highlighted red)','This week\'s asks scheduled','Pipeline total by stage']},
     {label:'MONTHLY METRICS TAB',fields:['New prospects added','Conversations held','Asks made | Asks won | Conversion rate']}
   ]}},
  {id:5,icon:'💬',category:'pipeline',title:'Ask Script + Objection Handling Sheet',desc:'Proven scripts for donor meetings — what to say, how to make the ask, and how to handle 10 common objections.',type:'Word + PDF',
   preview:{tagline:'Never be lost for words in a donor meeting.',sections:[
     {label:'THE 5-PART ASK SCRIPT',fields:['1. RECONNECT (2 min): "When we last spoke, you mentioned…"','2. IMPACT UPDATE (3 min): Share one story + one number','3. THE ASK (1 min): "Would you consider a gift of $_____ to support _____?"','4. SILENCE: Wait. Do not fill the silence.','5. CLOSE: Confirm next step regardless of answer']},
     {label:'10 COMMON OBJECTIONS',fields:['"I need to think about it" → Response script','\"My budget is tight right now\" → Response script','\"I need to see more impact data\" → Response script','\"I\'m already giving to another org\" → Response script','6 more objection scripts included…']},
     {label:'POST-MEETING FOLLOW-UP',fields:['24-hour email template','Key talking points to reiterate']}
   ]}},
  {id:6,icon:'📋',category:'grants',title:'Proposal Templates + Budget (2-page & 10-page)',desc:'The exact formats institutional funders expect — with section-by-section instructions and sample language.',type:'Word Templates',
   preview:{tagline:'Two formats. Every section. Sample language included.',sections:[
     {label:'2-PAGE PROPOSAL (for initial expression of interest)',fields:['1. Executive Summary (150 words)','2. Problem Statement + Evidence (200 words)','3. Our Approach + Theory of Change (200 words)','4. Expected Outcomes + Indicators (150 words)','5. Budget Summary + Team Credibility (100 words)']},
     {label:'10-PAGE FULL PROPOSAL (for invited applications)',fields:['Sections 1–10 with word counts and instructions','Budget template: staff / activities / overheads / M&E','M&E framework: 3 indicators per level (output/outcome/impact)','Compliance checklist: 12 items to verify before submission']},
     {label:'BUDGET LOGIC SHEET',fields:['Unit cost per activity','Staff time allocation (% FTE)','Indirect cost justification note']}
   ]}},
  {id:7,icon:'✅',category:'grants',title:'Grants Go/No-Go Matrix + Compliance Checklist',desc:'Decide which grants to pursue based on fit, effort, and odds — and stay compliant after winning.',type:'Excel + PDF',
   preview:{tagline:'Stop chasing the wrong grants. Win the right ones.',sections:[
     {label:'GO/NO-GO SCORING MATRIX',fields:['Strategic Fit (1–5): Does this match our mission?','Eligibility (1–5): Do we meet all criteria?','Competitiveness (1–5): What are our real odds?','Effort Required (1–5, inverted): How much time?','Relationship Advantage (1–5): Do we know the funder?','TOTAL SCORE → Go if ≥ 18, No-Go if < 12']},
     {label:'COMPLIANCE CHECKLIST (post-award)',fields:['Financial reporting schedule confirmed','M&E data collection system set up','Signed grant agreement stored securely','Quarterly narrative report dates in calendar','Audit requirements reviewed']}
   ]}},
  {id:8,icon:'🤝',category:'pipeline',title:'Corporate Partnership Menu Template',desc:'A tiered menu to present clear partnership options with deliverables, benefits, and pricing to corporate prospects.',type:'PowerPoint + PDF',
   preview:{tagline:'A menu your corporate partner can say yes to.',sections:[
     {label:'MENU HEADER',fields:['NGO name + tagline','"Partnership Opportunities with [NGO Name] — [Year]"','Your impact numbers in 3 bold stats']},
     {label:'THREE TIERS',fields:['COMMUNITY PARTNER — $_____ : logo on materials, 1 site visit, impact report','PROGRAMME PARTNER — $_____ : named programme, staff volunteering day, quarterly update','STRATEGIC PARTNER — $_____ : co-branding, board seat option, annual impact event']},
     {label:'BACK PAGE — WHY PARTNER WITH US',fields:['CSR alignment statement','Employee engagement opportunity','Reporting: what you\'ll receive and when','Contact & next step']}
   ]}},
  {id:9,icon:'📱',category:'digital',title:'Digital Campaign Kit (14-Day Calendar)',desc:'Full content calendar, WhatsApp scripts, posting templates, and donation page checklist for a 14-day campaign.',type:'Excel + Word',
   preview:{tagline:'14 days. Every post planned. Every message ready.',sections:[
     {label:'14-DAY CONTENT CALENDAR',fields:['Days 1–3: Awareness posts (problem + your work)','Days 4–7: Social proof posts (stories + numbers)','Days 8–10: Campaign launch (ask + urgency)','Days 11–13: Follow-up + momentum posts','Day 14: Final push + thank-you announcement']},
     {label:'WHATSAPP DONOR SCRIPTS',fields:['Opening message (awareness, no ask)','Day 8 ask message (with donation link)','Thank-you message (within 2 hrs of gift)','Day 14 final reminder','Donor group broadcast template']},
     {label:'DONATION PAGE CHECKLIST',fields:['Headline matches campaign hook','Unit cost visible (e.g. "$30 feeds one family")','Mobile-optimised (test on phone)','Thank-you page active and warm']}
   ]}},
  {id:10,icon:'💌',category:'planning',title:'Donor Retention 30/60/90 Kit',desc:'48-hour thank-you templates, a 90-day donor journey plan, and a 1-page impact report template.',type:'Word + PDF',
   preview:{tagline:'Keep every donor. Grow every relationship.',sections:[
     {label:'48-HOUR THANK-YOU SYSTEM',fields:['Email template: personalised, no ask, specific impact mention','WhatsApp follow-up (for donors who gave via mobile)','Board/ED signature process for gifts over $500']},
     {label:'30/60/90-DAY JOURNEY',fields:['Day 1–2: Thank you (personal, specific)','Day 30: Impact update — "Here\'s what your gift is doing"','Day 60: Story email — one beneficiary story with photo','Day 90: Engagement invite (event, site visit, or survey)']},
     {label:'IMPACT REPORT TEMPLATE (1-page)',fields:['3 headline numbers (beneficiaries / outcomes / efficiency)','1 beneficiary story with photo placeholder','1 quote from community member','Soft renewal ask in closing line']}
   ]}},
  {id:11,icon:'🔍',category:'pipeline',title:'Prospect Research Worksheet',desc:'A structured template to research and score each potential donor — individual, corporate, and foundation.',type:'Excel Template',
   preview:{tagline:'Research every prospect. Prioritise the right ones.',sections:[
     {label:'DONOR PROFILE (one tab per prospect)',fields:['Name | Organisation | Role | LinkedIn','Estimated giving capacity (Low/Med/High)','Known interests & values','Connection to your cause or network','Warm introduction possible? (Yes/No/Who)']},
     {label:'SCORING RUBRIC',fields:['Capacity (1–5)','Alignment (1–5)','Access / Warm intro (1–5)','Priority tier: A (15) / B (10–14) / C (<10)']},
     {label:'RESEARCH SOURCES TO CHECK',fields:['LinkedIn profile','Organisation website / CSR page','"Who funded who" — check similar NGOs\' annual reports','Google News search: "[name] + donation / philanthropy"']}
   ]}},
  {id:12,icon:'📅',category:'planning',title:'Annual Fundraising Calendar (12-Month)',desc:'Plan your full fundraising year by quarter with channel targets, campaign windows, and review milestones.',type:'Excel + PDF',
   preview:{tagline:'One view. Your whole fundraising year.',sections:[
     {label:'QUARTERLY VIEW (4 tabs)',fields:['Q1: Relationship-building & grant applications','Q2: Individual giving campaigns + corporate outreach','Q3: Mid-year review + pipeline refresh','Q4: Year-end campaign + donor stewardship']},
     {label:'MONTHLY ROW ITEMS',fields:['Fundraising channel focus','Key activities & deadlines','Revenue target for the month','Review checkpoint (yes/no)']},
     {label:'ANNUAL TARGETS DASHBOARD',fields:['Total revenue goal by channel','Monthly pacing tracker','Year-to-date vs target']}
   ]}},
  {id:13,icon:'',category:'grants',title:'Grant Opportunity Tracker',desc:'Track grant opportunities, deadlines, requirements, and application status in one clean spreadsheet.',type:'Google Sheet',
   preview:{tagline:'Never miss a deadline. Track every opportunity.',sections:[
     {label:'COLUMNS PER GRANT ROW',fields:['Funder Name | Programme Name | Deadline','Amount (min–max) | Currency','Eligibility requirements (3-line summary)','Go/No-Go score | Decision (Apply/Skip/Monitor)','Status: Research → Writing → Submitted → Won/Lost']},
     {label:'DEADLINE TRACKER VIEW',fields:['Applications due this month (sorted)','Applications due next month','Decisions expected (follow-up dates)']},
     {label:'PIPELINE SUMMARY',fields:['Total opportunities in pipeline','Total potential value if won','Applications submitted YTD | Win rate']}
   ]}},
  {id:14,icon:'🧾',category:'messaging',title:'Pitch Script Templates (30 / 60 second)',desc:'Two proven elevator pitch formats for different audiences — individual donors, corporates, and foundations.',type:'PDF + Word',
   preview:{tagline:'30 seconds or 60 — always leave an impression.',sections:[
     {label:'30-SECOND PITCH STRUCTURE',fields:['Line 1: "We work with [who] who face [problem]."','Line 2: "We [what you do] so that [outcome]."','Line 3: "So far we\'ve [key proof point]."','Line 4: "Right now we\'re looking for [specific ask]."']},
     {label:'60-SECOND PITCH (adds story layer)',fields:['Lines 1–4 (same as 30-sec)','Line 5: "For example, [name] — [1-sentence story]."','Line 6: "With your support, we could [specific next impact]."','Line 7: "Could we find 15 minutes to explore this?"']},
     {label:'3 VERSIONS FOR DIFFERENT AUDIENCES',fields:['Version A: Individual / major donors','Version B: Corporate / CSR audience','Version C: Foundations / institutional funders']}
   ]}},
  {id:15,icon:'📰',category:'planning',title:'Impact Report Template (1-page)',desc:'A clean, visual one-page impact report your team can produce monthly with minimal design skills.',type:'Word + PDF',
   preview:{tagline:'One page. Real numbers. Donors who give again.',sections:[
     {label:'TOP BAND — 3 HEADLINE STATS',fields:['Stat 1: Beneficiaries reached (this period)','Stat 2: Primary outcome achieved (e.g. "87% completed training")','Stat 3: Efficiency metric (e.g. "Cost per beneficiary: $42")']},
     {label:'MIDDLE SECTION',fields:['STORY BLOCK: Name + photo placeholder + 2-sentence story','QUOTE BOX: Direct quote from beneficiary or partner','MAP/VISUAL: Where we worked (optional)']},
     {label:'FOOTER',fields:['"Your support made this possible" acknowledgement line','Soft next ask: "Help us reach 500 more families →"','Logo | Contact | Donation link | Social handles']}
   ]}},
  {id:16,icon:'🏢',category:'pipeline',title:'Corporate Partner Targeting Map',desc:'A research template to identify and score the 10 best corporate partner prospects for your NGO.',type:'Excel + PDF',
   preview:{tagline:'Find the right 10 companies. Stop guessing.',sections:[
     {label:'RESEARCH COLUMNS',fields:['Company Name | Industry | Annual Revenue (est.)','CSR Focus Areas (from their website)','Current NGO partners (from their CSR report)','Decision-maker name + LinkedIn + email']},
     {label:'FIT SCORING',fields:['Mission alignment (1–5)','Geographic match (1–5)','Employee volunteering opportunity (1–5)','Warm introduction possible (1–5)','Priority: A (16–20) / B (10–15) / C (<10)']},
     {label:'OUTREACH PLAN',fields:['Approach: cold / warm intro / event','First outreach date','Follow-up 1 date | Follow-up 2 date','Status: Contacted / Meeting / Proposal / Won']}
   ]}},
  {id:17,icon:'',category:'digital',title:'Crowdfunding Campaign Planner',desc:'Everything you need to plan a successful crowdfunding or peer-to-peer campaign from goal to close.',type:'Word + Excel',
   preview:{tagline:'Every campaign decision made before you launch.',sections:[
     {label:'CAMPAIGN BRIEF',fields:['Campaign name & hook (one punchy sentence)','Goal amount + unit cost (e.g. "$50 = one month of school")','Campaign dates: Open ___ / Close ___','Platform choice + setup checklist']},
     {label:'PEER-TO-PEER STRATEGY',fields:['Target: _____ peer fundraisers recruited','Peer fundraiser briefing template (email + WhatsApp)','Personal fundraising page tips (5 bullet points)','Mid-campaign nudge message to peer fundraisers']},
     {label:'CAMPAIGN METRICS TRACKER',fields:['Daily donations + cumulative total','New donors vs returning donors','Traffic source breakdown','Peer fundraiser leaderboard (optional)']}
   ]}},
  {id:18,icon:'📤',category:'messaging',title:'Funder Communication Templates Bundle',desc:'15 email templates: cold outreach, meeting requests, follow-ups, thank-yous, and renewal asks.',type:'Word Template Bundle',
   preview:{tagline:'15 templates. Every stage of funder communication.',sections:[
     {label:'OUTREACH TEMPLATES (1–5)',fields:['1. Cold outreach — foundation or corporate','2. Warm intro follow-up (after a referral)','3. Meeting request email','4. Post-meeting thank-you + summary','5. Proposal submission cover email']},
     {label:'STEWARDSHIP TEMPLATES (6–11)',fields:['6. First-time donor thank-you (within 48 hrs)','7. Quarterly impact update to donors','8. Year-end gratitude email','9. Lapsed donor re-engagement','10. Event invitation (site visit / webinar)','11. Survey / feedback request']},
     {label:'ASK TEMPLATES (12–15)',fields:['12. Renewal ask — individual donor','13. Upgrade ask — loyal donor','14. Grant renewal email to foundation','15. Corporate partnership renewal / upgrade']}
   ]}},
];

const STORIES = [
  {id:1,channel:'grants',tag:'Planning',tagBg:'rgba(30,107,80,.1)',tagColor:'#1e6b50',title:'From Reactive Fundraising to a 90-Day Plan',desc:'A 5-person NGO in Lebanon went from chasing grants last-minute to running a structured quarterly plan with a real donor pipeline.',stat:'3×',statLabel:'more proposals submitted',before:'Random grant chasing, no strategy',after:'Structured 90-day plan, consistent pipeline',videoId:'UHzDWyV8g4s',org:'Al-Amal Foundation, Beirut',toolId:1},
  {id:2,channel:'grants',tag:'Grants',tagBg:'rgba(42,107,155,.1)',tagColor:'#2a6b9b',title:'How One NGO Won 2 Institutional Grants in 90 Days',desc:'An education NGO transformed vague program descriptions into three clear funding tiers with specific outcomes and unit costs.',stat:'2',statLabel:'grants won in first attempt',before:'Generic program descriptions',after:'Clear funding packs with unit costs',videoId:'UpDAtj8f8Bo',org:'Nour Education Trust, Jordan',toolId:6},
  {id:3,channel:'retention',tag:'Retention',tagBg:'rgba(196,135,42,.1)',tagColor:'#c4872a',title:'How Donor Follow-Up Increased Repeat Giving',desc:'A health NGO implemented the 48-hour thank-you system and 90-day donor journey, dramatically improving loyalty.',stat:'68%',statLabel:'donor retention rate',before:'12% retention, no follow-up system',after:'68% retention with structured journey',videoId:'W_G9JlkLjJM',org:'Shifaa Health NGO, Cairo',toolId:10},
  {id:4,channel:'digital',tag:'Digital',tagBg:'rgba(30,107,80,.1)',tagColor:'#1e6b50',title:'$18K Raised in a 14-Day Digital Campaign',desc:'A community development NGO used the digital campaign kit to plan and execute their first crowdfunding campaign.',stat:'$18K',statLabel:'raised in 14 days',before:'No digital fundraising experience',after:'$18K from 340 donors online',videoId:'w2V0qHJTFtA',org:'Bayan Community Trust, Amman',toolId:9},
  {id:5,channel:'corporate',tag:'Corporate',tagBg:'rgba(192,80,80,.1)',tagColor:'#c05050',title:'From Sponsorship to Strategic Partnership',desc:'An arts NGO converted a one-off event sponsor into a 3-year renewable strategic partner using the partnership menu framework.',stat:'3yr',statLabel:'renewable partnership signed',before:'Annual one-off event sponsorships',after:'3-year strategic partnership agreement',videoId:'UHzDWyV8g4s',org:'Mada Arts Collective, Beirut',toolId:8},
  {id:6,channel:'grants',tag:'Messaging',tagBg:'rgba(42,107,155,.1)',tagColor:'#2a6b9b',title:'One-Pager That Opened 5 Funder Conversations',desc:'A women\'s rights NGO rewrote their case for support using the one-pager template and got 5 new funder meetings in 3 weeks.',stat:'5',statLabel:'new funder meetings',before:'3-page confusing organizational profile',after:'1-page clear case for support',videoId:'UpDAtj8f8Bo',org:'Thara Women\'s Network, Tunis',toolId:2},
  {id:7,channel:'retention',tag:'Pipeline',tagBg:'rgba(30,107,80,.1)',tagColor:'#1e6b50',title:'Pipeline Discipline Closes 4 Gifts in One Quarter',desc:'A food security NGO set up the donor pipeline tracker and weekly review routine, closing 4 new mid-level gifts in a single quarter.',stat:'4',statLabel:'new gifts closed Q1',before:'No pipeline, informal follow-ups',after:'Full pipeline, 4 gifts closed in 90 days',videoId:'W_G9JlkLjJM',org:'Zad Food Relief, Baghdad',toolId:4},
  {id:8,channel:'digital',tag:'Community',tagBg:'rgba(196,135,42,.1)',tagColor:'#c4872a',title:'WhatsApp Strategy Builds a 600-Person Donor Community',desc:'A youth development NGO used the WhatsApp donor mobilization scripts to grow their giving community from 80 to 600 supporters.',stat:'600',statLabel:'active WhatsApp donors',before:'80 supporters, no community platform',after:'600 donors in organized WhatsApp groups',videoId:'w2V0qHJTFtA',org:'Shabab Future Initiative, Gaza',toolId:9},
];

const ASSESSMENT_QUESTIONS = [
  {axis:'Messaging',q:'How would you describe your current ability to explain your NGO\'s value to a donor in 60 seconds?',opts:['We have no clear pitch or messaging','We have some talking points but they vary by person','We have a consistent one-pager used by the team','We have a polished case for support with clear outcomes']},
  {axis:'Messaging',q:'Do you have a written case for support (one-pager) that clearly explains what funding achieves?',opts:['No, we don\'t have one','We have something but it\'s outdated or unclear','We have one but it\'s rarely used','Yes, and we actively use it with donors']},
  {axis:'Messaging',q:'Can your programs be described with specific unit costs and measurable outcomes?',opts:['No, our programs are described in general terms','We have some numbers but not consistent','We have unit costs for most programs','All our programs have clear unit costs and outcomes']},
  {axis:'Pipeline',q:'Do you have a documented list of current and prospective donors with their status?',opts:['No donor list exists','We have a contact list but no pipeline stages','We have a basic spreadsheet with some stages','We have a full pipeline with stages, dates, and next steps']},
  {axis:'Pipeline',q:'How consistently does your team follow up with donor prospects?',opts:['Follow-up is ad hoc and inconsistent','We follow up sometimes but it falls through','We have a follow-up schedule but it\'s not always kept','We have a systematic follow-up process we follow']},
  {axis:'Pipeline',q:'How many qualified prospects (individuals, corporates, or foundations) do you actively track?',opts:['Fewer than 5','5–15 prospects','16–30 prospects','More than 30 active prospects']},
  {axis:'Grant Readiness',q:'How prepared is your NGO to apply for a grant on short notice (2 weeks)?',opts:['We would not be able to apply','We could apply but the quality would be poor','We could submit a decent application','We have templates and documentation ready to adapt quickly']},
  {axis:'Grant Readiness',q:'Do you have a system for tracking grant opportunities, deadlines, and compliance requirements?',opts:['No system at all','We track some opportunities informally','We have a spreadsheet but it\'s not consistently maintained','We have a full grant tracking system with deadlines and tasks']},
  {axis:'Grant Readiness',q:'Have you completed a grant application in the last 12 months?',opts:['No, never applied for a grant','Yes, 1 application','Yes, 2–4 applications','Yes, 5 or more applications']},
  {axis:'Digital & Outreach',q:'How would you describe your NGO\'s current digital fundraising presence?',opts:['No digital fundraising presence','Social media presence but no fundraising','We occasionally run digital campaigns','We run regular, structured digital campaigns with measurable results']},
  {axis:'Digital & Outreach',q:'Do you have a growing email or WhatsApp list of supporters and donors?',opts:['No list at all','Less than 100 contacts','100–500 contacts','500+ active contacts']},
  {axis:'Digital & Outreach',q:'Have you run a crowdfunding or peer-to-peer campaign in the last 2 years?',opts:['Never','We considered it but never launched','Yes, with limited success','Yes, successfully, raising significant funds']},
  {axis:'Retention',q:'What happens within 48 hours of receiving a donation?',opts:['Nothing systematic — we thank when we remember','A basic thank-you email goes out','A personalized thank-you with impact information','A structured thank-you sequence with impact update and next steps']},
  {axis:'Retention',q:'Do you have a donor retention strategy (30/60/90 day communication plan)?',opts:['No strategy exists','We stay in touch informally','We have a plan but it\'s not always executed','We have a documented plan we consistently follow']},
  {axis:'Retention',q:'What percentage of your donors from last year gave again this year?',opts:['Less than 10%','10–25%','26–50%','More than 50%']},
  {axis:'Program Packaging',q:'Can you present your programs as \'fundable offers\' with clear funding levels?',opts:['No, we present programs as general activities','We have some funding descriptions but they\'re vague','We have funding levels but they\'re not consistently used','We have clear funding packs used in all proposals and conversations']},
  {axis:'Program Packaging',q:'Does your NGO have a clear theory of change or logic model?',opts:['No theory of change exists','We have one but it\'s not used in fundraising','We have one and occasionally reference it','We have a strong, visual theory of change we use in all materials']},
  {axis:'Program Packaging',q:'How clearly can you explain the cost per beneficiary or unit of impact?',opts:['We don\'t track this','We have rough estimates','We know the costs for most programs','We have precise unit costs for all programs, verified annually']},
];

const RESOURCES_DATA = {
  guides:[
    {id:'g1',icon:'📘',color:'#1e6b50',pale:'var(--emerald-pale)',tag:'Guide',readTime:'12 min',
      title:'The NGO Fundraising Playbook',
      desc:'A practical overview of fundraising strategy, messaging, pipeline, and systems for small NGOs — covering all 10 fundraising capabilities in one place.',
      preview:'Most small NGOs fundraise reactively — chasing grants, sending proposal after proposal, and hoping something sticks. The Playbook gives you the system to change that: a clear strategy, a working pipeline, and the habits that make fundraising consistent instead of stressful.',
      sections:['Why small NGOs struggle with fundraising','The 6 readiness dimensions explained','Building your case for support','Setting up a donor pipeline','Writing your first grant proposal','Retaining donors after the first gift'],
      relatedPath:1},
    {id:'g2',icon:'📗',color:'#c4872a',pale:'var(--gold-pale)',tag:'Guide',readTime:'8 min',
      title:'Grant Writing for First-Timers',
      desc:'A step-by-step walkthrough of your first grant application — from research and go/no-go decision to submission and follow-up.',
      preview:'Grant writing feels overwhelming the first time. This guide breaks it down into 6 clear steps: choosing the right opportunity, understanding what funders want, structuring your proposal, writing a budget, submitting correctly, and following up.',
      sections:['How to find the right grants','The go/no-go decision framework','What funders want to see','2-page vs 10-page proposals','Budget logic and unit costs','After submission: what to do next'],
      relatedPath:4},
    {id:'g3',icon:'📙',color:'#2a6b9b',pale:'var(--sky-pale)',tag:'Article',readTime:'6 min',
      title:'Building Donor Relationships That Last',
      desc:'How to think about donor relationships as long-term investments — from first contact to lifelong supporter.',
      preview:'The NGOs that raise the most money are not the ones with the best proposals — they are the ones with the strongest relationships. This article explains how to build relationships that make donors want to give again and again.',
      sections:['The relationship-first mindset','What donors actually want','The 4 stages of a donor relationship','How to move donors from one-time to loyal','Common relationship-killing mistakes'],
      relatedPath:8},
    {id:'g4',icon:'📕',color:'#c05050',pale:'#fef2f2',tag:'Guide',readTime:'7 min',
      title:'Digital Fundraising on a Tight Budget',
      desc:'Organic strategies to grow your donor base and run effective digital campaigns without paid advertising.',
      preview:'You do not need a big ad budget to run a successful digital fundraising campaign. This guide shows you how to mobilize your community, optimize your donation page, and run a 14-day campaign using only organic channels — WhatsApp, email, and social media.',
      sections:['Why organic beats paid for small NGOs','Building your community before the campaign','The donation page checklist','A 14-day campaign structure','WhatsApp mobilization tactics','Turning one-time donors into monthly supporters'],
      relatedPath:6},
    {id:'g5',icon:'📘',color:'#1e6b50',pale:'var(--emerald-pale)',tag:'Article',readTime:'5 min',
      title:'The Ethics of Fundraising for NGOs',
      desc:'How to navigate donor expectations, restricted funds, honest communication, and the ethical boundaries every NGO should set.',
      preview:'Fundraising ethics is not just about avoiding fraud. It is about how you present your work, how you treat donor money, and how you protect the dignity of the people you serve. This article covers the practical ethical decisions fundraisers face every day.',
      sections:['What ethical fundraising looks like','Restricted vs unrestricted funds','Storytelling ethics with beneficiaries','Handling donor complaints','Building an ethical fundraising policy'],
      relatedPath:1},
    {id:'g6',icon:'📗',color:'#c4872a',pale:'var(--gold-pale)',tag:'Guide',readTime:'9 min',
      title:'How to Write a Compelling Case for Support',
      desc:'The structure, language, and logic behind a one-page case for support that convinces funders in 60 seconds.',
      preview:'A case for support is not a brochure. It is a persuasion document. This guide walks you through the 5-part structure, explains what language resonates with different types of funders, and shows you how to write a case that converts in 60 seconds.',
      sections:['What a case for support must do','The 5-part structure','Writing in donor language','Proof points that build credibility','Versions for different audiences','Before and after examples'],
      relatedPath:1},
    {id:'g7',icon:'📕',color:'#c05050',pale:'#fef2f2',tag:'Article',readTime:'5 min',
      title:'Corporate Fundraising: Where to Start',
      desc:'How to identify the right corporate partners, build a compelling offer, and approach them without sounding transactional.',
      preview:'Corporate partnerships fail when NGOs treat companies as ATMs. They succeed when you understand what companies actually want — visibility, employee engagement, CSR reporting metrics — and package your program to deliver it.',
      sections:['What companies want from NGO partnerships','How to research CSR alignment','Building a partnership menu','The cold approach that works','Reporting and renewal'],
      relatedPath:7},
    {id:'g8',icon:'📘',color:'#1e6b50',pale:'var(--emerald-pale)',tag:'Guide',readTime:'10 min',
      title:'Fundraising for Crisis-Affected NGOs',
      desc:'Specific strategies for NGOs operating in conflict, displacement, or humanitarian contexts where normal fundraising rules do not always apply.',
      preview:'Fundraising in a crisis context requires a different playbook. Donors are more urgent, funders have different priorities, and your organization may have unique compliance requirements. This guide covers the adaptations that matter most.',
      sections:['Crisis fundraising mindset','Emergency donor appeals','Institutional humanitarian funding','Compliance in crisis contexts','Communicating urgency without sensationalism','Transitioning from emergency to recovery funding'],
      relatedPath:4},
  ],
  checklists:[
    {id:'c1',icon:'✅',color:'#1e6b50',pale:'var(--emerald-pale)',tag:'Readiness',
      title:'Fundraising Readiness Checklist',
      desc:'A self-assessment across the 6 dimensions of fundraising readiness — score yourself before you build your plan.',
      items:['Written fundraising goals with amounts and deadlines','One-page Case for Support completed and tested','At least 2 programs packaged as fundable offers','Prospect list of 20+ qualified donors/funders','Donor pipeline set up with stages and weekly review','Grant calendar with 3+ target deadlines in the next 6 months','Thank-you and stewardship process defined','Monthly fundraising routine documented and shared with team']},
    {id:'c2',icon:'✅',color:'#c05050',pale:'#fef2f2',tag:'Grants',
      title:'Grant Application Checklist',
      desc:'Everything to prepare before submitting a grant application — from research to the moment you click send.',
      items:['Confirmed the funder\u2019s priorities match your program','Completed the go/no-go scoring matrix','Read ALL guidelines (especially word limits and formats)','Gathered all required attachments (registration, audit, board list)','Written the concept note or full proposal','Budget reviewed and all line items justified','M&E framework included with at least 3 indicators','Someone outside your team has reviewed the proposal','Submission method and deadline double-checked','Follow-up plan noted in your pipeline']},
    {id:'c3',icon:'✅',color:'#2a6b9b',pale:'var(--sky-pale)',tag:'Retention',
      title:'New Donor Onboarding Checklist',
      desc:'Steps to take within the first 48 hours and 30 days of receiving a donation — to maximize retention from the start.',
      items:['Send personalized thank-you within 48 hours (not an auto-receipt)','Record donor in your pipeline with full contact details','Note the giving amount, date, and campaign','Set a 30-day follow-up reminder in your calendar','Send a first update at Day 30 (impact, not ask)','Send a check-in at Day 60 (story or programme update)','Send a renewal ask or upgrade invite at Day 90','Document the donor’s stated interests and motivations']},
    {id:'c4',icon:'✅',color:'#c4872a',pale:'var(--gold-pale)',tag:'Planning',
      title:'Annual Fundraising Planning Checklist',
      desc:'Three structured planning sessions to map your full fundraising year — targets, channels, campaigns, and reviews.',
      items:['Review last year’s revenue by channel (what worked, what didn’t)','Set total revenue target for the year','Break target into channels: grants, individuals, corporate, digital, events','Map grant deadlines onto a 12-month calendar','Identify 2 campaign windows (e.g., Ramadan, year-end)','Assign team responsibilities for each channel','Set monthly check-in dates for pipeline review','Plan a mid-year strategy review (month 6)','Define success metrics beyond revenue (retention rate, pipeline growth)','Share the plan with your board']},
    {id:'c5',icon:'✅',color:'#1e6b50',pale:'var(--emerald-pale)',tag:'Events',
      title:'Fundraising Event Checklist',
      desc:'Pre-event, during, and post-event tasks to maximize fundraising and donor engagement.',
      items:['Event goal defined (amount, attendees, new donors)','Venue, catering, AV confirmed','Invitation list reviewed for high-potential prospects','Programme includes a clear, compelling ask','Donation method set up (online link, cash envelopes, card reader)','Volunteers briefed on their fundraising role','Post-event thank-you emails drafted in advance','Follow-up pipeline entries planned for key attendees','Impact story or speaker confirmed','Post-event debrief scheduled within 1 week']},
    {id:'c6',icon:'✅',color:'#c05050',pale:'#fef2f2',tag:'Proposals',
      title:'Proposal Submission Checklist',
      desc:'The final review before you send any proposal — catch the mistakes that disqualify good applications.',
      items:['All required sections written (executive summary, problem, solution, budget, team)','Word/page limits respected throughout','Budget adds up correctly and matches narrative','All $ amounts written in the funder’s preferred currency','Organizational documents attached (registration, audit, board list)','Contact details correct and up to date','Spelling and grammar reviewed (have someone else read it)','Submitted via the correct channel (email, portal, post)','Confirmation of receipt noted in your grants tracker','Thank-you sent to any contacts who helped with the application']},
  ],
  swipe:[
    {id:'s1',icon:'💌',color:'#1e6b50',pale:'var(--emerald-pale)',tag:'Email',
      title:'48-Hour Thank-You Email — First-Time Donor',
      desc:'A warm, personal thank-you for someone who just gave their first gift.',
      content:`Subject: Thank you, [First Name] — your gift is already at work

Dear [First Name],

I wanted to write to you personally to say thank you for your gift of [amount] to [NGO Name].

Your support means more than you might know. Right now, [brief specific impact — e.g., "your donation will help us provide 3 children with school supplies for a full semester"].

We didn’t take your generosity for granted when you gave, and we won’t take it for granted now. I’ll be in touch in the coming weeks to share how your gift is being used.

Thank you again for believing in what we do.

Warmly,
[Your Name]
[Title], [NGO Name]
[Phone / WhatsApp]`},
    {id:'s2',icon:'💌',color:'#c4872a',pale:'var(--gold-pale)',tag:'Email',
      title:'30-Day Donor Impact Update',
      desc:'A brief, non-ask update to send one month after a donation — keeping the donor warm.',
      content:`Subject: A quick update from [NGO Name], [First Name]

Dear [First Name],

It has been about a month since you made your generous gift, and I wanted to share a quick update.

[One concrete impact sentence — e.g., "We have now reached 47 families in the Bekaa with the winter supplies programme you helped fund."]

[One human story in 2–3 sentences — e.g., "One of those families is the Hammoud family, who had been living without heating for two months. Their daughter told our team it was the first warm night she’d had since October."]

We’re grateful to have you with us. I’ll be in touch again soon.

With gratitude,
[Your Name]`},
    {id:'s3',icon:'💬',color:'#2a6b9b',pale:'var(--sky-pale)',tag:'WhatsApp',
      title:'WhatsApp Donor Update (60 Days)',
      desc:'A short, warm WhatsApp message to send at the 60-day mark — builds relationship before the renewal ask.',
      content:`Hi [First Name] 👋

Quick update from [NGO Name] — [one specific result, e.g., "we completed our winter distribution last week and reached 120 families"].

Thought you’d want to know since you were part of making it happen 🙏

We’ll share a full update soon. Hope you’re well!

— [Your Name]`},
    {id:'s4',icon:'📞',color:'#c05050',pale:'#fef2f2',tag:'Script',
      title:'Donor Meeting Ask Script',
      desc:'A word-for-word script for your first major gift ask conversation — from greeting to close.',
      content:`BEFORE THE MEETING
– Confirm the amount you’re asking for
– Prepare 1 specific story that connects to their interest
– Know your 3 funding tiers (Bronze / Silver / Gold)

OPENING (2 min)
"Thank you so much for making time, [Name]. I really value this relationship and wanted to share what we’ve been doing — and what’s coming next."

IMPACT UPDATE (5 min)
"Since we last spoke, [specific programme result]. One example I want to share: [story in 2–3 sentences]."

THE ASK (2 min)
"We’re now working on [next programme / goal]. I’d love to invite you to be part of it. Based on what we’ve discussed, I’d like to ask you to consider a gift of [amount] to [specific purpose]. That would allow us to [specific impact]."

SILENCE — wait for their response. Do not fill the silence.

HANDLING THE PAUSE
If they say "I need to think about it":
"Absolutely. Can I ask — is there any information that would help you make this decision? I’m happy to send you more details."

CLOSE
"Whatever you decide, I’m grateful for your continued support. Can I follow up with you on [specific date]?"

POST-MEETING
– Send a thank-you within 24 hours
– Note next step in your pipeline
– Follow up on the agreed date`},
    {id:'s5',icon:'💌',color:'#1e6b50',pale:'var(--emerald-pale)',tag:'Email',
      title:'Cold Email to a Foundation',
      desc:'A first-contact email to a foundation you have never worked with — short, relevant, and professional.',
      content:`Subject: [NGO Name] — Brief Introduction and Alignment with [Foundation Name]

Dear [Programme Officer Name / Grants Team],

My name is [Your Name], [Title] at [NGO Name]. We are a [brief descriptor — e.g., "local NGO working on youth vocational training in Jordan"] registered in [country] since [year].

I am writing because [Foundation Name]'s focus on [their stated priority — e.g., "youth economic empowerment in the MENA region"] aligns closely with our work. [One sentence on what you do and who you serve.]

In [year], we [one concrete result — e.g., "trained 340 young people and placed 78% in employment within 6 months"].

I would welcome the chance to explore whether there is a fit between our work and your current funding priorities. I am happy to send a brief concept note, or to arrange a short introductory call at your convenience.

Thank you for considering this.

Respectfully,
[Your Name]
[Title] | [NGO Name]
[Email] | [Phone]
[Website]`},
    {id:'s6',icon:'💬',color:'#c4872a',pale:'var(--gold-pale)',tag:'Email',
      title:'Corporate Sponsorship Intro Email',
      desc:'A compelling first email to a corporate prospect — focused on their interests, not your needs.',
      content:`Subject: Partnership Opportunity — [NGO Name] + [Company Name]

Dear [Name],

I’m reaching out because [Company Name]'s commitment to [their CSR focus — e.g., "youth development and community investment"] caught my attention, and I believe there may be a meaningful fit with the work we’re doing at [NGO Name].

We are a [brief description] serving [beneficiary group] in [geography]. In [year], [one result].

We are currently looking for one [title — e.g., "Lead Partner"] for our [programme name] — a partnership that would give [Company Name]:

• [Benefit 1 — e.g., "Visibility with 5,000+ community members"]
• [Benefit 2 — e.g., "Employee volunteering opportunities"]  
• [Benefit 3 — e.g., "Co-branded impact reporting for your CSR report"]

I have attached a one-page overview. Would you be open to a 20-minute call this week or next?

Best regards,
[Your Name]`},
    {id:'s7',icon:'📞',color:'#2a6b9b',pale:'var(--sky-pale)',tag:'Script',
      title:'Renewal Ask Script (Phone)',
      desc:'A short, warm phone script to renew a lapsed donor or upgrade a current one.',
      content:`GOAL: Renew or upgrade a donor who gave in the last 12 months

OPENING
"Hi [Name], this is [Your Name] from [NGO Name]. Is now an okay time for a quick 3-minute call?"

BRIDGE
"I wanted to call to personally thank you for your support last year — your gift of [amount] went to [specific use]. I also wanted to share one thing that happened because of it: [brief story, 2 sentences]."

THE ASK
"We’re now launching [next phase / campaign] and I’d love to invite you to be part of it again. Would you be willing to make a gift this year? Even [same or slightly higher amount] would make a real difference for [specific outcome]."

IF YES: "That’s wonderful. I’ll send you a donation link right now — or I can take a card payment over the phone if that’s easier."

IF MAYBE: "Of course. Can I send you a short update by email and follow up in a week?"

IF NO: "I completely understand. Thank you for your past support — it really did matter. I hope we can stay in touch."

CLOSE
"Thank you so much for your time, [Name]. Have a wonderful day."`},
  ],
  glossary:[
    {term:'Annual Fund',letter:'A',def:'A yearly fundraising effort — usually a campaign — that generates unrestricted operating income from a broad base of donors.'},
    {term:'Ask',letter:'A',def:'The moment when you formally request a donation from a prospective or existing donor. A clear ask states the amount, the purpose, and the impact.'},
    {term:'Board Giving',letter:'B',def:'The practice of all board members making a personal financial gift to the organization. Institutional funders often require 100% board giving as a sign of internal confidence.'},
    {term:'Case for Support',letter:'C',def:'A document that explains why donors should fund your NGO — covering the problem you solve, your solution, your impact, and a specific funding ask.'},
    {term:'Cultivation',letter:'C',def:'The process of building a relationship with a prospective donor before making an ask — through meetings, updates, events, and personal connection.'},
    {term:'Crowdfunding',letter:'C',def:'Raising small amounts from a large number of people, typically online, often with a specific campaign goal and deadline.'},
    {term:'Donor Pipeline',letter:'D',def:'A system for tracking where each prospective donor is in their journey — from first contact to ask to gift to stewardship.'},
    {term:'Due Diligence',letter:'D',def:'The process institutional funders use to verify an NGO’s legal status, financial health, governance, and programme track record before awarding a grant.'},
    {term:'Endowment',letter:'E',def:'A fund where the principal is invested and only the returns are spent. Endowments provide long-term, sustainable income.'},
    {term:'Funder',letter:'F',def:'Any organization or individual that provides financial support — including foundations, government bodies, bilateral aid agencies, and corporate sponsors.'},
    {term:'Fundraising Pipeline',letter:'F',def:'See Donor Pipeline. Can also refer specifically to grant opportunities being tracked from research to submission to decision.'},
    {term:'Go/No-Go Matrix',letter:'G',def:'A scoring tool used to decide whether to pursue a specific grant opportunity — weighing factors like fit, effort, odds of success, and strategic value.'},
    {term:'Grant Cycle',letter:'G',def:'The full timeline of a grant process — from opening of the call, through application, review, award, implementation, and final reporting.'},
    {term:'Impact Report',letter:'I',def:'A document sent to donors that shows the concrete results of their funding — usually combining numbers, stories, and photos in one easy-to-read format.'},
    {term:'In-Kind',letter:'I',def:'A non-cash contribution of goods or services — such as office space, equipment, or volunteer time — which can often be counted as matching funds.'},
    {term:'Lead Donor',letter:'L',def:'The first or largest donor in a campaign, whose gift is often used to inspire others to give ("if they believe in it, so should I").'},
    {term:'Major Gift',letter:'M',def:'A significant donation — typically the top 5–10% of individual gifts received. The threshold varies by organization size but usually involves a personal ask conversation.'},
    {term:'Matching Gift',letter:'M',def:'When a donor or funder agrees to match contributions from other donors — often used in campaigns to incentivize giving.'},
    {term:'M&E',letter:'M',def:'Monitoring and Evaluation — the systems an NGO uses to track programme outputs, outcomes, and impact. Institutional funders require a basic M&E framework in all proposals.'},
    {term:'One-Pager',letter:'O',def:'A single-page document summarizing your NGO’s work, impact, and funding ask — designed to be read in 60 seconds and leave the reader wanting to learn more.'},
    {term:'Overhead',letter:'O',def:'The administrative and operational costs of running an organization (staff, rent, utilities). Many funders restrict overhead spending — understanding their policy is critical before applying.'},
    {term:'Pledge',letter:'P',def:'A formal commitment to give a specific amount at a future date or in installments. Pledges allow NGOs to plan ahead even before cash is received.'},
    {term:'Programme Officer',letter:'P',def:'The funder staff member who manages a grant portfolio, reviews applications, and communicates with grantees. Building a relationship with the programme officer improves your odds.'},
    {term:'Prospect',letter:'P',def:'A potential donor who has not yet given but has some connection or alignment with your mission — through past giving, network links, or thematic interest.'},
    {term:'Restricted Funds',letter:'R',def:'Donations that must be used for a specific purpose as defined by the donor or funder. Restricted funds cannot be redirected without donor consent.'},
    {term:'Retention Rate',letter:'R',def:'The percentage of donors who gave in one year and gave again the following year. Most NGOs retain 20–40% of donors. Best-in-class retention exceeds 60%.'},
    {term:'Stewardship',letter:'S',def:'The ongoing process of managing donor relationships after they give — through updates, impact reports, personal communication, and events.'},
    {term:'Theory of Change',letter:'T',def:'A narrative or diagram explaining how your activities lead to outputs, outcomes, and ultimately long-term impact. Required in most institutional funding applications.'},
    {term:'Unrestricted Funds',letter:'U',def:'Donations that can be used for any organizational purpose at the NGO’s discretion — the most flexible and valuable type of funding.'},
    {term:'Unit Cost',letter:'U',def:'The cost to deliver one unit of your programme output (e.g., cost to train one youth, cost per medical consultation). Unit costs make your budget transparent and your ask credible.'},
    {term:'Warm Prospect',letter:'W',def:'A prospective donor who already has some connection to your organization — through your network, past events, or expressed interest — making them easier to approach than a cold contact.'},
  ],
};

const AI_MODES = {
  ask:{label:'Ask Anything',desc:'Ask me anything about fundraising for your NGO. I\'ll give practical, action-oriented answers based on best practices for local and regional NGOs.',suggestions:['How do I start fundraising for a new NGO?','What\'s the difference between grants and individual donors?','How do I write a good thank-you message to a donor?','What should be in a 12-month fundraising plan?','How many donors should I have in my pipeline?']},
  review:{label:'Review One-Pager',desc:'Paste your one-pager or case for support text below. I\'ll give you specific feedback on clarity, structure, donor appeal, and what to improve.',suggestions:['Paste your one-pager and I\'ll review it','What are the signs of a weak case for support?','How long should a case for support be?','What do funders look for in a one-pager?']},
  message:{label:'Improve Donor Message',desc:'Share your draft donor message (email or WhatsApp) and I\'ll help you make it clearer, warmer, and more compelling.',suggestions:['Here\'s my thank-you email draft, please improve it','How should I follow up with a donor after 30 days?','Write me a WhatsApp update message for donors','How do I ask a lapsed donor to give again?']},
  pipeline:{label:'Build Pipeline',desc:'I\'ll help you identify the right donor prospects and set up your pipeline. Tell me about your NGO\'s work and I\'ll help you get started.',suggestions:['What types of funders should I target for education programs?','How do I research foundation prospects?','What should be the stages in my donor pipeline?','How do I prioritize my prospect list?']},
  proposal:{label:'Draft Proposal',desc:'Tell me about your program and funding need. I\'ll help you structure and draft a compelling 2-page proposal.',suggestions:['Help me draft a 2-page proposal for a youth program','What\'s the structure of a strong grant proposal?','How long should each section of a proposal be?','What do institutional donors look for in a budget?']},
  package:{label:'Package Program',desc:'Describe your program and I\'ll help you create a Funding Pack Card with clear outcomes, unit costs, and funding levels.',suggestions:['Help me package a vocational training program','What should be in a Funding Pack Card?','How do I calculate unit costs for my programs?','What funding levels should I offer to donors?']},
};

const FAQ_DATA = [
  {q:'Who is FundReady Academy for?', a:'FundReady Academy is built for NGO executive directors, program managers, and fundraising/partnership officers at small to medium local and regional NGOs — especially in the MENA region and similar contexts where fundraising is "everyone\'s job" and budgets are tight. If your team is under 20 people and you\'re trying to build sustainable funding, this platform is for you.'},
  {q:'Do I need any prior fundraising experience?', a:'No. The platform is designed for all levels. If you\'re brand new, start with the Readiness Assessment to understand where you are. If you have some experience, the assessment will show you which specific gaps to fill. Beginners, intermediate, and advanced content are all clearly labeled.'},
  {q:'Is FundReady Academy free?', a:'The core platform — including the Readiness Assessment, all micro-lesson previews, and the AI Advisor — is free to use. Full lesson series, downloadable template packs, and premium webinar recordings require a subscription. We offer a free 14-day trial of the full platform — no credit card required.'},
  {q:'How long does it take to complete a learning path?', a:'Most learning paths take between 2–4 weeks to complete if you dedicate 30 minutes per day. The "Fundraising Readiness in 30 Days" path is designed to be done in exactly 30 days. Each micro-lesson is 3–6 minutes, and the real investment is applying what you learn through the workbooks and 30-day action plans.'},
  {q:'How does the 30-day capability-building cycle work?', a:'Each capability follows a 6-step cycle: (1) Assess your current score, (2) Learn via 3–6 micro-lessons, (3) Shape your outputs using guided workbooks, (4) Implement a week-by-week 30-day plan, (5) Prove your progress by uploading evidence assets, and (6) Re-Assess to measure improvement. Then start the next capability.'},
  {q:'What does the Readiness Assessment measure?', a:'The 18-question assessment measures your NGO across 6 dimensions: Messaging & Case for Support, Donor Pipeline, Grant Readiness, Digital & Outreach, Donor Retention, and Program Packaging. You\'ll receive a score (1–100%) for each axis, your top 2 priority gaps, and a recommended learning path. It takes about 10 minutes and is completely free.'},
  {q:'How is this different from other NGO training platforms?', a:'Most training platforms give you knowledge — we give you capability. That means every lesson ends with an "apply now" task, every path includes real templates you can adapt, and every capability has a 30-day implementation plan. You don\'t just learn about donor pipelines — you build one. We also have an AI Advisor integrated into the platform specifically for NGO fundraising questions.'},
  {q:'Can I use this with my whole team?', a:'Yes! Team plans allow multiple users under one NGO account. We recommend that the NGO director, program lead, and any fundraising/partnership staff all go through the relevant learning paths together. The AI Advisor can be used by everyone on the team. Contact us to discuss team pricing.'},
  {q:'What languages is the platform available in?', a:'The platform is currently in English. An Arabic version is in development and expected to launch in 2025. If you\'re interested in the Arabic version, you can register your interest through the contact page.'},
  {q:'How do I get started?', a:'Start with the free Readiness Assessment (10 minutes). You\'ll immediately see your scores, top 2 priority gaps, and recommended learning path. From there, click "Start Recommended Path" and you\'re in. No account required to take the assessment — but you\'ll need to create a free account to save your progress.'},
  {q:'What if I need help or have questions during learning?', a:'The AI Advisor is available 24/7 to answer fundraising questions, review your drafts, and help you apply lessons to your specific NGO context. For account or platform support, you can reach us through the Contact page. Premium users also get access to optional mentor feedback on submitted workbooks.'},
  {q:'Are the templates really ready to use?', a:'Yes — all templates are designed to be adapted in 30 minutes or less. Each template includes fill-in sections, instructions, and a sample filled version so you can see what a good output looks like. We built them based on what real funders and donors look for in the MENA region specifically.'},
];

function renderFAQ() {
  const el = document.getElementById('faqList');
  if (!el || el.dataset.rendered) return;
  el.dataset.rendered = '1';
  el.innerHTML = FAQ_DATA.map((item, i) => `
    <div style="border:1px solid var(--border);border-radius:var(--radius);background:#fff;margin-bottom:10px;overflow:hidden">
      <button onclick="toggleFAQ(this)" style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 22px;background:none;border:none;cursor:pointer;font-family:inherit;text-align:left">
        <span style="font-size:15px;font-weight:600;color:var(--ink);line-height:1.4">${item.q}</span>
        <span style="font-size:20px;color:var(--emerald);flex-shrink:0;transition:transform .2s;font-weight:300" class="faq-arrow">+</span>
      </button>
      <div class="faq-body" style="display:none;padding:0 22px 18px;font-size:14.5px;color:var(--ink-soft);line-height:1.7">${item.a}</div>
    </div>`).join('');
  const f = document.getElementById('faqFooter');
  if (f && !f.dataset.rendered) { f.innerHTML = renderFooter(); f.dataset.rendered = '1'; }
}

function toggleFAQ(btn) {
  const body = btn.nextElementSibling;
  const arrow = btn.querySelector('.faq-arrow');
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  arrow.style.transform = isOpen ? '' : 'rotate(45deg)';
  arrow.style.color = isOpen ? 'var(--emerald)' : 'var(--rose)';
}
let lessonFilter = 'all';
let toolFilter = 'all';
let storyFilter = 'all';
let searchType = 'all';
let aiMode = 'ask';
let chatHistory = [];

function navigate(page, _fromBack) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  // cap-improve-N pages use a single shared div
  const elId = page.startsWith("cap-improve-")   ? "cap-improve"
              : page.startsWith("track-detail-")  ? "track-detail"
              : page.startsWith("cap-learn-")     ? "cap-learn"
              : page.startsWith("track-learn-")   ? "track-learn"
              : page.startsWith("track-improve-") ? "track-improve"
              : page;
  const el = document.getElementById("page-" + elId);
  if (!el) return;
  el.classList.add("active");

  // ── Nav stack: push current page before leaving (but not on goBack() calls) ──
  if (!_fromBack && currentPage && currentPage !== page) {
    _navStack.push({ page: currentPage, label: _PAGE_LABELS[currentPage] || currentPage });
    if (_navStack.length > 30) _navStack.shift(); // cap stack
  }
  currentPage = page;
  window.scrollTo({top: 0, behavior: "smooth"});

  // ── Update back bar ──
  _updateBackBar(page);

  // Update nav active state (desktop + mobile)
  document.querySelectorAll(".nav-links a").forEach(a => a.classList.toggle("active", a.dataset.page === page));
  // Highlight Learn dropdown items and trigger
  const learnPages = ['micro-lessons','learning-paths','webinars'];
  const learnTrigger = document.getElementById('learnTrigger');
  const learnMenuItems = document.querySelectorAll('#learnMenu a');
  learnMenuItems.forEach(a => a.classList.toggle('active', a.dataset.page === page));
  if (learnTrigger) learnTrigger.classList.toggle('active', learnPages.includes(page));
  // Highlight Improve dropdown items and trigger
  const improvePages = ['tools','resources','success-stories'];
  const improveTrigger = document.getElementById('improveTrigger');
  const improveMenuItems = document.querySelectorAll('#improveMenu a');
  improveMenuItems.forEach(a => a.classList.toggle('active', a.dataset.page === page));
  if (improveTrigger) improveTrigger.classList.toggle('active', improvePages.includes(page));
  document.querySelectorAll(".mobile-drawer-links a").forEach(a => a.classList.toggle("active", a.dataset.mob === page));

  // Update page title
  const titles = {home:"Home",assessment:"Assessment","capabilities":"Capability Model","improvement-tracks":"Improvement Tracks","sh-roadmap":"90-Day Roadmap","sh-checklist":"This Week's Checklist","sh-path":"My Learning Path","micro-lessons":"Micro Lessons","learning-paths":"Learning Paths","path-detail":"Learning Path",webinars:"Webinars",tools:"Tools & Templates",resources:"Resources",workbooks:"Workbooks","video-guides":"Video Guides","success-stories":"Success Stories","ai-advisor":"AI Advisor",about:"About",dashboard:"My Dashboard","sign-in":"Sign In",search:"Search",capabilities:"Capability Model",faq:"FAQ",contact:"Contact",terms:"Terms of Use",privacy:"Privacy Policy"};
  const titleDisplay = page.startsWith("cap-improve-")   ? "Improve Plan"
                     : page.startsWith("track-detail-")  ? "Improvement Track"
                     : page.startsWith("cap-learn-")     ? "Learn Capability"
                     : page.startsWith("track-learn-")   ? "Track Learn"
                     : page.startsWith("track-improve-") ? "Track Improve"
                     : (titles[page] || page);
  document.title = (titleDisplay ? titleDisplay + " — " : "") + "FundReady Academy";

  // Render footers
  ["homeFooter","shRoadmapFooter","shChecklistFooter","shPathFooter","microLessonsFooter","lessonPlayerFooter","learningPathsFooter","webinarsFooter","toolsFooter","resourcesFooter","assessmentFooter","successStoriesFooter","aiAdvisorFooter","searchFooter","dashboardFooter","signInFooter","aboutFooter","faqFooter","capabilitiesFooter","contactFooter","termsFooter","privacyFooter","improvementTracksFooter","trackDetailFooter","capLearnFooter","trackLearnFooter","trackImproveFooter"].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.dataset.rendered) { el.innerHTML = renderFooter(); el.dataset.rendered = "1"; }
  });

  if (page === "improvement-tracks") renderImprovementTracks();
  if (page.startsWith("track-detail-")) {
    const trackNum = parseInt(page.replace("track-detail-", ""), 10);
    renderTrackDetailPage(trackNum);
  }
  if (page.startsWith("track-learn-")) {
    const trackNum = parseInt(page.replace("track-learn-", ""), 10);
    // Direct DOM write to confirm navigate() reaches here
    const _tBody = document.getElementById("trackLearnBody");
    const _tDbg  = document.getElementById("tlDebug");
    if(_tDbg){_tDbg.style.display="block";_tDbg.textContent="navigate() reached track-learn, trackNum="+trackNum;}
    if(_tBody){_tBody.innerHTML='<div style="padding:20px;background:orange;color:#000;font-weight:bold">navigate() reached here! Calling renderTrackLearnPage('+trackNum+')</div>';}
    try { renderTrackLearnPage(trackNum); } catch(e2) {
      if(_tBody)_tBody.innerHTML='<div style="padding:20px;background:#b83252;color:#fff;font-family:monospace;border-radius:8px"><b>renderTrackLearnPage crashed:</b><br>'+e2.message+'<br><pre style="white-space:pre-wrap;font-size:11px">'+e2.stack+'</pre></div>';
    }
  }
  if (page.startsWith("track-improve-")) {
    const trackNum = parseInt(page.replace("track-improve-", ""), 10);
    renderTrackImprovePage(trackNum);
  }
  if (page === "home") renderHomePage();
  if (page === "micro-lessons") { renderLessons(); }
  if (page === "lesson-player") { renderLessonPlayer(); }
  if (page === "learning-paths") renderPaths();
  if (page === "path-detail")   renderPathDetail();
  if (page === "webinars") renderWebinars();
  if (page === "tools") renderTools();
  if (page === "resources") renderResources();
  if (page === "workbooks") renderWorkbooksPage();
  if (page === "video-guides") renderVideoGuidesPage();
  if (page === "success-stories") renderStories();
  if (page === "assessment") renderAssessment();
  if (page === "ai-advisor") renderAIAdvisor();
  if (page === "dashboard") renderDashboard();
  if (page === "sh-roadmap")  renderRoadmap();
  if (page === "sh-checklist") renderChecklistDetail();
  if (page === "sh-path")     renderRecommendedPath();
  if (page === "about") renderAbout();
  if (page === "capabilities") renderCapabilities();
  if (page === "search") initSearch();
  if (page === "faq") renderFAQ();
  if (page === "contact") renderContact();
  if (page === "terms") renderSimplePage('termsFooter');
  if (page === "privacy") renderSimplePage('privacyFooter');
  if (page.startsWith("cap-improve-")) {
    const capNum = parseInt(page.replace("cap-improve-",""), 10);
    renderCapImprovePage(capNum);
  }
  if (page.startsWith("cap-learn-")) {
    const capNum = parseInt(page.replace("cap-learn-",""), 10);
    try {
      renderCapLearnPage(capNum);
    } catch(e) {
      const b = document.getElementById('capLearnBody');
      if (b) b.innerHTML = '<div style="padding:40px;color:red;font-size:14px;font-family:monospace"><strong>ERROR:</strong> ' + e.message + '<br><pre>' + (e.stack||'') + '</pre></div>';
    }
  }
}

function goBack() {
  if (!_navStack.length) { navigate('home', true); return; }
  const prev = _navStack.pop();
  // If going back to path-detail, restore the path id first
  navigate(prev.page, true);
}

function _updateBackBar(page) {
  const bar  = document.getElementById('globalBackBar');
  const btn  = document.getElementById('globalBackBtn');
  const crumb = document.getElementById('globalBackCrumb');
  if (!bar) return;

  // Main nav pages: hide back bar
  const mainPages = new Set(['home','capabilities','micro-lessons','learning-paths','webinars','tools','resources','success-stories','ai-advisor','about']);
  if (mainPages.has(page)) {
    bar.classList.remove('visible');
    return;
  }

  // Sub-pages: show back bar with smart label
  bar.classList.add('visible');
  const prev = _navStack.length ? _navStack[_navStack.length - 1] : null;
  if (btn) btn.textContent = '← ' + (prev ? prev.label : 'Back');

  // Build breadcrumb trail (last 2 items)
  if (crumb && _navStack.length) {
    const trail = _navStack.slice(-2);
    crumb.innerHTML = trail.map((s, i) =>
      '<span style="color:var(--emerald);cursor:pointer;font-weight:500" onclick="_navJump(' + (-(trail.length - i)) + ')">' + s.label + '</span>'
    ).join(' <span style="opacity:.4">›</span> ')
    + ' <span style="opacity:.4">›</span> <span>' + (_PAGE_LABELS[page] || page) + '</span>';
  } else if (crumb) {
    crumb.innerHTML = '<span>' + (_PAGE_LABELS[page] || page) + '</span>';
  }
}

function _navJump(offset) {
  // offset is negative, e.g. -2 means go back 2 steps
  const steps = Math.abs(offset);
  if (steps >= _navStack.length) { navigate('home', true); _navStack = []; return; }
  const target = _navStack[_navStack.length - steps];
  _navStack = _navStack.slice(0, _navStack.length - steps + 1);
  _navStack.pop(); // remove target itself before navigate pushes
  navigate(target.page, true);
}

/* ══════════════════════════════════════════════════════
   RENDER FUNCTIONS
══════════════════════════════════════════════════════ */

function renderHomePage() {
  // Home lessons (6 items)
  const grid = document.getElementById('homeLessonsGrid');
  if (grid && !grid.dataset.rendered) {
    grid.dataset.rendered = '1';
    grid.innerHTML = LESSONS.slice(0,6).map(l => `
      <div class="lesson-card" onclick="showLessonModal(${l.id})">
        <h4>${l.title}</h4>
        <div class="lesson-meta"><span>${l.duration}</span><span>${l.count} lessons</span></div>
      </div>`).join('');
  }
  // Home paths (4 items)
  const pathsGrid = document.getElementById('homePathsGrid');
  if (pathsGrid && !pathsGrid.dataset.rendered) {
    pathsGrid.dataset.rendered = '1';
    pathsGrid.innerHTML = PATHS.slice(0,4).map(p => `
      <div class="path-card" onclick="showPathModal(${p.id})">
        <span class="path-tag" style="background:${p.tagColor};color:${p.tagText}">${p.tag}</span>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="path-meta"><span>${p.lessons} lessons</span><span>${p.templates} templates</span></div>
      </div>`).join('');
  }
  // Home stories (3 items)
  const storiesGrid = document.getElementById('homeStoriesGrid');
  if (storiesGrid && !storiesGrid.dataset.rendered) {
    storiesGrid.dataset.rendered = '1';
    storiesGrid.innerHTML = STORIES.slice(0,3).map(s => `
      <div class="story-card" onclick="showStoryModal(${s.id})">
        <div class="sc-top">
          <span class="sc-tag" style="background:${s.tagBg};color:${s.tagColor}">${s.tag}</span>
          <h3>${s.title}</h3>
          <p>${s.desc}</p>
        </div>
        <div class="sc-bottom"><div class="sc-stat"><strong>${s.stat}</strong><span>${s.statLabel}</span></div><span style="color:var(--emerald);font-size:18px">→</span></div>
      </div>`).join('');
  }
}

function renderStartHere() {
  const foot = document.getElementById('startHereFooter');
  if (foot && !foot.dataset.r) { foot.innerHTML = renderFooter(); foot.dataset.r = '1'; }
}

/* ─────────────────────────────────────────────────────
   SH-ROADMAP: just render footer (content is static HTML)
───────────────────────────────────────────────────── */
function renderRoadmap() {
  const foot = document.getElementById('sh-roadmap-footer');
  if (foot && !foot.dataset.r) { foot.innerHTML = renderFooter(); foot.dataset.r = '1'; }
}

/* ─────────────────────────────────────────────────────
   SH-CHECKLIST: Weekly checklist with phase switching
───────────────────────────────────────────────────── */
const CHECKLIST_PHASES = {
  1: [
    {text:'Take the Fundraising Readiness Assessment',          icon:'', action:'page|assessment',     label:'Take Now'},
    {text:'Download the 90-Day Plan template',                  icon:'', action:'pdf|90-day plan',      label:'Download PDF'},
    {text:'Write a draft one-page Case for Support',            icon:'', action:'lesson|2|0',           label:'Start Learning'},
    {text:'List your top 5 potential donors or funders',        icon:'🔍', action:'lesson|4|0',           label:'Start Learning'},
    {text:'Watch Webinar 1: 90-Day Readiness',                  icon:'▶️',  action:'page|webinars',        label:'Watch Now'},
  ],
  2: [
    {text:'Build your prospect research list (20+ names)',      icon:'🔍', action:'lesson|4|0',           label:'Start Learning'},
    {text:'Set up your donor pipeline tracker',                 icon:'📈', action:'page|tools',           label:'Get Template'},
    {text:'Send warm outreach to 5 existing contacts',         icon:'📞', action:'lesson|6|0',           label:'Start Learning'},
    {text:'Watch Webinar 6: Donor Pipeline',                    icon:'▶️',  action:'page|webinars',        label:'Watch Now'},
    {text:'Submit your first grant application',               icon:'📋', action:'lesson|7|0',           label:'Start Learning'},
  ],
  3: [
    {text:'Draft your 12-month fundraising plan',               icon:'📅', action:'page|learning-paths', label:'View Path'},
    {text:'Set up the 30/60/90 donor retention workflow',       icon:'💌', action:'lesson|10|0',          label:'Start Learning'},
    {text:'Download and complete the Impact Report template',   icon:'', action:'page|tools',           label:'Get Template'},
    {text:'Run your first weekly pipeline review meeting',      icon:'🔄', action:'lesson|5|0',           label:'Start Learning'},
    {text:'Retake the assessment and update your plan',         icon:'', action:'page|assessment',      label:'Re-assess'},
  ]
};

let _clPhase = 1;

function renderChecklistDetail() {
  _clPhase = 1;
  _renderClItems();
  const foot = document.getElementById('sh-checklist-footer');
  if (foot && !foot.dataset.r) { foot.innerHTML = renderFooter(); foot.dataset.r = '1'; }
}

function setChecklistPhase(p, btn) {
  _clPhase = p;
  const cols = {1:'var(--emerald)', 2:'var(--gold)', 3:'var(--sky)'};
  [1,2,3].forEach(n => {
    const b = document.getElementById('cl-ph-btn-' + n);
    if (!b) return;
    if (n === p) { b.style.background = cols[n]; b.style.color = '#fff'; b.style.borderColor = cols[n]; }
    else         { b.style.background = '#fff';   b.style.color = 'var(--ink-soft)'; b.style.borderColor = 'var(--border)'; }
  });
  _renderClItems();
}

function _renderClItems() {
  const wrap = document.getElementById('sh-checklist-items');
  if (!wrap) return;
  const items = CHECKLIST_PHASES[_clPhase] || CHECKLIST_PHASES[1];
  const col   = {1:'var(--emerald)', 2:'var(--gold)', 3:'var(--sky)'}[_clPhase];
  const paleBg = {1:'var(--emerald-pale)', 2:'var(--gold-pale)', 3:'var(--sky-pale)'}[_clPhase];
  wrap.innerHTML = items.map((it, i) => `
    <div class="cl-row" data-checked="0" onclick="_toggleCl(this)"
      style="display:flex;align-items:center;gap:14px;padding:16px 18px;background:#fff;border:2px solid var(--border);border-radius:12px;cursor:pointer;transition:all .2s;position:relative">
      <div class="cl-dot" style="width:26px;height:26px;border-radius:50%;border:2.5px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s;font-size:13px"></div>
      <span style="font-size:20px;flex-shrink:0">${it.icon}</span>
      <div style="flex:1">
        <div class="cl-text" style="font-size:14.5px;font-weight:600;color:var(--ink);line-height:1.4">${it.text}</div>
      </div>
      <button onclick="event.stopPropagation();_clAction('${it.action}')"
        style="padding:7px 14px;background:${col};color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;flex-shrink:0;white-space:nowrap;transition:background .15s">${it.label} →</button>
    </div>`).join('');
  _updateClProgress();
}

function _toggleCl(el) {
  const col   = {1:'var(--emerald)', 2:'var(--gold)', 3:'var(--sky)'}[_clPhase];
  const pale  = {1:'var(--emerald-pale)', 2:'var(--gold-pale)', 3:'var(--sky-pale)'}[_clPhase];
  const dot   = el.querySelector('.cl-dot');
  const txt   = el.querySelector('.cl-text');
  const on    = el.dataset.checked !== '1';
  el.dataset.checked = on ? '1' : '0';
  el.style.background   = on ? pale : '#fff';
  el.style.borderColor  = on ? col  : 'var(--border)';
  dot.style.background  = on ? col  : 'transparent';
  dot.style.borderColor = on ? col  : 'var(--border)';
  dot.innerHTML         = on ? '<span style="color:#fff;font-weight:900;font-size:11px">✓</span>' : '';
  txt.style.textDecoration = on ? 'line-through' : 'none';
  txt.style.color          = on ? 'var(--ink-muted)' : 'var(--ink)';
  _updateClProgress();
}

function _updateClProgress() {
  const rows  = document.querySelectorAll('#sh-checklist-items .cl-row');
  const done  = [...rows].filter(r => r.dataset.checked === '1').length;
  const total = rows.length;
  const lbl   = document.getElementById('cl-prog-label');
  const bar   = document.getElementById('cl-prog-bar');
  if (lbl) lbl.textContent = done + ' / ' + total + ' done';
  if (bar) bar.style.width = (total ? Math.round(done / total * 100) : 0) + '%';
}

function _clAction(action) {
  if (action.startsWith('page|'))   { navigate(action.slice(5)); return; }
  if (action.startsWith('lesson|')) { const p = action.split('|'); openLessonPlayer(+p[1], +p[2]||0); return; }
  if (action.startsWith('pdf|'))    { downloadPDF(action.slice(4), '90-Day Roadmap'); return; }
  navigate(action);
}

/* ─────────────────────────────────────────────────────
   SH-PATH: Recommended Learning Path
───────────────────────────────────────────────────── */
const PATH_RECOMMENDATIONS = [
  {min:0,  max:30,  pathId:1, reason:'Your foundation needs work first. The Fundraising Readiness path builds clarity, direction, and your first 90-day plan.'},
  {min:31, max:50,  pathId:2, reason:'Good basics — now build a full 12-month strategy with goals, channels, and a quarterly plan.'},
  {min:51, max:65,  pathId:5, reason:'Strategy exists, execution is the gap. The Donor Pipeline path sharpens your prospecting and closing system.'},
  {min:66, max:80,  pathId:4, reason:'You need institutional revenue. The Grants path covers selection, proposal writing, and compliance step by step.'},
  {min:81, max:100, pathId:8, reason:'Strong foundations. Focus now on keeping the donors you win — the Donor Retention path is your next level.'},
];

// Lesson categories per path (by LESSONS[i].cat field prefix)
const PATH_CAT_MAP = {
  1:['Readiness'], 2:['Readiness','Strategy'], 3:['Packaging'],
  4:['Grants'],    5:['Pipeline','Prospecting','Closing'],
  6:['Digital'],   7:['Corporate'], 8:['Retention']
};

function renderRecommendedPath() {
  const wrap = document.getElementById('sh-path-content');
  if (!wrap) return;

  const score    = (typeof window.lastAssessmentScore === 'number' && window.lastAssessmentScore > 0)
                   ? window.lastAssessmentScore : null;
  const rec      = PATH_RECOMMENDATIONS.find(r => score !== null && score >= r.min && score <= r.max)
                   || PATH_RECOMMENDATIONS[0];
  const path     = PATHS.find(p => p.id === rec.pathId) || PATHS[0];
  const cats     = PATH_CAT_MAP[path.id] || ['Readiness'];
  const matched  = LESSONS.filter(l => cats.some(c => l.cat && l.cat.toLowerCase().startsWith(c.toLowerCase())));
  const starters = (matched.length >= 1 ? matched : LESSONS).slice(0, 3);

  const pathTagColors = {
    1:'#1e6b50', 2:'#c4872a', 3:'#2a6b9b', 4:'#c05050',
    5:'#1e6b50', 6:'#c4872a', 7:'#2a6b9b', 8:'#c05050'
  };
  const col = pathTagColors[path.id] || 'var(--sky)';

  wrap.innerHTML = `
    ${score === null ? `
      <div style="background:#fff;border:2px dashed var(--border);border-radius:16px;padding:36px 28px;text-align:center;margin-bottom:28px">
        <div style="font-size:48px;margin-bottom:14px">📊</div>
        <div style="font-size:18px;font-weight:800;margin-bottom:8px;color:var(--ink)">Take the Assessment First</div>
        <div style="font-size:14px;color:var(--ink-soft);max-width:400px;margin:0 auto 22px;line-height:1.6">
          Your recommended path is personalised from your assessment score. It takes just 10 minutes.
        </div>
        <button onclick="navigate('assessment')"
          style="padding:13px 30px;background:var(--emerald);color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">Take the Assessment →</button>
      </div>
      <div style="font-size:13px;color:var(--ink-muted);text-align:center;margin-bottom:28px">
        No score yet? Here's the most common starting path for new users:
      </div>
    ` : `
      <div style="background:var(--emerald-pale);border:2px solid rgba(30,107,80,.2);border-radius:16px;padding:22px 26px;margin-bottom:28px;display:flex;align-items:center;gap:20px;flex-wrap:wrap">
        <div style="width:64px;height:64px;border-radius:50%;background:var(--emerald);color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;flex-shrink:0">${score}</div>
        <div style="flex:1;min-width:180px">
          <div style="font-size:16px;font-weight:800;margin-bottom:5px">Your Score: ${score} / 100</div>
          <div style="font-size:13.5px;color:var(--ink-soft);line-height:1.5">${rec.reason}</div>
        </div>
        <button onclick="navigate('assessment')"
          style="padding:9px 18px;background:#fff;color:var(--emerald);border:2px solid var(--emerald);border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;flex-shrink:0">Retake →</button>
      </div>
    `}

    <!-- Recommended path card -->
    <div style="background:#fff;border-radius:16px;overflow:hidden;border:2px solid ${col};box-shadow:0 4px 24px ${col}22;margin-bottom:28px">
      <div style="background:${col};padding:22px 26px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <div style="background:rgba(255,255,255,.18);border-radius:9px;padding:7px 14px;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#fff">${path.tag}</div>
        <div style="flex:1;min-width:160px">
          <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.65);font-weight:600;margin-bottom:3px">Recommended for You</div>
          <div style="font-size:19px;font-weight:800;color:#fff;line-height:1.2">${path.title}</div>
        </div>
        <div style="display:flex;gap:18px;font-size:13px;font-weight:700;color:rgba(255,255,255,.85);flex-shrink:0">
          <span>${path.lessons} lessons</span>
          <span>${path.templates} templates</span>
        </div>
      </div>
      <div style="padding:22px 26px">
        <p style="font-size:15px;color:var(--ink-soft);line-height:1.65;margin-bottom:18px">${path.desc}</p>
        <button onclick="navigate('learning-paths')"
          style="padding:11px 22px;background:${col};color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">View Full Learning Path →</button>
      </div>
    </div>

    <!-- First 3 lessons -->
    <div style="margin-bottom:28px">
      <div style="font-size:16px;font-weight:800;color:var(--ink);margin-bottom:14px">Start Here — Your First 3 Lessons</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${starters.map((l, i) => `
        <div onclick="openLessonPlayer(${l.id}, 0)"
          style="background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:16px 18px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:all .2s"
          onmouseover="this.style.borderColor='${col}';this.style.background='#f8fcff'"
          onmouseout="this.style.borderColor='var(--border)';this.style.background='#fff'">
          <div style="width:36px;height:36px;border-radius:50%;background:${col};color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;flex-shrink:0">${i+1}</div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:2px">${l.title}</div>
            <div style="font-size:12.5px;color:var(--ink-muted)">⏱ ${l.duration} &nbsp;·&nbsp; ${l.cat}</div>
          </div>
          <span style="font-size:20px;color:${col}">▶</span>
        </div>`).join('')}
      </div>
    </div>

    <!-- All 8 paths grid -->
    <div style="background:var(--paper);border-radius:14px;padding:22px 24px;border:1.5px solid var(--border)">
      <div style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:14px">Or choose a different path:</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px" class="all-paths-grid">
        ${PATHS.map(p => {
          const c2 = pathTagColors[p.id] || 'var(--sky)';
          const active = p.id === path.id;
          return `<div onclick="navigate('learning-paths')"
            style="padding:13px 15px;border:1.5px solid ${active ? c2 : 'var(--border)'};border-radius:10px;cursor:pointer;background:${active ? c2+'14' : '#fff'};transition:all .15s"
            onmouseover="this.style.borderColor='${c2}';this.style.background='${c2}14'"
            onmouseout="this.style.borderColor='${active ? c2 : 'var(--border)'}';this.style.background='${active ? c2+'14' : '#fff'}'">
            <div style="font-size:12px;font-weight:700;color:${c2};margin-bottom:3px">${p.tag}${active ? ' ⭐' : ''}</div>
            <div style="font-size:13px;font-weight:600;color:var(--ink);line-height:1.3">${p.title}</div>
            <div style="font-size:11.5px;color:var(--ink-muted);margin-top:3px">${p.lessons} lessons</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;

  const foot = document.getElementById('sh-path-footer');
  if (foot && !foot.dataset.r) { foot.innerHTML = renderFooter(); foot.dataset.r = '1'; }
}

// Legacy toggleCheck kept for any old references
function toggleCheck(el) {
  const circle = el.querySelector('.check-circle');
  const span   = el.querySelector('span');
  const on     = el.dataset.checked !== '1';
  el.dataset.checked       = on ? '1' : '0';
  el.style.background      = on ? 'var(--emerald-pale)' : '#fff';
  el.style.borderColor     = on ? 'var(--emerald)' : 'var(--border)';
  if (circle) {
    circle.style.background  = on ? 'var(--emerald)' : 'transparent';
    circle.style.borderColor = on ? 'var(--emerald)' : 'var(--border)';
    circle.innerHTML         = on ? '<span style="color:#fff;font-size:11px">✓</span>' : '';
  }
  if (span) {
    span.style.color           = on ? 'var(--emerald)' : 'var(--ink-soft)';
    span.style.textDecoration  = on ? 'line-through' : 'none';
  }
}

/* ══════════════════════════════════════════════════════
   LESSON PLAYER PAGE
══════════════════════════════════════════════════════ */

const CAP_META = [
  {icon:'🧭',color:'#1e6b50',short:'Readiness'},
  {icon:'💬',color:'#2a6b9b',short:'Messaging'},
  {icon:'📦',color:'#c4872a',short:'Packaging'},
  {icon:'🔍',color:'#1e6b50',short:'Prospecting'},
  {icon:'📈',color:'#2a6b9b',short:'Pipeline'},
  {icon:'🤝',color:'#c4872a',short:'Closing'},
  {icon:'📋',color:'#c05050',short:'Grants'},
  {icon:'🏢',color:'#2a6b9b',short:'Corporate'},
  {icon:'📱',color:'#1e6b50',short:'Digital'},
  {icon:'💌',color:'#c4872a',short:'Retention'},
];

// Per-lesson apply-now tasks
const APPLY_TASKS = {
  '0-0': 'Write your top 3 fundraising goals for the next 90 days. Be specific: amount, source, and timeline.',
  '0-1': 'List your top 2 funding channels and write one concrete action to activate each this month.',
  '0-2': 'Write a one-sentence ethical policy for how your team will handle donor data and conversations.',
  '0-3': 'Assign one fundraising responsibility to each team member. Write it down and share it with the team.',
  '0-4': 'Draft your 90-day plan: list 3 priorities for each 30-day block and review it with your director.',
  '1-0': 'Write your NGO one-liner: "We help [who] achieve [what] by [how]." Test it with a colleague.',
  '1-1': 'Draft the first paragraph of your one-pager. Describe the problem you solve in 3 sentences.',
  '1-2': 'Write 3 versions of your core message: one for a grant funder, one for a corporate, one for an individual.',
  '1-3': 'List 3 credibility proof points: one number, one testimonial, one award or recognition.',
  '1-4': 'Record yourself delivering your 30-second pitch. Time it. Refine until it feels natural.',
  '2-0': 'Pick one program. List its outputs (activities) and outcomes (changes). Are they clearly different?',
  '2-1': 'Write the one-line promise for your strongest program: who benefits, what changes, over how long.',
  '2-2': 'Calculate the unit cost for one program: total budget divided by number of beneficiaries.',
  '2-3': 'Design 3 funding tiers for one program: Bronze, Silver, Gold. What does each level fund?',
  '2-4': 'Build a draft Funding Pack Card: one page with your promise, outcomes, cost, and funding tiers.',
  '3-0': 'Write a profile of your ideal donor for each of your 2 priority funding channels.',
  '3-1': 'List 10 potential prospects using your existing network. Qualify them in the next step.',
  '3-2': 'Research one foundation that has funded similar work. Note their priorities and recent grants.',
  '3-3': 'Score your top 5 prospects: fit (1-3), capacity (1-3), relationship (1-3). Rank them by total.',
  '3-4': 'Block 30 minutes each week in your calendar just for prospect list-building. Protect that time.',
  '4-0': 'Set up your pipeline stages in a Google Sheet: Lead, Outreach, Meeting, Proposal, Decision, Won/Lost.',
  '4-1': 'Add every active prospect into your pipeline sheet with their current stage today.',
  '4-2': 'Schedule a 30-minute weekly pipeline review with your team. Make it a recurring calendar event.',
  '4-3': 'Review every prospect in your pipeline. Does each one have a next step and a date? Fix the ones that do not.',
  '4-4': 'Write one follow-up message template for each pipeline stage. Save them somewhere shared.',
  '5-0': 'Prepare a call plan for your next donor meeting: your objective, ask amount, and 3 key talking points.',
  '5-1': 'Write your ask statement: "I would like to invite you to support [program] with [amount], which will [impact]."',
  '5-2': 'Write your response to the 3 most common objections you hear. Practice them out loud with a colleague.',
  '5-3': 'After your next meeting, write a summary within 2 hours: what was agreed, next step, and date.',
  '5-4': 'Draft a 24-hour follow-up email for after your next donor meeting and save it as a reusable template.',
  '6-0': 'Apply the Go/No-Go matrix to your next 3 grant opportunities. Drop the ones that score below 6.',
  '6-1': 'Draft the executive summary of a 2-page concept note for your strongest program.',
  '6-2': 'Map the 10 sections of a full proposal against your last application. Identify the weakest 2 sections.',
  '6-3': 'Calculate your budget per output and per outcome for one program. Does the logic hold up?',
  '6-4': 'Define 3 M&E indicators for one program: baseline, target, and how you will measure each one.',
  '6-5': 'Create a compliance checklist for your current active grant. What must you report and when?',
  '7-0': 'Research 5 companies that have funded similar NGOs. What were their stated motivations?',
  '7-1': 'Draft a partnership menu with 3 tiers: what your NGO offers and what the partner receives in return.',
  '7-2': 'Write a 3-sentence corporate pitch that leads with business value, not charity.',
  '7-3': 'Plan your next corporate meeting: who attends, what you present, and exactly what you will ask for.',
  '7-4': 'Draft a 1-page partnership report template. What 5 metrics will you show corporate partners?',
  '8-0': 'Write your campaign hook in one sentence: the emotional idea that makes people stop and give.',
  '8-1': 'Review your donation page: does it load fast, have a clear ask, and show impact? List 3 improvements.',
  '8-2': 'Draft a 14-day content calendar: Day 1-3 tease, Day 4-7 launch, Day 8-12 push, Day 13-14 close.',
  '8-3': 'Write 3 WhatsApp messages: one to launch your campaign, one mid-campaign update, one final push.',
  '8-4': 'Define 5 metrics to track during your next campaign: visits, conversion rate, average gift, shares, total raised.',
  '9-0': 'Write a 48-hour thank-you template for your most common gift type. Personalize the first 2 lines.',
  '9-1': 'Draft your 30-day update message: one paragraph about impact since the donor gave.',
  '9-2': 'Plan your 60-day touchpoint: what valuable content will you share that is not just about your needs?',
  '9-3': 'Create a 1-page impact report template with 3 key metrics, one story, and one photo placeholder.',
  '9-4': 'Write a renewal ask for a donor whose gift expires in 30 days. Keep it under 150 words.',
};

// Sub-lessons per capability
const CAP_LESSONS = [
  [
    {title:'Why every NGO needs a fundraising plan — not just activities',dur:'4 min'},
    {title:'Setting your top 3 funding channels for the next 90 days',dur:'5 min'},
    {title:'Building simple governance and ethical safeguards',dur:'4 min'},
    {title:'Team roles: who does what in a 5-person fundraising team',dur:'3 min'},
    {title:'Writing your 90-Day Readiness Plan step by step',dur:'6 min'},
  ],
  [
    {title:'The 4 elements every case for support must have',dur:'5 min'},
    {title:'Writing your one-pager: structure, language, and flow',dur:'6 min'},
    {title:'Adapting your message for 3 different audiences',dur:'4 min'},
    {title:'Credibility proof points: numbers, testimonials, results',dur:'4 min'},
    {title:'Your 30-second and 60-second pitch scripts',dur:'5 min'},
  ],
  [
    {title:'The difference between activities and fundable outcomes',dur:'4 min'},
    {title:'Writing your program one-line promise',dur:'3 min'},
    {title:'Calculating your unit cost: cost per beneficiary',dur:'6 min'},
    {title:'Designing Bronze / Silver / Gold funding tiers',dur:'5 min'},
    {title:'Building your one-page Funding Pack Card',dur:'6 min'},
  ],
  [
    {title:'The three donor channels every NGO should prioritize',dur:'4 min'},
    {title:'Building your ideal donor profile for each channel',dur:'5 min'},
    {title:'How to research who funds who in your sector',dur:'5 min'},
    {title:'Scoring prospects: fit, capacity, and readiness',dur:'4 min'},
    {title:'Monthly list-building habits that compound over time',dur:'3 min'},
  ],
  [
    {title:'The 6 stages of a donor pipeline and why each matters',dur:'5 min'},
    {title:'Setting up your pipeline in a Google Sheet for free',dur:'6 min'},
    {title:'The weekly pipeline review: a 30-minute team ritual',dur:'4 min'},
    {title:'Always have a next step and date: the golden rule',dur:'3 min'},
    {title:'Follow-up cadence templates for each pipeline stage',dur:'5 min'},
  ],
  [
    {title:'The call plan: preparing for every donor meeting',dur:'4 min'},
    {title:'How to frame your ask: impact, amount, and options',dur:'5 min'},
    {title:'The 10 most common objections and how to respond',dur:'6 min'},
    {title:'Closing the conversation without awkwardness',dur:'4 min'},
    {title:'Post-meeting follow-up: the 24-hour window',dur:'3 min'},
  ],
  [
    {title:'The Go/No-Go decision: stop applying to the wrong grants',dur:'5 min'},
    {title:'Writing the 2-page concept note that gets shortlisted',dur:'6 min'},
    {title:'The 10-section full proposal structure explained',dur:'6 min'},
    {title:'Budget logic and unit cost in grant applications',dur:'5 min'},
    {title:'M&E basics: 3 indicators, a baseline, and a target',dur:'4 min'},
    {title:'Compliance after winning: what funders actually check',dur:'4 min'},
  ],
  [
    {title:'Mapping the right companies for your NGO mission',dur:'4 min'},
    {title:'Building a corporate partnership menu with tiers',dur:'5 min'},
    {title:'The corporate pitch: what companies actually want',dur:'5 min'},
    {title:'Running a corporate partnership meeting',dur:'4 min'},
    {title:'Reporting to corporate partners and renewing annually',dur:'4 min'},
  ],
  [
    {title:'The campaign hook: one idea that makes people give',dur:'4 min'},
    {title:'Optimising your donation page for conversion',dur:'5 min'},
    {title:'Planning 14 days of content: pre, launch, and close',dur:'6 min'},
    {title:'WhatsApp donor mobilisation scripts that work',dur:'4 min'},
    {title:'Tracking your campaign: 5 metrics that matter',dur:'3 min'},
  ],
  [
    {title:'The 48-hour thank-you system: what, when, and how',dur:'4 min'},
    {title:'The 30-day update: keeping new donors warm',dur:'3 min'},
    {title:'The 60-day check-in: turning donors into advocates',dur:'4 min'},
    {title:'The 90-day impact update: one page, real numbers',dur:'5 min'},
    {title:'Renewal asks: timing, framing, and scripts',dur:'5 min'},
  ],
];

// Rich lesson content: key concepts + numbered steps for each sub-lesson
// Keyed as "capIdx-subIdx"
const LESSON_CONTENT = {
  '0-0': {
    concepts: ['Fundraising without a plan means reacting instead of leading','A plan defines who you target, what you ask for, and when','Small NGOs need focus: 2-3 channels, not 10'],
    steps: ['Write your 90-day fundraising goal (one number, one deadline)','List every funding source you tried last year','Circle the top 2 that showed the most promise','Write one next action for each of those 2 channels','Share this with your team before the end of this week'],
  },
  '0-1': {
    concepts: ['Individual donors, institutional grants, and corporates each need a different approach','Most small NGOs spread too thin — concentration wins','Channel priority should match your team size and relationships'],
    steps: ['List every channel you currently use','Score each: effort (1-3) vs return (1-3)','Keep only the top 2 with the best return/effort ratio','Write a 30-day activation plan for each','Review monthly and adjust based on results'],
  },
  '0-2': {
    concepts: ['Governance builds donor confidence and prevents future problems','Ethical fundraising means honest reporting and respecting donor intent','Simple policies protect your organization and your beneficiaries'],
    steps: ['Draft a one-page donor policy: how funds are received, tracked, reported','Define restricted vs unrestricted funds for your team','Assign one person as the financial accountability lead','Write a simple conflict of interest statement','Review with your board or advisory committee'],
  },
  '0-3': {
    concepts: ['In small teams, everyone is a fundraiser — clarity about roles prevents gaps','The director sets the strategy; the team executes','A weekly routine makes fundraising consistent, not episodic'],
    steps: ['List your team members and their current responsibilities','Assign one fundraising task per person (outreach, writing, tracking, events)','Set a weekly 30-min team check-in on fundraising progress','Create a shared tracking doc everyone can update','Review roles every quarter as the team grows'],
  },
  '0-4': {
    concepts: ['A 90-day plan is short enough to act on, long enough to see results','Breaking it into 3 blocks (30/60/90) prevents overwhelm','The plan should have activities, targets, and owners'],
    steps: ['Open a blank doc or spreadsheet','Write 3 priorities for Days 1-30 (foundation building)','Write 3 priorities for Days 31-60 (outreach and proposals)','Write 3 priorities for Days 61-90 (follow-up and closing)','Assign each priority to a person with a deadline'],
  },
  '1-0': {
    concepts: ['Donors give to clarity, not complexity','Your case for support answers 4 questions: What problem? What solution? What proof? What ask?','Every word that confuses a reader loses a donor'],
    steps: ['Write the problem in one sentence without jargon','Write your solution in one sentence (what you do, for whom, how)','Add 3 proof points (a number, a story, a result)','Write the ask: what you need and what it will achieve','Read it aloud — if you hesitate, rewrite that part'],
  },
  '1-1': {
    concepts: ['A one-pager is not a brochure — it is a decision tool','Good structure: headline, problem, solution, proof, ask, contact','White space and short sentences increase readability by 40%'],
    steps: ['Write a headline that states the transformation you create','Draft the problem paragraph (2-3 sentences max)','Draft the solution paragraph (what you do, for whom)','Add a proof block: 3 numbers or a beneficiary quote','End with a clear ask and your contact details'],
  },
  '1-2': {
    concepts: ['Grant funders want impact and accountability','Corporate donors want brand alignment and visibility','Individual donors want emotional connection and trust'],
    steps: ['Take your core message and rewrite it for a grant funder (outcomes, budget, M&E)','Rewrite it for a corporate partner (their brand, CSR goals, employee impact)','Rewrite it for an individual donor (story, emotion, personal connection)','Test each version with someone from that audience','Refine based on what resonates most'],
  },
  '1-3': {
    concepts: ['Credibility is built before the ask','Numbers show scale; stories show humanity; awards show validation','One strong proof point is worth more than ten weak ones'],
    steps: ['List 5 numbers that show your impact (people reached, outcomes achieved)','Write 2 beneficiary quotes that show transformation','List any awards, partnerships, or media mentions','Pick your single strongest proof point and lead with it','Update your proof points every 6 months with new data'],
  },
  '1-4': {
    concepts: ['A pitch script prevents rambling under pressure','30 seconds is enough to create curiosity; 60 seconds is enough to make the ask','Practice until it sounds natural, not rehearsed'],
    steps: ['Write a 30-second version: who you are, what problem you solve, what you need','Write a 60-second version: add one proof point and a specific ask','Record yourself on your phone and watch it back','Identify the 2 weakest moments and rewrite those parts','Practice with 3 different people and get feedback'],
  },
  '2-0': {
    concepts: ['Outputs are what you do; outcomes are what changes because of what you do','Funders increasingly fund outcomes, not activities','The ability to articulate outcomes is what separates fundable NGOs from the rest'],
    steps: ['List every activity in your main program','For each activity, ask: what changes because of this?','Write the answer as an outcome (e.g., "youth gain employable skills")','Check: is the outcome measurable? If not, add a measurable indicator','Practice explaining the output-outcome chain to a colleague in 60 seconds'],
  },
  '2-1': {
    concepts: ['A one-line promise removes ambiguity for funders','Format: "We help [who] [achieve what] in [how long] through [how]"','The more specific the promise, the more credible and fundable it becomes'],
    steps: ['Identify your primary beneficiary group','Write what changes for them (the outcome)','Add the timeframe (e.g., 6 months, 1 year)','Add the mechanism (how you achieve it)','Test the line with 3 people: do they immediately understand it?'],
  },
  '2-2': {
    concepts: ['Unit cost is the single most powerful number in any proposal','It makes your funding ask logical and auditable','Funders can scale: if $500 trains 1 person, $50,000 trains 100'],
    steps: ['List all program costs: staff time, materials, overhead allocation','Divide total cost by number of beneficiaries served','Round to a clean number and add a 10% contingency','Create a simple unit cost table (input, cost, output, unit cost)','Use this number in all proposals and donor conversations'],
  },
  '2-3': {
    concepts: ['Funding tiers let donors choose their level of impact','Bronze/Silver/Gold removes the "how much should I give?" hesitation','Tiers should be meaningful, not arbitrary — each unlocks something specific'],
    steps: ['Choose 3 funding levels based on your unit cost (e.g., $500, $2,000, $10,000)','Name what each level funds (1 beneficiary, 4 beneficiaries, 20 beneficiaries)','Write the outcome for each tier in one sentence','Add a named recognition for each tier (optional but powerful)','Test the tiers with one trusted donor before publishing'],
  },
  '2-4': {
    concepts: ['A Funding Pack Card is a one-page visual summary of your program','It replaces 10-page documents in early-stage donor conversations','Great pack cards have: promise, outcomes, unit cost, tiers, and a contact'],
    steps: ['Use a one-page template (landscape or portrait)','Add your program name and one-line promise at the top','Add a 2-column section: What We Do | What Changes','Add your funding tiers with clear labels and amounts','Add your logo, contact, and a QR code to your website'],
  },
  '3-0': {
    concepts: ['An ideal donor profile stops you wasting time on wrong prospects','Different channels have different ideal profiles','A clear profile makes your prospecting 3x more efficient'],
    steps: ['Choose one funding channel (individual, corporate, or foundation)','Write the 5 characteristics of your ideal donor for that channel','Add: typical gift size, giving motivation, preferred communication','Find 3 real examples of donors who match this profile','Repeat for your second priority channel'],
  },
  '3-1': {
    concepts: ['Your warm network is 10x more likely to give than cold outreach','"Who funded who" research reveals hidden opportunities','A 20-name list built in 1 week is better than a 200-name list built never'],
    steps: ['Open a spreadsheet with columns: Name, Type, Connection, Estimated Capacity, Status','List 10 names from your existing network','Search "who funded [similar NGO in your city]" online and add 5 foundations','Check LinkedIn for corporate CSR managers in your sector and add 5','You now have 20 prospects — start qualifying them'],
  },
  '3-2': {
    concepts: ['Foundations publish their funded projects — this is your roadmap','Looking at past grants tells you fit, average grant size, and priorities','Applications without research have a 90% failure rate'],
    steps: ['Choose one foundation you want to approach','Find their website and download their annual report or grant list','Note: their priority areas, geographic focus, average grant size','Check if they have funded NGOs similar to yours in the last 3 years','Write 2-3 sentences on why you are a good fit before contacting them'],
  },
  '3-3': {
    concepts: ['Not all prospects deserve equal attention — scoring prioritizes your effort','Three dimensions: fit (alignment), capacity (can they give?), relationship (do they know you?)','A score of 7+ out of 9 is a high-priority prospect'],
    steps: ['Take your 20 prospects from the last lesson','Score each one: Fit 1-3, Capacity 1-3, Relationship 1-3','Add the scores to get a total out of 9','Sort by total score — focus on 7+ first','Review and update scores monthly as relationships develop'],
  },
  '3-4': {
    concepts: ['Prospect list-building is a habit, not a project','30 minutes per week compounds into 100+ new leads per year','Systematic habits beat occasional bursts of effort every time'],
    steps: ['Block 30 minutes every Monday for prospect research','Set a weekly goal: add 3 new qualified prospects','Use a rotating focus: Week 1 foundations, Week 2 corporates, Week 3 individuals','Review and clean your list at the end of each month','Celebrate milestones: 50 prospects, 100 prospects'],
  },
  '4-0': {
    concepts: ['A pipeline is a map of where every donor relationship stands','Without a pipeline, follow-up is random and gifts fall through the cracks','Six stages cover every relationship from stranger to committed donor'],
    steps: ['Open a Google Sheet and create 6 columns: Lead, Outreach, Meeting, Proposal, Decision, Won/Lost','Add a row for each active prospect you identified in the prospecting lessons','Move each prospect to their current stage','Add columns: Next Step, Next Step Date, Assigned To','Share the sheet with your team and review it together once'],
  },
  '4-1': {
    concepts: ['A pipeline only works if every prospect is in it','Incomplete data creates blind spots — you miss follow-ups and lose gifts','Good data hygiene takes 10 minutes per week, not hours'],
    steps: ['Open your pipeline sheet','Add every prospect you have ever contacted in the last 12 months','Fill in their current stage honestly — even if it is "unknown"','Add the last action you took and the date','Identify any prospects with no activity in 90+ days and decide: re-engage or drop?'],
  },
  '4-2': {
    concepts: ['A weekly review turns your pipeline from a record into a decision tool','30 minutes is enough to review, prioritize, and assign next steps','Consistency is more valuable than perfection'],
    steps: ['Set a recurring Monday or Tuesday morning calendar block: 30 minutes','Agenda: (1) Review Won/Lost from last week (2) Update stages (3) Assign next steps','Focus the most time on proposals and decisions — those are your hottest opportunities','End each review with 3 concrete actions and their owners','After 4 weeks, adjust the agenda based on what your team finds most useful'],
  },
  '4-3': {
    concepts: ['"Next step + date" is the single discipline that prevents pipeline stagnation','A donor relationship without a next step is dead','The next step can be small: send an email, share a report, schedule a call'],
    steps: ['Open your pipeline and find every prospect with no next step filled in','For each one, write ONE action you will take and a realistic date','Choose actions based on the stage: Lead = outreach, Meeting = send materials, Proposal = follow up','Set a phone reminder for each action','After 2 weeks, review: how many did you complete? What got in the way?'],
  },
  '4-4': {
    concepts: ['Templates remove the blank-page problem from follow-up','A good template is 80% written — you just personalize the remaining 20%','Templates should feel personal, not automated'],
    steps: ['Open a doc and create one section per pipeline stage','Write a follow-up template for each stage (6 templates total)','Each template should: open with context, add value, state the next step','Save them in a shared folder your team can access','Update the templates every 6 months based on what gets replies'],
  },
  '5-0': {
    concepts: ['Preparation is what makes an ask feel natural instead of awkward','A call plan takes 10 minutes and saves you from stumbling mid-conversation','Know your objective, your ask, and your top 3 talking points before every meeting'],
    steps: ['Before every donor meeting, open a blank doc','Write: (1) Meeting objective (2) Ask amount and what it funds (3) Three key talking points','Anticipate 2 objections and write your responses','Decide: what is the ONE thing you want them to agree to by the end?','Read your call plan 10 minutes before the meeting'],
  },
  '5-1': {
    concepts: ['The ask is the most avoided moment in fundraising — preparation removes the avoidance','A good ask is specific: amount + impact + timeline','Offering 2 options (not 3) reduces decision paralysis'],
    steps: ['Write your ask in one sentence: "I would like to invite you to support [program] with [amount] which will [specific impact]"','Write an alternative ask at 50% of the first amount','Practice both asks out loud 5 times until they sound natural','Add a pause after the ask — do not fill the silence','Write down what you will say if they say yes, no, or maybe'],
  },
  '5-2': {
    concepts: ['Objections are not rejections — they are requests for more information','The most common objections are predictable and therefore preparable','Handling objections well builds trust, not pressure'],
    steps: ['List the 5 objections you hear most often ("we already gave", "budget is tight", "send more info")','For each, write a response that acknowledges, adds information, and redirects','Practice each response out loud with a colleague playing the donor','Do not argue — validate and pivot: "That makes sense. Many donors feel that way initially..."','Keep your objection sheet in your pipeline document for reference'],
  },
  '5-3': {
    concepts: ['What is agreed verbally disappears within 24 hours without a record','A post-meeting summary is also a relationship tool — it shows professionalism','The best follow-up arrives within 24 hours, not 5 days'],
    steps: ['Within 2 hours of every meeting, open a doc and write: what was discussed, what was agreed, next step, next step date','Send this as a brief email to the donor: "Thank you for today. Here is a quick summary…"','Cc yourself and file it in your donor record','Set a calendar reminder for the agreed next step date','If no next step was agreed, set a reminder to follow up in 7 days'],
  },
  '5-4': {
    concepts: ['The 24-hour window is when the donor is most emotionally engaged','A follow-up that arrives a week late is a missed opportunity','Your follow-up should add value, not just say thank you'],
    steps: ['Write a post-meeting follow-up template with 5 sections: thank you, summary of key points, relevant resource, next step, warm close','Personalize the first and last lines for each donor','Attach one relevant document (one-pager, proposal summary, or impact report)','Send within 24 hours — set a phone alarm if needed','Track opens if possible (use a free tool like Streak for Gmail)'],
  },
  '6-0': {
    concepts: ['Applying to every grant wastes time and erodes your team morale','A Go/No-Go decision should take 15 minutes, not days','The decision is based on fit, capacity, and odds — not hope'],
    steps: ['Build a simple matrix: Fit (1-5), Capacity to deliver (1-5), Relationship (1-5), Strategic value (1-5)','Score each grant opportunity you are considering','Set a threshold: apply only if total score is 12+ out of 20','For anything below 12, note why and move on without guilt','Review your decision criteria every 6 months'],
  },
  '6-1': {
    concepts: ['A 2-page concept note is your first impression with most institutional funders','It should answer: who are you, what problem do you solve, what are you asking for, and why can you deliver?','Funders read 50+ concept notes per week — clarity wins'],
    steps: ['Section 1 (1 paragraph): Who you are and your track record','Section 2 (1 paragraph): The problem you address with data','Section 3 (1 paragraph): Your proposed solution and approach','Section 4 (1 paragraph): Expected outcomes and how you will measure them','Section 5 (1 paragraph): Budget overview and funding ask'],
  },
  '6-2': {
    concepts: ['Most funders follow a standard 10-section structure','Knowing the structure lets you write faster and more strategically','The weakest sections in most NGO proposals are M&E and sustainability'],
    steps: ['Cover page with project title, organization, dates, and budget','Executive summary (half page)','Problem statement with data','Project objectives (SMART)','Activities and timeline (Gantt-style)','Budget with narrative','M&E framework','Organizational capacity and team','Risk management','Sustainability plan — how will this continue after the grant?'],
  },
  '6-3': {
    concepts: ['Budget logic means every line item can be explained and justified','Unit costs make your budget defensible and scalable','Indirect costs (overhead) should be included transparently'],
    steps: ['List all direct costs: staff, materials, transport, events','Calculate each as: unit cost × number of units','Add indirect costs as a percentage of direct costs (typically 10-20%)','Create a budget narrative: 2-3 sentences per major line explaining the cost','Check: does your total budget match your ask? Is every line justifiable?'],
  },
  '6-4': {
    concepts: ['M&E tells funders how you will know if the project worked','Three indicators (output, outcome, impact) are enough for most small grants','A baseline is the starting point — without it, you cannot prove change'],
    steps: ['Choose 1 output indicator (e.g., number of youth trained)','Choose 1 outcome indicator (e.g., % who gain employment within 6 months)','Choose 1 impact indicator (e.g., change in household income)','For each: write the baseline, target, data source, and collection method','Build a simple M&E table and include it in every proposal'],
  },
  '6-5': {
    concepts: ['Compliance is what keeps funders coming back — non-compliance ends relationships','Most compliance failures are due to poor tracking, not bad intent','A compliance checklist turns a complex obligation into a simple routine'],
    steps: ['Read your grant agreement and highlight every requirement (reports, audits, approvals needed)','Create a compliance calendar: list every deadline with a 2-week advance reminder','Assign one person to own each compliance item','Set up a simple filing system for all grant documents','After each reporting period, debrief: what was hard? Improve the system'],
  },
  '7-0': {
    concepts: ['The right corporate partner is one where your mission and their CSR goals overlap','Sector alignment makes the partnership case write itself','Research prevents you from approaching companies that will never say yes'],
    steps: ['List 10 companies operating in your geography or sector','For each, search their website for a CSR, sustainability, or community investment page','Note: their priority areas, past NGO partners, and any employee volunteering programs','Score each: fit (1-3), employee volunteering potential (1-3), brand alignment (1-3)','Shortlist the top 5 and research each one in depth before making contact'],
  },
  '7-1': {
    concepts: ['A partnership menu makes it easy for corporates to say yes at any budget level','Good menus show what the company gets, not just what the NGO needs','Deliverables must be specific, measurable, and realistic for your team to deliver'],
    steps: ['Design 3 tiers: Bronze ($5,000), Silver ($15,000), Gold ($50,000) — adjust to your market','For each tier, list: what you will deliver, what they will receive (logo, reports, employee engagement)','Write a one-sentence headline for each tier that emphasizes business value','Add a "Build Your Own" option for companies with specific needs','Design it as a one-page visual — presentation matters as much as content'],
  },
  '7-2': {
    concepts: ['Corporates are not donors — they are partners looking for value exchange','The pitch must start with their problem, not yours','Speed matters: if you cannot pitch in 90 seconds, you will lose the room'],
    steps: ['Research your top 3 corporate prospects before writing a single word','Identify their CSR priority area (environment, youth, health, education)','Write a 3-sentence pitch: (1) their problem (2) how your NGO addresses it (3) what the partnership looks like','Practice in front of a mirror until it feels like a conversation, not a presentation','Test the pitch with a trusted contact from the business community'],
  },
  '7-3': {
    concepts: ['A corporate meeting is a business meeting — preparation signals professionalism','Bring a partnership menu and a one-pager — leave behind something tangible','The goal of the first meeting is a second meeting, not a signed contract'],
    steps: ['Research who you are meeting: their role, their company recent news, their CSR portfolio','Prepare a short presentation (5 slides maximum): NGO overview, problem, solution, partnership options, next steps','Bring printed copies of your partnership menu and your one-pager','Open with a question about their CSR priorities, not a presentation about your NGO','End with a clear next step: send proposal, schedule follow-up, or connect with their CSR team'],
  },
  '7-4': {
    concepts: ['A good report makes renewal easy — it answers "did this partnership deliver?"','Corporate partners want data, visibility, and stories — not just text','Deliver the report 2 weeks before the renewal conversation, not after'],
    steps: ['Template section 1: Cover page with both logos and the period covered','Section 2: 3 impact numbers (beneficiaries reached, outcomes achieved, partnership value)','Section 3: One story with a photo and a quote','Section 4: What your NGO delivered (visibility, events, content created)','Section 5: Proposed renewal options and next steps'],
  },
  '8-0': {
    concepts: ['A campaign hook is the single emotional idea that makes someone stop scrolling','Good hooks are specific, visual, and human — not generic','The hook comes before any description of your NGO or program'],
    steps: ['Identify the one change you are creating that is most visually compelling','Write 5 possible hooks — do not edit yet, just generate','Test each with the question: "Would I stop scrolling for this?"','Choose the strongest and rewrite it in under 10 words','Build your entire campaign around this one hook — one message, many formats'],
  },
  '8-1': {
    concepts: ['Most NGO donation pages lose 70% of visitors before they give','The three conversion killers: slow loading, unclear ask, no social proof','A high-converting page has one job: make the donation as easy as possible'],
    steps: ['Open your donation page on your phone — does it load in under 3 seconds?','Check: is the ask (amount, impact) visible without scrolling?','Add one testimonial or photo that shows transformation','Add 3 giving amounts with impact labels (e.g., "$50 = one month of school supplies")','Remove any navigation links that lead people off the page'],
  },
  '8-2': {
    concepts: ['A 14-day calendar prevents panic-posting and ensures strategic momentum','Pre-launch content builds anticipation; post-launch content builds urgency','Consistency matters more than perfection — one post per day beats silence'],
    steps: ['Days 1-3: Tease content (photos, questions, stories that hint at the campaign)','Days 4-7: Launch content (campaign announcement, goal, specific ask, hook video)','Days 8-12: Momentum content (updates, donor shoutouts, impact numbers, beneficiary stories)','Days 13-14: Urgency content (countdown, last chance, personal message from the director)','Schedule posts in advance using a free tool (Buffer or Meta Business Suite)'],
  },
  '8-3': {
    concepts: ['WhatsApp has 5x higher open rates than email','Direct messages feel personal — make every message feel like it was written for one person','Three messages per campaign is the ideal cadence — more feels like spam'],
    steps: ['Draft Message 1 (Day 4, launch): "Hi [name], we just launched our campaign…" — keep under 80 words','Draft Message 2 (Day 8, update): "Quick update — we are 40% of the way there…" — add one story','Draft Message 3 (Day 13, final push): "Just 2 days left…" — create urgency with a specific number needed','Add a direct donation link in every message','Test all 3 messages with your team before sending to your donor list'],
  },
  '8-4': {
    concepts: ['What you measure is what you improve','Five metrics give you a complete picture of campaign health','Track daily during the campaign, not just at the end'],
    steps: ['Set up a simple daily tracking sheet with 5 columns','Metric 1: Unique visitors to your donation page (from Google Analytics or similar)','Metric 2: Conversion rate (donations ÷ visitors × 100)','Metric 3: Average gift size (total raised ÷ number of donors)','Metric 4: Social shares and WhatsApp forwards','Metric 5: Total raised vs. goal (% to target)'],
  },
  '9-0': {
    concepts: ['The 48-hour window is when donor enthusiasm is highest','A thank-you that arrives 2 weeks late is worse than one that never arrives','Great thank-yous are specific, personal, and about the donor — not about you'],
    steps: ['Write a thank-you template for each gift tier (first-time, recurring, major)','Personalize: use the donor name, the specific amount, and the specific impact','Send within 48 hours — set a daily reminder to check for new donations','For major gifts, follow up with a phone call within 72 hours','Track thank-yous in your pipeline so nothing falls through the cracks'],
  },
  '9-1': {
    concepts: ['The 30-day update keeps the donor emotionally connected to their impact','It should feel like a personal letter, not a newsletter','One story, one number, one personal touch is all you need'],
    steps: ['Write a 150-word update template that opens with a specific story','Add one impact number that has changed since their donation','Add a personal line from the director or program staff','Close with a soft ask: "Would you like to stay updated? Reply and let us know"','Send on Day 28-32 after their first gift'],
  },
  '9-2': {
    concepts: ['The 60-day check-in should add value, not just ask for more','Sharing a resource, an article, or an exclusive update builds trust','This touchpoint turns a one-time donor into a long-term supporter'],
    steps: ['Identify one valuable resource you can share (a report, an event invite, a behind-the-scenes update)','Write a 100-word message that opens with the resource, not an ask','Make it feel exclusive: "I wanted to share this with our closest supporters first…"','Ask one question to deepen engagement: "What impact area matters most to you?"','Use the replies to personalize future communications'],
  },
  '9-3': {
    concepts: ['One-page impact reports are read; 20-page reports are filed','Visual reports with real photos and real numbers build credibility fast','A good impact report is also a fundraising tool — donors share it'],
    steps: ['Choose a one-page template (landscape works best for impact reports)','Add 3 headline numbers: beneficiaries, outcomes, efficiency metric','Add one story with a real name (with permission) and one photo','Add a quote from a beneficiary or community member','End with a "what your support made possible" section and a soft ask'],
  },
  '9-4': {
    concepts: ['Renewal asks should feel like a natural conversation, not a sales call','The best time to ask for renewal is before the previous gift expires, not after','A well-timed renewal ask has a 3x higher success rate than a cold ask'],
    steps: ['Set a reminder 30 days before each donor gift anniversary or grant end date','Review what you have shared with them in the past 90 days — did you provide value?','Write a renewal message that opens with impact, not the ask','State the ask clearly: "Would you consider renewing your support with [amount] for [specific outcome]?"','Offer a call to discuss — many donors renew after a personal conversation'],
  },
};

let activeLessonId   = 1;   // which LESSONS entry is open
let activeSubIdx     = 0;   // which sub-lesson within that cap

// Learning-path context: set when a lesson is opened from a path
// { pathId, moduleIdx }  — null when opened standalone
let _lpContext = null;

// Real YouTube video IDs — each cap×sub gets a unique video
// Using TED, Khan Academy, and public nonprofit/edu videos
const VIDEO_POOL = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
];
// Get video for a specific lesson×sub
function getVid(lessonId, subIdx) {
  const base = (lessonId - 1) * 6;
  return VIDEO_POOL[(base + subIdx) % VIDEO_POOL.length];
}
// Helper: detect if a video source is mp4 (not YouTube)
function isMP4(src) { return src && src.endsWith('.mp4'); }

function openLessonPlayer(lessonId, subIdx, lpContext) {
  activeLessonId = lessonId;
  activeSubIdx   = subIdx || 0;
  if (lpContext !== undefined) _lpContext = lpContext; // null clears context; undefined preserves it
  navigate('lesson-player');
}

/* ═══════════════════════════════════════════════
   DOCUMENT GENERATION — PDF & WORD DOWNLOAD
═══════════════════════════════════════════════ */

// Build rich structured content per template type
function getTemplateData(docName, lessonTitle) {
  const date = new Date().toLocaleDateString('en-GB', {year:'numeric',month:'long',day:'numeric'});
  const safe = docName.trim();

  const templates = {
    // ─── TOOL 1 ───
    'Readiness Checklist + 90-Day Plan': {
      subtitle: 'NGO Fundraising Readiness Assessment & 90-Day Action Plan',
      sections: [
        { heading: 'ORGANISATION DETAILS', rows: [
          ['Organisation Name', '______________________________'],
          ['Completed By', '______________________________'],
          ['Date', date],
          ['Review Date', '______________________________'],
        ]},
        { heading: 'DIMENSION 1 — ORGANISATIONAL READINESS', rows: [
          ['Mission and theory of change documented?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Registered legal entity with valid status?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Financial management system in place?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['At least one year of audited accounts?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Dedicated fundraising staff or lead?', '☐ Yes  ☐ No  ☐ In Progress'],
        ]},
        { heading: 'DIMENSION 2 — MESSAGING & CASE FOR SUPPORT', rows: [
          ['Written case for support (1-page) exists?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Programmes described with outcomes and unit costs?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['60-second elevator pitch practised by team?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Funder-specific messaging versions prepared?', '☐ Yes  ☐ No  ☐ In Progress'],
        ]},
        { heading: 'DIMENSION 3 — DONOR PIPELINE', rows: [
          ['Prospect list of 20+ individuals / corporates / foundations?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Pipeline tracker with stages and follow-up dates?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Weekly pipeline review routine established?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Ask strategy prepared for top 5 prospects?', '☐ Yes  ☐ No  ☐ In Progress'],
        ]},
        { heading: 'DIMENSION 4 — GRANT READINESS', rows: [
          ['Grant tracking spreadsheet with deadlines maintained?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['2-page and 10-page proposal templates ready?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Budget templates with unit costs prepared?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Go/No-Go decision process defined?', '☐ Yes  ☐ No  ☐ In Progress'],
        ]},
        { heading: 'DIMENSION 5 — DIGITAL & RETENTION', rows: [
          ['Email/WhatsApp list of 100+ supporters?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['48-hour thank-you process documented?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['90-day donor journey plan written?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Monthly impact update sent to donors?', '☐ Yes  ☐ No  ☐ In Progress'],
        ]},
        { heading: 'SCORING GUIDE', rows: [
          ['18–20 Yes', 'Fully Fundraising Ready — Scale now'],
          ['13–17 Yes', 'Nearly Ready — Fix remaining gaps this month'],
          ['8–12 Yes', 'Building Foundation — Use this as your roadmap'],
          ['0–7 Yes', 'Early Stage — Focus on organisational basics first'],
          ['YOUR SCORE', '_____ / 20'],
        ]},
        { heading: '90-DAY ACTION PLAN', rows: [
          ['Days 1–30 Focus', '______________________________'],
          ['Days 31–60 Focus', '______________________________'],
          ['Days 61–90 Focus', '______________________________'],
          ['90-Day Fundraising Target ($)', '______________________________'],
          ['Primary Funding Channel', '______________________________'],
        ]},
      ]
    },

    // ─── TOOL 2 ───
    'One-Pager & Case for Support Kit': {
      subtitle: 'NGO One-Page Case for Support Template',
      sections: [
        { heading: 'ORGANISATION OVERVIEW', rows: [
          ['Organisation Name', '______________________________'],
          ['Founded / Year Operating', '______________________________'],
          ['Geographic Focus', '______________________________'],
          ['Primary Beneficiaries', '______________________________'],
          ['Annual Budget (approx.)', '$____________________________'],
        ]},
        { heading: 'THE PROBLEM WE SOLVE', rows: [
          ['Problem Statement (1–2 sentences)', '______________________________'],
          ['Scale of the problem (data/statistic)', '______________________________'],
          ['Who is most affected?', '______________________________'],
          ['Why this problem is urgent now', '______________________________'],
        ]},
        { heading: 'OUR SOLUTION', rows: [
          ['What we do (1 sentence)', '______________________________'],
          ['How it works (3 key steps)', '1. ___  2. ___  3. ___'],
          ['What makes our approach unique?', '______________________________'],
          ['Geographic reach / communities served', '______________________________'],
        ]},
        { heading: 'PROVEN IMPACT (LAST 12 MONTHS)', rows: [
          ['Beneficiaries Reached', '______________________________'],
          ['Key Outcome 1 (with %)','______________________________'],
          ['Key Outcome 2 (with %)','______________________________'],
          ['Key Outcome 3 (with %)','______________________________'],
          ['Testimonial or story snippet', '______________________________'],
        ]},
        { heading: 'WHAT YOUR FUNDING ACHIEVES', rows: [
          ['$500 provides...', '______________________________'],
          ['$1,000 provides...', '______________________________'],
          ['$5,000 provides...', '______________________________'],
          ['$10,000 provides...', '______________________________'],
          ['Custom amount', '______________________________'],
        ]},
        { heading: 'CALL TO ACTION', rows: [
          ['Specific ask / request', '______________________________'],
          ['Contact person + email', '______________________________'],
          ['Website / donation link', '______________________________'],
          ['Registered charity number', '______________________________'],
        ]},
      ]
    },

    // ─── TOOL 3 ───
    'Program Packaging "Funding Pack" Kit': {
      subtitle: 'NGO Programme Packaging — Funder-Ready Offer Template',
      sections: [
        { heading: 'PROGRAMME OVERVIEW', rows: [
          ['Programme Name', '______________________________'],
          ['Sector / Theme', '______________________________'],
          ['Target Beneficiaries', '______________________________'],
          ['Geographic Area', '______________________________'],
          ['Programme Duration', '______________________________'],
        ]},
        { heading: 'PROBLEM & SOLUTION', rows: [
          ['Problem this programme addresses', '______________________________'],
          ['Our solution (1–2 sentences)', '______________________________'],
          ['Theory of change summary', '______________________________'],
          ['Evidence base / proven approach?', '______________________________'],
        ]},
        { heading: 'BRONZE TIER — ENTRY FUNDING PACKAGE', rows: [
          ['Funding Amount', '$____________________________'],
          ['Number of Beneficiaries', '______________________________'],
          ['Key Activities Included', '______________________________'],
          ['Primary Outcome Delivered', '______________________________'],
          ['Funder Recognition', 'Logo on website, thank-you letter'],
        ]},
        { heading: 'SILVER TIER — CORE FUNDING PACKAGE', rows: [
          ['Funding Amount', '$____________________________'],
          ['Number of Beneficiaries', '______________________________'],
          ['Key Activities Included', '______________________________'],
          ['Primary Outcomes Delivered', '______________________________'],
          ['Funder Recognition', 'Report, site visit, co-branding'],
        ]},
        { heading: 'GOLD TIER — FLAGSHIP FUNDING PACKAGE', rows: [
          ['Funding Amount', '$____________________________'],
          ['Number of Beneficiaries', '______________________________'],
          ['Key Activities Included', '______________________________'],
          ['Primary Outcomes Delivered', '______________________________'],
          ['Funder Recognition', 'Named partnership, board briefing, full report'],
        ]},
        { heading: 'UNIT COSTS & BUDGET LOGIC', rows: [
          ['Cost per Beneficiary', '$____________________________'],
          ['Cost per Outcome Unit', '$____________________________'],
          ['Staff Costs (% of budget)', '______%'],
          ['Direct Programme Costs (%)', '______%'],
          ['Overhead / Admin (%)', '______%'],
        ]},
      ]
    },

    // ─── TOOL 4 ───
    'Donor Pipeline Tracker (Google Sheet)': {
      subtitle: 'Donor Pipeline — Prospect Tracking Template',
      sections: [
        { heading: 'HOW TO USE THIS TRACKER', rows: [
          ['Update frequency', 'Every week — ideally at your Monday review'],
          ['Stage definitions', 'Identified > Researched > Contacted > Meeting > Proposal > Decision'],
          ['Follow-up rule', 'Every open conversation gets a next-step within 7 days'],
          ['Review trigger', 'Move to "Closed Lost" if no response after 3 attempts'],
        ]},
        { heading: 'PROSPECT COLUMNS (one row per prospect)', rows: [
          ['Prospect Name', '______________________________'],
          ['Type', '☐ Individual  ☐ Corporate  ☐ Foundation  ☐ Government'],
          ['Estimated Gift Size', '$____________________________'],
          ['Stage', '☐ Identified  ☐ Researched  ☐ Contacted  ☐ Meeting  ☐ Proposal  ☐ Decision'],
          ['Relationship Owner', '______________________________'],
          ['Last Contact Date', '______________________________'],
          ['Next Step', '______________________________'],
          ['Next Step Due Date', '______________________________'],
          ['Probability (%)', '______%'],
          ['Notes', '______________________________'],
        ]},
        { heading: 'PIPELINE STAGE DEFINITIONS', rows: [
          ['1. Identified', 'Name on list, not yet researched'],
          ['2. Researched', 'Background checked, giving capacity estimated'],
          ['3. Contacted', 'First outreach made, awaiting response'],
          ['4. Meeting', 'Meeting scheduled or completed'],
          ['5. Proposal', 'Formal proposal or ask submitted'],
          ['6. Decision', 'Gift received or declined — record outcome'],
        ]},
        { heading: 'WEEKLY PIPELINE REVIEW CHECKLIST', rows: [
          ['How many new prospects added this week?', '______'],
          ['How many follow-ups completed?', '______'],
          ['How many moved to next stage?', '______'],
          ['Total pipeline value this week', '$____________________________'],
          ['Top 3 priorities for next week', '1. ___  2. ___  3. ___'],
        ]},
      ]
    },

    // ─── TOOL 5 ───
    'Ask Script + Objection Handling Sheet': {
      subtitle: 'Donor Ask Script and Objection Response Guide',
      sections: [
        { heading: 'PRE-MEETING PREPARATION', rows: [
          ['Donor Name', '______________________________'],
          ['Meeting Date / Format', '______________________________'],
          ['Relationship history', '______________________________'],
          ['Estimated giving capacity', '$____________________________'],
          ['Planned ask amount', '$____________________________'],
          ['Connection to your cause', '______________________________'],
        ]},
        { heading: 'THE ASK FRAMEWORK (5-STEP SCRIPT)', rows: [
          ['Step 1 — APPRECIATE', 'Thank them and acknowledge the relationship (30 sec)'],
          ['Step 2 — CONTEXT', 'Share 1 compelling fact about the problem you solve (60 sec)'],
          ['Step 3 — IMPACT', 'Tell one specific story of change (60–90 sec)'],
          ['Step 4 — THE ASK', '"Would you consider a gift of $_____ to help us [specific outcome]?"'],
          ['Step 5 — SILENCE', 'Stop talking. Let them respond. Do not fill the silence.'],
        ]},
        { heading: 'COMMON OBJECTIONS & RESPONSES', rows: [
          ['"I need to think about it."', '"Of course. Can I follow up with you by [date]?"'],
          ['"I already give to other NGOs."', '"That is wonderful. We are not replacing that — we are complementing it."'],
          ['"Can you send me more information?"', '"Absolutely — what matters most to you? I will tailor what I send."'],
          ['"I cannot afford that amount."', '"What amount would feel right for you?"'],
          ['"I need to discuss with my spouse/board."', '"Of course. Would it help if I joined that conversation?"'],
          ['"I am not sure you will use it well."', '"Let me show you how last year’s gifts were used."'],
          ['"Your overhead is too high."', '"Our overhead is X% — here is what that funds and why it matters."'],
          ['"I want to fund a specific project."', '"We have a programme that aligns perfectly — let me share the funding pack."'],
          ['"Now is not a good time."', '"I understand. When would be a better time to reconnect — 3 or 6 months?"'],
          ['"I have never heard of your NGO."', '"That is fair. Let me share two results we have achieved this year."'],
        ]},
        { heading: 'POST-MEETING ACTIONS', rows: [
          ['Thank-you sent within 48 hours?', '☐ Yes  ☐ No'],
          ['Follow-up materials sent?', '☐ Yes  ☐ No'],
          ['Next step agreed and scheduled?', '______________________________'],
          ['Pipeline stage updated?', '☐ Yes  ☐ No'],
          ['Notes added to donor record?', '______________________________'],
        ]},
      ]
    },

    // ─── TOOL 6 ───
    'Proposal Templates + Budget (2-page & 10-page)': {
      subtitle: 'Grant Proposal Template — Full Structure (2-page + 10-page)',
      sections: [
        { heading: 'GRANT DETAILS', rows: [
          ['Funder Name', '______________________________'],
          ['Grant Programme', '______________________________'],
          ['Submission Deadline', '______________________________'],
          ['Requested Amount', '$____________________________'],
          ['Project Period', '______________________________'],
          ['Contact at Funder', '______________________________'],
        ]},
        { heading: '2-PAGE PROPOSAL STRUCTURE', rows: [
          ['Section 1 (150 words)', 'Organisation Overview — who you are, your track record'],
          ['Section 2 (200 words)', 'Problem Statement — the need, with data'],
          ['Section 3 (250 words)', 'Project Description — what you will do and how'],
          ['Section 4 (150 words)', 'Expected Outcomes — measurable results you commit to'],
          ['Section 5 (150 words)', 'Budget Summary — key line items and % breakdown'],
          ['Section 6 (100 words)', 'Organisational Capacity — why you will succeed'],
        ]},
        { heading: '10-PAGE PROPOSAL — ADDITIONAL SECTIONS', rows: [
          ['Section 7 (300 words)', 'Context & Needs Assessment — detailed problem analysis'],
          ['Section 8 (400 words)', 'Programme Methodology — step-by-step approach'],
          ['Section 9 (200 words)', 'Theory of Change — inputs, activities, outputs, outcomes, impact'],
          ['Section 10 (200 words)', 'Monitoring & Evaluation — how you will measure success'],
          ['Section 11 (150 words)', 'Sustainability — how the work continues after the grant'],
          ['Section 12 (150 words)', 'Risk Management — key risks and mitigation strategies'],
          ['Appendices', 'Registration cert, audited accounts, CVs, letters of support'],
        ]},
        { heading: 'BUDGET TEMPLATE (KEY LINE ITEMS)', rows: [
          ['Staff Costs (names, % time, months)', '$____________________________'],
          ['Consultant / Expert Fees', '$____________________________'],
          ['Travel & Accommodation', '$____________________________'],
          ['Equipment & Supplies', '$____________________________'],
          ['Training & Capacity Building', '$____________________________'],
          ['Community Engagement / Events', '$____________________________'],
          ['Monitoring & Evaluation', '$____________________________'],
          ['Indirect / Overhead Costs (max 15%)', '$____________________________'],
          ['TOTAL REQUEST', '$____________________________'],
        ]},
        { heading: 'COMPLIANCE CHECKLIST', rows: [
          ['All sections completed to word limit?', '☐ Yes  ☐ No'],
          ['Budget totals match narrative?', '☐ Yes  ☐ No'],
          ['Supporting documents attached?', '☐ Yes  ☐ No'],
          ['Submitted through correct channel?', '☐ Yes  ☐ No'],
          ['Confirmation receipt obtained?', '☐ Yes  ☐ No'],
        ]},
      ]
    },

    // ─── TOOL 7 ───
    'Grants Go/No-Go Matrix + Compliance Checklist': {
      subtitle: 'Grant Opportunity Evaluation — Go/No-Go Decision Matrix',
      sections: [
        { heading: 'GRANT DETAILS', rows: [
          ['Funder Name', '______________________________'],
          ['Grant Programme', '______________________________'],
          ['Deadline', '______________________________'],
          ['Maximum Award', '$____________________________'],
          ['Eligible Activities', '______________________________'],
        ]},
        { heading: 'GO / NO-GO SCORING (Score each 1–5)', rows: [
          ['Strategic Fit — does this align with our mission?', '____ / 5'],
          ['Eligibility — do we meet all criteria?', '____ / 5'],
          ['Realistic Odds — have we won this type before?', '____ / 5'],
          ['Capacity to Deliver — can we implement well?', '____ / 5'],
          ['Effort Required vs Award Size (low effort = high score)', '____ / 5'],
          ['Funder Relationship (known funder = higher score)', '____ / 5'],
          ['TOTAL SCORE', '____ / 30'],
          ['DECISION (25+ = Go; 15–24 = Review; below 15 = No-Go)', '☐ GO  ☐ NO-GO  ☐ REVIEW'],
        ]},
        { heading: 'PRE-APPLICATION COMPLIANCE', rows: [
          ['Registration requirements met?', '☐ Yes  ☐ No  ☐ Check needed'],
          ['Financial statements ready (last 2 years)?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Proof of registration / legal status?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Board resolution authorising application?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Co-funding or match requirement? If yes, amount:', '☐ Yes  ☐ No  Amount: $____'],
        ]},
        { heading: 'POST-AWARD COMPLIANCE', rows: [
          ['Grant agreement signed and filed?', '☐ Yes  ☐ No'],
          ['Restricted funds account set up?', '☐ Yes  ☐ No'],
          ['Reporting schedule entered in calendar?', '☐ Yes  ☐ No'],
          ['M&E system activated for this grant?', '☐ Yes  ☐ No'],
          ['Dedicated grant file created (physical + digital)?', '☐ Yes  ☐ No'],
          ['Next report due date', '______________________________'],
        ]},
      ]
    },

    // ─── TOOL 8 ───
    'Corporate Partnership Menu Template': {
      subtitle: 'NGO Corporate Partnership Menu — Tiered Offer Template',
      sections: [
        { heading: 'PARTNERSHIP OVERVIEW', rows: [
          ['NGO Name', '______________________________'],
          ['Partnership Programme Name', '______________________________'],
          ['Valid For (year)', '______________________________'],
          ['Partnership Manager Contact', '______________________________'],
        ]},
        { heading: 'BRONZE PARTNERSHIP TIER', rows: [
          ['Partnership Name', '______________________________'],
          ['Annual Investment', '$____________________________'],
          ['What the Company Funds', '______________________________'],
          ['Employees Impacted', '______________________________'],
          ['Beneficiaries Reached', '______________________________'],
          ['Reporting', 'Annual impact report'],
          ['Recognition', 'Logo on website and social media'],
          ['Renewal Terms', '1-year renewable'],
        ]},
        { heading: 'SILVER PARTNERSHIP TIER', rows: [
          ['Partnership Name', '______________________________'],
          ['Annual Investment', '$____________________________'],
          ['What the Company Funds', '______________________________'],
          ['Employee Engagement Options', 'Volunteer day, skills match, talks'],
          ['Beneficiaries Reached', '______________________________'],
          ['Reporting', 'Quarterly updates + annual report'],
          ['Recognition', 'Logo, press release, event naming'],
          ['Renewal Terms', '2-year with review option'],
        ]},
        { heading: 'GOLD PARTNERSHIP TIER — STRATEGIC PARTNER', rows: [
          ['Partnership Name', '______________________________'],
          ['Annual Investment', '$____________________________'],
          ['Strategic Objectives Addressed', '______________________________'],
          ['Employee Engagement', 'Board placement, strategic input, staff training'],
          ['Co-Branding Rights', 'Full co-branding on programme materials'],
          ['Reporting', 'Monthly dashboard + in-person briefings'],
          ['Renewal Terms', '3-year strategic agreement'],
          ['Exclusivity Option', '☐ Yes  ☐ No  Sector: ___________'],
        ]},
        { heading: 'PARTNERSHIP VALUE PROPOSITION', rows: [
          ['CSR / ESG alignment', '______________________________'],
          ['Employee engagement value', '______________________________'],
          ['Brand and reputation benefit', '______________________________'],
          ['Measurable social impact', '______________________________'],
          ['Tax benefit (if applicable)', '______________________________'],
        ]},
      ]
    },

    // ─── TOOL 9 ───
    'Digital Campaign Kit (14-Day Calendar)': {
      subtitle: 'NGO 14-Day Digital Fundraising Campaign Planner',
      sections: [
        { heading: 'CAMPAIGN OVERVIEW', rows: [
          ['Campaign Name', '______________________________'],
          ['Campaign Goal ($)', '$____________________________'],
          ['Campaign Dates', '______  to  ______'],
          ['Primary Platform', '☐ WhatsApp  ☐ Facebook  ☐ Instagram  ☐ Email  ☐ All'],
          ['Campaign Manager', '______________________________'],
        ]},
        { heading: 'PRE-LAUNCH (Days -7 to 0)', rows: [
          ['Day -7', 'Finalise donation page and test payment flow'],
          ['Day -5', 'Prepare all content (images, videos, copy bank)'],
          ['Day -3', 'Brief your team and volunteer ambassadors'],
          ['Day -1', 'Send teaser to email/WhatsApp list'],
          ['Day 0 (Launch)', 'Announce launch — post across all channels at 9am'],
        ]},
        { heading: 'WEEK 1 CONTENT CALENDAR (Days 1–7)', rows: [
          ['Day 1 — Launch Day', 'Campaign launch post + personal ask from director'],
          ['Day 2 — Story Day', 'Beneficiary story with photo (anonymous if needed)'],
          ['Day 3 — Progress Update', 'Show progress bar — thank early donors by name'],
          ['Day 4 — Impact Data', 'Infographic — what $100/$500/$1,000 achieves'],
          ['Day 5 — Team Post', 'Staff or volunteer shares why they care'],
          ['Day 6 — Peer Ask Day', 'Ask donors to share with 3 friends (WhatsApp script)'],
          ['Day 7 — Milestone Celebration', 'Announce first milestone — celebrate progress'],
        ]},
        { heading: 'WEEK 2 CONTENT CALENDAR (Days 8–14)', rows: [
          ['Day 8 — Challenge Post', 'Peer-to-peer challenge or matching gift announcement'],
          ['Day 9 — Testimonial', 'Video or quote from a community member'],
          ['Day 10 — FAQ / Objections', '"Here is where your money goes" transparency post'],
          ['Day 11 — Urgency Day', '"3 days left — here is what we still need" post'],
          ['Day 12 — Final Push', 'Personal appeal from founder/director'],
          ['Day 13 — Countdown', 'Last 24 hours — create FOMO, show gap to goal'],
          ['Day 14 — Close & Thank', 'Final result announced — thank every single donor'],
        ]},
        { heading: 'WHATSAPP AMBASSADOR SCRIPT', rows: [
          ['Opening Message', '"Hi [Name], I hope you are well! I am reaching out about..."'],
          ['Campaign Link', 'Short link: ______________________________'],
          ['Personal Why', '"I am involved because..."'],
          ['Ask', '"Would you consider donating even $[X]? Every amount helps."'],
          ['Follow-up (Day 3)', '"Just checking — did you get a chance to see our campaign?"'],
        ]},
        { heading: 'DONATION PAGE CHECKLIST', rows: [
          ['Clear headline and campaign story visible?', '☐ Yes  ☐ No'],
          ['Progress bar showing ($ raised vs goal)?', '☐ Yes  ☐ No'],
          ['3 suggested giving amounts with impact labels?', '☐ Yes  ☐ No'],
          ['Mobile-optimised layout?', '☐ Yes  ☐ No'],
          ['Thank-you auto-message configured?', '☐ Yes  ☐ No'],
          ['Tax receipt process confirmed?', '☐ Yes  ☐ No'],
        ]},
      ]
    },

    // ─── TOOL 10 ───
    'Donor Retention 30/60/90 Kit': {
      subtitle: 'Donor Retention — 90-Day Stewardship Journey Template',
      sections: [
        { heading: 'DONOR DETAILS (one per record)', rows: [
          ['Donor Name', '______________________________'],
          ['Gift Date', '______________________________'],
          ['Gift Amount', '$____________________________'],
          ['Funding Channel (individual/corporate/grant)', '______________________________'],
          ['First-Time or Returning Donor?', '☐ First-Time  ☐ Returning'],
        ]},
        { heading: 'DAYS 0–2 — THANK-YOU SEQUENCE', rows: [
          ['Within 24 hours', 'Auto-email thank-you with gift receipt and impact statement'],
          ['Within 48 hours', 'Personal call or handwritten note from director for gifts $500+'],
          ['Day 2', 'Send 1-page impact update: what their gift funds right now'],
          ['Thank-you template used?', '☐ Standard  ☐ Major Donor (personalised)'],
        ]},
        { heading: 'DAYS 3–30 — WELCOME JOURNEY', rows: [
          ['Day 7', 'Introduce them to a beneficiary story by email'],
          ['Day 14', 'Behind-the-scenes video or photo update from field'],
          ['Day 21', 'Invite to a webinar, site visit, or community call'],
          ['Day 30', 'Month 1 summary: outcomes achieved, what is next'],
        ]},
        { heading: 'DAYS 31–60 — ENGAGEMENT PHASE', rows: [
          ['Day 35', 'Share a media mention, award, or external validation'],
          ['Day 45', 'Mid-point impact report — link back to their specific gift'],
          ['Day 55', 'Invite to join an advisory group, give feedback, or co-design'],
          ['Day 60', 'Two-month update — show cumulative impact of their support'],
        ]},
        { heading: 'DAYS 61–90 — RENEWAL PREPARATION', rows: [
          ['Day 70', 'Share annual impact report or year-in-review highlight'],
          ['Day 75', 'Personal call to discuss renewal — ask what matters to them'],
          ['Day 80', 'Send renewal proposal with upgraded giving option'],
          ['Day 85', 'Follow up — address any questions'],
          ['Day 90', 'Confirm renewal or adjust plan — update pipeline accordingly'],
        ]},
        { heading: '1-PAGE IMPACT REPORT TEMPLATE', rows: [
          ['Reporting Period', '______________________________'],
          ['Total Donors This Period', '______________________________'],
          ['Total Funds Raised', '$____________________________'],
          ['Beneficiaries Served', '______________________________'],
          ['Headline Outcome 1', '______________________________'],
          ['Headline Outcome 2', '______________________________'],
          ['Story of Change (2–3 sentences)', '______________________________'],
          ['What Comes Next', '______________________________'],
        ]},
      ]
    },

    // ─── TOOL 11 ───
    'Prospect Research Worksheet': {
      subtitle: 'Donor Prospect Research & Scoring Template',
      sections: [
        { heading: 'PROSPECT PROFILE', rows: [
          ['Full Name', '______________________________'],
          ['Title / Organisation', '______________________________'],
          ['Geographic Location', '______________________________'],
          ['Estimated Net Worth / Budget', '______________________________'],
          ['Source of Connection to NGO', '______________________________'],
          ['Date Researched', '______________________________'],
        ]},
        { heading: 'INDIVIDUAL DONOR RESEARCH', rows: [
          ['Known philanthropic giving history', '______________________________'],
          ['Connection to your cause / sector', '______________________________'],
          ['Personal values / priorities', '______________________________'],
          ['Estimated capacity (low / mid / major)', '☐ <$500  ☐ $500–$5,000  ☐ $5,000+'],
          ['Warm connection (who can intro them)?', '______________________________'],
          ['Best outreach approach', '☐ Email  ☐ Call  ☐ Mutual contact  ☐ Event'],
        ]},
        { heading: 'CORPORATE PROSPECT RESEARCH', rows: [
          ['Company Name', '______________________________'],
          ['CSR / ESG Focus Areas', '______________________________'],
          ['Annual CSR Budget (estimate)', '$____________________________'],
          ['Current NGO partnerships (if known)', '______________________________'],
          ['Decision-maker name + title', '______________________________'],
          ['Best entry point (CSR team / CEO / Marketing)', '______________________________'],
        ]},
        { heading: 'FOUNDATION / GRANT PROSPECT RESEARCH', rows: [
          ['Foundation Name', '______________________________'],
          ['Funding Focus Areas', '______________________________'],
          ['Typical Grant Range', '$____________  to  $____________'],
          ['Application Deadlines', '______________________________'],
          ['Past Grantees (similar to us?)', '______________________________'],
          ['Geographic Restrictions', '______________________________'],
        ]},
        { heading: 'SCORING MATRIX (Score each 1–5)', rows: [
          ['Alignment with our mission / sector', '____ / 5'],
          ['Financial capacity to give at target level', '____ / 5'],
          ['Warmth of relationship (how well do we know them?)', '____ / 5'],
          ['Likelihood to give in next 90 days', '____ / 5'],
          ['TOTAL SCORE', '____ / 20'],
          ['PRIORITY TIER', '☐ A (15–20)  ☐ B (10–14)  ☐ C (below 10)'],
        ]},
      ]
    },

    // ─── TOOL 12 ───
    'Annual Fundraising Calendar (12-Month)': {
      subtitle: 'NGO 12-Month Fundraising Calendar & Planning Template',
      sections: [
        { heading: 'ANNUAL TARGETS', rows: [
          ['Total Annual Fundraising Goal', '$____________________________'],
          ['Individual Donor Target', '$____________________________'],
          ['Grants Target', '$____________________________'],
          ['Corporate Target', '$____________________________'],
          ['Digital / Events Target', '$____________________________'],
          ['Financial Year', '______________________________'],
        ]},
        { heading: 'Q1 — JANUARY TO MARCH', rows: [
          ['January Focus', '______________________________'],
          ['January Key Activities', '______________________________'],
          ['February Focus', '______________________________'],
          ['February Key Activities', '______________________________'],
          ['March Focus', '______________________________'],
          ['March Key Activities', '______________________________'],
          ['Q1 Revenue Target', '$____________________________'],
          ['Q1 Grant Deadlines', '______________________________'],
        ]},
        { heading: 'Q2 — APRIL TO JUNE', rows: [
          ['April Focus', '______________________________'],
          ['April Key Activities', '______________________________'],
          ['May Focus', '______________________________'],
          ['May Key Activities', '______________________________'],
          ['June Focus', '______________________________'],
          ['June Key Activities', '______________________________'],
          ['Q2 Revenue Target', '$____________________________'],
          ['Q2 Grant Deadlines', '______________________________'],
        ]},
        { heading: 'Q3 — JULY TO SEPTEMBER', rows: [
          ['July Focus', '______________________________'],
          ['July Key Activities', '______________________________'],
          ['August Focus', '______________________________'],
          ['August Key Activities', '______________________________'],
          ['September Focus', '______________________________'],
          ['September Key Activities', '______________________________'],
          ['Q3 Revenue Target', '$____________________________'],
          ['Q3 Grant Deadlines', '______________________________'],
        ]},
        { heading: 'Q4 — OCTOBER TO DECEMBER', rows: [
          ['October Focus', '______________________________'],
          ['October Key Activities', '______________________________'],
          ['November Focus', 'Year-end giving season preparation'],
          ['November Key Activities', 'Donor outreach, renewal asks, digital campaign'],
          ['December Focus', 'Year-end close, thank-you letters, reporting'],
          ['December Key Activities', 'Final push, donor appreciation, Q1 planning'],
          ['Q4 Revenue Target', '$____________________________'],
          ['Year-End Giving Campaign', '☐ Planned  ☐ Not Planned'],
        ]},
        { heading: 'REVIEW & ADJUSTMENT MILESTONES', rows: [
          ['Q1 Review Date', '______________________________'],
          ['Q2 Mid-Year Review Date', '______________________________'],
          ['Q3 Review Date', '______________________________'],
          ['Year-End Review Date', '______________________________'],
          ['Board Fundraising Report Dates', '______________________________'],
        ]},
      ]
    },

    // ─── TOOL 13 ───
    'Grant Opportunity Tracker': {
      subtitle: 'Grant Pipeline Tracker — Opportunities, Deadlines & Status',
      sections: [
        { heading: 'HOW TO USE THIS TRACKER', rows: [
          ['Update frequency', 'Weekly — every Monday morning review'],
          ['Status options', 'Researching / Preparing / Submitted / Won / Lost / On Hold'],
          ['Archive rule', 'Move lost grants to archive tab — review reasons quarterly'],
          ['Minimum pipeline size', 'Maintain at least 5 active applications at all times'],
        ]},
        { heading: 'ACTIVE GRANT PIPELINE (template row)', rows: [
          ['Funder Name', '______________________________'],
          ['Grant Programme Name', '______________________________'],
          ['Sector / Thematic Focus', '______________________________'],
          ['Maximum Award', '$____________________________'],
          ['Application Deadline', '______________________________'],
          ['Submission Method', '☐ Online portal  ☐ Email  ☐ Post'],
          ['Status', '☐ Researching  ☐ Preparing  ☐ Submitted  ☐ Won  ☐ Lost'],
          ['Proposal Writer Assigned', '______________________________'],
          ['Key Contact at Funder', '______________________________'],
          ['Notes / Follow-up Required', '______________________________'],
        ]},
        { heading: 'DEADLINE CALENDAR (next 6 months)', rows: [
          ['Month 1 Deadlines', '______________________________'],
          ['Month 2 Deadlines', '______________________________'],
          ['Month 3 Deadlines', '______________________________'],
          ['Month 4 Deadlines', '______________________________'],
          ['Month 5 Deadlines', '______________________________'],
          ['Month 6 Deadlines', '______________________________'],
        ]},
        { heading: 'PIPELINE SUMMARY', rows: [
          ['Total Active Applications', '______'],
          ['Total Value of Applications Submitted', '$____________________________'],
          ['Applications Won (year to date)', '______  Value: $____________________________'],
          ['Applications Lost (year to date)', '______  Value: $____________________________'],
          ['Win Rate (%)', '______%'],
          ['Average Grant Size Won', '$____________________________'],
        ]},
      ]
    },

    // ─── TOOL 14 ───
    'Pitch Script Templates (30 / 60 second)': {
      subtitle: 'Elevator Pitch Templates — 30-Second and 60-Second Versions',
      sections: [
        { heading: 'YOUR ORGANISATION DETAILS', rows: [
          ['Organisation Name', '______________________________'],
          ['Primary Beneficiaries', '______________________________'],
          ['Core Problem Solved', '______________________________'],
          ['Key Impact Statistic', '______________________________'],
          ['Funding Ask (if applicable)', '$____________________________'],
        ]},
        { heading: '30-SECOND PITCH TEMPLATE', rows: [
          ['Hook (1 sentence)', '"Did you know that [problem statistic]?"'],
          ['Who We Are', '"We are [org name] — we [what you do] for [who]."'],
          ['Proof', '"In the last year we [specific result]."'],
          ['Call to Action', '"I would love to tell you more — could we set up a 20-minute call?"'],
          ['YOUR VERSION (fill in)', '______________________________'],
        ]},
        { heading: '60-SECOND PITCH TEMPLATE', rows: [
          ['Opening Hook (10 sec)', '"One in [X] children in [place] faces [problem]..."'],
          ['Organisation Introduction (10 sec)', '"[Org name] was founded in [year] to [mission]..."'],
          ['What We Do (15 sec)', '"Our approach is [unique method] — we work with [partners/community]..."'],
          ['Proof of Impact (15 sec)', '"In the last year we reached [X] beneficiaries and achieved [outcome]..."'],
          ['The Ask (10 sec)', '"We are looking for partners who [alignment]. Would you be one of them?"'],
          ['YOUR VERSION (fill in)', '______________________________'],
        ]},
        { heading: 'AUDIENCE-SPECIFIC VERSIONS', rows: [
          ['Version 1 — Individual Donor Pitch', '______________________________'],
          ['Version 2 — Corporate / CSR Pitch', '______________________________'],
          ['Version 3 — Foundation / Grant Funder Pitch', '______________________________'],
          ['Version 4 — Government / Bilateral Pitch', '______________________________'],
          ['Version 5 — Event / Conference Pitch', '______________________________'],
        ]},
        { heading: 'PRACTICE CHECKLIST', rows: [
          ['Timed at exactly 30 or 60 seconds?', '☐ Yes  ☐ Needs work'],
          ['Avoids jargon and acronyms?', '☐ Yes  ☐ Needs work'],
          ['Has a specific call to action?', '☐ Yes  ☐ Needs work'],
          ['Tested with someone outside the sector?', '☐ Yes  ☐ Not yet'],
          ['Memorised (not read)?', '☐ Yes  ☐ In progress'],
        ]},
      ]
    },

    // ─── TOOL 15 ───
    'Impact Report Template (1-page)': {
      subtitle: 'Monthly/Quarterly 1-Page Impact Report Template',
      sections: [
        { heading: 'REPORT HEADER', rows: [
          ['Organisation Name', '______________________________'],
          ['Report Period', '______  to  ______'],
          ['Prepared By', '______________________________'],
          ['Date Published', '______________________________'],
          ['Primary Audience', '☐ Donors  ☐ Board  ☐ Public  ☐ Funders'],
        ]},
        { heading: 'HEADLINE NUMBERS (top of page — large font)', rows: [
          ['Key Number 1 (e.g. beneficiaries)', '______  [label: e.g. "children supported"]'],
          ['Key Number 2 (e.g. outcome %)', '______%  [label: e.g. "graduation rate"]'],
          ['Key Number 3 (e.g. reach)', '______  [label: e.g. "communities reached"]'],
          ['Key Number 4 (e.g. funds raised)', '$______  [label: e.g. "raised this quarter"]'],
        ]},
        { heading: 'YOUR STORY (centre of page)', rows: [
          ['Story Headline (bold)', '______________________________'],
          ['Story (3–4 sentences maximum)', '______________________________'],
          ['Story subject (beneficiary — anonymised if needed)', '______________________________'],
          ['Photo / image caption', '______________________________'],
        ]},
        { heading: 'WHERE YOUR MONEY WENT', rows: [
          ['Direct Programme Delivery (%)', '______%  =  $______'],
          ['Staff & Coordination (%)', '______%  =  $______'],
          ['Monitoring & Learning (%)', '______%  =  $______'],
          ['Overhead / Administration (%)', '______%  =  $______'],
          ['TOTAL', '100%  =  $______'],
        ]},
        { heading: 'WHAT COMES NEXT', rows: [
          ['Priority Focus Next Period', '______________________________'],
          ['New Programme or Expansion', '______________________________'],
          ['Fundraising Goal Next Period', '$____________________________'],
          ['Call to Action for Reader', '______________________________'],
          ['Contact / Donation Link', '______________________________'],
        ]},
      ]
    },

    // ─── TOOL 16 ───
    'Corporate Partner Targeting Map': {
      subtitle: 'Corporate Partner Identification & Scoring Map',
      sections: [
        { heading: 'TARGET CRITERIA DEFINITION', rows: [
          ['NGO Name', '______________________________'],
          ['Sector Alignment (your cause)', '______________________________'],
          ['Target Company Size', '☐ SME  ☐ Large Local  ☐ Multinational  ☐ All'],
          ['Geographic Focus', '______________________________'],
          ['Partnership Investment Range', '$____________  to  $____________'],
        ]},
        { heading: 'PROSPECT RESEARCH (one row per company)', rows: [
          ['Company Name', '______________________________'],
          ['Sector / Industry', '______________________________'],
          ['Annual Revenue (estimate)', '$____________________________'],
          ['Has Active CSR/ESG Programme?', '☐ Yes  ☐ No  ☐ Unknown'],
          ['CSR Focus Areas', '______________________________'],
          ['Current NGO Partners (known)', '______________________________'],
          ['Connection to Your Cause', '______________________________'],
          ['Entry Point (who do we know there?)', '______________________________'],
          ['Decision-Maker Name + Title', '______________________________'],
          ['Estimated Partnership Value', '$____________________________'],
        ]},
        { heading: 'SCORING MATRIX (score each company 1–5)', rows: [
          ['Mission / cause alignment', '____ / 5'],
          ['Financial capacity and CSR budget', '____ / 5'],
          ['Existing relationship or warm contact', '____ / 5'],
          ['Alignment of employee base with cause', '____ / 5'],
          ['Geographic or market overlap', '____ / 5'],
          ['TOTAL SCORE', '____ / 25'],
          ['PRIORITY TIER', '☐ A (20–25)  ☐ B (13–19)  ☐ C (below 13)'],
        ]},
        { heading: 'OUTREACH PLAN (top 10 prospects)', rows: [
          ['Company 1 — Next Step', '______________________________'],
          ['Company 2 — Next Step', '______________________________'],
          ['Company 3 — Next Step', '______________________________'],
          ['Company 4 — Next Step', '______________________________'],
          ['Company 5 — Next Step', '______________________________'],
          ['First Outreach Target Date', '______________________________'],
          ['Follow-Up Date', '______________________________'],
        ]},
      ]
    },

    // ─── TOOL 17 ───
    'Crowdfunding Campaign Planner': {
      subtitle: 'NGO Crowdfunding Campaign — Full Planning Template',
      sections: [
        { heading: 'CAMPAIGN BASICS', rows: [
          ['Campaign Name', '______________________________'],
          ['Campaign Goal ($)', '$____________________________'],
          ['Minimum Viable Goal ($)', '$____________________________'],
          ['Campaign Duration (days)', '______  days  (recommended: 21–30)'],
          ['Platform', '☐ JustGiving  ☐ GoFundMe  ☐ LaunchGood  ☐ Chuffed  ☐ Own website'],
          ['Campaign Manager', '______________________________'],
        ]},
        { heading: 'CAMPAIGN STORY', rows: [
          ['Headline (10 words max)', '______________________________'],
          ['Problem (2 sentences)', '______________________________'],
          ['Solution (2 sentences)', '______________________________'],
          ['Why now? (urgency)', '______________________________'],
          ['What happens if goal is reached?', '______________________________'],
          ['What happens if goal is NOT reached?', '______________________________'],
        ]},
        { heading: 'GIVING LEVELS', rows: [
          ['Level 1 ($)', '$______  =  ______________________________'],
          ['Level 2 ($)', '$______  =  ______________________________'],
          ['Level 3 ($)', '$______  =  ______________________________'],
          ['Level 4 ($)', '$______  =  ______________________________'],
          ['Level 5 (open / custom)', 'Custom amount — "any amount helps"'],
        ]},
        { heading: 'AMBASSADOR PROGRAMME', rows: [
          ['Number of ambassadors recruited', '______'],
          ['Ambassador fundraising target (each)', '$____________________________'],
          ['Ambassador communication plan', '______________________________'],
          ['Incentive for top ambassador', '______________________________'],
          ['Ambassador toolkit provided?', '☐ Yes (messages, images, script)  ☐ Not yet'],
        ]},
        { heading: 'MATCHING GIFT STRATEGY', rows: [
          ['Matching gift secured?', '☐ Yes  ☐ No  ☐ In Negotiation'],
          ['Match Donor Name', '______________________________'],
          ['Match Amount', '$____________________________'],
          ['Match Window', '______  to  ______'],
          ['Match Announcement Plan', '______________________________'],
        ]},
        { heading: 'POST-CAMPAIGN PLAN', rows: [
          ['Thank-you sequence (timeline)', '______________________________'],
          ['Donor conversion to recurring?', '☐ Yes — ask at Day 3  ☐ No plan yet'],
          ['Impact report timeline', '______________________________'],
          ['Total raised', '$____________________________'],
          ['Lessons learned', '______________________________'],
        ]},
      ]
    },

    // ─── TOOL 18 ───
    'Funder Communication Templates Bundle': {
      subtitle: 'Funder Communication Templates — 15 Email Templates',
      sections: [
        { heading: 'TEMPLATE 1 — COLD OUTREACH (INDIVIDUAL)', rows: [
          ['Subject Line', '"Introduction: [Your NGO] — [1-sentence mission]"'],
          ['Paragraph 1', 'Brief introduction — who you are and the problem you solve'],
          ['Paragraph 2', 'One specific impact statistic or story'],
          ['Paragraph 3', 'Clear, specific ask (meeting, call, site visit)'],
          ['Closing', '"Would a 20-minute call work for you this month?"'],
        ]},
        { heading: 'TEMPLATE 2 — FOUNDATION INQUIRY EMAIL', rows: [
          ['Subject Line', '"Funding Inquiry: [Programme Name] — [Your NGO]"'],
          ['Paragraph 1', 'State the grant programme you are applying to'],
          ['Paragraph 2', 'Confirm eligibility and alignment in 2 sentences'],
          ['Paragraph 3', 'Request guidance: "Is this a strong fit for your current cycle?"'],
          ['Closing', 'Attach 1-page summary and offer to discuss'],
        ]},
        { heading: 'TEMPLATE 3 — MEETING FOLLOW-UP', rows: [
          ['Subject Line', '"Thank you — next steps from our conversation"'],
          ['Paragraph 1', 'Thank them and reflect what you heard'],
          ['Paragraph 2', 'Confirm the specific next step agreed'],
          ['Paragraph 3', 'Attach any materials promised'],
          ['Closing', '"I will follow up on [date] as discussed."'],
        ]},
        { heading: 'TEMPLATE 4 — 48-HOUR DONATION THANK-YOU', rows: [
          ['Subject Line', '"Your gift is already making a difference — thank you, [Name]"'],
          ['Paragraph 1', 'Personal, warm acknowledgment — use their name'],
          ['Paragraph 2', 'Specific impact of their gift (not generic)'],
          ['Paragraph 3', 'What you will do next — invite further engagement'],
          ['Closing', 'Sign from a named person (not "The Team")'],
        ]},
        { heading: 'TEMPLATE 5 — RENEWAL ASK', rows: [
          ['Subject Line', '"Will you continue with us in [year]?"'],
          ['Paragraph 1', 'Recap what they funded last year'],
          ['Paragraph 2', 'Impact achieved because of their support'],
          ['Paragraph 3', 'Specific renewal ask with upgraded amount option'],
          ['Closing', '"I would love to speak before [date] — does that work?"'],
        ]},
        { heading: 'TEMPLATES 6–15 (additional topics)', rows: [
          ['Template 6', 'Cold outreach — corporate / CSR lead'],
          ['Template 7', 'Proposal submission covering email'],
          ['Template 8', 'Grant report submission email'],
          ['Template 9', 'Lapsed donor re-engagement'],
          ['Template 10', 'Funder site visit invitation'],
          ['Template 11', 'Matching gift announcement email'],
          ['Template 12', 'Year-end giving campaign email'],
          ['Template 13', 'Monthly giving upgrade ask'],
          ['Template 14', 'Donor complaint / concern response'],
          ['Template 15', 'Post-campaign impact thank-you'],
        ]},
      ]
    },

    // ─── LEGACY KEYS (keep backward compat) ───
    'Readiness checklist': {
      subtitle: 'NGO Fundraising Readiness Self-Assessment',
      sections: [
        { heading: 'ORGANISATIONAL READINESS', rows: [
          ['Mission and theory of change documented?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Registered legal entity?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Financial management system in place?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['At least one year of audited accounts?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Dedicated fundraising staff?', '☐ Yes  ☐ No  ☐ In Progress'],
        ]},
        { heading: 'FUNDRAISING READINESS', rows: [
          ['Written case for support?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Top 10 prospects identified?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Donor pipeline tracker in use?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Grant tracking system?', '☐ Yes  ☐ No  ☐ In Progress'],
          ['Donor thank-you process?', '☐ Yes  ☐ No  ☐ In Progress'],
        ]},
        { heading: 'SCORING', rows: [
          ['8–10 Yes', 'Fundraising Ready'],
          ['5–7 Yes', 'Nearly Ready — fix gaps'],
          ['0–4 Yes', 'Building — use as roadmap'],
        ]},
      ]
    },
    '90-day plan': {
      subtitle: 'NGO 90-Day Fundraising Action Plan',
      sections: [
        { heading: 'MONTH 1 — ASSESS & PREPARE', rows: [
          ['Week 1', 'Complete Readiness Checklist and score gaps'],
          ['Week 2', 'Write/update Case for Support and set 90-day target'],
          ['Week 3', 'Build prospect list — minimum 20 names'],
          ['Week 4', 'Set up pipeline tracker and brief your team'],
        ]},
        { heading: 'MONTH 2 — OUTREACH & ENGAGE', rows: [
          ['Week 5', 'Begin outreach — 5 new conversations per week'],
          ['Week 6', 'Hold donor meetings using the Ask Framework'],
          ['Week 7', 'Follow up all open conversations (48-hr rule)'],
          ['Week 8', 'Submit grant applications, review pipeline'],
        ]},
        { heading: 'MONTH 3 — CLOSE & RETAIN', rows: [
          ['Week 9',  'Make formal asks to top 5 pipeline prospects'],
          ['Week 10', 'Follow up within 72 hours of every ask'],
          ['Week 11', 'Send thank-yous and stewardship updates'],
          ['Week 12', 'Complete review — set next quarter targets'],
        ]},
        { heading: 'TARGET TRACKER', rows: [
          ['90-Day Fundraising Goal', '$ ____________________'],
          ['Target Number of New Donors', '______________________'],
          ['Grant Applications to Submit', '______________________'],
          ['Actual Amount Raised', '$ ____________________'],
        ]},
      ]
    },
    'Targets by channel': {
      subtitle: 'Annual Fundraising Targets by Channel',
      sections: [
        { heading: 'INDIVIDUAL DONORS', rows: [
          ['Major Donors (>$5,000)', 'Target: ___  Amount: $___________'],
          ['Mid-Level ($500–$5,000)', 'Target: ___  Amount: $___________'],
          ['Small Donors (<$500)', 'Target: ___  Amount: $___________'],
          ['Monthly Givers', 'Target: ___  Amount: $___________'],
        ]},
        { heading: 'GRANTS & CORPORATE', rows: [
          ['International Foundations', 'Target: ___  Amount: $___________'],
          ['Government Grants', 'Target: ___  Amount: $___________'],
          ['Corporate Partnerships', 'Target: ___  Amount: $___________'],
          ['Digital / Crowdfunding', 'Target: ___  Amount: $___________'],
        ]},
        { heading: 'TOTALS', rows: [
          ['TOTAL ANNUAL TARGET', '$___________'],
          ['Achieved to Date', '$___________'],
          ['Remaining', '$___________'],
          ['% of Target Reached', '___________'],
        ]},
      ]
    },
  };

  // Default template for any unspecified doc name
  const defaultTemplate = {
    subtitle: `Template: ${safe}`,
    sections: [
      { heading: 'SECTION 1 — OVERVIEW', rows: [
        ['Document Name', safe],
        ['Related Lesson', lessonTitle],
        ['Organisation', '______________________________'],
        ['Prepared By', '______________________________'],
        ['Date', date],
        ['Next Review', '______________________________'],
      ]},
      { heading: 'SECTION 2 — INSTRUCTIONS', rows: [
        ['Step 1', 'Read the full template before completing any section'],
        ['Step 2', 'Replace all [bracketed text] with your organisation’s details'],
        ['Step 3', 'Delete sections that do not apply to your situation'],
        ['Step 4', 'Share with your team before finalising'],
        ['Step 5', 'Store in your shared drive and review every 6 months'],
      ]},
      { heading: 'SECTION 3 — MAIN CONTENT', rows: [
        ['Organisation Name', '______________________________'],
        ['Programme / Project', '______________________________'],
        ['Target Beneficiaries', '______________________________'],
        ['Primary Funding Channel', '______________________________'],
        ['Reporting Period', '______________________________'],
        ['Objective 1', '______________________________'],
        ['Objective 2', '______________________________'],
        ['Objective 3', '______________________________'],
        ['Evidence / Results', '______________________________'],
      ]},
      { heading: 'SECTION 4 — ACTION PLAN', rows: [
        ['Action 1', 'Owner: ____________  Deadline: ____________  Status: Pending'],
        ['Action 2', 'Owner: ____________  Deadline: ____________  Status: Pending'],
        ['Action 3', 'Owner: ____________  Deadline: ____________  Status: Pending'],
      ]},
      { heading: 'SECTION 5 — NOTES', rows: [
        ['Custom notes', '[Add your NGO-specific context here]'],
      ]},
    ]
  };

  // Exact match first, then case-insensitive partial match
  if (templates[safe]) return templates[safe];
  const lsafe = safe.toLowerCase();
  for (const key of Object.keys(templates)) {
    if (key.toLowerCase() === lsafe) return templates[key];
  }
  // Partial match — find longest key that appears in the docName
  let best = null, bestLen = 0;
  for (const key of Object.keys(templates)) {
    if (lsafe.includes(key.toLowerCase()) && key.length > bestLen) {
      best = key; bestLen = key.length;
    }
  }
  if (best) return templates[best];
  return defaultTemplate;
}

/* ── Download as PDF ── */
function downloadPDF(docName, lessonTitle) {
  const data = getTemplateData(docName, lessonTitle);
  const date = new Date().toLocaleDateString('en-GB', {year:'numeric',month:'long',day:'numeric'});
  const filename = docName.replace(/[^a-z0-9]/gi,'_').toLowerCase();

  // Use jsPDF if available, else fallback to printable HTML
  if (window.jspdf && window.jspdf.jsPDF) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const PW = 210, PH = 297, ML = 18, MR = 18, MT = 20, usableW = PW - ML - MR;
    let y = MT;

    const checkPage = (needed) => { if (y + needed > PH - 15) { doc.addPage(); y = MT; } };

    // Header bar
    doc.setFillColor(26, 95, 58);
    doc.rect(0, 0, PW, 16, 'F');
    doc.setTextColor(255,255,255);
    doc.setFont('helvetica','bold');
    doc.setFontSize(9);
    doc.text('FUNDREADY ACADEMY', ML, 10.5);
    doc.setFont('helvetica','normal');
    doc.setFontSize(8);
    doc.text('fundreadyacademy.org', PW - MR, 10.5, {align:'right'});

    y = 26;

    // Title
    doc.setTextColor(26, 95, 58);
    doc.setFont('helvetica','bold');
    doc.setFontSize(18);
    doc.text(docName, ML, y);
    y += 7;

    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica','normal');
    doc.setFontSize(10);
    doc.text(data.subtitle, ML, y);
    y += 5;

    // Meta line
    doc.setFontSize(8);
    doc.setTextColor(130,130,130);
    doc.text(`Generated: ${date}   |   Lesson: ${lessonTitle}`, ML, y);
    y += 4;

    // Divider
    doc.setDrawColor(26, 95, 58);
    doc.setLineWidth(0.5);
    doc.line(ML, y, PW - MR, y);
    y += 7;

    // Sections
    data.sections.forEach(section => {
      checkPage(16);

      // Section heading
      doc.setFillColor(240, 248, 244);
      doc.roundedRect(ML, y, usableW, 8, 1.5, 1.5, 'F');
      doc.setTextColor(26, 95, 58);
      doc.setFont('helvetica','bold');
      doc.setFontSize(8.5);
      doc.text(section.heading, ML + 4, y + 5.5);
      y += 12;

      // Rows
      section.rows.forEach((row, i) => {
        checkPage(10);
        const rowH = 9;
        const bg = i % 2 === 0 ? [255,255,255] : [248, 251, 249];
        doc.setFillColor(...bg);
        doc.rect(ML, y, usableW, rowH, 'F');
        doc.setDrawColor(220, 235, 225);
        doc.rect(ML, y, usableW, rowH);

        // Col widths
        const col1W = usableW * 0.42;
        doc.setTextColor(30, 30, 30);
        doc.setFont('helvetica','bold');
        doc.setFontSize(8);
        const label = String(row[0]);
        doc.text(label, ML + 3, y + 6, {maxWidth: col1W - 4});

        doc.setFont('helvetica','normal');
        doc.setTextColor(80, 80, 80);
        const val = String(row[1]);
        doc.text(val, ML + col1W + 3, y + 6, {maxWidth: usableW - col1W - 6});
        y += rowH;
      });
      y += 6;
    });

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFillColor(245, 250, 247);
      doc.rect(0, PH - 12, PW, 12, 'F');
      doc.setTextColor(100,100,100);
      doc.setFont('helvetica','normal');
      doc.setFontSize(7.5);
      doc.text('FundReady Academy Template · For educational use · Adapt freely for your NGO', ML, PH - 5);
      doc.text(`Page ${p} of ${totalPages}`, PW - MR, PH - 5, {align:'right'});
    }

    doc.save(filename + '.pdf');
    showToast('PDF downloaded: ' + docName, 'success');

  } else {
    // Fallback: open printable HTML in new tab
    const data2 = getTemplateData(docName, lessonTitle);
    let rows = data2.sections.map(s =>
      `<h3>${s.heading}</h3><table>${s.rows.map(r=>`<tr><td><strong>${r[0]}</strong></td><td>${r[1]}</td></tr>`).join('')}</table>`
    ).join('');
    const win = window.open('','_blank');
    win.document.write(`<html><head><title>${docName}</title><style>
      body{font-family:Arial,sans-serif;max-width:700px;margin:40px auto;color:#222}
      h1{color:#1a5f3a}h3{background:#f0f8f4;color:#1a5f3a;padding:8px 12px;border-radius:4px}
      table{width:100%;border-collapse:collapse;margin-bottom:16px}
      td{border:1px solid #d0e8d8;padding:8px 10px;font-size:13px}
      td:first-child{font-weight:600;width:42%;background:#fafdf9}
      @media print{button{display:none}}
    </style></head><body>
    <h1>${docName}</h1><p>${data2.subtitle} · ${date}</p><hr/>${rows}
    <p style="color:#888;font-size:11px">FundReady Academy · fundreadyacademy.org</p>
    <button onclick="window.print()">Print / Save as PDF</button>
    </body></html>`);
    win.document.close();
    showToast('PDF opened for printing: ' + docName, 'success');
  }
}

/* ── Download as Word (.docx) ── */
function downloadWord(docName, lessonTitle) {
  const data = getTemplateData(docName, lessonTitle);
  const date = new Date().toLocaleDateString('en-GB', {year:'numeric',month:'long',day:'numeric'});
  const filename = docName.replace(/[^a-z0-9]/gi,'_').toLowerCase();

  // Build HTML that Word opens natively (Word HTML format)
  const sectionsHtml = data.sections.map(s => {
    const rows = s.rows.map((r, i) => `
      <tr style="background:${i%2===0?'#ffffff':'#f0f8f4'}">
        <td style="width:42%;padding:8px 10px;border:1px solid #c8e0d0;font-weight:bold;font-size:11pt;color:#1a1a1a">${r[0]}</td>
        <td style="padding:8px 10px;border:1px solid #c8e0d0;font-size:11pt;color:#444">${r[1]}</td>
      </tr>`).join('');
    return `
      <h3 style="background:#e8f5ee;color:#1a5f3a;padding:8px 12px;font-size:11pt;margin:18px 0 4px 0;border-left:4px solid #1a5f3a">${s.heading}</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
        <thead><tr style="background:#1a5f3a">
          <th style="width:42%;padding:7px 10px;color:#fff;text-align:left;font-size:10pt;border:1px solid #1a5f3a">Field</th>
          <th style="padding:7px 10px;color:#fff;text-align:left;font-size:10pt;border:1px solid #1a5f3a">Value / Notes</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }).join('');

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:w="urn:schemas-microsoft-com:office:word"
    xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8">
    <meta name=ProgId content=Word.Document>
    <meta name=Generator content="Microsoft Word 15">
    <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
    <style>
      body{font-family:Calibri,Arial,sans-serif;margin:2cm;color:#222;font-size:11pt}
      h1{color:#1a5f3a;font-size:20pt;margin-bottom:4pt}
      h2{color:#555;font-size:12pt;font-weight:normal;margin-top:0}
      .meta{color:#888;font-size:9pt;border-bottom:2px solid #1a5f3a;padding-bottom:8pt;margin-bottom:16pt}
      table{width:100%;border-collapse:collapse;page-break-inside:avoid}
      .footer{margin-top:24pt;font-size:8pt;color:#aaa;border-top:1px solid #ddd;padding-top:6pt}
    </style>
  </head>
  <body>
    <h1>${docName}</h1>
    <h2>${data.subtitle}</h2>
    <div class="meta">Generated: ${date} &nbsp;|&nbsp; Lesson: ${lessonTitle} &nbsp;|&nbsp; FundReady Academy</div>
    ${sectionsHtml}
    <div class="footer">FundReady Academy &nbsp;|&nbsp; fundreadyacademy.org &nbsp;|&nbsp; For educational use. Adapt freely for your NGO.</div>
  </body></html>`;

  const blob = new Blob([html], {type: 'application/msword'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename + '.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('\ud83d\udcdd Word file downloaded: ' + docName, 'success');
}



// Legacy wrapper kept for any remaining onclick references
function downloadDoc(docName, lessonTitle) { downloadPDF(docName, lessonTitle); }


function renderLessonPlayer() {
  const wrap = document.getElementById('lessonPlayerInner');
  if (!wrap) return;

  const l = LESSONS.find(x => x.id === activeLessonId);
  if (!l) return;

  const isCap  = activeLessonId <= 10;
  const capIdx = activeLessonId - 1;
  let subs;

  if (isCap) {
    subs = CAP_LESSONS[capIdx];
  } else {
    subs = (l.subcaps || []).map((sc, i) => ({
      title: sc,
      dur: (i % 2 === 0) ? '4 min' : '5 min'
    }));
    if (!subs.length) subs = [{title: l.title + ' — Full Lesson', dur: l.duration}];
  }

  const sub      = subs[activeSubIdx] || subs[0];
  const m        = isCap ? CAP_META[capIdx] : {icon:'', color:'#2a6b9b', short: l.cat};
  const vid      = getVid(activeLessonId, activeSubIdx);
  const taskKey  = isCap ? `${capIdx}-${activeSubIdx}` : null;
  const applyTask = (taskKey && APPLY_TASKS[taskKey])
    ? APPLY_TASKS[taskKey]
    : 'After watching, write one specific action you will take in the next 48 hours based on this lesson.';
  const content  = (taskKey && LESSON_CONTENT[taskKey]) ? LESSON_CONTENT[taskKey] : null;
  const isLast   = activeSubIdx === subs.length - 1;
  const progress = Math.round(((activeSubIdx + 1) / subs.length) * 100);

  // Escape for safe use in onclick strings
  const safeTitle = l.title.replace(/'/g, '');

  wrap.innerHTML = `
  <!-- Top bar -->
  <div style="background:var(--ink);padding:14px 0">
    <div class="container" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
      <button id="lessonBackBtn" class="back-btn-dark">← Back</button>
      <div style="color:rgba(255,255,255,.4);font-size:13px">
        <span style="color:rgba(255,255,255,.7)">${l.cat}</span>
        <span style="margin:0 6px">›</span>
        <span>Lesson ${activeSubIdx + 1} of ${subs.length}</span>
      </div>
      <div style="margin-left:auto;display:flex;align-items:center;gap:10px">
        <div style="width:140px;height:4px;background:rgba(255,255,255,.15);border-radius:100px;overflow:hidden">
          <div style="width:${progress}%;height:100%;background:${m.color};border-radius:100px;transition:width .5s ease"></div>
        </div>
        <span style="font-size:12px;color:rgba(255,255,255,.5)">${progress}% done</span>
      </div>
    </div>
  </div>

  <!-- Hero -->
  <div style="background:linear-gradient(135deg,${m.color} 0%,${m.color}cc 100%);padding:28px 0">
    <div class="container">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:10px">
        <span style="font-size:28px">${m.icon}</span>
        <div>
          <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.6);margin-bottom:4px">
            ${l.title} &nbsp;·&nbsp; Lesson ${activeSubIdx + 1}
          </div>
          <h1 style="font-family:'Playfair Display',serif;font-size:clamp(18px,3vw,26px);font-weight:700;color:#fff;line-height:1.3;margin:0">${sub.title}</h1>
        </div>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-top:4px">
        <span style="font-size:13px;color:rgba(255,255,255,.7)">⏱ ${sub.dur}</span>
        <span style="font-size:13px;color:rgba(255,255,255,.7)">${subs.length} lessons in this topic</span>
      </div>
    </div>
  </div>

  <!-- Body -->
  <div style="background:var(--paper);min-height:60vh">
    <div class="container" style="padding-top:32px;padding-bottom:60px">
      <div style="display:grid;grid-template-columns:1fr 320px;gap:28px;align-items:start" class="lesson-player-grid">

        <!-- LEFT col -->
        <div>

          <!-- VIDEO -->
          <div id="lesson-video-wrap" data-src="${vid}" data-title="${sub.title}" style="position:relative;padding-bottom:56.25%;background:#0f1a2e;border-radius:14px;overflow:hidden;margin-bottom:24px;box-shadow:0 6px 28px rgba(0,0,0,.18)">
          </div>

          <!-- KEY CONCEPTS -->
          ${content && content.concepts ? `
          <div style="background:#fff;border:1px solid var(--border);border-radius:14px;padding:22px;margin-bottom:22px">
            <div style="display:flex;align-items:center;gap:9px;margin-bottom:16px">
              <span style="font-size:18px">💡</span>
              <h3 style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--ink-muted);margin:0">Key Concepts</h3>
            </div>
            ${content.concepts.map(c => `
            <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:10px">
              <span style="width:8px;height:8px;border-radius:50%;background:${m.color};flex-shrink:0;margin-top:7px"></span>
              <span style="font-size:14px;color:var(--ink-soft);line-height:1.6">${c}</span>
            </div>`).join('')}
          </div>` : ''}

          <!-- STEP BY STEP -->
          ${content && content.steps ? `
          <div style="background:#fff;border:1px solid var(--border);border-radius:14px;padding:22px;margin-bottom:22px">
            <div style="display:flex;align-items:center;gap:9px;margin-bottom:16px">
              <span style="font-size:18px">🪜</span>
              <h3 style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--ink-muted);margin:0">Step-by-Step Guide</h3>
            </div>
            ${content.steps.map((s, si) => `
            <div style="display:flex;gap:13px;align-items:flex-start;margin-bottom:14px">
              <span style="width:28px;height:28px;border-radius:50%;background:${m.color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;margin-top:1px">${si+1}</span>
              <span style="font-size:14px;color:var(--ink);line-height:1.65;padding-top:4px">${s}</span>
            </div>`).join('')}
          </div>` : ''}

          <!-- APPLY NOW -->
          <div style="background:linear-gradient(135deg,rgba(30,107,80,.07),rgba(30,107,80,.03));border:1.5px solid rgba(30,107,80,.2);border-radius:14px;padding:22px;margin-bottom:22px">
            <div style="display:flex;align-items:center;gap:9px;margin-bottom:12px">
              <span style="font-size:20px">⚡</span>
              <span style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--emerald)">Apply Now — Do This After Watching</span>
            </div>
            <p style="font-size:14.5px;color:var(--ink);line-height:1.7;margin:0">${applyTask}</p>
          </div>

          <!-- WHAT YOU WILL BE ABLE TO DO -->
          ${l.subcaps ? `
          <div style="background:#fff;border:1px solid var(--border);border-radius:14px;padding:22px;margin-bottom:22px">
            <div style="display:flex;align-items:center;gap:9px;margin-bottom:16px">
              <span style="font-size:18px">🎯</span>
              <h3 style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--ink-muted);margin:0">What You Will Be Able To Do</h3>
            </div>
            ${l.subcaps.map((sc, sci) => `
            <div style="display:flex;gap:11px;align-items:flex-start;margin-bottom:10px">
              <span style="width:22px;height:22px;border-radius:50%;background:${m.color}18;color:${m.color};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0;margin-top:1px">${sci+1}</span>
              <span style="font-size:13.5px;color:var(--ink-soft);line-height:1.55">${sc}</span>
            </div>`).join('')}
          </div>` : ''}

          <!-- DOWNLOADABLE ASSETS -->
          ${l.assets && l.assets.length ? `
          <div style="background:var(--emerald-pale);border:1.5px solid rgba(30,107,80,.2);border-radius:14px;padding:20px;margin-bottom:22px">
            <div style="display:flex;align-items:center;gap:9px;margin-bottom:14px">
              <span style="font-size:18px">📋</span>
              <h3 style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--emerald);margin:0">Downloadable Templates</h3>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px">
              ${l.assets.map(a => `
              <div class="download-row" style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#fff;border:1.5px solid rgba(30,107,80,.15);border-radius:10px;transition:all .18s"
                onmouseover="this.style.borderColor='${m.color}'" onmouseout="this.style.borderColor='rgba(30,107,80,.15)'">
                <div style="width:38px;height:38px;border-radius:9px;background:${m.color}18;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">📄</div>
                <div style="flex:1">
                  <div style="font-size:13.5px;font-weight:700;color:var(--ink);line-height:1.3">${a}</div>
                  <div style="font-size:11.5px;color:var(--ink-muted);margin-top:2px">Free Template · PDF & Word</div>
                </div>
                <div style="display:flex;gap:7px;flex-shrink:0">
                  <button onclick="downloadPDF('${a.replace(/'/g,'')}','${safeTitle}')"
                    style="display:flex;align-items:center;gap:5px;padding:7px 13px;background:#dc2626;color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;white-space:nowrap"
                    onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'">PDF</button>
                  <button onclick="downloadWord('${a.replace(/'/g,'')}','${safeTitle}')"
                    style="display:flex;align-items:center;gap:5px;padding:7px 13px;background:#2563eb;color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;white-space:nowrap"
                    onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">Word</button>
                </div>
              </div>`).join('')}
            </div>
          </div>` : ''}

          <!-- NAV BUTTONS -->
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center" id="lesson-nav-btns">
            ${(function(){
              const ctx = _lpContext;
              const pathData = ctx ? PATH_DETAILS[ctx.pathId] : null;
              const pathObj  = ctx ? PATHS.find(p => p.id === ctx.pathId) : null;

              // Determine path-level module lessons (all lessons across all modules in current module)
              let modLessonIds = [];
              let isLastLessonInModule = false;
              let nextModuleIdx = null;
              let nextModuleTitle = '';
              let nextModuleFirstLessonId = null;

              if (ctx && pathData) {
                const mod = pathData.modules[ctx.moduleIdx];
                modLessonIds = mod ? mod.lessonIds : [];
                const lessonPosInModule = modLessonIds.indexOf(activeLessonId);
                const isLastLessonOfModule = lessonPosInModule === modLessonIds.length - 1;

                // Are we on the last sub-lesson of this lesson?
                if (isLast && isLastLessonOfModule) {
                  nextModuleIdx = ctx.moduleIdx + 1;
                  if (nextModuleIdx < pathData.modules.length) {
                    nextModuleTitle = pathData.modules[nextModuleIdx].title;
                    nextModuleFirstLessonId = pathData.modules[nextModuleIdx].lessonIds[0];
                  } else {
                    nextModuleIdx = null; // path complete
                  }
                }
              }

              let btns = '';

              // Back button — always shown when inside a lesson
              const isFirstSub = activeSubIdx === 0;
              btns += `<button id="prevLessonBtn"
                style="padding:12px 22px;background:#fff;color:var(--ink-soft);border:1.5px solid var(--border);border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;display:flex;align-items:center;gap:7px;${isFirstSub ? 'opacity:.45;cursor:not-allowed' : ''}"
                ${isFirstSub ? 'disabled' : ''}>← Back</button>`;

              // Right-side action button
              if (ctx && pathData && isLast) {
                // We are on the last sub-lesson of this lesson
                const mod = pathData.modules[ctx.moduleIdx];
                const modLessonIds2 = mod ? mod.lessonIds : [];
                const lessonPosInModule = modLessonIds2.indexOf(activeLessonId);
                const isLastLessonOfModule = lessonPosInModule === modLessonIds2.length - 1;

                if (!isLastLessonOfModule) {
                  // More lessons remain in the same module — go to next lesson in module
                  const nextLessonId = modLessonIds2[lessonPosInModule + 1];
                  const nextLesson = LESSONS.find(l => l.id === nextLessonId);
                  btns += `<button id="nextLessonBtn"
                    style="padding:12px 24px;background:${m.color};color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">Next Lesson →</button>`;
                } else if (nextModuleIdx !== null) {
                  // Last lesson in module, more modules remain — show "Proceed to Module X"
                  const cleanTitle = nextModuleTitle.replace(/Module \d+: /, '');
                  btns += `<button id="proceedModuleBtn" data-next-mod="${nextModuleIdx}" data-next-lid="${nextModuleFirstLessonId}"
                    style="padding:12px 24px;background:${m.color};color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:8px">Proceed to Module ${nextModuleIdx + 1}: ${cleanTitle}</button>`;
                } else {
                  // All modules complete — path done
                  btns += `<button id="completePathBtn"
                    style="padding:12px 24px;background:var(--emerald);color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">Complete Path — Get Certificate</button>`;
                }
              } else if (isLast) {
                // Standalone lesson (no path context) — complete topic
                btns += `<button id="completeBtn"
                  style="padding:12px 24px;background:${m.color};color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">Complete Topic</button>`;
              } else {
                // Not last sub-lesson — Next
                btns += `<button id="nextLessonBtn"
                  style="padding:12px 24px;background:${m.color};color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">Next →</button>`;
              }

              btns += `<button onclick="showToast('Progress saved!','success')"
                style="padding:12px 20px;background:#fff;color:var(--ink-soft);border:1.5px solid var(--border);border-radius:9px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s"
                onmouseover="this.style.borderColor='var(--emerald)'" onmouseout="this.style.borderColor='var(--border)'">Save Progress</button>`;

              return btns;
            })()}
          </div><!-- /lesson-nav-btns -->

        </div><!-- /LEFT -->

        <!-- RIGHT: sidebar -->
        <div style="position:sticky;top:20px">
          <div style="background:#fff;border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:14px">
            <div style="padding:16px 18px;background:${m.color};color:#fff">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;opacity:.75;margin-bottom:4px">All Lessons</div>
              <div style="font-size:14px;font-weight:700">${l.title}</div>
            </div>
            <div style="padding:10px">
              ${subs.map((s, si) => {
                const isActive = si === activeSubIdx;
                const isDone   = _prog.doneSubs.has(activeLessonId + '-' + si);
                return `<div class="sidebar-lesson-item" data-si="${si}"
                  style="display:flex;align-items:center;gap:10px;padding:10px 11px;border-radius:9px;cursor:pointer;transition:all .15s;margin-bottom:3px;background:${isActive ? m.color+'14' : 'transparent'};border:1px solid ${isActive ? m.color+'30' : 'transparent'}">
                  <span style="width:26px;height:26px;border-radius:50%;background:${isDone ? m.color : isActive ? m.color : 'var(--border)'};color:${isDone || isActive ? '#fff' : 'var(--ink-muted)'};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0">
                    ${isDone ? '✓' : si + 1}
                  </span>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:12.5px;font-weight:${isActive ? 700 : 500};color:${isActive ? m.color : 'var(--ink-soft)'};line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.title}</div>
                    <div style="font-size:11px;color:var(--ink-muted);margin-top:1px">${s.dur}</div>
                  </div>
                  ${isActive ? `<span style="font-size:10px;padding:2px 7px;background:${m.color};color:#fff;border-radius:100px;font-weight:700;flex-shrink:0">Now</span>` : ''}
                </div>`;
              }).join('')}
            </div>
          </div>

          <!-- Related path -->
          <div style="background:var(--paper-warm);border:1px solid var(--border);border-radius:12px;padding:16px">
            <div style="font-size:11px;font-weight:800;text-transform:uppercase;color:var(--ink-muted);margin-bottom:8px">Related Learning Path</div>
            <div style="font-size:13.5px;font-weight:700;color:var(--ink);margin-bottom:10px">${PATHS[Math.min(activeLessonId-1, PATHS.length-1)]?.title || 'Fundraising Readiness in 30 Days'}</div>
            <button onclick="navigate('learning-paths')"
              style="width:100%;padding:9px;background:${m.color};color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">View Full Path →</button>
          </div>
        </div><!-- /RIGHT -->

      </div>
    </div>
  </div>

  <style>
    @media(max-width:820px){
      .lesson-player-grid { grid-template-columns:1fr !important; }
      .lesson-player-grid > div:last-child { position:static !important; }
    }
  </style>`;

  // ── Attach event listeners ──
  const backBtnLP = wrap.querySelector('#lessonBackBtn');
  if (backBtnLP) {
    const prev = _navStack.length ? _navStack[_navStack.length - 1] : null;
    backBtnLP.textContent = '← ' + (prev ? prev.label : 'Back');
    backBtnLP.addEventListener('click', goBack);
  }

  // In-lesson Back button (prev sub-lesson)
  const prevBtn = wrap.querySelector('#prevLessonBtn');
  if (prevBtn && activeSubIdx > 0) {
    prevBtn.addEventListener('click', () => {
      openLessonPlayer(activeLessonId, activeSubIdx - 1);
    });
  }

  // Next sub-lesson button
  const nextBtn = wrap.querySelector('#nextLessonBtn');
  if (nextBtn) nextBtn.addEventListener('click', () => {
    const ctx = _lpContext;
    const pathData = ctx ? PATH_DETAILS[ctx.pathId] : null;
    if (isLast && ctx && pathData) {
      // Moving to next lesson within same module
      const mod = pathData.modules[ctx.moduleIdx];
      const modLessonIds = mod ? mod.lessonIds : [];
      const lessonPos = modLessonIds.indexOf(activeLessonId);
      const nextLessonId = modLessonIds[lessonPos + 1];
      _markSubDone(activeLessonId, activeSubIdx);
      _markTopicDone(activeLessonId);
      openLessonPlayer(nextLessonId, 0, ctx);
    } else {
      _markSubDone(activeLessonId, activeSubIdx);
      openLessonPlayer(activeLessonId, activeSubIdx + 1);
    }
  });

  // Proceed to next module button
  const proceedBtn = wrap.querySelector('#proceedModuleBtn');
  if (proceedBtn) proceedBtn.addEventListener('click', () => {
    _markSubDone(activeLessonId, activeSubIdx);
    _markTopicDone(activeLessonId);
    const nextModIdx = parseInt(proceedBtn.dataset.nextMod);
    const nextLid    = parseInt(proceedBtn.dataset.nextLid);
    const ctx = _lpContext;
    showToast('Module completed! Starting Module ' + (nextModIdx + 1), 'success');
    openLessonPlayer(nextLid, 0, { pathId: ctx.pathId, moduleIdx: nextModIdx });
  });

  // Standalone complete topic button
  const doneBtn = wrap.querySelector('#completeBtn');
  if (doneBtn) doneBtn.addEventListener('click', () => {
    _markSubDone(activeLessonId, activeSubIdx);
    _markTopicDone(activeLessonId);
    goBack();
  });

  // Complete entire path button
  const completePathBtn = wrap.querySelector('#completePathBtn');
  if (completePathBtn) completePathBtn.addEventListener('click', () => {
    _markSubDone(activeLessonId, activeSubIdx);
    _markTopicDone(activeLessonId);
    const ctx = _lpContext;
    const pathObj = ctx ? PATHS.find(p => p.id === ctx.pathId) : null;
    showToast('' + (pathObj ? pathObj.title : 'Path') + ' completed! Well done!', 'success');
    _lpContext = null;
    navigate('path-detail');
  });

  // Download buttons now have inline onclick handlers — no row-level click listener needed

  wrap.querySelectorAll('.sidebar-lesson-item').forEach(item => {
    const si = parseInt(item.dataset.si);
    item.addEventListener('click', () => openLessonPlayer(activeLessonId, si));
  });

  // DOM-safe video injection (innerHTML strips 'controls' in some browsers)
  const vWrap = document.getElementById('lesson-video-wrap');
  if (vWrap) {
    const vSrc = vWrap.getAttribute('data-src');
    if (vSrc) {
      const vel = document.createElement('video');
      vel.src = vSrc;
      vel.controls = true;
      vel.preload = 'metadata';
      vel.setAttribute('playsinline', '');
      vel.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;background:#0f1a2e';
      vWrap.appendChild(vel);
    }
  }

  // Render footer
  const foot = document.getElementById('lessonPlayerFooter');
  if (foot && !foot.dataset.rendered) { foot.innerHTML = renderFooter(); foot.dataset.rendered = '1'; }
}
function renderLessons() {
  const grid = document.getElementById('lessonsGrid');
  if (!grid) return;
  const q = (document.getElementById('lessonSearch')?.value || '').toLowerCase();
  const filtered = LESSONS.filter(l => {
    const matchSearch = !q || l.title.toLowerCase().includes(q) || l.cat.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q);
    return matchSearch;
  });
  grid.innerHTML = filtered.length ? filtered.map(l => {
    const pct     = _topicPct(l.id);
    const isDone  = _prog.doneTopics.has(l.id);
    const started = pct > 0 && !isDone;
    const btnLabel = isDone ? 'Review' : started ? `▶ Continue (${pct}%)` : '▶ Start Learning';
    const btnColor = isDone ? '#155240' : 'var(--emerald)';
    return `
    <div class="lesson-card" style="display:flex;flex-direction:column;gap:8px;position:relative">
      ${isDone ? `<div class="lesson-done-badge" title="Completed">✓</div>` : ''}
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
      </div>
      <h4 style="font-size:14px;font-weight:700;color:var(--ink);line-height:1.4">${l.title}</h4>
      <p style="font-size:12.5px;color:var(--ink-muted);line-height:1.55;flex:1">${l.desc}</p>
      ${pct > 0 ? `<div class="lesson-progress-bar"><div class="lesson-progress-fill" style="width:${pct}%"></div></div>` : ''}
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:4px;flex-wrap:wrap">
        <span style="font-size:12px;color:var(--ink-muted)">⏱ ${l.duration} &nbsp;·&nbsp; ${l.count} lessons</span>
        <button class="start-lesson-btn" data-lid="${l.id}"
          style="padding:7px 16px;background:${btnColor};color:#fff;border:none;border-radius:7px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;white-space:nowrap">${btnLabel}</button>
      </div>
    </div>`;
  }).join('')
  : '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--ink-muted)">No topics found. Try different terms.</div>';

  grid.querySelectorAll('.start-lesson-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.style.background = '#155240');
    btn.addEventListener('mouseleave', () => btn.style.background = 'var(--emerald)');
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openLessonPlayer(parseInt(btn.dataset.lid));
    });
  });
}

function filterLessons() { renderLessons(); }

function renderPaths() {
  const grid = document.getElementById('pathsGrid');
  if (!grid || grid.dataset.rendered) return;
  grid.dataset.rendered = '1';
  grid.innerHTML = PATHS.map(p => `
    <div class="path-card" onclick="showPathModal(${p.id})">
      <span class="path-tag" style="background:${p.tagColor};color:${p.tagText}">${p.tag}</span>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="path-meta"><span>${p.lessons} lessons</span><span>${p.templates} templates</span><span>Done checklist</span></div>
      <div style="margin-top:8px"><button style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;padding:7px 16px;border-radius:6px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit" onclick="event.stopPropagation();startLearningPath(${p.id})">Start Learning Path →</button></div>
    </div>`).join('');
}

function renderPathDetail() {
  const id = window._activePathId || 1;
  const p  = PATHS.find(x => x.id === id);
  const d  = PATH_DETAILS[id];
  if (!p || !d) return;

  const accent      = d.accent;
  const accentPale  = d.accentPale;
  const lessonColor = {1:'#1e6b50',2:'#c4872a',3:'#2a6b9b',4:'#c05050',
                       5:'#1e6b50',6:'#c4872a',7:'#2a6b9b',8:'#c05050'};

  /* HERO */
  const fromAssessment = window._pathFromAssessment;
  const hero = document.getElementById('path-detail-hero');
  if (hero) {
    hero.innerHTML = `
      <div class="page-hero-inner">
        <div class="breadcrumb">
          <a onclick="navigate('home')">Home</a><span>›</span>
          ${fromAssessment
            ? `<a onclick="navigate('assessment')" style="color:rgba(255,255,255,.6)">Assessment Results</a><span>›</span>`
            : `<a onclick="navigate('learning-paths')">Learning Paths</a><span>›</span>`
          }
          ${p.title}
        </div>
        ${fromAssessment ? `
        <div style="display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.75);font-size:12.5px;font-weight:600;padding:6px 14px;border-radius:100px;margin-bottom:14px;cursor:pointer;transition:background .2s" onclick="navigate('assessment')" onmouseover="this.style.background='rgba(255,255,255,.14)'" onmouseout="this.style.background='rgba(255,255,255,.08)'">
          <span style="font-size:14px">←</span> Back to My Recommended Paths
        </div>` : ''}
        <div style="display:inline-flex;align-items:center;gap:8px;background:${d.tagBg};border:1px solid ${accent}44;color:${d.accentTag};font-size:12px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;padding:5px 12px;border-radius:100px;margin-bottom:16px">${p.tag}</div>
        <h1 style="max-width:680px">${p.title}</h1>
        <p style="max-width:600px">${d.outcome}</p>
        <div style="display:flex;gap:20px;flex-wrap:wrap;margin-top:16px">
          <div style="display:flex;align-items:center;gap:7px;font-size:13.5px;color:rgba(255,255,255,.7)"><span>📚</span>${p.lessons} lessons</div>
          <div style="display:flex;align-items:center;gap:7px;font-size:13.5px;color:rgba(255,255,255,.7)"><span>📄</span>${p.templates} templates</div>
          <div style="display:flex;align-items:center;gap:7px;font-size:13.5px;color:rgba(255,255,255,.7)"><span>⏱</span>${d.time}</div>
          ${d.cert ? '<div style="display:flex;align-items:center;gap:7px;font-size:13.5px;color:rgba(255,255,255,.7)"><span>🏅</span>Certificate on completion</div>' : ''}
        </div>
      </div>`;
  }

  /* STATS BAR */
  const stats = document.getElementById('pd-stats');
  if (stats) {
    stats.innerHTML = [
      {icon:'', val: p.lessons,       lbl:'Lessons'},
      {icon:'⏱',  val: d.time,          lbl:'Total time'},
      {icon:'',  val: p.templates,     lbl:'Templates'},
      {icon:'',  val: d.modules.length,lbl:'Modules'},
    ].map((s,i) => `
      <div style="flex:1;min-width:80px;padding:14px 16px;text-align:center;${i < 3 ? 'border-right:1px solid var(--border)' : ''}">
        <div style="font-size:20px;margin-bottom:4px">${s.icon}</div>
        <div style="font-size:18px;font-weight:800;color:${accent};line-height:1">${s.val}</div>
        <div style="font-size:11.5px;color:var(--ink-muted);margin-top:3px">${s.lbl}</div>
      </div>`).join('');
  }

  /* DESCRIPTION */
  const descBlock = document.getElementById('pd-desc-block');
  if (descBlock) descBlock.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap">
      <div style="flex:1;min-width:220px">
        <h3 style="font-size:16px;font-weight:800;margin-bottom:8px;color:var(--ink)">About this path</h3>
        <p style="font-size:14.5px;color:var(--ink-soft);line-height:1.65">${p.desc}</p>
      </div>
      <div style="background:${accentPale};border-radius:12px;padding:16px 18px;min-width:180px;flex-shrink:0">
        <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${accent};margin-bottom:8px">Good for you if…</div>
        <div style="font-size:13px;color:var(--ink-soft);line-height:1.6">You want a structured path from start to finish — with templates, lessons, and clear milestones — not just isolated topics.</div>
      </div>
    </div>`;

  /* MODULES */
  const modWrap = document.getElementById('pd-modules');
  if (modWrap) {
    modWrap.innerHTML = `<h3 style="font-size:17px;font-weight:800;margin-bottom:4px;color:var(--ink)">Modules</h3>
      <p style="font-size:13.5px;color:var(--ink-muted);margin-bottom:16px">Each module is a focused cluster of lessons. Complete them in order for best results.</p>` +
    d.modules.map((mod, mi) => {
      const modLessons = LESSONS.filter(l => mod.lessonIds.includes(l.id));
      return `
      <div style="background:#fff;border-radius:14px;border:1.5px solid var(--border);overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.04)">
        <!-- Module header -->
        <div style="padding:18px 22px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:background .15s"
          onclick="_toggleModule(this)"
          onmouseover="this.style.background='${accentPale}'" onmouseout="this.style.background='#fff'">
          <div style="width:40px;height:40px;border-radius:10px;background:${accentPale};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">${mod.icon}</div>
          <div style="flex:1">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${accent};margin-bottom:2px">Module ${mi+1}</div>
            <div style="font-size:15.5px;font-weight:700;color:var(--ink)">${mod.title.replace(/Module \d+: /,'')}</div>
            <div style="font-size:13px;color:var(--ink-muted);margin-top:2px">${mod.summary}</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;flex-shrink:0">
            <span style="font-size:12.5px;color:var(--ink-muted)">${modLessons.length} lesson${modLessons.length !== 1 ? 's' : ''}</span>
            <span class="mod-chevron" style="font-size:18px;color:${accent};transition:transform .25s;display:inline-block">›</span>
          </div>
        </div>
        <div class="mod-lessons" style="display:none;border-top:1.5px solid var(--border)">
          ${modLessons.length ? modLessons.map((l, li) => `
            <div style="display:flex;align-items:center;gap:14px;padding:14px 22px;border-bottom:1px solid ${li < modLessons.length-1 ? 'var(--border)' : 'transparent'};cursor:pointer;transition:background .15s"
              onclick="openLessonPlayer(${l.id},0,{pathId:${id},moduleIdx:${mi}})"
              onmouseover="this.style.background='${accentPale}'" onmouseout="this.style.background='transparent'">
              <div style="width:32px;height:32px;border-radius:8px;background:${_prog.doneTopics.has(l.id) ? 'var(--emerald)' : accentPale};display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;color:${_prog.doneTopics.has(l.id) ? '#fff' : 'inherit'}">${_prog.doneTopics.has(l.id) ? '✓' : '▶'}</div>
              <div style="flex:1">
                <div style="font-size:14px;font-weight:600;color:${_prog.doneTopics.has(l.id) ? 'var(--emerald)' : 'var(--ink)'}">${l.title}</div>
                <div style="display:flex;gap:10px;margin-top:3px">
                  <span style="font-size:12px;color:var(--ink-muted)">⏱ ${l.duration}</span>
                  <span style="font-size:12px;color:var(--ink-muted)">${l.count} sub-lessons</span>
                  ${_prog.doneTopics.has(l.id) ? '<span style="font-size:12px;background:var(--emerald-pale);color:var(--emerald);padding:1px 7px;border-radius:4px;font-weight:700">Done ✓</span>' : ''}
                </div>
              </div>
              <span style="font-size:13px;font-weight:700;color:${_prog.doneTopics.has(l.id) ? 'var(--emerald)' : accent};flex-shrink:0">${_prog.doneTopics.has(l.id) ? 'Review →' : 'Start →'}</span>
            </div>`).join('') : `
            <div style="padding:16px 22px;font-size:13.5px;color:var(--ink-muted)">Lessons for this module are included in related topics above.</div>`}
          <div style="padding:14px 22px;background:${accentPale}22">
            <button onclick="openLessonPlayer(${modLessons[0]?.id || 1}, 0, {pathId:${id},moduleIdx:${mi}})"
              style="padding:9px 20px;background:${accent};color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Start Module ${mi+1} →</button>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  /* WHAT YOU WILL LEARN */
  const outEl = document.getElementById('pd-outcomes');
  if (outEl) outEl.innerHTML = `
    <h3 style="font-size:17px;font-weight:800;margin-bottom:16px;color:var(--ink)">What you'll achieve</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px" class="outcomes-grid">
      ${d.outcomes.map(o => `
        <div style="display:flex;align-items:flex-start;gap:10px;padding:12px 14px;background:${accentPale};border-radius:10px">
          <span style="width:20px;height:20px;border-radius:50%;background:${accent};color:#fff;font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">✓</span>
          <span style="font-size:13.5px;color:var(--ink-soft);line-height:1.5">${o}</span>
        </div>`).join('')}
    </div>`;

  /* TEMPLATES */
  const tmplEl = document.getElementById('pd-templates');
  if (tmplEl) tmplEl.innerHTML = `
    <h3 style="font-size:17px;font-weight:800;margin-bottom:16px;color:var(--ink)">Included Templates</h3>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${d.tools.map(t => `
        <div style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--paper);border-radius:10px;border:1.5px solid var(--border)">
          <span style="font-size:24px">${t.icon}</span>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:700;color:var(--ink)">${t.name}</div>
            <div style="font-size:12.5px;color:var(--ink-muted)">${t.type}</div>
          </div>
          <div style="display:flex;gap:8px">
            <button onclick="downloadPDF('${t.name.replace(/'/g,'\\x27')}','${p.title.replace(/'/g,'\\x27')}')"
              style="padding:7px 13px;background:#dc2626;color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">PDF</button>
            <button onclick="downloadWord('${t.name.replace(/'/g,'\\x27')}','${p.title.replace(/'/g,'\\x27')}')"
              style="padding:7px 13px;background:#2563eb;color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">Word</button>
          </div>
        </div>`).join('')}
    </div>`;

  /* SIDEBAR — always re-render so progress stays live */
  const sidebar = document.getElementById('pd-sidebar');
  if (sidebar) {
    const relW = WEBINARS.find(w => w.id === d.relatedWebinar);
    sidebar.innerHTML = `
      <!-- Start CTA -->
      <div style="background:${accent};border-radius:14px;padding:24px 20px;text-align:center">
        <div style="font-size:32px;margin-bottom:10px">🎯</div>
        <div style="font-size:17px;font-weight:800;color:#fff;margin-bottom:8px;line-height:1.25">Ready to start?</div>
        <div style="font-size:13px;color:rgba(255,255,255,.7);margin-bottom:18px;line-height:1.5">Open the first lesson and begin your path to ${p.tag} results.</div>
        <button onclick="openLessonPlayer(${d.modules[0]?.lessonIds[0] || 1}, 0, {pathId:${id},moduleIdx:0})"
          style="width:100%;padding:13px 0;background:#fff;color:${accent};border:none;border-radius:9px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;margin-bottom:10px">▶ Start First Lesson</button>
        <button onclick="navigate('learning-paths')"
          style="width:100%;padding:10px 0;background:transparent;color:rgba(255,255,255,.7);border:1.5px solid rgba(255,255,255,.3);border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">← All Paths</button>
      </div>

      <!-- Progress tracker -->
      <div style="background:#fff;border-radius:14px;padding:20px;border:1.5px solid var(--border)">
        <div style="font-size:14px;font-weight:700;margin-bottom:14px;color:var(--ink)">Your Progress</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-size:13px;color:var(--ink-muted)">Modules completed</span>
          <span style="font-size:13px;font-weight:700;color:${accent}">
            ${d.modules.filter(m => m.lessonIds && m.lessonIds.every(id => _prog.doneTopics.has(id))).length} / ${d.modules.length}
          </span>
        </div>
        <div style="background:var(--paper);border-radius:100px;height:8px;overflow:hidden;margin-bottom:14px">
          ${(function(){
            const doneMods = d.modules.filter(m => m.lessonIds && m.lessonIds.every(id => _prog.doneTopics.has(id))).length;
            const pct = Math.round((doneMods / d.modules.length) * 100);
            return `<div style="height:100%;background:${accent};border-radius:100px;width:${pct}%;transition:width .4s ease"></div>`;
          })()}
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${d.modules.map((m,mi) => {
            const modDone = m.lessonIds && m.lessonIds.every(id => _prog.doneTopics.has(id));
            const modStarted = m.lessonIds && m.lessonIds.some(id => _prog.doneTopics.has(id) || _topicPct(id) > 0);
            const dotBg = modDone ? 'var(--emerald)' : modStarted ? 'var(--gold)' : 'transparent';
            const dotLabel = modDone ? '✓' : modStarted ? '…' : '';
            const dotColor = (modDone || modStarted) ? '#fff' : 'transparent';
            return `<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-muted)">
              <div style="width:16px;height:16px;border-radius:50%;border:2px solid ${modDone ? 'var(--emerald)' : modStarted ? 'var(--gold)' : 'var(--border)'};background:${dotBg};flex-shrink:0;transition:all .2s;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:${dotColor}">${dotLabel}</div>
              <span style="color:${modDone ? 'var(--emerald)' : modStarted ? 'var(--gold)' : 'var(--ink-muted)'};font-weight:${modDone || modStarted ? 600 : 400}">${m.icon} ${m.title.replace(/Module \d+: /,'')}</span>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Related webinar -->
      ${relW ? `
      <div style="background:var(--paper);border-radius:14px;padding:18px 18px;border:1.5px solid var(--border)">
        <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink-muted);margin-bottom:10px">Related Webinar</div>
        <div style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:6px;line-height:1.35">Webinar ${relW.num}: ${relW.title}</div>
        <div style="font-size:13px;color:var(--ink-muted);margin-bottom:12px">${relW.desc}</div>
        <button onclick="navigate('webinars');setTimeout(()=>showWebinarModal(${relW.id}),300)"
          style="width:100%;padding:9px 0;background:var(--ink);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">
          ▶ Watch Webinar ${relW.num}</button>
      </div>` : ''}`;
  }

  /* Footer */
  const foot = document.getElementById('path-detail-footer');
  if (foot && !foot.dataset.r) { foot.innerHTML = renderFooter(); foot.dataset.r = '1'; }
}

function _toggleModule(header) {
  const lessons  = header.nextElementSibling;
  const chevron  = header.querySelector('.mod-chevron');
  const open     = lessons.style.display === 'block';
  lessons.style.display = open ? 'none' : 'block';
  if (chevron) chevron.style.transform = open ? 'rotate(0deg)' : 'rotate(90deg)';
}

function renderWebinars(filter='all') {
  const grid = document.getElementById('webinarsGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? WEBINARS : WEBINARS.filter(w => w.status === filter);
  grid.innerHTML = filtered.map(w => {
    const d    = WEBINAR_DETAILS[w.id] || {};
    const col  = WEBINAR_COLORS[(w.id - 1) % WEBINAR_COLORS.length];
    const isOD = w.status === 'on-demand';
    return `
    <div class="webinar-card" onclick="showWebinarModal(${w.id})"
      style="background:#fff;border:1.5px solid var(--border);border-radius:16px;overflow:hidden;cursor:pointer;transition:all .25s;display:flex;flex-direction:column"
      onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px rgba(0,0,0,.1)';this.style.borderColor='${col}'"
      onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none';this.style.borderColor='var(--border)'">

      <!-- Thumbnail banner -->
      <div style="position:relative;height:156px;background:linear-gradient(135deg,#0c1520 0%,#112010 100%);overflow:hidden;flex-shrink:0">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 75% 40%,${col}55 0%,transparent 65%)"></div>
        <!-- Decorative dots -->
        <div style="position:absolute;top:18px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px">
          <div style="width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.12);border:2px solid rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px)">
            <span style="font-size:18px;margin-left:3px;color:#fff">${isOD ? '▶' : '🗓'}</span>
          </div>
          <span style="font-size:11px;color:rgba(255,255,255,.6);font-weight:600;letter-spacing:.04em">${isOD ? 'Watch Now · 60 min' : 'Register Free'}</span>
        </div>
        <!-- Webinar number pill -->
        <div style="position:absolute;top:10px;left:12px;background:${col};color:#fff;height:24px;padding:0 10px;border-radius:6px;display:flex;align-items:center;font-size:11px;font-weight:800;letter-spacing:.06em">W${w.num}</div>
        <!-- Status badge -->
        <div style="position:absolute;top:10px;right:12px">
          <span style="background:${isOD ? 'rgba(30,107,80,.85)' : 'rgba(196,135,42,.85)'};color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:100px;letter-spacing:.05em;backdrop-filter:blur(4px)">
            ${isOD ? '● ON DEMAND' : '◌ UPCOMING'}
          </span>
        </div>
        <!-- Speaker chip -->
        ${d.speaker ? `<div style="position:absolute;bottom:10px;left:12px;display:flex;align-items:center;gap:6px">
          <div style="width:22px;height:22px;border-radius:50%;background:${col};display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:800">${d.speaker[0]}</div>
          <span style="font-size:10.5px;color:rgba(255,255,255,.7);font-weight:600">${d.speaker}</span>
        </div>` : ''}
        <!-- Duration chip -->
        <div style="position:absolute;bottom:10px;right:12px;font-size:10px;color:rgba(255,255,255,.5);font-weight:600">60 min</div>
      </div>

      <!-- Body -->
      <div style="padding:18px 20px;flex:1;display:flex;flex-direction:column">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${col};margin-bottom:7px">${d.keyTopic || w.desc.slice(0,40) + '…'}</div>
        <h4 style="font-size:14.5px;font-weight:700;color:var(--ink);line-height:1.4;margin-bottom:8px">${w.title}</h4>
        <p style="font-size:13px;color:var(--ink-muted);line-height:1.5;flex:1">${w.desc}</p>
      </div>

      <!-- Footer -->
      <div style="padding:12px 20px;background:var(--paper);border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${w.includes.slice(0,2).map(i => `<span style="font-size:11px;color:var(--ink-muted);background:#fff;border:1px solid var(--border);padding:3px 8px;border-radius:100px">${i}</span>`).join('')}
          ${w.includes.length > 2 ? `<span style="font-size:11px;color:var(--ink-muted);background:#fff;border:1px solid var(--border);padding:3px 8px;border-radius:100px">+${w.includes.length-2} more</span>` : ''}
        </div>
        <div style="font-size:13px;font-weight:700;color:${col};flex-shrink:0;margin-left:10px">${isOD ? 'Watch →' : 'Register →'}</div>
      </div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════
   WORKBOOKS DATA + RENDER
══════════════════════════════════════════════════════ */
const WORKBOOKS = [
  /* ── CAPABILITY 1: Fundraising Readiness & Direction ── */
  {id:1, capNum:1, title:'Fundraising Readiness & Direction Workbook', category:'cap-readiness', color:'var(--emerald)', colorPale:'var(--emerald-pale)', exercises:6, minutes:45, level:'Beginner',
   desc:'Establish your NGO\'s minimum fundraising foundation — set goals, choose channels, assign team roles, and build your 90-day action plan.',
   steps:['Write your annual fundraising goal with a specific amount and 2–3 priority channels','Audit your current fundraising activities: what is working and what is not','Assign one fundraising responsibility to each team member and document it','Design a weekly fundraising routine (pipeline review, outreach blocks, team check-in)','Draft a 90-day readiness plan with 3 priorities per 30-day block','Score yourself on the 5 readiness criteria and identify your #1 gap to close'],
   output:'A written fundraising goal, a team responsibility map, a weekly routine, and a live 90-day action plan.'},

  /* ── CAPABILITY 2: Value Proposition, Messaging & Case for Support ── */
  {id:2, capNum:2, title:'Value Proposition & Case for Support Workbook', category:'cap-messaging', color:'var(--gold)', colorPale:'var(--gold-pale)', exercises:6, minutes:50, level:'Beginner',
   desc:'Build a compelling, evidence-based case for support and three audience-specific messages that make donors want to give.',
   steps:['Write your NGO one-liner: "We help [who] achieve [what] by [how]"','Draft the problem statement with 3 data points and a beneficiary story','List 5 credibility proof points (numbers, testimonials, recognition)','Write 3 message versions: one for grants, one for corporates, one for individuals','Draft your one-page case for support using the 6-section template','Practice and record your 60-second pitch; refine until it is natural'],
   output:'A polished one-page case for support, 3 audience message versions, and a 60-second pitch script.'},

  /* ── CAPABILITY 3: Program Packaging into Fundable Offers ── */
  {id:3, capNum:3, title:'Program Packaging into Fundable Offers Workbook', category:'cap-packaging', color:'var(--sky)', colorPale:'var(--sky-pale)', exercises:6, minutes:50, level:'Beginner',
   desc:'Transform your programs from activity descriptions into fundable offers with outcomes, unit costs, and tiered giving options.',
   steps:['Choose your strongest program to package first','Map outputs vs outcomes — list at least 3 of each','Calculate the unit cost: total program budget ÷ number of beneficiaries','Design 3 funding tiers (Bronze/Silver/Gold) with named deliverables per level','Build a one-page Funding Pack Card for the program','Test the Pack Card with 3 external readers and revise based on feedback'],
   output:'A Funding Pack Card per program, a unit cost sheet, and a Bronze/Silver/Gold funding tier menu.'},

  /* ── CAPABILITY 4: Prospecting & Donor Research ── */
  {id:4, capNum:4, title:'Prospecting & Donor Research Workbook', category:'cap-prospecting', color:'var(--rose)', colorPale:'var(--rose-pale)', exercises:5, minutes:40, level:'Beginner',
   desc:'Build and qualify a prospect list for 2 priority channels using a structured research and scoring system.',
   steps:['Write ideal donor profiles for each of your 2 priority funding channels','Use your network and 3 research sources to build a list of 20 prospects','Score each prospect on fit (1–3), capacity (1–3), and relationship warmth (1–3)','Rank prospects and create an outreach priority list (Top 5, Next 10, Watch List)','Block 30 minutes per week in your calendar for ongoing prospect research'],
   output:'A qualified prospect list with 20 contacts, a scoring sheet, and a monthly list-building habit plan.'},

  /* ── CAPABILITY 5: Relationship Management & Pipeline Discipline ── */
  {id:5, capNum:5, title:'Donor Pipeline & Relationship Management Workbook', category:'cap-pipeline', color:'var(--emerald)', colorPale:'var(--emerald-pale)', exercises:5, minutes:40, level:'Beginner',
   desc:'Set up a donor pipeline, assign next steps to every contact, and build a weekly review routine that keeps deals moving.',
   steps:['Set up your pipeline tracker with 6 stages: Lead → Outreach → Meeting → Proposal → Decision → Won/Lost','Add every active prospect to the tracker with their current stage','Write one follow-up message template for each pipeline stage','Assign a next step and deadline to every contact in the pipeline','Schedule a 30-minute weekly pipeline review and make it a recurring team event'],
   output:'A live donor pipeline sheet, a set of follow-up templates for each stage, and a weekly review protocol.'},

  /* ── CAPABILITY 6: Asking & Closing ── */
  {id:6, capNum:6, title:'Asking & Closing Workbook', category:'cap-asking', color:'var(--gold)', colorPale:'var(--gold-pale)', exercises:5, minutes:40, level:'Intermediate',
   desc:'Write your ask script, handle the top 5 objections, and build a post-meeting follow-up process that closes commitments.',
   steps:['Prepare a meeting call plan for your top 3 pipeline contacts (objective, amount, talking points)','Write your ask statement: "I\'d like to invite you to support [program] with [amount], which will [impact]"','Write confident responses to 5 common donor objections','Draft a 24-hour post-meeting follow-up email template','Make at least 2 formal asks this month and log the outcome in your pipeline'],
   output:'A ready-to-use ask script, an objection handling sheet, and a post-meeting follow-up template.'},

  /* ── CAPABILITY 7: Proposal & Grant Capability ── */
  {id:7, capNum:7, title:'Proposal & Grant Capability Workbook', category:'cap-grants', color:'var(--sky)', colorPale:'var(--sky-pale)', exercises:8, minutes:65, level:'Intermediate',
   desc:'Walk through all 10 sections of a winning grant proposal — from problem statement and M&E framework to budget narrative and compliance checklist.',
   steps:['Apply the Go/No-Go matrix to your next 3 grant opportunities','Draft a 2-page concept note for your strongest program','Write a 3-paragraph problem statement with data sources','Define 3–5 SMART objectives tied to your program\'s theory of change','Build a line-item budget with narrative justification per line','Design a monitoring & evaluation framework with 3 indicators and a baseline','Write the executive summary last — after all other sections are drafted','Create a grant compliance checklist: what to report, when, and how'],
   output:'A Go/No-Go matrix, a complete grant proposal first draft, a budget narrative, and a compliance checklist.'},

  /* ── CAPABILITY 8: Corporate Partnerships ── */
  {id:8, capNum:8, title:'Corporate Partnerships Workbook', category:'cap-corporate', color:'var(--rose)', colorPale:'var(--rose-pale)', exercises:5, minutes:45, level:'Intermediate',
   desc:'Research corporate prospects, build a tiered partnership menu, and create a pitch and renewal system that sustains long-term relationships.',
   steps:['Build a target list of 10 companies whose CSR priorities align with your programs','Map your programs to each company\'s stated CSR focus areas','Design your partnership menu: 3 tiers with named deliverables and recognition benefits','Write a 2-page partnership brief tailored to your top prospect','Draft a 1-page partnership renewal report template with 5 key metrics'],
   output:'A corporate target list, a partnership tier menu, a 2-page partnership brief, and a renewal report template.'},

  /* ── CAPABILITY 9: Digital Fundraising & Campaign Execution ── */
  {id:9, capNum:9, title:'Digital Fundraising & Campaign Execution Workbook', category:'cap-digital', color:'var(--emerald)', colorPale:'var(--emerald-pale)', exercises:7, minutes:55, level:'Intermediate',
   desc:'Design and launch a 14-day digital fundraising campaign from hook and goal-setting to post-campaign donor follow-up.',
   steps:['Write your campaign hook in one sentence: the emotional idea that stops the scroll','Set your campaign goal, timeline, unit cost, and target audience','Audit and optimise your donation page: load speed, clear ask, impact statement','Draft your 14-day content calendar: Days 1–3 tease, 4–7 launch, 8–12 push, 13–14 close','Write 3 WhatsApp mobilisation scripts: launch, mid-campaign update, final push','Define 5 tracking metrics: visits, conversion rate, average gift, shares, total raised','Design a post-campaign donor thank-you and impact sequence (3 touchpoints)'],
   output:'A 14-day campaign plan, a content calendar, WhatsApp scripts, a donation page checklist, and a post-campaign sequence.'},

  /* ── CAPABILITY 10: Donor Retention & Stewardship ── */
  {id:10, capNum:10, title:'Donor Retention & Stewardship Workbook', category:'cap-retention', color:'var(--gold)', colorPale:'var(--gold-pale)', exercises:6, minutes:50, level:'Beginner',
   desc:'Build a 90-day donor stewardship system — from 48-hour thank-you to renewal ask — that turns one-time donors into loyal supporters.',
   steps:['Write a 48-hour thank-you message template personalised for your most common gift type','Draft a 30-day welcome journey with 3 touchpoints (impact update, story, check-in)','Create a 60-day engagement message that delivers value without asking for anything','Design a one-page impact report with 3 metrics, one story, and one photo placeholder','Write a 90-day renewal ask under 150 words that references the donor\'s previous gift','Build a monthly giving upgrade ask for donors who have given 3+ times'],
   output:'A 48-hour thank-you template, a 30/60/90-day stewardship journey, a one-page impact report, and a renewal ask script.'},
];

const WB_COLORS = {
  'cap-readiness':'var(--emerald)', 'cap-messaging':'var(--gold)', 'cap-packaging':'var(--sky)',
  'cap-prospecting':'var(--rose)', 'cap-pipeline':'var(--emerald)', 'cap-asking':'var(--gold)',
  'cap-grants':'var(--sky)', 'cap-corporate':'var(--rose)', 'cap-digital':'var(--emerald)',
  'cap-retention':'var(--gold)'
};
const WB_COLOR_PALES = {
  'cap-readiness':'var(--emerald-pale)', 'cap-messaging':'var(--gold-pale)', 'cap-packaging':'var(--sky-pale)',
  'cap-prospecting':'var(--rose-pale)', 'cap-pipeline':'var(--emerald-pale)', 'cap-asking':'var(--gold-pale)',
  'cap-grants':'var(--sky-pale)', 'cap-corporate':'var(--rose-pale)', 'cap-digital':'var(--emerald-pale)',
  'cap-retention':'var(--gold-pale)'
};
const WB_LABELS = {
  'cap-readiness':'Capability 1 · Readiness', 'cap-messaging':'Capability 2 · Messaging',
  'cap-packaging':'Capability 3 · Packaging', 'cap-prospecting':'Capability 4 · Prospecting',
  'cap-pipeline':'Capability 5 · Pipeline', 'cap-asking':'Capability 6 · Asking & Closing',
  'cap-grants':'Capability 7 · Grants', 'cap-corporate':'Capability 8 · Corporate',
  'cap-digital':'Capability 9 · Digital', 'cap-retention':'Capability 10 · Retention'
};
let _wbFilter = 'all';

function setWbFilter(cat, btn) {
  _wbFilter = cat;
  document.querySelectorAll('#wbFilterRow .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderWorkbooks();
}

function renderWorkbooks() {
  const grid = document.getElementById('wbGrid');
  if (!grid) return;
  const list = _wbFilter === 'all' ? WORKBOOKS : WORKBOOKS.filter(w => w.category === _wbFilter);
  const countEl = document.getElementById('wb-total-count');
  if (countEl) countEl.textContent = WORKBOOKS.length;
  grid.innerHTML = list.map(w => {
    const col = WB_COLORS[w.category] || 'var(--emerald)';
    const pale = WB_COLOR_PALES[w.category] || 'var(--emerald-pale)';
    const lbl = WB_LABELS[w.category] || w.category;
    const capModel = typeof CAP_MODEL !== 'undefined' ? CAP_MODEL.find(c => c.num === w.capNum) : null;
    const capIcon = capModel ? capModel.icon : '📓';
    return `
    <div class="tool-card" style="cursor:pointer;display:flex;flex-direction:column;position:relative;overflow:hidden" onclick="openWorkbookModal(${w.id})">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${col}"></div>
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;padding-top:4px">
        <div style="width:44px;height:44px;border-radius:10px;background:${pale};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${capIcon}</div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;flex-wrap:wrap">
            <span style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;background:${pale};color:${col};padding:2px 10px;border-radius:100px">Cap ${w.capNum}</span>
            <span style="font-size:10px;font-weight:600;color:var(--ink-muted);background:var(--paper);padding:2px 8px;border-radius:100px">${w.level}</span>
          </div>
          <h4 style="font-size:14px;font-weight:700;color:var(--ink);line-height:1.35;margin:0">${w.title}</h4>
        </div>
      </div>
      <p style="font-size:13px;color:var(--ink-muted);line-height:1.5;flex:1;margin-bottom:14px">${w.desc}</p>
      <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border);padding-top:12px;margin-top:auto">
        <span style="font-size:12px;color:var(--ink-muted)">${w.exercises} exercises · ~${w.minutes} min</span>
        <span style="font-size:12.5px;font-weight:600;color:${col};display:flex;align-items:center;gap:4px">Open Workbook →</span>
      </div>
    </div>`;
  }).join('');
}

function openWorkbookModal(id) {
  const w = WORKBOOKS.find(x => x.id === id);
  if (!w) return;
  const col = WB_COLORS[w.category] || 'var(--emerald)';
  const pale = WB_COLOR_PALES[w.category] || 'var(--emerald-pale)';
  const lbl = WB_LABELS[w.category] || w.category;
  const stepsHtml = w.steps.map((s, i) => `
    <div style="display:flex;gap:12px;padding:11px 14px;background:#fff;border:1.5px solid var(--border);border-radius:9px;margin-bottom:7px;align-items:flex-start;cursor:pointer;transition:border-color .15s"
         onmouseover="this.style.borderColor='${col}'" onmouseout="this.style.borderColor='var(--border)'">
      <div style="width:24px;height:24px;border-radius:50%;background:${pale};color:${col};font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">${i+1}</div>
      <span style="font-size:13.5px;color:var(--ink-soft);line-height:1.5">${s}</span>
    </div>`).join('');

  const capM = typeof CAP_MODEL !== 'undefined' ? CAP_MODEL.find(c => c.num === w.capNum) : null;
  const capIconM = capM ? capM.icon : '📓';
  const capTitleM = capM ? capM.title : lbl;
  openModal(capIconM + ' ' + w.title, `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;align-items:center">
      <span style="background:${pale};color:${col};padding:3px 14px;border-radius:100px;font-size:12px;font-weight:800">Core Capability ${w.capNum}</span>
      <span style="background:var(--paper);color:var(--ink-soft);padding:3px 12px;border-radius:100px;font-size:12px">${w.exercises} exercises · ~${w.minutes} min · ${w.level}</span>
    </div>
    <p style="font-size:12px;color:var(--ink-muted);background:var(--paper);padding:8px 14px;border-radius:8px;margin-bottom:14px;line-height:1.5">This workbook is dedicated to <strong style="color:var(--ink)">${capTitleM}</strong> — one of the 10 Core Capabilities in the FundReady Academy framework.</p>
    <p style="font-size:14.5px;color:var(--ink-soft);line-height:1.65;margin-bottom:20px">${w.desc}</p>
    <div style="background:var(--paper);border-radius:12px;padding:18px;margin-bottom:16px">
      <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:${col};margin-bottom:14px">${w.exercises} EXERCISES IN THIS WORKBOOK</div>
      ${stepsHtml}
    </div>
    <div style="background:${pale};border-radius:12px;padding:16px;margin-bottom:18px">
      <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:${col};margin-bottom:8px">WHAT YOU'LL PRODUCE</div>
      <p style="font-size:13.5px;color:var(--ink);margin:0;line-height:1.6">${w.output}</p>
    </div>
    <div id="wbModalBtns" style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-primary" style="background:#dc2626;border-color:#dc2626" onclick="downloadPDF('${w.title.replace(/'/g,'')}','${w.title.replace(/'/g,'')}');closeModal()">Download PDF</button>
      <button class="btn-primary" style="background:#2563eb;border-color:#2563eb" onclick="downloadWord('${w.title.replace(/'/g,'')}','${w.title.replace(/'/g,'')}');closeModal()">Download Word</button>
      <button class="btn-outline" onclick="closeModal();navigate('sign-in')">Start Online →</button>
    </div>`);
}

/* ══════════════════════════════════════════════════════
   VIDEO GUIDES DATA + RENDER
══════════════════════════════════════════════════════ */
const VIDEO_GUIDES = [
  {id:1, title:'How to Write a Winning Grant Proposal in 5 Steps', category:'grants', duration:'8:42', level:'Beginner', color:'var(--emerald)', colorPale:'var(--emerald-pale)', gradient:'rgba(217,61,26,.35)',
   desc:'Walk through the exact structure institutional funders expect — from problem statement to evaluation framework.',
   chapters:['0:00 — Introduction & what funders look for','1:10 — Problem statement with data','2:45 — Writing SMART objectives','4:20 — Budget narrative essentials','6:30 — Monitoring & evaluation section','7:50 — Proofreading checklist'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'},

  {id:2, title:'Building Your First Major Donor Pipeline', category:'individual-giving', duration:'11:15', level:'Intermediate', color:'var(--gold)', colorPale:'var(--gold-pale)', gradient:'rgba(201,109,8,.35)',
   desc:'Learn how to identify, qualify, and cultivate your top 20 prospects — with a live walkthrough of the pipeline template.',
   chapters:['0:00 — Why a pipeline changes everything','1:30 — Ideal donor profile framework','3:20 — Prospect research in 30 min/week','5:40 — Scoring prospects on 3 criteria','7:55 — Setting up pipeline stages','9:30 — Weekly pipeline review routine'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'},

  {id:3, title:'Crafting a Case for Support That Converts', category:'messaging', duration:'6:30', level:'Beginner', color:'var(--sky)', colorPale:'var(--sky-pale)', gradient:'rgba(85,51,168,.35)',
   desc:'The four-part formula for writing a compelling case for support — with real NGO examples from the MENA region.',
   chapters:['0:00 — The 4-part formula overview','1:00 — Part 1: The problem (with data)','2:15 — Part 2: Your solution','3:30 — Part 3: Proof & credibility','4:45 — Part 4: The specific ask','5:50 — Before & after example'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'},

  {id:4, title:'Running a 14-Day Online Fundraising Campaign', category:'digital', duration:'14:05', level:'Intermediate', color:'var(--rose)', colorPale:'var(--rose-pale)', gradient:'rgba(184,50,82,.35)',
   desc:'Full walkthrough of campaign setup, content scheduling, donor page optimisation, and post-campaign reporting.',
   chapters:['0:00 — Campaign overview & goal setting','2:10 — Donation page setup & optimisation','4:30 — 14-day content calendar walkthrough','7:15 — WhatsApp ambassador activation','9:40 — Mid-campaign momentum tactics','11:20 — Closing push & final 24 hours','12:50 — Post-campaign reporting'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'},

  {id:5, title:'Setting Your Annual Fundraising Strategy', category:'strategy', duration:'9:55', level:'Advanced', color:'var(--emerald)', colorPale:'var(--emerald-pale)', gradient:'rgba(217,61,26,.35)',
   desc:'How to set realistic revenue targets by stream, map key relationships, and build a month-by-month execution plan.',
   chapters:['0:00 — Auditing last year\'s income mix','1:40 — Setting targets by stream','3:15 — The funding relationship map','5:00 — Building a 12-month calendar','7:10 — Assigning team responsibilities','8:30 — Board presentation template'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'},

  {id:6, title:'Understanding Funder Due Diligence Requirements', category:'grants', duration:'7:20', level:'Intermediate', color:'var(--gold)', colorPale:'var(--gold-pale)', gradient:'rgba(201,109,8,.35)',
   desc:'What institutional funders check before they approve your grant — and how to prepare your organisation in advance.',
   chapters:['0:00 — The 5 due diligence areas','1:30 — Financial documentation checklist','3:00 — Governance & safeguarding requirements','4:40 — Track record & references','5:55 — Red flags that kill applications','6:40 — 30-day preparation plan'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'},

  {id:7, title:'How to Write a Donor Thank-You That Builds Loyalty', category:'messaging', duration:'5:45', level:'Beginner', color:'var(--sky)', colorPale:'var(--sky-pale)', gradient:'rgba(85,51,168,.35)',
   desc:'The anatomy of a thank-you message that makes donors feel valued and increases second-gift likelihood by 3x.',
   chapters:['0:00 — Why most thank-you messages fail','1:00 — The 5-element thank-you formula','2:30 — Email vs. call vs. handwritten note','3:45 — Personalisation at scale','4:40 — Major donor vs. mass donor approach'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'},

  {id:8, title:'Corporate Fundraising: From Cold Outreach to Partnership', category:'individual-giving', duration:'12:30', level:'Intermediate', color:'var(--gold)', colorPale:'var(--gold-pale)', gradient:'rgba(201,109,8,.35)',
   desc:'A step-by-step guide to approaching companies, pitching CSR alignment, and closing a corporate partnership.',
   chapters:['0:00 — Corporate vs. individual giving mindset','1:50 — Researching CSR priorities','3:40 — Building your partnership tiers','5:10 — The cold outreach email formula','7:00 — Running the first meeting','9:15 — Negotiating deliverables','10:50 — Reporting to corporate partners'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'},

  {id:9, title:'Impact Reporting That Donors Actually Read', category:'messaging', duration:'8:10', level:'Intermediate', color:'var(--sky)', colorPale:'var(--sky-pale)', gradient:'rgba(85,51,168,.35)',
   desc:'How to turn your programme data into a one-page impact report that inspires renewals and upgrades.',
   chapters:['0:00 — The problem with long reports','1:20 — The one-page impact report format','2:50 — Choosing the right 3 metrics','4:10 — Writing the story of change','5:40 — Design principles for non-designers','6:55 — Distribution strategy'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'},

  {id:10, title:'Grant Calendar: Never Miss a Deadline Again', category:'grants', duration:'6:15', level:'Beginner', color:'var(--emerald)', colorPale:'var(--emerald-pale)', gradient:'rgba(217,61,26,.35)',
   desc:'Build a 12-month grant calendar that keeps you ahead of deadlines and balances your proposal workload.',
   chapters:['0:00 — Why grant calendars fail','1:00 — The rolling 12-month approach','2:20 — Blocking production time backwards','3:45 — Balancing multiple deadlines','4:50 — Team calendar integration','5:30 — Monthly review habit'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'},

  {id:11, title:'Social Media Fundraising: What Actually Works', category:'digital', duration:'10:40', level:'Intermediate', color:'var(--rose)', colorPale:'var(--rose-pale)', gradient:'rgba(184,50,82,.35)',
   desc:'Which platforms drive the most donations for NGOs, how to write captions that convert, and how to track ROI.',
   chapters:['0:00 — Platform comparison for NGOs','2:00 — The caption formula for donations','3:50 — Instagram vs Facebook vs LinkedIn','5:30 — Paid vs organic strategy','7:10 — Tracking link clicks and conversions','8:45 — Monthly content planning system'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'},

  {id:12, title:'Fundraising Readiness: The 90-Day Sprint', category:'strategy', duration:'15:20', level:'Advanced', color:'var(--emerald)', colorPale:'var(--emerald-pale)', gradient:'rgba(217,61,26,.35)',
   desc:'A full walkthrough of the FundReady 90-Day Roadmap — Phase 1 foundations, Phase 2 outreach, Phase 3 systems.',
   chapters:['0:00 — The 90-day framework overview','2:30 — Phase 1: Foundations (Days 1–30)','5:10 — Phase 2: Outreach (Days 31–60)','8:40 — Phase 3: Systems (Days 61–90)','11:20 — Key milestones & checkpoints','13:00 — What success looks like at Day 90'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'},

  {id:13, title:'Prospect Research in 30 Minutes a Week', category:'individual-giving', duration:'7:50', level:'Beginner', color:'var(--gold)', colorPale:'var(--gold-pale)', gradient:'rgba(201,109,8,.35)',
   desc:'The minimum viable research routine to build and qualify a prospect list without it consuming your week.',
   chapters:['0:00 — The research trap (and how to escape it)','1:30 — 3 free research tools that work','3:00 — The 5-minute prospect card','4:20 — Batch researching vs. ad hoc','5:40 — When to stop researching and start outreaching','7:00 — Monthly list refresh routine'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'},

  {id:14, title:'Fundraising Conversations: The Ask Meeting Framework', category:'individual-giving', duration:'9:00', level:'Intermediate', color:'var(--sky)', colorPale:'var(--sky-pale)', gradient:'rgba(85,51,168,.35)',
   desc:'How to structure a donor meeting from opening to ask to follow-up — including how to handle objections with confidence.',
   chapters:['0:00 — Mindset before the meeting','1:20 — The 3-part meeting structure','3:10 — How to make the ask (exact script)','5:00 — Handling the top 5 objections','6:40 — What to do right after the meeting','7:50 — Follow-up sequence'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'},

  {id:15, title:'Email Fundraising: Sequences That Convert', category:'digital', duration:'8:55', level:'Intermediate', color:'var(--rose)', colorPale:'var(--rose-pale)', gradient:'rgba(184,50,82,.35)',
   desc:'Build a 5-email cultivation sequence that moves cold prospects to warm donors — with subject lines and copy examples.',
   chapters:['0:00 — Why one email never works','1:15 — The 5-email cultivation sequence','2:50 — Email 1: The warm introduction','4:00 — Emails 2–4: Value delivery','5:30 — Email 5: The ask','6:45 — Subject line formulas that work','7:50 — Measuring open and click rates'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'},

  {id:16, title:'Board Fundraising: Getting Your Board to Help', category:'strategy', duration:'11:05', level:'Advanced', color:'var(--emerald)', colorPale:'var(--emerald-pale)', gradient:'rgba(217,61,26,.35)',
   desc:'How to engage your board as active fundraising ambassadors — with clear roles, accountability, and a board ask script.',
   chapters:['0:00 — Why board members resist fundraising','1:40 — The 4 fundraising roles for board members','3:20 — Setting board giving expectations','5:00 — The ambassador role (what it looks like in practice)','7:10 — The board fundraising report template','9:00 — Running a productive board fundraising session'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'},

  {id:17, title:'Funding Diversification: Reducing Your Dependency Risk', category:'strategy', duration:'10:15', level:'Advanced', color:'var(--sky)', colorPale:'var(--sky-pale)', gradient:'rgba(85,51,168,.35)',
   desc:'How to diagnose over-dependency on one funder and build a diversification roadmap without disrupting cash flow.',
   chapters:['0:00 — The concentration risk test','1:30 — Mapping your income sources','3:00 — The 40% rule explained','4:20 — Choosing the right new streams','6:10 — The 12-month diversification plan','8:30 — Communicating the strategy to your board'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'},

  {id:18, title:'Year-End Giving: Maximising the December Rush', category:'digital', duration:'9:30', level:'Intermediate', color:'var(--rose)', colorPale:'var(--rose-pale)', gradient:'rgba(184,50,82,.35)',
   desc:'How to plan and execute a year-end giving campaign — from November warm-up through December close.',
   chapters:['0:00 — Why year-end giving matters','1:20 — November: warming up your donors','2:50 — Giving Tuesday strategy','4:30 — December 1–20: the steady build','6:00 — December 26–31: the final push','7:40 — Post-campaign stewardship','8:50 — Setting next year\'s goal'],
   videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'},
];

const VG_COLORS = {
  grants:'var(--emerald)', 'individual-giving':'var(--gold)', messaging:'var(--sky)',
  digital:'var(--rose)', strategy:'#7c3aed'
};
const VG_COLOR_PALES = {
  grants:'var(--emerald-pale)', 'individual-giving':'var(--gold-pale)', messaging:'var(--sky-pale)',
  digital:'var(--rose-pale)', strategy:'#f5f3ff'
};
const VG_LABELS = {
  grants:'Grants', 'individual-giving':'Individual Giving', messaging:'Messaging',
  digital:'Digital', strategy:'Strategy'
};
/* Maps each video id → the most relevant workbook id to open directly */
const VG_WORKBOOK_MAP = {
  1:  7,   /* Grant Proposal → Cap 7 Grant Workbook */
  2:  5,   /* Major Donor Pipeline → Cap 5 Pipeline Workbook */
  3:  2,   /* Case for Support → Cap 2 Messaging Workbook */
  4:  9,   /* Online Campaign → Cap 9 Digital Workbook */
  5:  1,   /* Annual Strategy → Cap 1 Readiness Workbook */
  6:  7,   /* Due Diligence → Cap 7 Grant Workbook */
  7:  10,  /* Thank-You → Cap 10 Retention Workbook */
  8:  8,   /* Corporate Fundraising → Cap 8 Corporate Workbook */
  9:  10,  /* Impact Reporting → Cap 10 Retention Workbook */
  10: 7,   /* Grant Calendar → Cap 7 Grant Workbook */
  11: 9,   /* Social Media → Cap 9 Digital Workbook */
  12: 1,   /* 90-Day Sprint → Cap 1 Readiness Workbook */
  13: 4,   /* Prospect Research → Cap 4 Prospecting Workbook */
  14: 6,   /* Ask Meeting → Cap 6 Asking & Closing Workbook */
  15: 9,   /* Email Sequences → Cap 9 Digital Workbook */
  16: 1,   /* Board Fundraising → Cap 1 Readiness Workbook */
  17: 3,   /* Diversification → Cap 3 Packaging Workbook */
  18: 9,   /* Year-End Giving → Cap 9 Digital Workbook */
};
let _vgFilter = 'all';

function setVgFilter(cat, btn) {
  _vgFilter = cat;
  document.querySelectorAll('#vgFilterRow .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderVideoGuides();
}

function renderVideoGuides() {
  const grid = document.getElementById('vgGrid');
  if (!grid) return;
  const list = _vgFilter === 'all' ? VIDEO_GUIDES : VIDEO_GUIDES.filter(v => v.category === _vgFilter);
  const countEl = document.getElementById('vg-total-count');
  if (countEl) countEl.textContent = VIDEO_GUIDES.length;
  grid.innerHTML = list.map(v => {
    const col = VG_COLORS[v.category] || 'var(--emerald)';
    const pale = VG_COLOR_PALES[v.category] || 'var(--emerald-pale)';
    const lbl = VG_LABELS[v.category] || v.category;
    const levelBadge = {Beginner:'#16a34a',Intermediate:'#c96d08',Advanced:'#b83252'}[v.level] || '#16a34a';
    return `
    <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;cursor:pointer;transition:all .25s"
         onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--shadow-lg)'"
         onmouseout="this.style.transform='';this.style.boxShadow=''"
         onclick="openVideoModal(${v.id})">
      <div style="background:var(--ink);aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 60% 40%,${v.gradient},transparent 65%)"></div>
        <div style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.15);border:2px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-size:22px;z-index:1;transition:transform .2s"
             onmouseover="this.style.transform='scale(1.12)'" onmouseout="this.style.transform=''">▶</div>
        <div style="position:absolute;bottom:10px;right:12px;background:rgba(0,0,0,.65);color:#fff;font-size:11px;font-weight:600;padding:3px 8px;border-radius:4px">${v.duration}</div>
        <div style="position:absolute;top:10px;left:12px;background:${col};color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:100px;text-transform:uppercase;letter-spacing:.06em">${lbl}</div>
      </div>
      <div style="padding:18px">
        <h4 style="font-size:14.5px;font-weight:700;color:var(--ink);margin-bottom:7px;line-height:1.35">${v.title}</h4>
        <p style="font-size:13px;color:var(--ink-muted);line-height:1.5;margin-bottom:12px">${v.desc}</p>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:12px;color:var(--ink-muted)">${v.duration}</span>
          <span style="font-size:12.5px;font-weight:600;color:${col}">Watch →</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

function openVideoModal(id) {
  const v = VIDEO_GUIDES.find(x => x.id === id);
  if (!v) return;
  const col = VG_COLORS[v.category] || 'var(--emerald)';
  const pale = VG_COLOR_PALES[v.category] || 'var(--emerald-pale)';
  const lbl = VG_LABELS[v.category] || v.category;
  const chaptersHtml = v.chapters.map(c => `
    <div style="padding:8px 12px;background:#fff;border:1px solid var(--border);border-radius:7px;font-size:13px;color:var(--ink-soft);display:flex;gap:8px;align-items:center;margin-bottom:6px">
      <span style="color:${col};font-size:14px;flex-shrink:0">▶</span>${c}
    </div>`).join('');

  openModal('' + v.title, `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
      <span style="background:${pale};color:${col};padding:3px 12px;border-radius:100px;font-size:12px;font-weight:700">${lbl}</span>
      <span style="background:var(--paper);color:var(--ink-soft);padding:3px 12px;border-radius:100px;font-size:12px">⏱ ${v.duration}</span>
    </div>
    <div style="position:relative;width:100%;padding-bottom:56.25%;background:#1c1118;border-radius:12px;overflow:hidden;margin-bottom:16px">
      <div id="vg-video-slot" data-src="${v.videoUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;background:#111"></div>
    </div>
    <p style="font-size:14px;color:var(--ink-soft);line-height:1.65;margin-bottom:18px">${v.desc}</p>
    <div style="background:var(--paper);border-radius:12px;padding:16px;margin-bottom:16px">
      <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:${col};margin-bottom:12px">${v.chapters.length} CHAPTERS</div>
      ${chaptersHtml}
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-primary" onclick="closeModal();navigate('sign-in')">Watch Full Video</button>
      <button class="btn-outline" onclick="const wid=VG_WORKBOOK_MAP[${v.id}];if(wid){closeModal();setTimeout(()=>openWorkbookModal(wid),50);}else{closeModal();navigate('workbooks');}">Related Workbooks</button>
    </div>`);
}

function renderWorkbooksPage() {
  renderWorkbooks();
}
function renderVideoGuidesPage() {
  renderVideoGuides();
}

function renderTools(filter='all') {
  const grid = document.getElementById('toolsGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? TOOLS : TOOLS.filter(t => t.category === filter);
  grid.innerHTML = filtered.map(t => {
    const safeTitle = t.title.replace(/'/g, '\\x27').replace(/"/g, '&quot;');
    const catColor = {planning:'var(--emerald)',messaging:'var(--gold)',pipeline:'var(--sky)',grants:'var(--rose)',digital:'#7c3aed'}[t.category] || 'var(--emerald)';
    const catBg    = {planning:'var(--emerald-pale)',messaging:'var(--gold-pale)',pipeline:'var(--sky-pale)',grants:'var(--rose-pale)',digital:'#f5f3ff'}[t.category] || 'var(--emerald-pale)';
    return `
    <div class="tool-card" style="cursor:default">
      <div style="display:flex;align-items:flex-start;gap:12px">
        <div style="width:44px;height:44px;border-radius:10px;background:${catBg};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${t.icon}</div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap">
            <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:${catBg};color:${catColor};padding:2px 8px;border-radius:100px">${t.category}</span>
            <span style="font-size:10.5px;color:var(--ink-muted)">${t.type}</span>
          </div>
          <h4 style="font-size:14px;font-weight:700;color:var(--ink);line-height:1.35;margin:0 0 5px">${t.title}</h4>
        </div>
      </div>
      <p style="font-size:12.5px;color:var(--ink-muted);line-height:1.55;margin:0;flex:1">${t.desc}</p>
      <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:4px">
        <button onclick="event.stopPropagation();showToolPreview(${t.id})"
          style="flex:1;min-width:80px;padding:8px 10px;background:${catBg};color:${catColor};border:1.5px solid ${catColor};border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:5px"
          onmouseover="this.style.background='${catColor}';this.style.color='#fff'" onmouseout="this.style.background='${catBg}';this.style.color='${catColor}'">View</button>
        <button onclick="event.stopPropagation();downloadPDF('${safeTitle}','${safeTitle}')"
          style="flex:1;min-width:80px;padding:8px 10px;background:#dc2626;color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;display:flex;align-items:center;justify-content:center;gap:5px"
          onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'">PDF</button>
        <button onclick="event.stopPropagation();downloadWord('${safeTitle}','${safeTitle}')"
          style="flex:1;min-width:80px;padding:8px 10px;background:#2563eb;color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;display:flex;align-items:center;justify-content:center;gap:5px"
          onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">Word</button>
      </div>
    </div>`;
  }).join('');
}

function setToolFilter(f, btn) {
  toolFilter = f;
  document.querySelectorAll('#page-tools .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTools(f);
}

function renderResources() {
  _renderGuides();
  _renderChecklists();
  _renderSwipe();
  _renderGlossary();
  const foot = document.getElementById('resourcesFooter');
  if (foot && !foot.dataset.r) { foot.innerHTML = renderFooter(); foot.dataset.r = '1'; }
}

/* ── Guides grid ─────────────────────────────────────── */
function _renderGuides() {
  const el = document.getElementById('resources-guides');
  if (!el || el.dataset.rendered) return;
  el.dataset.rendered = '1';
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px;margin-top:4px">
      ${RESOURCES_DATA.guides.map(r => `
        <div onclick="showGuideModal('${r.id}')"
          style="background:#fff;border:1.5px solid var(--border);border-radius:14px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;transition:all .22s"
          onmouseover="this.style.borderColor='${r.color}';this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,.08)'"
          onmouseout="this.style.borderColor='var(--border)';this.style.transform='none';this.style.boxShadow='none'">
          <!-- Colour band -->
          <div style="height:5px;background:${r.color}"></div>
          <div style="padding:20px;flex:1;display:flex;flex-direction:column">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
              <span style="font-size:26px">${r.icon}</span>
              <div style="display:flex;gap:6px;align-items:center">
                <span style="font-size:11px;color:var(--ink-muted)">⏱ ${r.readTime}</span>
                <span style="background:${r.pale};color:${r.color};font-size:11px;font-weight:700;padding:3px 9px;border-radius:100px">${r.tag}</span>
              </div>
            </div>
            <h4 style="font-size:15px;font-weight:700;color:var(--ink);margin-bottom:7px;line-height:1.35">${r.title}</h4>
            <p style="font-size:13px;color:var(--ink-muted);line-height:1.55;flex:1">${r.desc}</p>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;background:var(--paper)">
            <span style="font-size:12px;color:var(--ink-muted)">${r.sections ? r.sections.length + ' sections' : ''}</span>
            <span style="font-size:13px;font-weight:700;color:${r.color}">Read →</span>
          </div>
        </div>`).join('')}
    </div>`;
}

/* ── Checklists list ─────────────────────────────────── */
function _renderChecklists() {
  const el = document.getElementById('resources-checklists');
  if (!el || el.dataset.rendered) return;
  el.dataset.rendered = '1';
  el.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;margin-top:4px">
      ${RESOURCES_DATA.checklists.map(r => `
        <div onclick="showChecklistModal('${r.id}')"
          style="background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:18px 22px;cursor:pointer;display:flex;align-items:center;gap:16px;transition:all .2s"
          onmouseover="this.style.borderColor='${r.color}';this.style.boxShadow='0 4px 16px rgba(0,0,0,.07)'"
          onmouseout="this.style.borderColor='var(--border)';this.style.boxShadow='none'">
          <div style="width:44px;height:44px;border-radius:10px;background:${r.pale};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${r.icon}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
              <h4 style="font-size:15px;font-weight:700;color:var(--ink);margin:0">${r.title}</h4>
              <span style="background:${r.pale};color:${r.color};font-size:11px;font-weight:700;padding:2px 8px;border-radius:100px;flex-shrink:0">${r.tag}</span>
            </div>
            <p style="font-size:13px;color:var(--ink-muted);margin:0;line-height:1.45">${r.desc}</p>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0">
            <span style="font-size:12px;color:var(--ink-muted)">${r.items ? r.items.length + ' items' : ''}</span>
            <span style="font-size:13px;font-weight:700;color:${r.color}">Open →</span>
          </div>
        </div>`).join('')}
    </div>`;
}

/* ── Swipe files list ────────────────────────────────── */
function _renderSwipe() {
  const el = document.getElementById('resources-swipe');
  if (!el || el.dataset.rendered) return;
  el.dataset.rendered = '1';
  const tagIcon = {Email:'✉️', WhatsApp:'💬', Script:'📞'};
  el.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;margin-top:4px">
      ${RESOURCES_DATA.swipe.map(r => `
        <div onclick="showSwipeModal('${r.id}')"
          style="background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:18px 22px;cursor:pointer;display:flex;align-items:center;gap:16px;transition:all .2s"
          onmouseover="this.style.borderColor='${r.color}';this.style.boxShadow='0 4px 16px rgba(0,0,0,.07)'"
          onmouseout="this.style.borderColor='var(--border)';this.style.boxShadow='none'">
          <div style="width:44px;height:44px;border-radius:10px;background:${r.pale};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${r.icon}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
              <h4 style="font-size:15px;font-weight:700;color:var(--ink);margin:0">${r.title}</h4>
              <span style="background:${r.pale};color:${r.color};font-size:11px;font-weight:700;padding:2px 8px;border-radius:100px;flex-shrink:0">${(tagIcon[r.tag]||'')+' '+r.tag}</span>
            </div>
            <p style="font-size:13px;color:var(--ink-muted);margin:0;line-height:1.45">${r.desc}</p>
          </div>
          <span style="font-size:13px;font-weight:700;color:${r.color};flex-shrink:0">Copy →</span>
        </div>`).join('')}
    </div>`;
}

/* ── Glossary with letter groups + search ────────────── */
function _renderGlossary() {
  const el = document.getElementById('resources-glossary');
  if (!el || el.dataset.rendered) return;
  el.dataset.rendered = '1';

  // Group by letter
  const byLetter = {};
  RESOURCES_DATA.glossary.forEach(g => {
    const l = g.letter || g.term[0].toUpperCase();
    if (!byLetter[l]) byLetter[l] = [];
    byLetter[l].push(g);
  });
  const letters = Object.keys(byLetter).sort();

  el.innerHTML = `
    <!-- Search bar -->
    <div style="position:relative;margin-bottom:20px;margin-top:4px">
      <input id="gloss-search" type="text" placeholder="Search terms…"
        oninput="_filterGlossary(this.value)"
        style="width:100%;padding:11px 16px 11px 40px;border:1.5px solid var(--border);border-radius:10px;font-size:14px;font-family:inherit;outline:none;box-sizing:border-box;background:#fff"
        onfocus="this.style.borderColor='var(--emerald)'" onblur="this.style.borderColor='var(--border)'">
      <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:16px;pointer-events:none">🔍</span>
    </div>
    <!-- Letter nav -->
    <div id="gloss-letter-nav" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px">
      ${letters.map(l => `
        <button onclick="_scrollToLetter('${l}')"
          style="width:32px;height:32px;border-radius:7px;border:1.5px solid var(--border);background:#fff;font-size:13px;font-weight:700;color:var(--ink);cursor:pointer;font-family:inherit;transition:all .15s"
          onmouseover="this.style.background='var(--emerald)';this.style.color='#fff';this.style.borderColor='var(--emerald)'"
          onmouseout="this.style.background='#fff';this.style.color='var(--ink)';this.style.borderColor='var(--border)'">${l}</button>`).join('')}
    </div>
    <!-- All terms grouped -->
    <div id="gloss-terms" style="display:flex;flex-direction:column;gap:28px">
      ${letters.map(l => `
        <div class="gloss-group" data-letter="${l}">
          <div id="gloss-letter-${l}" style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--emerald);margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid var(--emerald-pale)">${l}</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${byLetter[l].map(g => `
              <div class="gloss-term" data-term="${g.term.toLowerCase()}" data-def="${g.def.toLowerCase()}"
                style="padding:14px 18px;background:#fff;border:1.5px solid var(--border);border-radius:10px;cursor:pointer;transition:all .18s"
                onclick="_toggleGlossTerm(this)"
                onmouseover="this.style.borderColor='var(--emerald)'"
                onmouseout="if(!this.dataset.open)this.style.borderColor='var(--border)'">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
                  <span style="font-size:14.5px;font-weight:700;color:var(--ink)">${g.term}</span>
                  <span class="gt-chevron" style="font-size:18px;color:var(--emerald);transition:transform .2s;flex-shrink:0">+</span>
                </div>
                <div class="gt-def" style="display:none;font-size:13.5px;color:var(--ink-soft);line-height:1.6;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">${g.def}</div>
              </div>`).join('')}
          </div>
        </div>`).join('')}
    </div>`;
}

function _toggleGlossTerm(el) {
  const def = el.querySelector('.gt-def');
  const ch  = el.querySelector('.gt-chevron');
  const open = el.dataset.open === '1';
  def.style.display  = open ? 'none' : 'block';
  ch.textContent     = open ? '+' : '×';
  ch.style.transform = open ? '' : 'rotate(0deg)';
  el.dataset.open    = open ? '' : '1';
  el.style.borderColor = open ? 'var(--border)' : 'var(--emerald)';
}

function _filterGlossary(q) {
  const v = q.toLowerCase().trim();
  document.querySelectorAll('#resources-glossary .gloss-term').forEach(el => {
    const match = !v || el.dataset.term.includes(v) || el.dataset.def.includes(v);
    el.style.display = match ? '' : 'none';
  });
  document.querySelectorAll('#resources-glossary .gloss-group').forEach(g => {
    const any = [...g.querySelectorAll('.gloss-term')].some(t => t.style.display !== 'none');
    g.style.display = any ? '' : 'none';
  });
}

function _scrollToLetter(l) {
  const el = document.getElementById('gloss-letter-' + l);
  if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
}

/* ── Guide modal ─────────────────────────────────────── */
function showGuideModal(id) {
  const r = RESOURCES_DATA.guides.find(x => x.id === id);
  if (!r) return;
  openModal(r.title, `
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px">
      <span style="background:${r.pale};color:${r.color};font-size:12px;font-weight:700;padding:4px 12px;border-radius:100px">${r.tag}</span>
      <span style="font-size:13px;color:var(--ink-muted)">⏱ ${r.readTime} read</span>
      ${r.relatedPath ? `<span style="font-size:13px;color:var(--ink-muted)">Related: Path ${r.relatedPath}</span>` : ''}
    </div>
    <p style="font-size:15px;color:var(--ink-soft);line-height:1.65;margin-bottom:20px">${r.preview}</p>
    <div style="background:var(--paper);border-radius:10px;padding:16px 20px;margin-bottom:18px">
      <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${r.color};margin-bottom:10px">In this guide</div>
      <div style="display:flex;flex-direction:column;gap:7px">
        ${(r.sections||[]).map((s,i) => `
          <div style="display:flex;align-items:center;gap:10px;font-size:13.5px;color:var(--ink-soft)">
            <span style="width:20px;height:20px;border-radius:50%;background:${r.color};color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</span>
            ${s}
          </div>`).join('')}
      </div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button onclick="downloadPDF('${r.title.replace(/'/g,"\\x27")}','Guide')"
        style="padding:10px 18px;background:#dc2626;color:#fff;border:none;border-radius:8px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit">Download PDF</button>
      <button onclick="downloadWord('${r.title.replace(/'/g,"\\x27")}','Guide')"
        style="padding:10px 18px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit">Download Word</button>
      ${r.relatedPath ? `<button onclick="closeModal();startLearningPath(${r.relatedPath})"
        style="padding:10px 18px;background:${r.color};color:#fff;border:none;border-radius:8px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit">Related Learning Path →</button>` : ''}
    </div>`);
}

/* ── Checklist modal ─────────────────────────────────── */
function showChecklistModal(id) {
  const r = RESOURCES_DATA.checklists.find(x => x.id === id);
  if (!r) return;
  const listId = 'cl-' + id;
  openModal(r.title, `
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px">
      <span style="background:${r.pale};color:${r.color};font-size:12px;font-weight:700;padding:4px 12px;border-radius:100px">${r.tag}</span>
      <span style="font-size:13px;color:var(--ink-muted)">${(r.items||[]).length} items</span>
    </div>
    <p style="font-size:15px;color:var(--ink-soft);line-height:1.65;margin-bottom:18px">${r.desc}</p>
    <!-- Progress bar -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      <div style="flex:1;background:var(--paper);border-radius:100px;height:8px;overflow:hidden">
        <div id="${listId}-bar" style="height:100%;background:${r.color};border-radius:100px;width:0%;transition:width .3s"></div>
      </div>
      <span id="${listId}-label" style="font-size:12px;font-weight:700;color:${r.color};white-space:nowrap">0 / ${(r.items||[]).length}</span>
    </div>
    <!-- Items -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">
      ${(r.items||[]).map((item,i) => `
        <div id="${listId}-item-${i}" onclick="_toggleClItem('${listId}',${i},${(r.items||[]).length},'${r.color}')"
          style="display:flex;align-items:flex-start;gap:12px;padding:12px 16px;background:#fff;border:1.5px solid var(--border);border-radius:10px;cursor:pointer;transition:all .18s"
          onmouseover="if(!this.dataset.checked)this.style.borderColor='${r.color}'"
          onmouseout="if(!this.dataset.checked)this.style.borderColor='var(--border)'">
          <div id="${listId}-dot-${i}" style="width:20px;height:20px;border-radius:50%;border:2px solid var(--border);flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;transition:all .18s"></div>
          <span id="${listId}-text-${i}" style="font-size:13.5px;color:var(--ink-soft);line-height:1.5;flex:1">${item}</span>
        </div>`).join('')}
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button onclick="downloadPDF('${r.title.replace(/'/g,"\\x27")}','Checklist')"
        style="padding:10px 18px;background:#dc2626;color:#fff;border:none;border-radius:8px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit">Download PDF</button>
      <button onclick="downloadWord('${r.title.replace(/'/g,"\\x27")}','Checklist')"
        style="padding:10px 18px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit">Download Word</button>
      <button onclick="_resetChecklist('${listId}',${(r.items||[]).length})"
        style="padding:10px 18px;background:#fff;color:var(--ink);border:1.5px solid var(--border);border-radius:8px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit">↺ Reset</button>
    </div>`);
}

function _toggleClItem(listId, i, total, color) {
  const item = document.getElementById(listId+'-item-'+i);
  const dot  = document.getElementById(listId+'-dot-'+i);
  const txt  = document.getElementById(listId+'-text-'+i);
  const checked = item.dataset.checked === '1';
  item.dataset.checked = checked ? '' : '1';
  dot.style.background   = checked ? '' : color;
  dot.style.borderColor  = checked ? 'var(--border)' : color;
  dot.innerHTML          = checked ? '' : '<span style="color:#fff;font-size:11px;font-weight:900">✓</span>';
  txt.style.textDecoration = checked ? '' : 'line-through';
  txt.style.color          = checked ? 'var(--ink-soft)' : 'var(--ink-muted)';
  item.style.background    = checked ? '#fff' : '#f8fdf9';
  item.style.borderColor   = checked ? 'var(--border)' : color;
  // Update progress
  const done = document.querySelectorAll('[id^="'+listId+'-item-"][data-checked="1"]').length;
  const bar   = document.getElementById(listId+'-bar');
  const label = document.getElementById(listId+'-label');
  if (bar)   bar.style.width = (done/total*100)+'%';
  if (label) label.textContent = done+' / '+total;
}

function _resetChecklist(listId, total) {
  for (let i=0; i<total; i++) {
    const item = document.getElementById(listId+'-item-'+i);
    const dot  = document.getElementById(listId+'-dot-'+i);
    const txt  = document.getElementById(listId+'-text-'+i);
    if (!item) continue;
    item.dataset.checked = '';
    item.style.background = '#fff';
    item.style.borderColor = 'var(--border)';
    dot.style.background = ''; dot.style.borderColor = 'var(--border)'; dot.innerHTML = '';
    txt.style.textDecoration = ''; txt.style.color = 'var(--ink-soft)';
  }
  const bar = document.getElementById(listId+'-bar');
  const lbl = document.getElementById(listId+'-label');
  if (bar) bar.style.width = '0%';
  if (lbl) lbl.textContent = '0 / '+total;
}

/* ── Swipe file modal ────────────────────────────────── */
function showSwipeModal(id) {
  const r = RESOURCES_DATA.swipe.find(x => x.id === id);
  if (!r) return;
  const boxId = 'swipe-content-' + id;
  openModal(r.title, `
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px">
      <span style="background:${r.pale};color:${r.color};font-size:12px;font-weight:700;padding:4px 12px;border-radius:100px">${r.tag}</span>
    </div>
    <p style="font-size:15px;color:var(--ink-soft);line-height:1.65;margin-bottom:18px">${r.desc}</p>
    <div style="position:relative;margin-bottom:18px">
      <pre id="${boxId}" style="background:var(--paper);border:1.5px solid var(--border);border-radius:10px;padding:18px 20px;font-family:'Inter',sans-serif;font-size:13px;color:var(--ink-soft);white-space:pre-wrap;word-break:break-word;line-height:1.7;max-height:360px;overflow-y:auto;margin:0">${r.content.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
      <button onclick="_copySwipe('${boxId}')"
        style="position:absolute;top:10px;right:10px;padding:6px 12px;background:${r.color};color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">Copy</button>
    </div>
    <div style="background:${r.pale};border-radius:10px;padding:12px 16px;margin-bottom:18px;font-size:13px;color:var(--ink-soft)">Replace every<strong>[bracketed placeholder]</strong> with your own details before sending.
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button onclick="_copySwipe('${boxId}')"
        style="padding:10px 18px;background:${r.color};color:#fff;border:none;border-radius:8px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit">Copy to Clipboard</button>
      <button onclick="downloadWord('${r.title.replace(/'/g,"\\x27")}','Swipe File')"
        style="padding:10px 18px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit">Download Word</button>
    </div>`);
}

function _copySwipe(boxId) {
  const el = document.getElementById(boxId);
  if (!el) return;
  const text = el.textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard! ✓','success'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied to clipboard! ✓','success');
  }
}

function renderStories() {
  const grid = document.getElementById('storiesGrid');
  if (!grid) return;
  const filtered = storyFilter === 'all' ? STORIES : STORIES.filter(s => s.channel === storyFilter);
  grid.innerHTML = filtered.map(s => `
    <div class="story-card" onclick="showStoryModal(${s.id})">
      <div class="sc-top">
        <span class="sc-tag" style="background:${s.tagBg};color:${s.tagColor}">${s.tag}</span>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </div>
      <div class="sc-bottom"><div class="sc-stat"><strong>${s.stat}</strong><span>${s.statLabel}</span></div><span style="color:var(--emerald);font-size:18px">→</span></div>
    </div>`).join('');
}

function setStoryFilter(f, btn) {
  storyFilter = f;
  document.querySelectorAll('#page-success-stories .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderStories();
}

/* ══════════════════════════════════════════════════════
   ASSESSMENT
══════════════════════════════════════════════════════ */
let assessIdx = 0;
let assessAnswers = [];

function startAssessment() {
  assessIdx = 0;
  assessAnswers = [];
  document.getElementById('assessIntro').style.display = 'none';
  document.getElementById('assessResults').style.display = 'none';
  document.getElementById('assessQuestions').style.display = 'block';
  renderQuestion();
}

function renderQuestion() {
  const q = ASSESSMENT_QUESTIONS[assessIdx];
  const pct = Math.round((assessIdx / ASSESSMENT_QUESTIONS.length) * 100);
  const answered = assessAnswers.filter(a => a !== undefined).length;
  document.getElementById('assessQuestions').innerHTML = `
    <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden">
      <!-- Progress header -->
      <div style="background:var(--paper);padding:16px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:16px">
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--ink-muted);margin-bottom:7px">
            <span>Question <strong style="color:var(--ink)">${assessIdx+1}</strong> of ${ASSESSMENT_QUESTIONS.length}</span>
            <span><strong style="color:var(--emerald)">${answered}</strong> answered</span>
          </div>
          <div style="background:var(--paper-warm);border-radius:100px;height:5px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:var(--emerald);border-radius:100px;transition:width .4s ease"></div>
          </div>
        </div>
        <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:4px 10px;border-radius:100px;background:var(--emerald-pale);color:var(--emerald);white-space:nowrap">${q.axis}</span>
      </div>
      <!-- Question body -->
      <div style="padding:28px 24px">
        <p style="font-size:18px;font-weight:700;color:var(--ink);line-height:1.4;margin-bottom:24px">${q.q}</p>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${q.opts.map((opt, i) => `
            <button class="q-option ${assessAnswers[assessIdx] === i ? 'selected' : ''}"
              onclick="selectAnswer(${i})"
              style="display:flex;align-items:flex-start;gap:14px;text-align:left;padding:14px 16px;border:2px solid ${assessAnswers[assessIdx]===i?'var(--emerald)':'var(--border)'};border-radius:10px;cursor:pointer;font-size:14.5px;color:${assessAnswers[assessIdx]===i?'var(--emerald)':'var(--ink-soft)'};background:${assessAnswers[assessIdx]===i?'var(--emerald-pale)':'#fff'};font-family:inherit;width:100%;transition:all .15s">
              <span style="width:22px;height:22px;border-radius:50%;border:2px solid ${assessAnswers[assessIdx]===i?'var(--emerald)':'var(--border)'};background:${assessAnswers[assessIdx]===i?'var(--emerald)':'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;font-size:11px;color:${assessAnswers[assessIdx]===i?'#fff':'transparent'};transition:all .15s">✓</span>
              <span>${opt}</span>
            </button>`).join('')}
        </div>
      </div>
      <!-- Navigation footer -->
      <div style="padding:16px 24px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;background:var(--paper)">
        <button class="btn-outline" style="padding:9px 20px;font-size:13.5px" onclick="prevQuestion()" ${assessIdx===0?'disabled style="opacity:.4;cursor:not-allowed"':''}>← Back</button>
        <div style="font-size:12.5px;color:var(--ink-muted)">Click an answer to continue</div>
        ${assessAnswers[assessIdx]!==undefined
          ? `<button class="btn-primary" onclick="nextQuestion()">${assessIdx===ASSESSMENT_QUESTIONS.length-1?'See My Results →':'Next Question →'}</button>`
          : `<button class="btn-primary" style="opacity:.45;cursor:not-allowed" disabled>Next →</button>`}
      </div>
    </div>`;
}

function selectAnswer(i) {
  assessAnswers[assessIdx] = i;
  renderQuestion();
  // Auto-advance after brief pause (except last question)
  if (assessIdx < ASSESSMENT_QUESTIONS.length - 1) {
    clearTimeout(window._autoNext);
    window._autoNext = setTimeout(() => nextQuestion(), 500);
  }
}
function prevQuestion() { if (assessIdx > 0) { assessIdx--; renderQuestion(); } }
function nextQuestion() {
  if (assessAnswers[assessIdx] === undefined) return;
  if (assessIdx < ASSESSMENT_QUESTIONS.length - 1) {
    assessIdx++;
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  document.getElementById('assessQuestions').style.display = 'none';
  const axes = ['Messaging','Pipeline','Grant Readiness','Digital & Outreach','Retention','Program Packaging'];
  const scores = {};
  axes.forEach(a => scores[a] = {total:0,count:0});
  ASSESSMENT_QUESTIONS.forEach((q, i) => {
    const ans = assessAnswers[i] ?? 0;
    scores[q.axis].total += (ans / 3) * 100;
    scores[q.axis].count++;
  });
  const axisResults = axes.map(a => ({
    name: a,
    pct: Math.round(scores[a].total / (scores[a].count || 1))
  }));
  const overall = Math.round(axisResults.reduce((s, a) => s + a.pct, 0) / axes.length);
  const weakest = [...axisResults].sort((a,b) => a.pct - b.pct).slice(0,2);

  // Map assessment axes to the most relevant learning path IDs
  const axisToPathId = {
    'Messaging':           2,  // Build a 12-Month Fundraising Plan (covers case for support & messaging)
    'Pipeline':            5,  // Build a Donor Pipeline & Close Gifts
    'Grant Readiness':     4,  // Win Grants Step by Step
    'Digital & Outreach':  6,  // Run a 14-Day Digital Campaign
    'Retention':           8,  // Donor Retention 30/60/90 Plan
    'Program Packaging':   3,  // Package Programs into Fundable Offers
  };

  // Resolve recommended paths from weakest axes; fall back to LP1 if no match
  const recommendedPaths = weakest.map(a => {
    const pid = axisToPathId[a.name] || 1;
    return { ...PATHS.find(p => p.id === pid), _axis: a.name, _pct: a.pct };
  }).filter(Boolean);

  // Save results globally so other pages can read them
  window._assessResults = { overall, axisResults, weakest };

  const el = document.getElementById('assessResults');
  el.style.display = 'block';
  el.innerHTML = `
    <div class="card" style="padding:32px;margin-bottom:20px;text-align:center">
      <div style="font-size:48px;margin-bottom:8px">🎯</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:26px;margin-bottom:6px">Your Readiness Score</h2>
      <div style="font-size:56px;font-weight:900;color:${overall >= 70 ? 'var(--emerald)' : overall >= 40 ? 'var(--gold)' : 'var(--rose)'}">${overall}%</div>
      <p style="color:var(--ink-soft);margin-top:6px">${overall >= 70 ? '🟢 Strong foundations — focus on growth' : overall >= 40 ? '🟡 Building readiness — clear gaps to address' : '🔴 Early stage — high opportunity for improvement'}</p>
    </div>
    <div class="card" style="padding:28px;margin-bottom:20px">
      <h3 style="font-size:16px;font-weight:700;margin-bottom:20px">Score by Axis</h3>
      ${axisResults.map(a => `
        <div class="result-axis">
          <div class="result-axis-header"><span>${a.name}</span><strong>${a.pct}%</strong></div>
          <div class="result-bar-track"><div class="result-bar-fill" style="width:${a.pct}%;background:${a.pct >= 70 ? 'var(--emerald)' : a.pct >= 40 ? 'var(--gold)' : 'var(--rose)'}"></div></div>
        </div>`).join('')}
    </div>
    <div class="card" style="padding:28px;margin-bottom:20px">
      <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Your Top 2 Priorities</h3>
      ${weakest.map((a,i) => `
        <div style="padding:14px 16px;border:2px solid ${i===0?'var(--rose)':'var(--gold)'};border-radius:10px;margin-bottom:12px;background:${i===0?'var(--rose-pale)':'var(--gold-pale)'}">
          <div style="font-size:12px;font-weight:700;color:${i===0?'var(--rose)':'var(--gold)'};text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Priority ${i+1}</div>
          <div style="font-size:15px;font-weight:700">${a.name} — ${a.pct}%</div>
          <div style="font-size:13px;color:var(--ink-soft);margin-top:3px">Focus here first for the biggest improvement in 30 days.</div>
        </div>`).join('')}
    </div>
    <div class="card" style="padding:28px;margin-bottom:20px">
      <h3 style="font-size:16px;font-weight:700;margin-bottom:4px">Recommended Learning Paths</h3>
      <p style="font-size:13px;color:var(--ink-muted);margin-bottom:16px">Matched to your lowest-scoring areas. Click a path to start immediately.</p>
      ${recommendedPaths.map((p,i) => `
        <div style="padding:16px;border:1.5px solid ${i===0?'var(--emerald)':'var(--border)'};border-radius:10px;cursor:pointer;margin-bottom:10px;transition:all .2s;background:${i===0?'var(--emerald-pale)':'#fff'}" onclick="startLearningPath(${p.id}, true)" onmouseover="this.style.borderColor='var(--emerald)';this.style.background='var(--emerald-pale)'" onmouseout="this.style.borderColor='${i===0?'var(--emerald)':'var(--border)'}';this.style.background='${i===0?'var(--emerald-pale)':'#fff'}'">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
            <div>
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${i===0?'var(--emerald)':'var(--ink-muted)'};margin-bottom:4px">Addresses: ${p._axis}</div>
              <div style="font-size:15px;font-weight:700;color:var(--ink)">${p.title}</div>
              <div style="font-size:13px;color:var(--ink-muted);margin-top:3px">${p.desc}</div>
            </div>
            <span style="font-size:13px;font-weight:700;color:var(--emerald);white-space:nowrap">Start →</span>
          </div>
        </div>`).join('')}
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
      <button class="btn-primary" onclick="startLearningPath(${recommendedPaths[0]?.id || 1}, true)">Start Top Recommended Path →</button>
      <button class="btn-outline" onclick="startAssessment()">Retake Assessment</button>
    </div>`;

  // Animate bars
  setTimeout(() => { el.querySelectorAll('.result-bar-fill').forEach(b => { const w = b.style.width; b.style.width = '0'; setTimeout(() => b.style.width = w, 50); }); }, 100);
}

/* ══════════════════════════════════════════════════════
   AI ADVISOR
══════════════════════════════════════════════════════ */
function renderAIAdvisor() {
  window._GROQ_KEY = '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';
  setAIMode(aiMode, null);
  const foot = document.getElementById('aiAdvisorFooter');
  if (foot && !foot.dataset.r) { foot.innerHTML = renderFooter(); foot.dataset.r = '1'; }
  const dot = document.getElementById('ai-status-dot');
  if (dot) { dot.textContent = '● Online'; dot.style.color = '#6ee0b0'; }
}

function setAIMode(mode, btn) {
  aiMode = mode;
  document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else {
    const match = [...document.querySelectorAll('.mode-tab')].find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes("'" + mode + "'"));
    if (match) match.classList.add('active');
  }
  const data = AI_MODES[mode];
  if (!data) return;
  const descEl = document.getElementById('aiModeDescription');
  if (descEl) descEl.textContent = data.desc;

  const suggList = document.getElementById('aiSuggList');
  if (suggList) {
    suggList.innerHTML = data.suggestions.map((s,i) => `<button
        data-sugg="${i}"
        style="padding:6px 13px;border:1.5px solid var(--border);border-radius:100px;background:#fff;font-size:12.5px;cursor:pointer;color:var(--ink-soft);font-family:inherit;transition:all .18s;line-height:1.4;white-space:nowrap"
        onmouseover="this.style.borderColor='var(--emerald)';this.style.color='var(--emerald)';this.style.background='var(--emerald-pale)'"
        onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--ink-soft)';this.style.background='#fff'">› ${s}</button>`).join('');
    // Store texts and attach listeners safely — avoids JSON.stringify escaping issues
    Array.from(suggList.querySelectorAll('button[data-sugg]')).forEach(function(btn, i) {
      btn.addEventListener('click', function() { sendMessage(data.suggestions[i]); });
    });
  }

  const msgs = document.getElementById('chatMessages');
  if (msgs && mode !== 'ask') {
    const greets = {
      review:   'Ready to review your one-pager or case for support. Paste your text below and I\u2019ll give you specific, structured feedback \u2014 strengths, gaps, and suggestions.',
      message:  'Share your draft donor email or WhatsApp message and I\u2019ll help make it clearer, warmer, and more likely to get a response.',
      pipeline: 'Let\u2019s build your donor pipeline. Tell me about your NGO \u2014 what do you do, who you serve, and who are your ideal donors?',
      proposal: 'I\u2019ll help you draft a compelling proposal. Tell me: what programme are you raising funds for, roughly how much, and who is the target funder?',
      package:  'Let\u2019s create a Funding Pack Card for your programme. Tell me what it does, who it serves, and what the main outcome is.'
    };
    if (greets[mode]) addAIMessage(greets[mode]);
  }
}

function sendSuggestion(text) {
  sendMessage(text);
}

function _updateCharCount(input) {
  const el = document.getElementById('chatCharCount');
  if (!el) return;
  const len = input.value.length;
  const max = parseInt(input.maxLength) || 2000;
  el.textContent = len + ' / ' + max;
  el.className = 'char-count' + (len >= max ? ' over' : len > max * 0.85 ? ' warn' : '');
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 120) + 'px';
}

function _nowTime() {
  return new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

async function sendMessage(forcedText) {
  const input = document.getElementById('chatInput');
  const text = forcedText ? forcedText.trim() : (input ? input.value.trim() : '');
  if (!text) return;
  if (input) { input.value = ''; input.style.height = 'auto'; _updateCharCount(input); }
  addUserMessage(text);
  chatHistory.push({ role: 'user', content: text });

  const sendBtn = document.querySelector('.chat-send');
  if (sendBtn) { sendBtn.disabled = true; sendBtn.style.opacity = '0.5'; }
  const typingEl = addTyping();

  const systemPrompt = 'You are an expert AI Fundraising Advisor for local and regional NGOs, built into the FundReady Academy platform.\n\n'
    + 'ABOUT FUNDREADY:\nCapability-building platform for small NGOs. 10 core capabilities, 8 learning paths, 20 micro-lesson categories, 12 webinars.\n\n'
    + 'THE 10 CAPABILITIES:\n'
    + '1. Fundraising Readiness & Direction\n'
    + '2. Value Proposition, Messaging & Case for Support\n'
    + '3. Program Packaging into Fundable Offers (unit cost, Bronze/Silver/Gold tiers)\n'
    + '4. Prospecting & Donor Research (prospect list, go/no-go scoring)\n'
    + '5. Relationship Management & Pipeline (Lead\u2192Won stages, CRM, follow-up)\n'
    + '6. Asking & Closing (ask scripts, objection handling)\n'
    + '7. Proposal & Grant Capability (2-page + 10-page proposal, M&E, compliance)\n'
    + '8. Corporate Partnerships (targeting, partnership menu, renewal)\n'
    + '9. Digital Fundraising & Campaign Execution (14-day campaign, WhatsApp scripts)\n'
    + '10. Donor Retention & Stewardship (48-hr thank-you, 30/60/90 journey)\n\n'
    + 'CURRENT MODE: ' + (AI_MODES[aiMode] ? AI_MODES[aiMode].label : 'Ask Anything') + '\n\n'
    + 'RULES:\n'
    + '- Be direct and practical. NGO teams are busy.\n'
    + '- Use **bold** for key terms and actions.\n'
    + '- Use numbered lists for steps; bullet lists for options.\n'
    + '- Keep responses under 300 words unless drafting a full document.\n'
    + '- Always end with one concrete next step.\n'
    + '- If reviewing a document: structure feedback as Strengths, Gaps, Suggestions.\n'
    + '- Never invent specific stats. Use placeholders like [amount].\n'
    + '- Warm, peer-like tone. No corporate jargon.';

  try {
    const apiKey = window._GROQ_KEY || '';
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory
        ]
      })
    });
    const data = await res.json();
    typingEl.remove();
    if (data.error) {
      addAIMessage('⚠️ ' + (data.error.message || 'Something went wrong. Please try again.'));
    } else {
      const reply = data?.choices?.[0]?.message?.content || 'Sorry, no response received. Please try again.';
      chatHistory.push({ role: 'assistant', content: reply });
      addAIMessage(reply);
    }
  } catch(e) {
    typingEl.remove();
    addAIMessage('⚠️ Connection issue. Please check your internet and try again.');
  } finally {
    if (sendBtn) { sendBtn.disabled = false; sendBtn.style.opacity = '1'; }
    if (input) input.focus();
  }
}

function addUserMessage(text) {
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'msg user';
  div.innerHTML = '<div class="msg-bubble">' + escapeHtml(text) + '</div><div class="msg-time">' + _nowTime() + '</div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addAIMessage(text) {
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'msg ai';
  const msgId = 'ai-msg-' + Date.now();
  div.innerHTML = '<div style="position:relative">'
    + '<div class="msg-bubble" id="' + msgId + '">' + formatAIText(text) + '</div>'
    + '<button onclick="_copyMsg(\'' + msgId + '\')" title="Copy reply" '
    + 'style="position:absolute;top:6px;right:8px;background:transparent;border:none;cursor:pointer;font-size:13px;opacity:0;transition:opacity .2s;padding:2px 4px;border-radius:4px;line-height:1" '
    + 'class="msg-copy-btn">\uD83D\uDCCB</button>'
    + '</div>'
    + '<div class="msg-time">' + _nowTime() + '</div>';
  const wrap = div.querySelector('[style*="position:relative"]');
  if (wrap) {
    const btn = wrap.querySelector('.msg-copy-btn');
    wrap.addEventListener('mouseenter', function() { if (btn) btn.style.opacity = '1'; });
    wrap.addEventListener('mouseleave', function() { if (btn) btn.style.opacity = '0'; });
  }
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function _copyMsg(msgId) {
  const el = document.getElementById(msgId);
  if (!el) return;
  const text = el.innerText || el.textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() { showToast('Copied!', 'success'); });
  } else {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); showToast('Copied!', 'success'); } catch(e) {}
    document.body.removeChild(ta);
  }
}

function addTyping() {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg ai';
  div.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function clearChat() {
  chatHistory = [];
  const msgs = document.getElementById('chatMessages');
  if (msgs) msgs.innerHTML = '';
  addAIMessage('Chat cleared. I\u2019m your AI Fundraising Advisor \u2014 ask me anything about fundraising for your NGO, or pick a mode on the left to get started.');
}

function copyChat() {
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  const bubbles = Array.from(msgs.querySelectorAll('.msg'));
  const text = bubbles.map(function(b) {
    const isUser = b.classList.contains('user');
    const bubble = b.querySelector('.msg-bubble');
    return (isUser ? 'You: ' : 'Advisor: ') + (bubble ? (bubble.innerText || bubble.textContent) : '');
  }).join('\n\n');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() { showToast('Conversation copied!', 'success'); });
  } else {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); showToast('Conversation copied!', 'success'); } catch(e) {}
    document.body.removeChild(ta);
  }
}

function formatAIText(raw) {
  var t = escapeHtml(raw);

  // Bold **text**
  t = t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Numbered lists (lines: "1. text")
  t = t.replace(/((?:^\d+\. .+(?:\n|$))+)/gm, function(block) {
    var items = block.trim().split('\n').map(function(l) {
      return '<li style="margin-bottom:3px">' + l.replace(/^\d+\. /, '') + '</li>';
    }).join('');
    return '<ol style="margin:6px 0 6px 18px;padding:0">' + items + '</ol>';
  });

  // Bullet lists (lines: "- text" or "* text")
  t = t.replace(/((?:^[-*] .+(?:\n|$))+)/gm, function(block) {
    var items = block.trim().split('\n').map(function(l) {
      return '<li style="margin-bottom:3px">' + l.replace(/^[-*] /, '') + '</li>';
    }).join('');
    return '<ul style="margin:6px 0 6px 16px;padding:0">' + items + '</ul>';
  });

  // Emoji-prefixed lines as flex rows
  t = t.replace(/^([\u2705\u26a0\ufe0f\uD83D\uDCA1\uD83C\uDFAF\uD83D\uDCCC]) (.+)$/gm,
    '<div style="display:flex;gap:6px;margin:3px 0;line-height:1.45"><span>$1</span><span>$2</span></div>');

  // Paragraph breaks
  t = t.replace(/\n\n/g, '</p><p style="margin-top:8px">');
  t = t.replace(/\n/g, '<br>');

  return '<p style="margin:0">' + t + '</p>';
}

function escapeHtml(t) {
  return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


/* ══════════════════════════════════════════════════════
   TABS
══════════════════════════════════════════════════════ */
function switchTab(page, tab, btn) {
  if (page === 'webinars') {
    document.querySelectorAll('#page-webinars .tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    renderWebinars(tab);
  } else if (page === 'resources') {
    document.querySelectorAll('#page-resources .tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#page-resources .tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('resources-' + tab).classList.add('active');
  }
}

/* ══════════════════════════════════════════════════════
   SEARCH
══════════════════════════════════════════════════════ */
let currentSearchType = 'all';

function initSearch() {
  const input = document.getElementById('globalSearchInput');
  if (input) { setTimeout(() => input.focus(), 200); }
  globalSearch();
}

function setSearchType(t, btn) {
  currentSearchType = t;
  document.querySelectorAll('#searchFilters .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  globalSearch();
}

function globalSearch() {
  const q = (document.getElementById('globalSearchInput')?.value || '').toLowerCase().trim();
  const el = document.getElementById('searchResults');
  if (!el) return;

  if (!q) {
    el.innerHTML = '<p style="color:var(--ink-muted);text-align:center;padding:40px">Start typing to search across all content…</p>';
    return;
  }

  // Build results array — each item has { type, typeColor, title, desc, open: fn }
  const results = [];

  if (currentSearchType === 'all' || currentSearchType === 'lesson') {
    LESSONS.filter(l => (l.title + l.cat + l.desc).toLowerCase().includes(q))
      .forEach(l => results.push({
        type: 'Micro Lesson', typeColor: 'var(--emerald)',
        title: l.title, desc: l.desc,
        open: function() { showLessonModal(l.id); }
      }));
  }
  if (currentSearchType === 'all' || currentSearchType === 'path') {
    PATHS.filter(p => (p.title + p.desc).toLowerCase().includes(q))
      .forEach(p => results.push({
        type: 'Learning Path', typeColor: 'var(--sky)',
        title: p.title, desc: p.desc,
        open: function() { showPathModal(p.id); }
      }));
  }
  if (currentSearchType === 'all' || currentSearchType === 'webinar') {
    WEBINARS.filter(w => (w.title + w.desc).toLowerCase().includes(q))
      .forEach(w => results.push({
        type: 'Webinar', typeColor: 'var(--gold)',
        title: w.title, desc: w.desc,
        open: function() { showWebinarModal(w.id); }
      }));
  }
  if (currentSearchType === 'all' || currentSearchType === 'tool') {
    TOOLS.filter(t => (t.title + t.desc).toLowerCase().includes(q))
      .forEach(t => results.push({
        type: 'Tool', typeColor: 'var(--rose)',
        title: t.title, desc: t.desc,
        open: function() { showToolModal(t.id); }
      }));
  }
  if (currentSearchType === 'all' || currentSearchType === 'resource') {
    var allRes = (RESOURCES_DATA.guides || []).concat(RESOURCES_DATA.checklists || []).concat(RESOURCES_DATA.swipe || []);
    allRes.filter(r => (r.title + r.desc).toLowerCase().includes(q))
      .forEach(function(r) {
        results.push({
          type: r.tag || 'Resource', typeColor: 'var(--sky)',
          title: r.title, desc: r.desc,
          open: (function(rid) {
            return function() {
              navigate('resources');
              setTimeout(function() {
                if (rid[0] === 'g') showGuideModal(rid);
                else if (rid[0] === 'c') showChecklistModal(rid);
                else if (rid[0] === 's') showSwipeModal(rid);
              }, 300);
            };
          })(r.id)
        });
      });
  }

  if (!results.length) {
    el.innerHTML = '<div style="text-align:center;padding:60px;color:var(--ink-muted)"><div style="font-size:36px;margin-bottom:12px">🔍</div><p>No results for <strong>“' + escapeHtml(q) + '”</strong>. Try different keywords.</p></div>';
    return;
  }

  // Render cards
  el.innerHTML = '<p style="font-size:13.5px;color:var(--ink-muted);margin-bottom:16px">'
    + results.length + ' result' + (results.length > 1 ? 's' : '') + ' for <strong style="color:var(--ink)">“' + escapeHtml(q) + '”</strong></p>'
    + '<div class="search-results-grid" id="searchResultsGrid"></div>';

  var grid = el.querySelector('#searchResultsGrid') || el.querySelector('.search-results-grid') || el.lastElementChild;
  if (!grid) { console.error('searchResultsGrid not found'); return; }
  results.forEach(function(r) {
    var card = document.createElement('div');
    card.className = 'search-result-card';
    card.style.cursor = 'pointer';
    card.innerHTML = '<div class="src-type" style="color:' + r.typeColor + '">' + escapeHtml(r.type) + '</div>'
      + '<div class="src-title">' + escapeHtml(r.title) + '</div>'
      + '<div class="src-desc">' + escapeHtml(r.desc) + '</div>'
      + '<div style="margin-top:10px;font-size:12px;font-weight:600;color:var(--emerald)">Open →</div>';
    card.addEventListener('click', r.open);
    grid.appendChild(card);
  });
}

/* ══════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════
   DASHBOARD — DATA STORES
══════════════════════════════════════════════════════ */
const _dash = {
  // Saved items: array of {id, icon, title, type, page, savedAt}
  getSaved() { try { return JSON.parse(localStorage.getItem('fra_saved') || '[]'); } catch(e) { return []; } },
  setSaved(arr) { localStorage.setItem('fra_saved', JSON.stringify(arr)); },
  saveItem(item) {
    const arr = this.getSaved();
    if (!arr.find(x => x.id === item.id)) { arr.unshift({...item, savedAt: Date.now()}); this.setSaved(arr); return true; }
    return false;
  },
  unsaveItem(id) {
    const arr = this.getSaved().filter(x => x.id !== id);
    this.setSaved(arr);
  },
  isSaved(id) { return this.getSaved().some(x => x.id === id); },

  // Notes: array of {id, text, createdAt}
  getNotes() { try { return JSON.parse(localStorage.getItem('fra_notes') || '[]'); } catch(e) { return []; } },
  setNotes(arr) { localStorage.setItem('fra_notes', JSON.stringify(arr)); },
  addNote(text) {
    const arr = this.getNotes();
    arr.unshift({ id: Date.now(), text, createdAt: Date.now() });
    this.setNotes(arr);
  },
  deleteNote(id) { this.setNotes(this.getNotes().filter(n => n.id !== id)); },

  // Activity log: {lessons, paths, notes}
  getActivity() { try { return JSON.parse(localStorage.getItem('fra_activity') || '[]'); } catch(e) { return []; } },
  logActivity(icon, text) {
    const arr = this.getActivity();
    arr.unshift({ icon, text, ts: Date.now() });
    if (arr.length > 30) arr.pop();
    localStorage.setItem('fra_activity', JSON.stringify(arr));
  },

  // Streak
  getStreak() { try { return JSON.parse(localStorage.getItem('fra_streak') || '{"days":0,"lastDate":""}'); } catch(e) { return {days:0,lastDate:''}; } },
  updateStreak() {
    const today = new Date().toDateString();
    const s = this.getStreak();
    if (s.lastDate === today) return s.days;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const days = s.lastDate === yesterday ? s.days + 1 : 1;
    localStorage.setItem('fra_streak', JSON.stringify({days, lastDate: today}));
    return days;
  }
};

/* ══════════════════════════════════════════════════════
   DASHBOARD — RENDER ENGINE
══════════════════════════════════════════════════════ */
function renderDashboard() {

  // ── Personalise header ──
  const user = window._currentUser;
  const titleEl = document.getElementById('dash-welcome-title');
  const subEl = document.getElementById('dash-welcome-sub');
  if (titleEl) titleEl.textContent = user ? `Welcome back, ${user.first} 👋` : 'My Dashboard';
  if (subEl && user) subEl.textContent = `${user.org || 'Your organisation'} · ${user.country || ''} · Logged in`;

  // ── Streak badge ──
  const streakDays = _dash.updateStreak();
  const streakBadge = document.getElementById('dash-streak-badge');
  const streakText = document.getElementById('dash-streak-text');
  if (streakBadge && streakDays > 0) {
    streakBadge.style.display = 'flex';
    streakText.textContent = streakDays + '-day streak';
  }

  // ── Live stat cards ──
  const totalDone = _prog.doneTopics.size;
  const saved = _dash.getSaved();
  const notes = _dash.getNotes();
  const capRated = Object.keys(capScores).length;
  // calc overall cap avg
  const capVals = Object.values(capScores);
  const capAvg = capVals.length ? Math.round((capVals.reduce((a,b)=>a+b,0) / (capVals.length * 5)) * 100) : 0;

  const statCardsEl = document.getElementById('dash-stat-cards');
  if (statCardsEl) {
    statCardsEl.innerHTML = [
      { num: totalDone, label: 'Topics completed', color: 'var(--emerald)', icon: '' },
      { num: saved.length, label: 'Items saved', color: 'var(--gold)', icon: '' },
      { num: capRated + '/10', label: 'Caps assessed', color: 'var(--sky)', icon: '' },
      { num: capAvg ? capAvg + '%' : '—', label: 'Readiness score', color: capAvg >= 60 ? 'var(--emerald)' : capAvg >= 40 ? 'var(--gold)' : 'var(--rose)', icon: '' },
    ].map(s => `
      <div class="stat-card" style="position:relative;overflow:hidden">
        <div style="font-size:22px;margin-bottom:4px">${s.icon}</div>
        <div class="stat-num" style="color:${s.color}">${s.num}</div>
        <div class="stat-label">${s.label}</div>
      </div>`).join('');
  }

  // ── Sidebar mini-stats ──
  const sideStats = document.getElementById('dash-sidebar-stats');
  if (sideStats) {
    sideStats.innerHTML = `
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink-muted);margin-bottom:6px">Quick Stats</div>
      <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--ink-soft);padding:4px 0"><span>Topics done</span><strong style="color:var(--emerald)">${totalDone}</strong></div>
      <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--ink-soft);padding:4px 0"><span>Saved items</span><strong style="color:var(--gold)">${saved.length}</strong></div>
      <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--ink-soft);padding:4px 0"><span>My notes</span><strong style="color:var(--sky)">${notes.length}</strong></div>
      <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--ink-soft);padding:4px 0"><span>Streak</span><strong style="color:var(--gold)">${streakDays}d</strong></div>`;
  }

  // ── Continue card ──
  const continueSlot = document.getElementById('dash-continue-slot');
  if (continueSlot) {
    const pathColors = ['var(--emerald)','var(--gold)','var(--sky)','var(--rose)'];
    let bestPath = null, bestPct = -1, bestDone = 0, bestTotal = 0;
    PATHS.forEach((p, pi) => {
      const pathLessons = [];
      if (PATH_DETAILS[p.id]) PATH_DETAILS[p.id].modules.forEach(m => m.lessonIds.forEach(id => pathLessons.push(id)));
      const total = pathLessons.length || p.lessons;
      const done = pathLessons.filter(id => _prog.doneTopics.has(id)).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      if (done > 0 && pct < 100 && pct > bestPct) { bestPath = p; bestPct = pct; bestDone = done; bestTotal = total; }
    });
    if (bestPath) {
      continueSlot.innerHTML = `
        <div style="display:flex;align-items:center;gap:14px;padding:14px;background:var(--paper);border-radius:10px;cursor:pointer" onclick="startLearningPath(${bestPath.id})" onmouseover="this.style.background='var(--paper-warm)'" onmouseout="this.style.background='var(--paper)'">
          <div style="font-size:24px">🎯</div>
          <div style="flex:1">
            <div style="font-weight:600;font-size:14.5px">${bestPath.title}</div>
            <div style="font-size:13px;color:var(--ink-muted)">${bestDone}/${bestTotal} topics · ${bestPct}% complete</div>
          </div>
          <div style="text-align:right">
            <div style="width:72px;background:var(--border);border-radius:100px;height:6px;overflow:hidden;margin-bottom:4px"><div style="width:${bestPct}%;height:100%;background:var(--emerald);border-radius:100px"></div></div>
            <span style="color:var(--emerald);font-weight:700;font-size:13px">Continue →</span>
          </div>
        </div>`;
    }
  }

  // ── Activity feed ──
  const actFeed = document.getElementById('dash-activity-feed');
  const actCount = document.getElementById('dash-activity-count');
  if (actFeed) {
    const activity = _dash.getActivity();
    const doneLessons = LESSONS.filter(l => _prog.doneTopics.has(l.id)).slice(-5).reverse();
    // Merge with stored activity
    const allActivity = [
      ...doneLessons.map(l => ({icon:'', text:`Completed: ${l.title}`, ts: _prog.startedAt[l.id] || Date.now()})),
      ...activity.filter(a => !doneLessons.find(l => a.text.includes(l.title)))
    ].slice(0,8);
    if (actCount) actCount.textContent = allActivity.length ? allActivity.length + ' events' : '';
    actFeed.innerHTML = allActivity.length
      ? allActivity.map(a => `
        <div style="display:flex;align-items:center;gap:11px;padding:10px 0;border-bottom:1px solid var(--border)">
          <div style="width:32px;height:32px;border-radius:8px;background:var(--emerald-pale);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">${a.icon}</div>
          <div style="flex:1"><div style="font-size:13.5px;font-weight:500;color:var(--ink)">${a.text}</div><div style="font-size:11.5px;color:var(--ink-muted)">${_timeAgo(a.ts)}</div></div>
        </div>`).join('')
      : '<p style="font-size:13.5px;color:var(--ink-muted);padding:16px 0">No activity yet — complete a lesson or save a tool to get started.</p>';
  }

  // ── Assessment axes (from capScores) ──
  const axesEl = document.getElementById('dashAssessAxes');
  if (axesEl) {
    const axes = [
      {name:'Messaging & Case for Support', key:'messaging', pct: capAvg || 38, color:'var(--rose)'},
      {name:'Donor Pipeline', key:'pipeline', pct: capAvg || 55, color:'var(--gold)'},
      {name:'Grant Readiness', key:'grants', pct: capAvg || 70, color:'var(--emerald)'},
      {name:'Digital & Outreach', key:'digital', pct: capAvg || 62, color:'var(--sky)'},
      {name:'Donor Retention', key:'retention', pct: capAvg || 80, color:'var(--emerald)'},
      {name:'Program Packaging', key:'packaging', pct: capAvg || 45, color:'var(--gold)'},
    ];
    // If capScores has data, use real averages per category from CAP_MODEL
    if (capVals.length) {
      const catMap = {};
      CAP_MODEL.forEach(c => {
        if (!catMap[c.category]) catMap[c.category] = [];
        if (capScores[c.num]) catMap[c.category].push((capScores[c.num] / 5) * 100);
      });
      axes.forEach(a => {
        const cat = Object.keys(catMap).find(k => k.toLowerCase().includes(a.key.slice(0,4)));
        if (cat && catMap[cat].length) a.pct = Math.round(catMap[cat].reduce((s,v) => s+v, 0) / catMap[cat].length);
      });
    }
    const overallPct = Math.round(axes.reduce((s,a) => s + a.pct, 0) / axes.length);
    const scorePctEl = document.getElementById('dash-score-pct');
    if (scorePctEl) scorePctEl.textContent = overallPct + '%';
    axesEl.innerHTML = axes.map(a => `
      <div class="result-axis" style="margin-bottom:14px">
        <div class="result-axis-header"><span>${a.name}</span><strong style="color:${a.color}">${a.pct}%</strong></div>
        <div class="result-bar-track"><div class="result-bar-fill" style="width:${a.pct}%;background:${a.color}"></div></div>
      </div>`).join('');
  }

  // ── Cap scores grid (assessment tab) ──
  const capGrid = document.getElementById('dash-cap-scores-grid');
  if (capGrid) {
    capGrid.innerHTML = CAP_MODEL.slice(0,10).map(cap => {
      const score = capScores[cap.num];
      const labels = ['','Beginner','Developing','Competent','Advanced','Expert'];
      const colors = ['','var(--rose)','var(--gold)','var(--gold)','var(--sky)','var(--emerald)'];
      return `
        <div style="padding:12px 14px;border:1.5px solid ${score ? cap.color : 'var(--border)'};border-radius:10px;background:${score ? cap.colorPale : '#fff'};cursor:pointer" onclick="openCapModal(${cap.num})">
          <div style="font-size:18px;margin-bottom:4px">${cap.icon}</div>
          <div style="font-size:12.5px;font-weight:700;color:var(--ink);margin-bottom:4px">${cap.title}</div>
          ${score
            ? `<div style="font-size:11.5px;font-weight:700;color:${colors[score]}">${score}/5 · ${labels[score]}</div>`
            : `<div style="font-size:11.5px;color:var(--ink-muted)">Not yet rated — tap to rate</div>`}
        </div>`;
    }).join('');
  }

  // ── Progress tab ──
  const progressEl = document.getElementById('dashProgressContent');
  if (progressEl) {
    progressEl.dataset.rendered = '';
    const pathColors = ['var(--emerald)','var(--gold)','var(--sky)','var(--rose)'];
    const pathsHtml = PATHS.map((p, pi) => {
      const pathLessons = [];
      if (PATH_DETAILS[p.id]) PATH_DETAILS[p.id].modules.forEach(m => m.lessonIds.forEach(id => pathLessons.push(id)));
      const total = pathLessons.length || p.lessons;
      const done  = pathLessons.filter(id => _prog.doneTopics.has(id)).length;
      const pct   = total ? Math.round((done / total) * 100) : 0;
      const col   = pathColors[pi % pathColors.length];
      return `<div style="margin-bottom:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:14px;font-weight:600;cursor:pointer;color:var(--ink)" onclick="startLearningPath(${p.id})">${p.title}</span>
          <span style="font-size:12px;color:${col};font-weight:700;white-space:nowrap;margin-left:8px">${pct}% · ${done}/${total}</span>
        </div>
        <div style="background:var(--paper-warm);border-radius:100px;height:8px;overflow:hidden">
          <div style="width:${pct}%;height:100%;background:${col};border-radius:100px;transition:width 1s ease"></div>
        </div>
        ${pct > 0 && pct < 100 ? `<div style="font-size:11px;color:var(--ink-muted);margin-top:4px">In progress · <span style="color:${col};cursor:pointer;font-weight:600" onclick="startLearningPath(${p.id})">Continue →</span></div>` : ''}
        ${pct === 100 ? `<div style="font-size:11px;color:var(--emerald);font-weight:700;margin-top:4px">Completed!</div>` : ''}
      </div>`;
    }).join('');

    const doneLessons = LESSONS.filter(l => _prog.doneTopics.has(l.id));
    const recentHtml = doneLessons.length ? doneLessons.slice(-6).reverse().map(l => `
      <div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="openLessonPlayer(${l.id},0)">
        <div style="width:36px;height:36px;border-radius:8px;background:var(--emerald-pale);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">📚</div>
        <div style="flex:1">
          <div style="font-size:13.5px;font-weight:600">${l.title}</div>
          <div style="font-size:12px;color:var(--ink-muted)">${l.cat}</div>
        </div>
        <span style="font-size:16px;color:var(--emerald)">✓</span>
      </div>`).join('')
    : '<p style="font-size:13.5px;color:var(--ink-muted);padding:16px 0">No topics completed yet — start a lesson to track your progress here.</p>';

    progressEl.innerHTML = `
      <div class="card" style="margin-bottom:20px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
          <h3 style="font-size:16px;font-weight:700">Learning Path Progress</h3>
          <span style="font-size:13px;color:var(--emerald);font-weight:700">${totalDone} topic${totalDone !== 1 ? 's' : ''} done</span>
        </div>
        ${pathsHtml || '<p style="color:var(--ink-muted);font-size:14px">Start any learning path to track progress here.</p>'}
        <button class="btn-outline" style="margin-top:8px" onclick="navigate('learning-paths')">Browse All Paths →</button>
      </div>
      <div class="card">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Recently Completed</h3>
        ${recentHtml}
      </div>`;
  }

  // ── Saved tab ──
  const savedEl = document.getElementById('dashSavedContent');
  if (savedEl) {
    savedEl.dataset.rendered = '';
    const savedItems = _dash.getSaved();
    savedEl.innerHTML = `
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <h3 style="font-size:16px;font-weight:700">Saved Items (${savedItems.length})</h3>
          <button class="btn-outline" style="padding:6px 14px;font-size:12.5px" onclick="navigate('tools')">+ Browse More</button>
        </div>
        ${savedItems.length ? `
          <div style="display:flex;flex-direction:column;gap:8px">
            ${savedItems.map(s => `
              <div id="saved-row-${s.id}" style="display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--border);border-radius:10px;transition:border-color .2s" onmouseover="this.style.borderColor='var(--emerald)'" onmouseout="this.style.borderColor='var(--border)'">
                <span style="font-size:22px">${s.icon || ''}</span>
                <div style="flex:1">
                  <div style="font-size:14px;font-weight:600">${s.title}</div>
                  <div style="font-size:12px;color:var(--ink-muted)">${s.type || 'Resource'} · Saved ${_timeAgo(s.savedAt)}</div>
                </div>
                <div style="display:flex;gap:8px">
                  <button class="btn-outline" style="padding:6px 12px;font-size:12px" onclick="navigate('${s.page || 'tools'}');showToast('Opening…')">Open</button>
                  <button style="padding:6px 10px;border:1px solid var(--border);border-radius:7px;background:#fff;cursor:pointer;font-size:12px;color:var(--ink-muted)" onclick="dashUnsave('${s.id}')" title="Remove">✕</button>
                </div>
              </div>`).join('')}
          </div>`
        : `<div class="empty-state" style="padding:40px 24px">
            <div class="empty-state-icon">🔖</div>
            <h3>No saved items yet</h3>
            <p>Browse Tools & Templates and tap the save button to add items here.</p>
            <button class="btn-primary" onclick="navigate('tools')">Browse Tools →</button>
          </div>`}
      </div>`;
  }

  // ── Recommended tab ──
  const recEl = document.getElementById('dashRecommendedContent');
  if (recEl && !recEl.dataset.rendered) {
    recEl.dataset.rendered = '1';
    // Determine weakest areas from assessment axes
    const axes = [
      {name:'Messaging & Case for Support',pct:38,color:'var(--rose)',pale:'var(--rose-pale)',lesson:2},
      {name:'Donor Pipeline',pct:55,color:'var(--gold)',pale:'var(--gold-pale)',lesson:3},
      {name:'Grant Readiness',pct:70,color:'var(--emerald)',pale:'var(--emerald-pale)',lesson:4},
      {name:'Program Packaging',pct:45,color:'var(--gold)',pale:'var(--gold-pale)',lesson:5},
    ].sort((a,b) => a.pct - b.pct);
    recEl.innerHTML = `
      <div class="card" style="margin-bottom:16px">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:6px">Recommended For You</h3>
        <p style="font-size:13.5px;color:var(--ink-muted);margin-bottom:20px">Focus on your weakest capability areas first for maximum fundraising impact.</p>
        ${axes.slice(0,2).map((a, i) => `
          <div style="background:${a.pale};border:1px solid ${a.color}33;border-radius:10px;padding:16px;margin-bottom:12px;cursor:pointer" onclick="navigate('micro-lessons')">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:${a.color};margin-bottom:6px">Priority ${i+1} · ${a.name} (${a.pct}%)</div>
            <div style="font-size:15px;font-weight:700;margin-bottom:4px;color:var(--ink)">${a.name}</div>
            <div style="font-size:13px;color:var(--ink-muted)">Start lessons to improve this area →</div>
          </div>`).join('')}
      </div>
      <div class="card">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Suggested Learning Paths</h3>
        ${PATHS.slice(0,4).map(p => {
          const pathLessons = [];
          if (PATH_DETAILS[p.id]) PATH_DETAILS[p.id].modules.forEach(m => m.lessonIds.forEach(id => pathLessons.push(id)));
          const total = pathLessons.length || p.lessons;
          const done = pathLessons.filter(id => _prog.doneTopics.has(id)).length;
          const pct = total ? Math.round((done / total) * 100) : 0;
          return `
          <div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="startLearningPath(${p.id})">
            <span class="path-tag" style="background:${p.tagColor};color:${p.tagText};padding:3px 9px;border-radius:100px;font-size:11px;white-space:nowrap">${p.tag}</span>
            <div style="flex:1"><div style="font-size:13.5px;font-weight:600">${p.title}</div><div style="font-size:12px;color:var(--ink-muted)">${done}/${total} topics · ${pct}% done</div></div>
            <span style="color:var(--emerald);font-size:14px;font-weight:700">${pct > 0 ? 'Continue →' : 'Start →'}</span>
          </div>`;
        }).join('')}
      </div>`;
  }

  // ── Notes tab ──
  renderDashNotes();

  // ── Profile tab ──
  const profileEl = document.getElementById('dashProfileContent');
  if (profileEl && !profileEl.dataset.rendered) {
    profileEl.dataset.rendered = '1';
    const u = window._currentUser;
    profileEl.innerHTML = u ? `
      <div class="card" style="margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:18px;margin-bottom:24px">
          <div style="width:64px;height:64px;border-radius:50%;background:var(--emerald);display:flex;align-items:center;justify-content:center;font-size:26px;color:#fff;font-weight:700;flex-shrink:0">${(u.first||'?')[0].toUpperCase()}</div>
          <div>
            <div style="font-size:20px;font-weight:700;color:var(--ink)">${u.first} ${u.last}</div>
            <div style="font-size:13.5px;color:var(--ink-muted)">${u.email}</div>
            <div style="margin-top:6px;display:flex;gap:8px;flex-wrap:wrap">
              ${u.org ? `<span style="font-size:12px;background:var(--emerald-pale);color:var(--emerald);padding:2px 10px;border-radius:100px;font-weight:600">${u.org}</span>` : ''}
              ${u.country ? `<span style="font-size:12px;background:var(--paper-warm);color:var(--ink-soft);padding:2px 10px;border-radius:100px;font-weight:600">${u.country}</span>` : ''}
            </div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px">
          <div style="text-align:center;padding:14px;background:var(--paper);border-radius:10px"><div style="font-size:22px;font-weight:800;color:var(--emerald)">${totalDone}</div><div style="font-size:12px;color:var(--ink-muted)">Topics done</div></div>
          <div style="text-align:center;padding:14px;background:var(--paper);border-radius:10px"><div style="font-size:22px;font-weight:800;color:var(--gold)">${saved.length}</div><div style="font-size:12px;color:var(--ink-muted)">Saved items</div></div>
          <div style="text-align:center;padding:14px;background:var(--paper);border-radius:10px"><div style="font-size:22px;font-weight:800;color:var(--sky)">${streakDays}🔥</div><div style="font-size:12px;color:var(--ink-muted)">Day streak</div></div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn-outline" onclick="if(confirm('Sign out of FundReady Academy?')){_AUTH.signOut();showToast('Signed out. See you soon!');navigate('home')}">Sign Out</button>
          <button class="btn-outline" style="color:var(--rose);border-color:var(--rose)" onclick="dashClearData()">Clear All Data</button>
        </div>
      </div>
      <div class="card">
        <h3 style="font-size:15px;font-weight:700;margin-bottom:12px">Achievements</h3>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          ${[
            {icon:'', label:'First Steps', earned: totalDone >= 1, desc:'Complete 1 topic'},
            {icon:'', label:'Learner', earned: totalDone >= 5, desc:'Complete 5 topics'},
            {icon:'', label:'On a Roll', earned: streakDays >= 3, desc:'3-day streak'},
            {icon:'', label:'Curator', earned: saved.length >= 3, desc:'Save 3 items'},
            {icon:'', label:'Self-Aware', earned: capRated >= 5, desc:'Rate 5 capabilities'},
            {icon:'', label:'Reflector', earned: notes.length >= 3, desc:'Write 3 notes'},
          ].map(a => `
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 10px;border:1.5px solid ${a.earned ? 'var(--gold)' : 'var(--border)'};border-radius:10px;min-width:80px;text-align:center;background:${a.earned ? 'var(--gold-pale)' : '#fff'};opacity:${a.earned ? '1' : '0.5'}">
              <span style="font-size:24px">${a.icon}</span>
              <span style="font-size:11.5px;font-weight:700;color:var(--ink)">${a.label}</span>
              <span style="font-size:10px;color:var(--ink-muted)">${a.desc}</span>
            </div>`).join('')}
        </div>
      </div>`
    : `<div class="card"><div class="empty-state" style="padding:40px 24px">
        <div class="empty-state-icon">👤</div>
        <h3>Not signed in</h3>
        <p>Sign in to save your profile, track streaks, and earn achievements.</p>
        <button class="btn-primary" onclick="navigate('sign-in')">Sign In →</button>
      </div></div>`;
  }
}

/* ── Notes helpers ── */
function renderDashNotes() {
  const notesList = document.getElementById('dash-notes-list');
  if (!notesList) return;
  const notes = _dash.getNotes();
  notesList.innerHTML = notes.length
    ? notes.map(n => `
      <div id="note-${n.id}" style="display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border:1px solid var(--border);border-radius:10px;background:#fff;transition:border-color .2s" onmouseover="this.style.borderColor='var(--sky)'" onmouseout="this.style.borderColor='var(--border)'">
        <span style="font-size:16px;flex-shrink:0;margin-top:1px">📝</span>
        <div style="flex:1">
          <div style="font-size:14px;color:var(--ink);line-height:1.5">${_esc(n.text)}</div>
          <div style="font-size:11.5px;color:var(--ink-muted);margin-top:4px">${_timeAgo(n.createdAt)}</div>
        </div>
        <button onclick="dashDeleteNote(${n.id})" style="background:none;border:none;cursor:pointer;color:var(--ink-muted);font-size:16px;padding:2px;flex-shrink:0" title="Delete">✕</button>
      </div>`).join('')
    : '<p style="font-size:13.5px;color:var(--ink-muted);padding:8px 0">No notes yet — type your first insight above.</p>';
}

function dashAddNote() {
  const input = document.getElementById('dash-note-input');
  if (!input || !input.value.trim()) return;
  _dash.addNote(input.value.trim());
  _dash.logActivity('', 'Added note: ' + input.value.trim().slice(0, 50));
  input.value = '';
  renderDashNotes();
  // update sidebar stat
  const sideStats = document.getElementById('dash-sidebar-stats');
  if (sideStats) renderDashboard();
  showToast('Note saved! ✓', 'success');
}

function dashDeleteNote(id) {
  _dash.deleteNote(id);
  renderDashNotes();
  showToast('Note deleted');
}

function dashUnsave(id) {
  _dash.unsaveItem(id);
  // Re-render saved tab
  const savedEl = document.getElementById('dashSavedContent');
  if (savedEl) savedEl.dataset.rendered = '';
  renderDashboard();
  showToast('Removed from saved items');
}

function dashClearData() {
  if (!confirm('This will clear all your progress, notes, and saved items. Are you sure?')) return;
  localStorage.removeItem('fra_saved');
  localStorage.removeItem('fra_notes');
  localStorage.removeItem('fra_activity');
  localStorage.removeItem('fra_streak');
  _prog.doneTopics.clear();
  _prog.doneSubs.clear();
  Object.keys(_prog.startedAt).forEach(k => delete _prog.startedAt[k]);
  Object.keys(capScores).forEach(k => delete capScores[k]);
  // Reset rendered flags
  ['dashSavedContent','dashProgressContent','dashRecommendedContent','dashProfileContent'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.dataset.rendered = '';
  });
  renderDashboard();
  showToast('All data cleared.', 'success');
}

/* ── Utility: time-ago ── */
function _timeAgo(ts) {
  if (!ts) return '';
  const diff = Math.round((Date.now() - ts) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff/60) + 'm ago';
  if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
  return Math.floor(diff/86400) + 'd ago';
}
function _esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ── Public save helper (callable from tools/lessons pages) ── */
function dashSaveItem(icon, title, type, page) {
  const id = title.replace(/\s+/g,'-').toLowerCase().slice(0,30);
  const added = _dash.saveItem({id, icon, title, type, page});
  _dash.logActivity(icon, 'Saved: ' + title);
  showToast(added ? 'Saved to Dashboard!' : 'Already saved!', added ? 'success' : '');
  // Refresh saved tab if visible
  const savedEl = document.getElementById('dashSavedContent');
  if (savedEl) savedEl.dataset.rendered = '';
}

function dashTab(tab, btn) {
  document.querySelectorAll('#page-dashboard .sidebar-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['overview','progress','saved','assessment','recommended','notes','profile'].forEach(t => {
    const el = document.getElementById('dash-' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  // Always re-render for freshness
  renderDashboard();
}

/* ══════════════════════════════════════════════════════
   MODALS
══════════════════════════════════════════════════════ */
function showLessonModal(id) {
  const l = LESSONS.find(x => x.id === id);
  if (!l) return;
  const lessonVids = ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'];
  const vid = lessonVids[(id - 1) % lessonVids.length];
  const subcapsHtml = l.subcaps ? `
    <div style="background:var(--paper);border-radius:10px;padding:18px;margin-bottom:16px">
      <h4 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-muted);margin-bottom:12px">What You'll Learn (${l.subcaps.length} topics)</h4>
      <div style="display:flex;flex-direction:column;gap:7px">
        ${l.subcaps.map((s,i)=>`<div style="display:flex;gap:8px;font-size:13.5px;color:var(--ink-soft)"><span style="color:var(--emerald);font-weight:700;flex-shrink:0">${i+1}.</span>${s}</div>`).join('')}
      </div>
    </div>` : '';
  const assetsHtml = l.assets ? `
    <div style="background:var(--emerald-pale);border:1px solid rgba(30,107,80,.2);border-radius:10px;padding:14px;margin-bottom:18px">
      <h4 style="font-size:13px;font-weight:700;color:var(--emerald);margin-bottom:8px">Assets You'll Build</h4>
      <div style="display:flex;gap:7px;flex-wrap:wrap">
        ${l.assets.map(a=>`<span style="background:#fff;border:1px solid rgba(30,107,80,.2);border-radius:100px;padding:4px 12px;font-size:12.5px;color:var(--emerald);font-weight:500">${a}</span>`).join('')}
      </div>
    </div>` : '';
  openModal(l.title, `
    <div style="margin-bottom:14px;display:flex;gap:8px;flex-wrap:wrap">
      <span style="font-size:13px;color:var(--ink-muted)">⏱ ${l.duration}</span>
      <span style="font-size:13px;color:var(--ink-muted)">${l.count} lessons</span>
    </div>
    <p style="color:var(--ink-soft);margin-bottom:16px;font-size:15px;line-height:1.6">${l.desc}</p>
    <div style="position:relative;width:100%;padding-bottom:56.25%;background:#0f1a2e;border-radius:10px;overflow:hidden;margin-bottom:16px">
      <div id="modal-video-slot" data-src="${vid}" style="position:absolute;top:0;left:0;width:100%;height:100%;background:#111"></div>
    </div>
    ${subcapsHtml}
    ${assetsHtml}
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-primary" id="lessonStartBtn">▶ Start Full Lesson Series</button>
      <button class="btn-outline" onclick="navigate('assessment');closeModal()">Assess This Capability</button>
      <button style="padding:10px 16px;border:1px solid var(--border);border-radius:8px;background:#fff;font-size:13.5px;cursor:pointer;color:var(--ink-soft);font-family:inherit" onclick="dashSaveItem('','${l.title}','Lesson','micro-lessons');this.textContent='Saved'">Save</button>
    </div>`);
  // Wire start button safely after modal renders
  requestAnimationFrame(function() {
    var btn = document.getElementById('lessonStartBtn');
    if (btn) btn.addEventListener('click', function() {
      closeModal();
      openLessonPlayer(l.id, 0);
    });
  });
}

function showPathModal(id) {
  const p = PATHS.find(x => x.id === id);
  const d = PATH_DETAILS[id];
  if (!p) return;
  const accent = d ? d.accent : '#1e6b50';
  openModal(p.title, `
    <div style="margin-bottom:14px">
      <span style="background:${p.tagColor};color:${p.tagText};padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700">${p.tag}</span>
    </div>
    <p style="color:var(--ink-soft);margin-bottom:20px;font-size:15px;line-height:1.6">${d ? d.outcome : p.desc}</p>
    <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap">
      <div style="background:var(--emerald-pale);padding:12px 16px;border-radius:8px;text-align:center;flex:1;min-width:70px">
        <div style="font-size:22px;font-weight:800;color:var(--emerald)">${p.lessons}</div>
        <div style="font-size:12px;color:var(--ink-muted)">Lessons</div>
      </div>
      <div style="background:var(--gold-pale);padding:12px 16px;border-radius:8px;text-align:center;flex:1;min-width:70px">
        <div style="font-size:22px;font-weight:800;color:var(--gold)">${p.templates}</div>
        <div style="font-size:12px;color:var(--ink-muted)">Templates</div>
      </div>
      <div style="background:var(--sky-pale);padding:12px 16px;border-radius:8px;text-align:center;flex:1;min-width:70px">
        <div style="font-size:22px;font-weight:800;color:var(--sky)">${d ? d.time : '~4 hrs'}</div>
        <div style="font-size:12px;color:var(--ink-muted)">Total time</div>
      </div>
    </div>
    ${d ? `
    <div style="background:var(--paper);border-radius:10px;padding:16px 18px;margin-bottom:16px">
      <h4 style="font-size:13.5px;font-weight:700;margin-bottom:10px;color:${accent}">Modules in this path</h4>
      <div style="display:flex;flex-direction:column;gap:7px">
        ${d.modules.slice(0,3).map((m,i) => `
          <div style="display:flex;align-items:center;gap:10px;font-size:13px;color:var(--ink-soft)">
            <span style="width:22px;height:22px;border-radius:50%;background:${accent};color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</span>
            <span>${m.icon} ${m.title.replace(/Module \d+: /,'')}</span>
          </div>`).join('')}
        ${d.modules.length > 3 ? `<div style="font-size:12.5px;color:var(--ink-muted);padding-left:32px">+ ${d.modules.length - 3} more modules inside →</div>` : ''}
      </div>
    </div>
    ` : `
    <div style="background:var(--paper);border-radius:10px;padding:16px 18px;margin-bottom:16px">
      <h4 style="font-size:14px;font-weight:700;margin-bottom:10px">Includes:</h4>
      <div style="display:flex;flex-direction:column;gap:7px;font-size:13.5px;color:var(--ink-soft)">
        <div>${p.lessons} curated micro-lessons</div>
        <div>${p.templates} downloadable templates</div>
        <div>Done checklist after each module</div>
        <div>Optional: submit for mentor feedback</div>
      </div>
    </div>`}
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-primary" onclick="closeModal();startLearningPath(${id})">Start Learning Path →</button>
      <button class="btn-outline" onclick="closeModal()">Maybe later</button>
    </div>`);
}

// Navigate to the full path detail page
function startLearningPath(id, fromAssessment) {
  window._activePathId = id;
  window._pathFromAssessment = fromAssessment || false;
  _lpContext = null; // reset; path detail page will set it when a lesson is opened
  navigate('path-detail');
}

function showWebinarModal(id) {
  const w  = WEBINARS.find(x => x.id === id);
  const d  = WEBINAR_DETAILS[id] || {};
  if (!w) return;
  const isOD = w.status === 'on-demand';
  const col  = WEBINAR_COLORS[(id - 1) % WEBINAR_COLORS.length];
  const agenda = d.agenda || [
    'Welcome & context — who this is for',
    'The core framework explained step-by-step',
    'Live example: applying this to a small NGO',
    'Top 3 mistakes and how to avoid them',
    'Q&A + next steps and resources'
  ];

  openModal(`Webinar ${w.num}: ${w.title}`, `
    <!-- Status + meta row -->
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px">
      <span style="background:${isOD ? 'rgba(30,107,80,.12)' : 'rgba(196,135,42,.12)'};color:${isOD ? 'var(--emerald)' : 'var(--gold)'};padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700">
        ${isOD ? '▶ On Demand' : 'Upcoming'}
      </span>
      <span style="font-size:13px;color:var(--ink-muted)">60 min · Live Q&amp;A included</span>
      ${d.speaker ? `<span style="font-size:13px;color:var(--ink-muted)">${d.speaker} · ${d.speakerRole}</span>` : ''}
    </div>

    <!-- Description -->
    <p style="color:var(--ink-soft);margin-bottom:18px;font-size:15px;line-height:1.6">${w.desc}</p>

    ${isOD ? `
    <!-- Video player block (on-demand) -->
    <div style="position:relative;width:100%;aspect-ratio:16/9;background:linear-gradient(135deg,#0c1520,#0e2010);border-radius:12px;overflow:hidden;margin-bottom:6px;cursor:pointer" id="wb-player-${id}" onclick="_playWebinarVideo(${id}, this)">
      <!-- Gradient overlay -->
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 60% 40%,${col}44 0%,transparent 65%);pointer-events:none"></div>
      <!-- Play button -->
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">
        <div style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.15);border:2.5px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);transition:all .2s"
          onmouseover="this.style.background='rgba(255,255,255,.28)'" onmouseout="this.style.background='rgba(255,255,255,.15)'">
          <span style="font-size:24px;margin-left:4px">▶</span>
        </div>
        <div style="text-align:center">
          <div style="font-size:13px;font-weight:700;color:#fff">Click to watch recording</div>
          <div style="font-size:11.5px;color:rgba(255,255,255,.55);margin-top:3px">60 min · Full session</div>
        </div>
      </div>
      <!-- Webinar number watermark -->
      <div style="position:absolute;top:12px;left:14px;background:${col};color:#fff;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:800">W${w.num}</div>
    </div>
    <div style="font-size:12px;color:var(--ink-muted);margin-bottom:20px;padding:0 2px">Full 60-minute recording with slides and Q&amp;A</div>
    ` : `
    <!-- Upcoming registration block -->
    <div style="background:var(--gold-pale);border:1.5px solid rgba(196,135,42,.25);border-radius:12px;padding:22px;margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;flex-wrap:wrap">
        <div style="width:48px;height:48px;border-radius:12px;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">🗓</div>
        <div>
          <div style="font-size:15px;font-weight:700">Coming Soon — Register Free</div>
          <div style="font-size:13px;color:var(--ink-muted)">Date TBC · 11:00 AM GST · Online via Zoom</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <input id="wb-reg-email" type="email" placeholder="Your email address"
          style="flex:1;min-width:200px;padding:10px 14px;border:1.5px solid rgba(196,135,42,.3);border-radius:8px;font-size:14px;font-family:inherit;outline:none;background:#fff"
          onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='rgba(196,135,42,.3)'">
        <button onclick="_registerWebinar(${id})"
          style="padding:10px 20px;background:var(--gold);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">Register Free →</button>
      </div>
      <div style="font-size:12px;color:var(--ink-muted);margin-top:10px">You'll receive the date, Zoom link, and pre-webinar prep guide by email.</div>
    </div>
    `}

    <!-- Two-column: agenda + resources -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px" class="wm-two-col">
      <!-- Agenda -->
      <div style="background:var(--paper);border-radius:10px;padding:16px 18px">
        <h4 style="font-size:13.5px;font-weight:700;margin-bottom:12px;color:var(--ink)">Session Agenda</h4>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${agenda.map((item, i) => `
            <div style="display:flex;align-items:flex-start;gap:8px">
              <span style="width:18px;height:18px;background:${col};color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;margin-top:1px">${i+1}</span>
              <span style="font-size:13px;color:var(--ink-soft);line-height:1.4">${item}</span>
            </div>`).join('')}
        </div>
      </div>
      <!-- Resources -->
      <div style="background:var(--paper);border-radius:10px;padding:16px 18px">
        <h4 style="font-size:13.5px;font-weight:700;margin-bottom:12px;color:var(--ink)">What You'll Get</h4>
        <div style="display:flex;flex-direction:column;gap:7px">
          ${w.includes.map(inc => `
            <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-soft);background:#fff;padding:7px 10px;border-radius:7px;border:1px solid var(--border)">
              <span style="color:${col}">📄</span>${inc}
            </div>`).join('')}
          ${(d.takeaways || []).map(tk => `
            <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-soft);background:#fff;padding:7px 10px;border-radius:7px;border:1px solid var(--border)">
              <span style="color:${col}">✅</span>${tk}
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      ${isOD ? `
        <button onclick="showWebinarSlides(${id})"
          style="padding:10px 18px;background:#dc2626;color:#fff;border:none;border-radius:8px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit">View Slides</button>
        <button onclick="downloadWord('${w.title.replace(/'/g,"\\x27")} Template Pack','Webinar ${w.num}')"
          style="padding:10px 18px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit">Template Pack</button>
        ${d.relatedPath ? `<button onclick="closeModal();startLearningPath(${d.relatedPath})"
          style="padding:10px 18px;background:${col};color:#fff;border:none;border-radius:8px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit">Start Related Path →</button>` : ''}
      ` : `
        <button onclick="_registerWebinar(${id})"
          style="padding:10px 22px;background:var(--gold);color:#fff;border:none;border-radius:8px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit">Register Free →</button>
        <button onclick="showToast('Reminder set! We\\'ll notify you 48 hours before.','success')"
          style="padding:10px 18px;background:#fff;color:var(--ink);border:1.5px solid var(--border);border-radius:8px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit">Set Reminder</button>
      `}
    </div>
  `);
}

function _playWebinarVideo(id, container) {
  // Replace play-gate with actual video
  const urls = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  ];
  const src = urls[(id - 1) % urls.length];
  // Remove onclick so it doesn't replay
  container.removeAttribute('onclick');
  container.style.cursor = 'default';
  // Clear container and inject video
  container.innerHTML = '';
  const v = document.createElement('video');
  v.src = src;
  v.controls = true;
  v.autoplay = true;
  v.preload = 'auto';
  v.setAttribute('playsinline', '');
  v.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:#000';
  container.appendChild(v);
}

function _registerWebinar(id) {
  const emailEl = document.getElementById('wb-reg-email');
  const email   = emailEl ? emailEl.value.trim() : '';
  if (!email || !email.includes('@')) {
    if (emailEl) { emailEl.style.borderColor = '#dc2626'; emailEl.focus(); }
    showToast('Please enter a valid email address', 'error');
    return;
  }
  showToast('Registered! 🎉 Check your inbox for the Zoom link and prep guide.', 'success');
  closeModal();
}

function showWebinarSlides(id) {
  const w   = WEBINARS.find(x => x.id === id);
  const d   = WEBINAR_DETAILS[id] || {};
  const col = WEBINAR_COLORS[(id - 1) % WEBINAR_COLORS.length];
  if (!w) return;

  const agenda    = d.agenda    || [];
  const takeaways = d.takeaways || [];

  // Build slide data: title + one per agenda item + takeaways + close
  const slides = [
    // Slide 0: Title
    {
      type: 'title',
      content: `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;padding:32px">
          <div style="background:${col};color:#fff;padding:6px 18px;border-radius:100px;font-size:12px;font-weight:700;margin-bottom:18px;letter-spacing:.05em">WEBINAR ${w.num} · FUNDREADY ACADEMY</div>
          <h2 style="font-size:26px;font-weight:900;color:#fff;line-height:1.25;margin-bottom:16px;max-width:520px">${w.title}</h2>
          <p style="font-size:15px;color:rgba(255,255,255,.75);max-width:460px;line-height:1.6;margin-bottom:24px">${d.keyTopic || w.desc}</p>
          ${d.speaker ? `<div style="display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.1);border-radius:10px;padding:10px 18px">
            <div style="width:36px;height:36px;border-radius:50%;background:${col};display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff">${d.speaker.charAt(0)}</div>
            <div style="text-align:left"><div style="font-size:13px;font-weight:700;color:#fff">${d.speaker}</div><div style="font-size:11.5px;color:rgba(255,255,255,.6)">${d.speakerRole}</div></div>
          </div>` : ''}
        </div>`
    },
    // Slide 1: Agenda overview
    {
      type: 'agenda',
      content: `
        <div style="padding:32px;height:100%;display:flex;flex-direction:column">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${col};margin-bottom:8px">Session Overview</div>
          <h3 style="font-size:22px;font-weight:800;color:#fff;margin-bottom:20px">What We'll Cover</h3>
          <div style="display:flex;flex-direction:column;gap:10px;flex:1">
            ${agenda.map((item, i) => `
              <div style="display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.07);border-radius:10px;padding:12px 16px">
                <div style="width:28px;height:28px;border-radius:50%;background:${col};color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0">${i+1}</div>
                <span style="font-size:14px;color:rgba(255,255,255,.88);line-height:1.4">${item}</span>
              </div>`).join('')}
          </div>
        </div>`
    },
    // Slides 2+: One per agenda item
    ...agenda.map((item, i) => ({
      type: 'content',
      content: `
        <div style="padding:32px;height:100%;display:flex;flex-direction:column;justify-content:center">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${col};margin-bottom:10px">Part ${i+1} of ${agenda.length}</div>
          <h3 style="font-size:24px;font-weight:800;color:#fff;line-height:1.3;margin-bottom:20px">${item}</h3>
          <div style="width:48px;height:3px;background:${col};border-radius:2px;margin-bottom:20px"></div>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${_getSlidePoints(id, i).map(pt => `
              <div style="display:flex;align-items:flex-start;gap:10px">
                <div style="width:6px;height:6px;border-radius:50%;background:${col};flex-shrink:0;margin-top:7px"></div>
                <span style="font-size:14px;color:rgba(255,255,255,.82);line-height:1.55">${pt}</span>
              </div>`).join('')}
          </div>
        </div>`
    })),
    // Last slide: Key takeaways
    {
      type: 'takeaways',
      content: `
        <div style="padding:32px;height:100%;display:flex;flex-direction:column;justify-content:center">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${col};margin-bottom:8px">What You'll Walk Away With</div>
          <h3 style="font-size:22px;font-weight:800;color:#fff;margin-bottom:22px">Key Takeaways & Resources</h3>
          <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:24px">
            ${takeaways.map(tk => `
              <div style="display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:13px 16px">
                <span style="font-size:18px">📥</span>
                <span style="font-size:14px;color:rgba(255,255,255,.9);font-weight:600">${tk}</span>
              </div>`).join('')}
          </div>
          <div style="background:${col}22;border:1px solid ${col}66;border-radius:10px;padding:14px 18px;text-align:center">
            <div style="font-size:13px;color:rgba(255,255,255,.7)">Download all resources from the webinar modal</div>
          </div>
        </div>`
    }
  ];

  let current = 0;

  function renderSlideViewer() {
    const total = slides.length;
    const pct   = Math.round(((current + 1) / total) * 100);
    return `
      <div id="slide-viewer" style="background:linear-gradient(135deg,#0f1a2e,#0e2018);border-radius:14px;overflow:hidden;position:relative;user-select:none">
        <!-- Progress bar -->
        <div style="height:3px;background:rgba(255,255,255,.1)">
          <div style="height:100%;width:${pct}%;background:${col};transition:width .3s ease"></div>
        </div>
        <!-- Slide counter -->
        <div style="position:absolute;top:12px;right:14px;font-size:11.5px;color:rgba(255,255,255,.4);font-weight:600;z-index:2">${current+1} / ${total}</div>
        <!-- Slide content -->
        <div style="min-height:340px;max-height:420px;overflow-y:auto">
          ${slides[current].content}
        </div>
        <!-- Navigation -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:rgba(0,0,0,.25);border-top:1px solid rgba(255,255,255,.07)">
          <button onclick="_slideNav(-1)" ${current===0?'disabled':''} style="padding:7px 16px;border-radius:7px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.07);color:${current===0?'rgba(255,255,255,.25)':'#fff'};font-size:13px;font-weight:600;cursor:${current===0?'default':'pointer'};font-family:inherit;transition:all .15s">← Prev</button>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="display:flex;gap:5px">
              ${slides.map((_,i) => `<div onclick="_slideGo(${i})" style="width:${i===current?'18px':'6px'};height:6px;border-radius:3px;background:${i===current?col:'rgba(255,255,255,.2)'};cursor:pointer;transition:all .25s"></div>`).join('')}
            </div>
            <button onclick="downloadWebinarPdf(${id})" style="padding:5px 12px;border-radius:7px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.1);color:#fff;font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap">Download PDF</button>
          </div>
          <button onclick="_slideNav(1)" ${current===total-1?'disabled':''} style="padding:7px 16px;border-radius:7px;border:1px solid rgba(255,255,255,.2);background:${current===total-1?'rgba(255,255,255,.07)':col};color:${current===total-1?'rgba(255,255,255,.25)':'#fff'};font-size:13px;font-weight:600;cursor:${current===total-1?'default':'pointer'};font-family:inherit;transition:all .15s">Next →</button>
        </div>
      </div>`;
  }

  window._slideNav = function(dir) {
    current = Math.max(0, Math.min(slides.length - 1, current + dir));
    const viewer = document.getElementById('slide-viewer');
    if (viewer) viewer.outerHTML = renderSlideViewer();
    // Re-query after DOM replace
    const newViewer = document.getElementById('slide-viewer');
  };
  window._slideGo = function(i) { current = i; window._slideNav(0); };

  closeModal();
  setTimeout(() => {
    openModal(`Webinar ${w.num}: Slides — ${w.title}`, renderSlideViewer());
    // Keyboard navigation
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') window._slideNav(1);
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   window._slideNav(-1);
    };
    document.addEventListener('keydown', handler);
    // Clean up listener when modal closes
    const orig = window.closeModal;
    window.closeModal = function() { document.removeEventListener('keydown', handler); window.closeModal = orig; orig(); };
  }, 50);
}

function downloadWebinarPdf(id) {
  const w   = WEBINARS.find(x => x.id === id);
  const d   = WEBINAR_DETAILS[id] || {};
  if (!w) return;

  showToast('Generating PDF…', 'success');

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = 297, H = 210; // A4 landscape mm

  // Color palette
  const colRaw  = (WEBINAR_COLORS[(id-1) % WEBINAR_COLORS.length] || '#1e6b50');
  const colRgb  = _hexToRgb(colRaw) || [30,107,80];
  const darkBg  = [15,26,46];
  const agenda  = d.agenda    || [];
  const takeaways = d.takeaways || [];

  function addSlide(drawFn, pageNum) {
    if (pageNum > 0) doc.addPage();
    // Dark background
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, W, H, 'F');
    // Top accent bar
    doc.setFillColor(...colRgb);
    doc.rect(0, 0, W, 3, 'F');
    // Slide number bottom right
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text(`${pageNum + 1}`, W - 8, H - 4);
    drawFn(doc);
  }

  function accentBadge(text, x, y) {
    doc.setFontSize(8); doc.setTextColor(...colRgb);
    doc.setFont('helvetica','bold');
    doc.text(text.toUpperCase(), x, y);
  }

  function heading(text, x, y, size=28) {
    doc.setFontSize(size); doc.setTextColor(255,255,255);
    doc.setFont('helvetica','bold');
    const lines = doc.splitTextToSize(text, W - x - 16);
    doc.text(lines, x, y);
    return y + lines.length * (size * 0.4);
  }

  function body(text, x, y, size=12, color=[200,210,220]) {
    doc.setFontSize(size); doc.setTextColor(...color);
    doc.setFont('helvetica','normal');
    const lines = doc.splitTextToSize(text, W - x - 16);
    doc.text(lines, x, y);
    return y + lines.length * (size * 0.45);
  }

  function bullet(text, x, y) {
    doc.setFillColor(...colRgb);
    doc.circle(x, y - 1.5, 1.2, 'F');
    return body(text, x + 5, y, 12, [200,210,220]);
  }

  function numberedRow(num, text, x, y) {
    // Row background
    doc.setFillColor(255,255,255,0.06);
    doc.setFillColor(30,40,55);
    doc.rect(x, y - 5, W - x*2, 9, 'F');
    // Circle
    doc.setFillColor(...colRgb);
    doc.circle(x + 5, y - 1, 3.5, 'F');
    doc.setFontSize(9); doc.setTextColor(255,255,255);
    doc.setFont('helvetica','bold');
    doc.text(String(num), x + 5, y + 0.8, { align:'center' });
    // Text
    body(text, x + 12, y, 12, [220,230,240]);
  }

  // ── SLIDE 1: Title ────────────────────────────────────────
  addSlide(doc => {
    // Left accent bar
    doc.setFillColor(...colRgb);
    doc.rect(0, 0, 4, H, 'F');
    accentBadge(`WEBINAR ${w.num}  ·  FUNDREADY ACADEMY`, 10, 20);
    let y = heading(w.title, 10, 38, 30);
    y = body(d.keyTopic || w.desc, 10, y + 6, 13, [180,195,210]);
    if (d.speaker) {
      doc.setFillColor(...colRgb.map(c => Math.min(255, c + 80)));
      doc.roundedRect(10, H - 28, 120, 14, 2, 2, 'F');
      doc.setFontSize(11); doc.setTextColor(255,255,255);
      doc.setFont('helvetica','bold');
      doc.text(`${d.speaker}  ·  ${d.speakerRole}`, 16, H - 18);
    }
  }, 0);

  // ── SLIDE 2: Agenda overview ──────────────────────────────
  addSlide(doc => {
    doc.setFillColor(...colRgb);
    doc.rect(0, 0, W, 12, 'F');
    doc.setFontSize(9); doc.setTextColor(255,255,255);
    doc.setFont('helvetica','bold');
    doc.text('SESSION OVERVIEW', 10, 8);
    heading("What We'll Cover", 10, 28, 22);
    agenda.forEach((item, i) => {
      numberedRow(i+1, item, 10, 46 + i * 18);
    });
  }, 1);

  // ── SLIDES 3+: One per agenda item ───────────────────────
  agenda.forEach((item, i) => {
    addSlide(doc => {
      accentBadge(`PART ${i+1} OF ${agenda.length}`, 10, 18);
      let y = heading(item, 10, 32, 22);
      doc.setFillColor(...colRgb);
      doc.rect(10, y + 4, 18, 1.5, 'F');
      y += 14;
      const pts = _getSlidePoints(id, i);
      pts.forEach(pt => { y = bullet(pt, 14, y) + 6; });
    }, i + 2);
  });

  // ── LAST SLIDE: Takeaways ─────────────────────────────────
  addSlide(doc => {
    doc.setFillColor(...colRgb);
    doc.rect(0, 0, W, 12, 'F');
    doc.setFontSize(9); doc.setTextColor(255,255,255);
    doc.setFont('helvetica','bold');
    doc.text("WHAT YOU'LL WALK AWAY WITH", 10, 8);
    heading('Key Takeaways & Resources', 10, 28, 22);
    takeaways.forEach((tk, i) => {
      const y = 46 + i * 18;
      doc.setFillColor(30,42,55);
      doc.rect(10, y - 5, W - 20, 13, 'F');
      doc.setFontSize(10); doc.setTextColor(255,255,255);
      doc.setFont('helvetica','normal');
      doc.text(`${tk}`, 16, y + 3);
    });
    // Footer
    doc.setFontSize(9); doc.setTextColor(100,120,140);
    doc.text('fundreadyacademy.org', W/2, H - 8, { align:'center' });
  }, agenda.length + 2);

  doc.save(`FundReady_Webinar_${w.num}_${w.title.replace(/[^a-z0-9]/gi,'_')}.pdf`);
  showToast('PDF downloaded! ✅', 'success');
}

function _hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? [parseInt(r[1],16), parseInt(r[2],16), parseInt(r[3],16)] : null;
}

function _getSlidePoints(webinarId, agendaIndex) {
  const points = {
    1: [['NGOs often rely on one funder, leaving them vulnerable','Reactive fundraising creates a feast-or-famine cycle','Strategic planning changes everything'],['The 6 dimensions: goals, channels, governance, team, tools, plan','Rate yourself honestly — gaps are opportunities','Most NGOs score 2–3 out of 5 on first assessment'],['Work through each question live as a team','Note your lowest-scoring dimensions for priority action','The score is a starting point, not a judgment'],['Phase 1: Foundation (Days 1–30)','Phase 2: Pipeline (Days 31–60)','Phase 3: Scale & Sustain (Days 61–90)'],['Your biggest obstacle is usually mindset, not resources','Build the habit before building the system','One hour per week of focused fundraising compounds fast']],
    2: [['Revenue targets must be set before channels are chosen','Break annual target into quarters and months','Assign ownership for each channel'],['Individual: events, appeals, major donors','Institutional: grants, foundations, government','Corporate: sponsorship, strategic partnerships'],['Monthly check-ins prevent year-end panic','Q1: plan and build; Q2: execute; Q3: review; Q4: close','Flag red quarters early so you can adjust'],['Boards approve budgets, not strategies — give them targets','Present as dashboard: on track / at risk / behind','Ask for their network access, not just oversight'],['Use the template live: fill in your NGO\'s numbers','Calculate monthly required vs projected','Identify your highest-confidence revenue stream']],
    3: [['Funders read the headline, then the ask — then decide to read on','Most NGOs bury the lead in organizational history','Lead with the transformation you create, not your activities'],['1. The problem (2 sentences) 2. Your solution (2 sentences) 3. Your proof (3 data points) 4. The ask (1 sentence) 5. Your contact','Every section must earn the next read','Use subheadings as navigation for busy readers'],['Avoid jargon like "capacity building", "holistic approach", "sustainability"','Use outcome language: "63 girls stayed in school" not "we supported girls\'education"','Write at reading level 8 — simple, powerful, clear'],['Common weaknesses: generic opening, no proof, unclear ask','Rewrite the headline to state the transformation','Add one specific number to every claim'],['30-second version: problem + solution + ask','60-second version: add proof and next step','Practice until it sounds like a conversation, not a pitch']],
    4: [['Activities: what you do. Outputs: what you produce. Outcomes: what changes','Funders fund outcomes, not activities','Every program must have a measurable outcome statement'],['Unit cost = total program cost ÷ number of beneficiaries','Include staff time, overheads, and direct costs','Round to a clean number that tells a story (e.g. $50 per child per year)'],['Bronze: minimum viable impact at entry price','Silver: full program at mid-range investment','Gold: expanded impact with premium add-ons','Each tier must stand alone as a fundable offer'],['Program: community health education','Bronze: $5,000 trains 50 health volunteers','Gold: $25,000 trains + equips + monitors 200 volunteers'],['Download the template and fill in your program name','Calculate your unit cost before next session','Draft one Bronze/Silver/Gold tier description']],
    5: [['Start with who has funded NGOs like yours in your geography','Annual reports, grant databases, LinkedIn — all free','The "who funded who" method: find 3 similar NGOs, trace their funders'],['Ideal donor profile: geography, focus area, grant size, cycle timing','Build a separate profile for grants, corporates, and individuals','Your profile narrows your prospect list — that\'s the point'],['Score each prospect: fit (1–3), capacity (1–3), access (1–3)','Go if 7+, No-go if below 5, Research more if in between','Don\'t apply to a funder with a fit score below 2'],['A warm introduction is worth 10 cold emails','Map your board\'s corporate connections','Use LinkedIn to find second-degree connections to funders'],['List 20 prospects, score them all','Shortlist your top 5 for immediate outreach','Assign one prospect per team member to research this week']],
    6: [['Most NGOs treat their pipeline as a contact list — not a system','Stages matter: Lead, Qualify, Cultivate, Ask, Steward','A pipeline is a prediction tool, not just a tracker'],['Column order: Name, Type, Stage, Last Contact, Next Action, Ask Amount','Color-code stages for at-a-glance review','Keep it in one shared file your whole team can edit'],['Every Monday: 20 minutes to review every active prospect','Move stale prospects to "nurture" — not delete','Set next action for every pipeline entry before closing'],['Week 1 email: connection + curiosity, not ask','Week 3 call: listen for alignment','Week 6: meeting or proposal','Week 10: ask'],['Open a Google Sheet, create 8 columns','Add every warm prospect you can think of','Score each one and set a next action this week']],
    7: [['Fear of rejection is the #1 reason fundraisers don\'t ask','The ask is a service, not an imposition — you\'re offering an opportunity','The worst that happens is a "not now" — which is information'],['1. State what you\'ve observed 2. Make a specific ask 3. Be quiet','Use numbers: "$5,000" not "some support"','Tie the ask to an outcome they care about'],['"We don\'t have budget" → "When does your next budget cycle open?"','\"We need to think about it" → "What would help you decide?"','\"We already support similar NGOs" → "Which ones? There may be synergy"'],['Pair up: one is the fundraiser, one is the donor','Fundraiser makes a specific ask, donor raises one objection','Debrief: what felt natural? what felt forced?'],['Use the template for 3 different funder types','Write your opening line — the one that leads to the ask','Practice it out loud before your next funder meeting']],
    8: [['The concept note is a filter, not a proposal — keep it tight','Must include: problem, solution, budget range, expected outcomes','2 pages maximum; most funders read only the first paragraph'],['Section order mirrors how funders evaluate: why, what, how, who, how much','Executive summary must stand alone — some funders read only this','Every claim needs a source or reference'],['Budget should tell a story, not just list numbers','Justify headings, not line items — "Programme Staff (2 FTEs)" is enough','Indirect costs: know your funder\'s cap (usually 10–20%)'],['Mistake 1: too much background, too little outcome','Mistake 2: vague beneficiary numbers','Mistake 3: budget doesn\'t match narrative','Mistake 4: submitted to wrong funder'],['Read one section of your last proposal and apply 2 fixes','Find one place to add a specific number or outcome','Swap one jargon phrase for plain language']],
    9: [['Score: fit 1–3, capacity 1–3, strategic value 1–3','Apply only if total ≥ 7; research more if 5–6; decline if ≤ 4','Time is your scarcest resource — protect it with the matrix'],['Strong proposals share 4 traits: specific outcomes, clear budget logic, credible team, realistic timeline','They answer the funder\'s question before it\'s asked','They feel like a partnership, not a transaction'],['M&E doesn\'t need to be complex — it needs to be credible','Minimum: baseline, midline, endline + one data collection method','Use indicators that are observable and measurable'],['Folder must contain: registration, audit, board list, policies, past reports','Build it once, maintain it quarterly','Funders who visit unprepared NGOs rarely return'],['Review one past application against today\'s checklist','Identify 3 things you\'d change','Set a date to build or update your compliance folder']],
    10: [['Research their CSR report before any contact','Align with one of their stated priority areas — not all of them','Know their employee count: this determines volunteering potential'],['Menu should offer 3–4 tiers from $2,000 to $50,000+','Each tier must offer specific, named benefits','Include impact metrics at each tier — not just logo placement'],['Open with their CSR challenge, not your NGO\'s story','Slide 1: their world; Slide 2: the gap; Slide 3: your solution; Slide 4: the partnership; Slide 5: the ask','Leave 20 minutes for questions — that\'s where the deal starts'],['Send impact report at 3, 6, and 12 months','Annual review meeting: show data + ask for renewal or upgrade','Introduce them to beneficiaries once — it changes everything'],['List 10 companies in your geography with CSR programs','Score each for fit','Draft the opening line of your pitch for your top 3']],
    11: [['Set one clear goal: amount, donors, or both','Build a unit cost to anchor the campaign story','"$30 feeds a family for a month" raises more than "$30,000 needed"'],['Above the fold must have: headline, amount, progress bar, donate button','Remove every distraction from the donation page','Mobile-first: 70%+ of donations come from phones'],['Day 1–3: launch + personal network','Day 4–7: community push + social media','Day 8–12: urgency push + matching gift ask','Day 13–14: final sprint with countdown'],['Broadcast is for awareness; groups are for action','Use voice notes — they outperform text messages 4:1','Send a 3-message sequence: announce, remind, final push'],['Download the 14-day calendar template','Fill in your campaign goal and unit cost','Identify your first 10 personal donors by name']],
    12: [['Average NGO retains only 20% of first-time donors','It costs 5× more to acquire a new donor than retain one','Retention compounds: a 10% improvement doubles lifetime value'],['Send within 48 hours of gift — not a receipt, a thank-you','Be specific: mention the donation amount and date','Tell them one thing their gift will do'],['Day 30: impact update — what happened since their gift','Day 60: programme story — show them a life being changed','Day 90: renewal ask — "because you believed in us, we achieved X — will you give again?"'],['Set a fixed day each month for giving — donors budget for it','Keep amounts low to start: $5–$20/month is fine','Monthly givers have 80–90% annual retention rates'],['Set up a simple thank-you template this week','Schedule your Day 30 donor update now','Identify 10 past donors to invite into a monthly programme']]
  };
  const webinarPoints = points[webinarId];
  if (!webinarPoints) return ['Key insight for this section','Practical application example','Action step to implement today'];
  const idx = agendaIndex % webinarPoints.length;
  return webinarPoints[idx] || ['Key insight for this section','Practical application example','Action step for your NGO'];
}



function showToolModal(id) {
  const t = TOOLS.find(x => x.id === id);
  if (!t) return;
  openModal(t.title, `
    <p style="color:var(--ink-soft);margin-bottom:16px;font-size:15px">${t.desc}</p>
    <div style="display:flex;gap:8px;margin-bottom:20px">
      <span style="background:var(--sky-pale);color:var(--sky);padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600">${t.type}</span>
      <span class="badge ${t.category==='planning'?'green':t.category==='messaging'?'gold':t.category==='grants'?'red':'blue'}" style="padding:4px 12px;font-size:12px">${t.category}</span>
    </div>
    <div style="background:var(--paper);border-radius:10px;padding:18px;margin-bottom:20px">
      <h4 style="font-size:14px;font-weight:700;margin-bottom:12px">What's included:</h4>
      <div style="display:flex;flex-direction:column;gap:7px;font-size:13.5px;color:var(--ink-soft)">
        <div>Ready-to-use template (${t.type})</div>
        <div>Instructions for adapting to your NGO</div>
        <div>Example filled version for reference</div>
        <div>Related lesson in Micro Lessons Academy</div>
      </div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap" id="toolModalBtns"></div>`);
  requestAnimationFrame(function() {
    const btns = document.getElementById('toolModalBtns');
    if (!btns) return;
    const pdfBtn = document.createElement('button');
    pdfBtn.className = 'btn-primary';
    pdfBtn.style.cssText = 'background:#dc2626;border-color:#dc2626';
    pdfBtn.textContent = 'Download PDF';
    pdfBtn.addEventListener('click', function() { downloadPDF(t.title, t.title); closeModal(); });
    const wordBtn = document.createElement('button');
    wordBtn.className = 'btn-primary';
    wordBtn.style.cssText = 'background:#2563eb;border-color:#2563eb';
    wordBtn.textContent = 'Download Word';
    wordBtn.addEventListener('click', function() { downloadWord(t.title, t.title); closeModal(); });
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-outline';
    saveBtn.textContent = _dash.isSaved(t.title.replace(/\s+/g,'-').toLowerCase().slice(0,30)) ? 'Saved' : 'Save to Dashboard';
    saveBtn.addEventListener('click', function() { dashSaveItem(t.icon||'', t.title, t.type||'Template', 'tools'); saveBtn.textContent='Saved'; });
    btns.appendChild(pdfBtn);
    btns.appendChild(wordBtn);
    btns.appendChild(saveBtn);
  });
}

function showToolPreview(id) {
  const t = TOOLS.find(x => x.id === id);
  if (!t) return;
  const catColor = {planning:'var(--emerald)',messaging:'var(--gold)',pipeline:'var(--sky)',grants:'var(--rose)',digital:'#7c3aed'}[t.category] || 'var(--emerald)';
  const catBg    = {planning:'var(--emerald-pale)',messaging:'var(--gold-pale)',pipeline:'var(--sky-pale)',grants:'var(--rose-pale)',digital:'#f5f3ff'}[t.category] || 'var(--emerald-pale)';
  const p = t.preview || null;
  const sectionsHtml = p ? p.sections.map(s => `
    <div style="margin-bottom:18px">
      <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:${catColor};margin-bottom:9px;padding-bottom:6px;border-bottom:2px solid ${catBg}">${s.label}</div>
      <div style="display:flex;flex-direction:column;gap:5px">
        ${s.fields.map(f => `
          <div style="display:flex;align-items:flex-start;gap:10px;padding:9px 12px;background:#fff;border:1.5px dashed rgba(0,0,0,.09);border-radius:8px">
            <span style="color:${catColor};font-size:13px;flex-shrink:0;margin-top:1px">→</span>
            <span style="font-size:13px;color:var(--ink-soft);line-height:1.45">${f}</span>
          </div>`).join('')}
      </div>
    </div>`).join('') : '<p style="color:var(--ink-muted);font-size:14px">Preview not available.</p>';

  openModal(t.title, `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap">
      <span style="font-size:28px">${t.icon}</span>
      <div>
        <div style="font-size:13px;color:var(--ink-muted);margin-bottom:3px">${t.type}</div>
        ${p ? `<div style="font-size:13.5px;font-style:italic;color:${catColor};font-weight:600">"${p.tagline}"</div>` : ''}
      </div>
      <span style="margin-left:auto;background:${catBg};color:${catColor};padding:4px 12px;border-radius:100px;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em">${t.category}</span>
    </div>
    <p style="color:var(--ink-soft);font-size:14px;margin-bottom:20px;line-height:1.6">${t.desc}</p>
    <div style="background:var(--paper);border-radius:12px;padding:20px;margin-bottom:20px">
      <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink-muted);margin-bottom:14px">TEMPLATE STRUCTURE PREVIEW</div>
      ${sectionsHtml}
    </div>
    <div id="toolPreviewBtns" style="display:flex;gap:10px;flex-wrap:wrap"></div>`);

  requestAnimationFrame(function() {
    const btns = document.getElementById('toolPreviewBtns');
    if (!btns) return;
    const pdfBtn = document.createElement('button');
    pdfBtn.className = 'btn-primary';
    pdfBtn.style.cssText = 'background:#dc2626;border-color:#dc2626';
    pdfBtn.textContent = 'Download PDF';
    pdfBtn.addEventListener('click', function() { downloadPDF(t.title, t.title); closeModal(); });
    const wordBtn = document.createElement('button');
    wordBtn.className = 'btn-primary';
    wordBtn.style.cssText = 'background:#2563eb;border-color:#2563eb';
    wordBtn.textContent = 'Download Word';
    wordBtn.addEventListener('click', function() { downloadWord(t.title, t.title); closeModal(); });
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-outline';
    saveBtn.textContent = _dash.isSaved(t.title.replace(/\s+/g,'-').toLowerCase().slice(0,30)) ? 'Saved' : 'Save to Dashboard';
    saveBtn.addEventListener('click', function() { dashSaveItem(t.icon||'', t.title, t.type||'Template', 'tools'); saveBtn.textContent='Saved'; });
    btns.appendChild(pdfBtn);
    btns.appendChild(wordBtn);
    btns.appendChild(saveBtn);
  });
}

function showStoryModal(id) {
  const s = STORIES.find(x => x.id === id);
  if (!s) return;
  openModal(s.title, `
    <div style="margin-bottom:14px"><span class="sc-tag" style="background:${s.tagBg};color:${s.tagColor};padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700">${s.tag}</span>${s.org ? `<span style="font-size:13px;color:var(--ink-muted);margin-left:10px">${s.org}</span>` : ''}</div>
    <p style="color:var(--ink-soft);margin-bottom:18px;font-size:15px">${s.desc}</p>
    ${s.videoId ? `
    <div style="position:relative;width:100%;padding-bottom:56.25%;background:#0f1a2e;border-radius:10px;overflow:hidden;margin-bottom:18px">
      <div id="story-video-slot" data-src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" style="position:absolute;top:0;left:0;width:100%;height:100%;background:#111"></div>
    </div>
    <div style="background:var(--paper);border-radius:8px;padding:8px 14px;margin-bottom:18px;font-size:12.5px;color:var(--ink-muted)">Video testimonial from the NGO team sharing their experience.</div>` : ''}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">
      <div style="background:var(--rose-pale);border-radius:10px;padding:16px"><div style="font-size:11px;font-weight:700;color:var(--rose);text-transform:uppercase;margin-bottom:6px">Before</div><div style="font-size:14px;color:var(--ink)">${s.before}</div></div>
      <div style="background:var(--emerald-pale);border-radius:10px;padding:16px"><div style="font-size:11px;font-weight:700;color:var(--emerald);text-transform:uppercase;margin-bottom:6px">After</div><div style="font-size:14px;color:var(--ink)">${s.after}</div></div>
    </div>
    <div style="text-align:center;background:var(--paper);border-radius:10px;padding:20px;margin-bottom:20px">
      <div style="font-size:48px;font-weight:900;color:var(--emerald)">${s.stat}</div>
      <div style="font-size:14px;color:var(--ink-muted)">${s.statLabel}</div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-primary" onclick="closeModal();setTimeout(()=>showToolPreview(${s.toolId}),150)">Get the Tools They Used →</button>
      <button class="btn-outline" onclick="navigate('assessment');closeModal()">Take Your Assessment</button>
    </div>`);
}

function openModal(title, body) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = body;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  // DOM-safe video injection for all video slots in the modal
  setTimeout(() => {
    ['modal-video-slot','webinar-video-slot','story-video-slot','vg-video-slot'].forEach(id => {
      const slot = document.getElementById(id);
      if (slot && !slot.querySelector('video')) {
        const src = slot.getAttribute('data-src');
        if (src) {
          const v = document.createElement('video');
          v.src = src;
          v.controls = true;
          v.preload = 'metadata';
          v.setAttribute('playsinline', '');
          v.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;background:#111';
          slot.appendChild(v);
        }
      }
    });
  }, 30);
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
function badgeColor(level) {
  return {Beginner:'green',Core:'green',Intermediate:'gold',Advanced:'red',Practical:'blue'}[level] || 'green';
}

function generateLessonTitle(cat, i) {
  const titles = {
    Foundations:['Why fundraising is a mission activity, not a side task','Ethics in fundraising: what donors expect from you','How funders evaluate NGO credibility','Building a fundraising culture in your team','Common fundraising mistakes and how to avoid them'],
    Messaging:['The 4 elements of a strong case for support','Writing in donor language, not organization language','How to explain impact in numbers','Making your ask clear and specific','Testing your messaging with real donors'],
    Strategy:['Setting realistic fundraising goals','Choosing the right funding mix for your NGO','Building a quarterly fundraising calendar','How to present your strategy to your board','Adjusting strategy mid-year based on data'],
  };
  const fallback = ['Introduction and context','Core frameworks and concepts','Practical application','Tools and templates','Review and next steps','Advanced techniques','Case studies','Implementation guide'];
  return (titles[cat] && titles[cat][i]) || fallback[i % fallback.length];
}

/* ══════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════
   NAV STACK + PROGRESS STATE
══════════════════════════════════════════════════════ */
let currentPage = '';        // currently active page id
let _navStack = [];          // [{page, label}] — history stack
const _BACK_PAGES = new Set(['lesson-player','path-detail','sh-roadmap','sh-checklist','sh-path','search','dashboard','sign-in','assessment','capabilities','faq','about','ai-advisor','success-stories']);
const _PAGE_LABELS = {
  home:'Home', 'micro-lessons':'Micro Lessons',
  'learning-paths':'Learning Paths', webinars:'Webinars', tools:'Tools & Templates',
  resources:'Resources', 'success-stories':'Success Stories', 'ai-advisor':'AI Advisor',
  about:'About', dashboard:'Dashboard', 'sign-in':'Sign In', search:'Search',
  workbooks:'Workbooks', 'video-guides':'Video Guides', capabilities:'Capability Model', faq:'FAQ', 'lesson-player':'Lesson',
  'path-detail':'Learning Path', 'sh-roadmap':'90-Day Roadmap',
  'sh-checklist':'This Week', 'sh-path':'My Path',
  'improvement-tracks':'Improvement Tracks',
  'cap-learn':'Learn Capability'
};

/* Progress — in-memory (session only) */
const _prog = {
  doneSubs:   new Set(),   // "lessonId-subIdx"  e.g. "3-0"
  doneTopics: new Set(),   // lessonId numbers
  startedAt:  {},          // lessonId -> timestamp
};

function _markSubDone(lessonId, subIdx) {
  _prog.doneSubs.add(lessonId + '-' + subIdx);
}
function _markTopicDone(lessonId) {
  _prog.doneTopics.add(lessonId);
  showToast('Topic complete! 🎉', 'success');
}
function _topicPct(lessonId) {
  const l = LESSONS.find(x => x.id === lessonId);
  if (!l) return 0;
  const total = l.count || 5;
  let done = 0;
  for (let i = 0; i < total; i++) {
    if (_prog.doneSubs.has(lessonId + '-' + i)) done++;
  }
  return Math.round((done / total) * 100);
}

let toastTimer;
function showToast(msg, type='') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.className = 'toast', 3000);
}

/* ══════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════ */
function renderFooter() {
  return `<footer>
    <div class="footer-grid">
      <div class="footer-brand">
        <div style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:12px" onclick="navigate('home')">
          <div class="logo-icon"><svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:white"><path d="M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3z"/></svg></div>
          <span class="logo-text">Fund<span>Ready</span></span>
        </div>
        <p>Build fundraising capability. Raise sustainable funding. Built for small and medium NGOs with practical tools and expert guidance.</p>
        <p style="font-size:12px;color:rgba(255,255,255,.3)">Get one practical fundraising tip each week.</p>
        <div class="newsletter-form">
          <input type="email" placeholder="your@email.com"/>
          <button onclick="showToast('Subscribed! 🎉','success')">Subscribe</button>
        </div>
      </div>
      <div class="footer-col">
        <h4>Learn</h4>
        <a onclick="navigate('capabilities')">Capabilities</a>
        <a onclick="navigate('micro-lessons')">Micro Lessons</a>
        <a onclick="navigate('learning-paths')">Learning Paths</a>
        <a onclick="navigate('webinars')">Webinars</a>
        <a onclick="navigate('resources')">Resources Library</a>
      </div>
      <div class="footer-col">
        <h4>Tools</h4>
        <a onclick="navigate('tools');showToast('Opening Readiness Kit…')">Readiness Kit</a>
        <a onclick="navigate('tools');showToast('Opening One-Pager Kit…')">One-Pager Templates</a>
        <a onclick="navigate('tools');showToast('Opening Proposal Templates…')">Proposal Templates</a>
        <a onclick="navigate('tools');showToast('Opening Pipeline Tracker…')">Pipeline Tracker</a>
        <a onclick="navigate('tools')">All Tools →</a>
      </div>
      <div class="footer-col">
        <h4>Platform</h4>
        <a onclick="navigate('assessment')">Assessment</a>
        <a onclick="navigate('ai-advisor')">AI Advisor</a>
        <a onclick="navigate('success-stories')">Success Stories</a>
        <a onclick="navigate('capabilities')">Capability Model</a>
        <a onclick="navigate('dashboard')">My Dashboard</a>
        <a onclick="navigate('search')">Search</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2025 FundReady Academy. Built for local NGOs.</span>
      <div style="display:flex;gap:18px">
        <a onclick="navigate('about')">About</a>
        <a onclick="navigate('contact')">Contact</a>
        <a onclick="navigate('faq')">FAQ</a>
        <a onclick="navigate('terms')">Terms</a>
        <a onclick="navigate('privacy')">Privacy</a>
      </div>
    </div>
  </footer>`;
}

/* ══════════════════════════════════════════════════════
   ABOUT PAGE
══════════════════════════════════════════════════════ */
function renderAbout() {
  const f = document.getElementById('aboutFooter');
  if (f && !f.dataset.rendered) { f.innerHTML = renderFooter(); f.dataset.rendered = '1'; }
}

function renderContact() {
  const f = document.getElementById('contactFooter');
  if (f && !f.dataset.rendered) { f.innerHTML = renderFooter(); f.dataset.rendered = '1'; }
}

function switchAuthTab(tab) {
  const isSignIn = tab === 'signin';
  document.getElementById('form-signin').style.display    = isSignIn ? 'block' : 'none';
  document.getElementById('form-register').style.display  = isSignIn ? 'none'  : 'block';
  document.getElementById('tab-signin').style.background   = isSignIn ? 'var(--emerald)' : 'transparent';
  document.getElementById('tab-signin').style.color        = isSignIn ? '#fff' : 'var(--ink-muted)';
  document.getElementById('tab-register').style.background = isSignIn ? 'transparent' : 'var(--emerald)';
  document.getElementById('tab-register').style.color      = isSignIn ? 'var(--ink-muted)' : '#fff';
  document.getElementById('auth-headline').textContent     = isSignIn ? 'Welcome back' : 'Create your free account';
  document.getElementById('auth-subline').textContent      = isSignIn ? 'Sign in to access your dashboard and saved progress' : 'Join thousands of NGOs building sustainable fundraising';
}

function submitSignIn() {
  const email = (document.getElementById('si-email') || {}).value || '';
  const pass  = (document.getElementById('si-password') || {}).value || '';
  if (!email.trim() || !email.includes('@')) { showToast('Please enter a valid email address', 'error'); return; }
  if (!pass.trim()) { showToast('Please enter your password', 'error'); return; }

  const btn = document.querySelector('#form-signin button[onclick="submitSignIn()"]');
  if (btn) { btn.textContent = 'Signing in…'; btn.disabled = true; }

  setTimeout(() => {
    const result = _AUTH.signIn(email, pass);
    if (result.error) {
      showToast(result.error, 'error');
      if (btn) { btn.textContent = 'Sign In →'; btn.disabled = false; }
    } else {
      _updateNavForAuth(result.user);
      navigate('dashboard');
      showToast('Welcome back, ' + result.user.first + '! 👋', 'success');
    }
  }, 400);
}

function submitRegister() {
  const first   = (document.getElementById('reg-first')    || {}).value || '';
  const last    = (document.getElementById('reg-last')     || {}).value || '';
  const email   = (document.getElementById('reg-email')    || {}).value || '';
  const org     = (document.getElementById('reg-org')      || {}).value || '';
  const country = (document.getElementById('reg-country')  || {}).value || '';
  const pass    = (document.getElementById('reg-password') || {}).value || '';
  const agreed  = (document.getElementById('reg-terms')    || {}).checked;

  if (!first.trim())  { showToast('Please enter your first name', 'error');  return; }
  if (!last.trim())   { showToast('Please enter your last name', 'error');   return; }
  if (!email.trim() || !email.includes('@')) { showToast('Please enter a valid email address', 'error'); return; }
  if (!org.trim())    { showToast('Please enter your organisation name', 'error'); return; }
  if (!country)       { showToast('Please select your country', 'error');    return; }
  if (pass.length < 8){ showToast('Password must be at least 8 characters', 'error'); return; }
  if (!agreed)        { showToast('Please agree to the Terms and Privacy Policy', 'error'); return; }

  const btn = document.querySelector('#form-register button[onclick="submitRegister()"]');
  if (btn) { btn.textContent = 'Creating account…'; btn.disabled = true; }

  setTimeout(() => {
    const result = _AUTH.register(first, last, email, org, country, pass);
    if (result.error) {
      showToast(result.error, 'error');
      if (btn) { btn.textContent = 'Create Free Account →'; btn.disabled = false; }
    } else {
      _updateNavForAuth(result.user);
      navigate('dashboard');
      showToast('Welcome to FundReady Academy, ' + first + '! 🎉', 'success');
    }
  }, 400);
}

function forgotPassword() {
  const email = (document.getElementById('si-email') || {}).value || '';
  if (!email.trim() || !email.includes('@')) { showToast('Enter your email address above first', 'error'); return; }
  const users = _AUTH.getUsers();
  const user = users[email.toLowerCase()];
  if (!user) { showToast('No account found with that email.', 'error'); return; }
  // Show password (in a real app this would email a reset link)
  showToast('Your password hint: ' + user.pass.substring(0,2) + '••••••  (check the email you registered with)', 'success');
}

function renderSimplePage(footerId) {
  const f = document.getElementById(footerId);
  if (f && !f.dataset.rendered) { f.innerHTML = renderFooter(); f.dataset.rendered = '1'; }
}

function submitContactForm() {
  const name    = (document.getElementById('contact-name')    || {}).value || '';
  const email   = (document.getElementById('contact-email')   || {}).value || '';
  const topic   = (document.getElementById('contact-topic')   || {}).value || '';
  const message = (document.getElementById('contact-message') || {}).value || '';
  if (!name.trim())    { showToast('Please enter your name', 'error');    return; }
  if (!email.trim() || !email.includes('@')) { showToast('Please enter a valid email', 'error'); return; }
  if (!topic)          { showToast('Please select a topic', 'error');      return; }
  if (!message.trim()) { showToast('Please enter a message', 'error');     return; }
  // Clear form
  ['contact-name','contact-email','contact-message'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const sel = document.getElementById('contact-topic'); if (sel) sel.value = '';
  showToast('Message sent! We\'ll be in touch within 1–2 business days. 🎉', 'success');
}

/* ══════════════════════════════════════════════════════
   CAPABILITIES — INTERACTIVE SYSTEM
══════════════════════════════════════════════════════ */
const CAP_MODEL=[
{num:1,icon:'🧭',color:'var(--emerald)',colorPale:'var(--emerald-pale)',colorHex:'#d93d1a',category:'foundation',title:'Fundraising Readiness & Direction',def:'The NGO has the minimum foundation to fundraise with clarity and focus.',subs:['Clear fundraising goals and targets','Priority funding channels selected (2–3)','Simple governance and ethical safeguards','Team roles and weekly routines for fundraising','90-day readiness plan'],assets:['Readiness checklist','90-day plan','Targets by channel'],metrics:['Number of priority channels defined','% of team with a fundraising role','Written 90-day plan exists (yes/no)','Weekly routine in place (yes/no)'],plan:'Weeks 1–2: Take assessment, set goals, define channels. Week 3: Assign roles and write a fundraising routine. Week 4: Complete 90-day plan and share with team.',related:{path:'LP1',webinar:'Webinar 1',tool:'Readiness Checklist + 90-Day Plan'}},
{num:2,icon:'💬',color:'var(--gold)',colorPale:'var(--gold-pale)',colorHex:'#c96d08',category:'foundation',title:'Value Proposition, Messaging & Case for Support',def:'The NGO can clearly explain why it matters, what it achieves, and what support will do.',subs:['One-page case for support','Core messaging (3 audience versions)','Problem–solution–proof–ask storyline','Credibility proof points','Pitch scripts (30-sec / 60-sec)'],assets:['One-pager document','Key messages document','Pitch scripts'],metrics:['One-pager exists and is in use (yes/no)','Message versions completed (0–3)','Team can deliver 60-second pitch (yes/no)'],plan:'Weeks 1–2: Write first draft of one-pager using template. Week 3: Create 3 message versions. Week 4: Practice and refine pitch scripts with team.',related:{path:'LP1 & LP3',webinar:'Webinar 3',tool:'One-Pager & Case for Support Kit'}},
{num:3,icon:'📦',color:'var(--sky)',colorPale:'var(--sky-pale)',colorHex:'#5533a8',category:'foundation',title:'Program Packaging into Fundable Offers',def:'The NGO presents programs as fundable offers with outcomes, costs, and tiers.',subs:['One-line promise (who/what/how long/how)','Outputs vs outcomes mapped clearly','Unit cost (cost per beneficiary/unit)','Funding tiers (Bronze/Silver/Gold)','One-page program pack card'],assets:['Funding Pack Card per program','Unit cost calculation sheet','Funding tier menu'],metrics:['Programs packaged as fundable offers (count)','Unit cost calculated (yes/no)','Tiers defined and tested with donors (yes/no)'],plan:'Week 1: Choose 1 program to package first. Week 2: Calculate unit cost and map outputs/outcomes. Week 3: Draft Funding Pack Card. Week 4: Test with 3 donors and refine.',related:{path:'LP3',webinar:'Webinar 4',tool:'Program Packaging Kit'}},
{num:4,icon:'🔍',color:'var(--rose)',colorPale:'var(--rose-pale)',colorHex:'#b83252',category:'outreach',title:'Prospecting & Donor Research',def:'The NGO consistently finds and qualifies the right donors.',subs:['Ideal donor profiles by channel','Prospect list-building process','Fit scoring (go/no-go)','Warm introduction strategy','Monthly list-building habit'],assets:['Prospect list with 20+ contacts','Go/No-Go scoring sheet','Outreach priority list'],metrics:['Prospect list size (contacts)','Number scored using go/no-go tool','Warm introductions requested per month'],plan:'Week 1: Build ideal donor profile for 2 channels. Week 2: Create prospect list of 20 contacts. Week 3: Score all prospects. Week 4: Build monthly list-building habit.',related:{path:'LP4',webinar:'Webinar 5',tool:'Donor Pipeline Tracker'}},
{num:5,icon:'📈',color:'var(--emerald)',colorPale:'var(--emerald-pale)',colorHex:'#d93d1a',category:'outreach',title:'Relationship Management & Pipeline Discipline',def:'The NGO manages donor relationships through stages with consistent follow-up.',subs:['Pipeline stages defined (Lead to Won/Lost)','Simple CRM/Sheet with data hygiene','Next step + date always set','Weekly pipeline review routine','Follow-up cadence templates'],assets:['Donor pipeline sheet','Follow-up templates','Evidence of weekly review habit'],metrics:['Pipeline contacts with next step assigned (%)','Follow-ups sent per week','Weekly review adherence (% of weeks)'],plan:'Week 1: Set up pipeline tracker and add all contacts. Week 2: Assign next steps for every contact. Week 3: Send first follow-up wave. Week 4: Run first weekly pipeline review.',related:{path:'LP4',webinar:'Webinar 6',tool:'Donor Pipeline Tracker'}},
{num:6,icon:'🤝',color:'var(--gold)',colorPale:'var(--gold-pale)',colorHex:'#c96d08',category:'execution',title:'Asking & Closing',def:'The NGO asks clearly and closes commitments respectfully.',subs:['Ask preparation (call plan, amount, objective)','Clear ask language (impact + amount + options)','Objection handling scripts','Closing and confirmation steps','Post-meeting follow-up process'],assets:['Ask script','Objection handling sheet','Post-meeting follow-up template'],metrics:['Formal asks made per month','Ask-to-commitment conversion rate','Average time from ask to response'],plan:'Week 1: Learn and practice ask structure. Week 2: Prepare materials for top 3 pipeline contacts. Week 3: Make at least 2 formal asks. Week 4: Review results and refine script.',related:{path:'LP4',webinar:'Webinar 7',tool:'Ask Script + Objection Handling Sheet'}},
{num:7,icon:'📋',color:'var(--sky)',colorPale:'var(--sky-pale)',colorHex:'#5533a8',category:'execution',title:'Proposal & Grant Capability',def:'The NGO can create strong proposals and win institutional funding.',subs:['2-page proposal template competency','Full proposal structure (10 sections)','Budget logic + unit cost','M&E basics (3 indicators + baseline)','Compliance and reporting readiness','Go/No-Go grants decision tool'],assets:['2-page and 10-page proposal templates','Go/No-Go matrix','Grant compliance checklist'],metrics:['Grant applications submitted per quarter','Go/No-Go tool used per opportunity','Grants won vs submitted (ratio)'],plan:'Week 1: Complete go/no-go assessment for 3 opportunities. Week 2: Write 2-page proposal for best fit. Week 3: Add budget and M&E section. Week 4: Submit and start compliance folder.',related:{path:'LP5',webinar:'Webinars 8 & 9',tool:'Proposal Templates + Budget'}},
{num:8,icon:'🏢',color:'var(--rose)',colorPale:'var(--rose-pale)',colorHex:'#b83252',category:'execution',title:'Corporate Partnerships',def:'The NGO builds partnerships with clear value and renewals.',subs:['Corporate partner targeting map','Partnership menu (benefits + deliverables)','Sponsorship tiers (Bronze/Silver/Gold)','Corporate pitch and meeting plan','Reporting and renewal cycle'],assets:['Corporate partnership menu','Sponsorship tiers document','Renewal plan'],metrics:['Corporate partners (active count)','Partnership renewal rate (%)','Average partnership value','Corporate meetings per quarter'],plan:'Week 1: Build corporate target list of 10 companies. Week 2: Create partnership menu. Week 3: Pitch 2 companies. Week 4: Set up reporting template and renewal timeline.',related:{path:'LP6',webinar:'Webinar 10',tool:'Corporate Partnership Menu Kit'}},
{num:9,icon:'📱',color:'var(--emerald)',colorPale:'var(--emerald-pale)',colorHex:'#d93d1a',category:'execution',title:'Digital Fundraising & Campaign Execution',def:'The NGO can launch a short campaign that converts attention into donations.',subs:['Campaign hook + goal + unit cost','Donation page optimization checklist','14-day content plan (pre/launch/close)','WhatsApp donor mobilization scripts','Simple performance tracking'],assets:['Campaign plan document','Donation page checklist','14-day content calendar'],metrics:['Campaign goal achievement rate (%)','Donation page conversion rate','New donors acquired per campaign'],plan:'Week 1: Define campaign hook, goal, unit cost. Week 2: Set up and optimize donation page. Week 3: Create 14-day content calendar and WhatsApp scripts. Week 4: Launch and track.',related:{path:'LP7',webinar:'Webinar 11',tool:'Digital Campaign Kit'}},
{num:10,icon:'💌',color:'var(--gold)',colorPale:'var(--gold-pale)',colorHex:'#c96d08',category:'retention',title:'Donor Retention & Stewardship',def:'The NGO retains donors and increases repeat giving with a clear system.',subs:['48-hour thank-you system','30/60/90 donor journey','Impact updates (one-page format)','Monthly giving program basics','Renewal ask timing and scripts'],assets:['Thank-you templates','30/60/90 donor journey plan','Impact report one-pager'],metrics:['Donor retention rate (%)','% of donors thanked within 48 hours','Impact updates sent per quarter','Renewal ask conversion rate'],plan:'Week 1: Set up 48-hour thank-you system. Week 2: Map current donor journey. Week 3: Build 30/60/90 follow-up plan. Week 4: Send first impact update to existing donors.',related:{path:'LP8',webinar:'Webinar 12',tool:'Donor Retention 30/60/90 Kit'}},
];

const capScores={};
let capCurrentFilter='all',capCurrentCategory='all',capCurrentSearch='';

function getCapScoreLabel(s){
  if(!s) return {label:'Not assessed',color:'var(--ink-muted)',bg:'var(--paper)'};
  if(s<=2) return {label:'Score: '+s+' — Gap',color:'var(--rose)',bg:'var(--rose-pale)'};
  if(s===3) return {label:'Score: '+s+' — Developing',color:'var(--gold)',bg:'var(--gold-pale)'};
  return {label:'Score: '+s+' — Strong',color:'var(--emerald)',bg:'var(--emerald-pale)'};
}

/* ── CAP ASSESSMENT QUESTIONS (5 per capability) ── */
const CAP_QUESTIONS = {
  1:[
    {q:'Does your NGO have written fundraising goals with specific targets for this year?',opts:['No goals exist','We have informal goals but nothing written','We have written goals but they\'re vague','We have specific, written goals with amounts and deadlines']},
    {q:'How many priority funding channels has your team selected to focus on?',opts:['We haven\'t decided yet','We try everything without focus','We\'ve picked 1–2 channels but inconsistently','We have 2–3 clear channels with a rationale for each']},
    {q:'Does your NGO have defined team roles for fundraising?',opts:['No one is clearly responsible','One person does everything informally','Roles exist but aren\'t documented','Roles are documented and everyone knows their part']},
    {q:'Does your team have a weekly fundraising routine (e.g. pipeline review, outreach time)?',opts:['No routine at all','We meet occasionally but not regularly','We have a routine but skip it often','We have a consistent weekly routine we follow']},
    {q:'Do you have a 90-day fundraising action plan?',opts:['No plan exists','We have ideas but no written plan','We have a plan but it\'s not being followed','We have a live plan we review and update weekly']},
  ],
  2:[
    {q:'Can your team explain your NGO\'s value to a donor in 60 seconds?',opts:['No — messaging varies widely across the team','We have talking points but no consistent story','Most of the team can do it reasonably well','Everyone delivers a clear, consistent 60-second pitch']},
    {q:'Do you have a written one-page case for support?',opts:['No one-pager exists','We have something but it\'s outdated','We have one but rarely use it','Yes — polished, current, and actively used']},
    {q:'Does your messaging vary by audience (grants, corporates, individuals)?',opts:['All audiences receive the same message','We adjust slightly but not intentionally','We have 2 versions for different contexts','We have 3 tailored versions used consistently']},
    {q:'Can your programs be described with specific outcomes and unit costs?',opts:['Programs are described as activities only','We have some numbers but they vary','Most programs have outcomes, few have unit costs','All programs have clear outcomes and unit costs']},
    {q:'How strong are your credibility proof points (impact numbers, testimonials, track record)?',opts:['We have no documented proof points','We have some data but it\'s scattered','We have solid numbers used in some materials','Strong, consistent proof points used across all materials']},
  ],
  3:[
    {q:'Have you packaged your programs as "fundable offers" with named tiers (e.g. Bronze/Silver/Gold)?',opts:['No — we present programs as activities','We have some descriptions but no tiers','We have tiers for one or two programs','All main programs have clear funding tiers']},
    {q:'Do you know the cost per beneficiary (unit cost) for your main programs?',opts:['No — we don\'t calculate unit costs','We have rough estimates only','We know unit costs for most programs','Precise unit costs are calculated and updated annually']},
    {q:'Do you have a one-page program pack card for each major program?',opts:['No pack cards exist','We have draft descriptions only','We have pack cards but they need updating','Yes — polished pack cards used in all proposals']},
    {q:'Can donors understand your outputs vs outcomes from your materials?',opts:['No — outputs and outcomes are mixed up','We distinguish them sometimes','Outputs and outcomes are clear in most documents','All materials clearly separate and explain both']},
    {q:'Have you tested your program packaging with real donors or funders?',opts:['Never tested','Mentioned it in conversations informally','Shared with 1–2 donors and got some feedback','Tested with multiple donors and refined based on feedback']},
  ],
  4:[
    {q:'Do you have an ideal donor profile for each of your 2–3 priority channels?',opts:['No profiles defined','We have a general idea but nothing written','Profiles exist for 1 channel','We have written profiles for all 2–3 channels']},
    {q:'How large is your current prospect list (individuals, foundations, and corporates combined)?',opts:['Fewer than 10 prospects','10–25 prospects','26–50 prospects','More than 50 qualified prospects']},
    {q:'Do you use a scoring system (go/no-go) to decide which prospects to pursue?',opts:['No scoring — we pursue anyone who might give','We make informal judgments without a tool','We have a tool but use it inconsistently','We score every prospect before investing time in them']},
    {q:'How do you typically find new prospects?',opts:['Word of mouth and random referrals only','We use our network but don\'t systematically expand it','We use 2–3 sources consistently (events, LinkedIn, "who funded who")','We have a monthly list-building habit using 3+ research sources']},
    {q:'Do you have a warm introduction strategy to reach new prospects?',opts:['No strategy — we approach cold','We ask for introductions occasionally','We map relationships and ask for intros for top prospects','We have a systematic approach to warm introductions for every Tier A prospect']},
  ],
  5:[
    {q:'Does your team use a CRM or spreadsheet pipeline to track all donor conversations?',opts:['No system — conversations happen in people\'s heads','We have a contact list but no pipeline stages','We have a pipeline sheet but data is patchy','Full pipeline with stages, next steps, and owners for all contacts']},
    {q:'Does every prospect in your pipeline have a "next step" and a date assigned?',opts:['No next steps defined','Some contacts have next steps','Most contacts have next steps','100% of pipeline contacts have a next step with a date']},
    {q:'How often does your team hold a pipeline review meeting?',opts:['Never','Occasionally — no fixed schedule','Monthly or less frequently','Weekly — it\'s part of our fundraising routine']},
    {q:'How consistent is your follow-up process after donor meetings?',opts:['We follow up when we remember','We send a follow-up email eventually','We have a template but timing varies','We send a follow-up within 24 hours — always']},
    {q:'What is your average response rate from donor outreach?',opts:['Less than 10% respond','10–25% respond','26–40% respond','More than 40% respond']},
  ],
  6:[
    {q:'Do you prepare a written call plan (amount, objective, expected objections) before donor meetings?',opts:['No preparation — we improvise','We think about it but don\'t write it down','We prepare for important meetings','We prepare a written call plan for every meeting']},
    {q:'How comfortable is your team making a direct, specific ask for a donation?',opts:['Very uncomfortable — we hint rather than ask','Somewhat uncomfortable — we ask vaguely','Reasonably comfortable but not consistent','Confident — we always make a clear, specific ask']},
    {q:'Does your team have a documented approach for handling donor objections?',opts:['No — objections often end the conversation','We respond ad hoc with varying results','We have some go-to responses','We have a written objection-handling script we practice']},
    {q:'What is your ask-to-commitment conversion rate (% of asks that become gifts)?',opts:['Less than 10%','10–25%','26–50%','More than 50%']},
    {q:'Do you have a post-meeting follow-up process (within 24 hours) to confirm commitments?',opts:['No process — we follow up when we remember','We follow up eventually but timing varies','We usually follow up within a few days','We always send a follow-up within 24 hours with a summary and next step']},
  ],
  7:[
    {q:'Do you have a go/no-go decision tool to assess whether to apply for a grant before investing time?',opts:['No — we apply to everything available','We make informal judgments','We have a checklist but use it inconsistently','We use a formal go/no-go matrix for every opportunity']},
    {q:'Can your team produce a 2-page concept note in under 3 days?',opts:['No — proposals take 2+ weeks','We could do it but the quality would suffer','Yes, with significant effort','Yes — we have a template and can produce one quickly']},
    {q:'Do your grant proposals include a detailed, logical budget with unit costs?',opts:['Our budgets are rough estimates','We have line items but little narrative','Our budgets have narrative but costs vary','All proposals include a logical budget with unit costs and narrative']},
    {q:'Do you have an M&E framework with indicators and baselines ready for proposals?',opts:['No M&E framework exists','We have one but it\'s too generic','We have an M&E plan but it varies by proposal','We have a ready-to-use M&E section we adapt per proposal']},
    {q:'How many grant applications has your NGO submitted in the last 12 months?',opts:['None','1–2 applications','3–5 applications','6 or more applications']},
  ],
  8:[
    {q:'Do you have a corporate prospect target list with 10+ companies matched to your cause?',opts:['No corporate target list','We have a few names but no research','We have 5–9 researched prospects','We have 10+ researched, prioritised prospects']},
    {q:'Do you have a written corporate partnership menu (tiers, benefits, deliverables)?',opts:['No partnership menu exists','We have a rough description','We have tiers but they\'re not well defined','Yes — a polished, tiered partnership menu']},
    {q:'How many active corporate partners does your NGO currently have?',opts:['None','1–2 partners','3–5 partners','6 or more active partners']},
    {q:'Do you have a corporate proposal or pitch deck ready to present?',opts:['Nothing ready','We have draft materials','We have a proposal but it needs updating','A polished pitch deck tailored to each company']},
    {q:'Do you have a corporate partner reporting and renewal cycle?',opts:['No reporting or renewal process','We report informally','We report but renewal is reactive','Structured reporting with a proactive renewal plan for each partner']},
  ],
  9:[
    {q:'Has your NGO launched a structured online fundraising campaign in the last 12 months?',opts:['Never','We\'ve considered it but never launched','Yes — 1 campaign','Yes — 2 or more campaigns']},
    {q:'Is your donation page optimised (clear goal, progress bar, 3 giving levels, mobile-friendly)?',opts:['No donation page exists','Basic page with minimal info','Good page, missing 1–2 key elements','Fully optimised donation page meeting all criteria']},
    {q:'Do you have a 14-day content calendar ready to execute during a campaign?',opts:['No content planning','We create content ad hoc during campaigns','We have a rough schedule','Yes — a day-by-day content plan with templates']},
    {q:'Do you use WhatsApp donor mobilisation scripts during campaigns?',opts:['No WhatsApp strategy','We message contacts informally','We have a script but use it inconsistently','Structured WhatsApp ambassador programme with scripts']},
    {q:'Do you track campaign performance (conversion rate, cost per donor, total raised vs goal)?',opts:['No tracking','We note the total raised only','We track 2–3 metrics','Full performance dashboard with 5+ metrics tracked']},
  ],
  10:[
    {q:'Do you send a personalised thank-you within 48 hours of receiving a donation?',opts:['No — we thank when we remember','We send a basic email eventually','We send a thank-you within a few days','Always within 48 hours — personalised with impact info']},
    {q:'Do you have a structured 30/60/90-day donor journey after the first gift?',opts:['No journey plan','Informal check-ins only','A plan exists but not consistently followed','A documented journey followed for every new donor']},
    {q:'Do you send quarterly impact updates to your donors?',opts:['No updates sent','Annual only','Twice a year','Yes — quarterly impact updates with real data']},
    {q:'What is your current donor retention rate (% who gave last year and gave again)?',opts:['Less than 15%','15–30%','31–50%','More than 50%']},
    {q:'Do you have a monthly giving programme or recurring donation option?',opts:['No — we don\'t offer recurring giving','We accept recurring gifts but don\'t promote them','We mention monthly giving occasionally','Active monthly giving programme with upgrade asks']},
  ],
};

/* Mapping: cap num → lesson id (LESSONS array id = cap num for caps 1–10) */
function getCapLessonId(capNum) { return capNum; /* LESSONS ids 1–10 match CAP 1–10 */ }

/* Assessment state */
let _capAssessState = { capNum:null, qIdx:0, answers:[] };

function startCapAssess(capNum) {
  _capAssessState = { capNum, qIdx:0, answers:[] };
  showCapAssessStep();
}

function showCapAssessStep() {
  const { capNum, qIdx, answers } = _capAssessState;
  const cap = CAP_MODEL.find(c => c.num === capNum);
  const qs = CAP_QUESTIONS[capNum];
  if (!cap || !qs) return;

  if (qIdx >= qs.length) { finishCapAssess(); return; }

  const q = qs[qIdx];
  const pct = Math.round((qIdx / qs.length) * 100);
  const optsHtml = q.opts.map((o, i) => `
    <button onclick="selectCapAssessAnswer(${i})"
      style="width:100%;text-align:left;padding:13px 16px;border-radius:10px;border:2px solid var(--border);background:#fff;color:var(--ink-soft);font-size:14px;font-family:inherit;cursor:pointer;transition:all .15s;margin-bottom:8px;line-height:1.45"
      onmouseover="this.style.borderColor='${cap.color}';this.style.background='${cap.colorPale}'"
      onmouseout="this.style.borderColor='var(--border)';this.style.background='#fff'">${o}</button>`).join('');

  openModal(`${cap.icon} Assess: ${cap.title}`, `
    <div style="margin-bottom:18px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-size:12px;font-weight:600;color:var(--ink-muted)">Question ${qIdx+1} of ${qs.length}</span>
        <span style="font-size:12px;font-weight:700;color:${cap.color}">${pct}% complete</span>
      </div>
      <div style="height:6px;background:rgba(0,0,0,.07);border-radius:100px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${cap.color};border-radius:100px;transition:width .4s ease"></div>
      </div>
    </div>
    <div style="background:${cap.colorPale};border-radius:12px;padding:16px;margin-bottom:20px">
      <p style="font-size:16px;font-weight:700;color:var(--ink);line-height:1.5;margin:0">${q.q}</p>
    </div>
    <div>${optsHtml}</div>
    ${qIdx > 0 ? `<button onclick="goBackCapAssess()" style="margin-top:4px;background:none;border:none;color:var(--ink-muted);font-size:13px;cursor:pointer;font-family:inherit;padding:4px 0">← Previous question</button>` : ''}`);
}

function selectCapAssessAnswer(optIdx) {
  _capAssessState.answers[_capAssessState.qIdx] = optIdx;
  _capAssessState.qIdx++;
  showCapAssessStep();
}

function goBackCapAssess() {
  if (_capAssessState.qIdx > 0) { _capAssessState.qIdx--; showCapAssessStep(); }
}

function finishCapAssess() {
  const { capNum, answers } = _capAssessState;
  const cap = CAP_MODEL.find(c => c.num === capNum);
  // Score: each answer is 0–3 mapped to 1–5 scale
  const raw = answers.reduce((a, b) => a + b, 0);
  const maxRaw = answers.length * 3;
  const score = Math.max(1, Math.round(1 + (raw / maxRaw) * 4));
  capScores[capNum] = score;

  /* Store context so learn page can personalise */
  _capLearnContext[capNum] = { score: score, answers: answers.slice() };

  renderCapGrid();
  updateCapDashboard();

  const sl = getCapScoreLabel(score);
  const levelLabel = ['','Beginner','Developing','Competent','Advanced','Expert'][score];
  const scoreColor = score <= 2 ? 'var(--rose)' : score === 3 ? 'var(--gold)' : 'var(--emerald)';
  const scoreMsg = score <= 2
    ? 'This is a gap area. Your personalised learning plan below shows exactly what to work on first.'
    : score === 3
    ? 'You\'re developing well. Your learning plan highlights the specific sub-skills to focus on next.'
    : 'Strong capability. Your learning plan shows advanced content to keep you sharp.';

  /* Identify weak areas for the summary */
  const weakAreas = answers.map(function(a, i) { return { a, sub: cap.subs[i] }; })
    .filter(function(x) { return x.a <= 1 && x.sub; })
    .map(function(x) { return x.sub; });

  openModal(cap.icon + ' Assessment Complete — ' + cap.title, `
    <div style="text-align:center;padding:20px 0 20px">
      <div style="width:80px;height:80px;border-radius:50%;background:${cap.colorPale};border:3px solid ${cap.color};margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:34px">${cap.icon}</div>
      <div style="font-size:48px;font-weight:900;color:${scoreColor};line-height:1">${score}<span style="font-size:22px;color:var(--ink-muted)">/5</span></div>
      <div style="font-size:18px;font-weight:700;color:var(--ink);margin:6px 0 4px">${levelLabel}</div>
      <div style="font-size:13.5px;color:var(--ink-soft);max-width:340px;margin:0 auto;line-height:1.6">${scoreMsg}</div>
    </div>
    ${weakAreas.length ? `
    <div style="background:#b8325210;border:1px solid #b8325230;border-radius:10px;padding:14px 16px;margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#b83252;margin-bottom:8px">Your focus areas</div>
      ${weakAreas.map(s => `<div style="font-size:13px;color:var(--ink);padding:3px 0;display:flex;align-items:center;gap:7px"><span style="color:#b83252;font-weight:700">!</span>${s}</div>`).join('')}
    </div>` : ''}
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:20px">
      ${answers.map((a, i) => {
        const col = a <= 0 ? 'var(--rose)' : a === 1 ? '#e07b3c' : a === 2 ? 'var(--gold)' : 'var(--emerald)';
        return `<div style="background:var(--paper);border-radius:9px;padding:10px 12px;text-align:center">
          <div style="font-size:10px;font-weight:700;color:var(--ink-muted);text-transform:uppercase;margin-bottom:4px">Q${i+1}</div>
          <div style="width:28px;height:28px;border-radius:50%;background:${col};color:#fff;font-size:13px;font-weight:800;margin:0 auto;display:flex;align-items:center;justify-content:center">${a+1}</div>
        </div>`;
      }).join('')}
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-primary" style="background:${cap.color};border-color:${cap.color}" onclick="closeModal();learnCapability(${capNum})">See My Learning Plan →</button>
      <button class="btn-outline" style="border-color:${cap.color};color:${cap.color}" onclick="closeModal();navigate('cap-improve-${capNum}')">Improve Plan</button>
      <button class="btn-outline" onclick="closeModal()">Close</button>
    </div>`);
}

function learnCapability(capNum) {
  navigate('cap-learn-' + capNum);
}

/* ── CAP → PATH & WEBINAR MAPPING ─────────────────────── */
const CAP_LEARN_MAP = {
  1:  { pathIds:[1],   webinarIds:[1] },
  2:  { pathIds:[1,3], webinarIds:[3] },
  3:  { pathIds:[3],   webinarIds:[4] },
  4:  { pathIds:[5],   webinarIds:[5] },
  5:  { pathIds:[5],   webinarIds:[6] },
  6:  { pathIds:[5],   webinarIds:[7] },
  7:  { pathIds:[4],   webinarIds:[8,9] },
  8:  { pathIds:[7],   webinarIds:[10] },
  9:  { pathIds:[6],   webinarIds:[11] },
  10: { pathIds:[8],   webinarIds:[12] },
};

/* Stores last assessment answers per cap so learn page can personalise */
const _capLearnContext = {};

function renderCapLearnPage(capNum) {
  const cap = CAP_MODEL.find(function(c){ return c.num === capNum; });
  if (!cap) return;

  const map         = CAP_LEARN_MAP[capNum] || { pathIds:[], webinarIds:[] };
  const lesson      = LESSONS.find(function(l){ return l.id === capNum; });
  const relPaths    = (map.pathIds    || []).map(function(id){ return PATHS.find(function(p){ return p.id===id; }); }).filter(Boolean);
  const relWebinars = (map.webinarIds || []).map(function(id){ return WEBINARS.find(function(w){ return w.id===id; }); }).filter(Boolean);
  const col = cap.color, pale = cap.colorPale, hex = cap.colorHex;

  const ctx      = _capLearnContext[capNum] || null;
  const score    = ctx ? ctx.score : (capScores[capNum] || null);
  const answers  = ctx ? ctx.answers : null;
  const hasScore = score !== null && score !== undefined;

  const weakIdx = [], medIdx = [], strongIdx = [];
  if (answers && cap.subs) {
    answers.forEach(function(a, i) {
      if (a <= 1) weakIdx.push(i);
      else if (a === 2) medIdx.push(i);
      else strongIdx.push(i);
    });
  }

  const scoreTier  = !hasScore ? 'none' : score <= 2 ? 'gap' : score === 3 ? 'developing' : 'strong';
  const levelLabel = hasScore ? ['','Needs Work','Developing','Competent','Advanced','Expert'][score] : 'Not Yet Assessed';
  const tierHex    = { gap:'#b83252', developing:'#c96d08', strong:'#1e6b50', none:'#64748b' };
  const tierPale   = { gap:'rgba(184,50,82,.07)', developing:'rgba(201,109,8,.07)', strong:'rgba(30,107,80,.07)', none:'rgba(100,116,139,.05)' };
  const tierBorder = { gap:'rgba(184,50,82,.2)', developing:'rgba(201,109,8,.2)', strong:'rgba(30,107,80,.2)', none:'rgba(100,116,139,.12)' };
  const tHex = tierHex[scoreTier], tPale = tierPale[scoreTier], tBorder = tierBorder[scoreTier];
  const pathAccentColors = {1:'#1e6b50',2:'#c4872a',3:'#2a6b9b',4:'#c05050',5:'#1e6b50',6:'#c4872a',7:'#2a6b9b',8:'#c05050'};

  /* ── HERO ── */
  const hero = document.getElementById('capLearnHero');
  if (hero) hero.style.background = 'linear-gradient(135deg,' + hex + 'cc 0%,#1c1118 70%)';

  const bc = document.getElementById('capLearnBreadcrumb');
  if (bc) bc.innerHTML =
    '<a onclick="navigate(\'home\')">Home</a><span>›</span>' +
    '<a onclick="navigate(\'capabilities\')">Capabilities</a><span>›</span>' +
    '<span>' + cap.title + ' — Learn</span>';

  const heroContent = document.getElementById('capLearnHeroContent');
  if (heroContent) heroContent.innerHTML =
    '<div style="display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.8);font-size:11px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;padding:5px 12px;border-radius:100px;margin-bottom:14px">' +
      cap.icon + ' Capability ' + cap.num + ' · ' + cap.category.charAt(0).toUpperCase() + cap.category.slice(1) +
    '</div>' +
    '<h1 style="max-width:660px;margin-bottom:10px">' + cap.title + '</h1>' +
    '<p style="max-width:580px;opacity:.75;margin-bottom:' + (hasScore ? '16px' : '20px') + '">' + cap.def + '</p>' +
    (hasScore ?
      '<div style="display:inline-flex;align-items:center;gap:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px 16px;margin-bottom:20px">' +
        '<div style="font-size:26px;font-weight:900;color:#fff;line-height:1">' + score + '<span style="font-size:13px;opacity:.5">/5</span></div>' +
        '<div style="width:1px;height:28px;background:rgba(255,255,255,.2)"></div>' +
        '<div><div style="font-size:10.5px;font-weight:700;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px">Your Score</div>' +
        '<div style="font-size:13.5px;font-weight:700;color:#fff">' + levelLabel + '</div></div>' +
      '</div><br>'
    : '') +
    '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
      '<button onclick="navigate(\'capabilities\')" style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Back to Capabilities</button>' +
      '<button onclick="startCapAssess(' + capNum + ')" style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">' + (hasScore ? 'Re-Assess' : 'Take Assessment') + '</button>' +
      '<button onclick="goToImprove(' + capNum + ')" style="background:' + hex + ';border:1px solid ' + hex + ';color:#fff;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Improve Plan</button>' +
    '</div>';

  const body = document.getElementById('capLearnBody');
  if (!body) return;

  /* ── helpers ── */
  function divider(label) {
    return '<div style="display:flex;align-items:center;gap:14px;margin:36px 0 20px">' +
      '<div style="font-size:13px;font-weight:800;color:var(--ink);text-transform:uppercase;letter-spacing:.08em;white-space:nowrap">' + label + '</div>' +
      '<div style="flex:1;height:1px;background:var(--border)"></div>' +
    '</div>';
  }

  function pathCard(p, priority) {
    var pa  = pathAccentColors[p.id] || '#1e6b50';
    var pd  = PATH_DETAILS[p.id];
    var bdr = priority ? '2px solid ' + pa : '1.5px solid var(--border)';
    return '<div class="cl-path-card" data-pid="' + p.id + '" data-col="' + pa + '" data-bdr="' + bdr + '"' +
      ' style="background:#fff;border:' + bdr + ';border-radius:12px;padding:20px;display:flex;flex-direction:column;cursor:pointer;position:relative;transition:box-shadow .2s">' +
      (priority ?
        '<div style="position:absolute;top:-1px;left:20px;font-size:10px;font-weight:800;background:' + pa + ';color:#fff;padding:3px 10px;border-radius:0 0 6px 6px;letter-spacing:.04em">' +
          (scoreTier === 'gap' ? 'START HERE' : 'RECOMMENDED') +
        '</div>' : '') +
      '<div style="padding-top:' + (priority ? '14px' : '0') + '">' +
      '<span style="background:' + p.tagColor + ';color:' + p.tagText + ';font-size:10px;font-weight:700;padding:3px 9px;border-radius:100px;display:inline-block;margin-bottom:10px;letter-spacing:.04em">' + p.tag + '</span>' +
      '<h4 style="font-size:15px;font-weight:800;color:var(--ink);margin-bottom:6px;line-height:1.3">' + p.title + '</h4>' +
      '<p style="font-size:13px;color:var(--ink-muted);line-height:1.55;margin-bottom:14px">' + p.desc + '</p>' +
      '<div style="display:flex;gap:16px;font-size:11.5px;color:var(--ink-muted);margin-bottom:16px;flex-wrap:wrap">' +
        '<span>' + p.lessons + ' lessons</span>' +
        '<span>' + p.templates + ' templates</span>' +
        (pd ? '<span>' + pd.time + '</span>' : '') +
      '</div>' +
      '<button onclick="event.stopPropagation();startLearningPath(' + p.id + ')" style="width:100%;background:' + pa + ';color:#fff;border:none;border-radius:7px;padding:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Start Path</button>' +
      '</div></div>';
  }

  function webCard(w, priority) {
    var wd   = WEBINAR_DETAILS[w.id];
    var isUp = w.status === 'upcoming';
    var bdr  = priority ? '2px solid ' + hex : '1.5px solid var(--border)';
    return '<div class="cl-web-card" data-col="' + hex + '" data-bdr="' + bdr + '"' +
      ' style="background:#fff;border:' + bdr + ';border-radius:12px;padding:20px;display:flex;gap:14px;align-items:flex-start;transition:box-shadow .2s">' +
      '<div style="width:44px;height:44px;border-radius:10px;background:' + pale + ';display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">' + cap.icon + '</div>' +
      '<div style="flex:1;min-width:0">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:7px;flex-wrap:wrap">' +
          '<span style="font-size:10.5px;font-weight:700;color:' + col + ';text-transform:uppercase;letter-spacing:.06em">Webinar ' + w.num + '</span>' +
          '<span style="font-size:10.5px;font-weight:600;padding:2px 8px;border-radius:4px;background:' + (isUp?'rgba(201,109,8,.1)':'rgba(30,107,80,.1)') + ';color:' + (isUp?'#c96d08':'#1e6b50') + '">' + (isUp?'Upcoming':'On-Demand') + '</span>' +
          (priority ? '<span style="font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:4px;background:' + pale + ';color:' + col + '">For You</span>' : '') +
        '</div>' +
        '<h4 style="font-size:14.5px;font-weight:800;color:var(--ink);margin-bottom:6px;line-height:1.3">' + w.title + '</h4>' +
        '<p style="font-size:13px;color:var(--ink-muted);line-height:1.55;margin-bottom:10px">' + w.desc + '</p>' +
        (wd && wd.includes && wd.includes.length ?
          '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px">' +
            wd.includes.map(function(inc){ return '<span style="font-size:11px;font-weight:600;color:' + col + ';background:' + pale + ';padding:2px 8px;border-radius:4px">+ ' + inc + '</span>'; }).join('') +
          '</div>' : '') +
        '<button onclick="navigate(\'webinars\')" style="background:' + hex + ';color:#fff;border:none;border-radius:7px;padding:8px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">' + (isUp?'Register':'Watch Now') + '</button>' +
      '</div></div>';
  }

  /* ── Workbook card builder ── */
  function wbCardLearn(w, priority) {
    var wc  = WB_COLORS[w.category]  || hex;
    var wp  = WB_COLOR_PALES[w.category] || pale;
    var wl  = WB_LABELS[w.category]  || w.category;
    var bdr = priority ? '2px solid ' + wc : '1.5px solid var(--border)';
    return '<div class="cl-wb-card" data-col="' + wc + '" data-bdr="' + bdr + '"' +
      ' style="background:#fff;border:' + bdr + ';border-radius:12px;padding:' + (priority?'0':'20px') + ';overflow:hidden;cursor:pointer;transition:box-shadow .2s" onclick="openWorkbookModal(' + w.id + ')">' +
      (priority ? '<div style="font-size:10px;font-weight:800;background:' + wc + ';color:#fff;padding:4px 14px;letter-spacing:.05em">YOUR CAPABILITY WORKBOOK</div>' : '') +
      '<div style="padding:' + (priority?'16px 20px 20px':'0') + ';display:flex;gap:14px;align-items:flex-start">' +
        '<div style="width:44px;height:44px;border-radius:10px;background:' + wp + ';display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">📓</div>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:' + wc + ';margin-bottom:4px">' + wl + '</div>' +
          '<h4 style="font-size:14.5px;font-weight:800;color:var(--ink);margin-bottom:5px;line-height:1.3">' + w.title + '</h4>' +
          '<p style="font-size:12.5px;color:var(--ink-muted);margin-bottom:10px;line-height:1.5">' + w.desc + '</p>' +
          '<div style="display:flex;align-items:center;gap:14px;font-size:12px;color:var(--ink-muted);margin-bottom:10px">' +
            '<span>📝 ' + w.exercises + ' exercises</span><span>⏱ ~' + w.minutes + ' min</span><span>📊 ' + w.level + '</span>' +
          '</div>' +
          '<button style="background:' + wc + ';color:#fff;border:none;border-radius:7px;padding:9px 20px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit" onclick="event.stopPropagation();openWorkbookModal(' + w.id + ')">Open Workbook →</button>' +
        '</div>' +
      '</div></div>';
  }

  function subRow(s, i, isWeak, isMed, lessonId) {
    var bg   = isWeak ? 'rgba(184,50,82,.05)' : isMed ? 'rgba(201,109,8,.05)' : 'var(--paper)';
    var bc2  = isWeak ? 'rgba(184,50,82,.2)' : isMed ? 'rgba(201,109,8,.2)' : 'var(--border)';
    var dot  = isWeak ? '#b83252' : isMed ? '#c96d08' : '#94a3b8';
    var tag  = isWeak ? '<span style="font-size:10px;font-weight:700;background:#b83252;color:#fff;padding:1px 7px;border-radius:3px;margin-left:8px">Focus</span>'
             : isMed  ? '<span style="font-size:10px;font-weight:700;background:#c96d08;color:#fff;padding:1px 7px;border-radius:3px;margin-left:8px">Sharpen</span>'
             : '';
    return '<div class="cl-sub-row" data-lid="' + lessonId + '" data-idx="' + i + '" data-bc="' + bc2 + '"' +
      ' style="display:flex;align-items:center;gap:12px;padding:11px 14px;background:' + bg + ';border:1px solid ' + bc2 + ';border-radius:8px;cursor:pointer;transition:all .15s">' +
      '<div style="width:20px;height:20px;border-radius:50%;background:' + dot + '22;display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
        '<div style="width:7px;height:7px;border-radius:50%;background:' + dot + '"></div>' +
      '</div>' +
      '<span style="font-size:13px;font-weight:500;color:var(--ink-soft);flex:1;line-height:1.4">' + s + tag + '</span>' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + (isWeak?'#b83252':isMed?'#c96d08':'#94a3b8') + '" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>' +
    '</div>';
  }

  function focusRow(sub, i, type, lid) {
    var isWeak  = type === 'weak';
    var rowHex  = isWeak ? '#b83252' : '#c96d08';
    var rowPale = isWeak ? 'rgba(184,50,82,.06)' : 'rgba(201,109,8,.06)';
    var rowBdr  = isWeak ? 'rgba(184,50,82,.18)' : 'rgba(201,109,8,.18)';
    var label   = isWeak ? 'Focus' : 'Sharpen';
    var action  = isWeak ? 'Learn this' : 'Sharpen';
    return '<div class="cl-focus-area-row" data-lid="' + lid + '" data-idx="' + i + '" data-type="' + type + '"' +
      ' style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:' + rowPale + ';border:1px solid ' + rowBdr + ';border-radius:8px;cursor:pointer;transition:all .15s">' +
      '<div style="width:6px;height:6px;border-radius:50%;background:' + rowHex + ';flex-shrink:0"></div>' +
      '<div style="flex:1;min-width:0">' +
        '<div style="font-size:13.5px;font-weight:600;color:var(--ink);line-height:1.4">' + sub + '</div>' +
        '<div style="font-size:11.5px;color:' + rowHex + ';font-weight:500;margin-top:2px">' + (isWeak ? 'Gap — needs attention' : 'Developing — room to improve') + '</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0">' +
        '<span style="font-size:10px;font-weight:800;background:' + rowHex + ';color:#fff;padding:2px 8px;border-radius:3px;letter-spacing:.04em">' + label.toUpperCase() + '</span>' +
        '<button class="cl-focus-area-btn" data-lid="' + lid + '" data-idx="' + i + '"' +
          ' style="background:#fff;color:' + rowHex + ';border:1px solid ' + rowHex + ';border-radius:6px;padding:5px 12px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">' + action + '</button>' +
      '</div>' +
    '</div>';
  }

  var h = '';

  /* ══ BRANCH A — NOT ASSESSED ══ */
  if (!hasScore) {

    /* Assessment prompt */
    h += '<div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:24px;margin-bottom:32px;display:flex;align-items:center;gap:20px;flex-wrap:wrap">' +
      '<div style="width:48px;height:48px;border-radius:10px;background:' + pale + ';display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">' + cap.icon + '</div>' +
      '<div style="flex:1;min-width:220px">' +
        '<div style="font-size:15px;font-weight:800;color:var(--ink);margin-bottom:4px">Get a personalised learning plan</div>' +
        '<div style="font-size:13px;color:var(--ink-muted);line-height:1.6">Take the short assessment to see exactly which lessons, paths, and webinars match your gaps.</div>' +
      '</div>' +
      '<button onclick="startCapAssess(' + capNum + ')" style="background:' + hex + ';color:#fff;border:none;border-radius:8px;padding:11px 22px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">Take Assessment</button>' +
    '</div>';

    /* Sub-capabilities */
    h += '<div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:20px 24px;margin-bottom:32px">';
    h += '<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.09em;color:var(--ink-muted);margin-bottom:14px">What you\'ll build — ' + cap.subs.length + ' sub-capabilities</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">';
    cap.subs.forEach(function(s, i) {
      h += '<div style="display:flex;align-items:flex-start;gap:9px;padding:9px 12px;background:var(--paper);border-radius:7px">' +
        '<div style="width:18px;height:18px;border-radius:50%;background:' + pale + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">' +
          '<div style="width:6px;height:6px;border-radius:50%;background:' + col + '"></div>' +
        '</div>' +
        '<span style="font-size:12.5px;color:var(--ink-soft);line-height:1.45">' + s + '</span>' +
      '</div>';
    });
    h += '</div></div>';

    /* Workbook for this capability */
    var capWb0 = WORKBOOKS.find(function(wb){ return wb.capNum === capNum; });
    if (capWb0) {
      h += divider('Your Capability Workbook');
      h += '<p style="font-size:13px;color:var(--ink-muted);margin:-10px 0 14px">Apply what you learn — complete the guided workbook to build real fundraising assets for this capability.</p>';
      h += wbCardLearn(capWb0, true);
    }

    /* Micro Lesson */
    if (lesson) {
      var pct0    = _topicPct(lesson.id);
      var isDone0 = _prog.doneTopics.has(lesson.id);
      var btn0    = isDone0 ? 'Review Lesson' : pct0 > 0 ? 'Continue (' + pct0 + '%)' : 'Start Lesson';
      var subcaps0 = lesson.subcaps || [];
      h += divider('Micro Lesson');
      h += '<div style="background:#fff;border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:4px">';
      h += '<div style="padding:20px 22px;border-bottom:1px solid var(--border);display:flex;gap:14px;align-items:flex-start">';
      h += '<div style="width:44px;height:44px;border-radius:10px;background:' + pale + ';display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">' + cap.icon + '</div>';
      h += '<div style="flex:1">';
      h += '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:' + col + ';margin-bottom:4px">' + lesson.cat + ' · ' + lesson.duration + '</div>';
      h += '<h3 style="font-size:16px;font-weight:800;color:var(--ink);margin-bottom:5px;line-height:1.3">' + lesson.title + '</h3>';
      h += '<p style="font-size:13px;color:var(--ink-muted);line-height:1.55;margin:0">' + lesson.desc + '</p>';
      h += '</div></div>';
      if (pct0 > 0) h += '<div style="height:3px;background:var(--border)"><div style="height:100%;width:' + pct0 + '%;background:' + hex + '"></div></div>';
      h += '<div style="padding:16px 22px;background:var(--paper)">';
      h += '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink-muted);margin-bottom:10px">Sub-lessons</div>';
      h += '<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">';
      subcaps0.forEach(function(s, i) { h += subRow(s, i, false, false, lesson.id); });
      h += '</div>';
      h += '<button onclick="openLessonPlayer(' + lesson.id + ',0)" style="background:' + hex + ';color:#fff;border:none;border-radius:8px;padding:11px 24px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit">' + btn0 + '</button>';
      h += '</div></div>';
    }

    /* Learning Paths */
    if (relPaths.length) {
      h += divider('Learning Paths');
      h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;margin-bottom:4px">';
      relPaths.forEach(function(p) { h += pathCard(p, false); });
      h += '</div>';
    }

    /* Webinars */
    if (relWebinars.length) {
      h += divider('Webinars');
      h += '<div style="display:flex;flex-direction:column;gap:12px">';
      relWebinars.forEach(function(w) { h += webCard(w, false); });
      h += '</div>';
    }

  /* ══ BRANCH B — ASSESSED ══ */
  } else {

    var tierMsg = scoreTier === 'gap'
      ? 'You have significant gaps here. Start with the highlighted resources to build your foundation first.'
      : scoreTier === 'developing'
      ? 'You\'re making progress. The resources below are ordered to close your specific gaps — start with the marked ones.'
      : 'You\'re strong in this area. Use these resources to sustain and extend your results.';

    /* Score card */
    h += '<div style="background:' + tPale + ';border:1px solid ' + tBorder + ';border-radius:12px;padding:20px 24px;margin-bottom:24px;display:flex;gap:16px;align-items:center;flex-wrap:wrap">';
    h += '<div style="width:48px;height:48px;border-radius:50%;background:' + tHex + ';color:#fff;font-size:18px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + score + '</div>';
    h += '<div style="flex:1;min-width:200px">';
    h += '<div style="font-size:14px;font-weight:800;color:var(--ink);margin-bottom:3px">Personalised learning plan · ' + levelLabel + '</div>';
    h += '<div style="font-size:13px;color:var(--ink-muted);line-height:1.55">' + tierMsg + '</div>';
    h += '</div>';
    h += '<button onclick="startCapAssess(' + capNum + ')" style="background:#fff;border:1px solid ' + tBorder + ';color:' + tHex + ';border-radius:8px;padding:9px 16px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">Re-Assess</button>';
    h += '</div>';

    /* Focus areas */
    if (weakIdx.length || medIdx.length) {
      var lid0 = lesson ? lesson.id : capNum;
      h += '<div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:20px 24px;margin-bottom:24px">';
      h += '<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.09em;color:var(--ink-muted);margin-bottom:14px">Your focus areas</div>';
      h += '<div style="display:flex;flex-direction:column;gap:8px">';
      weakIdx.forEach(function(i) { h += focusRow(cap.subs[i]||'', i, 'weak', lid0); });
      medIdx.forEach(function(i)  { h += focusRow(cap.subs[i]||'', i, 'med', lid0); });
      if (strongIdx.length) {
        strongIdx.forEach(function(i) {
          h += '<div style="display:flex;align-items:center;gap:12px;padding:11px 16px;background:var(--paper);border:1px solid var(--border);border-radius:8px;opacity:.65">' +
            '<div style="width:6px;height:6px;border-radius:50%;background:#1e6b50;flex-shrink:0"></div>' +
            '<span style="flex:1;font-size:13px;font-weight:500;color:var(--ink-soft)">' + (cap.subs[i]||'') + '</span>' +
            '<span style="font-size:10px;font-weight:800;background:#1e6b50;color:#fff;padding:2px 8px;border-radius:3px;letter-spacing:.04em">STRONG</span>' +
          '</div>';
        });
      }
      h += '</div></div>';
    } else if (scoreTier === 'strong') {
      h += '<div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:16px 22px;margin-bottom:24px;display:flex;align-items:center;gap:12px">';
      h += '<div style="width:32px;height:32px;border-radius:50%;background:rgba(30,107,80,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0">';
      h += '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1e6b50" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>';
      h += '<div><div style="font-size:13.5px;font-weight:700;color:var(--ink)">All sub-capabilities are strong</div>';
      h += '<div style="font-size:12px;color:var(--ink-muted)">Use the resources below to maintain your edge.</div></div>';
      h += '</div>';
    }

    /* Workbook for this capability */
    var capWb = WORKBOOKS.find(function(wb){ return wb.capNum === capNum; });
    if (capWb) {
      var wbSub = scoreTier === 'gap' ? 'Start with the workbook to build your foundation assets before moving to lessons.'
                : scoreTier === 'developing' ? 'Use the workbook to close your specific gaps with hands-on exercises.'
                : 'Complete the workbook to lock in your capability and produce polished deliverables.';
      h += divider('Your Capability Workbook');
      h += '<p style="font-size:13px;color:var(--ink-muted);margin:-10px 0 14px">' + wbSub + '</p>';
      h += wbCardLearn(capWb, true);
    }

    /* Micro Lesson */
    if (lesson) {
      var pct    = _topicPct(lesson.id);
      var isDone = _prog.doneTopics.has(lesson.id);
      var btnLbl = isDone ? 'Review Lesson' : pct > 0 ? 'Continue (' + pct + '%)' : 'Start Lesson';
      var weakSet = {}, medSet = {};
      weakIdx.forEach(function(i){ weakSet[i] = true; });
      medIdx.forEach(function(i){ medSet[i] = true; });
      var subcaps = lesson.subcaps || [];
      var lessonSub = scoreTier === 'gap' ? 'Start here — build your foundation before moving to the paths below.'
                    : scoreTier === 'developing' ? 'Sub-lessons with tags match your specific gaps.'
                    : 'Review for mastery.';
      h += divider('Micro Lesson');
      h += '<div style="background:#fff;border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:4px">';
      h += '<div style="padding:20px 22px;border-bottom:1px solid var(--border);display:flex;gap:14px;align-items:flex-start">';
      h += '<div style="width:44px;height:44px;border-radius:10px;background:' + pale + ';display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">' + cap.icon + '</div>';
      h += '<div style="flex:1">';
      h += '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:' + col + ';margin-bottom:4px">' + lesson.cat + ' · ' + lesson.duration + '</div>';
      h += '<h3 style="font-size:16px;font-weight:800;color:var(--ink);margin-bottom:5px;line-height:1.3">' + lesson.title + '</h3>';
      h += '<p style="font-size:13px;color:var(--ink-muted);line-height:1.55;margin:0">' + lessonSub + '</p>';
      h += '</div></div>';
      if (pct > 0) h += '<div style="height:3px;background:var(--border)"><div style="height:100%;width:' + pct + '%;background:' + hex + '"></div></div>';
      h += '<div style="padding:16px 22px;background:var(--paper)">';
      h += '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink-muted);margin-bottom:10px">' + ((weakIdx.length||medIdx.length) ? 'Sub-lessons — highlighted match your gaps' : 'Sub-lessons') + '</div>';
      h += '<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">';
      subcaps.forEach(function(s, i) { h += subRow(s, i, !!weakSet[i], !!medSet[i], lesson.id); });
      h += '</div>';
      h += '<button onclick="openLessonPlayer(' + lesson.id + ',0)" style="background:' + hex + ';color:#fff;border:none;border-radius:8px;padding:11px 24px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit">' + btnLbl + '</button>';
      h += '</div></div>';
    }

    /* Learning Paths */
    if (relPaths.length) {
      var pathSub = scoreTier === 'gap' ? 'Complete the recommended path to build the full capability.'
                  : scoreTier === 'developing' ? 'The recommended path will bridge your remaining gaps.'
                  : 'Paths to sustain and extend your results.';
      h += divider('Learning Paths');
      h += '<p style="font-size:13px;color:var(--ink-muted);margin:-10px 0 14px">' + pathSub + '</p>';
      h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">';
      relPaths.forEach(function(p, pi) { h += pathCard(p, pi === 0); });
      h += '</div>';
    }

    /* Webinars */
    if (relWebinars.length) {
      var webSub = scoreTier === 'gap' ? 'Watch the recommended session to understand the full picture.'
                 : scoreTier === 'developing' ? 'These sessions address your specific development stage.'
                 : 'Advanced sessions to deepen your expertise.';
      h += divider('Webinars');
      h += '<p style="font-size:13px;color:var(--ink-muted);margin:-10px 0 14px">' + webSub + '</p>';
      h += '<div style="display:flex;flex-direction:column;gap:12px">';
      relWebinars.forEach(function(w, wi) { h += webCard(w, wi === 0); });
      h += '</div>';
    }

  } /* end branch */

  /* Bottom nav strip */
  h += '<div style="margin-top:44px;padding-top:24px;border-top:1px solid var(--border);display:flex;gap:10px;flex-wrap:wrap;align-items:center">';
  h += '<button onclick="navigate(\'capabilities\')" style="background:#fff;border:1px solid var(--border);color:var(--ink-muted);border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Back to Capabilities</button>';
  h += '<button onclick="startCapAssess(' + capNum + ')" style="background:#fff;border:1px solid ' + hex + ';color:' + hex + ';border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">' + (hasScore ? 'Re-Assess' : 'Take Assessment') + '</button>';
  h += '<button onclick="goToImprove(' + capNum + ')" style="background:' + hex + ';color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Go to Improve Plan</button>';
  h += '</div>';

  body.innerHTML = h;

  /* wire events */
  body.querySelectorAll('.cl-focus-area-row').forEach(function(el) {
    var lid = parseInt(el.dataset.lid), idx = parseInt(el.dataset.idx), type = el.dataset.type;
    var bOn  = type === 'weak' ? 'rgba(184,50,82,.3)' : 'rgba(201,109,8,.3)';
    var bgOn = type === 'weak' ? 'rgba(184,50,82,.1)' : 'rgba(201,109,8,.1)';
    var bOff = type === 'weak' ? 'rgba(184,50,82,.18)' : 'rgba(201,109,8,.18)';
    var bgOff= type === 'weak' ? 'rgba(184,50,82,.06)' : 'rgba(201,109,8,.06)';
    el.addEventListener('mouseenter', function(){ this.style.borderColor=bOn; this.style.background=bgOn; });
    el.addEventListener('mouseleave', function(){ this.style.borderColor=bOff; this.style.background=bgOff; });
    el.addEventListener('click', function(e){ if(e.target.classList.contains('cl-focus-area-btn')) return; openLessonPlayer(lid,idx); });
  });
  body.querySelectorAll('.cl-focus-area-btn').forEach(function(el) {
    el.addEventListener('click', function(e){ e.stopPropagation(); openLessonPlayer(parseInt(el.dataset.lid),parseInt(el.dataset.idx)); });
  });
  body.querySelectorAll('.cl-sub-row').forEach(function(el) {
    var orig = el.dataset.bc;
    el.addEventListener('mouseenter', function(){ this.style.borderColor=hex; });
    el.addEventListener('mouseleave', function(){ this.style.borderColor=orig; });
    el.addEventListener('click', function(){ openLessonPlayer(parseInt(this.dataset.lid),parseInt(this.dataset.idx)); });
  });
  body.querySelectorAll('.cl-path-card').forEach(function(el) {
    var onC=el.dataset.col, offBdr=el.dataset.bdr;
    el.addEventListener('mouseenter', function(){ this.style.boxShadow='0 4px 20px rgba(0,0,0,.1)'; this.style.borderColor=onC; });
    el.addEventListener('mouseleave', function(){ this.style.boxShadow=''; this.style.border=offBdr; });
    el.addEventListener('click', function(){ startLearningPath(parseInt(this.dataset.pid)); });
  });
  body.querySelectorAll('.cl-wb-card').forEach(function(el) {
    var onC=el.dataset.col, offBdr=el.dataset.bdr;
    el.addEventListener('mouseenter', function(){ this.style.boxShadow='0 4px 20px rgba(0,0,0,.1)'; this.style.borderColor=onC; });
    el.addEventListener('mouseleave', function(){ this.style.boxShadow=''; this.style.border=offBdr; });
  });
  body.querySelectorAll('.cl-web-card').forEach(function(el) {
    var offBdr=el.dataset.bdr;
    el.addEventListener('mouseenter', function(){ this.style.boxShadow='0 4px 18px rgba(0,0,0,.08)'; this.style.borderColor=hex; });
    el.addEventListener('mouseleave', function(){ this.style.boxShadow=''; this.style.border=offBdr; });
  });

  var ft = document.getElementById('capLearnFooter');
  if (ft) { ft.dataset.rendered=''; ft.innerHTML=renderFooter(); ft.dataset.rendered='1'; }
}


function goToImprove(capNum) {
  navigate('cap-improve-' + capNum);
}

function renderCapGrid(){
  const grid=document.getElementById('capModelGrid');
  if(!grid) return;

  grid.innerHTML=CAP_MODEL.map(cap=>{
    const sc=capScores[cap.num];
    const sl=getCapScoreLabel(sc);
    const pct=sc?(sc/5*100):0;
    const catLabel={foundation:'Foundation',outreach:'Outreach',execution:'Execution',retention:'Retention'}[cap.category]||cap.category;

    const scoreBar = sc
      ? `<div style="margin-bottom:14px">
           <div style="display:flex;justify-content:space-between;margin-bottom:5px">
             <span style="font-size:11.5px;font-weight:600;color:${sl.color}">${sl.label}</span>
             <span style="font-size:11px;color:var(--ink-muted)">${pct}%</span>
           </div>
           <div style="height:5px;background:rgba(0,0,0,.06);border-radius:100px;overflow:hidden">
             <div style="height:100%;width:${pct}%;background:${cap.color};border-radius:100px;transition:width .5s ease"></div>
           </div>
         </div>`
      : `<div style="display:inline-block;background:var(--paper);color:var(--ink-muted);font-size:11px;font-weight:600;padding:3px 10px;border-radius:100px;margin-bottom:14px">Not yet assessed</div>`;

    return `<div style="background:#fff;border:1.5px solid var(--border);border-radius:16px;overflow:hidden;display:flex;flex-direction:column">
      <div style="height:4px;background:${cap.color}"></div>
      <div style="padding:20px 22px;flex:1">
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">
          <div style="width:44px;height:44px;border-radius:12px;background:${cap.colorPale};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${cap.icon}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${cap.color}">${catLabel}</span>
            </div>
            <h3 style="font-size:15px;font-weight:800;color:var(--ink);line-height:1.3;margin:0 0 4px">${cap.title}</h3>
            <p style="font-size:12.5px;color:var(--ink-muted);line-height:1.5;margin:0">${cap.def}</p>
          </div>
        </div>
        ${scoreBar}
      </div>
      <div style="padding:14px 22px;border-top:1px solid var(--border);background:var(--paper);display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <button onclick="startCapAssess(${cap.num})" style="flex:1;min-width:70px;padding:8px 8px;border-radius:8px;background:#fff;border:1.5px solid ${cap.color};color:${cap.color};font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .15s"
          onmouseover="this.style.background='${cap.colorPale}'" onmouseout="this.style.background='#fff'">${sc ? 'Re-Assess' : 'Assess'}</button>
        <button onclick="learnCapability(${cap.num})" style="flex:1;min-width:70px;padding:8px 8px;border-radius:8px;background:#fff;border:1.5px solid var(--border);color:var(--ink-soft);font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .15s"
          onmouseover="this.style.borderColor='var(--sky)';this.style.color='var(--sky)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--ink-soft)'">Learn</button>
        <button onclick="goToImprove(${cap.num})" style="flex:1;min-width:70px;padding:8px 8px;border-radius:8px;background:#fff;border:1.5px solid var(--border);color:var(--ink-soft);font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .15s"
          onmouseover="this.style.borderColor='${cap.color}';this.style.color='${cap.color}'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--ink-soft)'">Improve</button>
        <button onclick="openCapModal(${cap.num})" style="flex:1;min-width:70px;padding:8px 8px;border-radius:8px;background:${cap.color};border:none;color:#fff;font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:opacity .15s"
          onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">Learn More</button>
      </div>
    </div>`;
  }).join('');

  updateCapDashboard();
}

function setCapScore(capNum,score){
  capScores[capNum]=score;
  renderCapGrid();
  showToast('Capability '+capNum+' scored '+score+'/5','success');
}

function updateCapDashboard(){
  const sc=CAP_MODEL.map(c=>capScores[c.num]).filter(Boolean);
  const n=sc.length,avg=n?(sc.reduce((a,b)=>a+b,0)/n).toFixed(1):'—';
  const strong=sc.filter(s=>s>=4).length,gaps=sc.filter(s=>s<=2).length;
  const pct=n?Math.round((sc.reduce((a,b)=>a+b,0)/(n*5))*100):0;
  ['cap-score-total','cap-assessed-count','cap-strong-count','cap-gap-count'].forEach((id,i)=>{const e=document.getElementById(id);if(e)e.textContent=[avg,n,strong,gaps][i];});
  const bar=document.getElementById('cap-progress-bar');if(bar)bar.style.width=pct+'%';
  const p=document.getElementById('cap-progress-pct');if(p)p.textContent=n===10?pct+'% overall capability coverage':n+'/10 capabilities self-assessed';
}

function openCapModal(capNum){
  const cap=CAP_MODEL.find(c=>c.num===capNum);if(!cap)return;
  const sc=capScores[capNum];const sl=getCapScoreLabel(sc);
  openModal(cap.icon+' Cap '+cap.num+': '+cap.title,
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px"><span style="background:'+cap.colorPale+';color:'+cap.color+';padding:3px 11px;border-radius:100px;font-size:12px;font-weight:700;text-transform:capitalize">'+cap.category+'</span><span style="background:'+sl.bg+';color:'+sl.color+';padding:3px 11px;border-radius:100px;font-size:12px;font-weight:700">'+sl.label+'</span></div>'
    +'<p style="font-size:14.5px;color:var(--ink-soft);line-height:1.65;margin-bottom:18px">'+cap.def+'</p>'
    +'<div style="background:var(--paper);border-radius:12px;padding:16px;margin-bottom:14px"><div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink-muted);margin-bottom:11px">Sub-Capabilities ('+cap.subs.length+')</div><div style="display:flex;flex-direction:column;gap:6px">'+cap.subs.map(s=>'<div style="display:flex;gap:9px;padding:8px 11px;background:#fff;border-radius:8px;border:1px solid var(--border);font-size:13px;color:var(--ink-soft)"><span style="color:'+cap.color+';flex-shrink:0">✓</span>'+s+'</div>').join('')+'</div></div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">'
    +'<div style="background:var(--paper);border-radius:12px;padding:14px"><div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink-muted);margin-bottom:9px">Evidence Assets</div>'+cap.assets.map(a=>'<div style="font-size:13px;color:var(--ink-soft);margin-bottom:6px;display:flex;gap:7px"><span style="color:'+cap.color+'">→</span>'+a+'</div>').join('')+'</div>'
    +'<div style="background:var(--paper);border-radius:12px;padding:14px"><div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink-muted);margin-bottom:9px">Metrics</div>'+cap.metrics.map(m=>'<div style="font-size:13px;color:var(--ink-soft);margin-bottom:6px">• '+m+'</div>').join('')+'</div>'
    +'</div>'
    +'<div style="background:'+cap.colorPale+';border-radius:12px;padding:16px;margin-bottom:16px"><div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:'+cap.color+';margin-bottom:9px">30-Day Implementation Plan</div><p style="font-size:13.5px;color:var(--ink);line-height:1.65;margin:0">'+cap.plan+'</p></div>'
    +'<div style="display:flex;gap:9px;flex-wrap:wrap">'
    +'<button class="btn-primary" style="background:'+cap.color+';border-color:'+cap.color+'" onclick="closeModal();startCapAssess('+capNum+')">'+(sc?'Re-Assess':'Assess')+'</button>'
    +'<button class="btn-outline" onclick="closeModal();learnCapability('+capNum+')">Learn</button>'
    +'<button class="btn-outline" style="border-color:'+cap.color+';color:'+cap.color+'" onclick="closeModal();goToImprove('+capNum+')">Improve →</button>'
    +'</div>'
  );
}



function renderCapabilities(){
  renderCapGrid();
  const footer=document.getElementById('capabilitiesFooter');
  if(footer&&!footer.dataset.rendered){footer.innerHTML=renderFooter();footer.dataset.rendered='1';}
}

/* ── Cap Improve: mapping data per capability ── */
const CAP_IMPROVE_MAP = {
  1:{ toolIds:[1], wbIds:[1],  storyIds:[1],    videoIds:[5,12] },
  2:{ toolIds:[2], wbIds:[2],  storyIds:[6],    videoIds:[3,7]  },
  3:{ toolIds:[3], wbIds:[3],  storyIds:[2,6],  videoIds:[3,6]  },
  4:{ toolIds:[4], wbIds:[4],  storyIds:[7],    videoIds:[13,2] },
  5:{ toolIds:[4,5],wbIds:[5], storyIds:[7],    videoIds:[2,14] },
  6:{ toolIds:[6], wbIds:[6],  storyIds:[1,7],  videoIds:[14,15]},
  7:{ toolIds:[6,7],wbIds:[7], storyIds:[2],    videoIds:[1,6,10]},
  8:{ toolIds:[8], wbIds:[8],  storyIds:[5],    videoIds:[8,17] },
  9:{ toolIds:[9], wbIds:[9],  storyIds:[4,8],  videoIds:[4,11,18]},
  10:{toolIds:[10],wbIds:[10], storyIds:[3],    videoIds:[7,9,15]},
};

function renderCapImprovePage(capNum) {
  const cap = CAP_MODEL.find(c => c.num === capNum);
  if (!cap) return;

  const map      = CAP_IMPROVE_MAP[capNum] || { toolIds:[], wbIds:[], storyIds:[], videoIds:[] };
  const ctx      = _capLearnContext[capNum] || null;
  const score    = ctx ? ctx.score : (capScores[capNum] || null);
  const answers  = ctx ? ctx.answers : null;
  const hasScore = score !== null && score !== undefined;

  const weakIdx = [], medIdx = [], strongIdx = [];
  if (answers && cap.subs) {
    answers.forEach((a, i) => {
      if (a <= 1) weakIdx.push(i);
      else if (a === 2) medIdx.push(i);
      else strongIdx.push(i);
    });
  }

  const scoreTier  = !hasScore ? 'none' : score <= 2 ? 'gap' : score === 3 ? 'developing' : 'strong';
  const levelLabel = hasScore ? ['','Needs Work','Developing','Competent','Advanced','Expert'][score] : 'Not Yet Assessed';
  const col = cap.color, pale = cap.colorPale, hex = cap.colorHex;

  const tierHex    = { gap:'#b83252', developing:'#c96d08', strong:'#1e6b50', none:'#64748b' };
  const tierPale   = { gap:'rgba(184,50,82,.07)', developing:'rgba(201,109,8,.07)', strong:'rgba(30,107,80,.07)', none:'rgba(100,116,139,.05)' };
  const tierBorder = { gap:'rgba(184,50,82,.2)', developing:'rgba(201,109,8,.2)', strong:'rgba(30,107,80,.2)', none:'rgba(100,116,139,.12)' };
  const tHex = tierHex[scoreTier], tPale = tierPale[scoreTier], tBorder = tierBorder[scoreTier];

  /* ── All resources ── */
  const allTools   = (map.toolIds  || []).map(id => TOOLS.find(t => t.id===id)).filter(Boolean);
  const allWbs     = (map.wbIds    || []).map(id => WORKBOOKS.find(w => w.id===id)).filter(Boolean);
  const allStories = (map.storyIds || []).map(id => STORIES.find(s => s.id===id)).filter(Boolean);
  const allVideos  = (map.videoIds || []).map(id => VIDEO_GUIDES.find(v => v.id===id)).filter(Boolean);

  /* Priority split when assessed */
  const priTools  = hasScore && scoreTier !== 'strong' ? allTools.slice(0,1)  : allTools;
  const secTools  = hasScore && scoreTier !== 'strong' ? allTools.slice(1)    : [];
  const priWbs    = hasScore && scoreTier !== 'strong' ? allWbs.slice(0,1)    : allWbs;
  const secWbs    = hasScore && scoreTier !== 'strong' ? allWbs.slice(1)      : [];
  const priVideos = hasScore && scoreTier === 'gap'    ? allVideos.slice(0,1) : allVideos;
  const secVideos = hasScore && scoreTier === 'gap'    ? allVideos.slice(1)   : [];

  /* ── Card builders ── */
  function divider(label) {
    return '<div style="display:flex;align-items:center;gap:14px;margin:32px 0 18px">' +
      '<div style="font-size:11px;font-weight:800;color:var(--ink);text-transform:uppercase;letter-spacing:.09em;white-space:nowrap">' + label + '</div>' +
      '<div style="flex:1;height:1px;background:var(--border)"></div>' +
    '</div>';
  }

  function priorityLabel(text, color) {
    return '<div style="display:inline-block;font-size:10px;font-weight:800;background:' + color + ';color:#fff;padding:3px 10px;border-radius:0 0 6px 6px;letter-spacing:.04em;margin-bottom:10px">' + text + '</div>';
  }

  function toolCard(t, priority) {
    const cc = {planning:'var(--emerald)',messaging:'var(--gold)',pipeline:'var(--sky)',grants:'var(--rose)',digital:'#7c3aed'}[t.category]||hex;
    const cb = {planning:'var(--emerald-pale)',messaging:'var(--gold-pale)',pipeline:'var(--sky-pale)',grants:'var(--rose-pale)',digital:'#f5f3ff'}[t.category]||pale;
    const bdr = priority ? '2px solid ' + cc : '1px solid var(--border)';
    return `<div class="ci-card" data-hover-color="${cc}" style="background:#fff;border:${bdr};border-radius:12px;padding:${priority?'0':'18px'};overflow:hidden;cursor:pointer;transition:box-shadow .2s" onclick="showToolPreview(${t.id})">
      ${priority ? priorityLabel('START WITH THIS', cc) : ''}
      <div style="padding:${priority?'0 18px 18px':'0'};display:flex;gap:12px;align-items:flex-start">
        <div style="width:38px;height:38px;border-radius:9px;background:${cb};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${t.icon}</div>
        <div style="flex:1">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${cc};margin-bottom:4px">${t.category}</div>
          <h4 style="font-size:13.5px;font-weight:700;color:var(--ink);margin-bottom:4px;line-height:1.3">${t.title}</h4>
          <p style="font-size:12px;color:var(--ink-muted);margin-bottom:8px;line-height:1.45">${t.desc}</p>
          <span style="font-size:12px;font-weight:600;color:${cc}">Get Template</span>
        </div>
      </div>
    </div>`;
  }

  function wbCard(w, priority) {
    const wc = WB_COLORS[w.category]||hex;
    const wp = WB_COLOR_PALES[w.category]||pale;
    const wl = WB_LABELS[w.category]||w.category;
    const bdr = priority ? '2px solid ' + wc : '1px solid var(--border)';
    return `<div class="ci-card" data-hover-color="${wc}" style="background:#fff;border:${bdr};border-radius:12px;padding:${priority?'0':'18px'};overflow:hidden;cursor:pointer;transition:box-shadow .2s" onclick="openWorkbookModal(${w.id})">
      ${priority ? priorityLabel('RECOMMENDED', wc) : ''}
      <div style="padding:${priority?'0 18px 18px':'0'};display:flex;gap:12px;align-items:flex-start">
        <div style="width:38px;height:38px;border-radius:9px;background:${wp};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">📓</div>
        <div style="flex:1">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${wc};margin-bottom:4px">${wl}</div>
          <h4 style="font-size:13.5px;font-weight:700;color:var(--ink);margin-bottom:4px;line-height:1.3">${w.title}</h4>
          <p style="font-size:12px;color:var(--ink-muted);margin-bottom:8px">${w.exercises} exercises · ~${w.minutes} min</p>
          <span style="font-size:12px;font-weight:600;color:${wc}">Open Workbook</span>
        </div>
      </div>
    </div>`;
  }

  function videoCard(v, priority) {
    const vc = VG_COLORS[v.category]||hex;
    const vl = VG_LABELS[v.category]||v.category;
    const bdr = priority ? '2px solid ' + vc : '1px solid var(--border)';
    return `<div class="ci-card" data-hover-color="${vc}" style="background:#fff;border:${bdr};border-radius:12px;overflow:hidden;cursor:pointer;transition:box-shadow .2s" onclick="openVideoModal(${v.id})">
      ${priority ? `<div style="font-size:10px;font-weight:800;background:${vc};color:#fff;padding:4px 14px;text-align:center;letter-spacing:.05em">WATCH FIRST</div>` : ''}
      <div style="background:var(--ink);aspect-ratio:16/9;position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 60% 40%,${v.gradient},transparent 65%)"></div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
          <div style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.15);border:2px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
        <div style="position:absolute;bottom:7px;right:8px;background:rgba(0,0,0,.6);color:#fff;font-size:10px;font-weight:600;padding:2px 6px;border-radius:3px">${v.duration}</div>
        <div style="position:absolute;top:7px;left:8px;background:${vc};color:#fff;font-size:9px;font-weight:700;padding:2px 7px;border-radius:3px;text-transform:uppercase">${vl}</div>
      </div>
      <div style="padding:13px">
        <h4 style="font-size:13px;font-weight:700;color:var(--ink);margin-bottom:5px;line-height:1.3">${v.title}</h4>
        <span style="font-size:12px;font-weight:600;color:${vc}">Watch</span>
      </div>
    </div>`;
  }

  function storyCard(s) {
    return `<div class="ci-card story-card" data-hover-color="${hex}" onclick="showStoryModal(${s.id})">
      <div class="sc-top">
        <span class="sc-tag" style="background:${s.tagBg};color:${s.tagColor}">${s.tag}</span>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </div>
      <div class="sc-bottom">
        <div class="sc-stat"><strong>${s.stat}</strong><span>${s.statLabel}</span></div>
        <span style="font-size:13px;font-weight:600;color:var(--emerald)">Read story</span>
      </div>
    </div>`;
  }

  function focusRow(sub, i, type, lid) {
    const isWeak = type === 'weak';
    const rHex  = isWeak ? '#b83252' : '#c96d08';
    const rPale = isWeak ? 'rgba(184,50,82,.06)' : 'rgba(201,109,8,.06)';
    const rBdr  = isWeak ? 'rgba(184,50,82,.18)' : 'rgba(201,109,8,.18)';
    return `<div class="ci-focus-area-row" data-lid="${lid}" data-idx="${i}" data-type="${type}"
      style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:${rPale};border:1px solid ${rBdr};border-radius:8px;cursor:pointer;transition:all .15s">
      <div style="width:6px;height:6px;border-radius:50%;background:${rHex};flex-shrink:0"></div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13.5px;font-weight:600;color:var(--ink);line-height:1.4">${sub}</div>
        <div style="font-size:11.5px;color:${rHex};font-weight:500;margin-top:2px">${isWeak?'Gap — needs attention':'Developing — room to improve'}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
        <span style="font-size:10px;font-weight:800;background:${rHex};color:#fff;padding:2px 8px;border-radius:3px;letter-spacing:.04em">${isWeak?'FOCUS':'SHARPEN'}</span>
        <button class="ci-focus-area-btn" data-lid="${lid}" data-idx="${i}"
          style="background:#fff;color:${rHex};border:1px solid ${rHex};border-radius:6px;padding:5px 12px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">${isWeak?'Learn this':'Sharpen'}</button>
      </div>
    </div>`;
  }

  /* ── BODY ── */
  const content = document.getElementById('capImproveContent');
  if (!content) return;

  /* HERO */
  let html = `
    <div class="page-hero" style="background:linear-gradient(135deg,${hex}cc 0%,#1c1118 70%)">
      <div class="page-hero-inner">
        <div class="breadcrumb">
          <a onclick="navigate('home')">Home</a><span>›</span>
          <a onclick="navigate('capabilities')">Capabilities</a><span>›</span>
          <span>${cap.title} — Improve</span>
        </div>
        <div style="display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.8);font-size:11px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;padding:5px 12px;border-radius:100px;margin-bottom:14px">
          ${cap.icon} Capability ${cap.num} · ${cap.category.charAt(0).toUpperCase()+cap.category.slice(1)}
        </div>
        <h1 style="max-width:660px;margin-bottom:10px">Improve: ${cap.title}</h1>
        <p style="max-width:580px;opacity:.75;margin-bottom:${hasScore?'16px':'20px'}">${cap.def}</p>
        ${hasScore ? `
        <div style="display:inline-flex;align-items:center;gap:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px 16px;margin-bottom:20px">
          <div style="font-size:26px;font-weight:900;color:#fff;line-height:1">${score}<span style="font-size:13px;opacity:.5">/5</span></div>
          <div style="width:1px;height:28px;background:rgba(255,255,255,.2)"></div>
          <div><div style="font-size:10.5px;font-weight:700;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px">Your Score</div>
          <div style="font-size:13.5px;font-weight:700;color:#fff">${levelLabel}</div></div>
        </div><br>` : ''}
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button onclick="navigate('capabilities')" style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Back to Capabilities</button>
          <button onclick="startCapAssess(${capNum})" style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">${hasScore?'Re-Assess':'Take Assessment'}</button>
          <button onclick="learnCapability(${capNum})" style="background:${hex};border:1px solid ${hex};color:#fff;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Learn This Capability</button>
        </div>
      </div>
    </div>`;

  html += `<section class="content-section" style="background:var(--paper)"><div class="container">`;

  /* ══ BRANCH A — NOT ASSESSED ══ */
  if (!hasScore) {

    /* Assessment prompt */
    html += `
    <div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:24px;margin-bottom:32px;display:flex;align-items:center;gap:20px;flex-wrap:wrap">
      <div style="width:48px;height:48px;border-radius:10px;background:${pale};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${cap.icon}</div>
      <div style="flex:1;min-width:220px">
        <div style="font-size:15px;font-weight:800;color:var(--ink);margin-bottom:4px">Get a personalised improvement plan</div>
        <div style="font-size:13px;color:var(--ink-muted);line-height:1.6">Take the short assessment to see exactly which tools, workbooks and videos to prioritise based on your gaps.</div>
      </div>
      <button onclick="startCapAssess(${capNum})" style="background:${hex};color:#fff;border:none;border-radius:8px;padding:11px 22px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">Take Assessment</button>
    </div>`;

    /* Sub-capabilities */
    html += `
    <div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:20px 24px;margin-bottom:8px">
      <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.09em;color:var(--ink-muted);margin-bottom:14px">What you'll build — ${cap.subs.length} sub-capabilities</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">
        ${cap.subs.map(s => `
          <div style="display:flex;align-items:flex-start;gap:9px;padding:9px 12px;background:var(--paper);border-radius:7px">
            <div style="width:18px;height:18px;border-radius:50%;background:${pale};display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">
              <div style="width:6px;height:6px;border-radius:50%;background:${col}"></div>
            </div>
            <span style="font-size:12.5px;color:var(--ink-soft);line-height:1.45">${s}</span>
          </div>`).join('')}
      </div>
    </div>`;

    if (allTools.length) {
      html += divider('Tools & Templates');
      html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px">${allTools.map(t=>toolCard(t,false)).join('')}</div>`;
    }
    if (allWbs.length) {
      html += divider('Workbooks');
      html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px">${allWbs.map(w=>wbCard(w,false)).join('')}</div>`;
    }
    if (allVideos.length) {
      html += divider('Video Guides');
      html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px">${allVideos.map(v=>videoCard(v,false)).join('')}</div>`;
    }
    if (allStories.length) {
      html += divider('Success Stories');
      html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px">${allStories.map(s=>storyCard(s)).join('')}</div>`;
    }

  /* ══ BRANCH B — ASSESSED ══ */
  } else {

    const tierMsg = {
      gap:        'You have significant gaps here. Start with the highlighted resources to build your foundation.',
      developing: 'You\'re making progress. Resources are ordered to close your specific gaps — start with the marked ones.',
      strong:     'You\'re strong here. Use these resources to maintain and extend your results.'
    }[scoreTier];

    /* Score card */
    html += `
    <div style="background:${tPale};border:1px solid ${tBorder};border-radius:12px;padding:20px 24px;margin-bottom:24px;display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <div style="width:48px;height:48px;border-radius:50%;background:${tHex};color:#fff;font-size:18px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0">${score}</div>
      <div style="flex:1;min-width:200px">
        <div style="font-size:14px;font-weight:800;color:var(--ink);margin-bottom:3px">Personalised improvement plan · ${levelLabel}</div>
        <div style="font-size:13px;color:var(--ink-muted);line-height:1.55">${tierMsg}</div>
      </div>
      <button onclick="startCapAssess(${capNum})" style="background:#fff;border:1px solid ${tBorder};color:${tHex};border-radius:8px;padding:9px 16px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">Re-Assess</button>
    </div>`;

    /* Focus areas */
    const lessonForCap = LESSONS.find(l => l.id === capNum);
    const lid0 = lessonForCap ? lessonForCap.id : capNum;

    if (weakIdx.length || medIdx.length) {
      html += `<div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:20px 24px;margin-bottom:24px">`;
      html += `<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.09em;color:var(--ink-muted);margin-bottom:14px">Your focus areas</div>`;
      html += `<div style="display:flex;flex-direction:column;gap:8px">`;
      weakIdx.forEach(i => { html += focusRow(cap.subs[i]||'', i, 'weak', lid0); });
      medIdx.forEach(i  => { html += focusRow(cap.subs[i]||'', i, 'med',  lid0); });
      if (strongIdx.length) {
        strongIdx.forEach(i => {
          html += `<div style="display:flex;align-items:center;gap:12px;padding:11px 16px;background:var(--paper);border:1px solid var(--border);border-radius:8px;opacity:.6">
            <div style="width:6px;height:6px;border-radius:50%;background:#1e6b50;flex-shrink:0"></div>
            <span style="flex:1;font-size:13px;font-weight:500;color:var(--ink-soft)">${cap.subs[i]||''}</span>
            <span style="font-size:10px;font-weight:800;background:#1e6b50;color:#fff;padding:2px 8px;border-radius:3px;letter-spacing:.04em">STRONG</span>
          </div>`;
        });
      }
      html += `</div></div>`;
    } else if (scoreTier === 'strong') {
      html += `
      <div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:16px 22px;margin-bottom:24px;display:flex;align-items:center;gap:12px">
        <div style="width:32px;height:32px;border-radius:50%;background:rgba(30,107,80,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1e6b50" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <div style="font-size:13.5px;font-weight:700;color:var(--ink)">All sub-capabilities are strong</div>
          <div style="font-size:12px;color:var(--ink-muted)">Use the resources below to maintain your edge and explore advanced techniques.</div>
        </div>
      </div>`;
    }

    /* 30-day plan */
    const planActions = score <= 2
      ? cap.plan.split('. ').filter(Boolean).slice(0,3)
      : cap.plan.split('. ').filter(Boolean).slice(1,4);
    if (planActions.length) {
      html += divider('Your 30-Day Plan');
      html += `<div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:20px 24px;margin-bottom:4px">`;
      html += `<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">`;
      planActions.forEach((a, i) => {
        html += `<div style="display:flex;gap:12px;padding:11px 14px;background:${i===0?tPale:'var(--paper)'};border:1px solid ${i===0?tBorder:'var(--border)'};border-radius:8px;align-items:flex-start">
          <div style="width:22px;height:22px;border-radius:50%;background:${i===0?tHex:pale};color:${i===0?'#fff':col};font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">${i+1}</div>
          <span style="font-size:13px;color:var(--ink-soft);line-height:1.5;flex:1">${a.trim()}</span>
          ${i===0?`<span style="font-size:10px;font-weight:800;background:${tHex};color:#fff;padding:2px 8px;border-radius:3px;white-space:nowrap;letter-spacing:.04em">DO FIRST</span>`:''}
        </div>`;
      });
      html += `</div>`;
      html += `<div style="background:${pale};border-radius:8px;padding:12px 14px;font-size:13px;color:var(--ink);line-height:1.6">
        <strong style="color:${col}">Full plan:</strong> ${cap.plan}
      </div></div>`;
    }

    /* Priority tools */
    if (priTools.length || secTools.length) {
      html += divider('Tools & Templates');
      if (priTools.length) html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px;margin-bottom:${secTools.length?'10px':'0'}">${priTools.map(t=>toolCard(t,true)).join('')}</div>`;
      if (secTools.length) {
        html += `<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-muted);margin:10px 0 8px">Also available</div>`;
        html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px">${secTools.map(t=>toolCard(t,false)).join('')}</div>`;
      }
    }

    /* Priority workbooks */
    if (priWbs.length || secWbs.length) {
      html += divider('Workbooks');
      if (priWbs.length) html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px;margin-bottom:${secWbs.length?'10px':'0'}">${priWbs.map(w=>wbCard(w,true)).join('')}</div>`;
      if (secWbs.length) {
        html += `<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-muted);margin:10px 0 8px">Also available</div>`;
        html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px">${secWbs.map(w=>wbCard(w,false)).join('')}</div>`;
      }
    }

    /* Priority videos */
    if (priVideos.length || secVideos.length) {
      html += divider('Video Guides');
      if (priVideos.length) html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;margin-bottom:${secVideos.length?'10px':'0'}">${priVideos.map(v=>videoCard(v,true)).join('')}</div>`;
      if (secVideos.length) {
        html += `<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-muted);margin:10px 0 8px">Also watch</div>`;
        html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px">${secVideos.map(v=>videoCard(v,false)).join('')}</div>`;
      }
    }

    /* Stories */
    if (allStories.length) {
      html += divider('Success Stories');
      html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px">${allStories.map(s=>storyCard(s)).join('')}</div>`;
    }

  } /* end branch */

  /* Bottom nav */
  html += `
    <div style="margin-top:44px;padding-top:24px;border-top:1px solid var(--border);display:flex;gap:10px;flex-wrap:wrap;align-items:center">
      <button onclick="navigate('capabilities')" style="background:#fff;border:1px solid var(--border);color:var(--ink-muted);border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Back to Capabilities</button>
      <button onclick="startCapAssess(${capNum})" style="background:#fff;border:1px solid ${hex};color:${hex};border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">${hasScore?'Re-Assess':'Take Assessment'}</button>
      <button onclick="learnCapability(${capNum})" style="background:${hex};color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Go to Learn</button>
      ${capNum < 10 ? `<button onclick="goToImprove(${capNum+1})" style="background:#fff;border:1px solid var(--border);color:var(--ink-muted);border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;margin-left:auto">Next Capability</button>` : ''}
    </div>
  </div></section>`;

  content.innerHTML = html;

  /* Wire focus rows */
  content.querySelectorAll('.ci-focus-area-row').forEach(el => {
    const lid=parseInt(el.dataset.lid), idx=parseInt(el.dataset.idx), type=el.dataset.type;
    const bOn=type==='weak'?'rgba(184,50,82,.3)':'rgba(201,109,8,.3)';
    const bgOn=type==='weak'?'rgba(184,50,82,.1)':'rgba(201,109,8,.1)';
    const bOff=type==='weak'?'rgba(184,50,82,.18)':'rgba(201,109,8,.18)';
    const bgOff=type==='weak'?'rgba(184,50,82,.06)':'rgba(201,109,8,.06)';
    el.addEventListener('mouseenter', function(){ this.style.borderColor=bOn; this.style.background=bgOn; });
    el.addEventListener('mouseleave', function(){ this.style.borderColor=bOff; this.style.background=bgOff; });
    el.addEventListener('click', function(e){ if(e.target.classList.contains('ci-focus-area-btn')) return; openLessonPlayer(lid,idx); });
  });
  content.querySelectorAll('.ci-focus-area-btn').forEach(el => {
    el.addEventListener('click', function(e){ e.stopPropagation(); openLessonPlayer(parseInt(el.dataset.lid),parseInt(el.dataset.idx)); });
  });

  /* Wire resource card hovers */
  content.querySelectorAll('.ci-card').forEach(el => {
    const hc = el.dataset.hoverColor;
    if (!hc) return;
    el.addEventListener('mouseenter', function(){ this.style.boxShadow='0 4px 20px rgba(0,0,0,.1)'; this.style.borderColor=hc; });
    el.addEventListener('mouseleave', function(){ this.style.boxShadow=''; this.style.borderColor=''; this.style.border=''; });
  });

  const ft = document.getElementById('capImproveFooter');
  if (ft) { ft.dataset.rendered=''; ft.innerHTML=renderFooter(); ft.dataset.rendered='1'; }
}


/* ══════════════════════════════════════════════════════
   IMPROVEMENT TRACKS
══════════════════════════════════════════════════════ */
const IMPROVEMENT_TRACKS = [
  {
    id: 0,
    icon: '🏗️',
    color: 'var(--emerald)',
    colorPale: 'var(--emerald-pale)',
    colorHex: '#d93d1a',
    label: 'Track 1',
    title: 'Define the Foundation',
    tagline: 'Build the minimum platform every funder expects to see.',
    duration: '4–6 weeks',
    level: 'Beginner',
    outcome: 'A fully documented fundraising direction, governance structure, and 90-day action plan your team can execute immediately.',
    why: 'Most NGOs fail to raise funds not because their work is weak — but because they lack the operational foundation that makes funders confident. This track fixes that.',
    capNums: [1, 3],
    steps: [
      { title: 'Assess your readiness baseline', desc: 'Take the 5-question assessment for Capability 1 (Fundraising Readiness) to identify your exact gaps before starting.', action: 'startCapAssess', actionArg: 1, actionLabel: 'Assess Cap 1' },
      { title: 'Set your fundraising goals & channels', desc: 'Define 2–3 priority funding channels and write specific, measurable targets for the next 12 months.', action: 'openWorkbookModal', actionArg: 1, actionLabel: 'Open Readiness Workbook' },
      { title: 'Assign team roles & weekly routines', desc: 'Document who is responsible for what in fundraising — and design a weekly routine the team will actually follow.', action: 'learnCapability', actionArg: 1, actionLabel: 'Learn Cap 1' },
      { title: 'Package your programs as fundable offers', desc: 'Turn program descriptions into structured funding tiers with unit costs — making it easy for donors to say yes.', action: 'learnCapability', actionArg: 3, actionLabel: 'Learn Cap 3' },
      { title: 'Build your 90-day readiness plan', desc: 'Consolidate everything into a single 90-day plan with weekly milestones your board and team can track.', action: 'navigate', actionArg: 'sh-roadmap', actionLabel: 'View 90-Day Roadmap' },
      { title: 'Re-assess & document your evidence', desc: 'Retake the assessments for both capabilities and upload your deliverables (plan, tiers, roles doc) as evidence.', action: 'startCapAssess', actionArg: 3, actionLabel: 'Re-Assess Cap 3' },
    ],
    toolIds: [1, 3],
    wbIds: [1, 3],
    lessonIds: [1, 3],
    storyIds: [1, 2],
    deliverables: [
      'Written 90-day fundraising plan',
      'Documented team roles for fundraising',
      'Weekly fundraising routine',
      '2–3 priority channels selected with rationale',
      'At least 1 program packaged as a fundable offer with unit cost',
      'Funding tiers (Bronze / Silver / Gold) for your main program',
    ],
    metrics: [
      'Cap 1 score before vs. after',
      'Cap 3 score before vs. after',
      'Number of programs packaged',
      '90-day plan exists (yes/no)',
      'Team roles documented (yes/no)',
    ],
    faqs: [
      { q: 'How long does this track take?', a: 'Most teams complete this in 4–6 weeks working 3–5 hours per week. The 90-day plan will structure your implementation beyond those first weeks.' },
      { q: 'Do I need to complete Track 1 before others?', a: 'Track 1 is the recommended starting point. Without a clear fundraising direction and packaged programs, the other tracks lose effectiveness. However, if your NGO already has these in place, you can start with Track 2 or 3.' },
      { q: 'What if my team is only 1–2 people?', a: 'This track is specifically designed for small teams. The tools and workbooks are lean and practical — they\'re made for people who fundraise alongside programme delivery.' },
    ],
  },
  {
    id: 1,
    icon: '💡',
    color: 'var(--gold)',
    colorPale: 'var(--gold-pale)',
    colorHex: '#c96d08',
    label: 'Track 2',
    title: 'The Value Proposition',
    tagline: 'Make your NGO impossible to ignore — and irresistible to fund.',
    duration: '4–5 weeks',
    level: 'Beginner–Intermediate',
    outcome: 'A polished one-page case for support, 3 audience-specific message versions, a 60-second pitch, and a clear ask framework your team uses consistently.',
    why: 'Donors do not fund causes — they fund organisations they believe in and understand. This track builds the communication foundation that makes every conversation, proposal, and meeting land harder.',
    capNums: [2, 6],
    steps: [
      { title: 'Assess your messaging gaps', desc: 'Take the Cap 2 assessment to see exactly where your messaging is weak before you start building.', action: 'startCapAssess', actionArg: 2, actionLabel: 'Assess Cap 2' },
      { title: 'Write your one-page case for support', desc: 'Use the Case for Support workbook to draft a compelling one-pager: problem → solution → proof → ask.', action: 'openWorkbookModal', actionArg: 2, actionLabel: 'Open Messaging Workbook' },
      { title: 'Create 3 audience message versions', desc: 'Adapt your core message for (1) institutional funders, (2) corporates, and (3) individual donors. Each audience needs a different emphasis.', action: 'showToolPreview', actionArg: 2, actionLabel: 'Get Messaging Tool' },
      { title: 'Build and practice your 60-second pitch', desc: 'Write a concise, memorable pitch your whole team can deliver — from events to WhatsApp conversations.', action: 'learnCapability', actionArg: 2, actionLabel: 'Learn Cap 2' },
      { title: 'Develop your ask framework', desc: 'Assess your asking and closing capability and build a structured approach that removes awkwardness from every ask.', action: 'startCapAssess', actionArg: 6, actionLabel: 'Assess Cap 6' },
      { title: 'Practice asks and handle objections', desc: 'Roleplay common objections with your team using the objection-handling sheet. Run at least 3 practice conversations before real asks.', action: 'learnCapability', actionArg: 6, actionLabel: 'Learn Cap 6' },
    ],
    toolIds: [2, 6],
    wbIds: [2, 6],
    lessonIds: [2, 6, 14],
    storyIds: [6, 1],
    deliverables: [
      'One-page case for support (final draft)',
      '3 audience message versions (grants, corporate, individual)',
      '60-second pitch script (written and practised)',
      'Credibility proof points documented (numbers + testimonials)',
      'Written ask framework with objection-handling responses',
      'Post-meeting follow-up template',
    ],
    metrics: [
      'Cap 2 score before vs. after',
      'Cap 6 score before vs. after',
      'One-pager completed (yes/no)',
      'Message versions written (0–3)',
      'Ask-to-commitment rate (% before/after)',
    ],
    faqs: [
      { q: 'Should I complete Track 1 first?', a: 'Ideally yes — your messaging should be built on a clear fundraising direction. But if you already have goals and channels defined, Track 2 works as a standalone.' },
      { q: 'How do I know if my one-pager is good enough?', a: 'Test it with 3 people outside your team — ideally a potential funder or a colleague from another NGO. If they understand your impact in 60 seconds without asking clarifying questions, it\'s working.' },
      { q: 'What if I\'m not confident asking for money?', a: 'That\'s exactly why this track includes Cap 6. Asking is a skill, not a personality trait. The workbook and scripts take the guesswork out of every conversation.' },
    ],
  },
  {
    id: 2,
    icon: '💰',
    color: 'var(--sky)',
    colorPale: 'var(--sky-pale)',
    colorHex: '#5533a8',
    label: 'Track 3',
    title: 'The Financial Model',
    tagline: 'Build the revenue engines that fund your mission long-term.',
    duration: '6–8 weeks',
    level: 'Intermediate–Advanced',
    outcome: 'Active grant applications in progress, at least one corporate partnership in negotiation, and a running digital campaign — three revenue streams working simultaneously.',
    why: 'Sustainable NGO funding doesn\'t come from one source. This track helps you build and run three revenue engines at the same time — so you\'re never dependent on a single funder again.',
    capNums: [7, 8, 9],
    steps: [
      { title: 'Assess grant, corporate & digital capabilities', desc: 'Run assessments for all three capabilities (7, 8, 9) to see where your biggest gaps are before deciding which to prioritise.', action: 'navigate', actionArg: 'capabilities', actionLabel: 'Go to Capabilities' },
      { title: 'Build your grant pipeline', desc: 'Use the grant go/no-go matrix to shortlist 3–5 real opportunities and begin your first full proposal using the 2-page template.', action: 'openWorkbookModal', actionArg: 7, actionLabel: 'Open Grant Capability Workbook' },
      { title: 'Create your corporate partnership menu', desc: 'Build a tiered corporate partnership offer — Bronze, Silver, Gold — with clear deliverables and outcomes per level.', action: 'learnCapability', actionArg: 8, actionLabel: 'Learn Cap 8' },
      { title: 'Design your first digital campaign', desc: 'Choose a compelling campaign hook, set a clear unit-cost goal, and build a 14-day content calendar ready to launch.', action: 'openWorkbookModal', actionArg: 9, actionLabel: 'Open Digital Campaign Workbook' },
      { title: 'Run the campaign and pitch corporates', desc: 'Launch your digital campaign and make your first two corporate pitches simultaneously. Track results in real time.', action: 'showToolPreview', actionArg: 9, actionLabel: 'Get Digital Campaign Kit' },
      { title: 'Review results and refine each channel', desc: 'After the first cycle, analyse what worked in each channel and adjust your approach before repeating.', action: 'navigate', actionArg: 'success-stories', actionLabel: 'Read Success Stories' },
    ],
    toolIds: [6, 8, 9],
    wbIds: [7, 8, 9],
    lessonIds: [7, 8, 9],
    storyIds: [2, 4, 5],
    deliverables: [
      'Go/no-go assessment completed for 3+ grant opportunities',
      '2-page grant proposal (first draft)',
      'Corporate target list (10+ companies)',
      'Corporate partnership menu (3 tiers)',
      'Digital campaign plan (hook, goal, 14-day calendar)',
      'Post-campaign performance report',
    ],
    metrics: [
      'Cap 7 score before vs. after',
      'Cap 8 score before vs. after',
      'Cap 9 score before vs. after',
      'Grant applications submitted',
      'Corporate meetings booked',
      'Campaign total raised vs goal (%)',
    ],
    faqs: [
      { q: 'Is this track too advanced for a new NGO?', a: 'This track is designed for NGOs that have completed (or already have) Tracks 1 and 2. If your messaging and program packaging are strong, you\'re ready for Track 3.' },
      { q: 'Do I have to run all three revenue streams at once?', a: 'No — you can sequence them. Typically: grants first (lower barrier), then corporate (medium barrier), then digital (requires an audience). The track shows you how to do all three within 6–8 weeks at a manageable pace.' },
      { q: 'How do I choose which grants to apply for?', a: 'The go/no-go matrix in Cap 7 helps you score each opportunity. Only pursue grants where you score above 60%. Anything below that wastes time better spent on higher-fit opportunities.' },
    ],
  },
  {
    id: 3,
    icon: '📖',
    color: 'var(--rose)',
    colorPale: 'var(--rose-pale)',
    colorHex: '#b83252',
    label: 'Track 4',
    title: 'Telling the Story',
    tagline: 'Turn your impact into content that attracts, moves, and retains donors.',
    duration: '3–5 weeks',
    level: 'Intermediate',
    outcome: 'A working story bank, an active donor retention journey, and a quarterly impact reporting system that keeps donors emotionally connected to your mission.',
    why: 'Fundraising is not just asking — it\'s relationship building. The NGOs that retain donors at 60%+ do so because they tell a great story between asks. This track builds that communication muscle.',
    capNums: [2, 10],
    steps: [
      { title: 'Assess your retention & messaging baseline', desc: 'Run the Cap 2 and Cap 10 assessments to see where your story and stewardship systems currently stand.', action: 'startCapAssess', actionArg: 10, actionLabel: 'Assess Cap 10' },
      { title: 'Build your NGO story bank', desc: 'Identify 3–5 compelling beneficiary stories and document them using the ethical storytelling framework. These become your core content assets.', action: 'learnCapability', actionArg: 2, actionLabel: 'Learn Storytelling (Cap 2)' },
      { title: 'Create your 48-hour thank-you system', desc: 'Design a personalised thank-you sequence that goes out within 48 hours of every gift — with impact context, not just a receipt.', action: 'showToolPreview', actionArg: 10, actionLabel: 'Get Retention Kit' },
      { title: 'Map your 30/60/90 donor journey', desc: 'Plan exactly what communication donors receive at 30, 60, and 90 days after their first gift — keeping them connected and ready for the renewal ask.', action: 'openWorkbookModal', actionArg: 10, actionLabel: 'Open Retention Workbook' },
      { title: 'Write your first impact update', desc: 'Produce a one-page impact update using your story bank and impact numbers. Send it to all current donors as your first act of this track.', action: 'learnCapability', actionArg: 10, actionLabel: 'Learn Cap 10' },
      { title: 'Set up your quarterly reporting rhythm', desc: 'Build a repeatable quarterly impact reporting system so you never go more than 3 months without connecting with your donor base.', action: 'openWorkbookModal', actionArg: 10, actionLabel: 'Open Retention Workbook' },
    ],
    toolIds: [2, 10],
    wbIds: [2, 10],
    lessonIds: [2, 10, 14, 19],
    storyIds: [3, 6],
    deliverables: [
      'Story bank (3–5 documented beneficiary stories)',
      '48-hour thank-you sequence (template + send trigger)',
      '30/60/90 donor journey plan (documented)',
      'First impact update sent to all current donors',
      'Quarterly reporting calendar (4 dates per year)',
      'Renewal ask script with timing strategy',
    ],
    metrics: [
      'Cap 2 score before vs. after',
      'Cap 10 score before vs. after',
      'Donor retention rate (% before/after)',
      '% of donors thanked within 48 hours',
      'Impact updates sent per quarter',
      'Stories in story bank (count)',
    ],
    faqs: [
      { q: 'Can this track run alongside Track 3?', a: 'Yes — Track 4 is designed to run in parallel with any outreach-focused track. While Track 3 is bringing in new donors, Track 4 is ensuring the ones you already have stay and give again.' },
      { q: 'What if we have very few donors right now?', a: 'Start the stewardship systems now, even with a small base. The habits and templates you build here become much easier to scale as your donor base grows from Tracks 2 and 3.' },
      { q: 'How do we tell stories ethically about beneficiaries?', a: 'Lesson 14 covers this fully — with a framework for informed consent, dignity-preserving language, and how to tell powerful stories without exploiting the people you serve.' },
    ],
  },
];



/* ══════════════════════════════════════════════════════
   TRACK ASSESSMENT, LEARN & IMPROVE SYSTEM
══════════════════════════════════════════════════════ */

/* Track assessment state */
let _trackAssessState = { trackId: null, qIdx: 0, answers: [], allQuestions: [] };

/* Stores per-track assessment context after completion */
const _trackLearnContext = {};

/* Build composite question set for a track (2 questions per cap, max 10 total) */
function _buildTrackQuestions(track) {
  const qs = [];
  track.capNums.forEach(function(capNum) {
    const capQs = CAP_QUESTIONS[capNum] || [];
    /* Pick first 2 questions from each cap, label them with cap context */
    capQs.slice(0, 2).forEach(function(q) {
      qs.push({ capNum: capNum, q: q.q, opts: q.opts });
    });
  });
  return qs.slice(0, 10); /* max 10 */
}

function startTrackAssess(trackId) {
  const t = IMPROVEMENT_TRACKS.find(x => x.id === trackId);
  if (!t) return;
  const allQuestions = _buildTrackQuestions(t);
  _trackAssessState = { trackId, qIdx: 0, answers: [], allQuestions };
  showTrackAssessStep();
}

function showTrackAssessStep() {
  const { trackId, qIdx, answers, allQuestions } = _trackAssessState;
  const t = IMPROVEMENT_TRACKS.find(x => x.id === trackId);
  if (!t || !allQuestions.length) return;

  if (qIdx >= allQuestions.length) { finishTrackAssess(); return; }

  const q = allQuestions[qIdx];
  const cap = CAP_MODEL.find(c => c.num === q.capNum);
  const pct = Math.round((qIdx / allQuestions.length) * 100);

  const optsHtml = q.opts.map(function(o, i) {
    return `<div onclick="_trackAssessAnswer(${i})" style="padding:11px 16px;background:#fff;border:1.5px solid var(--border);border-radius:10px;cursor:pointer;font-size:13.5px;color:var(--ink);transition:all .15s;margin-bottom:8px"
      onmouseover="this.style.borderColor='${t.colorHex}';this.style.background='${t.colorPale}';this.style.color='var(--ink)'"
      onmouseout="this.style.borderColor='var(--border)';this.style.background='#fff'">${o}</div>`;
  }).join('');

  openModal(t.icon + ' Track Assessment — ' + t.title, `
    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-size:12px;font-weight:700;color:${t.colorHex}">Question ${qIdx + 1} of ${allQuestions.length}</span>
        <span style="font-size:11px;color:var(--ink-muted)">${cap ? 'Cap ' + cap.num + ': ' + cap.title : ''}</span>
      </div>
      <div style="height:5px;background:rgba(0,0,0,.07);border-radius:100px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${t.colorHex};border-radius:100px;transition:width .4s ease"></div>
      </div>
    </div>
    <p style="font-size:15px;font-weight:600;color:var(--ink);line-height:1.5;margin-bottom:16px">${q.q}</p>
    ${optsHtml}
    <div style="margin-top:10px;display:flex;gap:8px">
      ${qIdx > 0 ? `<button onclick="_trackAssessPrev()" style="padding:8px 16px;border:1px solid var(--border);border-radius:8px;background:#fff;color:var(--ink-muted);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">← Previous</button>` : ''}
      <button onclick="closeModal()" style="padding:8px 16px;border:1px solid var(--border);border-radius:8px;background:#fff;color:var(--ink-muted);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;margin-left:auto">Cancel</button>
    </div>`);
}

function _trackAssessAnswer(answerIdx) {
  _trackAssessState.answers[_trackAssessState.qIdx] = answerIdx;
  _trackAssessState.qIdx++;
  showTrackAssessStep();
}

function _trackAssessPrev() {
  if (_trackAssessState.qIdx > 0) {
    _trackAssessState.qIdx--;
    showTrackAssessStep();
  }
}

function finishTrackAssess() {
  const { trackId, answers, allQuestions } = _trackAssessState;
  const t = IMPROVEMENT_TRACKS.find(x => x.id === trackId);
  if (!t) return;

  /* Compute per-cap scores from answers */
  const capAnswers = {};
  allQuestions.forEach(function(q, i) {
    if (!capAnswers[q.capNum]) capAnswers[q.capNum] = [];
    capAnswers[q.capNum].push(answers[i] || 0);
  });

  /* Overall track score (1–5) */
  const raw = answers.reduce((a, b) => a + b, 0);
  const maxRaw = answers.length * 3;
  const trackScore = Math.max(1, Math.round(1 + (raw / maxRaw) * 4));

  /* Store per-cap scores and context */
  t.capNums.forEach(function(capNum) {
    if (capAnswers[capNum] && capAnswers[capNum].length) {
      const cRaw = capAnswers[capNum].reduce((a, b) => a + b, 0);
      const cMax = capAnswers[capNum].length * 3;
      capScores[capNum] = Math.max(1, Math.round(1 + (cRaw / cMax) * 4));
      _capLearnContext[capNum] = { score: capScores[capNum], answers: capAnswers[capNum] };
    }
  });

  _trackLearnContext[trackId] = { score: trackScore, answers: answers.slice(), capAnswers, allQuestions };
  renderImprovementTracks();
  renderCapGrid();
  updateCapDashboard();

  const scoreColor = trackScore <= 2 ? 'var(--rose)' : trackScore === 3 ? 'var(--gold)' : 'var(--emerald)';
  const levelLabel = ['', 'Needs Work', 'Developing', 'Competent', 'Advanced', 'Expert'][trackScore];
  const scoreMsg = trackScore <= 2
    ? 'Your track has significant gaps. Start with the Learn plan — it\'s ordered by your biggest gaps first.'
    : trackScore === 3
    ? 'You\'re developing. The resources below are ordered to close your specific gaps.'
    : 'You\'re strong across this track. Use the resources to maintain and extend your results.';

  /* Per-cap summary */
  const capSummaryHtml = t.capNums.map(function(capNum) {
    const sc = capScores[capNum] || null;
    const cap = CAP_MODEL.find(c => c.num === capNum);
    if (!cap) return '';
    const col = sc ? (sc <= 2 ? '#b83252' : sc === 3 ? '#c96d08' : '#1e6b50') : '#94a3b8';
    const lbl = sc ? (sc <= 2 ? 'Gap' : sc === 3 ? 'Developing' : 'Strong') : 'Not assessed';
    return `<div style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--paper);border-radius:8px">
      <span style="font-size:16px">${cap.icon}</span>
      <span style="flex:1;font-size:13px;font-weight:600;color:var(--ink)">${cap.title}</span>
      <span style="font-size:11px;font-weight:700;color:${col};background:${col}18;padding:2px 8px;border-radius:3px">${lbl}${sc ? ' · ' + sc + '/5' : ''}</span>
    </div>`;
  }).join('');

  openModal(t.icon + ' Track Assessment Complete — ' + t.title, `
    <div style="text-align:center;padding:18px 0 16px">
      <div style="width:76px;height:76px;border-radius:50%;background:${t.colorPale};border:3px solid ${t.colorHex};margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:32px">${t.icon}</div>
      <div style="font-size:44px;font-weight:900;color:${scoreColor};line-height:1">${trackScore}<span style="font-size:20px;color:var(--ink-muted)">/5</span></div>
      <div style="font-size:17px;font-weight:700;color:var(--ink);margin:6px 0 4px">${levelLabel}</div>
      <div style="font-size:13px;color:var(--ink-soft);max-width:340px;margin:0 auto;line-height:1.6">${scoreMsg}</div>
    </div>
    <div style="margin-bottom:14px">
      <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-muted);margin-bottom:8px">Capability scores from this assessment</div>
      <div style="display:flex;flex-direction:column;gap:6px">${capSummaryHtml}</div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn-primary" style="background:${t.colorHex};border-color:${t.colorHex}" onclick="closeModal();navigateTrackLearn(${trackId})">See My Learning Plan</button>
      <button class="btn-outline" style="border-color:${t.colorHex};color:${t.colorHex}" onclick="closeModal();navigateTrackImprove(${trackId})">Improve Plan</button>
      <button class="btn-outline" onclick="closeModal()">Close</button>
    </div>`);
}

function navigateTrackLearn(trackId)   { navigate('track-learn-' + trackId); }
function navigateTrackImprove(trackId) { navigate('track-improve-' + trackId); }

/* ── TRACK LEARN PAGE ── */
function renderTrackLearnPage(trackId) {
  // DEBUG
  var dbg = document.getElementById('tlDebug');
  if(dbg){dbg.style.display='block';dbg.textContent='renderTrackLearnPage called with trackId='+trackId;}
  try {
  const t = IMPROVEMENT_TRACKS.find(x => x.id === trackId);
  if (!t) return;

  const ctx        = _trackLearnContext[trackId] || null;
  const trackScore = ctx ? ctx.score : null;
  const hasScore   = trackScore !== null;
  const scoreTier  = !hasScore ? 'none' : trackScore <= 2 ? 'gap' : trackScore === 3 ? 'developing' : 'strong';
  const levelLabel = hasScore ? ['','Needs Work','Developing','Competent','Advanced','Expert'][trackScore] : '';

  // ── Hero colour ──
  const heroEl = document.getElementById('trackLearnHero');
  if (heroEl) heroEl.style.background = 'linear-gradient(135deg,' + t.colorHex + 'dd 0%,#1c1118 65%)';

  // ── Breadcrumb ──
  const bcEl = document.getElementById('trackLearnBreadcrumb');
  if (bcEl) bcEl.innerHTML =
    '<a onclick="navigate(\'home\')">Home</a><span>›</span>' +
    '<a onclick="navigate(\'improvement-tracks\')">Improvement Tracks</a><span>›</span>' +
    '<a onclick="navigate(\'track-detail-' + trackId + '\')">' + t.title + '</a><span>›</span>' +
    '<span>Learn</span>';

  // ── Hero content (same pattern as renderCapLearnPage) ──
  const hcEl = document.getElementById('trackLearnHeroContent');
  if (hcEl) hcEl.innerHTML =
    '<div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.85);font-size:11px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;padding:5px 14px;border-radius:100px;margin-bottom:16px">' +
      t.icon + ' ' + t.label + ' · ' + t.duration +
    '</div>' +
    '<h1 style="margin-bottom:10px;max-width:660px">Learn: ' + t.title + '</h1>' +
    '<p style="max-width:580px;opacity:.75;margin-bottom:' + (hasScore ? '16px' : '20px') + '">' + t.tagline + '</p>' +
    (hasScore ?
      '<div style="display:inline-flex;align-items:center;gap:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px 16px;margin-bottom:20px">' +
        '<div style="font-size:26px;font-weight:900;color:#fff;line-height:1">' + trackScore + '<span style="font-size:13px;opacity:.5">/5</span></div>' +
        '<div style="width:1px;height:28px;background:rgba(255,255,255,.2)"></div>' +
        '<div><div style="font-size:10.5px;font-weight:700;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px">Track Score</div>' +
        '<div style="font-size:13.5px;font-weight:700;color:#fff">' + levelLabel + '</div></div>' +
      '</div><br>'
    : '') +
    '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
      '<button onclick="navigate(\'improvement-tracks\')" style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">← Back to Tracks</button>' +
      '<button onclick="startTrackAssess(' + trackId + ')" style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">' + (hasScore ? 'Re-Assess' : 'Assess Track') + '</button>' +
      '<button onclick="navigateTrackImprove(' + trackId + ')" style="background:' + t.colorHex + ';border:none;color:#fff;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Improve Plan →</button>' +
    '</div>';

  // ── Body ──
  const body = document.getElementById('trackLearnBody');
  if (!body) return;

  // Data
  const caps    = t.capNums.map(n  => CAP_MODEL.find(c => c.num === n)).filter(Boolean);
  const lessons = t.lessonIds.map(id => LESSONS.find(l => l.id === id)).filter(Boolean);

  // Paths via CAP_LEARN_MAP union
  const pathIdSet = [];
  t.capNums.forEach(n => ((CAP_LEARN_MAP[n]||{}).pathIds||[]).forEach(id => { if (!pathIdSet.includes(id)) pathIdSet.push(id); }));
  const paths = pathIdSet.map(id => PATHS.find(p => p.id === id)).filter(Boolean);

  // Webinars via CAP_LEARN_MAP union
  const webIdSet = [];
  t.capNums.forEach(n => ((CAP_LEARN_MAP[n]||{}).webinarIds||[]).forEach(id => { if (!webIdSet.includes(id)) webIdSet.push(id); }));
  const webs = webIdSet.map(id => WEBINARS.find(w => w.id === id)).filter(Boolean);

  // Sort gap-first if assessed
  if (hasScore) {
    const gapN = t.capNums.filter(n => (capScores[n]||5) <= 2);
    const gP=[]; gapN.forEach(n => ((CAP_LEARN_MAP[n]||{}).pathIds||[]).forEach(id => { if(!gP.includes(id)) gP.push(id); }));
    const gW=[]; gapN.forEach(n => ((CAP_LEARN_MAP[n]||{}).webinarIds||[]).forEach(id => { if(!gW.includes(id)) gW.push(id); }));
    paths.sort((a,b) => (gP.includes(a.id)?0:1)-(gP.includes(b.id)?0:1));
    webs.sort((a,b)  => (gW.includes(a.id)?0:1)-(gW.includes(b.id)?0:1));
    lessons.sort((a,b) => (capScores[a.id]||3)-(capScores[b.id]||3));
  }

  const pCol = {1:'#1e6b50',2:'#c4872a',3:'#2a6b9b',4:'#c05050',5:'#1e6b50',6:'#c4872a',7:'#2a6b9b',8:'#c05050'};

  function sh(lbl) {
    return '<div style="display:flex;align-items:center;gap:12px;margin:32px 0 16px"><span style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.09em;color:var(--ink);white-space:nowrap">' + lbl + '</span><div style="flex:1;height:1px;background:var(--border)"></div></div>';
  }

  let h = '';

  // ── Score/CTA banner ──
  if (hasScore) {
    const bc={gap:'#b83252',developing:'#c96d08',strong:'#1e6b50'}[scoreTier]||'#64748b';
    const bp={gap:'rgba(184,50,82,.07)',developing:'rgba(201,109,8,.07)',strong:'rgba(30,107,80,.07)'}[scoreTier]||'rgba(100,116,139,.05)';
    const bb={gap:'rgba(184,50,82,.2)',developing:'rgba(201,109,8,.2)',strong:'rgba(30,107,80,.2)'}[scoreTier]||'rgba(100,116,139,.12)';
    const msg={gap:'Gaps detected. Content below is ordered — start with highlighted items.',developing:'Developing. Resources ordered to close your remaining gaps.',strong:'Strong. Use these to maintain and extend your skills.'}[scoreTier];
    h += '<div style="background:'+bp+';border:1px solid '+bb+';border-radius:12px;padding:16px 20px;margin-bottom:24px;display:flex;gap:14px;align-items:center;flex-wrap:wrap">';
    h += '<div style="width:44px;height:44px;border-radius:50%;background:'+bc+';color:#fff;font-size:18px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0">'+trackScore+'</div>';
    h += '<div style="flex:1;min-width:150px"><div style="font-size:13.5px;font-weight:800;color:var(--ink);margin-bottom:2px">Your learning plan · '+levelLabel+'</div><div style="font-size:12.5px;color:var(--ink-muted)">'+msg+'</div></div>';
    h += '<button onclick="startTrackAssess('+trackId+')" style="background:#fff;border:1px solid '+bb+';color:'+bc+';border-radius:7px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">Re-Assess</button></div>';
  } else {
    h += '<div style="border-left:4px solid '+t.colorHex+';background:#fff;border:1px solid var(--border);border-left:4px solid '+t.colorHex+';border-radius:10px;padding:18px 22px;margin-bottom:28px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">';
    h += '<div style="flex:1;min-width:180px"><div style="font-size:14px;font-weight:800;color:var(--ink);margin-bottom:3px">Get a personalised learning plan</div>';
    h += '<div style="font-size:13px;color:var(--ink-muted)">Assess this track to see exactly which lessons, paths and webinars match your gaps.</div></div>';
    h += '<button onclick="startTrackAssess('+trackId+')" style="background:'+t.colorHex+';color:#fff;border:none;border-radius:8px;padding:10px 20px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">Assess Track</button></div>';
  }

  // ── Capabilities ──
  h += sh('Capabilities in this track — ' + caps.length);
  h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px">';
  caps.forEach(cap => {
    const sc   = capScores[cap.num]||null;
    const cHex = sc?(sc<=2?'#b83252':sc===3?'#c96d08':'#1e6b50'):'#94a3b8';
    const cLbl = sc?(sc<=2?'Gap':sc===3?'Developing':'Strong'):'Not assessed';
    h += '<div style="background:#fff;border:1px solid var(--border);border-radius:10px;padding:13px 15px;display:flex;align-items:center;gap:10px">';
    h += '<div style="width:36px;height:36px;border-radius:8px;background:'+cap.colorPale+';display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">'+cap.icon+'</div>';
    h += '<div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:700;color:var(--ink)">Cap '+cap.num+': '+cap.title+'</div>';
    h += '<div style="font-size:11px;color:'+cHex+';font-weight:600;margin-top:1px">'+cLbl+(sc?' · '+sc+'/5':'')+'</div></div>';
    h += '<button onclick="learnCapability('+cap.num+')" style="font-size:11px;font-weight:700;padding:5px 10px;border-radius:6px;border:1.5px solid '+t.colorHex+';color:'+t.colorHex+';background:#fff;cursor:pointer;font-family:inherit;white-space:nowrap">Learn</button>';
    h += '</div>';
  });
  h += '</div>';

  // ── Micro Lessons ──
  if (lessons.length) {
    h += sh('Micro Lessons — ' + lessons.length + ' in this track');
    h += '<div style="display:flex;flex-direction:column;gap:10px">';
    lessons.forEach(lesson => {
      const cap   = CAP_MODEL.find(c => c.num === lesson.id);
      const sc    = cap?(capScores[cap.num]||null):null;
      const isGap = hasScore && sc && sc <= 2;
      const isDev = hasScore && sc && sc === 3;
      const bdr   = isGap?'2px solid #b83252':isDev?'1.5px solid #c96d08':'1px solid var(--border)';
      const pct   = _topicPct(lesson.id);
      const done  = _prog.doneTopics.has(lesson.id);
      const btn   = done?'Review':pct>0?'Continue':'Start';
      h += '<div style="background:#fff;border:'+bdr+';border-radius:11px;overflow:hidden">';
      if (isGap) h += '<div style="background:#b83252;color:#fff;font-size:10px;font-weight:800;padding:3px 14px;text-align:center;letter-spacing:.05em">START HERE · BIGGEST GAP</div>';
      else if (isDev) h += '<div style="background:#c96d08;color:#fff;font-size:10px;font-weight:800;padding:3px 14px;text-align:center;letter-spacing:.05em">FOCUS ON THIS</div>';
      h += '<div style="padding:15px 17px;display:flex;gap:12px;align-items:flex-start;cursor:pointer" onclick="openLessonPlayer('+lesson.id+',0)">';
      h += '<div style="width:40px;height:40px;border-radius:9px;background:'+t.colorPale+';display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">'+(cap?cap.icon:t.icon)+'</div>';
      h += '<div style="flex:1"><div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:'+t.colorHex+';margin-bottom:2px">'+lesson.cat+' · '+lesson.duration+'</div>';
      h += '<div style="font-size:14px;font-weight:800;color:var(--ink);margin-bottom:3px;line-height:1.3">'+lesson.title+'</div>';
      h += '<div style="font-size:12.5px;color:var(--ink-muted);line-height:1.45">'+lesson.desc+'</div></div>';
      h += '<button onclick="event.stopPropagation();openLessonPlayer('+lesson.id+',0)" style="background:'+t.colorHex+';color:#fff;border:none;border-radius:7px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;flex-shrink:0;white-space:nowrap">'+btn+'</button>';
      h += '</div>';
      if (pct>0) h += '<div style="height:3px;background:var(--border)"><div style="height:100%;width:'+pct+'%;background:'+t.colorHex+'"></div></div>';
      h += '</div>';
    });
    h += '</div>';
  }

  // ── Learning Paths ──
  if (paths.length) {
    h += sh('Learning Paths');
    h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">';
    paths.forEach((p, pi) => {
      const pc  = pCol[p.id]||t.colorHex;
      const pri = hasScore && pi===0 && scoreTier!=='strong';
      const pd  = PATH_DETAILS?PATH_DETAILS[p.id]:null;
      h += '<div onclick="startLearningPath('+p.id+')" style="background:#fff;border:'+(pri?'2px solid '+pc:'1.5px solid var(--border)')+';border-radius:12px;overflow:hidden;cursor:pointer;transition:box-shadow .2s;display:flex;flex-direction:column" onmouseenter="this.style.boxShadow=\'0 4px 20px rgba(0,0,0,.1)\';this.style.borderColor=\''+pc+'\'" onmouseleave="this.style.boxShadow=\'\';this.style.borderColor=\'\'">';
      if (pri) h += '<div style="background:'+pc+';color:#fff;font-size:10px;font-weight:800;padding:3px 14px;text-align:center;letter-spacing:.04em">RECOMMENDED START</div>';
      h += '<div style="padding:18px 20px;flex:1;display:flex;flex-direction:column">';
      h += '<span style="background:'+p.tagColor+';color:'+p.tagText+';font-size:10px;font-weight:700;padding:3px 9px;border-radius:100px;display:inline-block;margin-bottom:10px">'+p.tag+'</span>';
      h += '<div style="font-size:15px;font-weight:800;color:var(--ink);margin-bottom:6px;line-height:1.3">'+p.title+'</div>';
      h += '<div style="font-size:13px;color:var(--ink-muted);line-height:1.55;flex:1;margin-bottom:12px">'+p.desc+'</div>';
      h += '<div style="font-size:11.5px;color:var(--ink-muted);margin-bottom:14px">'+p.lessons+' lessons · '+p.templates+' templates'+(pd?' · '+pd.time:'')+'</div>';
      h += '<button onclick="event.stopPropagation();startLearningPath('+p.id+')" style="background:'+pc+';color:#fff;border:none;border-radius:7px;padding:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;width:100%">Start Path</button>';
      h += '</div></div>';
    });
    h += '</div>';
  }

  // ── Webinars ──
  if (webs.length) {
    h += sh('Webinars');
    h += '<div style="display:flex;flex-direction:column;gap:12px">';
    webs.forEach((w, wi) => {
      const isUp = w.status==='upcoming';
      const pri  = hasScore && wi===0;
      h += '<div style="background:#fff;border:'+(pri?'2px solid '+t.colorHex:'1.5px solid var(--border)')+';border-radius:11px;padding:18px 20px;display:flex;gap:13px;align-items:flex-start">';
      h += '<div style="width:42px;height:42px;border-radius:9px;background:'+t.colorPale+';display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">'+t.icon+'</div>';
      h += '<div style="flex:1"><div style="display:flex;gap:8px;align-items:center;margin-bottom:5px;flex-wrap:wrap">';
      h += '<span style="font-size:10.5px;font-weight:700;color:'+t.colorHex+';text-transform:uppercase;letter-spacing:.06em">Webinar '+w.num+'</span>';
      h += '<span style="font-size:10.5px;font-weight:600;padding:2px 8px;border-radius:4px;background:'+(isUp?'rgba(201,109,8,.1)':'rgba(30,107,80,.1)')+';color:'+(isUp?'#c96d08':'#1e6b50')+'">'+(isUp?'Upcoming':'On-Demand')+'</span>';
      if (pri) h += '<span style="font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:4px;background:'+t.colorPale+';color:'+t.colorHex+'">For You</span>';
      h += '</div>';
      h += '<div style="font-size:14px;font-weight:800;color:var(--ink);margin-bottom:4px;line-height:1.3">'+w.title+'</div>';
      h += '<div style="font-size:12.5px;color:var(--ink-muted);line-height:1.5;margin-bottom:10px">'+w.desc+'</div>';
      h += '<button onclick="navigate(\'webinars\')" style="background:'+t.colorHex+';color:#fff;border:none;border-radius:7px;padding:8px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">'+(isUp?'Register':'Watch Now')+'</button>';
      h += '</div></div>';
    });
    h += '</div>';
  }

  // ── Bottom nav ──
  h += '<div style="margin-top:44px;padding-top:24px;border-top:1px solid var(--border);display:flex;gap:10px;flex-wrap:wrap;align-items:center">' +
    '<button onclick="navigate(\'improvement-tracks\')" style="background:#fff;border:1px solid var(--border);color:var(--ink-muted);border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">← Back to Tracks</button>' +
    '<button onclick="startTrackAssess('+trackId+')" style="background:#fff;border:1.5px solid '+t.colorHex+';color:'+t.colorHex+';border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">'+(hasScore?'Re-Assess':'Assess Track')+'</button>' +
    '<button onclick="navigateTrackImprove('+trackId+')" style="background:'+t.colorHex+';color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Improve Plan →</button>' +
    '<button onclick="navigate(\'track-detail-'+trackId+'\')" style="background:#fff;border:1px solid var(--border);color:var(--ink-muted);border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;margin-left:auto">Track Details →</button>' +
  '</div>';

  body.innerHTML = h;

  const ft = document.getElementById('trackLearnFooter');
  if (ft && !ft.dataset.rendered) { ft.innerHTML = renderFooter(); ft.dataset.rendered = '1'; }
  if(dbg) dbg.style.display='none';
  } catch(e) {
    console.error('CRASH renderTrackLearnPage:',e);
    var dbg2=document.getElementById('tlDebug');
    if(dbg2){dbg2.style.display='block';dbg2.textContent='ERROR: '+e.message+'\n'+e.stack;}
    var b=document.getElementById('trackLearnBody');
    if(b)b.innerHTML='<div style="padding:30px;background:#fff;border-radius:12px;border:2px solid #b83252;color:#b83252;font-size:13px;font-family:monospace"><b>JS ERROR:</b><br>'+e.message+'<br><pre>'+e.stack+'</pre></div>';
  }
}

/* ══════════════════════════════════════════════════════
   TRACK IMPROVE PAGE
   Content: Steps · Tools · Workbooks · Videos · Stories
   (Different from Learn page which has: Lessons · Paths · Webinars)
══════════════════════════════════════════════════════ */
function renderTrackImprovePage(trackId) {
  const t = IMPROVEMENT_TRACKS.find(x => x.id === trackId);
  if (!t) return;

  const ctx        = _trackLearnContext[trackId] || null;
  const trackScore = ctx ? ctx.score : null;
  const hasScore   = trackScore !== null;
  const scoreTier  = !hasScore ? 'none' : trackScore <= 2 ? 'gap' : trackScore === 3 ? 'developing' : 'strong';
  const levelLabel = hasScore ? ['','Needs Work','Developing','Competent','Advanced','Expert'][trackScore] : '';

  const content = document.getElementById('trackImproveContent');
  if (!content) return;

  // Data
  const caps    = t.capNums.map(n  => CAP_MODEL.find(c => c.num === n)).filter(Boolean);
  const tools   = (t.toolIds||[]).map(id => TOOLS.find(x => x.id === id)).filter(Boolean);
  const wbs     = (t.wbIds||[]).map(id   => WORKBOOKS.find(x => x.id === id)).filter(Boolean);
  const stories = (t.storyIds||[]).map(id => STORIES.find(x => x.id === id)).filter(Boolean);
  const vidIds  = []; t.capNums.forEach(n => ((CAP_IMPROVE_MAP[n]||{}).videoIds||[]).forEach(id => { if(!vidIds.includes(id)) vidIds.push(id); }));
  const videos  = vidIds.slice(0,6).map(id => VIDEO_GUIDES.find(x => x.id === id)).filter(Boolean);

  // Sort gap-first if assessed
  const gapNums = hasScore ? t.capNums.filter(n => (capScores[n]||5)<=2) : [];
  if (hasScore && gapNums.length) {
    const gT=[]; gapNums.forEach(n=>((CAP_IMPROVE_MAP[n]||{}).toolIds||[]).forEach(id=>{if(!gT.includes(id))gT.push(id);}));
    const gW=[]; gapNums.forEach(n=>((CAP_IMPROVE_MAP[n]||{}).wbIds||[]).forEach(id=>{if(!gW.includes(id))gW.push(id);}));
    const gV=[]; gapNums.forEach(n=>((CAP_IMPROVE_MAP[n]||{}).videoIds||[]).forEach(id=>{if(!gV.includes(id))gV.push(id);}));
    tools.sort((a,b)  => (gT.includes(a.id)?0:1)-(gT.includes(b.id)?0:1));
    wbs.sort((a,b)    => (gW.includes(a.id)?0:1)-(gW.includes(b.id)?0:1));
    videos.sort((a,b) => (gV.includes(a.id)?0:1)-(gV.includes(b.id)?0:1));
  }

  function sh(lbl) {
    return '<div style="display:flex;align-items:center;gap:12px;margin:32px 0 16px"><span style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.09em;color:var(--ink);white-space:nowrap">'+lbl+'</span><div style="flex:1;height:1px;background:var(--border)"></div></div>';
  }

  let html = '';

  // ── HERO ──
  html += '<div class="page-hero" style="background:linear-gradient(135deg,'+t.colorHex+'dd 0%,#1c1118 65%)">';
  html += '<div class="page-hero-inner">';
  html += '<div class="breadcrumb">' +
    '<a onclick="navigate(\'home\')">Home</a><span>›</span>' +
    '<a onclick="navigate(\'improvement-tracks\')">Improvement Tracks</a><span>›</span>' +
    '<a onclick="navigate(\'track-detail-'+trackId+'\')">'+t.title+'</a><span>›</span>' +
    '<span>Improve</span></div>';
  html += '<div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.85);font-size:11px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;padding:5px 14px;border-radius:100px;margin-bottom:16px">'+t.icon+' '+t.label+' · '+t.duration+'</div>';
  html += '<h1 style="margin-bottom:10px;max-width:660px">Improve: '+t.title+'</h1>';
  html += '<p style="max-width:580px;opacity:.75;margin-bottom:'+(hasScore?'16px':'20px')+'">'+t.tagline+'</p>';
  if (hasScore) {
    html += '<div style="display:inline-flex;align-items:center;gap:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px 16px;margin-bottom:20px"><div style="font-size:26px;font-weight:900;color:#fff;line-height:1">'+trackScore+'<span style="font-size:13px;opacity:.5">/5</span></div><div style="width:1px;height:28px;background:rgba(255,255,255,.2)"></div><div><div style="font-size:10.5px;font-weight:700;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px">Track Score</div><div style="font-size:13.5px;font-weight:700;color:#fff">'+levelLabel+'</div></div></div><br>';
  }
  html += '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
    '<button onclick="navigate(\'improvement-tracks\')" style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">← Back to Tracks</button>' +
    '<button onclick="startTrackAssess('+trackId+')" style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">'+(hasScore?'Re-Assess':'Assess Track')+'</button>' +
    '<button onclick="navigateTrackLearn('+trackId+')" style="background:'+t.colorHex+';border:none;color:#fff;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Learn Plan →</button>' +
  '</div>';
  html += '</div></div>';

  html += '<section class="content-section" style="background:var(--paper);padding:36px 0 60px"><div class="container">';

  // ── Score/CTA banner ──
  if (hasScore) {
    const bc={gap:'#b83252',developing:'#c96d08',strong:'#1e6b50'}[scoreTier]||'#64748b';
    const bp={gap:'rgba(184,50,82,.07)',developing:'rgba(201,109,8,.07)',strong:'rgba(30,107,80,.07)'}[scoreTier]||'rgba(100,116,139,.05)';
    const bb={gap:'rgba(184,50,82,.2)',developing:'rgba(201,109,8,.2)',strong:'rgba(30,107,80,.2)'}[scoreTier]||'rgba(100,116,139,.12)';
    const msg={gap:'Significant gaps. Resources are ordered — start with highlighted items first.',developing:'Developing. Resources ordered to close your remaining gaps.',strong:'Strong. Use these to push further.'}[scoreTier];
    html += '<div style="background:'+bp+';border:1px solid '+bb+';border-radius:12px;padding:16px 20px;margin-bottom:24px;display:flex;gap:14px;align-items:center;flex-wrap:wrap">';
    html += '<div style="width:44px;height:44px;border-radius:50%;background:'+bc+';color:#fff;font-size:18px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0">'+trackScore+'</div>';
    html += '<div style="flex:1;min-width:150px"><div style="font-size:13.5px;font-weight:800;color:var(--ink);margin-bottom:2px">Personalised improvement plan · '+levelLabel+'</div><div style="font-size:12.5px;color:var(--ink-muted)">'+msg+'</div></div>';
    html += '<button onclick="startTrackAssess('+trackId+')" style="background:#fff;border:1px solid '+bb+';color:'+bc+';border-radius:7px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">Re-Assess</button></div>';
  } else {
    html += '<div style="border-left:4px solid '+t.colorHex+';background:#fff;border:1px solid var(--border);border-left:4px solid '+t.colorHex+';border-radius:10px;padding:18px 22px;margin-bottom:28px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">';
    html += '<div style="flex:1;min-width:180px"><div style="font-size:14px;font-weight:800;color:var(--ink);margin-bottom:3px">Get a personalised improvement plan</div>';
    html += '<div style="font-size:13px;color:var(--ink-muted)">Assess this track to see which tools, workbooks and videos are most critical for your gaps.</div></div>';
    html += '<button onclick="startTrackAssess('+trackId+')" style="background:'+t.colorHex+';color:#fff;border:none;border-radius:8px;padding:10px 20px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">Assess Track</button></div>';
  }

  // ── Capabilities (sorted weakest first if assessed) ──
  const sortedCaps = hasScore ? caps.slice().sort((a,b)=>(capScores[a.num]||5)-(capScores[b.num]||5)) : caps;
  html += sh('Capabilities in this track — ' + caps.length);
  html += '<div style="display:flex;flex-direction:column;gap:8px">';
  sortedCaps.forEach(cap => {
    const sc    = capScores[cap.num]||null;
    const cHex  = sc?(sc<=2?'#b83252':sc===3?'#c96d08':'#1e6b50'):'#94a3b8';
    const cPale = sc?(sc<=2?'rgba(184,50,82,.06)':sc===3?'rgba(201,109,8,.06)':'rgba(30,107,80,.06)'):'var(--paper)';
    const cBdr  = sc?(sc<=2?'rgba(184,50,82,.2)':sc===3?'rgba(201,109,8,.2)':'rgba(30,107,80,.2)'):'var(--border)';
    const cLbl  = sc?(sc<=2?'Gap':sc===3?'Developing':'Strong'):'Not assessed';
    const badge = sc?(sc<=2?'FOCUS':sc===3?'SHARPEN':'STRONG'):'';
    html += '<div style="background:'+cPale+';border:1px solid '+cBdr+';border-radius:10px;padding:13px 15px;display:flex;align-items:center;gap:10px">';
    html += '<div style="width:36px;height:36px;border-radius:8px;background:'+cap.colorPale+';display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">'+cap.icon+'</div>';
    html += '<div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:700;color:var(--ink)">Cap '+cap.num+': '+cap.title+'</div>';
    html += '<div style="font-size:11px;color:'+cHex+';font-weight:600;margin-top:1px">'+cLbl+(sc?' · '+sc+'/5':'')+'</div></div>';
    if (badge) html += '<span style="font-size:9.5px;font-weight:800;background:'+cHex+';color:#fff;padding:2px 7px;border-radius:3px;letter-spacing:.04em">'+badge+'</span>';
    html += '<button onclick="goToImprove('+cap.num+')" style="font-size:11px;font-weight:700;padding:5px 11px;border-radius:6px;border:1.5px solid '+t.colorHex+';color:'+t.colorHex+';background:#fff;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0">Improve</button>';
    html += '</div>';
  });
  html += '</div>';

  // ── Track Steps ──
  if (t.steps && t.steps.length) {
    const stps = t.steps.slice(0, hasScore&&scoreTier==='gap'?6:4);
    html += sh(stps.length + '-Step Track Plan');
    html += '<div style="display:flex;flex-direction:column;gap:8px">';
    stps.forEach((step, i) => {
      const first = i===0;
      html += '<div style="background:'+(first?'rgba(0,0,0,.03)':'#fff')+';border:1px solid '+(first?t.colorHex+'55':'var(--border)')+';border-radius:10px;padding:14px 16px;display:flex;gap:12px;align-items:flex-start">';
      html += '<div style="width:28px;height:28px;border-radius:50%;background:'+(first?t.colorHex:t.colorPale)+';color:'+(first?'#fff':t.colorHex)+';font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">'+(i+1)+'</div>';
      html += '<div style="flex:1"><div style="font-size:13.5px;font-weight:700;color:var(--ink);margin-bottom:3px">'+step.title+'</div>';
      html += '<div style="font-size:12.5px;color:var(--ink-muted);line-height:1.5">'+step.desc+'</div></div>';
      if (first) html += '<span style="font-size:9.5px;font-weight:800;background:'+t.colorHex+';color:#fff;padding:2px 8px;border-radius:3px;white-space:nowrap;letter-spacing:.04em;flex-shrink:0">DO FIRST</span>';
      html += '</div>';
    });
    html += '</div>';
  }

  // ── Tools ──
  if (tools.length) {
    html += sh('Tools & Templates');
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px">';
    tools.forEach((tool, i) => {
      const top = hasScore && gapNums.length>0 && i===0;
      const cc={planning:'var(--emerald)',messaging:'var(--gold)',pipeline:'var(--sky)',grants:'var(--rose)',digital:'#7c3aed'}[tool.category]||t.colorHex;
      const cb={planning:'var(--emerald-pale)',messaging:'var(--gold-pale)',pipeline:'var(--sky-pale)',grants:'var(--rose-pale)',digital:'#f5f3ff'}[tool.category]||t.colorPale;
      html += '<div onclick="showToolPreview('+tool.id+')" style="background:#fff;border:'+(top?'2px solid '+cc:'1px solid var(--border)')+';border-radius:12px;'+(top?'':'padding:17px;')+'overflow:hidden;cursor:pointer;transition:box-shadow .2s" onmouseenter="this.style.boxShadow=\'0 4px 18px rgba(0,0,0,.1)\';this.style.borderColor=\''+cc+'\'" onmouseleave="this.style.boxShadow=\'\';this.style.border=\'\'">';
      if (top) html += '<div style="background:'+cc+';color:#fff;font-size:10px;font-weight:800;padding:3px 14px;text-align:center;letter-spacing:.04em">START WITH THIS</div>';
      html += '<div style="padding:'+(top?'13px 17px 17px':'0')+';display:flex;gap:11px;align-items:flex-start">';
      html += '<div style="width:36px;height:36px;border-radius:8px;background:'+cb+';display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">'+tool.icon+'</div>';
      html += '<div style="flex:1"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:'+cc+';margin-bottom:3px">'+tool.category+'</div>';
      html += '<div style="font-size:13px;font-weight:700;color:var(--ink);margin-bottom:3px;line-height:1.3">'+tool.title+'</div>';
      html += '<div style="font-size:12px;color:var(--ink-muted);margin-bottom:7px;line-height:1.4">'+tool.desc+'</div>';
      html += '<span style="font-size:12px;font-weight:600;color:'+cc+'">Get Template →</span></div></div></div>';
    });
    html += '</div>';
  }

  // ── Workbooks ──
  if (wbs.length) {
    html += sh('Workbooks');
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px">';
    wbs.forEach((wb, i) => {
      const top = hasScore && gapNums.length>0 && i===0;
      const wc = WB_COLORS[wb.category]||t.colorHex;
      const wp = WB_COLOR_PALES[wb.category]||t.colorPale;
      const wl = WB_LABELS[wb.category]||wb.category;
      html += '<div onclick="openWorkbookModal('+wb.id+')" style="background:#fff;border:'+(top?'2px solid '+wc:'1px solid var(--border)')+';border-radius:12px;'+(top?'':'padding:17px;')+'overflow:hidden;cursor:pointer;transition:box-shadow .2s" onmouseenter="this.style.boxShadow=\'0 4px 18px rgba(0,0,0,.1)\';this.style.borderColor=\''+wc+'\'" onmouseleave="this.style.boxShadow=\'\';this.style.border=\'\'">';
      if (top) html += '<div style="background:'+wc+';color:#fff;font-size:10px;font-weight:800;padding:3px 14px;text-align:center;letter-spacing:.04em">RECOMMENDED</div>';
      html += '<div style="padding:'+(top?'13px 17px 17px':'0')+';display:flex;gap:11px;align-items:flex-start">';
      html += '<div style="width:36px;height:36px;border-radius:8px;background:'+wp+';display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">📓</div>';
      html += '<div style="flex:1"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:'+wc+';margin-bottom:3px">'+wl+'</div>';
      html += '<div style="font-size:13px;font-weight:700;color:var(--ink);margin-bottom:3px;line-height:1.3">'+wb.title+'</div>';
      html += '<div style="font-size:12px;color:var(--ink-muted);margin-bottom:7px">'+wb.exercises+' exercises · ~'+wb.minutes+' min</div>';
      html += '<span style="font-size:12px;font-weight:600;color:'+wc+'">Open Workbook →</span></div></div></div>';
    });
    html += '</div>';
  }

  // ── Videos ──
  if (videos.length) {
    html += sh('Video Guides');
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px">';
    videos.forEach((v, i) => {
      const top = hasScore && gapNums.length>0 && i===0;
      const vc = VG_COLORS[v.category]||t.colorHex;
      const vl = VG_LABELS[v.category]||v.category;
      html += '<div onclick="openVideoModal('+v.id+')" style="background:#fff;border:'+(top?'2px solid '+vc:'1px solid var(--border)')+';border-radius:12px;overflow:hidden;cursor:pointer;transition:box-shadow .2s" onmouseenter="this.style.boxShadow=\'0 4px 18px rgba(0,0,0,.1)\';this.style.borderColor=\''+vc+'\'" onmouseleave="this.style.boxShadow=\'\';this.style.border=\'\'">';
      if (top) html += '<div style="background:'+vc+';color:#fff;font-size:10px;font-weight:800;padding:3px 14px;text-align:center;letter-spacing:.04em">WATCH FIRST</div>';
      html += '<div style="background:var(--ink);aspect-ratio:16/9;position:relative;overflow:hidden">';
      html += '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 60% 40%,'+v.gradient+',transparent 65%)"></div>';
      html += '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><div style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.15);border:2px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center"><svg width="13" height="13" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg></div></div>';
      html += '<div style="position:absolute;bottom:6px;right:7px;background:rgba(0,0,0,.6);color:#fff;font-size:10px;font-weight:600;padding:2px 5px;border-radius:3px">'+v.duration+'</div>';
      html += '<div style="position:absolute;top:6px;left:7px;background:'+vc+';color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;text-transform:uppercase">'+vl+'</div></div>';
      html += '<div style="padding:12px"><div style="font-size:13px;font-weight:700;color:var(--ink);margin-bottom:4px;line-height:1.3">'+v.title+'</div>';
      html += '<span style="font-size:12px;font-weight:600;color:'+vc+'">Watch →</span></div></div>';
    });
    html += '</div>';
  }

  // ── Stories ──
  if (stories.length) {
    html += sh('Success Stories');
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px">';
    stories.forEach(s => {
      html += '<div class="story-card" onclick="showStoryModal('+s.id+')">' +
        '<div class="sc-top"><span class="sc-tag" style="background:'+s.tagBg+';color:'+s.tagColor+'">'+s.tag+'</span>' +
        '<h3>'+s.title+'</h3><p>'+s.desc+'</p></div>' +
        '<div class="sc-bottom"><div class="sc-stat"><strong>'+s.stat+'</strong><span>'+s.statLabel+'</span></div>' +
        '<span style="font-size:13px;font-weight:600;color:var(--emerald)">Read story →</span></div></div>';
    });
    html += '</div>';
  }

  // ── Bottom nav ──
  html +=
    '<div style="margin-top:44px;padding-top:24px;border-top:1px solid var(--border);display:flex;gap:10px;flex-wrap:wrap;align-items:center">' +
    '<button onclick="navigate(\'improvement-tracks\')" style="background:#fff;border:1px solid var(--border);color:var(--ink-muted);border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">← Back to Tracks</button>' +
    '<button onclick="startTrackAssess('+trackId+')" style="background:#fff;border:1.5px solid '+t.colorHex+';color:'+t.colorHex+';border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">'+(hasScore?'Re-Assess':'Assess Track')+'</button>' +
    '<button onclick="navigateTrackLearn('+trackId+')" style="background:'+t.colorHex+';color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Learn Plan →</button>' +
    '<button onclick="navigate(\'track-detail-'+trackId+'\')" style="background:#fff;border:1px solid var(--border);color:var(--ink-muted);border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;margin-left:auto">Track Details →</button>' +
    '</div>';

  html += '</div></section>';
  content.innerHTML = html;

  const ft = document.getElementById('trackImproveFooter');
  if (ft && !ft.dataset.rendered) { ft.innerHTML = renderFooter(); ft.dataset.rendered = '1'; }
}


function renderImprovementTracks() {
  const grid = document.getElementById('itTracksGrid');
  if (!grid) return;

  grid.innerHTML = IMPROVEMENT_TRACKS.map(t => {
    const caps = t.capNums.map(n => CAP_MODEL.find(c => c.num === n)).filter(Boolean);
    const avgScore = caps.length
      ? (caps.reduce((s, c) => s + (capScores[c.num] || 0), 0) / caps.length).toFixed(1)
      : null;
    const scoreColor = !avgScore || avgScore == 0 ? 'var(--ink-muted)' : avgScore < 2.5 ? 'var(--rose)' : avgScore < 3.5 ? 'var(--gold)' : 'var(--emerald)';
    const progressPct = avgScore ? Math.round((avgScore / 5) * 100) : 0;

    return `<div onclick="openTrackDetail(${t.id})" style="background:#fff;border:2px solid var(--border);border-radius:16px;overflow:hidden;cursor:pointer;transition:all .25s;display:flex;flex-direction:column"
        onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--shadow-md)';this.style.borderColor='${t.colorHex}'"
        onmouseout="this.style.transform='';this.style.boxShadow='none';this.style.borderColor='var(--border)'">
      <div style="height:5px;background:${t.color}"></div>
      <div style="padding:22px 22px 16px;flex:1">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:12px">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:46px;height:46px;border-radius:12px;background:${t.colorPale};display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">${t.icon}</div>
            <div>
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:${t.color};margin-bottom:2px">${t.label}</div>
              <h3 style="font-size:16px;font-weight:800;color:var(--ink);margin:0;line-height:1.2">${t.title}</h3>
            </div>
          </div>
          ${''/* no active indicator - cards always show open arrow */}
        </div>
        <p style="font-size:13px;color:var(--ink-muted);line-height:1.55;margin:0 0 14px">${t.tagline}</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
          <span style="font-size:11px;font-weight:600;background:${t.colorPale};color:${t.color};padding:3px 9px;border-radius:100px">⏱ ${t.duration}</span>
          <span style="font-size:11px;font-weight:600;background:var(--paper);color:var(--ink-muted);padding:3px 9px;border-radius:100px">${t.capNums.length} capabilities</span>
          <span style="font-size:11px;font-weight:600;background:var(--paper);color:var(--ink-muted);padding:3px 9px;border-radius:100px">${t.steps.length} steps</span>
        </div>
        ${progressPct > 0 ? `
          <div style="margin-bottom:4px">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:11px;font-weight:600;color:${scoreColor}">Avg capability score: ${avgScore}/5</span>
              <span style="font-size:10px;color:var(--ink-muted)">${progressPct}%</span>
            </div>
            <div style="height:5px;background:rgba(0,0,0,.06);border-radius:100px;overflow:hidden">
              <div style="height:100%;width:${progressPct}%;background:${t.color};border-radius:100px"></div>
            </div>
          </div>` : `<div style="font-size:11.5px;color:var(--ink-muted);font-style:italic">Assess capabilities to see your score</div>`}
      </div>
      <div style="padding:14px 22px;border-top:1px solid var(--border);background:var(--paper);display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <button onclick="event.stopPropagation();startTrackAssess(${t.id})"
          style="flex:1;min-width:68px;padding:8px 8px;border-radius:8px;background:#fff;border:1.5px solid ${t.colorHex};color:${t.colorHex};font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .15s"
          onmouseover="this.style.background='${t.colorPale}'" onmouseout="this.style.background='#fff'">${_trackLearnContext[t.id] ? 'Re-Assess' : 'Assess'}</button>
        <button onclick="event.stopPropagation();navigateTrackLearn(${t.id})"
          style="flex:1;min-width:68px;padding:8px 8px;border-radius:8px;background:#fff;border:1.5px solid var(--border);color:var(--ink-soft);font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .15s"
          onmouseover="this.style.borderColor='var(--sky)';this.style.color='var(--sky)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--ink-soft)'">Learn</button>
        <button onclick="event.stopPropagation();navigateTrackImprove(${t.id})"
          style="flex:1;min-width:68px;padding:8px 8px;border-radius:8px;background:#fff;border:1.5px solid var(--border);color:var(--ink-soft);font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .15s"
          onmouseover="this.style.borderColor='${t.colorHex}';this.style.color='${t.colorHex}'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--ink-soft)'">Improve</button>
        <button onclick="event.stopPropagation();openTrackDetail(${t.id})"
          style="flex:1;min-width:68px;padding:8px 8px;border-radius:8px;background:${t.colorHex};border:none;color:#fff;font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:opacity .15s"
          onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">Learn More</button>
      </div>
    </div>`;
  }).join('');

  const footer = document.getElementById('improvementTracksFooter');
  if (footer && !footer.dataset.rendered) { footer.innerHTML = renderFooter(); footer.dataset.rendered = '1'; }
}

function openTrackDetail(trackId) {
  navigate('track-detail-' + trackId);
}

function renderTrackDetailPage(trackId) {
  const t = IMPROVEMENT_TRACKS.find(x => x.id === trackId);
  if (!t) return;

  // ── Color the hero uniquely per track ──
  const heroDiv = document.getElementById('trackDetailHero');
  if (heroDiv) {
    heroDiv.style.background = 'linear-gradient(135deg, ' + t.colorHex + 'ee 0%, #1c1118 55%)';
  }

  // ── Breadcrumb ──
  const crumbEl = document.getElementById('trackDetailBreadcrumb');
  if (crumbEl) crumbEl.textContent = t.title;

  // ── Hero ──
  const heroEl = document.getElementById('trackDetailHeroContent');
  if (heroEl) {
    heroEl.innerHTML =
      '<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">' +
        '<div style="width:54px;height:54px;border-radius:14px;background:rgba(255,255,255,.15);border:2px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;font-size:28px">' + t.icon + '</div>' +
        '<div>' +
          '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:rgba(255,255,255,.55);margin-bottom:3px">' + t.label + ' · ⏱ ' + t.duration + '</div>' +
          '<h1 style="margin:0;line-height:1.15">' + t.title + '</h1>' +
        '</div>' +
      '</div>' +
      '<p style="max-width:640px">' + t.tagline + '</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px">' +
        '<button class="btn-hero primary" onclick="startCapAssess(' + t.capNums[0] + ')">Start Assessment</button>' +
        '<button class="btn-hero secondary" onclick="navigate(\'improvement-tracks\')">← All Tracks</button>' +
      '</div>';
  }

  // ── Body ──
  const body = document.getElementById('trackDetailBody');
  if (!body) return;

  const caps      = t.capNums.map(n  => CAP_MODEL.find(c  => c.num === n )).filter(Boolean);
  const relTools  = t.toolIds.map(id => TOOLS.find(x     => x.id  === id)).filter(Boolean);
  const relWbs    = t.wbIds.map(id   => WORKBOOKS.find(x  => x.id  === id)).filter(Boolean);
  const relLessons= t.lessonIds.map(id=> LESSONS.find(x   => x.id  === id)).filter(Boolean);
  const relStories= t.storyIds.map(id => STORIES.find(x   => x.id  === id)).filter(Boolean);

  // ── Steps ──
  let stepsHtml = '';
  t.steps.forEach(function(s, i) {
    // Build safe onclick — avoid quote clashes in template attributes
    let onclickFn;
    if (typeof s.actionArg === 'string') {
      onclickFn = s.action + "('" + s.actionArg + "')";
    } else {
      onclickFn = s.action + '(' + s.actionArg + ')';
    }
    stepsHtml +=
      '<div style="display:flex;gap:16px;padding:18px 20px;background:#fff;border:1.5px solid var(--border);border-radius:12px;margin-bottom:10px;align-items:flex-start">' +
        '<div style="width:32px;height:32px;border-radius:50%;background:' + t.colorPale + ';border:2px solid ' + t.color + ';color:' + t.color + ';font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">' + (i + 1) + '</div>' +
        '<div style="flex:1">' +
          '<div style="font-size:14.5px;font-weight:700;color:var(--ink);margin-bottom:4px">' + s.title + '</div>' +
          '<p style="font-size:13px;color:var(--ink-soft);line-height:1.55;margin:0 0 10px">' + s.desc + '</p>' +
          '<button onclick="' + onclickFn + '" style="padding:7px 14px;border-radius:8px;background:' + t.colorPale + ';border:1.5px solid ' + t.color + ';color:' + t.color + ';font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">' + s.actionLabel + '</button>' +
        '</div>' +
      '</div>';
  });

  // ── Capabilities ──
  let capsHtml = '';
  caps.forEach(function(cap) {
    const sc  = capScores[cap.num];
    const sl  = getCapScoreLabel(sc);
    const pct = sc ? (sc / 5 * 100) : 0;
    capsHtml +=
      '<div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:16px 18px;display:flex;align-items:flex-start;gap:12px;cursor:pointer" onclick="openCapModal(' + cap.num + ')">' +
        '<div style="width:38px;height:38px;border-radius:10px;background:' + cap.colorPale + ';display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">' + cap.icon + '</div>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:12.5px;font-weight:700;color:var(--ink);margin-bottom:2px">Cap ' + cap.num + ': ' + cap.title + '</div>' +
          (sc
            ? '<div style="margin:5px 0 2px;height:4px;background:rgba(0,0,0,.06);border-radius:100px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:' + cap.color + ';border-radius:100px"></div></div>' +
              '<span style="font-size:11px;color:' + sl.color + ';font-weight:600">' + sl.label + '</span>'
            : '<span style="font-size:11px;color:var(--ink-muted)">Not yet assessed</span>') +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:5px;flex-shrink:0">' +
          '<button onclick="event.stopPropagation();startCapAssess(' + cap.num + ')" style="font-size:10.5px;padding:4px 10px;border-radius:6px;background:' + t.colorPale + ';border:1px solid ' + t.color + ';color:' + t.color + ';font-weight:700;cursor:pointer;font-family:inherit">' + (capScores[cap.num] ? 'Re-Assess' : 'Assess') + '</button>' +
          '<button onclick="event.stopPropagation();learnCapability(' + cap.num + ')" style="font-size:10.5px;padding:4px 10px;border-radius:6px;background:#fff;border:1px solid var(--sky);color:var(--sky);font-weight:700;cursor:pointer;font-family:inherit">Learn</button>' +
          '<button onclick="event.stopPropagation();goToImprove(' + cap.num + ')" style="font-size:10.5px;padding:4px 10px;border-radius:6px;background:#fff;border:1px solid var(--border);color:var(--ink-soft);font-weight:700;cursor:pointer;font-family:inherit">Improve</button>' +
        '</div>' +
      '</div>';
  });

  // ── Tools ──
  let toolsHtml = '';
  relTools.forEach(function(tool) {
    toolsHtml +=
      '<div style="background:#fff;border:1px solid var(--border);border-radius:10px;padding:14px 16px;cursor:pointer;display:flex;gap:10px;align-items:flex-start" onclick="showToolPreview(' + tool.id + ')">' +
        '<span style="font-size:20px">' + tool.icon + '</span>' +
        '<div style="flex:1">' +
          '<div style="font-size:13px;font-weight:700;color:var(--ink);line-height:1.3">' + tool.title + '</div>' +
          '<div style="font-size:11.5px;color:var(--ink-muted);margin-top:2px">' + (tool.type || '') + '</div>' +
        '</div>' +
        '<span style="font-size:11.5px;font-weight:600;color:' + t.color + ';white-space:nowrap">Get →</span>' +
      '</div>';
  });

  // ── Workbooks ──
  let wbsHtml = '';
  relWbs.forEach(function(wb) {
    const wc = (WB_COLORS[wb.category] || t.color);
    wbsHtml +=
      '<div style="background:#fff;border:1px solid var(--border);border-radius:10px;padding:14px 16px;cursor:pointer;display:flex;gap:10px;align-items:flex-start" onclick="openWorkbookModal(' + wb.id + ')">' +
        '<span style="font-size:20px">📓</span>' +
        '<div style="flex:1">' +
          '<div style="font-size:13px;font-weight:700;color:var(--ink);line-height:1.3">' + wb.title + '</div>' +
          '<div style="font-size:11.5px;color:var(--ink-muted);margin-top:2px">' + wb.exercises + ' exercises · ~' + wb.minutes + ' min</div>' +
        '</div>' +
        '<span style="font-size:11.5px;font-weight:600;color:' + wc + ';white-space:nowrap">Open →</span>' +
      '</div>';
  });

  // ── Lessons ──
  let lessonsHtml = '';
  const levelColors = { Beginner: '#16a34a', Intermediate: '#c96d08', Advanced: '#b83252' };
  relLessons.forEach(function(l) {
    const lc = levelColors[l.level] || '#16a34a';
    // Always open the lesson player directly with the lesson ID
    const clickFn = 'openLessonPlayer(' + l.id + ', 0)';
    lessonsHtml +=
      '<div style="background:#fff;border:1px solid var(--border);border-radius:10px;padding:14px 16px;cursor:pointer;display:flex;gap:10px;align-items:center" onclick="' + clickFn + '">' +
        '<div style="width:36px;height:36px;border-radius:9px;background:' + t.colorPale + ';display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">⚡</div>' +
        '<div style="flex:1">' +
          '<div style="font-size:13px;font-weight:700;color:var(--ink);line-height:1.3">' + l.title + '</div>' +
          '<div style="font-size:11px;color:var(--ink-muted);margin-top:2px">' + (l.duration || '') + '</div>' +
        '</div>' +
        '<span style="font-size:11.5px;font-weight:600;color:' + t.color + ';white-space:nowrap">Learn →</span>' +
      '</div>';
  });

  // ── Stories ──
  let storiesHtml = '';
  relStories.forEach(function(s) {
    storiesHtml +=
      '<div style="background:#fff;border:1px solid var(--border);border-radius:10px;padding:14px 16px;cursor:pointer;display:flex;gap:10px;align-items:flex-start" onclick="showStoryModal(' + s.id + ')">' +
        '<span style="font-size:20px">🏆</span>' +
        '<div style="flex:1">' +
          '<div style="font-size:13px;font-weight:700;color:var(--ink);line-height:1.3">' + s.title + '</div>' +
          '<div style="font-size:11.5px;color:var(--ink-muted);margin-top:2px">' + (s.org || '') + ' · <strong style="color:var(--emerald)">' + s.stat + ' ' + (s.statLabel || '') + '</strong></div>' +
        '</div>' +
        '<span style="font-size:11.5px;font-weight:600;color:' + t.color + ';white-space:nowrap">Read →</span>' +
      '</div>';
  });

  // ── Deliverables ──
  let deliverablesHtml = '';
  t.deliverables.forEach(function(d) {
    deliverablesHtml +=
      '<div style="display:flex;gap:10px;padding:10px 14px;background:#fff;border:1px solid var(--border);border-radius:9px;align-items:flex-start;margin-bottom:7px">' +
        '<span style="color:' + t.color + ';font-size:15px;flex-shrink:0;margin-top:1px">✓</span>' +
        '<span style="font-size:13px;color:var(--ink-soft);line-height:1.45">' + d + '</span>' +
      '</div>';
  });

  // ── FAQs ──
  let faqsHtml = '';
  t.faqs.forEach(function(f, i) {
    const bodyId = 'td-faq-body-' + t.id + '-' + i;
    const arrowId = 'td-faq-arrow-' + t.id + '-' + i;
    faqsHtml +=
      '<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:8px">' +
        '<button onclick="_tdToggleFaq(\'' + bodyId + '\',\'' + arrowId + '\')" style="width:100%;text-align:left;padding:14px 16px;background:#fff;border:none;cursor:pointer;font-family:inherit;display:flex;justify-content:space-between;align-items:center;font-size:14px;font-weight:600;color:var(--ink)">' +
          f.q +
          '<span id="' + arrowId + '" style="font-size:18px;color:' + t.color + ';flex-shrink:0;transition:transform .2s;margin-left:10px">+</span>' +
        '</button>' +
        '<div id="' + bodyId + '" style="display:none;padding:0 16px 14px;font-size:13.5px;color:var(--ink-soft);line-height:1.65;background:#fff">' + f.a + '</div>' +
      '</div>';
  });

  // ── Metrics ──
  let metricsHtml = '';
  t.metrics.forEach(function(m) {
    metricsHtml +=
      '<div style="display:flex;gap:9px;padding:8px 0;border-bottom:1px solid var(--border);align-items:flex-start">' +
        '<span style="color:' + t.color + ';flex-shrink:0">→</span>' +
        '<span style="font-size:13px;color:var(--ink-soft)">' + m + '</span>' +
      '</div>';
  });

  // ── Assemble body ──
  body.innerHTML =
    // Track summary banner
    '<div style="background:linear-gradient(135deg,' + t.colorPale + ' 0%,#fff 60%);border:2px solid ' + t.color + ';border-radius:20px;padding:28px 32px;margin-bottom:32px;position:relative;overflow:hidden">' +
      '<div style="position:absolute;top:-10px;right:-10px;font-size:100px;opacity:.06;line-height:1">' + t.icon + '</div>' +
      '<div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap">' +
        '<div style="width:56px;height:56px;border-radius:14px;background:' + t.colorPale + ';border:2px solid ' + t.color + ';display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0">' + t.icon + '</div>' +
        '<div style="flex:1;min-width:200px">' +
          '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:' + t.color + ';margin-bottom:4px">' + t.label + ' · ⏱ ' + t.duration + '</div>' +
          '<h2 style="font-size:24px;font-weight:900;color:var(--ink);margin:0 0 8px;line-height:1.15">' + t.title + '</h2>' +
          '<p style="font-size:14.5px;color:var(--ink-soft);line-height:1.6;margin:0 0 14px;max-width:580px">' + t.why + '</p>' +
          '<div style="background:#fff;border-radius:10px;padding:12px 16px;border:1.5px solid ' + t.color + ';max-width:580px">' +
            '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:' + t.color + ';margin-bottom:5px">What you will achieve</div>' +
            '<p style="font-size:13.5px;color:var(--ink);line-height:1.55;margin:0">' + t.outcome + '</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    // Two-column layout
    '<div class="td-two-col">' +

      // LEFT — Steps + FAQs
      '<div>' +
        '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:' + t.color + ';margin-bottom:14px">6-STEP TRACK PLAN</div>' +
        stepsHtml +
        '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-muted);margin:28px 0 12px">COMMON QUESTIONS</div>' +
        faqsHtml +
      '</div>' +

      // RIGHT — Resources
      '<div>' +
        // Capabilities
        '<div style="background:var(--paper);border-radius:14px;padding:18px;margin-bottom:18px">' +
          '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:' + t.color + ';margin-bottom:12px">CAPABILITIES IN THIS TRACK</div>' +
          '<div style="display:flex;flex-direction:column;gap:8px">' + capsHtml + '</div>' +
        '</div>' +

        // Lessons
        (lessonsHtml ? (
          '<div style="background:var(--paper);border-radius:14px;padding:18px;margin-bottom:18px">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
              '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--gold)">MICRO LESSONS</div>' +
              '<button onclick="navigate(\'micro-lessons\')" style="font-size:11px;color:var(--gold);font-weight:600;background:none;border:none;cursor:pointer;font-family:inherit">All →</button>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;gap:7px">' + lessonsHtml + '</div>' +
          '</div>'
        ) : '') +

        // Tools
        (toolsHtml ? (
          '<div style="background:var(--paper);border-radius:14px;padding:18px;margin-bottom:18px">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
              '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--emerald)">TOOLS & TEMPLATES</div>' +
              '<button onclick="navigate(\'tools\')" style="font-size:11px;color:var(--emerald);font-weight:600;background:none;border:none;cursor:pointer;font-family:inherit">All →</button>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;gap:7px">' + toolsHtml + '</div>' +
          '</div>'
        ) : '') +

        // Workbooks
        (wbsHtml ? (
          '<div style="background:var(--paper);border-radius:14px;padding:18px;margin-bottom:18px">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
              '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--sky)">WORKBOOKS</div>' +
              '<button onclick="navigate(\'workbooks\')" style="font-size:11px;color:var(--sky);font-weight:600;background:none;border:none;cursor:pointer;font-family:inherit">All →</button>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;gap:7px">' + wbsHtml + '</div>' +
          '</div>'
        ) : '') +

        // Stories
        (storiesHtml ? (
          '<div style="background:var(--paper);border-radius:14px;padding:18px;margin-bottom:18px">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
              '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--rose)">SUCCESS STORIES</div>' +
              '<button onclick="navigate(\'success-stories\')" style="font-size:11px;color:var(--rose);font-weight:600;background:none;border:none;cursor:pointer;font-family:inherit">All →</button>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;gap:7px">' + storiesHtml + '</div>' +
          '</div>'
        ) : '') +

        // Deliverables
        '<div style="background:var(--paper);border-radius:14px;padding:18px;margin-bottom:18px">' +
          '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-muted);margin-bottom:12px">WHAT YOU WILL PRODUCE (' + t.deliverables.length + ')</div>' +
          deliverablesHtml +
        '</div>' +

        // Metrics
        '<div style="background:var(--paper);border-radius:14px;padding:18px">' +
          '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-muted);margin-bottom:12px">HOW TO MEASURE SUCCESS</div>' +
          metricsHtml +
        '</div>' +
      '</div>' +
    '</div>' +

    // Bottom CTA
    '<div style="background:var(--ink);border-radius:16px;padding:28px 32px;margin-top:36px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">' +
      '<div>' +
        '<h3 style="font-size:20px;font-weight:800;color:#fff;margin:0 0 6px">Ready to start ' + t.title + '?</h3>' +
        '<p style="font-size:14px;color:rgba(255,255,255,.6);margin:0">Begin with the assessment, then follow each step in order.</p>' +
      '</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
        '<button class="btn-hero primary" onclick="startCapAssess(' + t.capNums[0] + ')" style="font-size:13px;padding:10px 20px">Start Assessment</button>' +
        '<button class="btn-hero secondary" onclick="navigate(\'improvement-tracks\')" style="font-size:13px;padding:10px 20px">← Back to Tracks</button>' +
      '</div>' +
    '</div>';

  // Footer — reset each time so it re-renders for the new track
  const footer = document.getElementById('trackDetailFooter');
  if (footer) { footer.dataset.rendered = ''; footer.innerHTML = renderFooter(); footer.dataset.rendered = '1'; }
}

// FAQ toggle helper for track detail page
function _tdToggleFaq(bodyId, arrowId) {
  const body = document.getElementById(bodyId);
  const arrow = document.getElementById(arrowId);
  if (!body) return;
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.style.transform = isOpen ? '' : 'rotate(45deg)';
}

function toggleLearnDropdown(e) {
  e.stopPropagation();
  closeImproveDropdown();
  closeResourcesDropdown();
  document.getElementById('learnDropdown')?.classList.toggle('open');
}
function closeLearnDropdown() {
  document.getElementById('learnDropdown')?.classList.remove('open');
}
function toggleImproveDropdown(e) {
  e.stopPropagation();
  closeLearnDropdown();
  closeResourcesDropdown();
  document.getElementById('improveDropdown')?.classList.toggle('open');
}
function closeImproveDropdown() {
  document.getElementById('improveDropdown')?.classList.remove('open');
}
function toggleResourcesDropdown(e) {
  e.stopPropagation();
  closeLearnDropdown();
  closeImproveDropdown();
  document.getElementById('resourcesDropdown')?.classList.toggle('open');
}
function closeResourcesDropdown() {
  document.getElementById('resourcesDropdown')?.classList.remove('open');
}
// Close all dropdowns when clicking outside
document.addEventListener('click', function(e) {
  const ld = document.getElementById('learnDropdown');
  if (ld && !ld.contains(e.target)) ld.classList.remove('open');
  const id = document.getElementById('improveDropdown');
  if (id && !id.contains(e.target)) id.classList.remove('open');
  const rd = document.getElementById('resourcesDropdown');
  if (rd && !rd.contains(e.target)) rd.classList.remove('open');
});


/* ══════════════════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════════════════ */
function openMobileMenu() {
  document.getElementById('mobileMenu').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  _navStack.length = 0;   // fresh stack on load
  navigate('home');

  // Close modal on Escape, open search on /
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeMobileMenu(); }
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      navigate('search');
      setTimeout(() => document.getElementById('globalSearchInput')?.focus(), 200);
    }
  });

  // Scroll progress bar
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
    const bar = document.getElementById('scrollBar');
    if (bar) bar.style.width = Math.min(pct, 100) + '%';
    const btn = document.getElementById('backToTop');
    if (btn) btn.classList.toggle('visible', doc.scrollTop > 400);
  });
});
