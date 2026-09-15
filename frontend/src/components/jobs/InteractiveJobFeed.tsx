"use client";

import { useState, useMemo, useEffect } from "react";
import { Job, OverviewStats } from "@/lib/api";
import { JobCard } from "@/components/jobs/JobCard";
import { Search, X, RotateCcw, Sparkles, MapPin, Globe, Building2, ArrowUpDown, Clock, Navigation, Briefcase, GraduationCap, Laptop } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ALL_WORLD_COUNTRIES, COUNTRY_STATES, STATE_CITIES } from "@/lib/world_locations";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

const FILTER_CONFIG = {
  "Job Type": ["All", "Full Time", "Internship", "Contract"],
  "Work Mode": ["All", "Remote", "Hybrid", "Onsite"]
};

const INDIA_LOC_KEYWORDS = [
  "india", "bengaluru", "bangalore", "blr", "pune", "hyderabad", "hyd",
  "mumbai", "bombay", "delhi", "new delhi", "ncr", "noida", "gurgaon", "gurugram",
  "chennai", "madras", "kolkata", "calcutta", "ahmedabad", "jaipur", "chandigarh",
  "mohali", "kochi", "cochin", "kerala", "trivandrum", "thiruvananthapuram",
  "indore", "coimbatore", "nagpur", "bhubaneswar", "mysuru", "mysore",
  "karnataka", "maharashtra", "tamil nadu", "telangana", "andhra pradesh", "gujarat",
  "rajasthan", "uttar pradesh", "haryana", "lucknow", "kanpur", "pan-india"
];

const US_LOC_KEYWORDS = [
  "united states", "usa", "u.s.", "san francisco", "sf", "new york", "nyc",
  "seattle", "austin", "chicago", "boston", "los angeles", "california",
  "texas", "washington", "colorado", "denver", "atlanta", "philadelphia",
  "miami", "san jose", "sunnyvale", "mountain view", "menlo park", "palo alto",
  "remote - us", "us remote", "us - remote"
];

const UK_LOC_KEYWORDS = [
  "united kingdom", "uk", "u.k.", "london", "manchester", "edinburgh", "bristol", "birmingham", "glasgow"
];

const GERMANY_LOC_KEYWORDS = [
  "germany", "deutschland", "berlin", "munich", "münchen", "frankfurt", "hamburg", "cologne", "karlsruhe", "stuttgart", "düsseldorf"
];

const CANADA_LOC_KEYWORDS = [
  "canada", "toronto", "vancouver", "montreal", "ottawa", "calgary", "waterloo"
];

const IRELAND_LOC_KEYWORDS = [
  "ireland", "dublin", "cork", "galway", "limerick"
];

const AUSTRALIA_LOC_KEYWORDS = [
  "australia", "sydney", "melbourne", "brisbane", "perth", "canberra"
];

const FR_LOC_KEYWORDS = [
  "france", "paris", "lyon", "marseille", "toulouse", "nice", "nantes", "bordeaux"
];

const JP_LOC_KEYWORDS = [
  "japan", "tokyo", "osaka", "kyoto", "yokohama"
];

const SG_LOC_KEYWORDS = [
  "singapore", "sg"
];

const AE_LOC_KEYWORDS = [
  "united arab emirates", "uae", "dubai", "abu dhabi"
];

const NL_LOC_KEYWORDS = [
  "netherlands", "amsterdam", "rotterdam", "utrecht", "hague", "eindhoven"
];

const PL_LOC_KEYWORDS = [
  "poland", "polska", "warsaw", "krakow", "wroclaw", "gdansk", "poznan"
];

const ES_LOC_KEYWORDS = [
  "spain", "espana", "madrid", "barcelona", "valencia", "seville", "malaga"
];

const CH_LOC_KEYWORDS = [
  "switzerland", "schweiz", "zurich", "geneva", "basel", "lausanne", "bern"
];

const SE_LOC_KEYWORDS = [
  "sweden", "sverige", "stockholm", "gothenburg", "malmo"
];

