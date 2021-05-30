# Known issues
- Sometimes is saving the score if you have 0 or 1 WPM with accuracy 0% - must be tested more
- Can view the must logged in pages if you log out and press the back button on your browser (caused by react router)
- If user refreshes the page on `/speed/custom` will throw an error because `location.state` is undefined.
