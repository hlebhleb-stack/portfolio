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
}
