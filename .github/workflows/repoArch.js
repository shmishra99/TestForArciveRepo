

module.exports = async ({ github, context }) => {

   let repos =   await github.rest.repos.listForOrg({
                    org: "tensorflow",
                   
                })
   console.log("rep",repos.data.length)
   
   
   
}
