module.exports = async ({ github, context }) => {
  let arr = [];
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
        sort: "updated",
      });

      let listRepoIssue = listRepoIssueData.data[0];
      console.log("listRepoIssueData", listRepoIssue); // updated_at,
      // let getTimeDiff = timeDiffernece(listRepoIssue.updated_at);
  
      
      // fetch the last update date if it is less then 90 days then ignore else archive and continue.
      console.log("listRepoIssueData", listRepoIssue);

      try {
        //get the latest relesedata
        let getLatestReleaseData = await github.rest.repos.getLatestRelease({
          owner: "tensorflow",
          repo: repo.name,
        });
        let getLatestRelease = getLatestReleaseData.data;
        console.log("getLatestRelease", getLatestRelease);
      } catch (e) {
        console.log("no relese.");
      }
    }
  }

  //   console.log("events Arrya", eventsArr);
};

function timeDiffernece(updateDate) {
  let updateTime = new Date(updateDate).getTime();
  let todaysDate = new Date().getTime();
  let differenceInSec = todaysDate - updateTime;
  let daysDifference = differenceInSec / 86400000;
  console.log("Diff", daysDifference);
}
