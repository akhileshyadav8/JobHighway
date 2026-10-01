import { NextRequest, NextResponse } from 'next/server';
import { getCandidateRecommendationPool } from '@/lib/db';
import {
  CandidateRecommendationProfile,
  rankRecommendations,
  detectCandidateDomain
} from '@/lib/recommendationEngine';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const candidate: CandidateRecommendationProfile = body.candidate || {};
    const limit = typeof body.limit === 'number' ? Math.min(50, Math.max(1, body.limit)) : 12;

    const domain = detectCandidateDomain(candidate);
    
    // Fetch candidate-tailored recommendation pool from active database jobs
    const pool = await getCandidateRecommendationPool(candidate, 120);

    // Score and rank using truthful multi-factor engine
    const ranked = rankRecommendations(pool, candidate, limit);

    return NextResponse.json({
      success: true,
      recommendations: ranked,
      totalFound: ranked.length,
      candidateDomain: domain ? domain.name : null
    });
  } catch (error) {
    console.error('Error in /api/jobs/recommendations POST:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error), 
        stack: error instanceof Error ? error.stack : undefined,
        recommendations: [] 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetRole = searchParams.get('targetRole') || undefined;
    const skillsParam = searchParams.get('skills');
    const skills = skillsParam ? skillsParam.split(',').map(s => s.trim()).filter(Boolean) : undefined;
    const yearsExperience = searchParams.get('yearsExperience') || undefined;
    const preferredLocation = searchParams.get('location') || undefined;
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const candidate: CandidateRecommendationProfile = {
      targetRole,
      skills,
      yearsExperience,
      preferredLocation
    };

    const domain = detectCandidateDomain(candidate);
    const pool = await getCandidateRecommendationPool(candidate, 120);
    const ranked = rankRecommendations(pool, candidate, limit);

    return NextResponse.json({
      success: true,
      recommendations: ranked,
      totalFound: ranked.length,
      candidateDomain: domain ? domain.name : null
    });
  } catch (error) {
    console.error('Error in /api/jobs/recommendations GET:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to compute recommendations', recommendations: [] },
      { status: 500 }
    );
  }
}
