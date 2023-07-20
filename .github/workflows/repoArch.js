

module.exports = async ({ github, context }) => {

   let repos =   await github.rest.repos.listForOrg({
                    owner: "tensorflow",
                 
                })
   console.log("rep",repos)
  
   
}
