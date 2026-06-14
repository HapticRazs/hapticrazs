import { useState } from 'react'
import './Resume.css'

const FEATURED = {
  vfx:  { id: 'juik4TNmWLg', title: 'VFX Reel 2026' },
  film: { id: 'GClqI5ddfMs', title: 'Film Reel 2026' },
}

const VIDEOS = [
  // Pinned top — appears first on both tracks
  { id: 'hlIU8JVD6_U', title: 'Resurgence 2026 | First Fight',   tracks: ['vfx', 'film'] },
  // VFX experience order: Resurgence → Gatorade → Bird Murmuration → Awakening → rest
  { id: 'qJoO3b8RbuU', title: 'Resurgence | Breakdown',           tracks: ['vfx']  },
  { id: 'ntWgA5TaGOg', title: 'Gatorade Become Greatness',        tracks: ['vfx', 'film'] },
  { id: '4SCddF-dn30', title: 'Bird Murmuration Breakdown',       tracks: ['vfx']  },
  { id: 'KkFFgawtzpQ', title: 'Awakening',                        tracks: ['vfx']  },
  // Film experience order: other film projects after Gatorade
  { id: 'Hl4P04q7DMw', title: 'Winner Winner',                    tracks: ['film'] },
  { id: 'QuQ7yt0stjY', title: 'The Curse',                        tracks: ['film'] },
  { id: 'sYJxnXdEU6A', title: 'The Ball',                         tracks: ['film'] },
  { id: 'VRWAziR-7jg', title: '8 AMs',                            tracks: ['film'] },
  // Remaining VFX work
  { id: 'QHRriRcfpkY', title: 'Wave Machine',                     tracks: ['vfx']  },
  { id: 'HXQ49tZ1-tY', title: 'Cloth Simulation',                 tracks: ['vfx']  },
  { id: 'b7CHqixw8cQ', title: 'Old is Gold',                      tracks: ['vfx']  },
  { id: '5Aad-lyNx8Y', title: "A Dreamer's Journey",              tracks: ['vfx']  },
  { id: 'YroCwORIMFI', title: 'Satisfying Render',                tracks: ['vfx']  },
  { id: 'SJ91Ruc8WwE', title: 'Jet Propulsion',                   tracks: ['vfx']  },
  { id: 'hxXL16rxKkw', title: 'Green Moss',                       tracks: ['vfx']  },
  { id: 'E3MycwlH_xA', title: 'Lost Forest',                      tracks: ['vfx', 'film'] },
]

