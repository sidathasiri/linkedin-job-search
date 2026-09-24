// Read-only status check for the jobs in job-opportunities.md.
// Usage: open any linkedin.com page while logged in, open DevTools (F12) → Console,
// paste this whole file and press Enter. It does not apply to or change anything.
(async () => {
  const ids = {
    4441588287: "Innodata Lanka – Data Scientist",
    4407804419: "Sysco LABS – Senior Engineer, Data Engineering (Data & AI Governance)",
    4386816863: "HCLTech – Gen AI Data Scientist",
    4386820814: "HCLTech – AI Engineer",
  };
  const csrf = (document.cookie.match(/JSESSIONID="?([^";]+)/) || [])[1];
  const rows = [];
  for (const [id, name] of Object.entries(ids)) {
    let status = "?", applied = "?";
    try {
      const res = await fetch(`/voyager/api/jobs/jobPostings/${id}`, {
        headers: { "csrf-token": csrf, accept: "application/json" },
      });
      if (res.status === 404) {
        status = "REMOVED";
      } else {
        const body = await res.text();
        const state = body.match(/"jobState"\s*:\s*"(\w+)"/);
        status = state ? state[1] : `HTTP ${res.status}`;
        if (/"closedAt"\s*:\s*\d/.test(body)) status = "CLOSED";
        applied = /"applied"\s*:\s*true/.test(body) ? "YES" : "no";
      }
    } catch (e) {
      status = "error";
    }
    rows.push({ name, status, applied, link: `https://www.linkedin.com/jobs/view/${id}/` });
  }
  console.table(rows);
  console.log("Keep rows with status LISTED and applied = no.");
})();
