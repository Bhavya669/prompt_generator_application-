# AI Prompt Generator

Generate clear, professional, and reusable AI prompts from simple ideas using Cloudflare Workers AI.

The AI Prompt Generator is a web application that transforms user-provided scenarios into structured prompts using AI language models. Users can select an AI model, describe their requirements, and generate a prompt that can be reused with another AI assistant.


here is the deployed url : https://prompt-generator.singambhavyaa326.workers.dev/

## Features

* **AI-Powered Prompt Generation:** Converts user scenarios into detailed, reusable prompts.
* **Multiple AI Models:** Supports two text-generation models through Cloudflare Workers AI.
* **Role-Based Prompt Structure:** Organizes generated prompts into Role, Context, Objective, Requirements, Constraints, Expected Deliverables, and Output Format.
* **Interactive Web Interface:** Provides a simple interface for selecting a model and entering a scenario.
* **Input Validation:** Validates model selection and scenario input before processing.
* **Error Handling:** Returns appropriate error responses for invalid input, unsupported models, and AI service failures.
* **Character Limit:** Restricts scenarios to a maximum of 5,000 characters.
* **REST API:** Exposes endpoints for model listing, model validation, and prompt generation.
* **Responsive Dark UI:** Presents the input form and generated prompt in a side-by-side dashboard layout.

## Problem Statement

Writing effective AI prompts requires clear instructions, relevant context, specific requirements, and a well-defined output format.

Users may struggle to express their requirements in a structured way, resulting in incomplete or inconsistent AI responses.

The AI Prompt Generator addresses this problem by transforming simple user scenarios into professional prompts that can be reused with AI models.

## How It Works

1. The user selects an AI model.
2. The user describes a scenario or task.
3. The frontend sends the selected model and scenario to the Cloudflare Worker.
4. The Worker validates the request.
5. The Worker sends the scenario and system prompt to the selected Workers AI model.
6. The model generates a structured, reusable prompt.
7. The Worker returns the result as JSON.
8. The frontend displays the generated prompt.

The application generates instructions for another AI to complete the user's task. It is designed to generate prompts rather than directly solve the original scenario.

## Technology Stack

| Technology            | Purpose                                 |
| --------------------- | --------------------------------------- |
| HTML                  | Frontend structure                      |
| CSS                   | Styling and responsive dashboard design |
| JavaScript            | Frontend interactions and backend logic |
| Cloudflare Workers    | Serverless backend                      |
| Cloudflare Workers AI | AI-powered prompt generation            |
| Wrangler              | Local development and deployment        |
| Postman               | API testing                             |

## Supported AI Models

The application supports the following models:

| Model Key      | Model Identifier                     |
| -------------- | ------------------------------------ |
| `llama-3.1-8b` | `@cf/meta/llama-3.1-8b-instruct-fp8` |
| `llama-3.2-1b` | `@cf/meta/llama-3.2-1b-instruct`     |

Model availability and usage are subject to Cloudflare Workers AI account and service limits.

## Project Structure

```text
autumn-bar-583d/
│
├── public/
│   └── index.html
│
├── src/
│   └── index.js
│
├── node_modules/
│
├── package.json
├── package-lock.json
├── wrangler.jsonc
├── .gitignore
└── README.md
```

**File descriptions:**

* `public/index.html`: Contains the frontend interface, styling, and client-side interactions.
* `src/index.js`: Implements the Cloudflare Worker, request validation, model selection, and prompt generation.
* `wrangler.jsonc`: Configures the Worker entry point, frontend assets, compatibility date, and Workers AI binding.
* `package.json`: Defines project dependencies and scripts.
* `package-lock.json`: Records the resolved npm dependency versions.
* `.gitignore`: Specifies files and directories that should not be committed to Git.

The `node_modules` directory contains installed dependencies and should not be committed to the Git repository.

## System Prompt Design

The application uses a system prompt to instruct the AI model to act as an expert prompt engineer.

The system prompt guides the model to structure the generated prompt using the following components:

1. **Role:** Defines the expertise the target AI should assume.
2. **Context:** Explains the user's scenario and relevant background.
3. **Objective:** Describes the main goal.
4. **Requirements:** Lists the requested functionality and deliverables.
5. **Constraints:** Defines technical restrictions, security considerations, and limitations.
6. **Expected Deliverables:** Describes what the target AI should produce.
7. **Output Format:** Specifies how the final response should be organized.
8. **Missing Information:** Uses descriptive placeholders when essential information is unavailable.

### Why use a system prompt?

The system prompt establishes consistent behavior across different user scenarios.

It instructs the model to:

* Generate a reusable prompt instead of completing the original task.
* Preserve the user's requirements.
* Avoid inventing facts.
* Use clear and professional language.
* Avoid unnecessary repetition.
* Adapt the level of detail to the scenario.

## API Documentation

The application exposes the following endpoints.

### 1. List Supported Models

