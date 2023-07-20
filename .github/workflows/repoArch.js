module.exports = async ({ github, context }) => {
  let inactiveRepos = [];
  let numberOfDaysInactive = 9;
  

  for (let i = 1; i < 4; i++) {
    //fetch all the repos from 'tensorflow organization'
    let reposData = await github.rest.repos.listForOrg({
      org: "tensorflow",
      per_page: 10,
      page: i,
    });
    const repos = reposData.data;
    
    for (let repo of repos) {
      let repoObj  = {
         repo_details: repo,
      }
      let getTimeDiffEvent;
      let timeDifferneceRelese; 
      // List all the pull request and issues identify pull request by 'pull_request' key sort by update_at
      //It will also cover comment event.
    
      let listRepoIssueData = await github.rest.issues.listForRepo({
        owner: "tensorflow",
        repo: repo.name,
        sort: "updated",
        state: "all"
      });
      
      let listRepoIssue = listRepoIssueData.data[0];
      if(listRepoIssue)
       getTimeDiffEvent = timeDiffernece(listRepoIssue.updated_at);
      else 
        getTimeDiffEvent =  numberOfDaysInactive * 1000
      // fetch the last update date if it is less then 90 days then ignore else archive and continue.
      try {
        //get the latest relesedata
        let getLatestReleaseData = await github.rest.repos.getLatestRelease({
          owner: "tensorflow",
          repo: repo.name,
        });
        let getLatestRelease = getLatestReleaseData.data;
         timeDifferneceRelese =  timeDiffernece(getLatestRelease.updated_at)
      } catch (e) {
        timeDifferneceRelese = numberOfDaysInactive * 1000   // make it older
        console.log("no relese.",e);
      }
      
      if(numberOfDaysInactive < getTimeDiffEvent && numberOfDaysInactive < timeDifferneceRelese){
          
           if(getTimeDiffEvent < timeDifferneceRelese)
              {
               repoObj["inactiveDays"] = getTimeDiffEvent
              }
              else 
              repoObj["inactiveDays"] = timeDifferneceRelese
      }
      if(repoObj["inactiveDays"])
         inactiveRepos.push(repoObj)
    }
    

  }
    console.log("events Arrya", inactiveRepos);
     
    let templateIssue = "# Inactive Repositories \n" 
    templateIssue = templateIssue + " The following repos have not had no activity for more than"  + numberOfDaysInactive + "days:\n"
    templateIssue = templateIssue + "| Repository URL | Days Inactive | Last Push Date |\n"
    templateIssue = templateIssue + " | --- | ---: | ---: |\n"     
    for(let inactive of inactiveRepos){
        templateIssue =   templateIssue + " | " +  inactive.repo_details.html_url + " | " +  inactive.inactiveDays + " | " +  "2020-1-30" + " |\n"

    }
   
    await github.rest.issues.create({
   
      owner:'shmishra99',
      repo:'TestForArciveRepo',
      title:'Stale Repo by API',
      body:templateIssue
      
    });

};

function timeDiffernece(updateDate) {
  let updateTime = new Date(updateDate).getTime();
  let todaysDate = new Date().getTime();
  let differenceInSec = todaysDate - updateTime;
  let daysDifference = differenceInSec / 86400000;
  return daysDifference;
}
