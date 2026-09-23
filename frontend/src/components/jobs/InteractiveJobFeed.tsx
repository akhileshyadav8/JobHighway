"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Job, OverviewStats } from "@/lib/api";
import { JobCard } from "@/components/jobs/JobCard";
import { Search, X, RotateCcw, MapPin, Globe, Building2, ArrowUpDown, Navigation, Briefcase, GraduationCap, Laptop, Zap, ShieldCheck, Clock, Bookmark, ChevronRight } from "lucide-react";
import { ALL_WORLD_COUNTRIES, COUNTRY_STATES, STATE_CITIES } from "@/lib/world_locations";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

const FILTER_CONFIG = {
  "Job Type": ["All", "Full Time", "Internship", "Contract"],
  "Work Mode": ["All", "Remote", "Hybrid", "Onsite"],
  "Experience": ["All", "0-1", "1-3", "3-5", "5+"]
};

const SENIOR_TITLE_REGEX = /\b(senior|sr\.?|lead|staff|principal|director|head of|vp|manager|architect|partner)\b/i;
const FRESHER_TITLE_REGEX = /\b(intern|internship|trainee|apprentice|co-op|graduate|fresher|entry level|junior|associate|analyst i|engineer i)\b/i;

function getNormalizedAnnualSalaryUsd(job: Job): number {
  let val = job.salary_max || job.salary_min || 0;
  if (!val || val <= 0) return 0;
  
  const period = (job.salary_period || "annual").toLowerCase();
  if (period.includes("hour")) {
    val = val * 2080;
  } else if (period.includes("month")) {
    val = val * 12;
  } else if (period.includes("week")) {
    val = val * 52;
  } else if (period.includes("day")) {
    val = val * 260;
  }

  const curr = (job.salary_currency || "USD").toUpperCase();
  if (curr === "INR" || curr === "₹") {
    val = val / 85;
  } else if (curr === "EUR" || curr === "€") {
    val = val * 1.08;
  } else if (curr === "GBP" || curr === "£") {
    val = val * 1.28;
  } else if (curr === "CAD" || curr === "AUD" || curr === "SGD") {
    val = val / 1.35;
  } else if (curr === "JPY" || curr === "¥") {
    val = val / 150;
  }
  return val;
}

function isHighSalaryRole(job: Job): boolean {
  const curr = (job.salary_currency || "USD").toUpperCase();
  const maxVal = job.salary_max || job.salary_min || 0;
  const isIndia = curr === "INR" || curr === "₹" || (job.location && job.location.some(l => l.toLowerCase().includes("india")));

  if (isIndia) {
    if (maxVal >= 1200000) return true;
    const period = (job.salary_period || "annual").toLowerCase();
    if (period.includes("month") && maxVal >= 100000) return true;
  }

  const usdVal = getNormalizedAnnualSalaryUsd(job);
  if (usdVal >= 80000) return true;

  if (maxVal === 0) {
    const titleLower = (job.title || "").toLowerCase();
    if (/\b(senior|lead|staff|principal|director|head of|vp|architect)\b/i.test(titleLower)) {
      return true;
    }
  }

  return false;
}

function matchesSalaryRange(job: Job, range: string): boolean {
  if (!range || range === "All") return true;
  const isIndia = (job.salary_currency || "USD").toUpperCase() === "INR" || (job.location && job.location.some(l => l.toLowerCase().includes("india")));
  const maxVal = job.salary_max || job.salary_min || 0;
  const usdVal = getNormalizedAnnualSalaryUsd(job);

  if (range === "High Salary") {
    return isHighSalaryRole(job);
  }

  if (range === "Mid Salary") {
    if (isIndia) {
      return maxVal >= 600000 && maxVal < 1200000;
    }
    return usdVal >= 40000 && usdVal < 80000;
  }

  if (range === "Entry Level") {
    if (isIndia) {
      return (maxVal > 0 && maxVal < 600000) || (job.experience_min === 0);
    }
    return (usdVal > 0 && usdVal < 40000) || (job.experience_min === 0);
  }

  return true;
}

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
  initialTotal?: number;
  initialTotalPages?: number;
}

