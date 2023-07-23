let numberOfDaysInactive = 90;

module.exports = async ({ github, context }) => {
  let inactiveRepos = []
  for (let i = 1; i < 4; i++) {
    //fetch all the repos from 'tensorflow organization'
    let reposData = await github.rest.repos.listForOrg({
      org: "tensorflow",
      per_page: 100,
      page: i,
    });

    
    const repos = reposData.data;
    
    for (let repo of repos) {
      let lastActive = {}; 

      if(repo.name !='tfrc')
         continue
      
      let repoObj  = {
         repo_details: repo,
      }
      let getTimeDiffEvent;
      let timeDifferneceRelese; 
      let timeDifferneceCommit;
      // List all the pull request and issues identify pull request by 'pull_request' key sort by update_at
      //It will also cover comment event.
      try{
      // Last commit message 
      let listRepoCommitData = await github.rest.repos.listCommits({
         owner: "tensorflow",
         repo: repo.name,
       });
       console.log("line 32",listRepoCommitData.data[0])
       let listRepoCommit = listRepoCommitData.data[0];
       
       if(listRepoCommit.commit && listRepoCommit.commit.committer){
         timeDifferneceCommit = timeDiffernece(listRepoCommit.commit.committer.date);
         lastActive["timeDifferneceCommit"] =listRepoCommit.commit.committer.date
        }
        else {
            lastActive["timeDifferneceCommit"] = repo.created_at
            timeDifferneceCommit = timeDiffernece(repo.created_at);
         }  
      }
      catch(e){
         timeDifferneceCommit =timeDiffernece(repo.created_at) 
         lastActive["timeDifferneceCommit"]= repo.created_at
      }

      let listRepoIssueData = await github.rest.issues.listForRepo({
        owner: "tensorflow",
        repo: repo.name,
        sort: "updated",
        state: "all"
      });

      let listRepoIssue = listRepoIssueData.data[0];
      if(listRepoIssue){
      //  console.log("list issues",listRepoIssue)
       getTimeDiffEvent = timeDiffernece(listRepoIssue.updated_at);
       lastActive["getTimeDiffEvent"] = listRepoIssue.updated_at
      }
      else {
         lastActive["getTimeDiffEvent"] = repo.created_at
         getTimeDiffEvent = timeDiffernece(repo.created_at);
      }     
      // fetch the last update date if it is less then 90 days then ignore else archive and continue.
      try {
        //get the latest relesedata
        let getLatestReleaseData = await github.rest.repos.getLatestRelease({
          owner: "tensorflow",
          repo: repo.name,
        });

        let getLatestRelease = getLatestReleaseData.data;
         timeDifferneceRelese =  timeDiffernece(getLatestRelease.created_at)
         lastActive["timeDifferneceRelese"]= getLatestRelease.created_at
      } catch (e) {
        timeDifferneceRelese =timeDiffernece(repo.created_at) 
        lastActive["timeDifferneceRelese"]= repo.created_at
      }
 
      if(numberOfDaysInactive < getTimeDiffEvent && numberOfDaysInactive < timeDifferneceRelese && numberOfDaysInactive < timeDifferneceCommit){   
           if(getTimeDiffEvent < timeDifferneceRelese)
              {
               repoObj["inactiveDays"] = getTimeDiffEvent
               repoObj["lastactiveDate"] = lastActive["getTimeDiffEvent"]
              }
              else if(timeDiffernece < timeDifferneceCommit){
              repoObj["inactiveDays"] = timeDifferneceRelese
              repoObj["lastactiveDate"] = lastActive["timeDifferneceRelese"]
              }
              else {
               repoObj["inactiveDays"] = timeDifferneceCommit
               repoObj["lastactiveDate"] = lastActive["timeDifferneceCommit"]
              }
      }
      if(repoObj["inactiveDays"]){
         inactiveRepos.push(repoObj)
      }
    }
  }
   createIssueWithTemplates(inactiveRepos,github)
};

async function createIssueWithTemplates(inactiveRepos,github){
   let templateIssue = "# Inactive Repositories \n" 
   templateIssue = templateIssue + " The following repos have not had no activity for more than "  + numberOfDaysInactive + " days:\n"
   templateIssue = templateIssue + "| Repository URL | Days Inactive | Last Active Date |\n"
   templateIssue = templateIssue + " | --- | ---: | ---: |\n"     
   for(let inactive of inactiveRepos){
       templateIssue =   templateIssue + " | " +  inactive.repo_details.html_url + " | " +  Math.floor(inactive.inactiveDays) + " | " +  inactive.lastactiveDate + " |\n"
   } 
   await github.rest.issues.create({
     owner:'shmishra99',
     repo:'TestForArciveRepo',
     title:'Stale Repo by API',
     body:templateIssue
     
   });
}

function timeDiffernece(updateDate) {
  let updateTime = new Date(updateDate).getTime();
  let todaysDate = new Date().getTime();
  let differenceInSec = todaysDate - updateTime;
  let daysDifference = differenceInSec / 86400000;
  return daysDifference;
}
