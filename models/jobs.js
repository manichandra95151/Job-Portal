export const jobs = [
  {
    id: 1,
    jobType: "Tech",
    jobDesignation: 'Mern Developer',
    jobLocation: "Banglore",
    companyName: "Coding Ninjas",
    salary: "125000",
    applyBy: "12/06/2024",
    skillsRequired: "React,Node.js",
    numberofOpenings: 2,
    jobPosted: '10/05/2024',
    applicants: [{
      name: 'Mahendra',
      email: 'mahendra@gmail.com',
      contact: '09515190881',
      filename: '/uploads/1711367570513-Technical Seminar -67.pdf'
    }],
    postedBy: 'mmm@gmail.com',
  },




  {
    id: 2,
    jobType: "Tech",
    jobDesignation: 'Java Developer',
    jobLocation: "Delhi",
    companyName: "Oracle",
    salary: "115000",
    applyBy: "24/06/2024",
    skillsRequired: "DSA,React,Node.js",
    numberofOpenings: 7,
    jobPosted: '09/04/2024',
    applicants: [{
      name: 'Mahendra',
      email: 'mahendra@gmail.com',
      contact: '09515190881',
      filename: '/uploads/1711361364707-Mini Project-II Project final doc1 (3).pdf'
    }],
    postedBy: 'mmm@gmail.com',
  },
  {
    id: 3,
    jobType: "Tech",
    jobDesignation: 'Full Stack Developer',
    jobLocation: "Mumbai",
    companyName: "TCS",
    salary: "105000",
    applyBy: "20/06/2024",
    skillsRequired: "DSA,SpringBoot",
    numberofOpenings: 11,
    jobPosted: '14/03/2024',
    applicants: [{
      name: 'Mahendra',
      email: 'mahendra@gmail.com',
      contact: '09515190881',
      filename: '/uploads/1711361364707-Mini Project-II Project final doc1 (3).pdf'
    }],
    postedBy: 'mmm@gmail.com',
  },
  {
    id: 4,
    jobType: "Non-Tech",
    jobDesignation: 'Manager',
    jobLocation: "Pune",
    companyName: "Nvidia",
    salary: "150000",
    applyBy: "22/05/2024",
    skillsRequired: "React,Node.js",
    numberofOpenings: 3,
    jobPosted: '12/02/2024',
    applicants: [{
      name: 'Mahendra',
      email: 'mahendra@gmail.com',
      contact: '09515190881',
      filename: '/uploads/1711361364707-Mini Project-II Project final doc1 (3).pdf'
    }],
    postedBy: 'mmm@gmail.com',
  },
  {
    id: 5,
    jobType: "Tech",
    jobDesignation: 'Mern Developer',
    jobLocation: "Banglore",
    companyName: "Paypal",
    salary: "165000",
    applyBy: "11/03/2024",
    skillsRequired: "React,Node.js,ExpressJs,Angular",
    numberofOpenings: 5,
    jobPosted: '23/1/2024',
    applicants: [],
    postedBy: 'mmm@gmail.com',
  },
  {
    id: 6,
    jobType: "Tech",
    jobDesignation: 'SDE',
    jobLocation: "Hyderabad",
    companyName: "Microsoft",
    salary: "145000",
    applyBy: "15/07/2024",
    skillsRequired: "React,Node.js,DSA",
    numberofOpenings: 3,
    jobPosted: '11/03/2024',
    applicants: [],
    postedBy: 'mmm@gmail.com',
  },

]


export const addJobs = (job) => {
  jobs.push(job);
}
export const ViewJobs = (id) => {
  console.log(`viewjobmodel:${jobs.find(job => job.id == id)}`);
  return jobs.find(job => job.id == id);

}
export const addApplicant = (jobId, applicant) => {
  const job = jobs.find(job => job.id == jobId);
  if (job) {
    job.applicants.push(applicant);

  } else {
    console.log(`Job with ID ${jobId} not found.`);
  }
}


export const updateJob = (id, updatedJob) => {
  if (!id) {
    console.log("ID is undefined.");
    return;
  }

  const index = jobs.findIndex(job => job.id == id);
  if (index !== -1) {
    jobs[index] = { id, ...updatedJob }; // Pushing id along with updated job
  } else {
    console.log(`Job with ID ${id} not found.`);
  }
  console.log(jobs);
}
export const deleteJob = (id) => {
  if (!id) {
    console.log("ID is undefined.");
    return;
  }

  const index = jobs.findIndex(job => job.id == id);
  if (index !== -1) {
    jobs.splice(index, 1);
  } else {
    console.log(`Job with ID ${id} not found.`);
  }
}
export const viewApplicant = (id) => {
  const job = jobs.find(job => job.id == id);
  return job.applicants;
}

