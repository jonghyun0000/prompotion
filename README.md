# PromPotion
Visual prompt builder for architecture. Existing Next.js App Router prototype extended for the 2026 MVP.

## Run
Node.js 20.9+; npm. No API keys or environment variables are required.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Do not run next dev and next build simultaneously against the same .next directory. Stop the dev process before checking a production build.

## Product flow
/ → /select → /builder → generate → copy. Select only the categories you need; one option per category. New choices replace the earlier choice in that category. The old /builder/[categoryId] comparison routes remain available and validate compatibility.

/saved stores prompts, their selections, and optional result images in this browser. Results accept JPG/PNG/WebP up to 10MB, resized to 1200px WebP. Storage errors are surfaced. This is not cloud storage and no image generation API is connected.

/test-session provides a task start button and JSON event export for moderated user tests. Events stay local; no personal names, contact details, raw prompts, or image pixels are included in telemetry. Export is user-initiated. Each run receives an anonymous sessionId; elapsedMs is measured from task start. Events are bounded to the most recent 1000. Use one participant/session and export after each test.

## Architecture
- lib/data.ts: original image types and categories retained; new compatible options and preview paths.
- lib/types.ts: compatibleTypes, category, tags, recommended, conflictsWith and previewImage extension points.
- lib/prompt.ts: state validation, type compatibility, subject instruction, explicit category order and duplicate/semantic overlap reduction.
- context/SelectionContext.tsx: client selection, safe persistence, reset/removal and analytics.
- app/builder/page.tsx: visual comparison grid and desktop/mobile Prompt Cart.
- lib/storage.ts: saved prompts, copy history, result conversion.
- lib/analytics.ts: typed events and optional future transport through setAnalyticsSink.
- components/FinalPromptModal.tsx: native dialog, focus containment, Escape dismissal, copy/save controls.
- public/images/elements/*.webp: optimized previews.
- public/images/types/*.webp: six image type previews.
- public/images/diagrams/*.svg: editable original diagrams.
- public/images/ASSET-PROVENANCE.json: provenance and generation prompts.

## Asset policy
The old JPEG placeholders are retained for historical compatibility but are not referenced by active data. No arbitrary remote image URLs are used. Architecture previews were generated from one original baseline using built-in imagegen. SVG diagrams are independently authored. Images illustrate tendencies; they are not measured lens simulations or guaranteed AI outputs. Neutral options legitimately share the same baseline.

To replace a preview, use the path in lib/data.ts and preserve the element ID. scripts/build-diagram-assets.mjs regenerates authored diagrams using the sharp version bundled with Next.js. scripts/prepare-assets.mjs is optional import tooling: it reads a git-ignored asset-sources.local.json mapping of source files. Final WebP assets are already committed, so neither script is required for build/deployment.

## User test
Send https://prompotion.vercel.app/test-session. Ask: “주거 건축물의 따뜻한 저녁 분위기 렌더링 프롬프트를 만들고 복사해주세요.”
Observe without guiding. Measure task_started → prompt_copied; inspect generated elementCount, promptLength and elements. Return to /test-session and export JSON. Compare 30 participants' completion rate and median/90th percentile duration. The one-minute target must be validated with real participants; automated completion is not equivalent to usability validation.

## Deployment
The existing GitHub repository jonghyun0000/prompotion, main branch, is connected to the existing Vercel project and prompotion.vercel.app. Run checks before pushing. No new Vercel project or hosting service is needed. Standard Next.js build; security headers and image cache policy live in next.config.ts.

## Browser verification
See scripts/e2e-test.js for the maintained flow checklist. Unit tests cover invalid storage, compatibility, prompt ordering, semantic deduplication, data/asset integrity, saved state, history, upload validation and storage failures.
