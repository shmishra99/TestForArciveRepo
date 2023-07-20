module.exports = async ({ github, context }) => {
  let arr = [];
  let eventsArr = [];
  for (let i = 1; i < 4; i++) {

    //fetch all the repos from 'tensorflow organization'
    let reposData = await github.rest.repos.listForOrg({
      org: "tensorflow",
      per_page: 10,
      page: i,
    });
    const repos = reposData.data;

    for (let repo of repos) {
   
      //fetch all the event from repos present in 'tensorflow organization'
      let eventsData = await github.rest.activity.listRepoEvents({
        owner: "tensorflow",
        repo: repo.name,
        per_page: 10,
      });

      let events =eventsData.data;
      
      //take the last event of the repo.
      let lastEvent = events[0];
      
      if(repo.name == "profiler-ui")
        {
         console.log("Repo no evnet",events)
        }
       
      if(lastEvent)
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
     console.log("events Arrya", eventsArr)
};
