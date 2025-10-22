const ResumeStyles = () => (
  <style jsx global>{`
    /* Base styles for all templates */
    .resume-template {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #e2e8f0;
      max-width: 8.5in;
      margin: 2rem auto;
      background: #0b1120;
      background-image: 
        radial-gradient(1000px 600px at 10% -10%, rgba(99, 102, 241, 0.35), transparent),
        radial-gradient(1000px 600px at 100% 0%, rgba(14, 165, 233, 0.25), transparent);
      padding: 1.5in 1in;
      border-radius: 12px;
      border: 1px solid rgba(148, 163, 184, 0.2);
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.8), 0 10px 25px -15px rgba(15, 23, 42, 0.7);
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }
    
    .resume-template::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 12px;
      background: linear-gradient(90deg, #6366f1, #0ea5e9, #22d3ee);
    }

    /* Reset some styles that might interfere */
    .resume-template * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* Modern Template */
    .resume-modern {
      font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #e2e8f0;
      max-width: 8.5in;
      margin: 0 auto;
      background: linear-gradient(160deg, #0f172a, #1e293b);
      padding: 1.5in 1in;
      border-radius: 10px;
      border: 1px solid rgba(99, 102, 241, 0.3);
    }
    .resume-modern .resume-header {
      background: linear-gradient(135deg, #4f46e5, #0ea5e9);
      color: #ffffff;
      padding: 2rem;
      margin: -1.5in -1in 2rem -1in;
      position: relative;
      z-index: 1;
      box-shadow: 0 20px 45px -25px rgba(99, 102, 241, 0.5);
    }
    .resume-modern .full-name {
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      margin: 0 0 1rem 0;
      color: #ffffff;
    }
    .resume-modern .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      font-size: 0.95rem;
      color: #f1f5f9;
    }
    .resume-modern .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .resume-modern .contact-item svg {
      color: #f8fafc;
    }
    .resume-modern .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #60a5fa;
      margin: 1.5rem 0 1rem 0;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .resume-modern .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      color: #f1f5f9;
    }
    .resume-modern .item-title {
      font-weight: 600;
      font-size: 1.1rem;
    }
    .resume-modern .item-subtitle {
      color: #94a3b8;
      font-size: 0.95rem;
    }
    .resume-modern .resume-section {
      margin-bottom: 1.5rem;
    }
    .resume-modern .experience-item,
    .resume-modern .education-item {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(71, 85, 105, 0.5);
    }
    .resume-modern .experience-item:last-child,
    .resume-modern .education-item:last-child {
      border-bottom: none;
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
      color: #cbd5e1;
    }

    /* Classic Template */
    .resume-classic {
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.6;
      color: #e2e8f0;
      max-width: 8.5in;
      margin: 0 auto;
      background: linear-gradient(165deg, #1e293b, #0f172a);
      padding: 1in;
      border: 2px solid rgba(251, 191, 36, 0.3);
      border-radius: 10px;
    }
    .resume-classic .resume-header {
      text-align: center;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid rgba(251, 191, 36, 0.5);
      margin-bottom: 2rem;
    }
    .resume-classic .full-name {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: #fbbf24;
      letter-spacing: 0.06em;
    }
    .resume-classic .contact-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      font-size: 0.9rem;
      color: #cbd5e1;
    }
    .resume-classic .contact-item {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    .resume-classic .contact-item svg {
      color: #fbbf24;
    }
    .resume-classic .section-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: #fbbf24;
      margin: 1.5rem 0 1rem 0;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    .resume-classic .item-header {
      margin-bottom: 0.5rem;
      color: #e2e8f0;
    }
    .resume-classic .item-title {
      font-weight: 600;
      font-size: 1.1rem;
      color: #f8fafc;
    }
    .resume-classic .item-subtitle {
      color: #94a3b8;
      font-size: 0.95rem;
      font-style: italic;
    }
    .resume-classic .resume-section {
      margin-bottom: 1.5rem;
    }
    .resume-classic .experience-item,
    .resume-classic .education-item {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(71, 85, 105, 0.5);
    }
    .resume-classic .experience-item:last-child,
    .resume-classic .education-item:last-child {
      border-bottom: none;
    }
    .resume-classic .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    }
    .resume-classic .skill-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      color: #cbd5e1;
    }

    /* Creative Template */
    .resume-creative {
      font-family: 'Inter', 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #e2e8f0;
      max-width: 8.5in;
      margin: 0 auto;
      background: linear-gradient(160deg, #18213a, #111827);
      display: flex;
      min-height: 11in;
      border-radius: 12px;
      border: 1px solid rgba(167, 139, 250, 0.4);
      overflow: hidden;
    }
    .resume-creative .sidebar {
      width: 35%;
      background: linear-gradient(160deg, #7c3aed, #a855f7);
      color: #ffffff;
      padding: 2.25rem 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .resume-creative .main-content {
      flex: 1;
      padding: 2.25rem 2rem;
      background: #0f172a;
      backdrop-filter: blur(14px);
    }
    .resume-creative .full-name {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      text-align: center;
      color: #ffffff;
    }
    .resume-creative .sidebar .contact-info {
      margin-bottom: 2rem;
      color: #f1f5f9;
      display: grid;
      gap: 0.75rem;
    }
    .resume-creative .contact-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.92rem;
    }
    .resume-creative .contact-item svg {
      color: #fdf4ff;
    }
    .resume-creative .section-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 1.5rem 0 1rem 0;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .resume-creative .sidebar .section-title {
      color: #ffffff;
      border-bottom: 2px solid rgba(255,255,255,0.5);
      padding-bottom: 0.5rem;
    }
    .resume-creative .main-content .section-title {
      color: #a78bfa;
    }
    .resume-creative .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      color: #e2e8f0;
    }
    .resume-creative .item-title {
      font-weight: 600;
      font-size: 1.1rem;
    }
    .resume-creative .item-subtitle {
      color: #94a3b8;
      font-size: 0.95rem;
    }
    .resume-creative .experience-item,
    .resume-creative .education-item {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(71, 85, 105, 0.5);
    }
    .resume-creative .experience-item:last-child,
    .resume-creative .education-item:last-child {
      border-bottom: none;
    }
    .resume-creative .skills-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .resume-creative .skill-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      color: #f1f5f9;
    }

    /* Minimal Template */
    .resume-minimal {
      font-family: 'Helvetica', 'Arial', sans-serif;
      line-height: 1.7;
      color: #e2e8f0;
      max-width: 8.5in;
      margin: 0 auto;
      background: linear-gradient(175deg, #0c1221, #020617);
      padding: 1in;
      border-radius: 10px;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }
    .resume-minimal .resume-header {
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }
    .resume-minimal .full-name {
      font-size: 2.8rem;
      font-weight: 300;
      margin: 0 0 0.25rem 0;
      color: #ffffff;
      letter-spacing: -0.04em;
    }
    .resume-minimal .name-underline {
      width: 80px;
      height: 3px;
      background: linear-gradient(90deg, #22d3ee, #38bdf8);
      margin-bottom: 1rem;
      border-radius: 9999px;
    }
    .resume-minimal .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      font-size: 0.9rem;
      color: #cbd5e1;
    }
    .resume-minimal .contact-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .resume-minimal .contact-item svg {
      color: #38bdf8;
    }
    .resume-minimal .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #38bdf8;
      margin: 2rem 0 1rem 0;
      text-transform: uppercase;
      letter-spacing: 0.18em;
    }
    .resume-minimal .item-header {
      margin-bottom: 0.5rem;
      color: #f1f5f9;
    }
    .resume-minimal .item-title {
      font-weight: 600;
      font-size: 1.1rem;
      color: #e2e8f0;
    }
    .resume-minimal .item-subtitle {
      color: #94a3b8;
      font-size: 0.95rem;
    }
    .resume-minimal .experience-item,
    .resume-minimal .education-item {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(71, 85, 105, 0.5);
    }
    .resume-minimal .experience-item:last-child,
    .resume-minimal .education-item:last-child {
      border-bottom: none;
    }
    .resume-minimal .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    }
    .resume-minimal .skill-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(71, 85, 105, 0.3);
      color: #cbd5e1;
    }

    /* Executive Template */
    .resume-executive {
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.6;
      color: #f1f5f9;
      max-width: 8.5in;
      margin: 0 auto;
      background: linear-gradient(165deg, #080b13, #0f172a);
      padding: 1in;
      position: relative;
      border-radius: 12px;
      border: 1px solid rgba(250, 204, 21, 0.3);
    }
    .resume-executive::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 6px;
      height: 100%;
      background: linear-gradient(to bottom, #facc15, #f59e0b);
      border-radius: 0 12px 12px 0;
    }
    .resume-executive .resume-header {
      padding-bottom: 1.5rem;
      border-bottom: 2px solid rgba(250, 204, 21, 0.6);
      margin-bottom: 2rem;
    }
    .resume-executive .full-name {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: #fbbf24;
      letter-spacing: 0.05em;
    }
    .resume-executive .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      font-size: 0.9rem;
      color: #cbd5e1;
    }
    .resume-executive .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .resume-executive .contact-item svg {
      color: #facc15;
    }
    .resume-executive .section-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: #facc15;
      margin: 1.5rem 0 1rem 0;
      text-transform: uppercase;
      letter-spacing: 0.15em;
    }
    .resume-executive .item-header {
      margin-bottom: 0.5rem;
      color: #f1f5f9;
    }
    .resume-executive .item-title {
      font-weight: 600;
      font-size: 1.1rem;
      color: #fde047;
    }
    .resume-executive .item-subtitle {
      color: #94a3b8;
      font-size: 0.95rem;
    }
    .resume-executive .item-meta {
      color: #cbd5e1;
    }
    .resume-executive .experience-item,
    .resume-executive .education-item {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(71, 85, 105, 0.5);
    }
    .resume-executive .experience-item:last-child,
    .resume-executive .education-item:last-child {
      border-bottom: none;
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
      color: #e2e8f0;
    }

    /* Tech Template */
    .resume-tech {
      font-family: 'Monaco', 'Courier New', monospace;
      line-height: 1.6;
      color: #e2e8f0;
      max-width: 8.5in;
      margin: 0 auto;
      background: radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.15), transparent 55%),
                  radial-gradient(circle at 80% 10%, rgba(45, 212, 191, 0.15), transparent 50%),
                  #020617;
      padding: 1in;
      position: relative;
      border-radius: 12px;
      border: 1px solid rgba(14, 165, 233, 0.4);
    }
    .resume-tech::before {
      content: '>_';
      position: absolute;
      top: 24px;
      left: 24px;
      font-size: 1.15rem;
      color: #22d3ee;
      font-weight: bold;
    }
    .resume-tech .resume-header {
      padding: 1rem 0 1.5rem 0;
      border-bottom: 2px solid rgba(14, 165, 233, 0.6);
      margin-bottom: 2rem;
    }
    .resume-tech .full-name {
      font-size: 2.2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: #14b8a6;
    }
    .resume-tech .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      font-size: 0.9rem;
      color: #94a3b8;
    }
    .resume-tech .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .resume-tech .section-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: #14b8a6;
      margin: 1.5rem 0 1rem 0;
      text-transform: uppercase;
    }
    .resume-tech .section-title::before {
      content: '// ';
      color: #94a3b8;
    }
    .resume-tech .item-header {
      margin-bottom: 0.5rem;
    }
    .resume-tech .item-title {
      font-weight: 600;
      font-size: 1.1rem;
      color: #e2e8f0;
    }
    .resume-tech .item-subtitle {
      color: #94a3b8;
      font-size: 0.95rem;
    }
    .resume-tech .item-meta {
      color: #94a3b8;
    }
    .resume-tech .experience-item,
    .resume-tech .education-item {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #334155;
    }
    .resume-tech .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    }
    .resume-tech .skill-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      background: #1e293b;
      border-radius: 4px;
      color: #e2e8f0;
    }
  `}</style>
);
export default ResumeStyles;