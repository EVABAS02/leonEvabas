export const translations = {
  fr: {
    nav: {
      home: "ACCUEIL",
      about: "À PROPOS",
      skills: "COMPÉTENCES",
      services: "SERVICES",
      portfolio: "PORTFOLIO",
      faq: "FAQ",
      lets_talk: "DISCUTONS"
    },
    hero: {
      tag: "Vos concurrents ont un site",
      title: "Vous, vous aurez un site qui vend et convainc",
      title_highlight: "24h/24",
      description: "Interfaces claires, code robuste, automatisations qui font gagner du temps réel à votre entreprise.",
      btn_project: "Commençons un projet",
      btn_contact: "Me contacter",
      stats: {
        pme: "PME digitalisées",
        projects: "projets livrés",
        delay: "retard de livraison"
      },
      badges: {
        ui_ux: "UI/UX Design",
        web_dev: "Développement Web",
        nocode_ai: "No-Code & IA"
      }
    },
    about: {
      tag: "À PROPOS",
      title: "Le rare profil qui pense design, code et automatisation dans le même cerveau.",
      p1: "Diplômé en Systèmes Informatiques et Logiciels (SIL) et actuellement en formation UX Design sur OpenClassrooms, je conçois des interfaces et développe les systèmes qui les font fonctionner — de la maquette Figma jusqu'au déploiement en production.",
      p2: "Ce qui me différencie : je suis l'un des rares freelances à maîtriser le design UI/UX, le développement full stack (React, Next.js, Node.js, Flutter), et les écosystèmes no-code/AI. Vous parlez à une seule personne, pas à une chaîne d'intermédiaires.",
      p3: "Ma philosophie : un livrable n'est bon que s'il est utilisé. Je construis des produits qui répondent à de vrais problèmes métier, avec une attention aux détails qui se voient et à l'architecture qui ne se voit pas.",
      cta: "Voir mon CV"
    },
    skills: {
      tag: "COMPÉTENCES & EXPERTISES",
      title: "Du wireframe au déploiement , tout l'atelier en un.",
      categories: [
        {
          name: "DESIGN UI/UX",
          items: ["Figma", "Prototypage", "Wireframing", "User Research", "Design System", "Bento Grid Layout"]
        },
        {
          name: "DÉVELOPPEMENT FULL STACK",
          items: ["React", "Next.js", "TypeScript", "Node.js", "PHP (Laravel)", "Python", "SQL", "Tailwind CSS"]
        },
        {
          name: "DÉVELOPPEMENT MOBILE",
          items: ["Flutter", "Dart", "APIs REST natives", "Intégrations tierces"]
        },
        {
          name: "NO-CODE & AI ECOSYSTEM",
          items: ["Supabase", "Firebase", "Base44", "Glide", "AppSheet", "Lovable Dev", "Automatisations métier"]
        }
      ]
    },
    services: {
      tag: "Services",
      title: "Trois formules, zéro vague.",
      custom_cta: "→ Discutons-en",
      custom_text: "Besoin hors de ces formules ?",
      items: [
        {
          number: "01",
          tags: "ERP • FACTURATION • GESTION",
          title: "Système métier sur mesure",
          price_label: "Prix",
          delay_label: "Délai",
          prices: {
            fcfa: "À partir de 600 000 FCFA",
            eur: "≈ 915 €",
            usd: "≈ 1 000 $"
          },
          delay: "4 à 8 semaines",
          objection: "« C'est trop cher ? »",
          description: "Un système sur mesure remplace 2–3 outils SaaS à abonnement mensuel. Il rembourse son coût en 6 à 18 mois tout en éliminant les erreurs manuelles et les exports CSV à 2h du matin.",
          cta: "Parlons de votre projet",
          note: "Acompte 50 % à la signature."
        },
        {
          number: "02",
          tags: "DESIGN • WEB • MOBILE",
          title: "Refonte UI/UX + Développement",
          price_label: "Prix",
          delay_label: "Délai",
          prices: {
            fcfa: "À partir de 300 000 FCFA",
            eur: "≈ 460 €",
            usd: "≈ 500 $"
          },
          delay: "2 à 4 semaines",
          objection: "« Vous ne connaissez pas mon domaine ? »",
          description: "Je commence chaque projet par une phase de découverte — interviews, audit, benchmark. En deux ans j'ai travaillé sur des secteurs aussi différents que la restauration, l'éducation et la logistique. L'outil s'adapte au métier, pas l'inverse.",
          cta: "Demander un devis",
          note: "Acompte 50 % à la signature."
        },
        {
          number: "03",
          tags: "STRATÉGIE • MAQUETTES • VALIDATION",
          title: "Accompagnement Design Sprint",
          price_label: "Prix",
          delay_label: "Délai",
          prices: {
            fcfa: "150 000 FCFA / semaine",
            eur: "≈ 230 € / sem.",
            usd: "≈ 250 $ / wk"
          },
          delay: "1 à 2 semaines",
          objection: "« On peut pas juste commencer à coder ? »",
          description: "On peut. Et ça coûtera trois fois plus cher en corrections. Un sprint de maquettes réduit les allers-retours de développement de 60 à 80 %. La question n'est pas si vous pouvez vous permettre de le faire — c'est si vous pouvez vous permettre de ne pas le faire.",
          cta: "Réserver un sprint",
          note: "Acompte 50 % à la signature."
        }
      ]
    },
    portfolio: {
      tag: "PORTFOLIO",
      title: "Travaux récents",
      view_project: "Voir le projet",
      projects: [
        {
          title: "Moravi Web",
          category: "Site vitrine • Refonte UI/UX",
          tags: ["Next.js", "Figma", "SEO"]
        },
        {
          title: "Evabas Proforma",
          category: "SaaS • Logique fiscale béninoise",
          tags: ["React", "Supabase", "SaaS"]
        },
        {
          title: "Biscotino Web",
          category: "Site vitrine • Culturel",
          tags: ["React", "Animation"]
        }
      ]
    },
    contact: {
      tag: "CONTACT",
      title: "Un projet ? Une question ?",
      subtitle: "Discutons de votre architecture, de votre design ou de votre application. Réponse garantie sous 24h chrono.",
      success_title: "Message envoyé avec succès !",
      success_desc: "Je vous réponds sous 24h chrono.",
      name_label: "Nom / Entreprise",
      name_placeholder: "Ex: leon evabas",
      email_label: "Email professionnel",
      email_placeholder: "leon@example.com",
      subject_label: "Sujet",
      subject_placeholder: "Refonte site, Application SaaS...",
      budget_label: "Budget estimé",
      budget_default: "Choisir une tranche...",
      message_label: "Décrivez votre projet",
      message_placeholder: "Parlez-moi de vos objectifs, de votre vision...",
      submit_btn: "Envoyer le message"
    },
    faq: {
      tag: "FAQ",
      title: "Les vraies questions.",
      items: [
        {
          question: "Comment je sais que vous n'allez pas disparaître en cours de route ?",
          answer: "Chaque projet commence avec un contrat signé qui définit les étapes, les livrables et les jalons de paiement. Vous ne payez pas l'intégralité en avance — les paiements sont liés à des livrables concrets. Je travaille sur GitHub et des outils de gestion de projet accessibles au client à tout moment. Si quelque chose m'arrivait, vous auriez l'intégralité du code et des maquettes."
        },
        {
          question: "Le code m'appartient vraiment après paiement ?",
          answer: "Oui, intégralement. Le contrat stipule explicitement la cession des droits de propriété intellectuelle à la livraison du solde. Le code, les maquettes Figma, les assets — tout vous appartient. Je garde juste le droit de mentionner le projet dans mon portfolio, sauf si vous préférez la confidentialité."
        },
        {
          question: "Et si je veux changer des choses après la livraison ?",
          answer: "Les modifications mineures dans les 15 jours suivant la livraison sont incluses. Pour des évolutions plus importantes, je propose soit un devis ponctuel, soit un forfait maintenance mensuel. Les tarifs de maintenance sont précisés dans le contrat initial — pas de mauvaise surprise."
        },
        {
          question: "Vous pouvez reprendre un site déjà commencé par quelqu'un d'autre ?",
          answer: "Oui, avec un audit préalable. Je dois évaluer l'état du code existant (dette technique, sécurité, architecture) avant de m'engager sur un devis. Cet audit est facturé séparément et son coût est déduit du projet si vous me confiez la suite."
        },
        {
          question: "Qu'est-ce qui se passe si le projet prend du retard ?",
          answer: "Le contrat inclut des pénalités de retard s'appliquant dans les deux sens — à moi si je suis en retard sur mes engagements, à vous si les retards viennent de votre côté. Dans les faits, 0 retard à ce jour — parce que j'anticipe les risques en début de projet et que je préfère une discussion franche à une promesse en l'air."
        }
      ]
    },
    footer: {
      description: "Designer UI/UX & Développeur web et mobile. Je conçois des interfaces sur mesure, performantes et orientées conversion.",
      nav_title: "Navigation",
      social_title: "Réseaux",
      rights: "Tous droits réservés."
    },
    cv: {
      back_btn: "Retour à propos",
      print_btn: "Imprimer / Enregistrer en PDF",
      role: "UI/UX Designer & Développeur Web Full-Stack",
      quote: "Penser design, code et automatisation dans le même cerveau.",
      location: "Cotonou, Bénin",
      availability: "Freelance / Disponible",
      github_label: "github.com/EVABAS02",
      section_skills: "Compétences",
      section_formations: "Formations",
      section_experience: "Expériences Professionnelles",
      section_projects: "Projets Phares",
      skills_categories: [
        { name: "Design & UI/UX", items: "Figma, Architecture d'information, Wireframing" },
        { name: "Frontend", items: "React, Next.js, Tailwind CSS, HTML/CSS" },
        { name: "Backend & BDD", items: "Node.js, Python, Supabase, Firebase, SQL" },
        { name: "No-Code & Outils", items: "Glide, AppSheet, VS Code, Git, GitHub" }
      ],
      formations: [
        { date: "2024 — 2026", title: "Perfectionnement Tech", desc: "OpenClassrooms & Mentorat (Web & UI/UX)" },
        { date: "2023", title: "Licence Pro. SIL", desc: "Systèmes Informatiques et Logiciels" },
        { date: "2021 — 2022", title: "Dév. Web & Maintenance", desc: "Formation certifiante technique" }
      ],
      experiences: [
        {
          title: "Développeur Web & Intégrateur",
          period: "2025 — Présent",
          company: "Sté MORAVI (Importateur Continente, Vins & Alimentaire)",
          desc: "Conception et développement d'interfaces web dynamiques pour la vitrine des produits d'importation."
        },
        {
          title: "Gestion & Support Technique",
          period: "2024",
          company: "Supermarché FRANC-PRIX (Cadjèhoun)",
          desc: "Support technique informatique et optimisation numérique des flux et des inventaires."
        },
        {
          title: "Stagiaire Informatique",
          period: "2023",
          company: "CHUD-OP",
          desc: "Maintenance préventive/curative des parcs informatiques et assistance technique aux utilisateurs."
        }
      ],
      projects: [
        {
          name: "Evabas Proforma",
          badge: "Full-Stack",
          desc: "Génération automatisée de factures proforma sur mesure.",
          stack: "React, Tailwind, Supabase"
        },
        {
          name: "Moravi Showcase",
          badge: "Frontend",
          desc: "Plateforme web interactive de présentation de catalogue.",
          stack: "Figma, React, Tailwind CSS"
        }
      ]
    }
  },
  en: {
    nav: {
      home: "HOME",
      about: "ABOUT",
      skills: "SKILLS",
      services: "SERVICES",
      portfolio: "PORTFOLIO",
      faq: "FAQ",
      lets_talk: "LET'S TALK"
    },
    hero: {
      tag: "Your competitors have a website",
      title: "You will have a website that sells and converts",
      title_highlight: "24/7",
      description: "Clear interfaces, robust code, and automations that save your business real time.",
      btn_project: "Let's start a project",
      btn_contact: "Contact me",
      stats: {
        pme: "Digitalized SMBs",
        projects: "delivered projects",
        delay: "delivery delays"
      },
      badges: {
        ui_ux: "UI/UX Design",
        web_dev: "Web Development",
        nocode_ai: "No-Code & AI"
      }
    },
    about: {
      tag: "ABOUT",
      title: "The rare profile who thinks design, code, and automation in the same brain.",
      p1: "Degree in Computer Systems and Software (SIL) and currently in UX Design training at OpenClassrooms, I design interfaces and develop the systems that make them work — from Figma mockups to production deployment.",
      p2: "What sets me apart: I am one of the few freelancers proficient in UI/UX design, full stack development (React, Next.js, Node.js, Flutter), and no-code/AI ecosystems. You speak to a single person, not a chain of intermediaries.",
      p3: "My philosophy: a deliverable is only good if it gets used. I build products that solve real business problems, with attention to details you can see and architecture you can't.",
      cta: "View my resume"
    },
    skills: {
      tag: "SKILLS & EXPERTISE",
      title: "From wireframe to deployment , the whole studio in one.",
      categories: [
        {
          name: "UI/UX DESIGN",
          items: ["Figma", "Prototyping", "Wireframing", "User Research", "Design System", "Bento Grid Layout"]
        },
        {
          name: "FULL STACK DEVELOPMENT",
          items: ["React", "Next.js", "TypeScript", "Node.js", "PHP (Laravel)", "Python", "SQL", "Tailwind CSS"]
        },
        {
          name: "MOBILE DEVELOPMENT",
          items: ["Flutter", "Dart", "Native REST APIs", "Third-party integrations"]
        },
        {
          name: "NO-CODE & AI ECOSYSTEM",
          items: ["Supabase", "Firebase", "Base44", "Glide", "AppSheet", "Lovable Dev", "Business Automations"]
        }
      ]
    },
    services: {
      tag: "Services",
      title: "Three packages, zero hassle.",
      custom_cta: "→ Let's discuss it",
      custom_text: "Need something outside these packages?",
      items: [
        {
          number: "01",
          tags: "ERP • INVOICING • MANAGEMENT",
          title: "Custom Business System",
          price_label: "Price",
          delay_label: "Timeline",
          prices: {
            fcfa: "Starting from 600,000 FCFA",
            eur: "≈ €915",
            usd: "≈ $1,000"
          },
          delay: "4 to 8 weeks",
          objection: "« Too expensive? »",
          description: "A custom system replaces 2–3 monthly subscription SaaS tools. It pays for itself in 6 to 18 months while eliminating manual errors and 2 AM CSV exports.",
          cta: "Let's talk about your project",
          note: "50% deposit upon signature."
        },
        {
          number: "02",
          tags: "DESIGN • WEB • MOBILE",
          title: "UI/UX Redesign + Development",
          price_label: "Price",
          delay_label: "Timeline",
          prices: {
            fcfa: "Starting from 300,000 FCFA",
            eur: "≈ €460",
            usd: "≈ $500"
          },
          delay: "2 to 4 weeks",
          objection: "« You don't know my industry? »",
          description: "I start every project with a discovery phase — interviews, audit, benchmark. Over two years, I've worked across sectors as diverse as restaurants, education, and logistics. The tool adapts to the business, not the other way around.",
          cta: "Request a quote",
          note: "50% deposit upon signature."
        },
        {
          number: "03",
          tags: "STRATEGY • MOCKUPS • VALIDATION",
          title: "Design Sprint Coaching",
          price_label: "Price",
          delay_label: "Timeline",
          prices: {
            fcfa: "150,000 FCFA / week",
            eur: "≈ €230 / wk",
            usd: "≈ $250 / wk"
          },
          delay: "1 to 2 weeks",
          objection: "« Can't we just start coding? »",
          description: "We can. And it will cost three times more in revisions. A mockup sprint reduces development back-and-forth by 60 to 80%. The question isn't whether you can afford to do it — it's whether you can afford not to.",
          cta: "Book a sprint",
          note: "50% deposit upon signature."
        }
      ]
    },
    portfolio: {
      tag: "PORTFOLIO",
      title: "Recent Works",
      view_project: "View project",
      projects: [
        {
          title: "Moravi Web",
          category: "Showcase website • UI/UX Redesign",
          tags: ["Next.js", "Figma", "SEO"]
        },
        {
          title: "Evabas Proforma",
          category: "SaaS • Beninese tax logic",
          tags: ["React", "Supabase", "SaaS"]
        },
        {
          title: "Biscotino Web",
          category: "Showcase website • Cultural",
          tags: ["React", "Animation"]
        }
      ]
    },
    contact: {
      tag: "CONTACT",
      title: "A project? A question?",
      subtitle: "Let's discuss your architecture, design, or application. Guaranteed response within 24 hours.",
      success_title: "Message sent successfully!",
      success_desc: "I will get back to you within 24 hours.",
      name_label: "Name / Company",
      name_placeholder: "Ex: leon evabas",
      email_label: "Professional Email",
      email_placeholder: "leon@example.com",
      subject_label: "Subject",
      subject_placeholder: "Site redesign, SaaS application...",
      budget_label: "Estimated Budget",
      budget_default: "Choose a range...",
      message_label: "Describe your project",
      message_placeholder: "Tell me about your goals, your vision...",
      submit_btn: "Send message"
    },
    faq: {
      tag: "FAQ",
      title: "The real questions.",
      items: [
        {
          question: "How do I know you won't disappear halfway through?",
          answer: "Every project starts with a signed contract defining steps, deliverables, and payment milestones. You don't pay everything upfront — payments are tied to concrete deliverables. I work on GitHub and project management tools accessible to the client at all times. If anything happened to me, you would have the entire codebase and mockups."
        },
        {
          question: "Do I truly own the code after payment?",
          answer: "Yes, completely. The contract explicitly stipulates the transfer of intellectual property rights upon delivery of the final balance. The code, Figma mockups, assets — everything belongs to you. I only keep the right to mention the project in my portfolio, unless you prefer confidentiality."
        },
        {
          question: "What if I want to change things after delivery?",
          answer: "Minor tweaks within 15 days following delivery are included. For larger evolutions, I offer either a one-off quote or a monthly maintenance package. Maintenance rates are specified in the initial contract — no nasty surprises."
        },
        {
          question: "Can you take over a site started by someone else?",
          answer: "Yes, with a preliminary audit. I need to assess the state of the existing code (technical debt, security, architecture) before committing to a quote. This audit is billed separately and its cost is deducted from the project if you entrust me with the rest."
        },
        {
          question: "What happens if the project is delayed?",
          answer: "The contract includes reciprocal delay penalties — for me if I am late on my commitments, for you if delays come from your side. In practice, 0 delays to date — because I anticipate risks early on and prefer frank discussions over empty promises."
        }
      ]
    },
    footer: {
      description: "UI/UX Designer & Web/Mobile Developer. I build custom, high-performance, conversion-oriented interfaces.",
      nav_title: "Navigation",
      social_title: "Socials",
      rights: "All rights reserved."
    },
    cv: {
      back_btn: "Back to About",
      print_btn: "Print / Save as PDF",
      role: "UI/UX Designer & Full-Stack Web Developer",
      quote: "Thinking design, code, and automation in the same brain.",
      location: "Cotonou, Benin",
      availability: "Freelance / Available",
      github_label: "github.com/EVABAS02",
      section_skills: "Skills",
      section_formations: "Education",
      section_experience: "Professional Experience",
      section_projects: "Featured Projects",
      skills_categories: [
        { name: "Design & UI/UX", items: "Figma, Information Architecture, Wireframing" },
        { name: "Frontend", items: "React, Next.js, Tailwind CSS, HTML/CSS" },
        { name: "Backend & Database", items: "Node.js, Python, Supabase, Firebase, SQL" },
        { name: "No-Code & Tools", items: "Glide, AppSheet, VS Code, Git, GitHub" }
      ],
      formations: [
        { date: "2024 — 2026", title: "Advanced Tech Training", desc: "OpenClassrooms & Mentorship (Web & UI/UX)" },
        { date: "2023", title: "Professional Degree, SIL", desc: "Computer Systems and Software" },
        { date: "2021 — 2022", title: "Web Dev & Maintenance", desc: "Certified technical training" }
      ],
      experiences: [
        {
          title: "Web Developer & Integrator",
          period: "2025 — Present",
          company: "MORAVI Company (Importer of Continente, Wines & Food)",
          desc: "Design and development of dynamic web interfaces to showcase imported products."
        },
        {
          title: "Management & Technical Support",
          period: "2024",
          company: "FRANC-PRIX Supermarket (Cadjèhoun)",
          desc: "IT technical support and digital optimization of flows and inventory."
        },
        {
          title: "IT Intern",
          period: "2023",
          company: "CHUD-OP",
          desc: "Preventive/corrective maintenance of IT infrastructure and technical support to users."
        }
      ],
      projects: [
        {
          name: "Evabas Proforma",
          badge: "Full-Stack",
          desc: "Automated generation of custom proforma invoices.",
          stack: "React, Tailwind, Supabase"
        },
        {
          name: "Moravi Showcase",
          badge: "Frontend",
          desc: "Interactive web platform for catalog presentation.",
          stack: "Figma, React, Tailwind CSS"
        }
      ]
    }
  }
};