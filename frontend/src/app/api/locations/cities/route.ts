import { NextResponse } from 'next/server';
import { Country, State, City } from 'country-state-city';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryQuery = searchParams.get('country') || searchParams.get('countryCode');
  const stateQuery = searchParams.get('state') || searchParams.get('stateCode');

  if (!countryQuery || countryQuery === 'All' || countryQuery === 'Remote') {
    return NextResponse.json([]);
  }

  // Find country
  let country = Country.getCountryByCode(countryQuery.toUpperCase());
  if (!country) {
    const all = Country.getAllCountries();
    const queryLower = countryQuery.toLowerCase();
    country = all.find(
      c => c.name.toLowerCase() === queryLower || 
           c.isoCode.toLowerCase() === queryLower
    );
  }

  if (!country) {
    return NextResponse.json([]);
  }

  let cities: { name: string }[] = [];

  // If a specific state is selected (and not "All")
  if (stateQuery && stateQuery !== 'All') {
    const states = State.getStatesOfCountry(country.isoCode);
    const queryStateLower = stateQuery.toLowerCase();
    const matchedState = states.find(
      s => s.isoCode.toLowerCase() === queryStateLower ||
           s.name.toLowerCase() === queryStateLower
    );

    if (matchedState) {
      cities = City.getCitiesOfState(country.isoCode, matchedState.isoCode) || [];
    }
  }

  // If no state was specified or state cities came out empty, fallback to country cities (capped at 500)
  if (cities.length === 0 && (!stateQuery || stateQuery === 'All')) {
    const allCountryCities = City.getCitiesOfCountry(country.isoCode) || [];
    cities = allCountryCities.slice(0, 500);
  }

  // Extract unique city names
  const uniqueNames = Array.from(new Set(cities.map(c => c.name)));

  const result = [
    { label: `📍 All Cities`, value: 'All' },
    ...uniqueNames.map(name => ({
      label: name,
      value: name
    }))
  ];

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
