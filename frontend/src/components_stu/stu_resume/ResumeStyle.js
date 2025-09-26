

const ResumeStyles = () => (
  <style jsx>{`
    /* Modern Template Styles */
    .resume-modern {
      font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #374151;
      max-width: 8.5in;
      margin: 0 auto;
      background: white;
      padding: 1.5in 1in;
    }

    .resume-modern .resume-header {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      padding: 2rem;
      margin: -1.5in -1in 2rem -1in;
      border-radius: 0;
    }

    .resume-modern .full-name {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      letter-spacing: -0.025em;
    }

    .resume-modern .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      font-size: 0.95rem;
    }

    .resume-modern .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      opacity: 0.9;
    }

    .resume-modern .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #3b82f6;
      margin: 1.5rem 0 1rem 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .resume-modern .experience-item,
    .resume-modern .education-item {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .resume-modern .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }

    .resume-modern .item-title {
      font-weight: 600;
      font-size: 1.1rem;
      color: #1f2937;
    }

    .resume-modern .item-subtitle {
      color: #6b7280;
      font-size: 0.95rem;
    }

    .resume-modern .item-meta {
      color: #3b82f6;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .resume-modern .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    }

    .resume-modern .skill-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .resume-modern .skill-name {
      font-weight: 500;
    }

    .resume-modern .skill-level {
      color: #3b82f6;
      font-size: 0.85rem;
    }

    /* Classic Template Styles */
    .resume-classic {
      font-family: 'Times New Roman', Times, serif;
      line-height: 1.6;
      color: #374151;
      max-width: 8.5in;
      margin: 0 auto;
      background: white;
      padding: 1in;
      border: 2px solid #374151;
    }

    .resume-classic .resume-header {
      text-align: center;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #374151;
      margin-bottom: 1.5rem;
    }

    .resume-classic .full-name {
      font-size: 2.2rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      color: #374151;
      letter-spacing: 0.05em;
    }

    .resume-classic .contact-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      font-size: 0.9rem;
    }

    .resume-classic .contact-item {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .resume-classic .section-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: #374151;
      margin: 1.5rem 0 1rem 0;
      text-transform: uppercase;
      text-align: center;
      border-bottom: 1px solid #d1d5db;
      padding-bottom: 0.5rem;
    }

    .resume-classic .experience-item,
    .resume-classic .education-item {
      margin-bottom: 1.25rem;
    }

    .resume-classic .item-header {
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .resume-classic .item-title {
      font-weight: 700;
      font-size: 1.1rem;
      color: #374151;
    }

    .resume-classic .item-subtitle {
      color: #6b7280;
      font-style: italic;
      font-size: 0.95rem;
    }

    .resume-classic .item-meta {
      color: #374151;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .resume-classic .skills-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }

    .resume-classic .skill-item {
      text-align: center;
    }

    /* Creative Template Styles */
    .resume-creative {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      max-width: 8.5in;
      margin: 0 auto;
      background: white;
      display: flex;
      min-height: 11in;
    }

    .resume-creative .sidebar {
      width: 35%;
      background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
      color: white;
      padding: 2rem 1.5rem;
    }

    .resume-creative .main-content {
      flex: 1;
      padding: 2rem 1.5rem;
      background: white;
    }

    .resume-creative .sidebar .full-name {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0 0 1.5rem 0;
      text-align: center;
    }

    .resume-creative .sidebar .contact-info {
      margin-bottom: 2rem;
    }

    .resume-creative .sidebar .contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      font-size: 0.9rem;
    }

    .resume-creative .sidebar .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 1.5rem 0 1rem 0;
      color: white;
      border-bottom: 2px solid rgba(255,255,255,0.3);
      padding-bottom: 0.5rem;
    }

    .resume-creative .main-content .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #8b5cf6;
      margin: 1.5rem 0 1rem 0;
    }

    .resume-creative .experience-item,
    .resume-creative .education-item {
      margin-bottom: 1.5rem;
      padding-left: 1rem;
      border-left: 3px solid #8b5cf6;
    }

    .resume-creative .item-title {
      font-weight: 600;
      font-size: 1.1rem;
      color: #1f2937;
    }

    .resume-creative .item-subtitle {
      color: #6b7280;
      font-size: 0.95rem;
    }

    .resume-creative .item-meta {
      color: #8b5cf6;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .resume-creative .sidebar .skills-grid {
      display: block;
    }

    .resume-creative .sidebar .skill-item {
      margin-bottom: 1rem;
    }

    .resume-creative .sidebar .skill-name {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .resume-creative .sidebar .skill-level {
      font-size: 0.8rem;
      opacity: 0.8;
    }

    /* Minimal Template Styles */
    .resume-minimal {
      font-family: 'Helvetica', 'Arial', sans-serif;
      line-height: 1.7;
      color: #1f2937;
      max-width: 8.5in;
      margin: 0 auto;
      background: white;
      padding: 1.5in 1in;
    }

    .resume-minimal .resume-header {
      margin-bottom: 2.5rem;
    }

    .resume-minimal .full-name {
      font-size: 2.5rem;
      font-weight: 300;
      margin: 0;
      color: #1f2937;
      letter-spacing: -0.02em;
    }

    .resume-minimal .name-underline {
      width: 80px;
      height: 3px;
      background: #10b981;
      margin: 0.5rem 0 1.5rem 0;
    }

    .resume-minimal .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      font-size: 0.95rem;
      color: #6b7280;
    }

    .resume-minimal .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .resume-minimal .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #10b981;
      margin: 2rem 0 1rem 0;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .resume-minimal .experience-item,
    .resume-minimal .education-item {
      margin-bottom: 1.75rem;
    }

    .resume-minimal .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }

    .resume-minimal .item-title {
      font-weight: 500;
      font-size: 1.05rem;
      color: #1f2937;
    }

    .resume-minimal .item-subtitle {
      color: #6b7280;
      font-size: 0.9rem;
    }

    .resume-minimal .item-meta {
      color: #10b981;
      font-size: 0.85rem;
    }

    .resume-minimal .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }

    .resume-minimal .skill-item {
      padding: 0.75rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .resume-minimal .skill-name {
      font-weight: 500;
      color: #1f2937;
    }

    .resume-minimal .skill-level {
      color: #10b981;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    /* Executive Template Styles */
    .resume-executive {
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.6;
      max-width: 8.5in;
      margin: 0 auto;
      background: #1e293b;
      color: white;
      padding: 1.5in 1in;
      position: relative;
    }

    .resume-executive::after {
      content: '';
      position: absolute;
      top: 1in;
      right: 1in;
      width: 6px;
      height: 200px;
      background: linear-gradient(to bottom, #fbbf24 0%, #f59e0b 100%);
    }

    .resume-executive .resume-header {
      margin-bottom: 2rem;
    }

    .resume-executive .full-name {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      color: white;
    }

    .resume-executive .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      font-size: 0.95rem;
      opacity: 0.9;
    }

    .resume-executive .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .resume-executive .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #fbbf24;
      margin: 2rem 0 1rem 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .resume-executive .experience-item,
    .resume-executive .education-item {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #374151;
    }

    .resume-executive .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }

    .resume-executive .item-title {
      font-weight: 600;
      font-size: 1.1rem;
      color: white;
    }

    .resume-executive .item-subtitle {
      color: #cbd5e1;
      font-size: 0.95rem;
    }

    .resume-executive .item-meta {
      color: #fbbf24;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .resume-executive .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    }

    .resume-executive .skill-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #374151;
    }

    .resume-executive .skill-name {
      font-weight: 500;
      color: white;
    }

    .resume-executive .skill-level {
      color: #fbbf24;
      font-size: 0.85rem;
    }

    /* Tech Template Styles */
    .resume-tech {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      line-height: 1.6;
      max-width: 8.5in;
      margin: 0 auto;
      background: #0f172a;
      color: #e2e8f0;
      padding: 1.5in 1in;
      position: relative;
    }

    .resume-tech::before {
      content: '> _';
      position: absolute;
      top: 1in;
      left: 1in;
      font-size: 12px;
      color: #14b8a6;
    }

    .resume-tech .resume-header {
      margin: 2rem 0 2.5rem 0;
    }

    .resume-tech .full-name {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: #14b8a6;
      font-family: inherit;
    }

    .resume-tech .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      font-size: 0.9rem;
      color: #94a3b8;
    }

    .resume-tech .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .resume-tech .contact-item::before {
      content: '//';
      color: #64748b;
      margin-right: 0.25rem;
    }

    .resume-tech .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #14b8a6;
      margin: 2rem 0 1rem 0;
      position: relative;
    }

    .resume-tech .section-title::before {
      content: '## ';
      color: #0d9488;
    }

    .resume-tech .experience-item,
    .resume-tech .education-item {
      margin-bottom: 1.5rem;
      padding-left: 1rem;
      border-left: 2px solid #334155;
    }

    .resume-tech .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }

    .resume-tech .item-title {
      font-weight: 600;
      font-size: 1rem;
      color: #e2e8f0;
    }

    .resume-tech .item-title::before {
      content: '$ ';
      color: #14b8a6;
    }

    .resume-tech .item-subtitle {
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .resume-tech .item-meta {
      color: #14b8a6;
      font-size: 0.85rem;
      background: #1e293b;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .resume-tech .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 0.5rem;
    }

    .resume-tech .skill-item {
      background: #1e293b;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      border: 1px solid #334155;
    }

    .resume-tech .skill-name {
      color: #e2e8f0;
      font-weight: 500;
    }

    .resume-tech .skill-level {
      color: #14b8a6;
      font-size: 0.8rem;
      opacity: 0.8;
    }

    /* General Styles */
    .resume-section {
      margin-bottom: 1.5rem;
    }

    @media print {
      .resume-modern,
      .resume-classic,
      .resume-creative,
      .resume-minimal,
      .resume-executive,
      .resume-tech {
        box-shadow: none;
        margin: 0;
        padding: 0.5in;
      }
    }
  `}</style>
);

export default ResumeStyles;