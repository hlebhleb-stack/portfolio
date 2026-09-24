import { Link } from 'react-router-dom'
import { translations } from './translations.jsx'

// Shown for any URL the site does not have: unknown top-level paths (App's
// catch-all route) and unknown case slugs (CasePage). Without it both used to
// render an empty page, since the home page is hidden on every path but '/'.
export default function NotFound({ lang }) {
  const t = translations[lang]
  return (
    <div className="page">
      <div className="case-not-found">
        <h2>{t.notFound}</h2>
        <Link to="/" className="colb-inline-link">{t.backHome}</Link>
      </div>
    </div>
  )
}
