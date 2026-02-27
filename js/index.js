
const search = document.querySelector(".settings");
const geo = document.querySelector(".geolocation");
const industry = document.querySelector(".industry");
const information = document.querySelector(".information");
const errorText = document.getElementById("searchErrorText");
let darkMode = localStorage.getItem("darkMode");
const toggleTheme = document.getElementById("modeBtn");
const searchError = document.getElementById("searchError");



const enableDarkMode =() => {
    document.body.classList.add("darkMode");
    localStorage.setItem("darkMode", "enabled");
}

const disableDarkMode = () => {
    document.body.classList.remove("darkMode");
    localStorage.setItem("darkMode", null);
}

//this is for last (this is the person that keeps the mode when you refresh lol)
if(darkMode === "enabled") {
    enableDarkMode();
}

toggleTheme.addEventListener("click", () => {
    //update darkmode everytime you click 
    darkMode = localStorage.getItem("darkMode");

    if(darkMode !== "enabled") {
        enableDarkMode();
    }
    else{
        disableDarkMode();
    }
});



async function allValues() {
    const jobsData = await getJobsData();
    displayIndustries(jobsData);
    displayGeo(jobsData);
}

allValues();


function displayIndustries(data) {
    const loopJobs = data.jobs;
    let mySet = new Set([]);
    loopJobs.forEach(job => {
        mySet.add(...job.jobIndustry);
    });
    mySet.forEach(element => {
        let industries = document.createElement("option");
        industries.value = `${element}`;
        industries.innerHTML = `${element}`;

        industry.appendChild(industries);
    });
}


function displayGeo(data) {
    const loopJobs = data.jobs;
    let mySet = new Set([]);
    loopJobs.forEach(job => {
        mySet.add(job.jobGeo);
    });
    mySet.forEach(element => {
        let industries = document.createElement("option");
        industries.value = `${element}`;
        industries.textContent = `${element}`;
        geo.appendChild(industries);
    });
}


search.addEventListener("submit",async (e) => {
    e.preventDefault();
    information.innerHTML = "";
    const completeData = await getJobsData();
    displayAllCompanys(completeData);
    if(information.innerHTML === "") {
        searchError.style.display = "flex";
        errorText.textContent = "There are no Jobs found at this time";
    }
    else {
        searchError.style.display = "none";
        errorText.textContent = "";
    }
});



async function getJobsData() {
    const jobsUrl = `https://jobicy.com/api/v2/remote-jobs`;
    const response = await fetch(jobsUrl);
    const data = await response.json();
    if(!response.ok) {
        console.log("Unable to fetch");
    }
    else {
        return data;
    }
}


function displayAllCompanys(data) {

    const allJobs = data.jobs;
    let uniqueJobs = new Set([]);

    allJobs.forEach(job => {
        let shouldIncludeJob = false;
        if(geo.value === "Any Country") {
            shouldIncludeJob = true; 
        } else if(job.jobGeo === geo.value) {
            shouldIncludeJob = true; 
        }
        if(shouldIncludeJob) {
            if(industry.value === "All Industries") {
                uniqueJobs.add(job);
            } 
            else if(job.jobIndustry == industry.value) {
                uniqueJobs.add(job);
            }
        }


    });
    uniqueJobs.forEach(job => {

        let newUnorderedList = document.createElement("ul")
        let myCompanyName = document.createElement("li");
        let companyJobGeo = document.createElement("li");
        let companyJobIndustry = document.createElement("li");
        let companyTitle = document.createElement("li");
        let companyExactJobDesc = document.createElement("li");
        let companyJobType = document.createElement("li");
        let companyJobsLevel = document.createElement("li");
        let CompanyMinSalary = document.createElement("li");
        let CompanyMaxSalary = document.createElement("li");
        let companyCurrency = document.createElement("li");
        let companyUrl = document.createElement("li");
        let companyPubDate = document.createElement("li");
        let urlLink = document.createElement("a");


        myCompanyName.innerHTML = `Company name: ${job.companyName}`;
        companyJobGeo.innerHTML = `Company Location: ${job.jobGeo}`;
        companyJobIndustry.innerHTML = `Job Industry: ${job.jobIndustry}`;
        companyTitle.textContent = `Job Title: ${job.jobTitle.replaceAll("&amp;#8211;", "-").replaceAll("&amp;#038;", "&")}`;
        companyExactJobDesc.textContent = `Job Description: ${job.jobExcerpt.replaceAll("&amp;#8211;", "-").replaceAll("&amp;#8217;", "'")}`;
        companyJobType.innerHTML = `Job type: ${job.jobType}`;
        companyJobsLevel.innerHTML = `Level of Expertise: ${job.jobLevel}`;
        CompanyMinSalary.textContent = `Minimum Salary: ${job.salaryMin ? job.salaryMin : "Unavailable"}`;
        CompanyMaxSalary.innerHTML = `Maximum Salary: ${job.salaryMax ? job.salaryMax : "Unavailable"}`;
        companyCurrency.innerHTML = `Company Currency: ${job.salaryCurrency ? job.salaryCurrency : "Unavailable"}`;
        urlLink.textContent = "Company Url";
        companyPubDate.innerHTML = `Publish Date: ${job.pubDate}`;


        newUnorderedList.classList.add("listClass");
        myCompanyName.classList.add("paragraphClass");
        companyJobGeo.classList.add("paragraphClass");
        urlLink.href = job.url;
        urlLink.target = "_blank";
        companyJobIndustry.classList.add("paragraphClass");
        companyTitle.classList.add("paragraphClass");
        companyExactJobDesc.classList.add("paragraphClass");
        companyJobType.classList.add("paragraphClass");
        companyJobsLevel.classList.add("paragraphClass");
        CompanyMinSalary.classList.add("paragraphClass");
        CompanyMaxSalary.classList.add("paragraphClass");
        companyCurrency.classList.add("paragraphClass");
        companyUrl.classList.add("paragraphClass");
        companyPubDate.classList.add("paragraphClass");

        companyUrl.appendChild(urlLink);
        newUnorderedList.appendChild(myCompanyName);
        newUnorderedList.appendChild(companyJobGeo);
        newUnorderedList.appendChild(companyJobIndustry);
        newUnorderedList.appendChild(companyTitle);
        newUnorderedList.appendChild(companyExactJobDesc);
        newUnorderedList.appendChild(companyJobType);
        newUnorderedList.appendChild(companyJobsLevel);
        newUnorderedList.appendChild(CompanyMinSalary);
        newUnorderedList.appendChild(CompanyMaxSalary);
        newUnorderedList.appendChild(companyCurrency);
        newUnorderedList.appendChild(companyUrl);
        newUnorderedList.appendChild(companyPubDate);
        information.appendChild(newUnorderedList);

    });


}