function LiteYouTube({ videoId, label }) {
  const [active, setActive] = useState(false)

  if (!videoId) {
    return (
      <div className="lite-yt lite-yt--empty">
        <span className="lite-yt__coming-soon">Reel coming soon</span>
      </div>
    )
  }

  if (active) {
    return (
      <div className="lite-yt">
        <iframe
          className="lite-yt__iframe"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div
      className="lite-yt"
      style={{ backgroundImage: `url(https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg)` }}
      onClick={() => setActive(true)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setActive(true)}
      aria-label={`Play ${label}`}
    >
      <button className="lite-yt__play" aria-hidden="true">
        <svg viewBox="0 0 68 48" width="68" height="48">
          <path className="lite-yt__play-bg" d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"/>
          <path className="lite-yt__play-arrow" d="M45 24 27 14v20"/>
        </svg>
      </button>
      <div className="lite-yt__label">{label}</div>
    </div>
  )
}

function VideoCard({ id, title }) {
  const [active, setActive] = useState(false)
  const thumb = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`

  return (
    <div className="vid-card">
      {active ? (
        <iframe
          className="vid-card__iframe"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <div
          className="vid-card__thumb"
          style={{ backgroundImage: `url(${thumb})` }}
          onClick={() => setActive(true)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setActive(true)}
          aria-label={`Play ${title}`}
        >
          <span className="vid-card__play">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </span>
        </div>
      )}
      <p className="vid-card__title">{title}</p>
    </div>
  )
}

const summaries = {
  vfx: 'I do not believe I am naturally talented or gifted, but I do believe that if I keep trying, learning, and finding new ways to solve a problem, I will eventually crack it. That is how I approach life. As I have grown older, I have realized that life is not about asking why something is happening to me; it is about understanding what I can learn from it and how I can grow from it. That is why I connect so deeply with VFX and filmmaking. I want to create. I want to show people what is possible and remind them that the mind is the only real limit. VFX allows me to bring the impossible to life, and through film I can create worlds, emotions, and ideas that inspire people. I create because that is what I know how to do. I create because that is who I am.',
  film: 'I do not believe I am naturally talented or gifted, but I do believe that if I keep trying, learning, and finding new ways to solve a problem, I will eventually crack it. That is how I approach life. As I have grown older, I have realized that life is not about asking why something is happening to me; it is about understanding what I can learn from it and how I can grow from it. That is why I connect so deeply with filmmaking and VFX. I want to create. I want to show people what is possible and remind them that the mind is the only real limit. Through film I can create worlds, emotions, and ideas that inspire people, and VFX allows me to bring the impossible to life. I create because that is what I know how to do. I create because that is who I am.',
}

const vfxExperience = [
  {
    period: '2025–2026',
    title: 'Resurgence',
    role: 'VFX Supervisor / Producer',
    type: 'VFX',
    bullets: [
      'Developed the original concept across a three-quarter pre-production, production, and post schedule, shaping a 10–13 minute sci-fi action short with roughly 80 VFX shots due in two months.',
      'Recruited and pitched to an 8-person VFX team, sound designers, and film crew; planned camera tests for tracking markers, marker removal, lens distortion grids, and 3D actor scans before production.',
      'Broke actor scan meshes into wrist, forearm, and upper-arm sections, then tracked live-action arm movement in Nuke with KeenTools GeoTracker using undistorted plates and tracking markers.',
      'Sent tracked meshes and 3D cameras into Maya, applied Substance Painter vein textures, rendered EXR passes with alpha channels, and composited heat distortion, lens dirt, motion blur, roto, redistortion, and final colorist handoff through a reusable Nuke script.',
    ],
  },
  {
    period: '2024–2025',
    title: 'Gatorade Become Greatness',
    role: 'Director / Project Manager',
    type: 'VFX',
    bullets: [
      'Directed a 30-second conceptual FIFA x Gatorade commercial in an LED volume, shaping performance, lighting, camera movement, live-action plates, and post-production requirements.',
      'Tested green screen versus LED-volume workflows, reviewed Unreal Engine environment performance, checked frame-rate latency, and planned color-space handling with EXR-based VFX delivery.',
      'Managed remote and in-person artists through picture lock, shot assignment, sound design, stadium atmosphere, music/foley, and troubleshooting across Nuke, Unreal Engine, Blender, and final plates.',
    ],
  },
  {
    period: '2024–2025',
    title: 'Bird Murmuration',
    role: 'Houdini Particle + Water Simulation',
    type: 'VFX',
    bullets: [
      'Pitched the concept to VFX artists and collaborated through multiple Houdini iterations to refine flocking patterns, water simulation, atmospheric staging, and shot composition.',
      'Managed heavy simulation/cache demands, including large water-sim cache transfers, while shaping a happy-accident murmuration pattern that briefly read as a giant bird in flight.',
      'Modeled and textured boat elements, used Houdini terrain tools for peaks and valleys, and rendered the final scene in Karma.',
    ],
  },
  {
    period: '2023–2024',
    title: 'Underworld',
    role: 'Maya Volumetric Fog',
    type: 'VFX',
    bullets: [
      'Built a stylized city environment in Maya using plugin-based city geometry, then optimized the selected location radius for the shot.',
      'Added volumetric fog, lighting, and a 3D-scanned object scaled into a giant parallel-dimension creature to create atmosphere and story scale.',
      'Used scale contrast, fog density, and lighting placement to sell the idea of a normal city being interrupted by a larger impossible world.',
    ],
  },
  {
    period: '2022–2023',
    title: 'RoboButler',
    role: '3D Modeler / Compositor / Animator',
    type: 'VFX',
    bullets: [
      'Shot a short live-action film under five minutes and modeled the robot in Blender, building an early full CG-to-plate integration workflow.',
      'Textured the character in Substance Painter and composited body, shadow, and contact-shadow render passes in After Effects.',
      'Used the project to establish a repeatable model, texture, render-pass, and composite workflow that influenced later live-action/CG work.',
    ],
  },
  {
    period: '2023–2026',
    title: 'SCADBound',
    role: 'Leader / Orientation Assistant',
    type: 'Leadership',
    bullets: [
      'Organized events and hosted meetups with other SCADBound leaders, supporting new students and families through campus transition programming.',
      'Led hour-long tours for groups of 30+ students and families, strengthening public communication, group leadership, and event coordination.',
      'Built confidence speaking to large groups while keeping information clear, welcoming, and organized under live event conditions.',
    ],
  },
  {
    period: '2024–2026',
    title: 'Intramurals & Recreation',
    role: 'Assistant',
    type: 'Leadership',
    bullets: [
      'Created social media and content support for teams and individual players, helping promote student athletics and recreation programming.',
      'Refereed games across tennis, basketball, soccer, badminton, table tennis, and pickleball while supporting meetup tables to recruit new players.',
      'Helped connect students with sports programs through in-person outreach, team promotion, and content ideas built around participation.',
    ],
  },
]

const filmExperience = [
  {
    period: '2024–2026',
    title: 'ChefATL, Emmy Award-Winning Docuseries',
    role: 'Season 1 Episodes 6, 7 & 9 — Camera B Operator',
    type: 'Film',
    bullets: [
      'Started as 1st AC for C camera and moved into the Camera B Operator role, operating an ARRI Alexa Mini with an Optimo Ultra 24-290mm setup weighing roughly 40–50 pounds.',
      'Shot three episodes using Micro Force zoom control while operating, capturing interviews, B-roll, studio days, field days, and reshoots around Ponce City Market in Atlanta.',
      'Worked with Chapman dolly and extender setups during studio and field coverage, maintaining documentary framing, long-lens stability, and responsive unscripted camera movement.',
    ],
  },
  {
    period: '2025–2026',
    title: 'Resurgence',
    role: 'Producer / VFX Supervisor',
    type: 'Film',
    bullets: [
      'Developed the original concept across pre-production, production, and post, helping shape a 10–13 minute sci-fi action story with roughly 80 VFX shots.',
      'Gathered the artist and crew team, pitched the project across VFX, sound, and film departments, and supported camera tests for tracking markers, lens grids, and post workflow.',
      'Balanced producer responsibilities with VFX supervision, including actor scans, shot-day troubleshooting, plate organization, colorist handoff, and final shot delivery.',
    ],
  },
  {
    period: '2025–2026',
    title: "Erica's Erotica",
    role: 'Camera Operator',
    type: 'Film',
    bullets: [
      'Operated ARRI Alexa Mini with Cooke lenses on a handheld shoulder rig for six shoot days across school, commercial, and residential locations.',
      'Carried a roughly 20–30 pound handheld setup through emotionally driven coverage, including a one-minute oner following an actor while running.',
      'Shot compact car interiors from the back seat with the camera on my shoulder, balancing physical movement, actor blocking, framing, eyelines, and continuity.',
    ],
  },
  {
    period: '2024–2025',
    title: 'Gatorade Become Greatness',
    role: 'Director / Project Manager',
    type: 'Film',
    bullets: [
      'Directed a 30-second conceptual FIFA x Gatorade commercial in an LED volume, shaping performance, camera movement, lighting, and project coordination.',
      'Led pre-production decisions around green screen versus LED volume, then coordinated crew, Unreal environment tests, camera movement, and post handoff.',
      'Worked through multiple cuts, sound design, stadium atmosphere, music, and foley while managing remote and in-person VFX collaboration.',
    ],
  },
  {
    period: '2024–2025',
    title: 'Fly on the Wall',
    role: 'Camera Operator',
    type: 'Film',
    bullets: [
      'Operated handheld for a seven-day multicam reality series setup with 7–8 camera operators, often with more than half the cameras rolling at once.',
      'Captured unscripted action on Blackmagic cameras with a 6mm lens, staying responsive to movement, overlapping action, coverage gaps, and reality-style story beats.',
      'Maintained awareness of other operators and story coverage so handheld camera movement supported the larger multicam edit.',
    ],
  },
  {
    period: '2023–2026',
    title: 'SCADBound',
    role: 'Leader / Orientation Assistant',
    type: 'Leadership',
    bullets: [
      'Supported orientation programming through team-building, community events, poster/design support, and camera coverage for student-facing media.',
      'Helped create a welcoming student experience while strengthening communication, event logistics, and small-team coordination skills.',
    ],
  },
  {
    period: '2024–2026',
    title: 'SCADfit',
    role: 'Student Lead / Front Desk Assistant',
    type: 'Leadership',
    bullets: [
      'Oversaw student staff as a Student Lead, assigning tasks, supporting front-desk operations, and helping keep the facility maintained and ready for use.',
      'Earned CPR certification for emergency readiness and created promotional social media content and challenges highlighting staff and fitness center activity.',
    ],
  },
  {
    period: '2024–2026',
    title: 'Intramurals & Recreation',
    role: 'Assistant',
    type: 'Leadership',
    bullets: [
      'Supported social media content ideas, brainstormed ways to improve reach, and helped with camera coverage for student recreation.',
      'Assisted with refereeing and event setup, adding practical experience in live-event coordination and team communication.',
    ],
  },
]

const skills = {
  vfx: {
    Technical: [
      'Houdini Particle Simulation',
      'Water & Cloth Simulation',
      'Nuke Compositing',
      'On-Set VFX Supervision',
      'Lighting for VFX Plates',
      'Live-Action / CG Integration',
    ],
    Software: ['Houdini', 'Autodesk Maya', 'Blender', 'Nuke', 'Substance Painter', 'After Effects', 'Photoshop', 'Illustrator'],
    Hardware: ['Alexa Mini', 'RED Raptors', 'RED Komodos', 'Blackmagic Pocket 6K', 'Sony A7 IV', 'HMI Lights (Joker)', 'Nanlite', 'Zoom Recorder Kit'],
    Programming: ['Python', 'HTML'],
  },
  film: {
    Technical: [
      'Cinema Camera Operation',
      'Handheld & Multicam Coverage',
      'Shot Composition',
      'Narrative & Documentary Lighting',
      'On-Set VFX Problem Solving',
      'Producer-Level Coordination',
    ],
    Software: ['Houdini', 'Autodesk Maya', 'Blender', 'Nuke', 'Substance Painter', 'After Effects', 'Photoshop', 'Illustrator'],
    Hardware: ['Alexa Mini', 'RED Raptors', 'RED Komodos', 'Blackmagic Pocket 6K', 'Sony A7 IV', 'HMI Lights (Joker)', 'Nanlite', 'Zoom Recorder Kit'],
    Programming: ['Python', 'HTML'],
  },
}

const education = [
  {
    degree: 'BFA, Visual Effects (STEM)',
    school: 'Savannah College of Art and Design, USA',
    period: '2022–2026',
  },
  {
    degree: 'High School, Science',
    school: 'Carmel Senior Secondary School, India',
    period: '2019–2021',
  },
]

const typeColors = {
  VFX: '#e87640',
  Film: '#c03258',
  Leadership: '#888',
}

export default function Resume() {
  const [track, setTrack] = useState('vfx')

  const experience = track === 'vfx' ? vfxExperience : filmExperience
  const activeSkills = skills[track]

  return (
    <main className="resume-page">

      <div className="page-hero">
        <p className="page-hero__eyebrow">Experience &amp; Skills</p>
        <h1 className="page-hero__title">Resume</h1>
      </div>

      <div className="resume-inner">

        <div className="resume-tabs">
          <button
            className={`resume-tab${track === 'vfx' ? ' resume-tab--active' : ''}`}
            onClick={() => setTrack('vfx')}
          >
            VFX Artist
          </button>
          <button
            className={`resume-tab${track === 'film' ? ' resume-tab--active' : ''}`}
            onClick={() => setTrack('film')}
          >
            Filmmaker
          </button>
        </div>

        <div className="resume-reel">
          <LiteYouTube
            videoId={FEATURED[track].id}
            label={FEATURED[track].title}
          />
        </div>

        <div className="resume-video-grid">
          {VIDEOS.filter(v => v.tracks.includes(track)).map(v => (
            <VideoCard key={v.id} id={v.id} title={v.title} />
          ))}
        </div>

        <div className="resume-summary">
          <p>{summaries[track]}</p>
        </div>

        <div className="resume-layout">

          <div className="resume-main">

            <section className="resume-section">
              <div className="section-header">
                <h2 className="section-title">Experience</h2>
                <div className="section-line" />
              </div>
              <div className="timeline">
                {experience.map((item, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-item__left">
                      <span className="timeline-item__year">{item.period}</span>
                      <span
                        className="timeline-item__type"
                        style={{ color: typeColors[item.type] }}
                      >
                        {item.type}
                      </span>
                    </div>
                    <div className="timeline-item__right">
                      <h3 className="timeline-item__title">{item.title}</h3>
                      <p className="timeline-item__org">{item.role}</p>
                      <ul className="timeline-item__bullets">
                        {item.bullets.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="resume-section">
              <div className="section-header">
                <h2 className="section-title">Education</h2>
                <div className="section-line" />
              </div>
              {education.map((edu, i) => (
                <div key={i} className="edu-card">
                  <span className="edu-card__period">{edu.period}</span>
                  <h3 className="edu-card__degree">{edu.degree}</h3>
                  <p className="edu-card__school">{edu.school}</p>
                </div>
              ))}
            </section>

          </div>

          <aside className="resume-sidebar">
            {Object.entries(activeSkills).map(([cat, list]) => (
              <div key={cat} className="skill-group">
                <h3 className="skill-group__title">{cat}</h3>
                <div className="skill-tags">
                  {list.map(s => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                </div>
              </div>
            ))}

            <div className="sidebar-contact">
              <h3 className="skill-group__title">Contact</h3>
              <a href="mailto:akshatgobind56@gmail.com" className="sidebar-email">
                akshatgobind56@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/akshat-gobind-796312247" target="_blank" rel="noreferrer" className="sidebar-link">
                LinkedIn ↗
              </a>
              <a href="https://www.youtube.com/@AkshatGobind" target="_blank" rel="noreferrer" className="sidebar-link">
                YouTube ↗
              </a>
            </div>

            <a
              href="/VFXResume2026_AkshatGobind.pdf"
              download
              className="btn btn--primary sidebar-download"
            >
              Download VFX Resume
            </a>
            <a
              href="/FilmResume2026_AkshatGobind.pdf"
              download
              className="btn sidebar-download"
            >
              Download Film Resume
            </a>
          </aside>

        </div>
      </div>
    </main>
  )
}
