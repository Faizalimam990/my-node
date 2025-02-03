import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

// Define the start and end date for the commit range
const startDate = moment("2024-02-01");
const endDate = moment("2025-02-02");

const markCommit = (x, y) => {
  const date = moment()
    .subtract(1, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format();

  const data = {
    date: date,
  };

  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { "--date": date }).push();
  });
};

const makeCommits = (n) => {
  if (n === 0) return simpleGit().push();

  // Generate random weeks and days between 0 and 54 weeks, and 0 and 6 days
  const x = random.int(0, 54); // Weeks from the start
  const y = random.int(0, 6);  // Days within the week

  // Generate a date within the range of the start and end date
  const randomDate = startDate
    .clone()
    .add(x, "w") // Add random weeks
    .add(y, "d"); // Add random days

  // If the random date exceeds the end date, adjust it
  if (randomDate.isAfter(endDate)) {
    return makeCommits(n); // Recursively try again to make sure we stay within bounds
  }

  const date = randomDate.format();
  const data = {
    date: date,
  };

  console.log(date);

  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { "--date": date }, makeCommits.bind(this, n - 1));
  });
};

// Start the commit creation process
makeCommits(200);  // Change the number of commits as needed
