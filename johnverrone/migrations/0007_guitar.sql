-- Guitar: journal, practice plan, and song list, migrated off the legacy
-- `hobbies` Cloudflare Worker (flat YAML/Markdown files + GitHub PR editing
-- flow) into D1. Data below is the real historical content as of this
-- migration — 19 journal entries (2026-02-15 through 2026-04-01), the
-- current practice plan, and the 30-song list. The `week` frontmatter field
-- from the source files was always unused/zero and is not carried over.

CREATE TABLE guitar_journal_entry (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  date         TEXT NOT NULL UNIQUE,           -- yyyy-mm-dd
  duration_min INTEGER NOT NULL,
  theme        TEXT NOT NULL,
  content      TEXT NOT NULL,                  -- markdown
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_guitar_journal_date ON guitar_journal_entry(date);

CREATE TABLE guitar_song (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  title      TEXT NOT NULL,
  artist     TEXT NOT NULL,
  difficulty TEXT NOT NULL,                    -- Beginner|Intermediate|Advanced
  genre      TEXT NOT NULL,
  key        TEXT NOT NULL,
  tuning     TEXT NOT NULL,
  bpm        INTEGER NOT NULL,
  capo       INTEGER,
  progress   TEXT NOT NULL DEFAULT 'Not Started',
  tab_link   TEXT,
  notes      TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_guitar_song_sort ON guitar_song(sort_order);

-- Singleton: always exactly one row (id=1), upserted in place. The plan is a
-- single markdown blob, same as it was as plan.md.
CREATE TABLE guitar_plan (
  id         INTEGER PRIMARY KEY CHECK (id = 1),
  content    TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO guitar_journal_entry (date, duration_min, theme, content) VALUES
('2026-02-15', 120, 'Level 1: Fretboard Fundamentals', '- **What I worked on:** Walked through all of Level 1. Set up a recording template and workflow for tracking weekly progress.
- **How it went:** Level 1 was mostly a refresher — fretboard fundamentals, chord degrees of major and minor scales, nothing brand new yet. Enjoying Paul''s teaching style and the extra resources (visuals, backing tracks) that come with the course. Even for familiar material, the presentation makes it worth the time.
- **Next session focus:**
  - Practice fretboard note recognition
  - Drill chord degrees of the major and minor scales
  - Improvise over a backing track in the key of C'),
('2026-02-16', 120, 'Level 1: Fretboard Fundamentals', '- **What I worked on:** Spent most of the session on the Level 1 solo, focusing on timing and playing cleanly. Took the Level 1 self-assessment, then moved into the beginning of Level 2 — learning all 12 major and minor triad positions on the neck.
- **How it went:** The solo is coming along but there are still tricky timing bits in the 4th bar, and the scale runs in bars 11–12 gave me trouble. Passed the Level 1 assessment and got started on Level 2 triads.
- **Key takeaways:**
  - Use the metronome — playing in time needs to be a priority
  - Upgrade practice setup: office chair arms get in the way of comfortable playing
- **Next session focus:**
  - Continue drilling major and minor triad positions (Level 2)
  - Revisit Level 1 solo bars 4 and 11–12 with a metronome at a slower tempo'),
('2026-02-17', 120, 'Level 1: Fretboard Fundamentals', '- **What I worked on:** Fretboard note location drills and a triad refresher. Watched the Level 2 pentatonic scales lesson and jammed over backing tracks, switching between pentatonic scale shapes to match the chord changes. Wrapped up with tempo work on Snow (RHCP) and experimenting with tones on the Nolly X plugin.
- **How it went:** The pentatonic lesson was a refresher — these shapes are familiar territory and probably my most-practiced material. The real fun was improvising over the backing track and trying to match scale positions to the underlying chords in real time. Snow is a good tempo challenge.
- **Key takeaways:**
  - Improvising over chord changes with different pentatonic positions is a great way to internalize the shapes beyond muscle memory
  - Need to push beyond pentatonics — they''re a comfort zone
- **Next session focus:**
  - Continue Level 2 pentatonic material and chord-targeted improvisation
  - Keep working Snow up to speed with a metronome'),
('2026-02-18', 150, 'Level 1: Fretboard Fundamentals', '- **What I worked on:** Set up Neural Amp Modeler (NAM) as a replacement for the expiring Nolly X trial. Spent a big chunk of time browsing and auditioning NAM profiles to find usable tones. Settled on a Deluxe Reverb clean with GarageBand compression and overdrive, plus a Mesa Boogie Triple Rectifier high-gain profile. After dialing in tones, spent ~1 hr improvising over a self-recorded backing track using pentatonic scales. Revisited the Level 1 solo to work on speed and cleanliness.
- **How it went:** NAM is a rabbit hole — tons of community profiles and it''s easy to lose track of time A/B-ing sounds. The Deluxe Reverb tone ended up being really satisfying for cleans; the Triple Rec is massive for high gain. Improvising felt good and the pentatonic shapes are becoming more automatic. The Level 1 solo is noticeably more comfortable now, even at the full 85 bpm, though bar 4 still trips me up.
- **Key takeaways:**
  - NAM is a solid free alternative to paid amp sims — worth investing time to curate a small set of go-to profiles rather than endlessly browsing
  - GarageBand''s built-in drive and compressor are workable but limiting — look into better effect plugins (pedal-style VSTs?)
  - Bar 4 of the Level 1 solo is the remaining sticking point — isolate and drill it
- **Next session focus:**
  - Drill Level 1 solo bar 4 in isolation at a slow tempo, then build back up to 85 bpm
  - Continue pentatonic improvisation with the new tones
  - Start looking into dedicated compressor/drive plugins'),
('2026-02-19', 120, 'Level 1: Fretboard Fundamentals', '- **What I worked on:** Spent time throughout the day thinking about chord formulation and basic music theory. Challenged myself to identify the key of a random song by ear — ended up picking one in F# Mixolydian with a progression that doesn''t start on I (D#m – F# – E – F#), which was a real puzzle. After that, went back to the Level 1 solo to try to master it. Also spent a good chunk of time dialing in the recording workflow (camera placement, file organization, color grading, audio bounce settings).
- **How it went:** The key-identification exercise was humbling — F# Mixolydian with a non-I starting chord is a tough draw for an ear training challenge. Good learning moment though. The Level 1 solo came much more naturally after a day or two off, and I finally nailed the rhythm in bar 4. Recorded a take to log progress: [Level 1 Solo Attempt](https://youtu.be/1xRSYCBZZY4?si=wg1Shqrv_l4BSXMS).
- **Key takeaways:**
  - Rest days pay off — the solo felt noticeably smoother after stepping away
  - Trying to identify keys by ear is a great exercise, even (especially) when you pick a hard one
  - Recording workflow is an investment — worth getting the process smooth now so future takes are frictionless
- **Next session focus:**
  - Continue refining the Level 1 solo — clean up any remaining rough spots
  - More ear training / key identification practice with simpler songs
  - Push forward with Level 2 material'),
('2026-02-21', 120, 'Level 1: Fretboard Fundamentals', '- **What I worked on:** Started with the bending lesson from Level 2 of Next Level Playing, then dove into the Level 2 capstone solo "Feeling Blue in B Minor." Spent most of the session looping the solo to internalize the groove and nail the bends. Got a few runs in at full speed (85 bpm). Also set up Ableton Live 12 as my DAW, replacing GarageBand.
- **How it went:** The solo took a while to click but I eventually got most of it down. The bends are the crux — getting them in tune and in the pocket of the groove is the challenge. Running it at 85 bpm felt like a stretch but doable. The Ableton switch was a big upgrade: the Fender Super Reverb NAM profile paired with Ableton''s built-in ''garage'' reverb on the neck pickup was an incredible tone.
- **Key takeaways:**
  - Ableton Live 12 is a significant step up from GarageBand — worth the switch
  - NAM Super Reverb + Ableton garage reverb on the neck pickup = chef''s kiss
  - Tuning stability is becoming a real frustration — the Floyd Rose trem doesn''t help, but this might just be me building a case for a new guitar (tele brain says practical, heart says strat)
- **Next session focus:**
  - Record an attempt at the Level 2 solo
  - Revisit Level 1 scales and fretboard exercises before moving to Level 3
  - Continue refining bends in the solo'),
('2026-02-22', 120, 'Level 1: Fretboard Fundamentals', '- **What I worked on:** Recorded an attempt at the Level 2 solo "Feeling Blue in B Minor" — [Level 2 Solo Attempt](https://youtu.be/mRoDcpMfwI0?si=SlZAIZ-V0iZGktKO). Then went back into the Level 2 bonus content to work on triads up the neck on the B, G, and D strings, including sus2 and sus4 chords used to voice-lead between triad positions over a C–Am–Dm–G backing track. Cooled down with noodling and scale practice.
- **How it went:** The solo recording was sloppy — bends are still horribly out of pitch and need a lot more work. The triad exercises were eye-opening but mentally taxing. Identifying every note of each triad in every position up the neck is a real brain workout — thinking in terms of chord tones and voice leading doesn''t come naturally yet. The sus2/sus4 transitions between triads over the progression were a cool concept but hard to execute fluently.
- **Key takeaways:**
  - Bends are the #1 thing holding the Level 2 solo back — need dedicated bend practice (pitch accuracy, not just technique)
  - Knowing the notes of triads in every position is foundational but my brain doesn''t think in music theory terms yet — this will take repetition
  - Voice leading with sus2/sus4 chords connecting triads is a powerful concept worth drilling
- **Next session focus:**
  - Keep practicing Level 1 and Level 2 material before moving to Level 3
  - Dedicated bend practice — use a tuner to check pitch accuracy
  - Continue drilling triad note identification up the neck'),
('2026-02-24', 120, 'Levels 2–3: Pentatonics, Intervals & 7th Chords', '- **What I worked on:** Started with fretboard note recognition — picking a random note and playing major triads around every position. Completed the Level 2 bonus lesson on intervals, learning their positions relative to the root note across the entire fretboard. Nailed the ear training exercise. Started Level 3 (7th Chord Spice), learning maj7, min7, and dom7 chord shapes using barre chord voicings. Finished the session by picking up the drop D guitar and working on the intro to "Laid to Rest" by Lamb of God, using the Peavey 5150 + MSR overdrive NAM profile. Also improved the Ableton setup — created an "always monitoring" track with sends to reverb and recording tracks to avoid input monitoring issues during playback.
- **How it went:** The triad exercise is paying off — fretboard visualization is noticeably improving. The intervals lesson and ear training went well, wrapping up Level 2 cleanly. Level 3''s 7th chord shapes clicked quickly with the barre chord approach, so feeling confident there. The djent/metal detour was a fun way to close out the session — the 5150 profile absolutely rips for that style. The Ableton routing fix was a quality-of-life win that should make future sessions smoother.
- **Key takeaways:**
  - Fretboard knowledge is compounding — the triad + interval work is building real fluency
  - Level 2 complete (including bonus content) — ready for Level 3
  - 7th chord shapes are intuitive when built from barre chord foundations
  - The Peavey 5150 + MSR overdrive profile is the go-to for high-gain/metal tones
  - Still want a strat
- **Next session focus:**
  - Continue Level 3 — deeper into 7th chord applications and exercises
  - Practice "Laid to Rest" intro — get the rhythm tighter
  - Ear training — keep building on the interval recognition foundation'),
('2026-02-25', 90, 'Levels 2–3: Pentatonics, Intervals & 7th Chords', '- **What I worked on:** Learned "So Far So Fake" by Pierce the Veil. Spent the first 10–15 minutes figuring out the bass notes by ear to determine the key and chord progression — landed on D minor. The intro melody is picked rather than strummed, which made identifying the progression trickier. Found the notes for the bridge riff. After that, looked up a tutorial and learned all the remaining parts of the song.
- **How it went:** The ear training portion was a good challenge — the picked intro melody made it harder to hear the underlying chord movement, but working through it paid off. Once I had the key and bridge riff sorted, the tutorial filled in the gaps quickly and I got through all the parts in one session. The song isn''t performance-ready yet — still need to dial in the tone and practice stringing all the sections together at tempo.
- **Key takeaways:**
  - Ear training is getting more practical — able to identify the key and find bass notes/riffs without tab
  - Picked melodies over chord progressions are harder to analyze by ear than strummed chords
  - Learning the structure first (key, progression, riffs) before looking up a tutorial makes the tutorial way more efficient
- **Next session focus:**
  - Dial in the tone for "So Far So Fake"
  - Practice transitioning between sections at tempo
  - Continue Level 3 material'),
('2026-02-28', 90, 'Levels 2–3: Pentatonics, Intervals & 7th Chords', '- **What I worked on:** Downloaded more NAM tones and found a great combo — Boss OD-3 into a Fender Deluxe Reverb. Continued Next Level Playing with the next lesson, which focused on a triplet riff played through all 5 pentatonic positions. Revisited the Level 2 blues solo "Feeling Blue in B Minor." Closed out the session with a couple full playthroughs of "So Far So Fake" by Pierce the Veil.
- **How it went:** The OD-3 into Deluxe Reverb profile is a killer little combo — really satisfying crunch tone. The triplet riff through all 5 pentatonic positions was a solid exercise for connecting the shapes. The Level 2 solo felt way cleaner this time around — was able to play it at tempo without much trouble, which is a nice confidence boost compared to the sloppy recording from a few days ago. "So Far So Fake" is coming together well — a couple parts still trip me up but overall it''s a pretty easy song and it feels great to have something in the repertoire I can play start to end.
- **Key takeaways:**
  - Boss OD-3 + Fender Deluxe Reverb NAM combo is a new go-to clean/crunch tone
  - Level 2 solo progress is real — bends and timing are noticeably improved
  - Having a full song you can play through is a great motivator
- **Next session focus:**
  - Continue NLP triplet/pentatonic exercises
  - Clean up the remaining rough spots in "So Far So Fake"
  - Push forward with Level 3 material'),
('2026-03-02', 120, 'Level 3: Minor Scales', '- **What I worked on:** Continued through NLP — hit Lesson 4 of Level 3, which covers minor scales. Practiced two run exercises that move across the neck through the minor scale positions, drilling them with a metronome. Revisited the 7th chord progressions from earlier in Level 3 and practiced transposing them to different keys. Mixed in noodling and chord practice between structured work. Set up the Line 6 FBV3 as a MIDI controller over USB in Ableton — built an audio effect rack with multiple NAM amps and pedals on different chains so I can switch amp presets and toggle delay, reverb, and overdrive via footswitch.
- **How it went:** The minor scale runs are a good workout — moving across the neck forces you to connect the positions rather than staying in one box. The metronome kept things honest. Transposing the 7th chord progressions to different keys is getting smoother but still requires real thought — not automatic yet. The FBV3 MIDI setup was a huge quality-of-life upgrade — being able to switch tones and toggle effects hands-free makes practice feel way more like playing through a real rig.
- **Key takeaways:**
  - Minor scale runs across the neck are great for breaking out of single-position thinking
  - Transposing 7th chord progressions is solid music theory practice — needs more reps to become fluent
  - Line 6 FBV3 works as a USB MIDI controller — combined with Ableton effect racks, it''s a legit pedalboard replacement
- **Next session focus:**
  - Continue drilling minor scale runs at increasing tempos
  - Keep transposing 7th chord progressions — try less common keys
  - Explore the FBV3 MIDI mapping further (expression pedal for volume/wah?)'),
('2026-03-07', 60, 'Level 3: Minor Scales', '- **What I worked on:** Watched a YouTube video breaking down the basics of Math Rock guitar style — tapping, odd time signatures, and the general approach to the genre. Noodled around with some of those ideas afterward. Then spent time dialing in tones with the Neural DSP Cory Wong archetype plugin (trial), exploring its clean tone options and seeing what it could do.
- **How it went:** Math Rock is super interesting — the style sounds cool and I can see it being a fun rabbit hole to explore further. The Cory Wong plugin has some really nice clean tones — was able to get some unique and cool sounds out of it. That said, it feels fairly specialized and not incredibly versatile from what I can tell so far. A solid plugin for that specific Cory Wong funky clean vibe, but probably not a Swiss army knife.
- **Key takeaways:**
  - Math Rock guitar style is worth exploring more — tapping, odd meters, and creative rhythmic ideas
  - Neural DSP Cory Wong archetype has great cleans but seems niche — not a do-everything plugin
  - Sometimes exploratory sessions like this are valuable even without structured practice
- **Next session focus:**
  - Back to NLP exercises with an updated recording
  - Continue Level 3 minor scale material'),
('2026-03-14', 120, 'Gig-Ready Repertoire Building', '- **What I worked on:** Spent the session curating a list of "gig ready" songs — songs I want to learn from start to finish and have performance-ready. After building out the list, picked "The Middle" by Jimmy Eat World as the first one to tackle. Started dialing in the tone, figured out the key (D, Drop D tuning), and watched a YouTube video breaking down the solo section.
- **How it went:** This was a productive shift in focus — having a concrete list of songs to work toward feels like a great motivator alongside the NLP course work. "The Middle" is a solid pick to start with — it''s recognizable, the structure is straightforward, and the solo is melodic and approachable. Got a good handle on the key and overall song structure. The tone dialing took some time but landed in a good spot for the pop-punk sound.
- **Key takeaways:**
  - Building a "gig ready" song list is a great way to give practice sessions direction and a clear goal
  - "The Middle" is in D with Drop D tuning — the palm-muted low D string riff is the backbone of the song
  - The solo is built on D major pentatonic with simple bends and slides — should be learnable relatively quickly
  - Balancing structured course work (NLP) with full-song learning keeps things fresh and motivating
- **Next session focus:**
  - Start drilling "The Middle" section by section — nail the intro riff and verse first
  - Practice the solo slowly with a metronome
  - Get the verse-to-chorus transition tight (palm mute to open strumming)'),
('2026-03-18', 60, 'The Middle & Tone Research', '- **What I worked on:** Continued working through "The Middle" by Jimmy Eat World, drilling sections and getting more reps in. Spent a good chunk of the session on tone research and discovered that the Valeton GP-100 (a budget multi-FX pedal) natively supports NAM patches -- the same format I''ve been running through Ableton Live. Rounded out the session with scale and alternate picking exercises.
- **How it went:** "The Middle" is getting more comfortable -- the repetition is paying off. The Valeton GP-100 NAM discovery was a fun rabbit hole. It''s interesting to know that a relatively affordable hardware unit can run the same NAM profiles as the Ableton setup -- opens up options for a more portable or stage-friendly rig down the road without having to run a laptop. The scale and alternate picking work was solid, no-frills maintenance practice.
- **Key takeaways:**
  - Valeton GP-200 supports NAM patches natively -- a hardware option worth keeping in mind for a future gigging rig
  - Dedicated NAM hardware could be a practical alternative to the Ableton Live setup for live use
  - Consistent reps on "The Middle" are working -- sections are getting stickier
- **Next session focus:**
  - Keep building "The Middle" -- focus on stringing sections together smoothly
  - Continue alternate picking exercises with a metronome at increasing tempos
  - Look further into NAM hardware options if curious about a stage-ready rig'),
('2026-03-19', 40, 'Patio Jamming & NLP Solo Work', '- **What I worked on:** Brought the amp out to the back patio and played through the real amp for a change. Spent the session jamming through different tones on the Line 6 Spider and worked on the Aeolian Dream solo from the NLP course.
- **How it went:** Playing outside through the amp was a great change of pace -- there''s something different about hearing the sound naturally in open air versus through headphones or studio monitors. The Line 6 Spider tones are a fun sandbox to mess around with, even if they''re not the most refined. Good just to play loosely without too much structure sometimes. The Aeolian Dream solo is a solid NLP exercise -- working on nailing the phrasing and getting it clean.
- **Key takeaways:**
  - Changing up the environment (patio, real amp) is a nice reset and keeps playing feeling fresh
  - Sometimes an unstructured jamming session is exactly what you need
  - The Aeolian Dream solo is good practice for minor key phrasing and expression
- **Next session focus:**
  - Continue refining the Aeolian Dream solo -- focus on phrasing and dynamics
  - Get back to structured work on "The Middle"'),
('2026-03-22', 60, 'NLP Solo & The Middle Playthroughs', '- **What I worked on:** Spent the first 40 minutes working on the Aeolian Dream solo from Level 3 of Next Level Playing. Used the remaining 20 minutes recording full song playthroughs of The Middle.
- **How it went:** The Middle is getting close to gig ready -- the full playthroughs went well and it''s feeling solid aside from a little more polish needed on the solo section. The NLP solo still needs more work to play cleanly at tempo, especially the pentatonic scale rundown at the end. That passage is the main sticking point right now.
- **Key takeaways:**
  - The Middle is nearly gig ready -- just need to tighten up the solo
  - The pentatonic scale rundown at the end of the Aeolian Dream solo is the biggest challenge at tempo
  - Recording full playthroughs is a good way to pressure-test readiness
- **Next session focus:**
  - Slow down and isolate the pentatonic rundown from the NLP solo -- build it back up to tempo
  - One more pass at The Middle to lock in the solo section and call it gig ready'),
('2026-03-24', 150, 'Improv Over Backing Track & Gear Rabbit Hole', '- **What I worked on:** Recorded a simple kick-snare beat in Ableton and laid down a chord progression (Em - G - Am) to use as a backing track. Spent over an hour improvising on top of it, focusing on mapping out where the chord shapes live inside the scale shapes across different positions on the neck -- mostly around the 7-10 fret range. After the improv session, switched over to working on the Aeolian Dream solo from Level 3 of NLP, trying to tighten it up, and tracked some takes in Ableton. Also spent a good chunk of time researching gear options and thinking through the amp/modeler/plugin decision.
- **How it went:** The improv session was really productive -- creating my own backing track and jamming over it for an extended period is a great way to internalize the fretboard. Connecting chord shapes to scale shapes in real time across positions is exactly the kind of thing that builds real fluency. The NLP solo work continues -- tracking takes in Ableton adds some useful pressure. The gear research is an ongoing spiral. The Spider V sounded fine the other day but it''s bulky and clearly a beginner amp. Neural DSP plugin trials have been impressive but hard to commit to one without knowing if hardware is the better long-term play. NAM does amp sims really well but good IRs are hard to find and pedal/effects models are basically nonexistent -- that''s where Neural DSP plugins have a clear edge with their built-in pre/post effects. The main contenders right now: Valeton GP200LT (budget MFX, loads NAM profiles), HX Stomp (mid-range, universally loved but no NAM support, aging platform), or just staying in the box with a Neural DSP plugin. Premium hardware like the Quad Cortex or Fender Tone Master Pro would be ideal but is out of budget for now.
- **Key takeaways:**
  - Building your own backing tracks in Ableton and improvising over them is one of the best ways to internalize chord-scale relationships
  - The 7-10 fret range is a productive zone for connecting chord shapes to scale patterns in Em
  - NAM''s strength is amp modeling -- IRs, pedals, and effects are its weak spots compared to commercial plugins like Neural DSP
  - The gear decision boils down to: budget hardware with NAM (GP200LT) vs. mid-range hardware without NAM (HX Stomp) vs. staying software-only (Neural DSP plugin) -- each has real trade-offs
  - For recording purposes, plugins always have value regardless of what live hardware you end up with
- **Next session focus:**
  - More improv over self-made backing tracks -- try different keys and positions
  - Continue tightening the NLP Level 3 solo -- review the tracked takes and identify weak spots
  - Try to narrow down the gear decision -- maybe commit to a Neural DSP plugin trial that fits the style best'),
('2026-03-30', 180, 'Multi-Layer Track Building in Ableton', '- **What I worked on:** Spent the whole session in Ableton Live building up a track from scratch. Programmed a drum beat, added a synth layer, then recorded multiple guitar parts on top -- rhythm, leads, and textural layers. Mostly just experimenting and seeing what sounded good together rather than following any structured practice.
- **How it went:** This was a fun, creative session -- more production-oriented than pure guitar practice but still a ton of playing involved. Layering multiple guitar parts forces you to think about tone, timing, and how parts fit together in a mix, which is a different skill set than just playing over a backing track. Three hours flew by. It was more freeform jamming and sound design than focused technique work, but sessions like this are great for staying inspired and developing an ear for arrangement.
- **Key takeaways:**
  - Building full tracks with drums, synth, and guitar layers is a great way to develop arrangement and production skills alongside guitar playing
  - Layering guitar parts highlights timing precision -- small inconsistencies that are invisible when playing solo become obvious in a mix
  - Creative, unstructured sessions are valuable for staying motivated even if they''re not "efficient" practice
- **Next session focus:**
  - Revisit the track with fresh ears and refine the guitar parts
  - Get back to some structured practice -- NLP solo work and improv over backing tracks'),
('2026-04-01', 90, 'NLP Level 3 Wrap-Up & Level 4 Kickoff', '- **What I worked on:** Finished out Level 3 of Next Level Playing -- took the self test which included ear training exercises and some chord/theory questions, which was a nice change of pace from pure playing. Decided to move on even though the Aeolian Dream solo still isn''t fully nailed. Started Level 4, which opens with triads on the top 3 strings (4.1) -- spent a while messing around with those, then moved into 3 notes-per-string scale patterns for speed building in 4.2. Also continued the tone/gear hunt -- found two decent sounds in the Tone King Imperial Neural DSP plugin and kept researching hardware options.
- **How it went:** Good session with a nice mix of structured learning and exploration. The Level 3 self test was a good checkpoint -- the ear training and theory side is easy to neglect so it''s nice that NLP bakes it in. Moving on from Level 3 without perfecting the solo feels right -- I can always circle back, and the diminishing returns of grinding it aren''t worth stalling progress. Triads on the top 3 strings were fun and immediately musical, and the 3nps scale patterns are a different feel from the box shapes I''m used to. On the gear front, Valeton dropped two new second-gen multi-fx pedals -- the GP-150 and GP-180 -- that are even cheaper than the GP-200LT. The GP-180 is the more interesting option but it''s not available anywhere outside of Valeton''s direct store yet, which means dealing with VAT and international shipping. The GP-150 popped up on Amazon briefly at $170 but disappeared. Leaning toward pulling the trigger on the GP-180 over the HX Stomp ($600) once it shows up on a reasonable marketplace.
- **Key takeaways:**
  - Don''t let one tricky passage hold up forward progress through a course -- move on and circle back later
  - Ear training and theory work is easy to skip in self-directed practice, so structured checkpoints like the NLP self tests are valuable
  - Triads on the top 3 strings open up a lot of voicing options -- worth exploring further
  - 3nps scale patterns feel very different from pentatonic box shapes and are clearly better suited for speed runs
  - Gear decision is narrowing: Valeton GP-180 is the top pick over the HX Stomp -- just waiting for it to hit a market without steep international shipping
- **Next session focus:**
  - Continue into Level 4 -- more triads and 3nps scale work
  - Try applying the top-3-string triads over a backing track to hear them in context
  - Keep an eye out for the Valeton GP-180 becoming available on Amazon or similar');

INSERT INTO guitar_song (sort_order, title, artist, difficulty, genre, key, tuning, bpm, capo, progress, tab_link, notes) VALUES
(0, 'Wonderwall', 'Oasis', 'Beginner', 'Rock', 'F#/Gb', 'Standard (EADGBE)', 87, 2, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/oasis/wonderwall-chords-27596', 'Great song for learning basic chord progressions and strumming patterns. Focus on smooth transitions between Em7, G, Dsus4, and A7sus4.'),
(1, 'Folsom Prison Blues', 'Johnny Cash', 'Beginner', 'Country', 'E', 'Standard (EADGBE)', 104, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/johnny-cash/folsom-prison-blues-tabs-332252', 'Learn the boom-chicka train rhythm by alternating bass notes with muted strums. The intro lead line uses a simple pentatonic lick that should be played with a confident, snappy tone. Keep a steady, driving rhythm throughout.'),
(2, 'Good Riddance (Time of Your Life)', 'Green Day', 'Beginner', 'Rock', 'G', 'Standard (EADGBE)', 95, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/green-day/good-riddance-time-of-your-life-tabs-12816', 'Master the fingerpicking intro pattern using G, Cadd9, and Dsus4 chords. Maintain a steady alternating bass note with the thumb while fingers play the melody on higher strings. Practice the strumming pattern transition for the chorus.'),
(3, 'Tennessee Whiskey', 'Chris Stapleton', 'Beginner', 'Country', 'A', 'Standard (EADGBE)', 82, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/chris-stapleton/tennessee-whiskey-tabs-1741208', 'Focus on the smooth A-Bm chord progression with blues-influenced embellishments. Add slides and hammer-ons between chord changes to emulate Stapleton''s style. The solo sections use the A major pentatonic scale with expressive bends.'),
(4, 'Blackbird', 'The Beatles', 'Intermediate', 'Folk', 'G', 'Standard (EADGBE)', 92, 3, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/the-beatles/blackbird-tabs-180986', 'Fingerpicking pattern with melody and bass line played simultaneously. Keep thumb steady on bass notes while fingers play melody.'),
(5, 'Under the Bridge', 'Red Hot Chili Peppers', 'Intermediate', 'Rock', 'E', 'Standard (EADGBE)', 85, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/red-hot-chili-peppers/under-the-bridge-tabs-3832', 'The intro uses a distinctive chord melody with hammer-ons played fingerstyle. Focus on the verse chord voicings which use extensions and inversions up the neck. Practice the clean tone dynamics as the song builds intensity gradually.'),
(6, 'Santeria', 'Sublime', 'Intermediate', 'Rock', 'E', 'Standard (EADGBE)', 89, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/sublime/santeria-tabs-52056', 'Learn the clean intro riff which outlines the E-G#-C#m-B progression. Practice the verse rhythm with a reggae-influenced upstroke pattern. The solo is melodic and uses the E major/C# minor pentatonic scale with smooth legato runs.'),
(7, 'Snow (Hey Oh)', 'Red Hot Chili Peppers', 'Intermediate', 'Rock', 'A', 'Standard (EADGBE)', 105, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/red-hot-chili-peppers/snow-hey-oh-tabs-360889', 'The main riff is a rapid-fire picking pattern across all six strings requiring precise right-hand control. Start at half speed with a metronome and gradually build up. Focus on keeping each note clean and even while maintaining the arpeggiated pattern.'),
(8, 'Sweet Home Alabama', 'Lynyrd Skynyrd', 'Intermediate', 'Rock', 'D', 'Standard (EADGBE)', 100, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/lynyrd-skynyrd/sweet-home-alabama-tabs-6882', 'Focus on the main riff timing and string muting. Lock in with the groove; practice transitions between D, C, and G shapes and the fill variations.'),
(9, 'All Along the Watchtower', 'Jimi Hendrix', 'Intermediate', 'Rock', 'C#/Db', 'Standard (EADGBE)', 113, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/jimi-hendrix/all-along-the-watchtower-tabs-273100', 'Tune down a half step. Learn the C#m-B-A chord pattern with Hendrix-style embellishments using the thumb for bass notes. Focus on rhythmic strumming with percussive muting and expressive lead fills between vocal lines.'),
(10, 'Wish You Were Here', 'Pink Floyd', 'Intermediate', 'Rock', 'G', 'Standard (EADGBE)', 120, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/pink-floyd/wish-you-were-here-tabs-104578', 'Start with the iconic acoustic intro, focusing on the 12-string emulation using open strings. Master the Em7-G-A7sus4 progression and the distinctive picking pattern. The solo section uses expressive bends and vibrato in the pentatonic scale.'),
(11, 'Everlong', 'Foo Fighters', 'Intermediate', 'Rock', 'D', 'Drop D', 158, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/foo-fighters/everlong-tabs-49532', 'Tune to Drop D. Focus on the signature riff using hammer-ons and pull-offs on the D and G strings. The verse uses a clean arpeggio pattern; practice switching between clean and distortion sections smoothly.'),
(12, 'Basket Case', 'Green Day', 'Intermediate', 'Rock', 'D#/Eb', 'Standard (EADGBE)', 171, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/green-day/basket-case-tabs-41582', 'Fast power chord changes drive this song; practice quick transitions between Eb, Bb, Cm, and Gm shapes. Focus on tight palm-muted downstrokes for the verse and open strumming for the chorus. Use a metronome to lock in the punk tempo.'),
(13, 'Limelight', 'Rush', 'Intermediate', 'Rock', 'E', 'Standard (EADGBE)', 136, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/rush/limelight-tabs-100070', 'The iconic opening riff uses a mix of natural harmonics and open strings that requires precise right-hand technique — focus on getting clean harmonic tones at the 12th and 7th frets. The verse rhythm part features syncopated power chord patterns that lock in with Neil Peart''s drumming, so practice with a metronome at a slower tempo before building up to full speed. Alex Lifeson''s solo section involves quick position shifts and bends, so work through it in short phrases.'),
(14, 'That''s What You Get', 'Paramore', 'Intermediate', 'Rock', 'D#/Eb', 'Drop D', 162, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/paramore/thats-what-you-get-tabs-666918', 'This song relies heavily on palm-muted power chords in Drop D tuning with fast downstroke picking — focus on keeping your muting tight and your rhythm locked to the driving tempo. The verse-to-chorus transitions have quick chord changes, so practice those shifts slowly before bringing them up to speed. Work on the intro riff separately, as it uses single-note lines with pull-offs that set the energy for the whole song.'),
(15, 'The Middle', 'Jimmy Eat World', 'Intermediate', 'Rock', 'D', 'Drop D', 162, NULL, 'Learning', 'https://tabs.ultimate-guitar.com/tab/jimmy-eat-world/the-middle-tabs-337141', 'The intro and verse use palm-muted single-note picking on the low D string that is instantly recognizable and satisfying to play. Practice the transition from tight muting to wide-open strumming for the chorus. The short guitar solo is melodic and approachable, built on simple bends and slides in the D major pentatonic scale.'),
(16, 'Sugar, We''re Goin Down', 'Fall Out Boy', 'Intermediate', 'Rock', 'D', 'Half Step Down', 161, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/fall-out-boy/sugar-were-going-down-tabs-174909', 'The signature intro riff uses a repeating arpeggiated pattern across the D and G strings with hammer-ons that builds finger independence and accuracy. The verse and chorus rely on driving power chords with fast palm-muted downstrokes. Focus on getting the timing of the chord stabs in the pre-chorus tight, as they follow a syncopated rhythm that gives the song its punch.'),
(17, 'Say It Ain''t So', 'Weezer', 'Intermediate', 'Rock', 'C#/Db', 'Half Step Down', 76, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/weezer/say-it-aint-so-tabs-58945', 'The intro clean arpeggio riff is one of the most iconic in 90s rock and is a great exercise for smooth chord-to-chord picking. Focus on the dynamic shift from quiet clean verses to the loud distorted chorus — excellent for practicing volume and gain control. The solo is melodic and approachable, staying mostly in one pentatonic box position with expressive bends.'),
(18, 'Dirty Little Secret', 'The All-American Rejects', 'Intermediate', 'Rock', 'A#/Bb', 'Standard (EADGBE)', 144, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/the-all-american-rejects/dirty-little-secret-tabs-204397', 'Built on a catchy power chord progression with a driving eighth-note strumming pattern that is pure pop-punk energy. The intro features a single-note melody line with a clean tone before the distortion kicks in — practice nailing that tone shift. The bridge has a fun rhythmic breakdown with staccato chord hits, great for developing tight muting control.'),
(19, 'Fat Lip', 'Sum 41', 'Intermediate', 'Rock', 'E', 'Standard (EADGBE)', 198, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/sum-41/fat-lip-tabs-24343', 'The main riff is built on chugging palm-muted power chords on the low E string with quick stabs up to higher chord shapes, perfect for practicing tight rhythm control and quick position shifts. Pay attention to the stops and starts throughout the arrangement, as the song frequently cuts to silence before kicking back in. The solo uses fast alternate picking and string bends — learn it in short phrases.'),
(20, 'MakeDamnSure', 'Taking Back Sunday', 'Intermediate', 'Rock', 'F#/Gb', 'Half Step Down', 140, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/taking-back-sunday/makedamnsure-tabs-352636', 'The instantly recognizable intro riff uses a repeating single-note pattern with octave shapes that is deceptively tricky to play cleanly at tempo — focus on muting strings you are not playing. The verse layers clean arpeggiated chords before exploding into distorted power chords for the chorus, great for practicing clean/dirty transitions. The bridge builds tension with sustained chords and feedback-style swells for working on dynamics.'),
(21, 'The Kids Aren''t Alright', 'The Offspring', 'Intermediate', 'Rock', 'A#/Bb', 'Standard (EADGBE)', 199, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/the-offspring/the-kids-arent-alright-tabs-5908', 'The opening riff is a fast palm-muted single-note gallop that demands precise alternate picking and tight muting — start slow with a metronome and build up gradually. The verse and chorus use driving power chord progressions with aggressive downstroke strumming that will build your right-hand endurance. The guitar solo is melodic and within reach, using minor pentatonic runs with tasteful bends.'),
(22, 'Dammit', 'Blink-182', 'Intermediate', 'Rock', 'C', 'Standard (EADGBE)', 220, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/blink-182/dammit-tabs-17951', 'The main riff is one of the most iconic in pop-punk — a relentless power chord progression played with rapid downstrokes that will seriously build your right-hand endurance. The verse features a single-note bass-like riff on the low strings with palm muting that requires picking accuracy at speed. Start at around 160 BPM and gradually work up to the full 220.'),
(23, 'Slow Dancing in a Burning Room', 'John Mayer', 'Advanced', 'Blues', 'C#/Db', 'Standard (EADGBE)', 130, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/john-mayer/slow-dancing-in-a-burning-room-tabs-449994', 'Focus on the signature intro riff which uses double stops and subtle bends. The rhythm parts blend clean chord voicings with bluesy embellishments. Study Mayer''s use of thumb-over bass notes and hybrid picking for the verse patterns.'),
(24, 'Little Wing', 'Jimi Hendrix', 'Advanced', 'Rock', 'E', 'Half Step Down', 71, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/jimi-hendrix/little-wing-tabs-36571', 'Complex chord voicings with thumb-over technique. Practice the signature fills between chords slowly. Pay attention to dynamics and vibrato.'),
(25, 'Pride and Joy', 'Stevie Ray Vaughan', 'Advanced', 'Blues', 'E', 'Standard (EADGBE)', 120, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/stevie-ray-vaughan-double-trouble/pride-and-joy-tabs-30829', 'Master the Texas shuffle rhythm with the thumb playing bass notes on the low E while fingers handle the shuffle pattern. Practice the turnaround lick at slow tempo and nail the syncopated timing that drives the groove.'),
(26, 'Hallowed Be Thy Name', 'Iron Maiden', 'Advanced', 'Metal', 'E', 'Standard (EADGBE)', 100, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/iron-maiden/hallowed-be-thy-name-tabs-272171', 'Learn the dual-harmony guitar parts separately before combining them. The intro arpeggio sets the foundation; focus on clean alternate picking through the galloping rhythm sections. Build speed gradually for the fast triplet runs in the solos.'),
(27, 'Crazy Train', 'Ozzy Osbourne', 'Advanced', 'Metal', 'F#/Gb', 'Standard (EADGBE)', 138, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/ozzy-osbourne/crazy-train-tabs-38622', 'The iconic intro riff uses a tapping/pull-off pattern on the open A string. Practice the main galloping rhythm with tight palm muting. Randy Rhoads'' solo sections require alternate picking precision and string-skipping technique.'),
(28, 'Hotel California', 'Eagles', 'Advanced', 'Rock', 'B', 'Standard (EADGBE)', 74, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/eagles/hotel-california-tabs-14341', 'Master the iconic intro arpeggio pattern in Bm using fingerpicking or hybrid picking. Practice the harmonized dual-guitar solo section slowly, focusing on accurate bends. The verse uses arpeggiated chords that walk through the progression.'),
(29, 'Comfortably Numb', 'Pink Floyd', 'Advanced', 'Rock', 'B', 'Standard (EADGBE)', 126, NULL, 'Not Started', 'https://tabs.ultimate-guitar.com/tab/pink-floyd/comfortably-numb-tabs-79177', 'The verse uses clean, arpeggiated chords (Bm, A, G, Em). The real challenge is the two solos, especially the legendary second solo. Practice bends and vibrato in D minor pentatonic, focusing on sustain and phrasing over speed.');

INSERT INTO guitar_plan (id, content) VALUES (1, '# Practice Plan

## Current Focus

- **Next Level Playing** course by Paul Davids (started Feb 2026, ~12 week plan)
- Working through beginner/intermediate songs to build a solid repertoire foundation
- Clean chord transitions at tempo
- Learning the fretboard and triads for better improvisation and soloing

## Next Level Playing — Course Plan

Self-guided 7-level course. Target: Feb 2026 – May 2026 (~12 weeks).

Weekly progress recordings are saved in `guitar/recordings/` to track progression.

| Weeks | Level   | Focus                       | Status      |
| ----- | ------- | --------------------------- | ----------- |
| 1–2   | Level 1 | Fretboard Fundamentals      | Done        |
| 3–4   | Level 2 | Triads                      | Done        |
| 5–6   | Level 3 | 7 Chord Spice               | In Progress |
| 7–8   | Level 4 | Chord Embellishments        |             |
| 9–10  | Level 5 | Dorian Domination           |             |
| 11    | Level 6 | Jamming like Jimi (Hendrix) |             |
| 12    | Level 7 | Mixolydian Mastery          |             |

Adjust pacing as needed — some levels may take more or less time.');
