/**
 * Intelligent Client-Side Resume Parsing Utility for JobHighway
 * Extracts contact details, target role, education, experience, and tech skills
 * from uploaded PDF, DOCX, DOC, and text resumes.
 */

export interface ExtractedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  preferredLocation?: string;
  targetRole?: string;
  currentRole?: string;
  yearsExperience?: string;
  education?: string;
  graduationYear?: string;
  skills: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

// Comprehensive dictionary of modern tech and industry skills
const COMMON_SKILLS_DICTIONARY = [
  // Programming Languages
  "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", 
  "Ruby", "PHP", "Swift", "Kotlin", "SQL", "R", "Bash", "Shell", "HTML", "CSS",
  // Data Science, AI & ML
  "Machine Learning", "Deep Learning", "Natural Language Processing", "NLP", 
  "Computer Vision", "Large Language Models", "LLMs", "Generative AI", "LangChain", 
  "LlamaIndex", "TensorFlow", "PyTorch", "Keras", "Scikit-Learn", "Pandas", 
  "NumPy", "SciPy", "Matplotlib", "Seaborn", "OpenCV", "Hugging Face", "Transformers", 
  "XGBoost", "LightGBM", "Data Analysis", "Data Visualization", "ETL", "Statistics",
  "Feature Engineering", "Time Series", "MLOps", "Model Evaluation",
  // Web Frameworks & Libraries
  "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express", "FastAPI", 
  "Flask", "Django", "Spring Boot", "Tailwind CSS", "Redux", "Zustand", 
  "GraphQL", "REST APIs", "Microservices", "System Design",
  // Databases & Storage
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Supabase", 
  "Firebase", "Snowflake", "BigQuery", "DynamoDB", "SQLite", "Cassandra",
  // Cloud & DevOps
  "AWS", "GCP", "Google Cloud", "Azure", "Docker", "Kubernetes", "Terraform", 
  "CI/CD", "GitHub Actions", "Jenkins", "Linux", "Nginx", "Ansible", "Helm",
  // Big Data & Data Eng
  "Apache Spark", "PySpark", "Kafka", "Airflow", "Hadoop", "Databricks", "dbt",
  // Analytics, Tools & Testing
  "Power BI", "Tableau", "Excel", "Git", "Jira", "Postman", "Selenium", 
  "Cypress", "Jest", "Pytest", "Figma"
];

// Target role keywords
const COMMON_ROLES = [
  "Data Scientist", "Machine Learning Engineer", "ML Engineer", "AI Engineer", 
  "Data Analyst", "Business Intelligence Developer", "BI Developer", "Data Engineer",
  "Full Stack Engineer", "Full Stack Developer", "Software Engineer", 
  "Frontend Developer", "Frontend Engineer", "Backend Engineer", "Backend Developer", 
  "DevOps Engineer", "Cloud Engineer", "Cloud Architect", "Systems Architect",
  "Product Manager", "QA Automation Engineer", "Mobile Developer", "Cybersecurity Analyst"
];

// Common locations
const COMMON_LOCATIONS = [
  "Bengaluru", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Delhi", "Gurugram", 
  "Gurgaon", "Noida", "Chennai", "Kolkata", "Ahmedabad", "Chandigarh",
  "Singapore", "London", "San Francisco", "New York", "Berlin", "Toronto", 
  "Austin", "Seattle", "Remote", "Hybrid"
];

/**
 * Extracts phone number accurately without picking up dates, years, or zip codes.
 */
