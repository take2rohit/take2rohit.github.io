// Portfolio data extracted from take2rohit/take2rohit.github.io
window.PORTFOLIO = {
  about: {
    name: "Rohit Lal",
    initials: "RL",
    expertise: "Computer Vision · Generative AI · NLP",
    location: "National Space Science and Technology Center, Huntsville, AL",
    bio: [
      "**Computer Scientist at NASA IMPACT**, building and scaling **AI Foundation Models for Science**.",
      "**MS by Research, UC Riverside** under Prof. Amit K. Roy-Chowdhury — thesis on **3D human pose estimation** for the **IARPA BRIAR** project.",
      "Previously at **IISc Bangalore's Visual Computing Lab** working on **unsupervised domain adaptation** and **adversarial robustness**.",
      "Outside research: hiking, photography, video editing, table tennis."
    ],
    links: [
      { label: "github", url: "https://github.com/take2rohit/" },
      { label: "linkedin", url: "https://in.linkedin.com/in/rohit-lal" },
      { label: "scholar", url: "https://scholar.google.com/citations?user=q2nc3QoAAAAJ" },
      { label: "twitter", url: "https://twitter.com/take2rohit" },
      { label: "email", url: "mailto:take2rohit@gmail.com" },
    ]
  },
  experience: [
    {
      company: "NASA IMPACT",
      url: "https://www.earthdata.nasa.gov/esds/impact",
      title: "Computer Scientist II",
      date: "May 2024 — Present",
      location: "Huntsville, AL",
      desc: "Building AI Foundation Models for Science (Surya, Prithvi WxC). Cross-team collaboration with NASA, IBM Research, and the open-science community."
    },
    {
      company: "UC Riverside — Video Computing Group",
      url: "https://vcg.ece.ucr.edu/amit",
      title: "Graduate Researcher (MS by Research)",
      date: "Jan 2022 — May 2024",
      location: "Riverside, CA",
      desc: "Thesis on occlusion-robust 3D human pose estimation under Prof. Amit K. Roy-Chowdhury for the IARPA BRIAR program."
    },
    {
      company: "Indian Institute of Science (IISc)",
      url: "https://iisc.ac.in/",
      title: "Project Assistant, Visual Computing Lab",
      date: "Jul 2021 — Dec 2021",
      location: "Bengaluru, India",
      desc: "Research on unsupervised domain adaptation under Dr. Anirban Chakraborty at the Department of Computational and Data Sciences."
    },
    {
      company: "DRDO — CAIR Lab",
      url: "https://drdo.gov.in/",
      title: "Computer Vision Research Intern",
      date: "Jul 2020 — Sept 2020",
      location: "Bengaluru, India",
      desc: "Object detection and tracking pipeline for drone cameras at 100m altitude; pixel-wise pose estimation and GPS coordinate extraction."
    },
    {
      company: "National University of Singapore",
      url: "http://www.nus.edu.sg/",
      title: "Deep Learning Research Intern (Remote)",
      date: "Apr 2020 — Nov 2020",
      location: "Singapore",
      desc: "Tracking gaits of origami robots under Prof. Hongliang Ren at the Medical Mechatronics Lab; 6D pose estimation pipeline."
    },
    {
      company: "IEEE VNIT Student Branch",
      url: "https://www.ieee.org/",
      title: "Chairman",
      date: "Jul 2019 — Jul 2020",
      location: "VNIT Nagpur, India",
      desc: "Led the council of the technical society; ran initiatives and workshops across the student body."
    }
  ],
  news: [
    { date: "Apr '26", desc: "Surya Foundation Model team received the **Research Impact Award**." },
    { date: "Mar '26", desc: "Lightning talk + Deep Partnership panel (with NVIDIA) at the [**NAIRR Pilot '26**](https://nairrpilot.org/) Annual Meeting." },
    { date: "Jan '26", desc: "AI Foundation Model team honored with **NASA's Group Achievement Award** at [Marshall Space Flight Center](https://www.nasa.gov/marshall/)." },
    { date: "Oct '25", desc: "Recognized as an **Outstanding Reviewer** at [ICCV '25](https://iccv2025.thecvf.com/)." },
    { date: "Aug '25", desc: "Released **Surya** — Foundation Model for HelioPhysics. [arXiv](https://arxiv.org/abs/2508.14112) · [code](https://github.com/NASA-IMPACT/Surya)" },
    { date: "Jul '25", desc: "[*Layer-wise Alignment*](https://arxiv.org/abs/2411.04291) accepted as **SPOTLIGHT** at ICML 2025 (Top 2.6%)." },
    { date: "Jun '25", desc: "[*VOccl3D*](https://arxiv.org/abs/2503.17556) — Video benchmark for 3D human pose under occlusion — accepted at **ICCV 2025**." },
    { date: "Apr '25", desc: "Reviewer for CVPR 2025, ICLR 2025, ICCV 2025." },
    { date: "Feb '25", desc: "Oral presentation of MS thesis [**STRIDE**](https://sites.google.com/ucr.edu/stride/home) at WACV 2025." },
    { date: "Sep '24", desc: "Team released [**Prithvi WxC**](https://arxiv.org/abs/2409.13598), a foundation model for weather and climate." },
    { date: "May '24", desc: "Joined [**NASA IMPACT**](https://www.earthdata.nasa.gov/esds/impact) as Computer Scientist II." },
    { date: "Nov '23", desc: "*Self-Supervised Human Silhouette Extraction under Occlusion* accepted at WACV 2024." },
    { date: "Jul '23", desc: "[*Source-free Pose Adaptation*](https://openaccess.thecvf.com/content/ICCV2023/papers/Raychaudhuri_Prior-guided_Source-free_Domain_Adaptation_for_Human_Pose_Estimation_ICCV_2023_paper.pdf) accepted at ICCV 2023." },
    { date: "Mar '23", desc: "[*Class Aware Frequency Transformation*](https://link.springer.com/article/10.1007/s11263-023-01777-y) accepted to **IJCV**." },
    { date: "Oct '22", desc: "[*CoNMix for Source-free Multi-target Domain Adaptation*](https://sites.google.com/view/conmix-vcl) accepted at WACV 2023." },
    { date: "Aug '20", desc: "**1st place at Smart India Hackathon 2020** — cash prize ₹1,00,000." },
  ],
  publications: [
    {
      key: "schmude24",
      year: 2024,
      title: "Prithvi WxC: Foundation Model for Weather and Climate",
      authors: ["J. Schmude", "S. Roy", "W. Trojak", "J. Jakubik", "D. Salles Civitarese", "S. Singh", "J. Kuehnert", "K. Ankur", "A. Gupta", "C. E. Phillips", "R. Kienzler", "D. Szwarcman", "V. Gaur", "R. Shinde", "R. Lal", "A. Da Silva", "et al."],
      venue: "arXiv:2409.13598",
      links: [
        { label: "paper", url: "https://arxiv.org/abs/2409.13598" },
        { label: "code",  url: "https://github.com/NASA-IMPACT/Prithvi-WxC" },
      ]
    },
    {
      key: "surya25",
      year: 2025,
      title: "Surya: A Foundation Model for Heliophysics",
      authors: ["S. Roy", "S. Sundaresan", "D. Szwarcman", "J. Jakubik", "R. Lal", "et al."],
      venue: "arXiv:2508.14112",
      links: [
        { label: "paper", url: "https://arxiv.org/abs/2508.14112" },
        { label: "code",  url: "https://github.com/NASA-IMPACT/Surya" },
      ]
    },
    {
      key: "lal25stride",
      year: 2025,
      title: "STRIDE: Single-Video Based Temporally Continuous Occlusion-Robust 3D Pose Estimation",
      authors: ["R. Lal", "S. Bachu", "Y. Garg", "A. Dutta", "C. Ta", "H. D. Cruz", "A. Roy-Chowdhury"],
      venue: "WACV 2025 (Oral)",
      links: [
        { label: "project", url: "https://sites.google.com/ucr.edu/stride/home" },
        { label: "code",    url: "https://github.com/take2rohit/STRIDE" },
      ]
    },
    {
      key: "voccl3d25",
      year: 2025,
      title: "VOccl3D: A Video Benchmark for 3D Human Pose Estimation Under Occlusion",
      authors: ["Y. Garg", "R. Lal", "S. Bachu", "A. Dutta", "C. Ta", "A. Roy-Chowdhury"],
      venue: "ICCV 2025",
      links: [
        { label: "paper", url: "https://arxiv.org/abs/2503.17556" },
      ]
    },
    {
      key: "layerwise25",
      year: 2025,
      title: "Layer-wise Alignment: Examining Safety Alignment Across Image Encoder Layers in VLMs",
      authors: ["S. Bachu", "P. Lohia", "R. Lal", "A. Dutta", "C. Ta", "A. Roy-Chowdhury"],
      venue: "ICML 2025 (Spotlight, top 2.6%)",
      links: [
        { label: "paper", url: "https://arxiv.org/abs/2411.04291" },
      ]
    },
    {
      key: "raychaudhuri23",
      year: 2023,
      title: "Prior-Guided Source-Free Domain Adaptation for Human Pose Estimation",
      authors: ["D. Raychaudhuri", "C. Ta", "A. Dutta", "R. Lal", "A. Roy-Chowdhury"],
      venue: "ICCV 2023",
      links: [
        { label: "paper", url: "https://openaccess.thecvf.com/content/ICCV2023/papers/Raychaudhuri_Prior-guided_Source-free_Domain_Adaptation_for_Human_Pose_Estimation_ICCV_2023_paper.pdf" },
        { label: "code",  url: "https://github.com/driptaRC/POST" },
      ]
    },
    {
      key: "caft23",
      year: 2023,
      title: "Class-Aware Frequency Transformation for Reducing Domain Discrepancy",
      authors: ["V. Kumar", "R. Lal", "H. Patil", "A. Chakraborty"],
      venue: "International Journal of Computer Vision (IJCV)",
      links: [
        { label: "paper", url: "https://link.springer.com/article/10.1007/s11263-023-01777-y" },
      ]
    },
    {
      key: "kumar23conmix",
      year: 2023,
      title: "CoNMix for Source-Free Single and Multi-Target Domain Adaptation",
      authors: ["V. Kumar*", "R. Lal*", "H. Patil", "A. Chakraborty"],
      venue: "WACV 2023",
      links: [
        { label: "project", url: "https://sites.google.com/view/conmix-vcl" },
      ]
    },
    {
      key: "nayak22",
      year: 2022,
      title: "Holistic Approach to Measure Sample-Level Adversarial Vulnerability and its Utility in Building Trustworthy Systems",
      authors: ["G. K. Nayak*", "R. Rawal*", "R. Lal*", "H. Patil", "A. Chakraborty"],
      venue: "HCIS Workshop, CVPR 2022",
      links: [
        { label: "project", url: "https://sites.google.com/view/sample-adv-trustworthy/" },
      ]
    },
  ],
  projects: [
    {
      title: "Person Follower Mobile Robot",
      glyph: "PF",
      color: "oklch(0.65 0.14 250)",
      abstract: "Multiplexed detection-and-tracking pipeline for a person-following robot using a stereo camera in real-time. Built on TurtleBot-2 with ROS.",
      tags: ["ROS", "PyTorch", "stereo"],
      github: "https://github.com/khush3/person_following_bot",
      paper: "https://drive.google.com/open?id=17Xxn3PumStUPc01p46W6luhm79xsPaNj",
      video: "https://www.youtube.com/watch?v=XnrbU1050ls"
    },
    {
      title: "Indian Number Plate Recognition",
      glyph: "NP",
      color: "oklch(0.62 0.16 5)",
      abstract: "Robust ALPR pipeline that extracts plate, model, speed, and timestamps to a centralized IoT-integrated database. Won 1st at SIH 2020.",
      tags: ["OpenCV", "IoT", "ALPR"],
      github: "https://github.com/conspicio-ai/alpr",
      video: "https://youtu.be/Y-EuzsubixI"
    },
    {
      title: "Solving Taxi-v3 (OpenAI Gym)",
      glyph: "RL",
      color: "oklch(0.65 0.14 145)",
      abstract: "Q-Learning agent for the Taxi-v3 environment. Consistently top-5 on the OpenAI Gym leaderboard.",
      tags: ["RL", "Q-Learning"],
      github: "https://github.com/take2rohit/taxi_v3_openai",
    },
    {
      title: "Self-Balancing Camera Platform",
      glyph: "SB",
      color: "oklch(0.62 0.14 295)",
      abstract: "Control system to stabilize a camera gimbal for airborne tracking, surveillance, and aerial photography. Selected for SIH-20.",
      tags: ["Control", "IMU", "PID"],
      github: "https://github.com/take2rohit/self-balancing-platform",
      video: "https://www.youtube.com/watch?v=1D1ZQ6mKg0k"
    },
    {
      title: "Word Embeddings from Scratch",
      glyph: "W2V",
      color: "oklch(0.6 0.14 70)",
      abstract: "Reimplementation of Word2Vec — Skip-Gram and N-Gram models. A first step into modern NLP.",
      tags: ["NLP", "Word2Vec"],
      github: "https://github.com/take2rohit/NLP_word_embedding",
    },
    {
      title: "Real-Time Handwritten Digit Recognition",
      glyph: "MNST",
      color: "oklch(0.62 0.14 200)",
      abstract: "MNIST classifier built from scratch in NumPy. Mentored as a summer project at IvLabs, VNIT.",
      tags: ["NumPy", "CNN"],
      github: "https://github.com/GlazeDonuts/Summer-Project-2019",
      video: "https://www.youtube.com/watch?v=SCYhVTUIdoo"
    },
  ],
  skills: [
    { name: "Python",     level: 95, color: "oklch(0.62 0.14 245)" },
    { name: "PyTorch",    level: 92, color: "oklch(0.62 0.16 30)"  },
    { name: "TensorFlow", level: 78, color: "oklch(0.65 0.14 60)"  },
    { name: "OpenCV",     level: 88, color: "oklch(0.62 0.14 145)" },
    { name: "C/C++",      level: 75, color: "oklch(0.55 0.13 245)" },
    { name: "MATLAB",     level: 72, color: "oklch(0.62 0.14 30)"  },
    { name: "LaTeX",      level: 86, color: "oklch(0.55 0.13 145)" },
    { name: "GCP",        level: 70, color: "oklch(0.62 0.14 245)" },
    { name: "Git",        level: 90, color: "oklch(0.55 0.16 5)"   },
    { name: "Photoshop",  level: 65, color: "oklch(0.55 0.14 245)" },
    { name: "Illustrator",level: 60, color: "oklch(0.62 0.14 60)"  },
    { name: "Arduino",    level: 70, color: "oklch(0.62 0.14 200)" },
  ]
};