**Endpoint**

```http
GET /models
```

Returns the models available in the application.

**Example response**

```json
{
  "success": true,
  "models": [
    {
      "id": "llama-3.1-8b",
      "name": "Llama 3.1 8B Instruct FP8"
    },
    {
      "id": "llama-3.2-1b",
      "name": "Llama 3.2 1B Instruct"
    }
  ]
}
```

### 2. Validate Model Selection

**Endpoint**

```http
POST /validate-model
```

**Request body**

```json
{
  "model": "llama-3.1-8b"
}
```

Validates whether the requested model is supported.

### 3. Generate a Prompt

**Endpoint**

```http
POST /generate-prompt
```

**Request body**

```json
{
  "model": "llama-3.1-8b",
  "scenario": "I want to build a full-stack Python e-commerce application."
}
```

**Example response**

```json
{
  "success": true,
  "selectedModel": "llama-3.1-8b",
  "modelId": "@cf/meta/llama-3.1-8b-instruct-fp8",
  "scenario": "I want to build a full-stack Python e-commerce application.",
  "generatedPrompt": "Role: Act as a senior full-stack developer..."
}
```

The actual generated prompt depends on the scenario and the selected model.

### Error Handling

The API validates incoming requests and returns meaningful HTTP status codes.

| Status Code | Meaning                                              |
| ----------- | ---------------------------------------------------- |
| `200`       | Request completed successfully                       |
| `400`       | Invalid JSON, missing scenario, or unsupported model |
| `404`       | Endpoint not found                                   |
| `502`       | AI service failure or empty AI response              |

The application also enforces a maximum scenario length of 5,000 characters.

## Prerequisites

Before running the project, ensure you have:

* Node.js installed.
* npm installed.
* A Cloudflare account.
* Access to Cloudflare Workers AI.
* Wrangler installed or available through the project dependencies.

## Installation and Local Setup

### Step 1: Clone the Repository

After the project has been uploaded to GitHub, clone it using:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project directory:

```bash
cd autumn-bar-583d
```

Replace the repository URL with your actual GitHub repository URL.

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Cloudflare

Review `wrangler.jsonc` and ensure that the AI binding and frontend asset directory are configured correctly.

The relevant configuration is:

```json
{
  "assets": {
    "directory": "./public",
    "binding": "ASSETS",
    "not_found_handling": "none"
  },
  "ai": {
    "binding": "AI",
    "remote": true
  }
}
```

The complete configuration also includes the Worker name, entry point, and compatibility date.

The `remote: true` setting allows the local Worker to access the remote Workers AI service.

### Step 4: Authenticate with Cloudflare

If you have not already authenticated, run:

```bash
npx wrangler login
```

Follow the browser instructions to authorize Wrangler.

### Step 5: Start the Development Server

Run:

```bash
npx wrangler dev
```

The application should become available at:

```text
http://127.0.0.1:8787
```

Open this address in your browser to use the application.

**Note:** Workers AI requests use Cloudflare's remote service even during local development. Applicable usage limits and charges may apply.

## Testing with Postman

You can test the API independently of the frontend.

### Test Prompt Generation

1. Open Postman.

2. Create a new HTTP request.

3. Select `POST`.

4. Enter:

   `http://127.0.0.1:8787/generate-prompt`

5. Select **Body → raw → JSON**.

6. Enter:

```json
{
  "model": "llama-3.1-8b",
  "scenario": "Create a beginner-friendly Python learning roadmap."
}
```

7. Click **Send**.
8. Verify that the API returns a generated prompt.

Repeat the test with the second supported model:

```json
{
  "model": "llama-3.2-1b",
  "scenario": "Create a beginner-friendly Python learning roadmap."
}
```

### Additional Test Cases

* List supported models.
* Validate a supported model.
* Submit an empty scenario.
* Submit whitespace-only input.
* Submit an unsupported model.
* Submit a scenario exceeding the character limit.
* Verify error handling when the AI service fails.

## Future Enhancements

Potential improvements include:

* Copy-to-clipboard functionality.
* Prompt editing and regeneration.
* Prompt history and saved prompts.
* Additional AI models.
* Configurable prompt templates.
* More advanced prompt customization.
* Improved accessibility and responsive layouts.
* Additional automated tests.

## Deployment

The application is currently developed and tested locally.

Deployment to Cloudflare Workers is a separate step.

Once the Cloudflare account and Worker configuration are ready, the application can be deployed using:

```bash
npx wrangler deploy
```

After deployment, test the public application URL and verify that the frontend assets and Workers AI integration work correctly.

A public deployment URL will be added here after deployment is completed and verified.

## Author

**Bhavya Singam**

AI Prompt Generator — Built using JavaScript, Cloudflare Workers, and Cloudflare Workers AI.

---

*This project demonstrates serverless backend development, AI model integration, prompt engineering, API design, input validation, and frontend development.*
