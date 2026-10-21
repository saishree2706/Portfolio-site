export type VolunteerEntry = {
  org: string;
  role: string;
  period: string;
  cause: string[];
  impact: string[];
  description: string;
};

export const volunteering: VolunteerEntry[] = [
  {
    org: "Hostel Management — Campus I",
    role: "End-to-End Hostel Administrator",
    period: "2020 – 2022",
    cause: ["Community", "Operations"],
    impact: [
      "Managed complete end-to-end operations for a 200+ resident hostel",
      "Oversaw maintenance scheduling, resident welfare, and daily administration",
      "Streamlined complaint resolution, reducing turnaround time significantly",
    ],
    description:
      "Handled full hostel lifecycle — from facility coordination and resident welfare to administrative workflows and event management.",
  },
  {
    org: "Hostel Management — Campus II",
    role: "End-to-End Hostel Administrator",
    period: "2022 – 2023",
    cause: ["Community", "Operations"],
    impact: [
      "Led multi-block hostel administration and resident engagement",
      "Coordinated cross-functional teams across facilities, security, and welfare",
      "Improved resident satisfaction through proactive communication and issue tracking",
    ],
    description:
      "Expanded hostel leadership with greater scope — managing multiple blocks and building stronger resident community systems.",
  },
  {
    org: "Adaptive Rural Tourism Initiative",
    role: "Tech & Content Volunteer",
    period: "2023 – 2024",
    cause: ["Technology", "Content", "Rural Development"],
    impact: [
      "Built digital infrastructure to promote adaptive rural tourism experiences online",
      "Created social media content and documentation to expand audience reach",
      "Helped tech-enable local artisans and guides to connect with a wider audience",
    ],
    description:
      "Applied tech skills and content creation to bridge rural artisans and unique travel experiences with modern digital audiences.",
  },
];
