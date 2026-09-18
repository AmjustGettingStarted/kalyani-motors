//src\app\images\fronx\360\frames.js

const allFrames = import.meta.glob("../../*/360/*/*.avif", {
  eager: true,
  import: "default",
  query: "?url",
});

const framesByCarAndColor = {};

Object.entries(allFrames).forEach(([path, url]) => {
  const match = path.match(/^\.\.\/\.\.\/([^/]+)\/360\/([^/]+)\/(.+\.avif)$/);

  if (!match) return;

  const [, carSlug, colorKey, filename] = match;

  const key = `${carSlug}/${colorKey}`;

  if (!framesByCarAndColor[key]) {
    framesByCarAndColor[key] = [];
  }

  framesByCarAndColor[key].push({
    filename,
    url,
  });
});

// Sort numerically:
// fronx_blue_1
// fronx_blue_2
// ...
// fronx_blue_72
Object.values(framesByCarAndColor).forEach((frames) => {
  frames.sort((a, b) =>
    a.filename.localeCompare(b.filename, undefined, {
      numeric: true,
    }),
  );
});

const get360Frames = (carSlug, colorKey) => {
  if (!carSlug || !colorKey) {
    return [];
  }

  const key = `${carSlug}/${colorKey}`;

  return framesByCarAndColor[key]?.map((frame) => frame.url) || [];
};

export default get360Frames;
