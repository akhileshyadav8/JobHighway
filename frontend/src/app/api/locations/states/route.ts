import { NextResponse } from 'next/server';
import { Country, State } from 'country-state-city';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryQuery = searchParams.get('country') || searchParams.get('countryCode');

  if (!countryQuery || countryQuery === 'All' || countryQuery === 'Remote') {
    return NextResponse.json([]);
  }

  // Find country by code or name
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

  const states = State.getStatesOfCountry(country.isoCode);
  const result = [
    { label: `📍 All States in ${country.name}`, value: 'All', code: 'All' },
    ...states.map(s => ({
      label: s.name,
      value: s.name,
      code: s.isoCode
    }))
  ];

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
