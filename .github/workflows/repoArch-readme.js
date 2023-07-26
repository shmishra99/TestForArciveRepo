let numberOfDaysInactive = 90;

module.exports = async ({ github, context }) => {

  github.rest.repos.createOrUpdateFileContents({
    owner: context.repo.owner,
    repo: context.repo.repo,
    path:'README.md',
    message:"commit to branch message",
    content:"Commit content.",
    committer:{
    name:"Shivam Mishra",
    email:"shivammishr@google.com"
    },
    author:{
    name:"Shivam Mishra",
    email:"shivammishr@google.com"
    }
    
     })

}
