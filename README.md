## Prerequisites
[NodeJS Installed](https://nodejs.org/en/download)


## How to use
Open a new terminal window and type
```
npm install
```

then type
```npm start```

enter student number


## Email setup
create a new .env file in this directory and insert the contents below
and enter your outlook email and password in the brackets <<>>
```
EMAIL_USERNAME=<<EMAIL>>
EMAIL_PASSWORD=<<PASSWORD>>
```

To change recipients of that email, you can modify the array in the index.js file
```
const SEND_TO_EMAILS = ["someemail@email.com"];
``` 