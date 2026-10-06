export type CVCategory = "all" | "it" | "uddannelse" | "omsorg";

export interface CVItem {
  id: string;
  title: string;
  organization: string;
  period: string;
  type: "Uddannelse" | "Erfaring" | "Frivilligt arbejde";
  category: "it" | "uddannelse" | "omsorg";
  description: string;
  tags: string[];
  bullets?: string[];
  personalCompetencies?: string[];
}

export const cvItems: CVItem[] = [
  {
    id: "ruc-master-digital-transformation",
    title: "MSc in Digital Transformation",
    organization: "Roskilde University (RUC)",
    period: "2026 - 2028 (expected)",
    type: "Uddannelse",
    category: "uddannelse",
    description: "Graduate study focused on digital transformation, technology strategy, data and business integration, governance, and organizational change.",
    tags: ["Digital Transformation", "IT Strategy", "RUC", "Leadership"],
    bullets: [
      "Exploring digital transformation in complex organizations with focus on strategy, governance, and technology adoption.",
      "Developing a bridge between business needs, process change, and digital capability building.",
      "Strengthening analytical and strategic thinking within an IT and business context."
    ]
  },
  {
    id: "zealand-professionsbachelor",
    title: "Professionsbachelor i Økonomi & IT",
    organization: "Zealand – Sjællands Erhvervsuddannelser",
    period: "2022 - 2026",
    type: "Uddannelse",
    category: "uddannelse",
    description: "Applied business and IT degree combining business processes, digitalization, project management, cybersecurity, and data analysis.",
    tags: ["Økonomi", "IT", "Dataanalyse", "Cybersecurity", "Projektledelse"],
    bullets: [
      "Built strong foundations in process optimization, digital tools, and technology-enabled business operations.",
      "Worked with business analysis, data-driven decision-making, and practical system understanding.",
      "Combined technical and commercial thinking through project work and applied study assignments."
    ]
  },
  {
    id: "royal-unibrew-pmo",
    title: "Junior Project Manager / PMO Intern",
    organization: "Royal Unibrew",
    period: "2025",
    type: "Erfaring",
    category: "it",
    description: "Supported cross-functional IT/OT and cybersecurity projects with governance, stakeholder coordination, reporting, and Power BI-driven project insight.",
    tags: ["Project Management", "PMO", "Power BI", "Azure DevOps", "Stakeholder Management"],
    bullets: [
      "Coordinated project reporting, meeting structure, and stakeholder communication across technology and operations teams.",
      "Worked with Azure DevOps governance, project tracking, and process improvement for digital initiatives.",
      "Created Power BI dashboards and project reporting from ProjectFlow to improve transparency and business follow-up."
    ],
    personalCompetencies: [
      "Struktureret og organiseret i komplekse projektforløb",
      "Stærk i samarbejde på tværs af IT, OT og forretning",
      "Analytisk, nysgerrig og god til at omsætte data til handling",
      "Ansvarsbevidst i opfølgning, koordinering og kommunikation"
    ]
  },
  {
    id: "zealand-it-student-assistant",
    title: "IT Medarbejder / Student Assistant",
    organization: "Zealand IT",
    period: "2025 - 2026",
    type: "Erfaring",
    category: "it",
    description: "Delivered user support, digital systems operations, and documentation support across Microsoft 365 and administrative IT processes.",
    tags: ["IT Support", "Microsoft 365", "Documentation", "Digital Systems"],
    bullets: [
      "Provided day-to-day IT support and troubleshooting for staff and users across digital systems.",
      "Maintained documentation, procedural support, and efficient handling of internal digital workflows.",
      "Contributed to the smooth operation of Microsoft 365 and shared business tools in a practical support environment."
    ],
    personalCompetencies: [
      "Tålmodig og serviceminded i mødet med brugere",
      "God til at fejlfinde og bevare overblikket under pres",
      "Pålidelig i dokumentation og opfølgning",
      "Fleksibel og hurtig til at lære nye systemer"
    ]
  },
  {
    id: "ss-rengoringservice",
    title: "IT-medarbejder / Administrativ medarbejder",
    organization: "S&S Rengøringservice",
    period: "Tidligere erfaring",
    type: "Erfaring",
    category: "it",
    description: "Arbejdede med IT-relaterede og administrative opgaver for S&S Rengøringsservice, herunder digital struktur, koordinering og daglig administrativ support.",
    tags: ["IT Support", "Administration", "Koordinering", "Digital Struktur"],
    bullets: [
      "Understøttede virksomheden med IT-opgaver, digital organisering og administrativ drift.",
      "Håndterede koordinering, dokumentation og praktiske opgaver med fokus på overblik og effektivitet."
    ],
    personalCompetencies: [
      "Struktureret og organiseret i administrative processer",
      "Selvstændig og ansvarsfuld i opgaveløsningen",
      "Serviceminded og løsningsorienteret",
      "God til at skabe digitalt og praktisk overblik"
    ]
  },
  {
    id: "badr-fight-club",
    title: "Træner / Servicedesk-medarbejder",
    organization: "Badr Fight Club",
    period: "Tidligere erfaring",
    type: "Erfaring",
    category: "omsorg",
    description: "Arbejdede som træner og på servicedesk i et aktivt klubmiljø med ansvar for medlemmer, praktisk support, koordinering og daglig drift.",
    tags: ["Træning", "Servicedesk", "Medlemsservice", "Kommunikation", "Ansvar"],
    bullets: [
      "Planlagde og gennemførte træning samt støttede medlemmer i deres udvikling.",
      "Sikrede service desk-support, besvarede spørgsmål og hjalp med praktiske klubopgaver.",
      "Bidrog til et trygt, positivt og struktureret miljø for medlemmer og aktiviteter."
    ],
    personalCompetencies: [
      "Disciplineret og motiverende i et aktivt miljø",
      "Samarbejdsorienteret og god til at skabe positiv energi",
      "Kommunikerer respektfuldt med forskellige mennesker",
      "Ansvarsbevidst og løsningsorienteret"
    ]
  },
  {
    id: "taastrupgaard-kindergarten",
    title: "Pædagogmedhjælper / Vikar",
    organization: "Børnehave i Taastrupgaard",
    period: "Tidligere erfaring",
    type: "Erfaring",
    category: "omsorg",
    description: "Arbejdede i børnehave med fokus på børnenes trivsel, tryghed, leg og daglige aktiviteter.",
    tags: ["Omsorg", "Børn", "Trivsel", "Samarbejde"],
    bullets: [
      "Støttede børnene i leg, læring og sociale aktiviteter i hverdagen.",
      "Samarbejdede med det pædagogiske personale om en tryg og struktureret dag.",
      "Håndterede forskellige situationer med tålmodighed, nærvær og ansvar."
    ],
    personalCompetencies: [
      "Tålmodig, empatisk og nærværende",
      "Ansvarsfuld i arbejdet med børn",
      "God til at skabe tryghed og positive relationer",
      "Fleksibel og rolig i en omskiftelig hverdag"
    ]
  },
  {
    id: "ab-catering-warehouse",
    title: "Lagermedarbejder",
    organization: "AB & Catering",
    period: "Tidligere erfaring",
    type: "Erfaring",
    category: "omsorg",
    description: "Arbejdede med lager- og logistikopgaver i cateringmiljø med fokus på orden, effektivitet og korrekt håndtering af varer.",
    tags: ["Lager", "Logistik", "Varehåndtering", "Effektivitet"],
    bullets: [
      "Håndterede varemodtagelse, sortering, plukning og organisering på lageret.",
      "Bidrog til, at varer og ordrer blev gjort klar effektivt og korrekt.",
      "Arbejdede struktureret og samarbejdede med kollegaer i et travlt miljø."
    ],
    personalCompetencies: [
      "Effektiv og arbejdsom",
      "Struktureret og omhyggelig med detaljer",
      "Stabil og punktlig",
      "Samarbejdsorienteret under tidspres"
    ]
  },
  {
    id: "royal-unibrew-bachelor-project",
    title: "Bachelorprojekt: OT Cyber Security & Data-Driven Project Management",
    organization: "Royal Unibrew",
    period: "2025 - 2026",
    type: "Erfaring",
    category: "it",
    description: "Bachelor project exploring OT cybersecurity and data-driven project management in a production-focused industrial setting.",
    tags: ["Cybersecurity", "OT", "Data-driven PM", "Industrial IT"],
    bullets: [
      "Examined cyber risk and governance in operational technology environments alongside digital transformation initiatives.",
      "Connected project management practice with data and reporting to improve decision support in complex operations.",
      "Produced an applied research project linking security, process thinking, and digital programme management."
    ]
  },
  {
    id: "volunteer-fire-watch",
    title: "Volunteer Fire Watch",
    organization: "CNS Security",
    period: "Selected experience",
    type: "Frivilligt arbejde",
    category: "omsorg",
    description: "Volunteer support in a safety-focused environment requiring vigilance, coordination, and professionalism under operational conditions.",
    tags: ["Safety", "Coordination", "Responsibility"],
    bullets: [
      "Supported fire watch and safety monitoring tasks in a structured operational setting.",
      "Maintained focus, communication, and situational awareness in high-responsibility environments."
    ],
    personalCompetencies: [
      "Opmærksom og rolig i situationer med ansvar",
      "Pålidelig i sikkerheds- og beredskabsopgaver",
      "God situationsfornemmelse og respekt for procedurer"
    ]
  },
  {
    id: "carecompagniet-contact",
    title: "Contact Person / Supporting Role",
    organization: "CareCompagniet",
    period: "Selected experience",
    type: "Frivilligt arbejde",
    category: "omsorg",
    description: "Supportive contact role focused on communication, trust, and practical coordination in a care-oriented setting.",
    tags: ["Communication", "Care", "Trust"],
    bullets: [
      "Acted as a reliable point of contact for people needing guidance, coordination, and practical support.",
      "Built strong interpersonal communication and empathy in care-related situations."
    ],
    personalCompetencies: [
      "Empatisk og tillidsskabende i relationer",
      "Tålmodig og god til at lytte",
      "Ansvarsfuld i opfølgning og støtte",
      "Stærk i personlig kommunikation"
    ]
  }
];

export function getCVItemById(id: string): CVItem | undefined {
  return cvItems.find((item) => item.id === id);
}