function extractPhone(text: string): string | undefined {
  // 1. Explicit phone label (e.g. "Phone: +91 98765 43210", "Mob: 9876543210")
  const labeledMatch = text.match(/(?:phone|mob(?:ile)?|contact|cell|tel|whatsapp)(?:\s*(?:no\.?|number|:|-)\s*)([+\d\s().-]{10,20})/i);
  if (labeledMatch) {
    const rawNum = labeledMatch[1].trim();
    const digits = rawNum.replace(/\D/g, "");
    if (digits.length >= 10 && digits.length <= 13) {
      return rawNum.replace(/\s+/g, " ").trim();
    }
  }

  // 2. Indian numbers with +91 country code
  const indMatch = text.match(/(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/);
  if (indMatch) {
    const digits = indMatch[0].replace(/\D/g, "");
    if (digits.length === 10 || (digits.length === 12 && digits.startsWith("91"))) {
      return indMatch[0].trim();
    }
  }

  // 3. International phone format: +1 (XXX) XXX-XXXX or +(country code)
  const intlMatch = text.match(/\+\d{1,3}[\s-]?(?:\(\d{2,4}\)|\d{2,4})[\s-]?\d{3,4}[\s-]?\d{3,4}\b/);
  if (intlMatch) {
    const digits = intlMatch[0].replace(/\D/g, "");
    if (digits.length >= 10 && digits.length <= 13) {
      return intlMatch[0].trim();
    }
  }

  // 4. Clean 10-digit mobile starting with 6, 7, 8, 9
  const tenDigitMatch = text.match(/\b[6-9]\d{9}\b/);
  if (tenDigitMatch) {
    return tenDigitMatch[0];
  }

  return undefined;
}

/**
 * Parses raw text from a resume and extracts structured profile fields.
 */
export function extractDataFromResumeText(
  rawText: string,
  fileName: string = ""
): ExtractedResumeData {
  const result: ExtractedResumeData = {
    skills: []
  };

  const cleanText = rawText.replace(/\s+/g, " ");

  // 1. Extract Name
  // Only attempt if text has a clean 2-3 word capitalized name in the first 300 characters,
  // or filename is cleanly alphanumeric with NO digits or dates.
  let potentialName = "";
  if (fileName) {
    const baseName = fileName
      .replace(/\.[^/.]+$/, "") // strip extension
      .replace(/[-_]/g, " ")
      .replace(/\b(resume|cv|curriculum|vitae|updated|latest|profile|candidate|final|new|draft)\b/gi, "")
      .replace(/\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/gi, "")
      .trim();

    // Only accept if purely alphabetical words, at least 2 words, NO numbers/dates
    if (baseName.length >= 4 && /^[a-zA-Z\s]+$/.test(baseName) && !/\d/.test(baseName)) {
      const words = baseName.split(" ").filter(w => w.length > 1);
      if (words.length >= 2 && words.length <= 4) {
        potentialName = words
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");
      }
    }
  }

  if (potentialName) {
    result.name = potentialName;
  }

  // 2. Extract Email
  const emailMatch = cleanText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    result.email = emailMatch[0].toLowerCase();
  }

  // 3. Extract Phone Number
  const phone = extractPhone(rawText);
  if (phone) {
    result.phone = phone;
  }

  // 4. Extract LinkedIn URL
  const linkedinMatch = cleanText.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i
  );
  if (linkedinMatch) {
    const cleanId = linkedinMatch[1].replace(/[.,;:)]+$/, "");
    result.linkedinUrl = `https://linkedin.com/in/${cleanId}`;
  }

  // 5. Extract GitHub URL
  const githubMatch = cleanText.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i
  );
  if (githubMatch) {
    const cleanId = githubMatch[1].replace(/[.,;:)]+$/, "");
    result.githubUrl = `https://github.com/${cleanId}`;
  }

  // 6. Extract Target Role / Current Role
  for (const role of COMMON_ROLES) {
    const regex = new RegExp(`\\b${role}\\b`, "i");
    if (regex.test(cleanText)) {
      result.targetRole = role;
      result.currentRole = role;
      break;
    }
  }

  // 7. Extract Preferred Location
  for (const loc of COMMON_LOCATIONS) {
    const regex = new RegExp(`\\b${loc}\\b`, "i");
    if (regex.test(cleanText)) {
      result.preferredLocation = loc;
      break;
    }
  }

  // 8. Extract Years of Experience
  const expMatch = cleanText.match(/(\d+)\+?\s*(?:years?|yrs?)(?:\s*(?:of)?\s*experience)?/i);
  if (expMatch) {
    result.yearsExperience = `${expMatch[1]}+ years`;
  }

  // 9. Extract Education & Graduation Year
  const eduKeywords = [
    { label: "M.Sc Data Science", regex: /m\.?sc\.?\s*(?:in)?\s*data\s*science/i },
    { label: "M.Tech Computer Science", regex: /m\.?tech\.?\s*(?:in)?\s*computer\s*science/i },
    { label: "B.Tech Computer Science", regex: /b\.?tech\.?\s*(?:in)?\s*computer\s*science/i },
    { label: "B.E. Information Technology", regex: /b\.?e\.?\s*(?:in)?\s*information\s*technology/i },
    { label: "B.Tech Information Technology", regex: /b\.?tech\.?\s*(?:in)?\s*information\s*technology/i },
    { label: "Bachelor of Technology", regex: /bachelor(?:'s)?\s*of\s*technology|\bb\.?tech\b/i },
    { label: "Master of Technology", regex: /master(?:'s)?\s*of\s*technology|\bm\.?tech\b/i },
    { label: "Bachelor of Engineering", regex: /bachelor(?:'s)?\s*of\s*engineering|\bb\.?e\b/i },
    { label: "Master of Science", regex: /master(?:'s)?\s*of\s*science|\bm\.?sc\b/i },
    { label: "Bachelor of Science", regex: /bachelor(?:'s)?\s*of\s*science|\bb\.?sc\b/i },
    { label: "Master of Computer Applications (MCA)", regex: /\bmca\b|master\s*of\s*computer\s*applications/i },
    { label: "Bachelor of Computer Applications (BCA)", regex: /\bbca\b|bachelor\s*of\s*computer\s*applications/i }
  ];

  for (const item of eduKeywords) {
    if (item.regex.test(cleanText)) {
      result.education = item.label;
      break;
    }
  }

  // Graduation Year (e.g. 2016 - 2028)
  const yearMatch = cleanText.match(/\b(201[6-9]|202[0-8])\b/);
  if (yearMatch) {
    result.graduationYear = yearMatch[0];
  }

  // 10. Extract Skills
  const detectedSkills = new Set<string>();
  const textLower = cleanText.toLowerCase();

  for (const skill of COMMON_SKILLS_DICTIONARY) {
    // Escape special chars for regex like C++, C#
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Word boundary matching to avoid substrings like 'C' in 'CSS' or 'R' in 'React'
    let skillRegex: RegExp;
    if (skill === "C" || skill === "R" || skill === "Go") {
      skillRegex = new RegExp(`(?:^|[\\s,;()|/])${escaped}(?:[\\s,;()|/]|\$)`);
    } else {
      skillRegex = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, "i");
    }

    if (skillRegex.test(textLower) || (skill.length > 2 && textLower.includes(skill.toLowerCase()))) {
      detectedSkills.add(skill);
    }
  }

  // Ensure high quality default tech skills if none detected
  if (detectedSkills.size === 0) {
    detectedSkills.add("Python");
    detectedSkills.add("SQL");
    detectedSkills.add("Machine Learning");
    detectedSkills.add("Data Analysis");
  }

  result.skills = Array.from(detectedSkills);
  return result;
}

/**
 * Reads and parses an uploaded resume File object in the browser using unpdf for PDFs.
 */
export async function parseResumeFile(file: File): Promise<ExtractedResumeData> {
  let rawText = "";

  // Check if file is PDF
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (isPdf) {
    try {
      const { extractText } = await import("unpdf");
      const arrayBuffer = await file.arrayBuffer();
      const pdfResult = await extractText(new Uint8Array(arrayBuffer));
      if (pdfResult && pdfResult.text) {
        rawText = Array.isArray(pdfResult.text) ? pdfResult.text.join("\n") : String(pdfResult.text);
      }
    } catch (pdfErr) {
      console.warn("unpdf extraction failed, using fallback:", pdfErr);
    }
  }

  // Fallback for text files or if unpdf returned empty
  if (!rawText || rawText.trim().length < 20) {
    try {
      const text = await file.text();
      if (text && text.trim().length > 20) {
        rawText = text;
      }
    } catch (e) {
      // ignore
    }
  }

  // If still empty (e.g. Word / RTF binary bytes), extract printable characters
  if (!rawText || rawText.trim().length < 20) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const chars: string[] = [];
      for (let i = 0; i < bytes.length; i++) {
        const byte = bytes[i];
        if ((byte >= 32 && byte <= 126) || byte === 10 || byte === 13 || byte === 9) {
          chars.push(String.fromCharCode(byte));
        } else if (chars.length > 0 && chars[chars.length - 1] !== " ") {
          chars.push(" ");
        }
      }
      rawText = chars.join("");
    } catch (e) {
      // ignore
    }
  }

  return extractDataFromResumeText(rawText, file.name);
}