const IT_LOC_KEYWORDS = [
  "italy", "italia", "milan", "rome", "turin", "florence", "bologna"
];

const BR_LOC_KEYWORDS = [
  "brazil", "brasil", "são paulo", "sao paulo", "rio de janeiro"
];

const MX_LOC_KEYWORDS = [
  "mexico", "mexico city", "guadalajara", "monterrey"
];

interface InteractiveJobFeedProps {
  initialJobs: Job[];
  stats: OverviewStats;
}

export function InteractiveJobFeed({ initialJobs, stats }: InteractiveJobFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "salary" | "fresher">("newest");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    "Job Type": "All",
    "Work Mode": "All"
  });
  const [visibleCount, setVisibleCount] = useState(9);

  // Available companies in dataset
  const availableCompanies = useMemo(() => {
    const map = new Map<string, string>();
    initialJobs.forEach(j => {
      if (j.company?.name && j.company?.slug) {
        map.set(j.company.slug, j.company.name);
      }
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [initialJobs]);

  const companyOptions = useMemo(() => [
    { label: "🏢 All Companies", value: "All" },
    ...availableCompanies.map(comp => ({
      label: `🏢 ${comp.name}`,
      value: comp.slug
    }))
  ], [availableCompanies]);

  const jobTypeOptions = useMemo(() => [
    { label: "💼 All Job Types", value: "All" },
    { label: "💼 Full Time", value: "Full Time" },
    { label: "💼 Internship", value: "Internship" },
    { label: "💼 Contract", value: "Contract" }
  ], []);

  const workModeOptions = useMemo(() => [
    { label: "💻 All Work Modes", value: "All" },
    { label: "💻 Remote", value: "Remote" },
    { label: "💻 Hybrid", value: "Hybrid" },
    { label: "🏢 Onsite", value: "Onsite" }
  ], []);

  const sortOptions = useMemo(() => [
    { label: "🔥 Newest First", value: "newest" },
    { label: "💰 Highest Salary", value: "salary" },
    { label: "🎯 Fresher Friendly (0–1 Yrs)", value: "fresher" }
  ], []);

  // Dynamic States & Cities from server API (covering all 250 countries, 5,000+ states, 150,000+ cities)
  const [dynamicStates, setDynamicStates] = useState<{ label: string; value: string; code?: string }[]>([]);
  const [dynamicCities, setDynamicCities] = useState<{ label: string; value: string }[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // States for selected country (fallback)
  const availableStates = useMemo(() => {
    if (selectedCountry === "All" || selectedCountry === "Remote") {
      return [];
    }
    const states = COUNTRY_STATES[selectedCountry];
    if (Array.isArray(states) && states.length > 0) {
      return states;
    }
    return [
      { label: `📍 All Regions in ${selectedCountry}`, value: "All" }
    ];
  }, [selectedCountry]);

  // Cities for selected country and state (fallback)
  const availableCities = useMemo(() => {
    if (selectedCountry === "All" || selectedCountry === "Remote") {
      return [];
    }

    const countryCities = STATE_CITIES[selectedCountry];
    let cities: { label: string; value: string }[] = [];

    if (countryCities) {
      if (selectedState !== "All" && countryCities[selectedState]) {
        cities = countryCities[selectedState];
      } else if (countryCities["All"]) {
        cities = countryCities["All"];
      }
    }

    // Fallback: If no predefined cities or empty, extract from initialJobs matching this country
    if (!cities || cities.length === 0) {
      const extractedSet = new Set<string>();
      const countryLower = selectedCountry.toLowerCase();
      (initialJobs || []).forEach(job => {
        if (job.location && Array.isArray(job.location)) {
          job.location.forEach(loc => {
            if (loc.toLowerCase().includes(countryLower)) {
              const parts = loc.split(",").map(p => p.trim());
              if (parts.length > 1 && parts[0]) {
                extractedSet.add(parts[0]);
              } else if (parts.length === 1 && parts[0] && parts[0].toLowerCase() !== countryLower) {
                extractedSet.add(parts[0]);
              }
            }
          });
        }
      });

      cities = [
        { label: `📍 All Cities in ${selectedCountry}`, value: "All" },
        ...Array.from(extractedSet).map(cityName => ({
          label: cityName,
          value: cityName
        }))
      ];
    }

    return (cities || []).filter(c => Boolean(c && typeof c.label === "string" && typeof c.value === "string"));
  }, [selectedCountry, selectedState, initialJobs]);

  // Fetch all world states dynamically on-demand
  useEffect(() => {
    if (selectedCountry === "All" || selectedCountry === "Remote") {
      setDynamicStates([]);
      return;
    }

    let isMounted = true;
    setLoadingStates(true);

    fetch(`/api/locations/states?country=${encodeURIComponent(selectedCountry)}`)
      .then(res => res.json())
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setDynamicStates(data);
          } else {
            setDynamicStates(availableStates);
          }
          setLoadingStates(false);
        }
      })
      .catch((err) => {
        console.warn("Failed to load states from API:", err);
        if (isMounted) {
          setDynamicStates(availableStates);
          setLoadingStates(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCountry, availableStates]);

  // Fetch all world cities dynamically on-demand
  useEffect(() => {
    if (selectedCountry === "All" || selectedCountry === "Remote") {
      setDynamicCities([]);
      return;
    }

    let isMounted = true;
    setLoadingCities(true);

    const stateParam = selectedState !== "All" ? `&state=${encodeURIComponent(selectedState)}` : '';
    fetch(`/api/locations/cities?country=${encodeURIComponent(selectedCountry)}${stateParam}`)
      .then(res => res.json())
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setDynamicCities(data);
          } else {
            setDynamicCities(availableCities);
          }
          setLoadingCities(false);
        }
      })
      .catch((err) => {
        console.warn("Failed to load cities from API:", err);
        if (isMounted) {
          setDynamicCities(availableCities);
          setLoadingCities(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCountry, selectedState, availableCities]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedState("All");
    setSelectedCity("All");
    setVisibleCount(9);
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity("All");
    setVisibleCount(9);
  };

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: value
    }));
    setVisibleCount(9);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCountry("All");
    setSelectedState("All");
    setSelectedCity("All");
    setSelectedCompany("All");
    setSortBy("newest");
    setActiveFilters({
      "Job Type": "All",
      "Work Mode": "All"
    });
    setVisibleCount(9);
  };

  const isFiltered = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      selectedCountry !== "All" ||
      selectedState !== "All" ||
      selectedCity !== "All" ||
      selectedCompany !== "All" ||
      sortBy !== "newest" ||
      Object.values(activeFilters).some(v => v !== "All")
    );
  }, [searchQuery, selectedCountry, selectedState, selectedCity, selectedCompany, sortBy, activeFilters]);

  // Real-time filtering engine with strict 1-month recency and sorting
  const filteredAndSortedJobs = useMemo(() => {
    const now = new Date().getTime();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    // 1. Filter jobs
    const filtered = initialJobs.filter(job => {
      // Recency check: only jobs from last 1 month
      const postTime = new Date(job.posted_at || job.first_seen_at).getTime();
      if ((now - postTime) > THIRTY_DAYS_MS) {
        return false;
      }

      // Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.name.toLowerCase().includes(query);
        const matchesLocation = job.location.some(l => l.toLowerCase().includes(query));
        const matchesSkills = (job.skills_required || []).some(s => s.toLowerCase().includes(query));
        const matchesDept = (job.department || "").toLowerCase().includes(query);

        if (!matchesTitle && !matchesCompany && !matchesLocation && !matchesSkills && !matchesDept) {
          return false;
        }
      }

      // Company Filter
      if (selectedCompany !== "All") {
        if (job.company.slug !== selectedCompany && job.company.name !== selectedCompany) {
          return false;
        }
      }

      // Country Filter
      if (selectedCountry !== "All") {
        const country = selectedCountry.toLowerCase();
        if (country === "india") {
          const isIndia = job.location.some(l => {
            const loc = l.toLowerCase();
            return INDIA_LOC_KEYWORDS.some(k => loc.includes(k));
          });
          if (!isIndia) return false;
        } else if (country === "united states") {
          const isUS = job.location.some(l => {
            const loc = l.toLowerCase();
            return US_LOC_KEYWORDS.some(k => loc.includes(k));
          });
          if (!isUS) return false;
        } else if (country === "united kingdom") {
          const isUK = job.location.some(l => {
            const loc = l.toLowerCase();
            return UK_LOC_KEYWORDS.some(k => loc.includes(k));
          });
          if (!isUK) return false;
        } else if (country === "germany") {
          const isDE = job.location.some(l => {
            const loc = l.toLowerCase();
            return GERMANY_LOC_KEYWORDS.some(k => loc.includes(k));
          });
          if (!isDE) return false;
        } else if (country === "canada") {
          const isCA = job.location.some(l => {
            const loc = l.toLowerCase();
            return CANADA_LOC_KEYWORDS.some(k => loc.includes(k));
          });
          if (!isCA) return false;
        } else if (country === "ireland") {
          const isIE = job.location.some(l => {
            const loc = l.toLowerCase();
            return IRELAND_LOC_KEYWORDS.some(k => loc.includes(k));
          });
          if (!isIE) return false;
        } else if (country === "australia") {
          const isAU = job.location.some(l => {
            const loc = l.toLowerCase();
            return AUSTRALIA_LOC_KEYWORDS.some(k => loc.includes(k));
          });
          if (!isAU) return false;
        } else if (country === "france") {
          const isFR = job.location.some(l => FR_LOC_KEYWORDS.some(k => l.toLowerCase().includes(k)));
          if (!isFR) return false;
        } else if (country === "japan") {
          const isJP = job.location.some(l => JP_LOC_KEYWORDS.some(k => l.toLowerCase().includes(k)));
          if (!isJP) return false;
        } else if (country === "singapore") {
          const isSG = job.location.some(l => SG_LOC_KEYWORDS.some(k => l.toLowerCase().includes(k)));
          if (!isSG) return false;
        } else if (country === "united arab emirates" || country === "uae") {
          const isAE = job.location.some(l => AE_LOC_KEYWORDS.some(k => l.toLowerCase().includes(k)));
          if (!isAE) return false;
        } else if (country === "netherlands") {
          const isNL = job.location.some(l => NL_LOC_KEYWORDS.some(k => l.toLowerCase().includes(k)));
          if (!isNL) return false;
        } else if (country === "poland") {
          const isPL = job.location.some(l => PL_LOC_KEYWORDS.some(k => l.toLowerCase().includes(k)));
          if (!isPL) return false;
        } else if (country === "spain") {
          const isES = job.location.some(l => ES_LOC_KEYWORDS.some(k => l.toLowerCase().includes(k)));
          if (!isES) return false;
        } else if (country === "switzerland") {
          const isCH = job.location.some(l => CH_LOC_KEYWORDS.some(k => l.toLowerCase().includes(k)));
          if (!isCH) return false;
        } else if (country === "sweden") {
          const isSE = job.location.some(l => SE_LOC_KEYWORDS.some(k => l.toLowerCase().includes(k)));
          if (!isSE) return false;
        } else if (country === "italy") {
          const isIT = job.location.some(l => IT_LOC_KEYWORDS.some(k => l.toLowerCase().includes(k)));
          if (!isIT) return false;
        } else if (country === "brazil") {
          const isBR = job.location.some(l => BR_LOC_KEYWORDS.some(k => l.toLowerCase().includes(k)));
          if (!isBR) return false;
        } else if (country === "mexico") {
          const isMX = job.location.some(l => MX_LOC_KEYWORDS.some(k => l.toLowerCase().includes(k)));
          if (!isMX) return false;
        } else if (country === "remote") {
          const isRemote = (job.work_mode || "").toLowerCase() === "remote" || job.location.some(l => l.toLowerCase().includes("remote"));
          if (!isRemote) return false;
        } else {
          const matches = job.location.some(l => l.toLowerCase().includes(country));
          if (!matches) return false;
        }
      }

      // State Filter (Smart Mapping: check state name OR any city known to belong to this state)
      if (selectedState !== "All") {
        const stateLower = selectedState.toLowerCase();
        
        // Find cities belonging to this state from STATE_CITIES
        const stateCityValues = (STATE_CITIES[selectedCountry]?.[selectedState] || [])
          .map(c => c.value.toLowerCase())
          .filter(v => v !== "all");

        if (stateLower === "delhi" || stateLower === "delhi ncr") {
          stateCityValues.push("delhi", "new delhi", "noida", "gurgaon", "gurugram", "faridabad", "ghaziabad", "ncr");
        } else if (stateLower === "karnataka") {
          stateCityValues.push("bengaluru", "bangalore", "blr", "mysuru", "mysore", "mangalore", "hubli", "belgaum");
        } else if (stateLower === "maharashtra") {
          stateCityValues.push("mumbai", "bombay", "pune", "nagpur", "nashik", "aurangabad", "thane", "navi mumbai");
        } else if (stateLower === "haryana") {
          stateCityValues.push("gurgaon", "gurugram", "faridabad", "panchkula", "ambala");
        } else if (stateLower === "uttar pradesh") {
          stateCityValues.push("noida", "greater noida", "lucknow", "kanpur", "varanasi", "agra", "ghaziabad");
        } else if (stateLower === "telangana") {
          stateCityValues.push("hyderabad", "secunderabad", "warangal");
        } else if (stateLower === "tamil nadu") {
          stateCityValues.push("chennai", "madras", "coimbatore", "madurai", "trichy");
        }

        const stateMatches = job.location.some(l => {
          const locLower = l.toLowerCase();
          if (locLower.includes(stateLower)) return true;
          return stateCityValues.some(cityVal => locLower.includes(cityVal));
        }) || ((job as any).state && (job as any).state.toLowerCase().includes(stateLower));

        if (!stateMatches) {
          return false;
        }
      }

      // City Filter (Smart Synonyms: e.g. Bengaluru/Bangalore, Delhi/Noida/Gurgaon)
      if (selectedCity !== "All") {
        const targetCity = selectedCity.toLowerCase();
        let cityMatch = false;

        if (targetCity === "bengaluru" || targetCity === "bangalore") {
          cityMatch = job.location.some(l => {
            const loc = l.toLowerCase();
            return loc.includes("bengaluru") || loc.includes("bangalore") || loc.includes("blr");
          });
        } else if (targetCity === "delhi") {
          cityMatch = job.location.some(l => {
            const loc = l.toLowerCase();
            return loc.includes("delhi") || loc.includes("new delhi") || loc.includes("noida") || loc.includes("gurgaon") || loc.includes("gurugram") || loc.includes("ncr");
          });
        } else if (targetCity === "gurgaon" || targetCity === "gurugram") {
          cityMatch = job.location.some(l => {
            const loc = l.toLowerCase();
            return loc.includes("gurgaon") || loc.includes("gurugram");
          });
        } else if (targetCity === "noida") {
          cityMatch = job.location.some(l => {
            const loc = l.toLowerCase();
            return loc.includes("noida");
          });
        } else if (targetCity === "mumbai") {
          cityMatch = job.location.some(l => {
            const loc = l.toLowerCase();
            return loc.includes("mumbai") || loc.includes("bombay") || loc.includes("thane") || loc.includes("navi mumbai");
          });
        } else if (targetCity === "pune") {
          cityMatch = job.location.some(l => l.toLowerCase().includes("pune"));
        } else if (targetCity === "hyderabad") {
          cityMatch = job.location.some(l => {
            const loc = l.toLowerCase();
            return loc.includes("hyderabad") || loc.includes("secunderabad");
          });
        } else if (targetCity === "chennai") {
          cityMatch = job.location.some(l => {
            const loc = l.toLowerCase();
            return loc.includes("chennai") || loc.includes("madras");
          });
        } else if (targetCity === "kolkata") {
          cityMatch = job.location.some(l => {
            const loc = l.toLowerCase();
            return loc.includes("kolkata") || loc.includes("calcutta");
          });
        } else if (targetCity === "remote") {
          cityMatch = (job.work_mode || "").toLowerCase() === "remote" || job.location.some(l => l.toLowerCase().includes("remote") || l.toLowerCase().includes("pan-india"));
        } else {
          cityMatch = job.location.some(l => l.toLowerCase().includes(targetCity)) ||
                      ((job as any).city && (job as any).city.toLowerCase().includes(targetCity));
        }

        if (!cityMatch) {
          return false;
        }
      }

      // Job Type filter (Smart Matching with Title & Employment Type)
      if (activeFilters["Job Type"] !== "All") {
        const filter = activeFilters["Job Type"].toLowerCase();
        const titleLower = (job.title || "").toLowerCase();
        const empTypeLower = (job.employment_type || "").toLowerCase();

        if (filter === "internship") {
          const isIntern =
            titleLower.includes("intern") ||
            titleLower.includes("co-op") ||
            titleLower.includes("trainee") ||
            titleLower.includes("apprentice") ||
            empTypeLower.includes("intern");
          if (!isIntern) return false;
        } else if (filter === "contract") {
          const isContract =
            empTypeLower.includes("contract") ||
            empTypeLower.includes("short term") ||
            empTypeLower.includes("temp") ||
            titleLower.includes("contract") ||
            titleLower.includes("freelance");
          if (!isContract) return false;
        } else if (filter === "full time") {
          const isIntern =
            titleLower.includes("intern") ||
            titleLower.includes("co-op") ||
            titleLower.includes("trainee") ||
            titleLower.includes("apprentice") ||
            empTypeLower.includes("intern");
          const isContract =
            empTypeLower.includes("contract") ||
            empTypeLower.includes("short term") ||
            titleLower.includes("contract");
          const isFull =
            !isIntern &&
            !isContract &&
            (empTypeLower.includes("full") ||
              empTypeLower.includes("permanent") ||
              titleLower.includes("full-time") ||
              titleLower.includes("full time") ||
              !empTypeLower);
          if (!isFull) return false;
        } else {
          const filterNormalized = filter.replace(/\s|-/g, "");
          const empNormalized = empTypeLower.replace(/\s|-/g, "");
          if (!empNormalized.includes(filterNormalized) && !titleLower.includes(filter)) {
            return false;
          }
        }
      }

      // Work Mode filter (Smart Synonyms: Onsite/In-Office, Remote, Hybrid)
      if (activeFilters["Work Mode"] !== "All") {
        const targetMode = activeFilters["Work Mode"].toLowerCase();
        const workModeLower = (job.work_mode || "").toLowerCase();
        const locationLower = (job.location || []).join(" ").toLowerCase();

        if (targetMode === "onsite") {
          const isOnsite =
            workModeLower.includes("office") ||
            workModeLower.includes("onsite") ||
            workModeLower.includes("on-site") ||
            workModeLower.includes("in-person") ||
            (!workModeLower.includes("remote") &&
              !workModeLower.includes("hybrid") &&
              !locationLower.includes("remote"));
          if (!isOnsite) return false;
        } else if (targetMode === "remote") {
          const isRemote =
            workModeLower === "remote" ||
            workModeLower.includes("remote") ||
            locationLower.includes("remote") ||
            locationLower.includes("work from anywhere");
          if (!isRemote) return false;
        } else if (targetMode === "hybrid") {
          const isHybrid =
            workModeLower.includes("hybrid") ||
            locationLower.includes("hybrid");
          if (!isHybrid) return false;
        }
      }

      return true;
    });

    // 2. Sort jobs (Latest on top by default)
    return filtered.sort((a, b) => {
      if (sortBy === "salary") {
        const salaryA = a.salary_max || a.salary_min || 0;
        const salaryB = b.salary_max || b.salary_min || 0;
        return salaryB - salaryA;
      }
      if (sortBy === "fresher") {
        const expA = a.experience_min ?? 0;
        const expB = b.experience_min ?? 0;
        return expA - expB;
      }
      // Default: newest posted on top
      const timeA = new Date(a.posted_at || a.first_seen_at).getTime();
      const timeB = new Date(b.posted_at || b.first_seen_at).getTime();
      return timeB - timeA;
    });
  }, [initialJobs, searchQuery, selectedCountry, selectedState, selectedCity, selectedCompany, sortBy, activeFilters]);

  const displayedJobs = filteredAndSortedJobs.slice(0, visibleCount);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-900 pt-12 pb-9 px-4 shadow-inner">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Official ATS Job Stream • Directly On Company Portals</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Discover Jobs Minutes After They&apos;re Posted
          </h1>
          <p className="text-base md:text-lg text-teal-100/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Real official career portal postings with zero delays. Apply straight on the official company domain without third-party registration.
          </p>

          {/* Interactive Search Bar */}
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-teal-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role (e.g. SDE, Data Analyst), company, skills, or city..."
              className="block w-full pl-12 pr-10 py-4 border-0 rounded-2xl bg-white/95 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 shadow-2xl focus:ring-4 focus:ring-teal-400/40 outline-none text-base transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Live Stats & Freshness Indicator */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-3 text-xs md:text-sm text-teal-100/70">
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {stats.total_jobs.toLocaleString()} active jobs monitored
            </span>
            <span>•</span>
            <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
              {stats.total_companies.toLocaleString()} official portals
            </span>
            <span>•</span>
            <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              Last 1 month only • Newest on top
            </span>
          </div>
        </div>
      </section>

      {/* Sleek Compact Sticky Filter Bar */}
      <div className="w-full border-b border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md sticky top-16 z-40 shadow-xs">
        <div className="container mx-auto px-4 py-2.5 max-w-[1440px]">
          {/* 2-Tier Compact Grid: Row 1 = Location & Company, Row 2 = Job Type, Batch, Work Mode, Sort */}
          <div className="flex flex-col gap-2">
            {/* Row 1: Location & Company Filters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* 1. Country */}
              <SearchableSelect
                ariaLabel="Country"
                icon={<Globe className="w-3.5 h-3.5" />}
                options={ALL_WORLD_COUNTRIES}
                value={selectedCountry}
                onChange={handleCountryChange}
                placeholder="🌍 All Countries"
                searchPlaceholder="Search 250+ countries..."
              />

              {/* 2. State / Region */}
              <SearchableSelect
                ariaLabel="State or Region"
                icon={<Navigation className="w-3.5 h-3.5" />}
                options={dynamicStates.length > 0 ? dynamicStates : availableStates}
                value={selectedState}
                disabled={selectedCountry === "All" || selectedCountry === "Remote"}
                loading={loadingStates}
                loadingText="⏳ Loading States..."
                onChange={handleStateChange}
                placeholder={selectedCountry === "All" ? "← Pick Country First" : "📍 All States"}
                searchPlaceholder="Search states / regions..."
              />

              {/* 3. City */}
              <SearchableSelect
                ariaLabel="City"
                icon={<MapPin className="w-3.5 h-3.5" />}
                options={dynamicCities.length > 0 ? dynamicCities : availableCities}
                value={selectedCity}
                disabled={selectedCountry === "All" || selectedCountry === "Remote"}
                loading={loadingCities}
                loadingText="⏳ Loading Cities..."
                onChange={(val) => {
                  setSelectedCity(val);
                  setVisibleCount(9);
                }}
                placeholder={selectedCountry === "All" ? "← Pick Country First" : "🏙️ All Cities"}
                searchPlaceholder="Search cities..."
              />

              {/* 4. Company */}
              <SearchableSelect
                ariaLabel="Company"
                icon={<Building2 className="w-3.5 h-3.5" />}
                options={companyOptions}
                value={selectedCompany}
                onChange={(val) => {
                  setSelectedCompany(val);
                  setVisibleCount(9);
                }}
                placeholder="🏢 All Companies"
                searchPlaceholder="Search companies..."
              />
            </div>

            {/* Row 2: Job Type, Work Mode, Sort Order */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* 5. Job Type Dropdown */}
              <SearchableSelect
                ariaLabel="Job Type"
                icon={<Briefcase className="w-3.5 h-3.5" />}
                options={jobTypeOptions}
                value={activeFilters["Job Type"]}
                onChange={(val) => toggleFilter("Job Type", val)}
                placeholder="💼 All Job Types"
                searchPlaceholder="Search job type..."
              />

              {/* 6. Work Mode Dropdown */}
              <SearchableSelect
                ariaLabel="Work Mode"
                icon={<Laptop className="w-3.5 h-3.5" />}
                options={workModeOptions}
                value={activeFilters["Work Mode"]}
                onChange={(val) => toggleFilter("Work Mode", val)}
                placeholder="💻 All Work Modes"
                searchPlaceholder="Search work mode..."
              />

              {/* 7. Sort Order Dropdown */}
              <SearchableSelect
                ariaLabel="Sort Order"
                icon={<ArrowUpDown className="w-3.5 h-3.5" />}
                options={sortOptions}
                value={sortBy}
                onChange={(val) => setSortBy(val as any)}
                placeholder="🔥 Newest First"
                searchPlaceholder="Search sort order..."
              />
            </div>
          </div>

          {/* Active Filter Summary & Reset Bar */}
          {isFiltered && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-1.5 flex-wrap text-teal-700 dark:text-teal-400 font-medium">
                <span>Showing <strong>{filteredAndSortedJobs.length}</strong> matching {filteredAndSortedJobs.length === 1 ? "posting" : "postings"}</span>
                {selectedCountry !== "All" && (
                  <span className="bg-teal-50 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                    🌍 {selectedCountry}
                  </span>
                )}
                {selectedState !== "All" && (
                  <span className="bg-teal-50 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                    📍 {selectedState}
                  </span>
                )}
                {selectedCity !== "All" && (
                  <span className="bg-teal-50 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                    🏙️ {selectedCity}
                  </span>
                )}
                {selectedCompany !== "All" && (
                  <span className="bg-teal-50 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                    🏢 {availableCompanies.find(c => c.slug === selectedCompany)?.name || selectedCompany}
                  </span>
                )}
                {activeFilters["Job Type"] !== "All" && (
                  <span className="bg-teal-50 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                    💼 {activeFilters["Job Type"]}
                  </span>
                )}
                {activeFilters["Work Mode"] !== "All" && (
                  <span className="bg-teal-50 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                    💻 {activeFilters["Work Mode"]}
                  </span>
                )}
              </div>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold transition-colors bg-red-50 dark:bg-red-950/40 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-900/40 text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Job Feed List */}
      <section className="py-8 bg-slate-50 dark:bg-slate-950 flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Latest Openings (Last 1 Month)</span>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200 dark:border-emerald-800">
                  Newest On Top
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct official career portal openings verified through company career systems
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-2xs">
              Showing {displayedJobs.length} of {filteredAndSortedJobs.length} postings
            </div>
          </div>

          {/* Job Grid or Empty State */}
          {displayedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {displayedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No active postings found for this selection
              </h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6 text-sm">
                No openings in &quot;{selectedCity !== 'All' ? selectedCity : selectedState !== 'All' ? selectedState : selectedCountry !== 'All' ? selectedCountry : searchQuery}&quot; within the last 1 month matching your filters.
              </p>
              <Button onClick={resetFilters} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Filters & Show All
              </Button>
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < filteredAndSortedJobs.length && (
            <div className="mt-12 text-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => setVisibleCount(prev => prev + 9)}
                className="min-w-[240px] rounded-xl hover:border-teal-500 hover:text-teal-600 transition-all font-semibold shadow-sm"
              >
                Load More Opportunities ({filteredAndSortedJobs.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
