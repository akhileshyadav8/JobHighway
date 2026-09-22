"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Job, OverviewStats } from "@/lib/api";
import { JobCard } from "@/components/jobs/JobCard";
import { Search, X, RotateCcw, MapPin, Globe, Building2, ArrowUpDown, Navigation, Briefcase, GraduationCap, Laptop } from "lucide-react";
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

      // Smoothly restore previous scroll position when returning from details
      const savedScroll = sessionStorage.getItem("jobpulse_scroll_pos");
      if (savedScroll) {
        setTimeout(() => {
          window.scrollTo({ top: Number(savedScroll), behavior: "instant" });
        }, 100);
      }
    } catch (e) {
      // ignore
    }
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
      <section className="bg-white border-b border-slate-200 px-4 py-8 sm:py-12">
        <div className="container mx-auto max-w-4xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/80 mb-3.5 tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
            </span>
            <span>REAL-TIME ATS JOB DISCOVERY</span>
          </div>

          {/* Punchy Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.12] mb-3">
            Find the job.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
              Before everyone else.
            </span>
          </h1>

          {/* Highlighted Value Proposition */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed mb-6">
            JobPulse continuously discovers openings{" "}
            <span className="text-slate-900 font-semibold bg-teal-50 text-teal-900 px-1.5 py-0.5 rounded border border-teal-200/60">
              directly from official company career systems
            </span>
            , so you can find fresh opportunities{" "}
            <span className="text-slate-900 font-semibold bg-teal-50 text-teal-900 px-1.5 py-0.5 rounded border border-teal-200/60">
              before outdated listings reach other job boards
            </span>
            .
          </p>

          {/* Canonical Search Bar with prominent Search Button */}
          <div className="relative flex items-center gap-2 w-full max-w-3xl mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 w-5 h-5 pointer-events-none" />
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
                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                document.getElementById("job-results-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>

          {/* Dynamic Factual Stats Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 mb-6">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
              <strong className="text-slate-900 font-semibold">{totalJobs.toLocaleString()}</strong> active opportunities
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5 font-medium">
              <strong className="text-slate-900 font-semibold">{(stats?.total_companies || availableCompanies.length).toLocaleString()}</strong> verified portals
            </span>
            <span className="text-slate-300">·</span>
            <span className="font-medium">Updated hourly</span>
            <span className="text-slate-300">·</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live ATS sync · Updated recently
            </span>
          </div>

          {/* Visual USP Mechanism Flow */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 max-w-3xl">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Direct Ingestion Pipeline
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2.5 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs flex-1">
                <Building2 className="w-4 h-4 text-slate-600 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900 block leading-tight">Official Company ATS</span>
                  <span className="text-[10px] text-slate-500">Greenhouse · Lever · Ashby · Workday</span>
                </div>
              </div>
              <div className="hidden sm:flex text-slate-300 items-center justify-center px-1 font-bold text-sm">
                →
              </div>
              <div className="flex items-center gap-2.5 bg-teal-50/80 border border-teal-200/80 px-3 py-2 rounded-lg shadow-2xs flex-1">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shrink-0"></div>
                <div>
                  <span className="font-semibold text-teal-900 block leading-tight">JobPulse Frequent Sync</span>
                  <span className="text-[10px] text-teal-700">Zero intermediary delay</span>
                </div>
              </div>
              <div className="hidden sm:flex text-slate-300 items-center justify-center px-1 font-bold text-sm">
                →
              </div>
              <div className="flex items-center gap-2.5 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs flex-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                <div>
                  <span className="font-semibold text-slate-900 block leading-tight">Candidate First</span>
                  <span className="text-[10px] text-slate-500">Apply before caps hit</span>
                </div>
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