export function InteractiveJobFeed({ initialJobs, stats, initialTotal, initialTotalPages }: InteractiveJobFeedProps) {
  const [jobsList, setJobsList] = useState<Job[]>(initialJobs);
  const [incomingJobs, setIncomingJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");
  type SortBy = "newest" | "fresher_highest_salary" | "high_salary_newest" | "oldest" | "salary_high" | "salary_low";
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    "Job Type": "All",
    "Work Mode": "All",
    "Experience": "All"
  });

  // Server-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(initialTotal || stats.total_jobs || 0);
  const [totalPages, setTotalPages] = useState(initialTotalPages || Math.ceil((initialTotal || stats.total_jobs || 0) / 50) || 1);
  const [isFetchingPage, setIsFetchingPage] = useState(false);
  const [jumpPageInput, setJumpPageInput] = useState("");
  const isInitialMount = useRef(true);

  // Sync state if initialJobs changes (e.g. server revalidation)
  useEffect(() => {
    setJobsList(initialJobs);
    if (initialTotal) {
      setTotalJobs(initialTotal);
      setTotalPages(Math.ceil(initialTotal / 50) || 1);
    }
    if (initialTotalPages) setTotalPages(initialTotalPages);
  }, [initialJobs, initialTotal, initialTotalPages]);

  // Server pagination fetcher
  const fetchPageData = useCallback(async (targetPage: number) => {
    setIsFetchingPage(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(targetPage));
      params.set("limit", "50");
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (selectedCountry !== "All") params.set("country", selectedCountry);
      if (selectedState !== "All") params.set("state", selectedState);
      if (selectedCity !== "All") params.set("city", selectedCity);
      if (selectedCompany !== "All") params.set("company", selectedCompany);
      if (activeFilters["Job Type"] !== "All") params.set("jobType", activeFilters["Job Type"]);
      if (activeFilters["Work Mode"] !== "All") params.set("workMode", activeFilters["Work Mode"]);
      if (activeFilters["Experience"] !== "All") params.set("experience", activeFilters["Experience"]);
      if (sortBy !== "newest") params.set("sort", sortBy);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          setJobsList(data.items);
          setTotalJobs(data.total);
          setTotalPages(data.totalPages);
          setCurrentPage(data.page);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch jobs page:", e);
    } finally {
      setIsFetchingPage(false);
    }
  }, [searchQuery, selectedCountry, selectedState, selectedCity, selectedCompany, activeFilters, sortBy]);

  // When filters or search or sort change, reset to Page 1 and query server (debounced for search)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      fetchPageData(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCountry, selectedState, selectedCity, selectedCompany, activeFilters, sortBy, fetchPageData]);

  const handlePageChange = (targetPage: number) => {
    if (targetPage < 1 || targetPage > totalPages || targetPage === currentPage) return;
    fetchPageData(targetPage);
    const resultsEl = document.getElementById("job-results-section");
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleJumpPage = () => {
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      handlePageChange(p);
      setJumpPageInput("");
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  // Real-time live polling: checks every 30 seconds for newly added jobs in live database
  useEffect(() => {
    const poller = setInterval(async () => {
      try {
        const res = await fetch('/api/jobs?limit=50');
        if (res.ok) {
          const data = await res.json();
          if (data.items && Array.isArray(data.items)) {
            const currentSlugs = new Set(jobsList.map(j => j.slug));
            const newOnes = data.items.filter((j: Job) => !currentSlugs.has(j.slug));
            if (newOnes.length > 0) {
              setIncomingJobs(newOnes);
            }
          }
        }
      } catch (err) {
        // silent fallback
      }
    }, 30000);

    return () => clearInterval(poller);
  }, [jobsList]);

  const applyIncomingJobs = () => {
    setJobsList(prev => {
      const prevSlugs = new Set(prev.map(p => p.slug));
      const fresh = incomingJobs.filter(j => !prevSlugs.has(j.slug));
      return [...fresh, ...prev];
    });
    setIncomingJobs([]);
  };

  // Total jobs within 30 days window
  const totalRecentJobs = useMemo(() => {
    const now = new Date().getTime();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    return jobsList.filter(job => {
      const postTime = new Date(job.posted_at || job.first_seen_at).getTime();
      return (now - postTime) <= THIRTY_DAYS_MS;
    }).length;
  }, [jobsList]);

  // Available companies in dataset (only from 30-day recent jobs)
  const availableCompanies = useMemo(() => {
    const map = new Map<string, string>();
    const now = new Date().getTime();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    jobsList.forEach(j => {
      const postTime = new Date(j.posted_at || j.first_seen_at).getTime();
      if ((now - postTime) <= THIRTY_DAYS_MS) {
        if (j.company?.name && j.company?.slug) {
          map.set(j.company.slug, j.company.name);
        }
      }
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [jobsList]);

  const companyOptions = useMemo(() => [
    { label: "All Companies", value: "All" },
    ...availableCompanies.map(comp => ({
      label: comp.name,
      value: comp.slug
    }))
  ], [availableCompanies]);

  const jobTypeOptions = useMemo(() => [
    { label: "All Job Types", value: "All" },
    { label: "Full Time", value: "Full Time" },
    { label: "Internship", value: "Internship" },
    { label: "Contract", value: "Contract" }
  ], []);

  const workModeOptions = useMemo(() => [
    { label: "All Work Modes", value: "All" },
    { label: "Remote", value: "Remote" },
    { label: "Hybrid", value: "Hybrid" },
    { label: "Onsite", value: "Onsite" }
  ], []);

  const experienceOptions = useMemo(() => [
    { label: "All Experience", value: "All" },
    { label: "Freshers (0–1 Yrs)", value: "0-1" },
    { label: "Early Career (1–3 Yrs)", value: "1-3" },
    { label: "Mid Level (3–5 Yrs)", value: "3-5" },
    { label: "Senior / Lead (5+ Yrs)", value: "5+" }
  ], []);


  const sortOptions = useMemo(() => [
    { label: "Newest First", value: "newest" },
    { label: "Fresher + Highest Salary", value: "fresher_highest_salary" },
    { label: "High Salary + Newest", value: "high_salary_newest" },
    { label: "Highest Salary", value: "salary_high" },
    { label: "Accessible Salary (Low to High)", value: "salary_low" },
    { label: "Oldest First", value: "oldest" }
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
      { label: `All Regions in ${selectedCountry}`, value: "All" }
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
      (jobsList || []).forEach(job => {
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
        { label: `All Cities in ${selectedCountry}`, value: "All" },
        ...Array.from(extractedSet).map(cityName => ({
          label: cityName,
          value: cityName
        }))
      ];
    }

    return (cities || []).filter(c => Boolean(c && typeof c.label === "string" && typeof c.value === "string"));
  }, [selectedCountry, selectedState, jobsList]);

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
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity("All");
  };

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  // Restore filters and scroll position on browser navigation
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const hasUrlParams = urlParams.toString().length > 0;

      // Only restore filter state if URL explicitly contains query parameters
      // This prevents a clean page visit or browser refresh from resurrecting stale search filters
      if (hasUrlParams) {
        const q = urlParams.get("q");
        if (q) setSearchQuery(q);

        const country = urlParams.get("country");
        if (country && country !== "All") setSelectedCountry(country);

        const state = urlParams.get("state");
        if (state && state !== "All") setSelectedState(state);

        const city = urlParams.get("city");
        if (city && city !== "All") setSelectedCity(city);

        const company = urlParams.get("company");
        if (company && company !== "All") setSelectedCompany(company);

        const sort = urlParams.get("sort") as SortBy;
        if (sort && ["newest", "high_salary_newest", "oldest", "salary_high", "salary_low"].includes(sort)) {
          setSortBy(sort);
        }

        const type = urlParams.get("type");
        const mode = urlParams.get("mode");
        const exp = urlParams.get("exp");
        if (type || mode || exp) {
          setActiveFilters({
            "Job Type": type || "All",
            "Work Mode": mode || "All",
            "Experience": exp || "All"
          });
        }

        const page = parseInt(urlParams.get("page") || "1", 10);
        if (page > 1) {
          setCurrentPage(page);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Ensure Jobs page ALWAYS starts at the very top on load or refresh
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      try {
        sessionStorage.removeItem("jobpulse_scroll_pos");
      } catch (e) {
        // ignore
      }
    }

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Sync state to URL search params and sessionStorage on any change
  useEffect(() => {
    try {
      const stateToSave = {
        searchQuery,
        selectedCountry,
        selectedState,
        selectedCity,
        selectedCompany,
        sortBy,
        activeFilters,
        currentPage
      };
      sessionStorage.setItem("jobpulse_feed_state", JSON.stringify(stateToSave));

      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (selectedCountry !== "All") params.set("country", selectedCountry);
      if (selectedState !== "All") params.set("state", selectedState);
      if (selectedCity !== "All") params.set("city", selectedCity);
      if (selectedCompany !== "All") params.set("company", selectedCompany);
      if (sortBy !== "newest") params.set("sort", sortBy);
      if (activeFilters["Job Type"] !== "All") params.set("type", activeFilters["Job Type"]);
      if (activeFilters["Work Mode"] !== "All") params.set("mode", activeFilters["Work Mode"]);
      if (activeFilters["Experience"] !== "All") params.set("exp", activeFilters["Experience"]);

      const queryStr = params.toString();
      const newUrl = queryStr ? `${window.location.pathname}?${queryStr}` : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    } catch (e) {
      // ignore
    }
  }, [searchQuery, selectedCountry, selectedState, selectedCity, selectedCompany, sortBy, activeFilters, currentPage]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCountry("All");
    setSelectedState("All");
    setSelectedCity("All");
    setSelectedCompany("All");
    setSortBy("newest");
    setActiveFilters({
      "Job Type": "All",
      "Work Mode": "All",
      "Experience": "All"
    });
    try {
      sessionStorage.removeItem("jobpulse_feed_state");
      sessionStorage.removeItem("jobpulse_scroll_pos");
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", window.location.pathname);
      }
    } catch (e) {
      // ignore
    }
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

  const displayedJobs = jobsList;

  const hasStates = dynamicStates.length > 1 || availableStates.length > 1;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-emerald-50/20 to-slate-50 border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 pt-7 sm:pt-9 pb-7 sm:pb-9">
        {/* Ambient subtle tech background patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none" />
        <div className="absolute -top-32 right-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-[1360px] relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* LEFT COLUMN: 58% width - Badge, Headline, Paragraph, Live Statistics */}
            <div className="order-1 lg:col-span-7 flex flex-col justify-center">
              {/* Small live badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 mb-4 tracking-wide shadow-2xs w-fit">
                <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />
                <span>LIVE ATS JOB DISCOVERY</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[62px] font-black text-slate-900 tracking-tight leading-[1.08] mb-4">
                Fresh jobs today.<br />
                A head start for your<br />
                <span className="text-teal-600">tomorrow.</span>
              </h1>

              {/* Concise Description */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-[620px] leading-relaxed mb-6 font-normal">
                JobPulse continuously discovers job openings directly from official company career systems, so you can find and apply to new opportunities before they get buried on other job boards.
              </p>

              {/* 3 Compact Live Statistics */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 pt-1">
                {/* Stat 1: Active Opportunities */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/70 shadow-2xs">
                    <Zap className="w-5 h-5 fill-emerald-500 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {totalJobs.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">active opportunities</div>
                  </div>
                </div>

                {/* Stat 2: Verified Portals */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100/80 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200/70 shadow-2xs">
                    <ShieldCheck className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {(stats?.total_companies || availableCompanies.length || 17533).toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">verified portals</div>
                  </div>
                </div>

                {/* Stat 3: Updated Hourly */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-100/80 text-cyan-700 flex items-center justify-center shrink-0 border border-cyan-200/70 shadow-2xs">
                    <Clock className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                      Updated hourly
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Fresh. Accurate. Official.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: 42% width - Art-Directed Visual Composition */}
            <div className="order-3 lg:order-2 lg:col-span-5 relative w-full flex items-center justify-center lg:justify-end select-none">
              {/* DESKTOP ART-DIRECTED CANVAS: Exactly 560px × 435px, all elements in dedicated coordinate space */}
              <div className="hidden lg:block relative w-[560px] h-[435px] origin-top-right lg:scale-[0.92] xl:scale-100 transition-transform">
                {/* 1. Globe / Orbital Backdrop (Behind, centered at x:330, y:230) */}
                <div className="absolute right-[0px] top-[30px] w-[320px] h-[320px] pointer-events-none opacity-45">
                  <svg viewBox="0 0 340 340" className="w-full h-full text-teal-500/40">
                    <circle cx="170" cy="170" r="160" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="170" cy="170" r="120" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                    <circle cx="170" cy="170" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                    <ellipse cx="170" cy="170" rx="120" ry="50" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                    <ellipse cx="170" cy="170" rx="120" ry="90" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                    <line x1="170" y1="50" x2="170" y2="290" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                    <line x1="50" y1="170" x2="290" y2="170" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                    <circle cx="170" cy="170" r="110" fill="url(#heroGlobeGlow)" opacity="0.3" />
                    <defs>
                      <radialGradient id="heroGlobeGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>

                {/* 2. ATS Source Labels along the right orbital boundary (completely unclipped, never behind cards) */}
                <div className="absolute top-[10px] right-[75px] z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-teal-200/80 shadow-2xs text-[11px] font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Greenhouse</span>
                </div>
                <div className="absolute top-[86px] right-[0px] z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-teal-200/80 shadow-2xs text-[11px] font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span>Lever</span>
                </div>
                <div className="absolute top-[198px] -right-[10px] z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-teal-200/80 shadow-2xs text-[11px] font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  <span>Ashby</span>
                </div>
                <div className="absolute top-[318px] right-[4px] z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-teal-200/80 shadow-2xs text-[11px] font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Workday</span>
                </div>

                {/* 3. Annotation 1 (Top Left, dedicated whitespace above Card 1) */}
                <div className="absolute top-[6px] left-[55px] z-30 pointer-events-none flex items-center gap-1.5">
                  <span className="font-serif italic font-semibold text-slate-700 text-xs sm:text-sm tracking-wide">
                    New jobs as soon as they&apos;re live!
                  </span>
                  <svg width="44" height="28" viewBox="0 0 50 30" fill="none" className="text-slate-600">
                    <path d="M4 10 C18 4, 34 6, 44 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M38 23 L46 23 L45 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* 4. CARD 1: Upper-Right (Google / Software Engineer) */}
                <div className="absolute top-[38px] right-[24px] w-[335px] bg-white border border-slate-200/90 rounded-2xl p-4 shadow-md shadow-slate-200/50 hover:shadow-lg transition-all z-20">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 p-1.5 flex items-center justify-center shadow-2xs shrink-0">
                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 leading-tight truncate">Software Engineer</h4>
                        <p className="text-xs text-slate-500 font-medium">Google</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      NEW
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Bengaluru, India</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Hybrid</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>12 minutes ago</span>
                  </div>
                </div>

                {/* 5. CARD 2: Middle-Left (Microsoft / Product Manager) */}
                <div className="absolute top-[150px] left-[16px] w-[335px] bg-white border border-slate-200/90 rounded-2xl p-4 shadow-md shadow-slate-200/50 hover:shadow-lg transition-all z-20">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 p-2 flex items-center justify-center shadow-2xs shrink-0">
                        <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                          <div className="bg-[#f25022] w-2 h-2"></div>
                          <div className="bg-[#7fba00] w-2 h-2"></div>
                          <div className="bg-[#00a4ef] w-2 h-2"></div>
                          <div className="bg-[#ffb900] w-2 h-2"></div>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 leading-tight truncate">Product Manager</h4>
                        <p className="text-xs text-slate-500 font-medium">Microsoft</p>
                      </div>
                    </div>
                    <Bookmark className="w-4 h-4 text-slate-300 hover:text-slate-600 cursor-pointer shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Hyderabad, India</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>On-site</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>28 minutes ago</span>
                  </div>
                </div>

                {/* 6. Annotation 2 (Mid-Right, open space between cards and Ashby/Workday labels) */}
                <div className="absolute top-[235px] right-[38px] z-30 pointer-events-none flex items-center gap-2">
                  <svg width="42" height="28" viewBox="0 0 45 30" fill="none" className="text-slate-600">
                    <path d="M40 24 C28 26, 14 18, 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M5 13 L5 5 L13 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-serif italic font-semibold text-slate-700 text-xs sm:text-sm tracking-wide max-w-[130px] leading-tight">
                    Real opportunities from official sources
                  </span>
                </div>

                {/* 7. CARD 3: Lower-Left (Airbnb / Data Analyst) */}
                <div className="absolute top-[262px] left-[52px] w-[320px] bg-white border border-slate-200/90 rounded-2xl p-4 shadow-md shadow-slate-200/50 hover:shadow-lg transition-all z-20">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 p-1.5 flex items-center justify-center shadow-2xs shrink-0">
                        <svg viewBox="0 0 32 32" className="w-5 h-5 text-[#FF5A5F] fill-current">
                          <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.18 12.607 6.18 16.592 0 5.568-4.524 9.114-10.464 9.114-5.94 0-11.464-3.546-11.464-9.114 0-3.985 4.226-12.762 6.18-16.592l.533-1.025C8.537 1.963 10.992 1 16 1zm0 2c-4.148 0-6.223.771-7.818 3.619l-.533 1.025C5.787 11.298 2 19.68 2 21.886c0 4.394 4.542 7.114 9.464 7.114 4.922 0 8.464-2.72 8.464-7.114 0-2.206-3.787-10.588-5.649-14.242l-.533-1.025C12.223 3.771 10.148 3 16 3zm0 10c2.761 0 5 2.239 5 5 0 2.253-1.492 4.156-3.542 4.767l-.458.118-.458-.118C14.492 22.156 13 20.253 13 18c0-2.761 2.239-5 5-5zm0 2c-1.657 0-3 1.343-3 3 0 1.258.775 2.335 1.874 2.769l.126.046.126-.046C16.225 20.335 17 19.258 17 18c0-1.657-1.343-3-3-3z"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 leading-tight truncate">Data Analyst</h4>
                        <p className="text-xs text-slate-500 font-medium">Airbnb</p>
                      </div>
                    </div>
                    <Bookmark className="w-4 h-4 text-slate-300 hover:text-slate-600 cursor-pointer shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Remote</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>1 hour ago</span>
                  </div>
                </div>

                {/* 8. Worldwide Opportunities Card (Bottom-Right, isolated below all cards & annotations) */}
                <div className="absolute top-[372px] right-[12px] w-[275px] bg-white border border-slate-200/90 rounded-2xl px-4 py-3 shadow-md shadow-slate-200/50 flex items-center justify-between gap-3 hover:border-teal-300 transition-colors z-20">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-200/80 text-teal-600 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs text-slate-900 leading-tight truncate">Worldwide Opportunities</h5>
                      <p className="text-[10px] text-slate-500 truncate">From {(stats?.total_companies || availableCompanies.length || 17533).toLocaleString()}+ official career portals</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>

              {/* MOBILE / TABLET CONTROLLED VERTICAL STACK (< 1024px): No overlaps, zero clipping, zero horizontal scroll */}
              <div className="lg:hidden w-full max-w-md mx-auto flex flex-col space-y-3.5 pt-4">
                {/* ATS Source Tags */}
                <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] pb-1">
                  <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold shadow-2xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Greenhouse
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold shadow-2xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span> Lever
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold shadow-2xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Ashby
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold shadow-2xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Workday
                  </span>
                </div>

                {/* Mobile Card 1 */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 p-1 flex items-center justify-center shadow-2xs shrink-0">
                        <svg viewBox="0 0 24 24" className="w-4 h-4">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">Software Engineer</h4>
                        <p className="text-[11px] text-slate-500">Google</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      NEW
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                    <span>Bengaluru, India · Hybrid</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">● 12 minutes ago</div>
                </div>

                {/* Mobile Card 2 */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 p-1 flex items-center justify-center shadow-2xs shrink-0">
                        <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                          <div className="bg-[#f25022]"></div>
                          <div className="bg-[#7fba00]"></div>
                          <div className="bg-[#00a4ef]"></div>
                          <div className="bg-[#ffb900]"></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">Product Manager</h4>
                        <p className="text-[11px] text-slate-500">Microsoft</p>
                      </div>
                    </div>
                    <Bookmark className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                    <span>Hyderabad, India · On-site</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">● 28 minutes ago</div>
                </div>

                {/* Mobile Card 3 */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 p-1 flex items-center justify-center shadow-2xs shrink-0">
                        <svg viewBox="0 0 32 32" className="w-4 h-4 text-[#FF5A5F] fill-current">
                          <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.18 12.607 6.18 16.592 0 5.568-4.524 9.114-10.464 9.114-5.94 0-11.464-3.546-11.464-9.114 0-3.985 4.226-12.762 6.18-16.592l.533-1.025C8.537 1.963 10.992 1 16 1zm0 2c-4.148 0-6.223.771-7.818 3.619l-.533 1.025C5.787 11.298 2 19.68 2 21.886c0 4.394 4.542 7.114 9.464 7.114 4.922 0 8.464-2.72 8.464-7.114 0-2.206-3.787-10.588-5.649-14.242l-.533-1.025C12.223 3.771 10.148 3 16 3zm0 10c2.761 0 5 2.239 5 5 0 2.253-1.492 4.156-3.542 4.767l-.458.118-.458-.118C14.492 22.156 13 20.253 13 18c0-2.761 2.239-5 5-5zm0 2c-1.657 0-3 1.343-3 3 0 1.258.775 2.335 1.874 2.769l.126.046.126-.046C16.225 20.335 17 19.258 17 18c0-1.657-1.343-3-3-3z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">Data Analyst</h4>
                        <p className="text-[11px] text-slate-500">Airbnb</p>
                      </div>
                    </div>
                    <Bookmark className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                    <span>Remote</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">● 1 hour ago</div>
                </div>

                {/* Mobile Worldwide Opportunities */}
                <div className="bg-white border border-slate-200/90 rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200/80 text-teal-600 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 leading-tight">Worldwide Opportunities</h5>
                      <p className="text-[10px] text-slate-500">From {(stats?.total_companies || availableCompanies.length || 17533).toLocaleString()}+ official career portals</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>
            </div>

            {/* Search Bar + Trending Row (order-2 on mobile, order-3 on desktop spanning col-span-12) */}
            <div className="order-2 lg:order-3 lg:col-span-12 w-full max-w-3xl mx-auto mt-2 lg:mt-4 px-2 sm:px-0">
              {/* Search Bar matching Companies Page visual design */}
              <div className="relative flex items-center bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:border-slate-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all p-1.5 sm:p-2 min-h-[58px]">
                <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      document.getElementById("job-results-section")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  placeholder="Search by role (e.g. Software Engineer), company, tech stack, or city..."
                  className="w-full bg-transparent px-3.5 py-2 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors mr-2 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    document.getElementById("job-results-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold px-7 sm:px-8 h-11 sm:h-12 rounded-xl flex items-center gap-2 text-sm sm:text-base shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  <span>Search</span>
                </button>
              </div>

              {/* 🔥 Trending Searches Row */}
              <div className="flex flex-wrap items-center gap-2 max-w-3xl mx-auto mt-2.5 sm:mt-3 text-xs text-slate-600 px-1 justify-center sm:justify-start">
                <span className="flex items-center gap-1 font-bold text-slate-800 mr-1">
                  <span>🔥</span>
                  <span>Trending:</span>
                </span>
                {[
                  "Software Engineer",
                  "Data Analyst",
                  "Product Manager",
                  "Customer Service",
                  "DevOps",
                  "Designer"
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      document.getElementById("job-results-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                      searchQuery.toLowerCase() === term.toLowerCase()
                        ? "bg-teal-600 text-white border-teal-600 shadow-2xs"
                        : "bg-teal-50/70 hover:bg-teal-100 text-teal-800 border-teal-200/60"
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="w-full border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-16 z-40">
        <div className="container mx-auto px-2.5 sm:px-4 py-2.5 max-w-[1440px]">
          <div className="flex flex-col gap-2">
            {/* Row 1: Location & Company (4 filters) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <SearchableSelect
                ariaLabel="Country"
                icon={<Globe className="w-3.5 h-3.5" />}
                options={ALL_WORLD_COUNTRIES}
                value={selectedCountry}
                onChange={handleCountryChange}
                placeholder="All Countries"
                searchPlaceholder="Search 250+ countries..."
              />
              <SearchableSelect
                ariaLabel="State or Region"
                icon={<Navigation className="w-3.5 h-3.5" />}
                options={dynamicStates.length > 0 ? dynamicStates : availableStates}
                value={selectedState}
                disabled={selectedCountry === "All" || selectedCountry === "Remote"}
                loading={loadingStates}
                loadingText="Loading States..."
                onChange={handleStateChange}
                placeholder={
                  selectedCountry === "All"
                    ? "Select country first"
                    : !hasStates
                    ? "National (No States)"
                    : "All States / Regions"
                }
                searchPlaceholder="Search states / regions..."
              />
              <SearchableSelect
                ariaLabel="City"
                icon={<MapPin className="w-3.5 h-3.5" />}
                options={dynamicCities.length > 0 ? dynamicCities : availableCities}
                value={selectedCity}
                disabled={
                  selectedCountry === "All" ||
                  selectedCountry === "Remote" ||
                  (hasStates && selectedState === "All")
                }
                loading={loadingCities}
                loadingText="Loading Cities..."
                onChange={(val) => {
                  setSelectedCity(val);
                }}
                placeholder={
                  selectedCountry === "All"
                    ? "Select country first"
                    : hasStates && selectedState === "All"
                    ? "Select state first"
                    : selectedState !== "All"
                    ? `All Cities in ${selectedState}`
                    : "All Cities"
                }
                searchPlaceholder="Search cities..."
              />
              <SearchableSelect
                ariaLabel="Company"
                icon={<Building2 className="w-3.5 h-3.5" />}
                options={companyOptions}
                value={selectedCompany}
                onChange={(val) => {
                  setSelectedCompany(val);
                }}
                placeholder="All Companies"
                searchPlaceholder="Search companies..."
              />
            </div>

            {/* Row 2: Job Type, Work Mode, Experience, Sort Order (4 filters - balanced) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <SearchableSelect
                ariaLabel="Job Type"
                icon={<Briefcase className="w-3.5 h-3.5" />}
                options={jobTypeOptions}
                value={activeFilters["Job Type"]}
                onChange={(val) => toggleFilter("Job Type", val)}
                placeholder="All Job Types"
                searchPlaceholder="Search job type..."
              />
              <SearchableSelect
                ariaLabel="Work Mode"
                icon={<Laptop className="w-3.5 h-3.5" />}
                options={workModeOptions}
                value={activeFilters["Work Mode"]}
                onChange={(val) => toggleFilter("Work Mode", val)}
                placeholder="All Work Modes"
                searchPlaceholder="Search work mode..."
              />
              <SearchableSelect
                ariaLabel="Experience Level"
                icon={<GraduationCap className="w-3.5 h-3.5" />}
                options={experienceOptions}
                value={activeFilters["Experience"]}
                onChange={(val) => toggleFilter("Experience", val)}
                placeholder="All Experience"
                searchPlaceholder="Search experience..."
              />
              <SearchableSelect
                ariaLabel="Sort Order"
                icon={<ArrowUpDown className="w-3.5 h-3.5" />}
                options={sortOptions}
                value={sortBy}
                onChange={(val) => setSortBy(val as any)}
                placeholder="Newest First"
                searchPlaceholder="Search sort order..."
              />
            </div>
          </div>

          {/* Active Filter Summary */}
          {isFiltered && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-1.5 flex-wrap text-slate-600">
                <span><strong className="text-slate-900">{totalJobs.toLocaleString()}</strong> {totalJobs === 1 ? "result" : "results"}</span>
                {selectedCountry !== "All" && (
                  <span className="text-slate-500">· {selectedCountry}</span>
                )}
                {selectedState !== "All" && (
                  <span className="text-slate-500">· {selectedState}</span>
                )}
                {selectedCity !== "All" && (
                  <span className="text-slate-500">· {selectedCity}</span>
                )}
                {selectedCompany !== "All" && (
                  <span className="text-slate-500">· {availableCompanies.find(c => c.slug === selectedCompany)?.name || selectedCompany}</span>
                )}
                {activeFilters["Job Type"] !== "All" && (
                  <span className="text-slate-500">· {activeFilters["Job Type"]}</span>
                )}
                {activeFilters["Work Mode"] !== "All" && (
                  <span className="text-slate-500">· {activeFilters["Work Mode"]}</span>
                )}
                {activeFilters["Experience"] !== "All" && (
                  <span className="text-slate-500">· {activeFilters["Experience"] === "0-1" ? "Freshers (0–1 Yrs)" : `${activeFilters["Experience"]} Yrs`}</span>
                )}
                {sortBy === "high_salary_newest" && (
                  <span className="text-slate-500">· High Salary + Newest</span>
                )}
              </div>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-700 font-medium transition-colors text-xs cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Job Feed */}
      <section id="job-results-section" className="py-6 bg-slate-50 flex-1 scroll-mt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-5 pb-3 border-b border-slate-200">
            <div>
              <p className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Showing {totalJobs.toLocaleString()} verified openings</span>
                <span className="hidden sm:inline text-slate-300 font-normal">|</span>
                <span className="hidden sm:inline text-xs font-normal text-slate-500">
                  Synced directly from official company ATS portals
                </span>
              </p>
              <p className="sm:hidden text-xs text-slate-500 mt-0.5">
                Synced directly from official company ATS portals
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 text-teal-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                Updated continuously
              </span>
              <span>·</span>
              <span className="font-medium text-slate-700">Page {currentPage} of {totalPages}</span>
            </div>
          </div>

          {/* New Jobs Alert */}
          {incomingJobs.length > 0 && (
            <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-emerald-800">
                  <strong>{incomingJobs.length}</strong> new {incomingJobs.length === 1 ? 'opening' : 'openings'} synced from official portals
                </span>
              </div>
              <button
                onClick={applyIncomingJobs}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
              >
                Refresh
              </button>
            </div>
          )}

          {/* Job Grid */}
          {isFetchingPage ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse h-56">
                  <div className="flex items-start gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-3 bg-slate-200 rounded w-full mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-5/6 mb-4" />
                  <div className="flex gap-1.5 mb-4">
                    <div className="h-5 bg-slate-200 rounded w-14" />
                    <div className="h-5 bg-slate-200 rounded w-16" />
                    <div className="h-5 bg-slate-200 rounded w-12" />
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                    <div className="h-3 bg-slate-200 rounded w-16" />
                    <div className="flex gap-1.5">
                      <div className="h-6 bg-slate-200 rounded w-14" />
                      <div className="h-6 bg-teal-200 rounded w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-lg p-8">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                No jobs match your current filters
              </h3>
              <p className="text-sm text-slate-500 mb-5 max-w-xs mx-auto">
                Try widening your search — select a different country, remove a filter, or clear the search query.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset all filters
              </button>
            </div>
          )}


          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 py-4 border-t border-slate-200">
              <div className="text-xs text-slate-500">
                Showing {((currentPage - 1) * 50) + 1}–{Math.min(currentPage * 50, totalJobs)} of {totalJobs.toLocaleString()}
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1 || isFetchingPage}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Previous
                </button>

                {getPageNumbers().map((p, idx) => (
                  typeof p === "number" ? (
                    <button
                      key={idx}
                      disabled={isFetchingPage}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 text-xs font-medium rounded transition-colors cursor-pointer ${
                        p === currentPage
                          ? "bg-teal-600 text-white font-semibold shadow-xs"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {p}
                    </button>
                  ) : (
                    <span key={idx} className="px-1 text-slate-400 text-xs">...</span>
                  )
                ))}

                <button
                  disabled={currentPage >= totalPages || isFetchingPage}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Go to page</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpPageInput}
                  onChange={(e) => setJumpPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleJumpPage();
                  }}
                  placeholder={String(currentPage)}
                  className="w-12 px-1.5 py-1 border border-slate-300 rounded bg-white text-slate-900 text-center text-xs outline-none focus:border-slate-500"
                />
                <button
                  onClick={handleJumpPage}
                  className="px-2 py-1 text-xs font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Go
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
