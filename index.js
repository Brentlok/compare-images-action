const core = require('@actions/core')
const fs = require('fs')
const { imgDiff } = require('img-diff-js')

(async () => {
    try {
        const diffPath = core.getInput('diff')
        const result = await imgDiff({
            actualFilename: core.getInput('image1'),
            expectedFilename: core.getInput('image2'),
            diffFilename: diffPath,
        })
    
        console.log('Images have been compared successfully! 🧙‍♂️')
        console.log('Difference:', result.diffCount)
    
        const image = new File([fs.readFileSync(diffPath)], diffPath)
        const form = new FormData()
        form.append('image', image)
    
        const res = await fetch('https://api.imgbb.com/1/upload?key=ef06d708b001aaa39a16650cbf37db29', {
            method: "POST",
            body: form
        })
    
        const data = await res.json()
        core.setOutput('imageURL', data.data.image.url)
    } catch (error) {
        core.setFailed(error.message)
    }    
})()
