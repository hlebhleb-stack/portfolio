// Manual column overrides for the case gallery.
// Map: item src path → column number (1 = left, 2 = right).
//
// Items NOT listed here fall back to automatic balancing — each
// auto-item goes into whichever column currently has fewer items.
//
// To pin a specific video/image to a specific column, add an entry like:
//
//   '/assets/works/colb-finance/2.mp4': 2,
//   '/assets/works/colb-finance/5.mp4': 1,
//
// Re-pushing to main will redeploy. Auto-discovery of new files
// continues to work — overrides only apply to paths you list here.

export default {
  // pin specific media to a column by adding entries like:
  //   '/assets/works/colb-finance/2.mp4': 2,

  // Banners have very mixed aspect ratios (1.png is a tall portrait
  // crop, the rest are wide/square), so plain count-based balancing
  // left one column much taller than the other. Pin them manually
  // to balance total column height instead.
  '/assets/works/colb-finance/1.png': 1,
  '/assets/works/colb-finance/2.png': 1,
  '/assets/works/colb-finance/3.png': 2,
  '/assets/works/colb-finance/4.png': 2,
  '/assets/works/colb-finance/5.png': 2,
}
