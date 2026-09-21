"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Job, OverviewStats } from "@/lib/api";
import { JobCard } from "@/components/jobs/JobCard";
import { Search, X, RotateCcw, MapPin, Globe, Building2, ArrowUpDown, Navigation, Briefcase, GraduationCap, Laptop, Coins } from "lucide-react";
import { ALL_WORLD_COUNTRIES, COUNTRY_STATES, STATE_CITIES } from "@/lib/world_locations";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

const FILTER_CONFIG = {
  "Job Type": ["All", "Full Time", "Internship", "Contract"],
  "Work Mode": ["All", "Remote", "Hybrid", "Onsite"],
  "Experience": ["All", "0-1", "1-3", "3-5", "5+"],
  "Salary": ["All", "High Salary", "Mid Salary", "Entry Level"]
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
    "Experience": "All",
    "Salary": "All"
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
      if (activeFilters["Salary"] !== "All") params.set("salary", activeFilters["Salary"]);
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

  const salaryOptions = useMemo(() => [
    { label: "All Salaries", value: "All" },
    { label: "High Salary (₹12L+ / \$80K+)", value: "High Salary" },
    { label: "Mid Salary (₹6L–₹12L / \$40K–\$80K)", value: "Mid Salary" },
    { label: "Entry Salary (< ₹6L / < \$40K)", value: "Entry Level" }
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

  // Restore filters and scroll position on browser back button navigation or initial page load
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const saved = sessionStorage.getItem("jobpulse_feed_state");
      const parsed = saved ? JSON.parse(saved) : null;

      const q = urlParams.get("q") ?? parsed?.searchQuery;
      if (q) setSearchQuery(q);

      const country = urlParams.get("country") ?? parsed?.selectedCountry;
      if (country && country !== "All") setSelectedCountry(country);

      const state = urlParams.get("state") ?? parsed?.selectedState;
      if (state && state !== "All") setSelectedState(state);

      const city = urlParams.get("city") ?? parsed?.selectedCity;
      if (city && city !== "All") setSelectedCity(city);

      const company = urlParams.get("company") ?? parsed?.selectedCompany;
      if (company && company !== "All") setSelectedCompany(company);

      const sort = (urlParams.get("sort") ?? parsed?.sortBy) as SortBy;
      if (sort && ["newest", "high_salary_newest", "oldest", "salary_high", "salary_low"].includes(sort)) {
        setSortBy(sort);
      }

      const type = urlParams.get("type") ?? parsed?.activeFilters?.["Job Type"];
      const mode = urlParams.get("mode") ?? parsed?.activeFilters?.["Work Mode"];
      const exp = urlParams.get("exp") ?? parsed?.activeFilters?.["Experience"];
      const salary = urlParams.get("salary") ?? parsed?.activeFilters?.["Salary"];
      if (type || mode || exp || salary) {
        setActiveFilters({
          "Job Type": type || "All",
          "Work Mode": mode || "All",
          "Experience": exp || "All",
          "Salary": salary || "All"
        });
      }

      if (parsed?.currentPage && parsed.currentPage > 1) {
        setCurrentPage(parsed.currentPage);
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
      if (activeFilters["Salary"] !== "All") params.set("salary", activeFilters["Salary"]);

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
      "Experience": "All",
      "Salary": "All"
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

  // Real-time filtering engine with strict 1-month recency and sorting
  const filteredAndSortedJobs = useMemo(() => {
    const now = new Date().getTime();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    // 1. Filter jobs
    const filtered = jobsList.filter(job => {
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

      // Experience Level filter
      if (activeFilters["Experience"] !== "All") {
        const expFilter = activeFilters["Experience"];
        const expMin = job.experience_min ?? 0;
        const isSeniorTitle = SENIOR_TITLE_REGEX.test(job.title) && !FRESHER_TITLE_REGEX.test(job.title);
        const isFresherTitle = FRESHER_TITLE_REGEX.test(job.title) || FRESHER_TITLE_REGEX.test(job.employment_type || "");

        if (expFilter === "0-1") {
          if (isSeniorTitle) return false;
          if (job.experience_min !== null && job.experience_min !== undefined && job.experience_min > 0) return false;
          if (job.experience_max !== null && job.experience_max !== undefined && job.experience_max > 1 && !isFresherTitle) return false;
          const isFresher = job.experience_min === 0 || isFresherTitle;
          if (!isFresher) return false;
        } else if (expFilter === "1-3") {
          if (isSeniorTitle) return false;
          const effectiveMin = job.experience_min ?? 2;
          if (effectiveMin < 1 || effectiveMin > 3) return false;
        } else if (expFilter === "3-5") {
          const effectiveMin = job.experience_min ?? 3;
          if (effectiveMin < 3 || effectiveMin > 5) return false;
        } else if (expFilter === "5+") {
          const effectiveMin = job.experience_min ?? 0;
          const isSenior = effectiveMin >= 5 || isSeniorTitle;
          if (!isSenior) return false;
        }
      }

      // Salary Range filter
      if (activeFilters["Salary"] && activeFilters["Salary"] !== "All") {
        if (!matchesSalaryRange(job, activeFilters["Salary"])) {
          return false;
        }
      }

      // 1-Click Preset: High Salary + Newest
      if (sortBy === "high_salary_newest") {
        if (!isHighSalaryRole(job)) {
          return false;
        }
      }

      return true;
    });

    // 2. Sort jobs with protected timestamp resolution
    const getJobTime = (j: Job) => {
      const now = Date.now();
      const postTime = j.posted_at ? new Date(j.posted_at).getTime() : 0;
      const seenTime = j.first_seen_at ? new Date(j.first_seen_at).getTime() : 0;
      // If postTime is in the future (due to timezone offsets or clock skew), fallback to seenTime or now
      if (postTime > now || postTime === 0) {
        return seenTime > 0 && seenTime <= now ? seenTime : now;
      }
      return postTime;
    };

    return filtered.sort((a, b) => {
      if (sortBy === "high_salary_newest") {
        return getJobTime(b) - getJobTime(a);
      }
      if (sortBy === "salary_high") {
        const salaryA = getNormalizedAnnualSalaryUsd(a);
        const salaryB = getNormalizedAnnualSalaryUsd(b);
        if (salaryB !== salaryA) {
          return salaryB - salaryA;
        }
        return getJobTime(b) - getJobTime(a);
      }
      if (sortBy === "salary_low") {
        const salaryA = getNormalizedAnnualSalaryUsd(a);
        const salaryB = getNormalizedAnnualSalaryUsd(b);
        if (salaryA > 0 && salaryB > 0) {
          if (salaryA !== salaryB) return salaryA - salaryB;
        } else if (salaryA > 0) {
          return -1;
        } else if (salaryB > 0) {
          return 1;
        }
        return getJobTime(b) - getJobTime(a);
      }
      if (sortBy === "oldest") {
        return getJobTime(a) - getJobTime(b);
      }
      // Default: newest posted on top
      return getJobTime(b) - getJobTime(a);
    });
  }, [jobsList, searchQuery, selectedCountry, selectedState, selectedCity, selectedCompany, sortBy, activeFilters]);

  const displayedJobs = jobsList;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-5">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            Jobs updated within 1–2 hours of company posting
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-2xl">
            Direct from official career portals. While other boards take 3–14 days, JobPulse syncs hourly.
          </p>

          {/* Search */}
          <div className="relative mt-4 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search role, company, skill, or city..."
              className="w-full pl-10 pr-9 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:border-slate-400 dark:focus:border-slate-600 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-800 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Inline stats */}
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>
              <strong className="text-slate-900 dark:text-white font-semibold">{(stats?.total_jobs || totalRecentJobs || filteredAndSortedJobs.length).toLocaleString()}</strong> active jobs
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>
              <strong className="text-slate-900 dark:text-white font-semibold">{(stats?.total_companies || availableCompanies.length).toLocaleString()}</strong> companies
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>Last 30 days only</span>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="w-full border-b border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md sticky top-16 z-40">
        <div className="container mx-auto px-2.5 sm:px-4 py-2 max-w-[1440px]">
          <div className="flex flex-col gap-2">
            {/* Row 1: Location & Company */}
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
                placeholder={selectedCountry === "All" ? "Select country first" : "All States"}
                searchPlaceholder="Search states / regions..."
              />
              <SearchableSelect
                ariaLabel="City"
                icon={<MapPin className="w-3.5 h-3.5" />}
                options={dynamicCities.length > 0 ? dynamicCities : availableCities}
                value={selectedCity}
                disabled={selectedCountry === "All" || selectedCountry === "Remote"}
                loading={loadingCities}
                loadingText="Loading Cities..."
                onChange={(val) => {
                  setSelectedCity(val);
                              }}
                placeholder={selectedCountry === "All" ? "Select country first" : "All Cities"}
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

            {/* Row 2: Type, Mode, Experience, Salary, Sort */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
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
                ariaLabel="Salary Range"
                icon={<Coins className="w-3.5 h-3.5" />}
                options={salaryOptions}
                value={activeFilters["Salary"]}
                onChange={(val) => toggleFilter("Salary", val)}
                placeholder="All Salaries"
                searchPlaceholder="Search salary..."
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
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-1.5 flex-wrap text-slate-600 dark:text-slate-400">
                <span><strong className="text-slate-900 dark:text-white">{filteredAndSortedJobs.length}</strong> {filteredAndSortedJobs.length === 1 ? "result" : "results"}</span>
                {selectedCountry !== "All" && (
                  <span className="text-slate-500 dark:text-slate-400">· {selectedCountry}</span>
                )}
                {selectedState !== "All" && (
                  <span className="text-slate-500 dark:text-slate-400">· {selectedState}</span>
                )}
                {selectedCity !== "All" && (
                  <span className="text-slate-500 dark:text-slate-400">· {selectedCity}</span>
                )}
                {selectedCompany !== "All" && (
                  <span className="text-slate-500 dark:text-slate-400">· {availableCompanies.find(c => c.slug === selectedCompany)?.name || selectedCompany}</span>
                )}
                {activeFilters["Job Type"] !== "All" && (
                  <span className="text-slate-500 dark:text-slate-400">· {activeFilters["Job Type"]}</span>
                )}
                {activeFilters["Work Mode"] !== "All" && (
                  <span className="text-slate-500 dark:text-slate-400">· {activeFilters["Work Mode"]}</span>
                )}
                {activeFilters["Experience"] !== "All" && (
                  <span className="text-slate-500 dark:text-slate-400">· {activeFilters["Experience"] === "0-1" ? "Freshers (0–1 Yrs)" : `${activeFilters["Experience"]} Yrs`}</span>
                )}
                {activeFilters["Salary"] !== "All" && (
                  <span className="text-slate-500 dark:text-slate-400">· {activeFilters["Salary"]}</span>
                )}
                {sortBy === "high_salary_newest" && (
                  <span className="text-slate-500 dark:text-slate-400">· High Salary + Newest</span>
                )}
              </div>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium transition-colors text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Job Feed */}
      <section id="job-results-section" className="py-6 bg-slate-50 dark:bg-slate-950 flex-1 scroll-mt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages} · <strong className="text-slate-700 dark:text-slate-300">{totalJobs.toLocaleString()}</strong> jobs
            </p>
          </div>

          {/* New Jobs Alert */}
          {incomingJobs.length > 0 && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm text-emerald-800 dark:text-emerald-300">
                  <strong>{incomingJobs.length}</strong> new {incomingJobs.length === 1 ? 'job' : 'jobs'} discovered
                </span>
              </div>
              <button
                onClick={applyIncomingJobs}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors cursor-pointer"
              >
                Refresh
              </button>
            </div>
          )}

          {/* Job Grid */}
          {displayedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1.5">
                No jobs match your filters
              </h3>
              <p className="text-sm text-slate-500 mb-5">
                Try broadening your search or removing some filters.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset all filters
              </button>
            </div>
          )}

          {/* Loading */}
          {isFetchingPage && (
            <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-3.5 h-3.5 border-2 border-slate-300 dark:border-slate-600 border-t-transparent rounded-full animate-spin" />
              <span>Loading...</span>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-3 py-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {((currentPage - 1) * 50) + 1}–{Math.min(currentPage * 50, totalJobs)} of {totalJobs.toLocaleString()}
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1 || isFetchingPage}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Previous
                </button>

                {getPageNumbers().map((p, idx) => (
                  typeof p === "number" ? (
                    <button
                      key={idx}
                      disabled={isFetchingPage}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        p === currentPage
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Page</span>
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
                  className="w-12 px-2 py-1 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-center text-xs outline-none focus:border-slate-400 dark:focus:border-slate-600"
                />
                <button
                  onClick={handleJumpPage}
                  className="px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
