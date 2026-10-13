const SUPPORTED_MODELS = {
"llama-3.1-8b": {
name: "Llama 3.1 8B Instruct FP8",
modelId: "@cf/meta/llama-3.1-8b-instruct-fp8",
},
"llama-3.2-1b": {
name: "Llama 3.2 1B Instruct",
modelId: "@cf/meta/llama-3.2-1b-instruct",
},
};

const SYSTEM_PROMPT = `
You are an expert Prompt Engineer specializing in creating
professional, clear, detailed, and reusable AI prompts.

YOUR PRIMARY OBJECTIVE:
Transform the user's scenario into a high-quality prompt
that can be given to another AI model to complete the task.

IMPORTANT DISTINCTION:
You must generate instructions for another AI.
You must NOT perform the user's original task yourself.

STRUCTURE THE GENERATED PROMPT USING THESE SECTIONS:

1. Role:
Define the expertise and responsibilities the target AI
should assume.

2. Context:
Describe the user's scenario and relevant background.

3. Objective:
Clearly explain the main goal the target AI must achieve.

4. Requirements:
Convert the user's needs into specific, actionable
requirements.

5. Constraints:
Specify technical limitations, security requirements,
assumptions, and other important restrictions.

6. Expected Deliverables:
Explain what the target AI should produce.

7. Output Format:
Specify how the target AI should organize its response,
using sections, bullet points, tables, or code only when
appropriate for the original task.

8. Missing Information:
Use descriptive placeholders such as [DATABASE],
[PROGRAMMING LANGUAGE], or [DEPLOYMENT PLATFORM] when
essential information is missing.

RULES:

- Generate a reusable prompt, not the answer to the scenario.
- Never solve or implement the original task yourself.
- Do not generate actual application code, SQL queries,
  implementation examples, or completed solutions.
- Do not include sample code inside the generated prompt.
- Include technical implementation instructions only when
  they are requirements for the target AI to follow.
- Preserve the user's original requirements and intent.
- Do not invent requirements or background information.
- Organize related requirements into logical sections.
- Avoid unnecessary repetition, explanations, and commentary.
- Use professional, precise, and actionable language.
- Make the prompt specific to the user's scenario.
- Adapt the length to the complexity of the scenario.
- Prefer concise prompts without sacrificing important details.
- Return only the final reusable prompt.
- Do not add introductory text such as "Here is your prompt."
`;

function jsonResponse(data, status = 200) {
return new Response(JSON.stringify(data), {
status,
headers: {
"Content-Type": "application/json; charset=utf-8",
},
});
}

export default {
async fetch(request, env) {
const url = new URL(request.url);

// Serve the frontend.
if (url.pathname === "/" && request.method === "GET") {
  return env.ASSETS.fetch(request);
}

// List supported models.
if (url.pathname === "/models" && request.method === "GET") {
  const models = Object.entries(SUPPORTED_MODELS).map(
    ([id, model]) => ({
      id,
      name: model.name,
    })
  );

  return jsonResponse({ success: true, models });
}

// Validate a model selection.
if (
  url.pathname === "/validate-model" &&
  request.method === "POST"
) {
  let body;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Please provide valid JSON." }, 400);
  }

  const model = SUPPORTED_MODELS[body.model];

  if (!model) {
    return jsonResponse({ error: "Unsupported model." }, 400);
  }

  return jsonResponse({
    success: true,
    message: "Model selection is valid.",
    selectedModel: body.model,
    modelId: model.modelId,
  });
}

// Generate a prompt using Workers AI.
if (
  url.pathname === "/generate-prompt" &&
  request.method === "POST"
) {
  let body;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Please provide valid JSON." }, 400);
  }

  const scenario =
    typeof body.scenario === "string"
      ? body.scenario.trim()
      : "";

  const selectedModel = body.model;
  const model = SUPPORTED_MODELS[selectedModel];

  if (!scenario) {
    return jsonResponse(
      { error: "Please enter a scenario." },
      400
    );
  }

  if (scenario.length > 5000) {
    return jsonResponse(
      { error: "Scenario must not exceed 5000 characters." },
      400
    );
  }

  if (!model) {
    return jsonResponse(
      { error: "Unsupported model." },
      400
    );
  }

  try {
  console.log("STEP 1: Starting AI request");
  console.log("Selected model:", model.modelId);
  console.log("Scenario length:", scenario.length);

  const aiResponse = await env.AI.run(model.modelId, {
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content:
          "Generate a reusable professional prompt for this scenario:\n\n" +
          scenario,
      },
    ],
    max_tokens: 1024,
  });

  console.log("STEP 2: AI request completed");
  console.log("AI response received:", JSON.stringify(aiResponse));
    let generatedPrompt = "";

    if (typeof aiResponse.response === "string") {
      generatedPrompt = aiResponse.response;
    } else if (Array.isArray(aiResponse.choices)) {
      generatedPrompt =
        aiResponse.choices[0]?.message?.content || "";
    }

    if (!generatedPrompt) {
      return jsonResponse(
        { error: "The AI returned an empty response. Please try again." },
        502
      );
    }

    return jsonResponse({
      success: true,
      selectedModel,
      modelId: model.modelId,
      scenario,
      generatedPrompt,
    });
  } catch (error) {
    console.error("Workers AI error:", error);

    return jsonResponse(
      {
        error:
          "Unable to generate a prompt. The AI service may be unavailable or its usage limit may have been reached.",
      },
      502
    );
  }
}

return jsonResponse({ error: "Endpoint not found." }, 404);

},
};
