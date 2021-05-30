# Known issues
- Can view the must logged in pages if you log out and press the back button on your browser (caused by react router)
- If user refreshes the page on `/speed/custom` will throw an error because `location.state` is undefined.
