# Weather App

A simple, selfish weather web app for Swampscott, MA that uses the Open Weather Map API.

## Update 2020

Revisiting this little app to update it to ES6 standards and notation. And we've moved house! So now we're requesting weather data for Swampscott.

It's kinda' cool to see this barebones little script still running after 4 years!

## Key

The key is provided to the script file via a simple export from a constants.js file (git-ignored for security). The format of the constants.js file is:

```javascript
const key = <grab a key string from the Open Weather MAP project and add it here>;
export { key };
```

Because we're using import/export here, you will need to set up a simple static server. I use `http-server`.
