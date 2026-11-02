// The .ts extension matters: vite.config.ts and the scripts in /scripts load this file too.
import type { Portfolio } from './types.ts'

/*
 * Everything the site says lives in this file.
 *
 *  • [Square brackets] mark a placeholder. It appears on the page with a dotted
 *    underline so nothing slips through. Replace it with your own words and drop
 *    the brackets. `npm run check:content` lists whatever is left.
 *  • DRAFT marks starter copy written for your profile. Keep it, rewrite it or
 *    delete it so it sounds like you.
 *  • Links and buttons only appear once they have a real destination, so an
 *    empty string ('') simply hides them.
 *  • Images: run `npm run images -- path/to/photo.jpg` and paste the `image`
 *    entry it prints. Until then a labelled placeholder is shown.
 *
 * Facts below come from "Muhammad Shoaib - Resume" (October 2026).
 */

const location = 'Peshawar, Pakistan'

export const portfolio: Portfolio = {
  site: {
    // Your live address, e.g. 'https://muhammadshoaib.dev'. Link previews need it.
    url: '',
    title: 'Muhammad Shoaib — Data Science, Machine Learning & Computer Vision',
    description:
      'Portfolio of Muhammad Shoaib, a final-year Data Science student in Peshawar working on machine learning and computer vision. Projects: Jikimi AI and ParkinSense PK.',
    // 1200×630 preview image in /public. `npm run icons` regenerates it.
    ogImage: '/og-image.png',
    ogImageAlt: 'Muhammad Shoaib — Data Science, Machine Learning & Computer Vision',
  },

  person: {
    name: 'Muhammad Shoaib',
    // A square crop of the About portrait. Empty alt: your name sits right beside it.
    avatar: {
      src: '/images/avatar-224.webp',
      srcSet: '/images/avatar-112.webp 112w, /images/avatar-224.webp 224w',
      width: 224,
      height: 224,
      alt: '',
    },
    field: 'Data Science · Machine Learning · Computer Vision',
    // DRAFT: the positioning line under your name. `highlight` must be a phrase from it.
    statement: 'I build machine learning and computer vision systems for problems close to home.',
    highlight: 'problems close to home',
    intro:
      'Final-year Data Science student at CUSIT, Peshawar. Most of my work is in machine learning and computer vision, and lately I’ve been building with LLMs too.',
    availability: 'Open to AI/ML internships and junior roles',
    location,
    email: 'mohd.shoaib2903@gmail.com',
    // The PDF lives in /public. It includes your phone number, so that is public too.
    resumeUrl: '/Muhammad-Shoaib-Resume.pdf',
    socials: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/muhammad-shoaib-ds' },
      { label: 'GitHub', url: 'https://github.com/shiffu-ds' },
    ],
  },

  work: {
    title: 'Selected work',
    // DRAFT
    intro: 'Two projects I built end to end. Each one covers the problem, what I did, how I did it and where it stands.',
    projects: [
      {
        title: 'Jikimi AI',
        summary:
          'Street-crime alerts for the CCTV cameras that shops and housing societies already have, explained to guards in Urdu.',
        year: 'Oct 2026',
        role: 'Built end to end: models, backend and dashboard',
        tools: ['PyTorch', 'ST-GCN', 'YOLO', 'OpenVINO', 'FastAPI', 'PostgreSQL'],
        result: { value: '0.978', label: 'Test AUC of the pose-based snatch detector' },
        problem:
          'Shops and societies already have CCTV, but nobody watches it live, so footage usually helps only after a bike snatching has happened. Guards need a warning while it is happening.',
        contribution:
          'A system that runs on a laptop beside the existing cameras. It warns about bike snatching and notices bikes circling the same place before anything happens. Personal-safety alerts — a phone snatched on foot, someone followed or surrounded, a fall, a bike stolen, a crowd running — are based only on behaviour. No face recognition, and it never guesses gender, age or identity.',
        approach:
          'Trained an ST-GCN snatch detector in PyTorch on about 9,000 synthetic pose samples. Quantizing the YOLO models to INT8 with OpenVINO let an old i5 laptop handle 1.3 cameras instead of 0.9. Federated learning across three simulated sites reached 0.944 AUC against 0.954 for pooled data, with no pose data leaving a site; differential privacy at that size either broke the model or protected nothing.',
        outcome:
          'Alerts come with a short reason in Urdu, guards can search clips in Roman Urdu (“kal raat kaali bike 2 sawar”), and alerts go out by SMS during load-shedding. Zero false alarms in 30 hours of simulated normal traffic and 381 automated tests — but so far it has only run on a simulator and one real traffic video.',
        image: {
          src: '/images/jikimi-ai-640.webp',
          width: 640,
          height: 360,
          alt: 'Jikimi AI simulator camera view of a street with shops and a motorbike rider',
        },
        liveUrl: '',
        repoUrl: 'https://github.com/shiffu-ds/Jikimi-Ai',
      },
      {
        title: 'ParkinSense PK',
        summary: 'A web and Android app that tracks how Parkinson’s patients move between clinic visits.',
        year: 'Oct 2026',
        role: 'Built end to end: web app, Android app and analysis',
        tools: ['MediaPipe', 'OpenCV', 'librosa', 'FastAPI', 'PostgreSQL', 'Android'],
        result: { value: '536', label: 'Automated tests across patient, clinician and admin flows' },
        problem:
          'Between clinic visits, a clinician sees little of how a Parkinson’s patient actually moves day to day.',
        contribution:
          'Patients record short tasks — walking, finger tapping, spiral drawing and voice — and their clinician sees how each result changes between visits. Separate patient, clinician and admin access, in English, Urdu and Roman Urdu.',
        approach:
          'Movement is measured from video with MediaPipe and OpenCV, and voice with librosa. Every recording passes a quality check before the patient gets a 3D replay, simple statistics and a printable report. The backend runs on FastAPI and PostgreSQL.',
        outcome:
          'On public walking videos it accepted a clean clip and asked for a retake when tracking dropped for 1.1 seconds. That test also caught a bug where arm swing came from a barely visible wrist, which I fixed. It doesn’t diagnose anything and isn’t clinically validated yet.',
        image: {
          src: '/images/parkinsense-pk-1280.webp',
          srcSet: '/images/parkinsense-pk-800.webp 800w, /images/parkinsense-pk-1280.webp 1280w',
          width: 1280,
          height: 720,
          alt: 'ParkinSense PK 3D Movement Studio showing a tracked hand in 3D',
        },
        liveUrl: '',
        repoUrl: 'https://github.com/shiffu-ds/Parkinsense_PK',
      },
    ],
  },

  about: {
    title: 'About me',
    paragraphs: [
      'I’m a final-year Data Science student at CUSIT in Peshawar. Most of my work is in machine learning and computer vision, and lately I’ve been building with LLMs too.',
      'My two main projects are Jikimi AI, a CCTV system that warns guards about street crime in Urdu, and ParkinSense PK, which tracks how Parkinson’s patients move between clinic visits.',
      'With my team I finished in the top 20 at atomcamp’s National AI Hackathon (Agentic AI) in May 2026 with Burner AI. Right now I’m looking for an AI/ML internship or junior role.',
    ],
    facts: [
      { label: 'Currently', value: 'BS Data Science, CUSIT (final year)' },
      { label: 'Focus', value: 'Machine learning and computer vision' },
      { label: 'Based in', value: location },
    ],
    principlesTitle: 'How I work',
    // DRAFT: three working principles, drawn from how your two projects were built.
    principles: [
      {
        title: 'Build for the setup people have',
        body: 'Existing CCTV, an old laptop, SMS during load-shedding, Urdu and Roman Urdu: the system should fit the place, not the other way round.',
      },
      {
        title: 'Earn every number',
        body: 'Held-out tests, quality checks and error analysis come before any headline metric.',
      },
      {
        title: 'Say what it can’t do',
        body: 'Jikimi has only run on a simulator and one real video; ParkinSense isn’t clinically validated. Saying so up front is part of the work.',
      },
    ],
    portrait: {
      src: '/images/portrait-1122.webp',
      srcSet: '/images/portrait-800.webp 800w, /images/portrait-1122.webp 1122w',
      width: 1122,
      height: 1402,
      alt: 'Portrait of Muhammad Shoaib',
    },
  },

  experience: {
    title: 'Skills & experience',
    // DRAFT
    intro: 'Where I’ve worked, what I’m studying, and the tools I use.',
    roles: [
      {
        period: '[Start — End]',
        title: 'Automation and Deployment Engineer',
        org: 'MA Soft Tech',
        summary: '[One line on what you automated or deployed there.]',
        highlights: ['[A concrete thing you shipped or improved, and its result.]'],
      },
      {
        period: 'May 2026',
        title: 'Top 20, National AI Hackathon (Agentic AI)',
        org: 'atomcamp',
        summary: 'Team project: Burner AI.',
        highlights: [],
      },
    ],
    education: [
      {
        period: '2023 — 2027 (expected)',
        credential: 'BS in Data Science',
        institution: 'City University of Science and Information Technology (CUSIT), Peshawar',
        detail:
          'CGPA 3.18 / 4.00. Certification: The Ultimate Job Ready Data Science Course, CodeWithHarry (Sep 2025).',
      },
    ],
    skills: [
      { area: 'Languages', items: ['Python', 'C++', 'TypeScript', 'Java'] },
      {
        area: 'Machine & deep learning',
        items: [
          'PyTorch',
          'TensorFlow',
          'Scikit-learn',
          'XGBoost',
          'Hugging Face Transformers',
          'NLP',
          'Fine-tuning',
          'Federated learning',
        ],
      },
      {
        area: 'Computer vision',
        items: ['OpenCV', 'MediaPipe', 'YOLO', 'Object tracking', 'Pose estimation', 'ONNX', 'OpenVINO'],
      },
      {
        area: 'Generative AI',
        items: ['LLMs', 'LangChain', 'LangGraph', 'LangSmith', 'RAG', 'Multi-agent systems', 'OpenAI API'],
      },
      {
        area: 'Backend & MLOps',
        items: ['FastAPI', 'Flask', 'Streamlit', 'Docker', 'GitHub Actions', 'DVC', 'PostgreSQL', 'ChromaDB', 'Pinecone'],
      },
      {
        area: 'Data analysis',
        items: ['Pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Seaborn', 'Plotly', 'librosa', 'Statistical inference'],
      },
    ],
  },

  contact: {
    // DRAFT
    title: 'Hiring for an AI/ML internship or junior role? Let’s talk.',
    highlight: 'Let’s talk.',
    body: 'Email is the quickest way to reach me. I’m happy to walk through Jikimi AI or ParkinSense PK in more detail.',
  },
}
