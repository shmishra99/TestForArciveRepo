

module.exports = async ({ github, context }) => {

   let repos =   await github.rest.repos.listForOrg({
                    org: "tensorflow",
                    type: 'private'
                 
                })
   console.log("rep",repos)
  
   
}
