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

## Consumer home questionnaire

Phase 2 (2026-10-08): `/saved` now has per-item deletion with explicit confirmation and a saved-item counter. Deleting a prompt also deletes its attached local image, not copy history or Dream Home answers. The 30-item limit is distinguished from browser quota/security failures. Blocked architecture selection persistence reports a nonblocking warning. Builder previews are labelled illustrative rather than guaranteed generation results. `scripts/phase2-e2e.cjs` checks the architecture flow plus full-library recovery and blocked storage in isolated Chromium; no user profile or server-side data is modified.

`/dream-home` is a separate, key-free consumer flow linked from the landing page and header. The existing architectural builder remains available.

- Four steps cover housing type, approximate size, storeys, outdoor space, bedrooms and bathrooms, living/kitchen arrangement, lifestyle priorities, mood, flooring material and color, wall color and lighting.
- `lib/dream-home.ts` keeps the catalog, validated brief and deterministic compiler separate from the UI. The consumer flow outputs only one Architectural Presentation Board prompt combining exterior, living room, bedroom/sleeping nook, conceptual floor plans and a material palette. There is no scene or output selector. It shares one brief across panels instead of concatenating contradictory single-scene prompts. The Korean requirements summary is supplementary context, not another prompt.
- Board plans cover every selected dwelling level, distributing bedroom/bathroom totals across levels rather than repeating them. Apartment plans describe only the focal unit; studio briefs use a sleeping nook. The prompt asks for cross-panel consistency, but does not verify it. Plans must show `CONCEPT ONLY — NOT TO SCALE — NOT FOR CONSTRUCTION`, with no invented dimensions, scales, north arrows or approval marks. The on-screen board diagram is labelled as a layout guide, not an actual generated preview. Copy exports only the integrated board prompt; text downloads include the requirements summary and that same single prompt, never individual scene prompts.
- The current apartment flow describes a single-level dwelling, not a one-storey building. Private gardens normalize to balconies with an explanation in the UI. Zero bedrooms means an open-plan sleeping nook. Interior flooring choices are not applied to the facade.
- Answers are saved only when the user selects **답변 저장**, under the versioned local key `prompotion:dream-home:v1`. Restore asks before replacing current answers. Reset removes only this feature's draft, preserving the existing prompt library. Browser persistence can fail; the UI reports failures and provides a complete text download.
- The existing copy control provides browser clipboard and fallback behavior. Copy history remains available in `/saved`. Home drafts are restored inside `/dream-home`, not through the architecture selection state.
- No personal names, addresses or contact details are collected. Analytics records event names and limited operational metadata, not room counts, raw briefs or image pixels.

This feature does **not** generate images, verify layouts, preserve cross-scene geometry, or establish structural/regulatory/construction feasibility. Generated images from an external tool still need quality evaluation. No image or LLM API is connected and no new environment variables are required.

For a future API integration, keep the normalized brief as the source of truth and run model calls server-side. Select a provider after output-quality/cost testing, keep keys out of the client, disclose external data transfer, and add authentication/abuse limits, usage caps and error handling before enabling paid calls. The current UI must not claim image generation until an actual provider is integrated and verified.

The headless flow script `scripts/dream-home-e2e.cjs` accepts a local base URL and optional screenshot directory. Install Playwright separately or expose an existing installation through `NODE_PATH`. `CHROMIUM_EXECUTABLE_PATH` and `WEBKIT_EXECUTABLE_PATH` can point to available automation browsers. Browser emulation does not constitute physical iPhone or Android verification.

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

## Home screen installation

The header, landing page, and successful prompt-copy state link to /install. It detects iPhone/iPad or Android, lets users switch instructions, explains embedded-browser limitations, and offers a direct Android install button only when Chrome supplies beforeinstallprompt. Cancellation, rejection, and unsupported browsers keep manual instructions available. No success is inferred just from clicking a button. Installed display mode hides invitations.

app/manifest.ts sets a stable id, / scope, /select launch URL, standalone display, colors, 192/512px icons and a separate maskable icon entry. Apple touch icon (180px) and app metadata support iOS. public/icons/prompotion.svg is the original editable, two-module P symbol; npm run icons reproduces all PNGs and the 16/32/48px favicon using Sharp bundled with Next.js. The full-bleed square background is intentional: the OS applies its own icon mask.

This is a home-screen web app, not an App Store/Play Store release. Internet is required. No service worker, offline cache, push permission, or new API key is introduced. Browser and installed-web-app storage can differ; do not promise migration or sync of saved prompts.

Installation events remain local through the existing analytics utility: install_guide_viewed, install_prompt_requested, install_prompt_outcome, app_installed, homescreen_opened. iOS does not expose the same appinstalled event; standalone launch is tracked separately. No device fingerprint or raw user agent is stored.

Manual release checks: on physical iPhone Safari and Android Chrome, add from the menu, inspect the icon/name, launch from the home screen, confirm app navigation, copying, safe-area spacing and hidden installation invitations. Test embedded browsers and both acceptance and cancellation of Chrome's optional prompt. Automated manifest/unit/HTTP checks are not a substitute for physical OS installation.

Instruction sources checked 2026-09-11: [Apple Safari](https://support.apple.com/ko-kr/guide/iphone/iph42ab2f3a7/ios), [Chrome Android](https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=ko), [Chrome install criteria](https://web.dev/articles/install-criteria). Menu labels can vary by version; both current and common earlier names appear in the guide.
