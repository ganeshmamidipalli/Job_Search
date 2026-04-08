import Anthropic from '@anthropic-ai/sdk';
import {
  getWikiFull,
  getWikiCondensed,
  getScoringSystem,
  getProfileContext,
} from '@/lib/wiki-context';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const SONNET_MODEL = 'claude-sonnet-4-20250514';
const OPUS_MODEL = 'claude-opus-4-20250514';

const SCREENING_SYSTEM = `You are a job fit screener for an AI Engineer candidate. You have the candidate's condensed profile below. Score the job 1.0-5.0 based on skills match, role fit, and career alignment. Be strict: only score above 4.0 if there is strong alignment.

Return ONLY valid JSON, no markdown, no explanation:
{"score": N.N, "reason": "one sentence why", "archetype": "detected role archetype"}

CANDIDATE PROFILE:
`;

const FULL_EVAL_SYSTEM = `You are a senior career advisor evaluating a job for Ganesh Mamidipalli. You have his complete professional profile and scoring system below. Generate a thorough evaluation with these blocks:

## A) Role Summary
Table: archetype, domain, function, seniority, remote, team size, TL;DR

## B) Match with CV
Map each JD requirement to specific experience from the profile. List gaps with mitigation strategies.

## C) Level & Strategy
Detected level vs candidate's natural level. Positioning strategy.

## D) Comp & Market
Expected salary range for this role. Note if you cannot verify current data.

## E) Customization Plan
Top 5 resume changes and top 5 LinkedIn changes for this role.

## F) Interview Prep
5-8 STAR stories mapped to JD requirements, drawn from the story bank.

End with:
## Score: X.X/5
## Recommendation: [Apply / Consider / Skip]

RULES: No em dashes. No "leverage", "delve", "groundbreaking". Lead with problems, not technology. Concrete numbers always.

CANDIDATE PROFILE:
`;

export async function POST(req: Request) {
  try {
    const { jobDescription, scoreOnly = true } = await req.json();

    if (!jobDescription || jobDescription.trim().length < 50) {
      return Response.json(
        { error: 'Job description too short. Paste the full JD text.' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: 'ANTHROPIC_API_KEY not configured. Set it in Vercel environment variables.' },
        { status: 500 }
      );
    }

    // === PASS 1: Sonnet screening (cheap, fast) ===
    const condensedWiki = getWikiCondensed();
    const screeningResponse = await client.messages.create({
      model: SONNET_MODEL,
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: `JOB DESCRIPTION:\n${jobDescription.substring(0, 3000)}`,
        },
      ],
      system: SCREENING_SYSTEM + condensedWiki,
    });

    const screenText =
      screeningResponse.content[0].type === 'text'
        ? screeningResponse.content[0].text
        : '';

    let screening: { score: number; reason: string; archetype: string };
    try {
      screening = JSON.parse(screenText);
    } catch {
      screening = { score: 3.0, reason: 'Could not parse screening result', archetype: 'unknown' };
    }

    // Return score only if requested or if low score
    if (scoreOnly || screening.score <= 3.5) {
      return Response.json({
        pass: 'screening',
        score: screening.score,
        reason: screening.reason,
        archetype: screening.archetype,
        recommendation: screening.score > 3.5 ? 'consider' : 'skip',
        tokenUsage: {
          screening: {
            input: screeningResponse.usage.input_tokens,
            output: screeningResponse.usage.output_tokens,
          },
        },
      });
    }

    // === PASS 2: Opus full evaluation (only if score > 3.5) ===
    const fullWiki = getWikiFull();
    const scoringSystem = getScoringSystem();
    const profileContext = getProfileContext();

    const fullSystemPrompt =
      FULL_EVAL_SYSTEM +
      fullWiki +
      '\n\nSCORING SYSTEM:\n' +
      scoringSystem +
      '\n\nTARGET ROLES & FRAMING:\n' +
      profileContext;

    // Stream the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Send screening result first
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'screening', score: screening.score, reason: screening.reason, archetype: screening.archetype })}\n\n`
          )
        );

        try {
          const fullStream = client.messages.stream({
            model: OPUS_MODEL,
            max_tokens: 3000,
            messages: [
              {
                role: 'user',
                content: `Evaluate this job for me. Archetype detected in screening: ${screening.archetype}\n\nJOB DESCRIPTION:\n${jobDescription}`,
              },
            ],
            system: fullSystemPrompt,
          });

          for await (const event of fullStream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: 'text', content: event.delta.text })}\n\n`
                )
              );
            }
          }

          const finalMessage = await fullStream.finalMessage();
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'done',
                tokenUsage: {
                  screening: {
                    input: screeningResponse.usage.input_tokens,
                    output: screeningResponse.usage.output_tokens,
                  },
                  full: {
                    input: finalMessage.usage.input_tokens,
                    output: finalMessage.usage.output_tokens,
                  },
                },
              })}\n\n`
            )
          );
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', message: String(err) })}\n\n`
            )
          );
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    return Response.json(
      { error: `Evaluation failed: ${String(err)}` },
      { status: 500 }
    );
  }
}
