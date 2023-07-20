module.exports = async ({ github, context }) => {
  let arr = [];
  let events = [];
  for (let i = 1; i < 4; i++) {
    let reposData = await github.rest.repos.listForOrg({
      org: "tensorflow",
      per_page: 10,
      page: i,
    });
    const repos = reposData.data;

    for (let repo of repos) {
      let eventsData = await github.rest.activity.listRepoEvents({
        owner: "tensorflow",
        repo: repo.name,
        per_page: 2,
        page: i,
      });
      console.log("Event",eventsData)
      let events = eventsData.data;
      let lastEvent = events[0];
      events.push(lastEvent);
    }
    
    arr.push(...reposData.data);
  }

  console.log("rep", arr.length);
  console.log(events)
};
