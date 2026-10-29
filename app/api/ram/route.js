import { NextResponse } from 'next/server';

// 30-Day Syllabus Mapping
function getSyllabusInstruction(day) {
  if (day === 1) return "Day 1: Basic Greetings & Self Introduction (Name, Background, City).";
  if (day === 2) return "Day 2: Talking about Routine (Simple Present Tense - Daily Schedule).";
  if (day === 3) return "Day 3: Past Experience & Education (Simple Past Tense - I completed, I worked as).";
  if (day === 4) return "Day 4: Expressing Skills & Strengths (I am good at, My strength is).";
  if (day === 5) return "Day 5: Weaknesses & Improvement (I am working on, My challenge is).";
  if (day === 6) return "Day 6: Family & Hobbies (Casual Conversation & Confidence building).";
  if (day === 7) return "Day 7: Week 1 Practice & Mock Self-Intro Drive.";
  
  if (day === 8) return "Day 8: Verbs vs Adverbs in Action (Describing actions clearly).";
  if (day === 9) return "Day 9: Using Prepositions correctly (in, at, on, under, during).";
  if (day === 10) return "Day 10: Asking Questions & Clarifications (Could you please repeat?).";
  if (day === 11) return "Day 11: Expressing Opinions & Agreeing/Disagreeing (In my opinion, I agree).";
  if (day === 12) return "Day 12: Handling Common Customer/Client Scenarios (Polite communication).";
  if (day === 13) return "Day 13: Telephone & Professional Etiquette.";
  if (day === 14) return "Day 14: Week 2 Review & Fluency Drills.";
  
  if (day >= 15 && day <= 21) {
    return `Day ${day}: Week 3 - Single Sentence Creation. Guide the user to form exactly ONE clear, correct sentence combining Weeks 1 and 2 concepts. Correct mistakes gently.`;
  }
  
  return `Day ${day}: Week 4 - 2 to 3 Sentence Creation. Encourage the user to combine ideas into 2 or 3 short, connected sentences. Correct grammar and MTI politely.`;
}

export async function POST(req) {
  try {
    const { prompt, currentDay = 1 } = await req.json();

    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'DEEPSEEK_API_KEY is not set in .env.local' }, { status: 500 });
    }

    const syllabusTopic = getSyllabusInstruction(currentDay);

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are RAM Trainer, a warm Indian English and Interview Coach. 
The student is on Day ${currentDay} of Month 1.
Syllabus Focus: ${syllabusTopic}

Instructions:
1. Conduct today's practice based on the syllabus focus.
2. Keep responses extremely short, direct, and encouraging.
3. NEVER use markdown asterisks (* or **), bullet points, or special characters as the voice reader will speak them out loud. Write plain text only.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'DeepSeek API Error' }, { status: 500 });
    }

    const aiMessage = data.choices?.[0]?.message?.content || 'No response generated.';

    return NextResponse.json({ reply: aiMessage });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
