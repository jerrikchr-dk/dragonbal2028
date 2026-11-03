# Dragonbal 2028

React + TypeScript + Vite landing page for the IBF World Championship in Saigon, Vietnam, 1–5 March 2028.

## Local development

```sh
npm ci
npm run dev
```

For a production build and local preview:

```sh
npm run build
npm run preview
```

Vercel settings are in `vercel.json`: build with `npm run build`, serve `dist`. No backend or environment variables are required.

## Visitor flow

1. Event name, dates and location, then **Watch the film**. Registration and programme details are explicitly marked as coming soon.
2. The 95-second Saigon welcome film. The link scrolls to the player; playback starts only when the visitor taps Play.
3. Discover the host city and the landmarks in the event emblem.
4. Optional five-dice Balut game, dragon fire and the replayable dragon intro.

On phones the header keeps a visible film link, the artwork is compact, and scene selection is collapsed until requested. Native video controls provide seeking, sound and fullscreen, with `playsInline` and an uncropped picture. Rotated-phone framing keeps the picture and controls within the available height. **Open video** links directly to the MP4 if the embedded player cannot be used.

The intro is opt-in, not a loading gate. Decorative animation pauses during playback. The particle canvas also stops when the page is hidden or reduced motion is requested; phones use fewer particles and no cursor trails. The intro supports keyboard skip/Escape and focus restoration.

## Files to edit

- `src/App.tsx`: event content, section order, sharing, countdown and dice game.
- `src/index.css`: shared styles, phone/tablet layouts and animation styling.
- `src/components/SaigonFilm.tsx` / `.css`: native player, six scene timestamps and playback status.
- `src/components/DragonCanvas.tsx`, `DragonLoader.tsx`, `SvgArtworks.tsx`: decorative effects and SVG artwork.
- `public/assets/`: event logo, supplied welcome film, poster and scene stills. No account/domain-purchase screenshots are included.

Before publishing video changes, check Play, native seek/mute/fullscreen and scene selection on a physical iPhone/Safari and Android/Chrome as well as desktop. Browser viewport emulation is useful for layout checks but does not replace device playback verification.
