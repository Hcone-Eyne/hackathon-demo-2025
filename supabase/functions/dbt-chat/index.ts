import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, customApiKey } = await req.json();
    
    // Validate message array
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages must be a non-empty array" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Limit message history
    if (messages.length > 50) {
      return new Response(
        JSON.stringify({ error: "Too many messages: maximum 50 messages allowed" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Validate each message
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return new Response(
          JSON.stringify({ error: "Invalid message format: role and content required" }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      if (typeof msg.content !== "string" || msg.content.length > 10000) {
        return new Response(
          JSON.stringify({ error: "Message content too long: maximum 10000 characters" }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    }
    
    // Use custom API key if provided, otherwise use Lovable AI
    const useCustomKey = customApiKey && customApiKey.trim().startsWith('sk-');
    const apiKey = useCustomKey ? customApiKey : Deno.env.get('LOVABLE_API_KEY');
    const apiUrl = useCustomKey 
      ? 'https://api.openai.com/v1/chat/completions'
      : 'https://ai.gateway.lovable.dev/v1/chat/completions';

    if (!apiKey) {
      console.error("AI service not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("Processing chat request with", messages.length, "messages", useCustomKey ? "(using custom API key)" : "(using Lovable AI)");

    const systemPrompt = `You are an expert AI assistant specializing in India's Direct Benefit Transfer (DBT) system and Aadhaar linking processes. Your role is to help users understand:

1. **Aadhaar Basics**: What Aadhaar is, its purpose, and how to obtain one
2. **DBT System**: How Direct Benefit Transfer works and its benefits
3. **Aadhaar-Bank Linking**: The critical difference between:
   - Aadhaar-seeded accounts (Aadhaar stored in bank records but not verified)
   - Aadhaar-linked accounts (Verified through NPCI mapper and DBT-enabled)
4. **Government Schemes**: Popular DBT schemes like PAHAL, PM-KISAN, MGNREGA, scholarships, and pensions
5. **Verification Process**: How to check DBT status and link Aadhaar properly
6. **Troubleshooting**: Common issues and solutions for Aadhaar linking problems

**Communication Style:**
- Keep answers clear, concise, and easy to understand
- Use simple language avoiding technical jargon when possible
- Provide step-by-step instructions when explaining processes
- Be empathetic and patient, as many users may be unfamiliar with these systems
- When users ask about specific schemes, provide relevant details about eligibility and benefits
- If you don't know something specific, acknowledge it honestly

**Key Points to Remember:**
- Always emphasize the difference between "seeded" and "linked" Aadhaar accounts
- Encourage users to verify their DBT status through official channels
- Remind users that only NPCI mapper-verified accounts can receive DBT benefits
- Provide official sources and verification methods when discussing important processes`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Rate limit exceeded. Please try again in a moment." 
          }), 
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "AI service credits depleted. Please contact support." 
          }), 
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service error" }), 
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Streaming response from AI gateway");
    
    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
