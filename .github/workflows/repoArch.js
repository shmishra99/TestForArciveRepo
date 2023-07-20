module.exports = async ({ github, context }) => {
  let arr = [];
  let eventsArr = [];
  let numberOfDaysInactive = 90;
  for (let i = 1; i < 4; i++) {
    //fetch all the repos from 'tensorflow organization'
    let reposData = await github.rest.repos.listForOrg({
      org: "tensorflow",
      per_page: 10,
      page: i,
    });
    const repos = reposData.data;
   
    for (let repo of repos) {
     
      // List all the pull request and issues identify pull request by 'pull_request' key sort by update_at
      //It will also cover comment event. 
      let listRepoIssueData = await github.rest.issues.listForRepo({
        owner: "tensorflow",
        repo: repo.name,
        sort:"updated"
      });

      let listRepoIssue = listRepoIssueData.data[0];
      console.log("listRepoIssueData",listRepoIssue)

      //get the latest relesedata
      let getLatestReleaseData = await github.rest.repos.getLatestRelease({
        owner: "tensorflow",
        repo: repo.name,
      });
      let getLatestRelease = getLatestReleaseData;
      console.log("getLatestRelease",getLatestRelease)
      
      

    }
  }
//   console.log("events Arrya", eventsArr);
};
