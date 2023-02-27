const DARK = 'dark';
const LIGHT = 'light';
const api = "https://api.github.com/users/"

const toggleButton = document.querySelector('.header__theme--switcher');
const toggleButtonString = document.querySelector('.header__theme--value');
const darkToggle = document.querySelector('.header__theme--icon-light');
const lightToggle = document.querySelector('.header__theme--icon-dark');
const wrapper = document.querySelector('.wrapper');

const repos = document.querySelector('.user__stats--info-number');
const name = document.querySelector('.user__info-login-name');
const gitName = document.querySelector('.user__info-login-nickname')
const dateJoined = document.querySelector('.user__info-login-joined');
const followers = document.querySelector('.user__stats--followers-number');
const following = document.querySelector('.user__stats--following-number');
const bio = document.querySelector('.user__info-login-bio');
const avatar = document.querySelector('.user__info-avatar');

const location = document.querySelector('.user__links--location-name');
const website = document.querySelector('.user__links--website-link-anchor');
const twitter = document.querySelector('.user__links--twitter-handle');
const company = document.querySelector('.user__links--company-name');

const locationWrapper = document.querySelector('.user__links--location');
const websiteWrapper = document.querySelector('.user__links--website');
const twitterWrapper = document.querySelector('.user__links--twitter');
const companyWrapper = document.querySelector('.user__links--company');

const main = document.querySelector('.main');
const error = document.querySelector('.search__error');

const setTheme = () => {
  const preferredThemeIsLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const preferredThemeIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (preferredThemeIsLight) {
    toggleButtonString.textContent = DARK
    darkToggle.classList.add('active');
    darkToggle.classList.add('active');
  }

  if (preferredThemeIsDark) {
    wrapper.classList.add('dark')
    toggleButtonString.textContent = LIGHT
    lightToggle.classList.add('active');
    lightToggle.classList.add('active');
  }
}

setTheme()

const toggleTheme = () => {
  const buttonContent = toggleButtonString.textContent.trim();
  if (buttonContent === DARK) {
    toggleButtonString.textContent = LIGHT
    wrapper.classList.add('dark')
    lightToggle.classList.add('active')
    darkToggle.classList.remove('active')
  } else {
    toggleButtonString.textContent = DARK
    wrapper.classList.remove('dark')
    lightToggle.classList.remove('active')
    darkToggle.classList.add('active');
  }
}

toggleButton.addEventListener('click', toggleTheme);

const form = document.querySelector('.search');

const formatDate = dateString => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat('en-US', {month: 'long'}).format(date);
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

const renderData = data => {
  if(!data) return
  name.textContent = data.name ? data.name : "Not Available";
  gitName.textContent = data.login ? data.login : "Not Available";
  dateJoined.textContent = `Joined ${data.joined}`;
  bio.textContent = data.bio ? data.bio : "";
  repos.textContent = data.totalRepos ? data.totalRepos : '0';
  followers.textContent = data.followers ? data.followers : '0';
  following.textContent = data.following ? data.following : '0';
  avatar.setAttribute('src', data.avatarUrl);
  twitter.textContent = data.twitter ? data.twitter : "Not Available";
  location.textContent = data.location ? data.location : "Not Available";
  company.textContent = data.company ? data.company : "Not Available";
  website.textContent = data.blog.length > 0 ? data.blog : "Not Available";

  updateNodesAvailability({
    blog: data.blog.length > 0,
    company: data.company,
    location: data.location,
    twitter: data.twitter,
    bio: data.bio
  })

  main.style.opacity = 'initial';

}

const updateNodesAvailability = (data) => {
  if (!data.blog) {
    websiteWrapper.classList.add('disabled');
  } else {
    websiteWrapper.classList.remove('disabled');
  }

  if (!data.company) {
    companyWrapper.classList.add('disabled');
  } else {
    companyWrapper.classList.remove('disabled');
  }

  if (!data.twitter) {
    twitterWrapper.classList.add('disabled');
  } else {
    twitterWrapper.classList.remove('disabled');
  }

  if (!data.location) {
    locationWrapper.classList.add('disabled');
  } else {
    locationWrapper.classList.remove('disabled');
  }

  if(!data.bio) {
    bio.style.display = 'none';
  } else {
    bio.style.display = 'block';
  }

}

const getData = async (url) => {
  try {
    const res = await fetch(url)
    if (res.ok) {
      const accountInfo = await res.json()
      const req = await fetch(accountInfo['repos_url']);
      if (req.ok) {
        const repos = await req.json()
        if(window.getComputedStyle(error).display === 'block') {
          error.style.display = 'none'
        }
        return {
          name: accountInfo.name,
          joined: formatDate(accountInfo['created_at']),
          login: accountInfo.login,
          followers: String(accountInfo.followers),
          following: String(accountInfo.following),
          location: accountInfo.location,
          twitter: accountInfo['twitter_username'],
          blog: accountInfo.blog,
          company: accountInfo.company,
          totalRepos: String(repos.length),
          bio: accountInfo.bio,
          avatarUrl: accountInfo['avatar_url']
        }
      } else {
        throw new Error(`Request failed with status ${res.status}`)
      }
    } else {
      throw new Error(`Request failed with status ${res.status}`)
    }
  } catch (e) {
    error.style.display = 'block'
    console.error(e)
  }
}

form.onsubmit = async function (e) {
  e.preventDefault()
  const term = e.currentTarget['name'].value.trim()
  if (term === '') return;
  const url = `${api}${term}`
  const data = await getData(url)
  if(data) {
    renderData(data)
  }
}