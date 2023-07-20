

module.exports = async ({ github, context }) => {

   let arr = [];
   for(let i=1;i<10;i++){
   let repos =   await github.rest.repos.listForOrg({
                    org: "tensorflow",
                    per_page:100
                    page:i
                })
      arr.push(...repos.data)
   }
   console.log("rep",arr.length)
   
   
   
}
