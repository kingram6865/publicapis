const proxy = "https://thawing-refuge-51120.herokuapp.com/"

/** Top Level Container */
const formHome = document.querySelector('.head')

/** Main Container */
const mainHome = document.querySelector('.main')

const apiList = document.createElement('form')
apiList.className = "apilist"
apiList.id = "apiList1"
formHome.appendChild(apiList)

// const apiListlabel = document.createElement('label')
// apiListlabel.htmlFor = 'apiList1'
// document.querySelector('form').appendChild(apiListlabel)

const ddList = document.createElement('select')
ddList.className = "apiByCategory"
const defaultOpt = document.createElement("option")
defaultOpt.text = "Select A Category"
ddList.add(defaultOpt)
ddList.selectedIndex = 0


const viewer = document.createElement('iframe')
viewer.className = 'apiViewer'
viewer.name = "apiView"
mainHome.appendChild(viewer)

function listApis() {
  // const proxy="https://cors-anywhere.herokuapp.com/"
  const base='https://api.publicapis.org'
  const categories = `${base}/categories`
  // const all = `${base}/entries?category=`
  // const test ="https://api.publicapis.org/entries?category=Transportation"
  const loadingMsg = "Loading Categories"
  const loader = document.createElement('div')
  loader.className = "loading"
  loader.innerText = loadingMsg
  formHome.appendChild(loader)
  fetch(proxy + categories)
    .then(response => response.json())
    .then((data) => {
      // console.log(data)
      data.forEach((x) => {
        let opt = document.createElement("option")
        opt.text = x
        ddList.add(opt)
      })
      formHome.removeChild(loader)
      apiList.appendChild(ddList)
    })
}

function listCategory(info) {
  // const proxy="https://cors-anywhere.herokuapp.com/"
  const base='https://api.publicapis.org'  
  const category = encodeURI(`${base}/entries?category=${info}`)

  // console.log(category)
  fetch(proxy + category)
    .then(response => response.json())
    .then((data) => {
      console.log(data)
      data.entries.forEach((x) => {
        const dest = document.createElement('div')
        const span1 = document.createElement('span')
        const span2 = document.createElement('span')
        const span3 = document.createElement('span')
        const span4 = document.createElement('span')
        const span5 = document.createElement('span')
        const paragraph1 = document.createElement('p')
        const paragraph2 = document.createElement('p')
        const paragraph3 = document.createElement('p')
        const location = document.createElement('a')
        const separator = document.createElement('hr')
        location.href = x.Link
        location.innerHTML = x.Link
        location.target = 'apiView'
        span1.innerHTML = `${x.API}`
        span1.className = 'api'
        span2.innerHTML = (x.Auth) ? `Need <span class="authvalue">${x.Auth}</span> to access` : ''
        span2.className = 'auth'
        span3.innerHTML = (x.Cors) ? ((x.Cors === 'unknown') ? `Cors use ${x.Cors}` : '') : ''
        span3.className = 'cors'
        // span4.innerHTML = `HTTPS: ${x.HTTPS}`
        span4.innerHTML = (x.HTTPS) ? ` HTTPS ` : ''
        span4.className = 'https'
        span5.className = 'note'
        span5.innerHTML = "*Right click link and 'Open in New Tab or New Window'<br /> if iframe does not show page*"
        paragraph1.innerHTML = `${x.Description}`
        paragraph2.appendChild(location)
        paragraph3.appendChild(span5)
        dest.appendChild(span1)
        if (x.Auth) {
          dest.appendChild(span2)
        }
        dest.appendChild(span3)
        dest.appendChild(span4)
        dest.appendChild(paragraph1)
        dest.appendChild(paragraph2)
        // dest.appendChild(paragraph3)
        dest.appendChild(separator)
        document.querySelector('.results').appendChild(dest)

      })
    })
}

function clearResults() {
  let currentResultsDiv = document.querySelector('.results')
  if (currentResultsDiv){
    while (currentResultsDiv.firstChild) {
      currentResultsDiv.removeChild(currentResultsDiv.lastChild)
    }
  } else {
    const resultsDiv = document.createElement('div')
    resultsDiv.className = 'results'
    // document.body.appendChild(resultsDiv)
    mainHome.prepend(resultsDiv)
  }  
}

apiList.addEventListener('change', (e) => {
  clearResults()
  let index = e.target.selectedIndex
  // console.log(`Selected Value: ${JSON.stringify(e.target.selectedIndex)}`)
  // console.log(`Selected Value: ${e.target[index].text}`)
  listCategory(e.target[index].text)
})

window.addEventListener("message", (e) => {
  if (!(e.data !== "loading_success")) {
    console.log(e.data)
  }
})

listApis()