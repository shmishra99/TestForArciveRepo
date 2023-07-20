module.exports = async ({ github, context }) => {
  let arr = [];
  let eventsArr = [];
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

      let events =eventsData.data;
      // console.log(events)
      let lastEvent = events[0];
      console.log(lastEvent)
      if(!lastEvent)
       eventsArr.push(lastEvent);
      else 
        {
         let noEvents = {
              repo:repo.name,
              owner: "tensorflow",
              events:"No event"

         } 
         eventsArr.push(noEvents)
        } 
    }
    
   //  arr.push(...reposData.data);
  }

//   console.log("rep", arr.length);
     console.log(eventsArr)
};
