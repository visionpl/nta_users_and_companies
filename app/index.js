const USERS_URL = "http://localhost:3000/users"
const COMPANIES_URL = "http://localhost:3000/companies"

const tbody = document.querySelector("tbody")


async function fetchUsersAndCompanies() { 
  try {
    const [usersResponse, companyResponse] = await Promise.all([
      fetch(USERS_URL),
      fetch(COMPANIES_URL)
    ]);
    
    const usersArray = await usersResponse.json();
    const companiesArray = await companyResponse.json();
    
    companiesArray.forEach(company => {
      let numberOfUsers = 0;
      let userCompany = [];
      usersArray.find(user => {
        if(user.uris.company === company.uri) {
          numberOfUsers++;

          userCompany.push({
            'userName': user.name,
            'userEmail': user.email
          })
        }
      });

      company.numberOfUsers = numberOfUsers;
      company.users = userCompany     
    });
    

    const sortedCompaniesArray = companiesArray.sort((a, b) => {
      return a.numberOfUsers - b.numberOfUsers;

    })

    createTable(sortedCompaniesArray)

  } catch(err) {
    console.error(err)
  }    
}

const createTable = (data) => {
  let result = '';  

data.forEach(d => {
  let usersData = '';

  for (let i=0; i < d.users.length; i++) {
    usersData += `<li>${d.users[i].userName} (${d.users[i].userEmail})</li>`
  }

   result += `<tr>
   <td>${d.name}</td>
   <td>${d.numberOfUsers}</td>
   <td><ul>${usersData}</ul></td>

   </tr>`
 })
 tbody.innerHTML = result
}

fetchUsersAndCompanies()


